from django.db import models
from django.core import validators
from . import validators as v
from swimeeter_auth_app.models import Host


class Meet(models.Model):
    # * meet fields
    name = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(2)]
    )
    begin_date = models.DateField()
    end_date = models.DateField() # front-end check end_date >= begin_date

    # * pool fields
    lanes = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(3), validators.MaxValueValidator(10)]
    )
    measure_unit = models.CharField(
        max_length=50, validators=[v.meet_measure_unit_validator]
    )

    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name="meets")

    # via association: swimmers, events


class Swimmer(models.Model):
    first_name = models.CharField(
        max_length=255,
        validators=[v.swimmer_name_validator, validators.MinLengthValidator(2)],
    )
    last_name = models.CharField(
        max_length=255,
        validators=[v.swimmer_name_validator, validators.MinLengthValidator(2)],
    )
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=50)
    team = models.CharField(
        max_length=255, validators=[validators.MinLengthValidator(2)]
    )

    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="swimmers")

    # via association: entries


class Event(models.Model):
    stroke = models.CharField(max_length=50, validators=[v.event_stroke_validator])
    distance = models.PositiveSmallIntegerField(validators=[v.event_distance_validator])
    competing_gender = models.CharField(max_length=50)
    competing_max_age = (
        models.PositiveSmallIntegerField()
    )  # front-end check for max >= min
    competing_min_age = models.PositiveSmallIntegerField()

    # * heat sheet fields
    order_in_meet = models.PositiveSmallIntegerField(
        validators=[validators.MinValueValidator(1)]
    )
    total_heats = (
        models.PositiveSmallIntegerField()
    )  # ! invalid assignments indicated by total_heats == 0

    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="events")

    # via association: entries


class Entry(models.Model):
    seed_time = models.PositiveIntegerField()  # converted to a multiple of 0.01 seconds

    # * heat sheet fields
    heat_number = (
        models.PositiveSmallIntegerField()
    )  # ! invalid assignment indicated by heat_number == 0
    lane_number = (
        models.PositiveSmallIntegerField()
    )  # ! invalid assignment indicated by lane_number == 0

    swimmer = models.ForeignKey(
        Swimmer, on_delete=models.CASCADE, related_name="entries"
    )
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="entries")
