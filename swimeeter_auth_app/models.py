from django.db import models
from django.contrib.auth.models import AbstractUser

class Host(AbstractUser):
    email = models.EmailField(max_length=255, unique=True)
    first_name = models.CharField(max_length=255)
    last_name = models.CharField(max_length=255)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [first_name, last_name] # automatically: username and password

    # via association: meets