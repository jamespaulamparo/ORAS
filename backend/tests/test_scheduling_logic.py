from datetime import time
from django.test import TestCase
from django.core.exceptions import ValidationError
from apps.planner.models import Workspace, Course, Offering, MeetingSession
from apps.planner.utils import detect_offering_conflicts

class SchedulingLogicTests(TestCase):
    def setUp(self):
        self.workspace = Workspace.objects.create(name='Test Term')
        self.course_a = Course.objects.create(
            workspace=self.workspace,
            course_code='CS 101',
            course_title='Intro to Programming'
        )
        self.course_b = Course.objects.create(
            workspace=self.workspace,
            course_code='MATH 101',
            course_title='Calculus I'
        )

    def test_half_open_interval_overlap(self):
        """09:00-10:30 overlaps with 10:00-11:30 on Monday."""
        off_a = Offering.objects.create(course=self.course_a, section_code='A')
        s_a = MeetingSession.objects.create(
            offering=off_a,
            day_of_week=1,
            start_time=time(9, 0),
            end_time=time(10, 30)
        )

        off_b = Offering.objects.create(course=self.course_b, section_code='B')
        s_b = MeetingSession.objects.create(
            offering=off_b,
            day_of_week=1,
            start_time=time(10, 0),
            end_time=time(11, 30)
        )

        self.assertTrue(s_a.overlaps_with(s_b))
        self.assertTrue(s_b.overlaps_with(s_a))

        conflicts = detect_offering_conflicts([off_a, off_b])
        self.assertEqual(len(conflicts), 1)
        self.assertIn("CS 101 overlaps with MATH 101", conflicts[0]['message'])

    def test_exact_adjacency_is_not_a_conflict(self):
        """09:00-10:00 and 10:00-11:00 on Monday must NOT conflict."""
        off_a = Offering.objects.create(course=self.course_a, section_code='A')
        s_a = MeetingSession.objects.create(
            offering=off_a,
            day_of_week=1,
            start_time=time(9, 0),
            end_time=time(10, 0)
        )

        off_b = Offering.objects.create(course=self.course_b, section_code='B')
        s_b = MeetingSession.objects.create(
            offering=off_b,
            day_of_week=1,
            start_time=time(10, 0),
            end_time=time(11, 0)
        )

        self.assertFalse(s_a.overlaps_with(s_b))
        self.assertFalse(s_b.overlaps_with(s_a))

        conflicts = detect_offering_conflicts([off_a, off_b])
        self.assertEqual(len(conflicts), 0)

    def test_different_weekdays_do_not_conflict(self):
        """Same time on Monday vs Tuesday does NOT conflict."""
        off_a = Offering.objects.create(course=self.course_a, section_code='A')
        s_a = MeetingSession.objects.create(
            offering=off_a,
            day_of_week=1, # Monday
            start_time=time(9, 0),
            end_time=time(10, 30)
        )

        off_b = Offering.objects.create(course=self.course_b, section_code='B')
        s_b = MeetingSession.objects.create(
            offering=off_b,
            day_of_week=2, # Tuesday
            start_time=time(9, 0),
            end_time=time(10, 30)
        )

        self.assertFalse(s_a.overlaps_with(s_b))
        conflicts = detect_offering_conflicts([off_a, off_b])
        self.assertEqual(len(conflicts), 0)

    def test_multi_session_offering_conflict(self):
        """
        Course A meets Mon and Wed 8-9:30.
        Course B meets Wed and Fri 9:00-10:30.
        They conflict specifically on Wednesday.
        """
        off_a = Offering.objects.create(course=self.course_a, section_code='A')
        MeetingSession.objects.create(offering=off_a, day_of_week=1, start_time=time(8, 0), end_time=time(9, 30))
        MeetingSession.objects.create(offering=off_a, day_of_week=3, start_time=time(8, 0), end_time=time(9, 30))

        off_b = Offering.objects.create(course=self.course_b, section_code='B')
        MeetingSession.objects.create(offering=off_b, day_of_week=3, start_time=time(9, 0), end_time=time(10, 30))
        MeetingSession.objects.create(offering=off_b, day_of_week=5, start_time=time(9, 0), end_time=time(10, 30))

        conflicts = detect_offering_conflicts([off_a, off_b])
        self.assertEqual(len(conflicts), 1)
        self.assertEqual(conflicts[0]['day_of_week'], 3)
        self.assertEqual(conflicts[0]['day_name'], 'Wednesday')

    def test_end_time_before_or_equal_start_time_raises_error(self):
        """End time equal or prior to start time must be rejected."""
        off = Offering.objects.create(course=self.course_a, section_code='A')
        with self.assertRaises(ValidationError):
            MeetingSession.objects.create(
                offering=off,
                day_of_week=1,
                start_time=time(10, 0),
                end_time=time(10, 0)
            )

        with self.assertRaises(ValidationError):
            MeetingSession.objects.create(
                offering=off,
                day_of_week=1,
                start_time=time(14, 0),
                end_time=time(13, 0)
            )

    def test_schedule_duplication(self):
        """Duplicating a schedule should copy all selections to a new independent schedule."""
        from apps.planner.models import Schedule, ScheduleSelection
        off_a = Offering.objects.create(course=self.course_a, section_code='A')
        original = Schedule.objects.create(workspace=self.workspace, name='Primary')
        ScheduleSelection.objects.create(schedule=original, offering=off_a)

        copy = Schedule.objects.create(
            workspace=original.workspace,
            name=f"{original.name} (Copy)"
        )
        for sel in original.selections.all():
            ScheduleSelection.objects.create(schedule=copy, offering=sel.offering)

        self.assertEqual(Schedule.objects.filter(workspace=self.workspace).count(), 2)
        self.assertEqual(copy.selections.count(), 1)
        self.assertEqual(copy.selections.first().offering, off_a)

    def test_offering_deletion_cleans_empty_parent_course(self):
        """Deleting the only offering of a course should cascade and clean up the parent course."""
        off_a = Offering.objects.create(course=self.course_a, section_code='A')
        course_id = self.course_a.id
        off_a.delete()
        if Course.objects.get(id=course_id).offerings.count() == 0:
            Course.objects.get(id=course_id).delete()

        self.assertFalse(Course.objects.filter(id=course_id).exists())
