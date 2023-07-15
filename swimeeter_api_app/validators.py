from django.core.exceptions import ValidationError
import re
import datetime

def meet_measure_unit_validator(unit):
    if unit != 'meters' and unit != 'yards':
        raise ValidationError("Pool measuring units must be one of: ['meters', 'yards']")
    
def swimmer_name_validator(name):
    if not re.match(r'^[A-Za-z \-\.\']*$', name):
        raise ValidationError("Names may only have characters matching '^[A-Za-z \-\.\\\']*$'")
    
def event_stroke_validator(stroke):
    strokes = ['butterfly', 'backstroke', 'breaststroke', 'freestyle', 'individual medley']
    if not stroke in strokes:
        raise ValidationError("Event strokes must be one of ['butterfly', 'backstroke', 'breaststroke', 'freestyle', 'individual medley']")
    
def event_distance_validator(distance):
    distances = [25, 50, 100, 200, 400, 500, 800, 1000, 1500, 1650]
    if not distance in distances:
        raise ValidationError("Event distances must be one of [25, 50, 100, 200, 400, 500, 800, 1000, 1500, 1650]")