# terraform/modules/s3/main.tf
# S3 Buckets for Images, Reports, and Legal Documents

variable "project_name" {
  type = string
}

variable "aws_region" {
  type = string
}

# Images Bucket
resource "aws_s3_bucket" "images" {
  bucket = "${var.project_name}-images"
}

resource "aws_s3_bucket_versioning" "images" {
  bucket = aws_s3_bucket.images.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "images" {
  bucket = aws_s3_bucket.images.id

  rule {
    id     = "transition_to_glacier"
    status = "Enabled"

    # Apply to all objects in the bucket
    filter {}

    transition {
      days          = 90
      storage_class = "GLACIER"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "images" {
  bucket = aws_s3_bucket.images.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_cors_configuration" "images" {
  bucket = aws_s3_bucket.images.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "PUT", "POST"]
    allowed_origins = ["http://localhost:5173", "https://*.vercel.app"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3600
  }
}

# Reports Bucket
resource "aws_s3_bucket" "reports" {
  bucket = "${var.project_name}-reports"
}

resource "aws_s3_bucket_versioning" "reports" {
  bucket = aws_s3_bucket.reports.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "reports" {
  bucket = aws_s3_bucket.reports.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Legal Documents Bucket
resource "aws_s3_bucket" "legal" {
  bucket = "${var.project_name}-legal"
}

resource "aws_s3_bucket_versioning" "legal" {
  bucket = aws_s3_bucket.legal.id

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_public_access_block" "legal" {
  bucket = aws_s3_bucket.legal.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# Outputs
output "images_bucket_name" {
  value = aws_s3_bucket.images.bucket
}

output "images_bucket_arn" {
  value = aws_s3_bucket.images.arn
}

output "reports_bucket_name" {
  value = aws_s3_bucket.reports.bucket
}

output "reports_bucket_arn" {
  value = aws_s3_bucket.reports.arn
}

output "legal_bucket_name" {
  value = aws_s3_bucket.legal.bucket
}

output "legal_bucket_arn" {
  value = aws_s3_bucket.legal.arn
}