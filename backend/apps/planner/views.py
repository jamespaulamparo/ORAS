from rest_framework import viewsets, status, permissions
from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction

from .models import Workspace, Course, Offering, MeetingSession, Schedule, ScheduleSelection, UserPreference
from .serializers import (
    WorkspaceSerializer, CourseSerializer, OfferingSerializer,
    ScheduleSerializer, UserPreferenceSerializer
)
from .utils import get_or_create_current_workspace, detect_offering_conflicts

class BaseOwnerPermission(permissions.BasePermission):
    """Permit access if object belongs to authenticated user or matching session."""
    def has_object_permission(self, request, view, obj):
        workspace = getattr(obj, 'workspace', None)
        if workspace is None and hasattr(obj, 'course'):
            workspace = obj.course.workspace
        if workspace is None and isinstance(obj, Workspace):
            workspace = obj

        if workspace:
            if request.user.is_authenticated:
                return workspace.owner == request.user
            if request.session.session_key:
                return workspace.session_key == request.session.session_key
        return True

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def current_workspace_view(request):
    """Returns the active workspace, creating one seamlessly if needed."""
    ws = get_or_create_current_workspace(request)
    serializer = WorkspaceSerializer(ws)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def workspace_list_create_view(request):
    if request.method == 'GET':
        if request.user.is_authenticated:
            workspaces = Workspace.objects.filter(owner=request.user)
        else:
            if not request.session.session_key:
                request.session.save()
            workspaces = Workspace.objects.filter(session_key=request.session.session_key)
        return Response(WorkspaceSerializer(workspaces, many=True).data)

    elif request.method == 'POST':
        name = request.data.get('name', 'New Semester')
        ay = request.data.get('academic_year_label', '')
        sem = request.data.get('semester_label', '')
        if request.user.is_authenticated:
            ws = Workspace.objects.create(owner=request.user, name=name, academic_year_label=ay, semester_label=sem)
        else:
            if not request.session.session_key:
                request.session.save()
            ws = Workspace.objects.create(session_key=request.session.session_key, name=name, academic_year_label=ay, semester_label=sem)
        return Response(WorkspaceSerializer(ws).data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def course_list_create_view(request, workspace_id):
    ws = get_object_or_404(Workspace, pk=workspace_id)
    if request.method == 'GET':
        courses = Course.objects.filter(workspace=ws)
        return Response(CourseSerializer(courses, many=True).data)

    elif request.method == 'POST':
        # Create course + initial section + sessions in one transaction
        data = request.data
        with transaction.atomic():
            course = Course.objects.create(
                workspace=ws,
                course_code=data.get('course_code', '').strip().upper(),
                course_title=data.get('course_title', '').strip(),
                units=data.get('units') or None,
                color_key=data.get('color_key', ''),
                notes=data.get('notes', '')
            )
            # Create section offering if sessions provided or section name provided
            sessions_data = data.get('meeting_sessions', [])
            section_code = data.get('section_code', 'A')
            instructor = data.get('instructor', '')
            room = data.get('default_room', '')

            offering = Offering.objects.create(
                course=course,
                section_code=section_code,
                instructor=instructor,
                default_room=room,
                source='manual'
            )

            for s in sessions_data:
                MeetingSession.objects.create(
                    offering=offering,
                    day_of_week=int(s['day_of_week']),
                    start_time=s['start_time'],
                    end_time=s['end_time'],
                    room=s.get('room', room),
                    meeting_type=s.get('meeting_type', 'Lecture')
                )

        return Response(CourseSerializer(course).data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def course_detail_view(request, pk):
    course = get_object_or_404(Course, pk=pk)
    if request.method == 'GET':
        return Response(CourseSerializer(course).data)
    elif request.method == 'PATCH':
        serializer = CourseSerializer(course, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'DELETE':
        course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def offering_list_view(request, workspace_id):
    ws = get_object_or_404(Workspace, pk=workspace_id)
    offerings = Offering.objects.filter(course__workspace=ws)
    return Response(OfferingSerializer(offerings, many=True).data)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def offering_create_view(request, course_id):
    course = get_object_or_404(Course, pk=course_id)
    serializer = OfferingSerializer(data=request.data, context={'request': request})
    if serializer.is_valid():
        offering = serializer.save(course=course)
        return Response(OfferingSerializer(offering).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def offering_detail_view(request, pk):
    offering = get_object_or_404(Offering, pk=pk)
    if request.method == 'GET':
        return Response(OfferingSerializer(offering).data)
    elif request.method == 'PATCH':
        data = request.data
        with transaction.atomic():
            # Update parent course fields if provided
            course = offering.course
            if 'course_code' in data and data['course_code']:
                course.course_code = data['course_code'].strip().upper()
            if 'course_title' in data and data['course_title']:
                course.course_title = data['course_title'].strip()
            if 'units' in data:
                course.units = data['units'] or None
            if 'color_key' in data:
                course.color_key = data['color_key']
            course.save()

            # Update offering fields
            if 'section_code' in data:
                offering.section_code = data['section_code']
            if 'instructor' in data:
                offering.instructor = data['instructor']
            if 'default_room' in data:
                offering.default_room = data['default_room']
            offering.save()

            # Update sessions if provided
            if 'meeting_sessions' in data:
                sessions_data = data['meeting_sessions']
                offering.meeting_sessions.all().delete()
                for s in sessions_data:
                    MeetingSession.objects.create(
                        offering=offering,
                        day_of_week=int(s['day_of_week']),
                        start_time=s['start_time'],
                        end_time=s['end_time'],
                        room=s.get('room', '') or offering.default_room,
                        meeting_type=s.get('meeting_type', 'Lecture')
                    )
        return Response(OfferingSerializer(offering).data)
    elif request.method == 'DELETE':
        course = offering.course
        offering.delete()
        if course.offerings.count() == 0:
            course.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def check_conflicts_view(request, workspace_id):
    """
    Evaluates a set of offering IDs for interval overlaps using half-open semantics.
    """
    offering_ids = request.data.get('offering_ids', [])
    offerings = list(Offering.objects.filter(id__in=offering_ids, course__workspace_id=workspace_id))
    conflicts = detect_offering_conflicts(offerings)
    return Response({
        'has_conflicts': len(conflicts) > 0,
        'conflict_count': len(conflicts),
        'conflicts': conflicts
    })

@api_view(['GET', 'POST'])
@permission_classes([permissions.AllowAny])
def schedule_list_create_view(request, workspace_id):
    ws = get_object_or_404(Workspace, pk=workspace_id)
    if request.method == 'GET':
        schedules = Schedule.objects.filter(workspace=ws)
        return Response(ScheduleSerializer(schedules, many=True).data)

    elif request.method == 'POST':
        name = request.data.get('name', 'My Timetable')
        offering_ids = request.data.get('offering_ids', [])
        with transaction.atomic():
            schedule = Schedule.objects.create(workspace=ws, name=name)
            for oid in offering_ids:
                off = Offering.objects.filter(id=oid, course__workspace=ws).first()
                if off:
                    ScheduleSelection.objects.create(schedule=schedule, offering=off)
        return Response(ScheduleSerializer(schedule).data, status=status.HTTP_201_CREATED)

@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([permissions.AllowAny])
def schedule_detail_view(request, pk):
    schedule = get_object_or_404(Schedule, pk=pk)
    if request.method == 'GET':
        return Response(ScheduleSerializer(schedule).data)
    elif request.method == 'PATCH':
        name = request.data.get('name')
        if name:
            schedule.name = name
        is_pref = request.data.get('is_preferred')
        if is_pref is not None:
            if is_pref:
                Schedule.objects.filter(workspace=schedule.workspace).update(is_preferred=False)
            schedule.is_preferred = is_pref
        
        # Update offering selections if provided
        offering_ids = request.data.get('offering_ids')
        if offering_ids is not None:
            schedule.selections.all().delete()
            for oid in offering_ids:
                off = Offering.objects.filter(id=oid, course__workspace=schedule.workspace).first()
                if off:
                    ScheduleSelection.objects.create(schedule=schedule, offering=off)
        schedule.save()
        return Response(ScheduleSerializer(schedule).data)
    elif request.method == 'DELETE':
        schedule.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def schedule_duplicate_view(request, pk):
    original = get_object_or_404(Schedule, pk=pk)
    with transaction.atomic():
        copy = Schedule.objects.create(
            workspace=original.workspace,
            name=f"{original.name} (Copy)",
            status='draft',
            is_preferred=False
        )
        for sel in original.selections.all():
            ScheduleSelection.objects.create(schedule=copy, offering=sel.offering)
    return Response(ScheduleSerializer(copy).data, status=status.HTTP_201_CREATED)
