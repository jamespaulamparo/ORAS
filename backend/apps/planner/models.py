from django.db import models
from django.conf import settings
from django.core.exceptions import ValidationError
from datetime import time

class Workspace(models.Model):
    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='workspaces'
    )
    session_key = models.CharField(max_length=64, null=True, blank=True, db_index=True)
    name = models.CharField(max_length=120, default='First Semester')
    academic_year_label = models.CharField(max_length=64, blank=True, default='')
    semester_label = models.CharField(max_length=64, blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']

    def __str__(self):
        return f"{self.name} ({self.owner or self.session_key or 'Guest'})"

class Course(models.Model):
    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='courses')
    course_code = models.CharField(max_length=32)
    course_title = models.CharField(max_length=200)
    units = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    color_key = models.CharField(max_length=32, blank=True, default='')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['course_code']

    def __str__(self):
        return f"{self.course_code}: {self.course_title}"

class Offering(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='offerings')
    section_code = models.CharField(max_length=64, blank=True, default='')
    instructor = models.CharField(max_length=120, blank=True, default='')
    default_room = models.CharField(max_length=64, blank=True, default='')
    source = models.CharField(max_length=16, default='manual')  # 'manual' or 'import'
    is_excluded = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['course__course_code', 'section_code']

    def __str__(self):
        return f"{self.course.course_code} - Section {self.section_code or 'Default'}"

class MeetingSession(models.Model):
    # Weekdays: 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat, 7=Sun
    DAY_CHOICES = [
        (1, 'Monday'),
        (2, 'Tuesday'),
        (3, 'Wednesday'),
        (4, 'Thursday'),
        (5, 'Friday'),
        (6, 'Saturday'),
        (7, 'Sunday'),
    ]

    offering = models.ForeignKey(Offering, on_delete=models.CASCADE, related_name='meeting_sessions')
    day_of_week = models.IntegerField(choices=DAY_CHOICES)
    start_time = models.TimeField()
    end_time = models.TimeField()
    room = models.CharField(max_length=64, blank=True, default='')
    meeting_type = models.CharField(max_length=32, blank=True, default='')  # Lecture, Lab, etc.
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['day_of_week', 'start_time']

    def clean(self):
        if self.start_time and self.end_time and self.end_time <= self.start_time:
            raise ValidationError({'end_time': 'End time must be after start time.'})

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

    def overlaps_with(self, other: 'MeetingSession') -> bool:
        """
        Half-open interval conflict check: [start, end)
        Two sessions conflict iff day is identical and a.start < b.end and b.start < a.end.
        Exact adjacency (a.end == b.start) is NOT a conflict.
        """
        if self.day_of_week != other.day_of_week:
            return False
        return self.start_time < other.end_time and other.start_time < self.end_time

class Schedule(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('saved', 'Saved'),
        ('preferred', 'Preferred'),
    ]

    workspace = models.ForeignKey(Workspace, on_delete=models.CASCADE, related_name='schedules')
    name = models.CharField(max_length=120, default='My Schedule')
    status = models.CharField(max_length=16, choices=STATUS_CHOICES, default='draft')
    is_preferred = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_preferred', '-updated_at']

    def __str__(self):
        return f"{self.name} ({self.workspace.name})"

class ScheduleSelection(models.Model):
    schedule = models.ForeignKey(Schedule, on_delete=models.CASCADE, related_name='selections')
    offering = models.ForeignKey(Offering, on_delete=models.CASCADE, related_name='selections')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = [['schedule', 'offering']]

    def clean(self):
        # A schedule should select at most one offering per course
        existing = ScheduleSelection.objects.filter(
            schedule=self.schedule,
            offering__course=self.offering.course
        ).exclude(pk=self.pk)
        if existing.exists():
            raise ValidationError("A schedule cannot select more than one offering for the same course.")

    def save(self, *args, **kwargs):
        self.clean()
        super().save(*args, **kwargs)

class UserPreference(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='preference'
    )
    session_key = models.CharField(max_length=64, null=True, blank=True, db_index=True)
    theme_key = models.CharField(max_length=32, default='leatherbound')
    time_format = models.CharField(max_length=8, default='12h')
    default_visible_start = models.TimeField(default=time(8, 0))
    default_visible_end = models.TimeField(default=time(17, 0))
    show_weekends = models.BooleanField(default=False)
    default_display_mode = models.CharField(max_length=32, default='standard')
    updated_at = models.DateTimeField(auto_now=True)
