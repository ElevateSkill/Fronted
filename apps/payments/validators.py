from rest_framework.exceptions import ValidationError

ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/png"]
MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024


def validate_proof_file(file):
    if file.size > MAX_FILE_SIZE_BYTES:
        raise ValidationError(f"File size must not exceed {MAX_FILE_SIZE_MB}MB.")

    content_type = getattr(file, "content_type", None)
    if content_type not in ALLOWED_TYPES:
        raise ValidationError("Only PDF, JPG, and PNG files are accepted.")

    return file
