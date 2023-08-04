from django.db import models
from django.core import validators
from . import validators as v
from swimeeter_auth_app.models import Host


class Meet(models.Model):
    # * meet info fields
    name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(1)]
    )
    begin_time = models.DateTimeField(null=True, blank=True)  # handled programmatically
    end_time = models.DateTimeField(null=True, blank=True)  # handled programmatically
    is_public = models.BooleanField()

    # * association fields
    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name="meets")

    # via association: swimmers, sessions, pools


class Pool(models.Model):
    # * general info fields
    name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(1)]
    )

    # * address info fields
    street_address = models.CharField(
        max_length=255, default="", blank=True, validators=[validators.MinLengthValidator(1)]
    )
    city = models.CharField(
        max_length=255, default="", blank=True, validators=[validators.MinLengthValidator(1)]
    )
    state = models.CharField(
        max_length=255, default="", blank=True, validators=[validators.MinLengthValidator(1)]
    )
    country = models.CharField(
        max_length=255, default="", blank=True, validators=[validators.MinLengthValidator(1)]
    )
    zipcode = models.CharField(
        max_length=255, default="", blank=True, validators=[validators.MinLengthValidator(1)]
    )

    # * pool specification fields
    lanes = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(3)]
    )
    side_length = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(1)]
    )
    measure_unit = models.CharField(max_length=255)

    # * association fields
    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="pools")

    # via association: sessions


class Session(models.Model):
    # * session info fields
    name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(1)]
    )
    begin_time = models.DateTimeField()
    end_time = models.DateTimeField()  # front-end check end_time >= begin_time

    # * association fields
    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="sessions")
    pool = models.ForeignKey(Pool, on_delete=models.RESTRICT, related_name="sessions")

    # via association: events


class Event(models.Model):
    # * competition info fields
    stroke = models.CharField(max_length=255)
    distance = models.PositiveSmallIntegerField()
    is_relay = models.BooleanField()
    swimmers_per_entry = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(1)]
    )
    stage = models.CharField(max_length=255)  # usually 'Prelim' or 'Final'

    # * competitor info fields
    competing_gender = models.CharField(max_length=255)
    competing_max_age = models.PositiveSmallIntegerField(
        null=True, blank=True
    )  # front-end check for max >= min
    competing_min_age = models.PositiveSmallIntegerField(null=True, blank=True)

    # * heat sheet fields
    order_in_session = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(1)]
    )
    total_heats = models.PositiveSmallIntegerField(
        null=True, blank=True
    )  # invalid assignments indicated by total_heats == null

    # * association fields
    session = models.ForeignKey(
        Session, on_delete=models.CASCADE, related_name="events"
    )

    # via association: individual_entries, relay_entries


class Team(models.Model):
    # * team info fields
    name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(1)]
    )
    acronym = models.CharField(
        max_length=255,
        validators=[
            v.team_acronym_validator,
            validators.MinLengthValidator(1),
        ],
    )

    # * association fields
    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="teams")

    # via association: swimmers


class Swimmer(models.Model):
    # * standard name fields
    first_name = models.CharField(
        max_length=255,
        validators=[v.swimmer_fl_name_validator, validators.MinLengthValidator(1)],
    )
    last_name = models.CharField(
        max_length=255,
        validators=[v.swimmer_fl_name_validator, validators.MinLengthValidator(1)],
    )

    # * special name fields
    prefix = models.CharField(
        max_length=255, default="", blank=True, validators=[v.swimmer_ps_fix_validator]
    )
    suffix = models.CharField(
        max_length=255, default="", blank=True, validators=[v.swimmer_ps_fix_validator]
    )
    middle_initials = models.CharField(
        max_length=255, default="", blank=True, validators=[v.swimmer_mi_validator]
    )

    # * demographic fields
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=255)

    # * association fields
    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="swimmers")
    team = models.ForeignKey(Team, on_delete=models.RESTRICT, related_name="swimmers")

    # via association: individual_entries, relay_entries, relay_assignments


class Individual_entry(models.Model):
    # * entry info fields
    seed_time = models.PositiveIntegerField()  # converted to a multiple of 0.01 seconds

    # * heat sheet fields
    heat_number = models.PositiveSmallIntegerField(
        null=True, blank=True
    )  # invalid assignment indicated by heat_number == null
    lane_number = models.PositiveSmallIntegerField(
        null=True, blank=True
    )  # invalid assignment indicated by lane_number == null

    # * association fields
    swimmer = models.ForeignKey(
        Swimmer, on_delete=models.CASCADE, related_name="individual_entries"
    )
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="individual_entries"
    )


class Relay_entry(models.Model):
    # * entry info fields
    seed_time = (
        models.PositiveIntegerField()
    )  # converted to a multiple of 0.01 seconds, sum of relay assignment splits

    # * heat sheet fields
    heat_number = models.PositiveSmallIntegerField(
        null=True, blank=True
    )  # invalid assignment indicated by heat_number == null
    lane_number = models.PositiveSmallIntegerField(
        null=True, blank=True
    )  # invalid assignment indicated by lane_number == null

    # * association fields
    swimmers = models.ManyToManyField(
        Swimmer,
        blank=True,
        through="Relay_assignment",
        related_name="relay_entries",
    )
    event = models.ForeignKey(
        Event, on_delete=models.CASCADE, related_name="relay_entries"
    )

    # via association: relay_assignments


# @ through table for swimmer <-> relay_entry many-to-many relationship
class Relay_assignment(models.Model):
    # * assignment info fields
    order_in_relay = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(1)]
    )
    seed_relay_split = (
        models.PositiveIntegerField()
    )  # converted to a multiple of 0.01 seconds

    # * association fields
    swimmer = models.ForeignKey(
        Swimmer, on_delete=models.CASCADE, related_name="relay_assignments"
    )
    relay_entry = models.ForeignKey(
        Relay_entry, on_delete=models.CASCADE, related_name="relay_assignments"
    )
