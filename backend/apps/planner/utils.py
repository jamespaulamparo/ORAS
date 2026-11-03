from typing import List, Dict, Any, Tuple
from django.db.models import QuerySet
from .models import Workspace, Offering, MeetingSession

DAY_NAMES = {
    1: 'Monday',
    2: 'Tuesday',
    3: 'Wednesday',
    4: 'Thursday',
    5: 'Friday',
    6: 'Saturday',
    7: 'Sunday',
}

def get_or_create_current_workspace(request) -> Workspace:
    """
    Resolves the active workspace for either an authenticated user or a guest student session.
    Guarantees that a valid workspace is returned.
    """
    if request.user.is_authenticated:
        ws = Workspace.objects.filter(owner=request.user).first()
        if not ws:
            ws = Workspace.objects.create(
                owner=request.user,
                name='First Semester 2026–2027'
            )
        return ws
    else:
        if not request.session.session_key:
            request.session.save()
        key = request.session.session_key
        ws = Workspace.objects.filter(session_key=key).first()
        if not ws:
            ws = Workspace.objects.create(
                session_key=key,
                name='Guest Timetable'
            )
        return ws

def detect_offering_conflicts(offerings: List[Offering]) -> List[Dict[str, Any]]:
    """
    Examines a collection of offerings and identifies any time conflicts
    based on the exact half-open interval rule: a.start < b.end and b.start < a.end.
    Returns clear, human-readable explanations.
    """
    conflicts = []
    
    # Collect all meeting sessions with their parent course info
    session_items = []
    for off in offerings:
        for s in off.meeting_sessions.all():
            session_items.append({
                'session': s,
                'offering_id': off.id,
                'course_code': off.course.course_code,
                'course_title': off.course.course_title,
                'section_code': off.section_code,
            })

    # Compare all pairs (i < j)
    for i in range(len(session_items)):
        for j in range(i + 1, len(session_items)):
            item_a = session_items[i]
            item_b = session_items[j]

            # Same offering cannot conflict with itself
            if item_a['offering_id'] == item_b['offering_id']:
                continue

            sa = item_a['session']
            sb = item_b['session']

            if sa.day_of_week == sb.day_of_week:
                # Half-open interval check
                if sa.start_time < sb.end_time and sb.start_time < sa.end_time:
                    # Calculate overlapping window
                    overlap_start = max(sa.start_time, sb.start_time)
                    overlap_end = min(sa.end_time, sb.end_time)
                    day_name = DAY_NAMES.get(sa.day_of_week, f"Day {sa.day_of_week}")
                    
                    start_str = overlap_start.strftime("%I:%M %p").lstrip('0')
                    end_str = overlap_end.strftime("%I:%M %p").lstrip('0')

                    message = (
                        f"{item_a['course_code']} overlaps with {item_b['course_code']} "
                        f"on {day_name} from {start_str} to {end_str}."
                    )

                    conflicts.append({
                        'offering_a_id': item_a['offering_id'],
                        'offering_b_id': item_b['offering_id'],
                        'course_a': item_a['course_code'],
                        'course_b': item_b['course_code'],
                        'day_of_week': sa.day_of_week,
                        'day_name': day_name,
                        'overlap_start': overlap_start.strftime("%H:%M"),
                        'overlap_end': overlap_end.strftime("%H:%M"),
                        'message': message,
                    })

    return conflicts
