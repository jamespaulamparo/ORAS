from django.contrib.auth import get_user_model
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

User = get_user_model()

class AuthTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = reverse('auth_register')
        self.login_url = reverse('auth_login')
        self.logout_url = reverse('auth_logout')
        self.me_url = reverse('auth_me')

    def test_register_success(self):
        data = {
            'username': 'student1',
            'email': 'student1@university.edu',
            'password': 'SecurePassword123!',
            'password_confirm': 'SecurePassword123!',
            'first_name': 'Jane',
            'last_name': 'Doe'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['username'], 'student1')
        self.assertEqual(response.data['email'], 'student1@university.edu')
        self.assertTrue(User.objects.filter(username='student1').exists())

    def test_register_password_mismatch(self):
        data = {
            'username': 'student2',
            'email': 'student2@university.edu',
            'password': 'Password123!',
            'password_confirm': 'DifferentPassword123!'
        }
        response = self.client.post(self.register_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', response.data)

    def test_login_and_me(self):
        User.objects.create_user(
            username='student_login',
            email='login@university.edu',
            password='MyPassword123!'
        )
        login_res = self.client.post(self.login_url, {
            'username': 'student_login',
            'password': 'MyPassword123!'
        }, format='json')
        self.assertEqual(login_res.status_code, status.HTTP_200_OK)

        # Test authenticated me
        me_res = self.client.get(self.me_url)
        self.assertEqual(me_res.status_code, status.HTTP_200_OK)
        self.assertEqual(me_res.data['username'], 'student_login')

    def test_unauthenticated_me_denied(self):
        response = self.client.get(self.me_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_logout(self):
        User.objects.create_user(
            username='student_logout',
            email='logout@university.edu',
            password='MyPassword123!'
        )
        self.client.post(self.login_url, {
            'username': 'student_logout',
            'password': 'MyPassword123!'
        }, format='json')
        
        logout_res = self.client.post(self.logout_url)
        self.assertEqual(logout_res.status_code, status.HTTP_200_OK)

        # After logout, me should be forbidden
        me_res = self.client.get(self.me_url)
        self.assertEqual(me_res.status_code, status.HTTP_403_FORBIDDEN)
