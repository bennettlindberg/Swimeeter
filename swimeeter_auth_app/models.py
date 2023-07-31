from django.db import models
from django.core import validators
from . import validators as v
from django.contrib.auth.models import AbstractUser


class Host(AbstractUser):
    # * host info fields
    email = models.EmailField(max_length=255, unique=True)

    # * standard name fields
    first_name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(1), v.host_fl_name_validator]
    )
    last_name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(1), v.host_fl_name_validator]
    )

    # * special name fields
    prefix = models.CharField(
        max_length=255, default="", blank=True, validators=[v.host_ps_fix_validator]
    )
    suffix = models.CharField(
        max_length=255, default="", blank=True, validators=[v.host_ps_fix_validator]
    )
    middle_initials = models.CharField(
        max_length=255, default="", blank=True, validators=[v.host_mi_validator]
    )

    # * settings fields
    screen_mode = models.CharField(
        max_length=255, validators=[v.host_screen_validator]
    )
    data_entry_information = models.BooleanField()
    destructive_action_confirms = models.BooleanField()
    motion_safe = models.BooleanField()

    # ~ special
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []  # automatically: username and password

    # via association: meets
