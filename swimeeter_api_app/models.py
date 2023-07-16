from django.db import models
from django.core import validators
from . import validators as v
from swimeeter_auth_app.models import Host


class Meet(models.Model):
    # * meet info fields
    name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(1)]
    )
    is_public = models.BooleanField()

    # * pool info fields
    lanes = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(3)]
    )
    side_length = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(1)]
    )
    measure_unit = models.CharField(max_length=255)

    # * association fields
    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name="meets")

    # via association: swimmers, sessions


class Session(models.Model):
    # * session info fields
    name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(1)]
    )
    begin_time = models.DateTimeField()
    end_time = models.DateTimeField()  # front-end check end_time >= begin_time

    # * association fields
    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="sessions")

    # via association: events


class Event(models.Model):
    # * competition info fields
    stroke = models.CharField(max_length=255)
    distance = models.PositiveSmallIntegerField()
    is_relay = models.BooleanField()

    # * competitor info fields
    competing_gender = models.CharField(max_length=255)
    competing_max_age = (
        models.PositiveSmallIntegerField()
    )  # front-end check for max >= min
    competing_min_age = models.PositiveSmallIntegerField()

    # * heat sheet fields
    order_in_session = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(1)]
    )
    total_heats = (
        models.PositiveSmallIntegerField()
    )  # ! invalid assignments indicated by total_heats == 0

    # * association fields
    session = models.ForeignKey(
        Session, on_delete=models.CASCADE, related_name="events"
    )

    # via association: entries


class Swimmer(models.Model):
    # * standard name fields
    first_name = models.CharField(
        max_length=255,
        validators=[v.swimmer_fl_name_validator(), validators.MinLengthValidator(1)],
    )
    last_name = models.CharField(
        max_length=255,
        validators=[v.swimmer_fl_name_validator(), validators.MinLengthValidator(1)],
    )

    # * special name fields
    prefix = models.CharField(
        max_length=255, default="", validators=[v.swimmer_ps_fix_validator()]
    )
    suffix = models.CharField(
        max_length=255, default="", validators=[v.swimmer_ps_fix_validator()]
    )
    middle_initials = models.CharField(
        max_length=255, default="", validators=[v.swimmer_mi_validator()]
    )

    # * other info fields
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=255)
    team_name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(1)]
    )
    team_acronym = models.CharField(
        max_length=255,
        validators=[
            v.swimmer_team_acronym_validator(),
            validators.MinLengthValidator(1),
        ],
    )

    # * association fields
    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="swimmers")

    # via association: entries


class Individual_entry(models.Model):
    # * entry info fields
    seed_time = models.PositiveIntegerField()  # converted to a multiple of 0.01 seconds

    # * heat sheet fields
    heat_number = (
        models.PositiveSmallIntegerField()
    )  # ! invalid assignment indicated by heat_number == 0
    lane_number = (
        models.PositiveSmallIntegerField()
    )  # ! invalid assignment indicated by lane_number == 0

    # * association fields
    swimmer = models.ForeignKey(
        Swimmer, on_delete=models.CASCADE, related_name="individual_entries"
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="entries")


class Relay_entry(models.Model):
    # * entry info fields
    seed_time = models.PositiveIntegerField()  # converted to a multiple of 0.01 seconds

    # * heat sheet fields
    heat_number = (
        models.PositiveSmallIntegerField()
    )  # ! invalid assignment indicated by heat_number == 0
    lane_number = (
        models.PositiveSmallIntegerField()
    )  # ! invalid assignment indicated by lane_number == 0

    # * association fields
    swimmer = models.ManyToManyField(
        Swimmer, on_delete=models.CASCADE, related_name="relay_entries"
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="entries")
