import bleach


ALLOWED_TAGS = []        # strip all HTML tags
ALLOWED_ATTRS = {}


def sanitize_string(value: str) -> str:
    """Strip HTML tags and clean whitespace from a string field."""
    if not isinstance(value, str):
        return value
    cleaned = bleach.clean(value, tags=ALLOWED_TAGS, attributes=ALLOWED_ATTRS, strip=True)
    return cleaned.strip()


def sanitize_dict(data: dict, fields: list) -> dict:
    """Sanitize specific string fields in a dict (e.g. request.data)."""
    for field in fields:
        if field in data and isinstance(data[field], str):
            data[field] = sanitize_string(data[field])
    return data
