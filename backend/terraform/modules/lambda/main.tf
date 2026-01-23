# terraform/modules/lambda/main.tf
# Lambda Functions for CV Inference and Sensor Data Generation

variable "project_name" {
  type = string
}

variable "aws_region" {
  type = string
}

variable "s3_bucket_images" {
  type = string
}

variable "dynamodb_cv_table" {
  type = string
}

variable "dynamodb_sensor_table" {
  type = string
}

variable "dynamodb_flight_table" {
  type = string
}

variable "s3_bucket_reports" {
  type = string
}

variable "farm_id" {
  type = string
}

variable "deploy_cv_lambda" {
  type        = bool
  default     = false
  description = "Set to true after pushing Docker image to ECR"
}

# IAM Role for Lambda Functions
resource "aws_iam_role" "lambda_role" {
  name = "${var.project_name}-lambda-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# IAM Policy for Lambda
resource "aws_iam_role_policy" "lambda_policy" {
  name = "${var.project_name}-lambda-policy"
  role = aws_iam_role.lambda_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:*:*:*"
      },
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject",
          "s3:ListBucket"
        ]
        Resource = [
          "arn:aws:s3:::${var.s3_bucket_images}",
          "arn:aws:s3:::${var.s3_bucket_images}/*",
          "arn:aws:s3:::${var.s3_bucket_reports}",
          "arn:aws:s3:::${var.s3_bucket_reports}/*"
        ]
      },
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = [
          "arn:aws:dynamodb:${var.aws_region}:*:table/${var.dynamodb_cv_table}",
          "arn:aws:dynamodb:${var.aws_region}:*:table/${var.dynamodb_cv_table}/index/*",
          "arn:aws:dynamodb:${var.aws_region}:*:table/${var.dynamodb_sensor_table}",
          "arn:aws:dynamodb:${var.aws_region}:*:table/${var.dynamodb_flight_table}",
          "arn:aws:dynamodb:${var.aws_region}:*:table/${var.dynamodb_flight_table}/index/*"
        ]
      }
    ]
  })
}

# ECR Repository for CV Model Container
# If this already exists, import it with: terraform import module.lambda_functions.aws_ecr_repository.cv_model agridrone-demo-cv-model
resource "aws_ecr_repository" "cv_model" {
  name                 = "${var.project_name}-cv-model"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }

  tags = {
    Name = "${var.project_name}-cv-model"
  }

  lifecycle {
    # Prevent destruction of ECR repo which may contain images
    prevent_destroy = false
  }
}

# Lambda Function: CV Inference (Container)
# Only created when deploy_cv_lambda is true (after Docker image is pushed to ECR)
resource "aws_lambda_function" "cv_inference" {
  count         = var.deploy_cv_lambda ? 1 : 0
  function_name = "${var.project_name}-cv-inference"
  role          = aws_iam_role.lambda_role.arn
  package_type  = "Image"
  image_uri     = "${aws_ecr_repository.cv_model.repository_url}:latest"

  memory_size = 3072
  timeout     = 60

  ephemeral_storage {
    size = 10240 # 10 GB
  }

  environment {
    variables = {
      S3_BUCKET_IMAGES           = var.s3_bucket_images
      DYNAMODB_TABLE_CV          = var.dynamodb_cv_table
      MODEL_CONFIDENCE_THRESHOLD = "0.70"
    }
  }

  tags = {
    Name = "${var.project_name}-cv-inference"
  }

  # Note: Image must be pushed to ECR before applying
  lifecycle {
    ignore_changes = [image_uri]
  }
}

# Lambda Function: Mock Sensor Generator
resource "aws_lambda_function" "mock_sensor" {
  function_name = "${var.project_name}-mock-sensor-generator"
  role          = aws_iam_role.lambda_role.arn
  handler       = "index.handler"
  runtime       = "python3.11"

  filename         = data.archive_file.sensor_lambda.output_path
  source_code_hash = data.archive_file.sensor_lambda.output_base64sha256

  memory_size = 512
  timeout     = 10

  environment {
    variables = {
      DYNAMODB_TABLE_SENSORS = var.dynamodb_sensor_table
      FARM_ID                = var.farm_id
      SENSOR_COUNT           = "10"
      UPDATE_INTERVAL        = "1"
    }
  }

  tags = {
    Name = "${var.project_name}-mock-sensor-generator"
  }
}

# Package sensor Lambda code
data "archive_file" "sensor_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/sensor_lambda_code"
  output_path = "${path.module}/sensor_lambda.zip"
}

# EventBridge Rule for Sensor Generator (every 1 second)
resource "aws_cloudwatch_event_rule" "sensor_generator_schedule" {
  name                = "${var.project_name}-sensor-schedule"
  description         = "Trigger sensor data generation every 1 second"
  schedule_expression = "rate(1 minute)" # AWS minimum is 1 minute

  tags = {
    Name = "${var.project_name}-sensor-schedule"
  }
}

resource "aws_cloudwatch_event_target" "sensor_generator_target" {
  rule      = aws_cloudwatch_event_rule.sensor_generator_schedule.name
  target_id = "SensorGeneratorLambda"
  arn       = aws_lambda_function.mock_sensor.arn
}

resource "aws_lambda_permission" "allow_eventbridge" {
  statement_id  = "AllowExecutionFromEventBridge"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.mock_sensor.function_name
  principal     = "events.amazonaws.com"
  source_arn    = aws_cloudwatch_event_rule.sensor_generator_schedule.arn
}

# ============================================================================
# Query Lambda Functions for API Gateway Endpoints
# ============================================================================

# Package query Lambda code
data "archive_file" "query_lambda" {
  type        = "zip"
  source_dir  = "${path.module}/query_lambda_code"
  output_path = "${path.module}/query_lambda.zip"
}

# Lambda Function: CV Results Query
resource "aws_lambda_function" "cv_results_query" {
  function_name = "${var.project_name}-cv-results-query"
  role          = aws_iam_role.lambda_role.arn
  handler       = "cv_results_query.handler"
  runtime       = "python3.11"

  filename         = data.archive_file.query_lambda.output_path
  source_code_hash = data.archive_file.query_lambda.output_base64sha256

  memory_size = 512
  timeout     = 30

  environment {
    variables = {
      DYNAMODB_TABLE_CV = var.dynamodb_cv_table
    }
  }

  tags = {
    Name = "${var.project_name}-cv-results-query"
  }
}

# Lambda Function: Sensor Data Query
resource "aws_lambda_function" "sensor_data_query" {
  function_name = "${var.project_name}-sensor-data-query"
  role          = aws_iam_role.lambda_role.arn
  handler       = "sensor_data_query.handler"
  runtime       = "python3.11"

  filename         = data.archive_file.query_lambda.output_path
  source_code_hash = data.archive_file.query_lambda.output_base64sha256

  memory_size = 512
  timeout     = 30

  environment {
    variables = {
      DYNAMODB_TABLE_SENSORS = var.dynamodb_sensor_table
    }
  }

  tags = {
    Name = "${var.project_name}-sensor-data-query"
  }
}

# Lambda Function: Flights Query
resource "aws_lambda_function" "flights_query" {
  function_name = "${var.project_name}-flights-query"
  role          = aws_iam_role.lambda_role.arn
  handler       = "flights_query.handler"
  runtime       = "python3.11"

  filename         = data.archive_file.query_lambda.output_path
  source_code_hash = data.archive_file.query_lambda.output_base64sha256

  memory_size = 512
  timeout     = 30

  environment {
    variables = {
      DYNAMODB_TABLE_FLIGHTS = var.dynamodb_flight_table
    }
  }

  tags = {
    Name = "${var.project_name}-flights-query"
  }
}

# Lambda Function: Reports Query
resource "aws_lambda_function" "reports_query" {
  function_name = "${var.project_name}-reports-query"
  role          = aws_iam_role.lambda_role.arn
  handler       = "reports_query.handler"
  runtime       = "python3.11"

  filename         = data.archive_file.query_lambda.output_path
  source_code_hash = data.archive_file.query_lambda.output_base64sha256

  memory_size = 512
  timeout     = 30

  environment {
    variables = {
      S3_BUCKET_REPORTS = var.s3_bucket_reports
    }
  }

  tags = {
    Name = "${var.project_name}-reports-query"
  }
}

# Outputs
output "cv_lambda_function_name" {
  value = var.deploy_cv_lambda ? aws_lambda_function.cv_inference[0].function_name : "${var.project_name}-cv-inference"
}

output "cv_lambda_arn" {
  value = var.deploy_cv_lambda ? aws_lambda_function.cv_inference[0].arn : ""
}

output "cv_lambda_invoke_arn" {
  value = var.deploy_cv_lambda ? aws_lambda_function.cv_inference[0].invoke_arn : ""
}

output "sensor_lambda_function_name" {
  value = aws_lambda_function.mock_sensor.function_name
}

output "sensor_lambda_arn" {
  value = aws_lambda_function.mock_sensor.arn
}

output "sensor_lambda_invoke_arn" {
  value = aws_lambda_function.mock_sensor.invoke_arn
}

output "ecr_repository_url" {
  value = aws_ecr_repository.cv_model.repository_url
}

output "cv_lambda_deployed" {
  value       = var.deploy_cv_lambda
  description = "Whether the CV Lambda is deployed"
}

# Query Lambda Outputs
output "cv_results_query_function_name" {
  value = aws_lambda_function.cv_results_query.function_name
}

output "cv_results_query_arn" {
  value = aws_lambda_function.cv_results_query.arn
}

output "cv_results_query_invoke_arn" {
  value = aws_lambda_function.cv_results_query.invoke_arn
}

output "sensor_data_query_function_name" {
  value = aws_lambda_function.sensor_data_query.function_name
}

output "sensor_data_query_arn" {
  value = aws_lambda_function.sensor_data_query.arn
}

output "sensor_data_query_invoke_arn" {
  value = aws_lambda_function.sensor_data_query.invoke_arn
}

output "flights_query_function_name" {
  value = aws_lambda_function.flights_query.function_name
}

output "flights_query_arn" {
  value = aws_lambda_function.flights_query.arn
}

output "flights_query_invoke_arn" {
  value = aws_lambda_function.flights_query.invoke_arn
}

output "reports_query_function_name" {
  value = aws_lambda_function.reports_query.function_name
}

output "reports_query_arn" {
  value = aws_lambda_function.reports_query.arn
}

output "reports_query_invoke_arn" {
  value = aws_lambda_function.reports_query.invoke_arn
}