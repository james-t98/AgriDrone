# terraform/modules/dynamodb/main.tf
# DynamoDB Tables for CV Results, Sensor Data, Flight Logs, Agent Outputs

variable "project_name" {
  type = string
}

# CV Results Table
resource "aws_dynamodb_table" "cv_results" {
  name         = "${var.project_name}-cv-results"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "image_id"
  range_key    = "timestamp"

  attribute {
    name = "image_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  attribute {
    name = "farm_id"
    type = "S"
  }

  global_secondary_index {
    name            = "farm_id-timestamp-index"
    hash_key        = "farm_id"
    range_key       = "timestamp"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = "${var.project_name}-cv-results"
  }
}

# Sensor Data Table
resource "aws_dynamodb_table" "sensor_data" {
  name         = "${var.project_name}-sensor-data"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "sensor_id"
  range_key    = "timestamp"

  attribute {
    name = "sensor_id"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "N"
  }

  stream_enabled   = true
  stream_view_type = "NEW_IMAGE"

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = "${var.project_name}-sensor-data"
  }
}

# Flight Logs Table
resource "aws_dynamodb_table" "flight_logs" {
  name         = "${var.project_name}-flight-logs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "flight_id"

  attribute {
    name = "flight_id"
    type = "S"
  }

  attribute {
    name = "flight_date"
    type = "S"
  }

  global_secondary_index {
    name            = "flight_date-index"
    hash_key        = "flight_date"
    projection_type = "ALL"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = "${var.project_name}-flight-logs"
  }
}

# Agent Outputs Table
resource "aws_dynamodb_table" "agent_outputs" {
  name         = "${var.project_name}-agent-outputs"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "agent_name"
  range_key    = "execution_timestamp"

  attribute {
    name = "agent_name"
    type = "S"
  }

  attribute {
    name = "execution_timestamp"
    type = "N"
  }

  point_in_time_recovery {
    enabled = true
  }

  tags = {
    Name = "${var.project_name}-agent-outputs"
  }
}

# Outputs
output "cv_results_table_name" {
  value = aws_dynamodb_table.cv_results.name
}

output "cv_results_table_arn" {
  value = aws_dynamodb_table.cv_results.arn
}

output "sensor_data_table_name" {
  value = aws_dynamodb_table.sensor_data.name
}

output "sensor_data_table_arn" {
  value = aws_dynamodb_table.sensor_data.arn
}

output "sensor_data_stream_arn" {
  value = aws_dynamodb_table.sensor_data.stream_arn
}

output "flight_logs_table_name" {
  value = aws_dynamodb_table.flight_logs.name
}

output "flight_logs_table_arn" {
  value = aws_dynamodb_table.flight_logs.arn
}

output "agent_outputs_table_name" {
  value = aws_dynamodb_table.agent_outputs.name
}

output "agent_outputs_table_arn" {
  value = aws_dynamodb_table.agent_outputs.arn
}