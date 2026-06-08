import os
from PIL import Image
from rest_framework.exceptions import ValidationError

ALLOWED_CONTENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png']
ALLOWED_IMAGE_TYPES = ['jpeg', 'png']
PDF_MAGIC_BYTES = b'%PDF'
MAX_FILE_SIZE_MB = 5
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024

JPEG_MAGIC_BYTES = {b'\xff\xd8\xff\xe0', b'\xff\xd8\xff\xe1', b'\xff\xd8\xff\xe2'}
PNG_MAGIC_BYTES = b'\x89PNG'


def validate_proof_filename(file):
    """Reject filenames with path traversal attempts."""
    filename = file.name
    if '..' in filename or '/' in filename or '\\' in filename:
        raise ValidationError("Invalid filename.")
    # Strip to basename only
    file.name = os.path.basename(filename)
    return file


def validate_proof_file(file):
    validate_proof_filename(file)

    # Size check
    if file.size > MAX_FILE_SIZE_BYTES:
        raise ValidationError(f"File size must not exceed {MAX_FILE_SIZE_MB}MB.")

    # Content-type check (first layer)
    content_type = getattr(file, 'content_type', None)
    if content_type not in ALLOWED_CONTENT_TYPES:
        raise ValidationError("Only PDF, JPG, and PNG files are accepted.")

    # Read first bytes for magic byte check (second layer)
    header = file.read(4)
    file.seek(0)

    if content_type == 'application/pdf':
        if not header.startswith(PDF_MAGIC_BYTES):
            raise ValidationError("Invalid PDF file.")
    elif content_type == 'image/png':
        if not header.startswith(PNG_MAGIC_BYTES):
            raise ValidationError("Invalid PNG file.")
    elif content_type == 'image/jpeg':
        if header not in JPEG_MAGIC_BYTES:
            raise ValidationError("Invalid JPEG file.")

    # Final verification via Pillow
    try:
        img = Image.open(file)
        img.verify()
        file.seek(0)
        fmt = img.format.lower() if img.format else None
        if fmt not in ALLOWED_IMAGE_TYPES:
            raise ValidationError("Invalid image file. Only JPG and PNG are accepted.")
    except (ValidationError,):
        raise
    except Exception:
        raise ValidationError("Invalid image file. Only JPG and PNG are accepted.")

    return file
