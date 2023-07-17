from django.core.exceptions import ValidationError
import re
import datetime
    
def swimmer_fl_name_validator(name):
    if not re.match(r'^[A-Za-z \-\']*$', name):
        raise ValidationError("First and last names may only have characters matching '^[A-Za-z \-\\\']*$'")
    
def swimmer_ps_fix_validator(fix):
    if not re.match(r'^[A-Za-z\-\.\']*$', fix):
        raise ValidationError("First and last names may only have characters matching '^[A-Za-z\-\.\\\']*$'")
    
def swimmer_mi_validator(initials):
    if not re.match(r'^[A-Z ]*$', initials):
        raise ValidationError("Middle initials may only have characters matching '^[A-Z ]*$'")
    
def swimmer_team_acronym_validator(initials):
    if not re.match(r'^[A-Z]+$', initials):
        raise ValidationError("Team acronyms may only have characters matching '^[A-Z]+$'")