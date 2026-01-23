# terraform/modules/api_gateway/main.tf
# API Gateway for Frontend Communication

variable "project_name" { type = string }
variable "aws_region" { type = string }
variable "cv_lambda_invoke_arn" { type = string }
variable "sensor_lambda_invoke_arn" { type = string }
variable "cv_lambda_function_name" { type = string }
variable "sensor_lambda_function_name" { type = string }
variable "dynamodb_cv_table_arn" { type = string }
variable "dynamodb_sensor_table_arn" { type = string }
variable "dynamodb_flight_table_arn" { type = string }
variable "s3_reports_bucket_arn" { type = string }
variable "cv_lambda_deployed" {
  type        = bool
  default     = false
  description = "Whether the CV Lambda is deployed"
}

# Query Lambda variables
variable "cv_results_query_invoke_arn" { type = string }
variable "sensor_data_query_invoke_arn" { type = string }
variable "flights_query_invoke_arn" { type = string }
variable "reports_query_invoke_arn" { type = string }
variable "cv_results_query_function_name" { type = string }
variable "sensor_data_query_function_name" { type = string }
variable "flights_query_function_name" { type = string }
variable "reports_query_function_name" { type = string }

# HTTP API (cheaper than REST API)
resource "aws_apigatewayv2_api" "main" {
  name          = "${var.project_name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["http://localhost:3000"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }
}

# Stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.main.id
  name        = "$default"
  auto_deploy = true
}

# Integration: CV Inference Lambda (only if CV Lambda is deployed)
resource "aws_apigatewayv2_integration" "cv_lambda" {
  count                  = var.cv_lambda_deployed ? 1 : 0
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.cv_lambda_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "cv_classify" {
  count     = var.cv_lambda_deployed ? 1 : 0
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "POST /classify"
  target    = "integrations/${aws_apigatewayv2_integration.cv_lambda[0].id}"
}

resource "aws_lambda_permission" "api_gateway_cv" {
  count         = var.cv_lambda_deployed ? 1 : 0
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.cv_lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Integration: Sensor Data Generator
resource "aws_apigatewayv2_integration" "sensor_lambda" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.sensor_lambda_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "sensor_stream" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /sensor-data/stream"
  target    = "integrations/${aws_apigatewayv2_integration.sensor_lambda.id}"
}

resource "aws_lambda_permission" "api_gateway_sensor" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = var.sensor_lambda_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Direct DynamoDB Integration for sensor-data GET
resource "aws_iam_role" "api_gateway_dynamodb" {
  name = "${var.project_name}-api-gateway-dynamodb-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Action = "sts:AssumeRole"
      Effect = "Allow"
      Principal = {
        Service = "apigateway.amazonaws.com"
      }
    }]
  })
}

resource "aws_iam_role_policy" "api_gateway_dynamodb_policy" {
  name = "${var.project_name}-api-dynamodb-policy"
  role = aws_iam_role.api_gateway_dynamodb.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Action = [
        "dynamodb:Query",
        "dynamodb:Scan"
      ]
      Resource = [
        var.dynamodb_cv_table_arn,
        "${var.dynamodb_cv_table_arn}/index/*",
        var.dynamodb_sensor_table_arn,
        var.dynamodb_flight_table_arn
      ]
    }]
  })
}

# ============================================================================
# Query Lambda Integrations and Routes
# ============================================================================

# Integration: CV Results Query
resource "aws_apigatewayv2_integration" "cv_results_query" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.cv_results_query_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "cv_results" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /cv-results"
  target    = "integrations/${aws_apigatewayv2_integration.cv_results_query.id}"
}

resource "aws_lambda_permission" "api_gateway_cv_results" {
  statement_id  = "AllowAPIGatewayInvokeCVResults"
  action        = "lambda:InvokeFunction"
  function_name = var.cv_results_query_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Integration: Sensor Data Query
resource "aws_apigatewayv2_integration" "sensor_data_query" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.sensor_data_query_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "sensor_data" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /sensor-data"
  target    = "integrations/${aws_apigatewayv2_integration.sensor_data_query.id}"
}

resource "aws_lambda_permission" "api_gateway_sensor_data" {
  statement_id  = "AllowAPIGatewayInvokeSensorData"
  action        = "lambda:InvokeFunction"
  function_name = var.sensor_data_query_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Integration: Flights Query
resource "aws_apigatewayv2_integration" "flights_query" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.flights_query_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "flights" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /flights"
  target    = "integrations/${aws_apigatewayv2_integration.flights_query.id}"
}

resource "aws_lambda_permission" "api_gateway_flights" {
  statement_id  = "AllowAPIGatewayInvokeFlights"
  action        = "lambda:InvokeFunction"
  function_name = var.flights_query_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Integration: Reports Query
resource "aws_apigatewayv2_integration" "reports_query" {
  api_id                 = aws_apigatewayv2_api.main.id
  integration_type       = "AWS_PROXY"
  integration_uri        = var.reports_query_invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "reports" {
  api_id    = aws_apigatewayv2_api.main.id
  route_key = "GET /reports/{date}"
  target    = "integrations/${aws_apigatewayv2_integration.reports_query.id}"
}

resource "aws_lambda_permission" "api_gateway_reports" {
  statement_id  = "AllowAPIGatewayInvokeReports"
  action        = "lambda:InvokeFunction"
  function_name = var.reports_query_function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.main.execution_arn}/*/*"
}

# Outputs
output "api_gateway_url" {
  value = aws_apigatewayv2_stage.default.invoke_url
}

output "api_gateway_id" {
  value = aws_apigatewayv2_api.main.id
}