from django.urls import path
from .views import (
    current_workspace_view, workspace_list_create_view,
    course_list_create_view, course_detail_view,
    offering_list_view, offering_create_view, offering_detail_view,
    schedule_list_create_view, schedule_detail_view, schedule_duplicate_view,
    check_conflicts_view
)

urlpatterns = [
    # Workspaces
    path('workspaces/current/', current_workspace_view, name='workspace_current'),
    path('workspaces/', workspace_list_create_view, name='workspace_list_create'),

    # Courses
    path('workspaces/<int:workspace_id>/courses/', course_list_create_view, name='course_list_create'),
    path('courses/<int:pk>/', course_detail_view, name='course_detail'),

    # Offerings
    path('workspaces/<int:workspace_id>/offerings/', offering_list_view, name='offering_list'),
    path('courses/<int:course_id>/offerings/', offering_create_view, name='offering_create'),
    path('offerings/<int:pk>/', offering_detail_view, name='offering_detail'),

    # Schedules
    path('workspaces/<int:workspace_id>/schedules/', schedule_list_create_view, name='schedule_list_create'),
    path('schedules/<int:pk>/', schedule_detail_view, name='schedule_detail'),
    path('schedules/<int:pk>/duplicate/', schedule_duplicate_view, name='schedule_duplicate'),

    # Conflict checking
    path('workspaces/<int:workspace_id>/check-conflicts/', check_conflicts_view, name='check_conflicts'),
]
