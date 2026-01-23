# terraform/main.tf
# AgriDrone Demo Infrastructure - Main Configuration

terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }

  backend "local" {
    path = "terraform.tfstate"
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "AgriDrone-Demo"
      Environment = "Development"
      ManagedBy   = "Terraform"
    }
  }
}

# Variables
variable "aws_region" {
  description = "AWS region for deployment"
  type        = string
  default     = "eu-west-1"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "agridrone-demo"
}

variable "farm_id" {
  description = "Default farm identifier"
  type        = string
  default     = "NL_Farm_001"
}

# S3 Buckets
module "s3_buckets" {
  source       = "./modules/s3"
  project_name = var.project_name
  aws_region   = var.aws_region
}

# DynamoDB Tables
module "dynamodb_tables" {
  source       = "./modules/dynamodb"
  project_name = var.project_name
}

# Lambda Functions
module "lambda_functions" {
  source                = "./modules/lambda"
  project_name          = var.project_name
  aws_region            = var.aws_region
  s3_bucket_images      = module.s3_buckets.images_bucket_name
  s3_bucket_reports     = module.s3_buckets.reports_bucket_name
  dynamodb_cv_table     = module.dynamodb_tables.cv_results_table_name
  dynamodb_sensor_table = module.dynamodb_tables.sensor_data_table_name
  dynamodb_flight_table = module.dynamodb_tables.flight_logs_table_name
  farm_id               = var.farm_id
  deploy_cv_lambda      = var.deploy_cv_lambda
}

# API Gateway
module "api_gateway" {
  source                      = "./modules/api_gateway"
  project_name                = var.project_name
  aws_region                  = var.aws_region
  cv_lambda_invoke_arn        = module.lambda_functions.cv_lambda_invoke_arn
  sensor_lambda_invoke_arn    = module.lambda_functions.sensor_lambda_invoke_arn
  cv_lambda_function_name     = module.lambda_functions.cv_lambda_function_name
  sensor_lambda_function_name = module.lambda_functions.sensor_lambda_function_name
  dynamodb_cv_table_arn       = module.dynamodb_tables.cv_results_table_arn
  dynamodb_sensor_table_arn   = module.dynamodb_tables.sensor_data_table_arn
  dynamodb_flight_table_arn   = module.dynamodb_tables.flight_logs_table_arn
  s3_reports_bucket_arn       = module.s3_buckets.reports_bucket_arn
  cv_lambda_deployed          = var.deploy_cv_lambda

  # Query Lambda variables
  cv_results_query_invoke_arn     = module.lambda_functions.cv_results_query_invoke_arn
  sensor_data_query_invoke_arn    = module.lambda_functions.sensor_data_query_invoke_arn
  flights_query_invoke_arn        = module.lambda_functions.flights_query_invoke_arn
  reports_query_invoke_arn        = module.lambda_functions.reports_query_invoke_arn
  cv_results_query_function_name  = module.lambda_functions.cv_results_query_function_name
  sensor_data_query_function_name = module.lambda_functions.sensor_data_query_function_name
  flights_query_function_name     = module.lambda_functions.flights_query_function_name
  reports_query_function_name     = module.lambda_functions.reports_query_function_name
}

# CloudWatch & SNS
module "monitoring" {
  source                      = "./modules/monitoring"
  project_name                = var.project_name
  cv_lambda_function_name     = module.lambda_functions.cv_lambda_function_name
  sensor_lambda_function_name = module.lambda_functions.sensor_lambda_function_name
  alert_email                 = var.alert_email
  cv_lambda_deployed          = var.deploy_cv_lambda
}

variable "alert_email" {
  description = "Email address for SNS alerts"
  type        = string
  default     = "[email protected]"
}

variable "deploy_cv_lambda" {
  description = "Set to true after pushing Docker image to ECR"
  type        = bool
  default     = false
}

# Outputs
output "api_gateway_url" {
  description = "API Gateway base URL"
  value       = module.api_gateway.api_gateway_url
}

output "s3_bucket_images" {
  description = "S3 bucket for crop images"
  value       = module.s3_buckets.images_bucket_name
}

output "s3_bucket_reports" {
  description = "S3 bucket for agent reports"
  value       = module.s3_buckets.reports_bucket_name
}

output "s3_bucket_legal" {
  description = "S3 bucket for legal documents"
  value       = module.s3_buckets.legal_bucket_name
}

output "sns_topic_arn" {
  description = "SNS topic for disease alerts"
  value       = module.monitoring.disease_alert_topic_arn
}

output "deployment_summary" {
  description = "Deployment summary"
  value = {
    region          = var.aws_region
    api_gateway_url = module.api_gateway.api_gateway_url
    farm_id         = var.farm_id
    s3_buckets = {
      images  = module.s3_buckets.images_bucket_name
      reports = module.s3_buckets.reports_bucket_name
      legal   = module.s3_buckets.legal_bucket_name
    }
  }
}