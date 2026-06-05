import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Default to development settings
ENV = os.environ.get("ENV", "development")

if ENV == "production":
    from .production import *
else:
    from .development import *
