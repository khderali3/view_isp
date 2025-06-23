

from django.core.exceptions import ValidationError

def validate_image(value):
    if not value.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
        raise ValidationError("Only image files (.png, .jpg, .jpeg, .gif) are allowed.")


def validate_file_or_image(value):
    if not value.name.lower().endswith(('.png', '.jpg', '.jpeg', '.gif', '.pdf', '.docx', '.txt')):
        raise ValidationError("Only image files (.png, .jpg, .jpeg, .gif) and document files (.pdf, .docx, .txt) are allowed.")

