from django.db import models
from django.core import validators
import validators as v
from swimeeter_auth_app.models import Host

class Meet(models.Model):
    name = models.CharField(max_length=255)
    lanes = models.PositiveSmallIntegerField(validators=[validators.MinValueValidator(3), validators.MaxValueValidator(10)])
    measure_unit = models.CharField(max_length=50, validators=[v.meet_measure_unit_validator])

    host = models.ForeignKey(Host, on_delete=models.CASCADE, related_name="meets")

    # via association: swimmers, events

class Swimmer(models.Model):
    first_name = models.CharField(max_length=255, validators=[v.swimmer_name_validator])
    last_name = models.CharField(max_length=255, validators=[v.swimmer_name_validator])
    age = models.PositiveSmallIntegerField()
    gender = models.CharField(max_length=50)
    team = models.CharField(max_length=255)

    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="swimmers")

    # via association: entries

class Event(models.Model):
    stroke = models.CharField(max_length=50, validators=[v.event_stroke_validator])
    distance = models.PositiveSmallIntegerField(validators=[v.event_distance_validator])
    competing_gender = models.CharField(max_length=50)
    competing_max_age = models.PositiveSmallIntegerField() # front-end check for max >= min
    competing_min_age = models.PositiveSmallIntegerField()

    meet = models.ForeignKey(Meet, on_delete=models.CASCADE, related_name="events")

    # via association: entries, heats

class Heat(models.Model):
    order_in_event = models.PositiveSmallIntegerField(validators=[validators.MinValueValidator(1)])

    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="heats")

    # via association: assignments

class Entry(models.Model):
    seed_time = models.PositiveIntegerField() # converted to a multiple of 0.01 seconds

    swimmer = models.ForeignKey(Swimmer, on_delete=models.CASCADE, related_name="entries")
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name="entries")

    # via association: assignment

class HeatLaneAssignment(models.Model):
    lane = models.PositiveSmallIntegerField(validators=[validators.MinValueValidator(1)])

    heat = models.ForeignKey(Heat, on_delete=models.CASCADE, related_name="assignments")
    entry = models.OneToOneField(Entry, on_delete=models.CASCADE, related_name="assignment")