from rest_framework import serializers
from .models import Workspace, Course, Offering, MeetingSession, Schedule, ScheduleSelection, UserPreference

class MeetingSessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MeetingSession
        fields = ['id', 'day_of_week', 'start_time', 'end_time', 'room', 'meeting_type']

class OfferingSerializer(serializers.ModelSerializer):
    meeting_sessions = MeetingSessionSerializer(many=True, required=False)
    course_code = serializers.CharField(source='course.course_code', read_only=True)
    course_title = serializers.CharField(source='course.course_title', read_only=True)
    course_units = serializers.DecimalField(source='course.units', max_digits=4, decimal_places=1, read_only=True)
    course_color = serializers.CharField(source='course.color_key', read_only=True)

    class Meta:
        model = Offering
        fields = [
            'id', 'course', 'course_code', 'course_title', 'course_units', 'course_color',
            'section_code', 'instructor', 'default_room', 'source', 'is_excluded',
            'meeting_sessions', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def create(self, validated_data):
        sessions_data = self.context.get('request').data.get('meeting_sessions', [])
        offering = Offering.objects.create(**validated_data)
        for s_data in sessions_data:
            MeetingSession.objects.create(offering=offering, **s_data)
        return offering

    def update(self, instance, validated_data):
        sessions_data = self.context.get('request').data.get('meeting_sessions')
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if sessions_data is not None:
            instance.meeting_sessions.all().delete()
            for s_data in sessions_data:
                MeetingSession.objects.create(
                    offering=instance,
                    day_of_week=s_data['day_of_week'],
                    start_time=s_data['start_time'],
                    end_time=s_data['end_time'],
                    room=s_data.get('room', ''),
                    meeting_type=s_data.get('meeting_type', ''),
                )
        return instance

class CourseSerializer(serializers.ModelSerializer):
    offerings = OfferingSerializer(many=True, read_only=True)

    class Meta:
        model = Course
        fields = ['id', 'workspace', 'course_code', 'course_title', 'units', 'color_key', 'notes', 'offerings', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ScheduleSelectionSerializer(serializers.ModelSerializer):
    offering = OfferingSerializer(read_only=True)
    offering_id = serializers.PrimaryKeyRelatedField(
        queryset=Offering.objects.all(), source='offering', write_only=True
    )

    class Meta:
        model = ScheduleSelection
        fields = ['id', 'schedule', 'offering', 'offering_id', 'created_at']
        read_only_fields = ['id', 'created_at']

class ScheduleSerializer(serializers.ModelSerializer):
    selections = ScheduleSelectionSerializer(many=True, read_only=True)
    offering_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = Schedule
        fields = ['id', 'workspace', 'name', 'status', 'is_preferred', 'selections', 'offering_ids', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class WorkspaceSerializer(serializers.ModelSerializer):
    courses = CourseSerializer(many=True, read_only=True)
    schedules = ScheduleSerializer(many=True, read_only=True)

    class Meta:
        model = Workspace
        fields = ['id', 'name', 'academic_year_label', 'semester_label', 'courses', 'schedules', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class UserPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserPreference
        fields = ['id', 'theme_key', 'time_format', 'default_visible_start', 'default_visible_end', 'show_weekends', 'default_display_mode']
        read_only_fields = ['id']
