from django.urls import path, re_path
from apps.accounts.api.views import (
    RegisterView,
    LoginView,
    LogoutView,
    ProfileView,
    AdminUserListView,
)

urlpatterns = [
    re_path(r"^auth/register/?$", RegisterView.as_view(), name="register"),
    re_path(r"^auth/login/?$", LoginView.as_view(), name="login"),
    re_path(r"^auth/logout/?$", LogoutView.as_view(), name="logout"),
    re_path(r"^profile/?$", ProfileView.as_view(), name="profile"),
    re_path(r"^admin/users/?$", AdminUserListView.as_view(), name="admin-user-list"),
]
