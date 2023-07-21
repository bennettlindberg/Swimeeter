from django.core.exceptions import ValidationError
import re

def host_fl_name_validator(name):
    if not re.match(r'^[A-Za-z \-\']*$', name):
        raise ValidationError("First and last names may only have characters matching '^[A-Za-z \-\\\']*$'")
    
def host_ps_fix_validator(fix):
    if not re.match(r'^[A-Za-z\-\.\']*$', fix):
        raise ValidationError("First and last names may only have characters matching '^[A-Za-z\-\.\\\']*$'")
    
def host_mi_validator(initials):
    if not re.match(r'^[A-Z ]*$', initials):
        raise ValidationError("Middle initials may only have characters matching '^[A-Z ]*$'")
    
def host_screen_validator(mode):
    if mode not in ["light", "dark", "system"]:
        raise ValidationError("Screen modes must be one of ['light', 'dark', 'system']")