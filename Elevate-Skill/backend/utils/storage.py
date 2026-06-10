from storages.backends.s3boto3 import S3Boto3Storage


class MediaStorage(S3Boto3Storage):
    """
    All user-uploaded files — payment proofs, thumbnails, CMS images.
    Private bucket — every URL is a pre-signed link valid for 1 hour.
    """
    location = 'media'
    file_overwrite = False
    default_acl = 'private'
    