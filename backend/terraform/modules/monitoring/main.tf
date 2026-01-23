# terraform/modules/monitoring/main.tf
# CloudWatch Alarms and SNS Topics for AgriDrone Monitoring

variable "project_name" {
  type = string
}

variable "cv_lambda_function_name" {
  type = string
}

variable "sensor_lambda_function_name" {
  type = string
}

variable "alert_email" {
  type        = string
  description = "Email address for SNS alert notifications"
}

variable "cv_lambda_deployed" {
  type        = bool
  default     = false
  description = "Whether the CV Lambda is deployed"
}

# SNS Topic for Disease Alerts
resource "aws_sns_topic" "disease_alerts" {
  name = "${var.project_name}-disease-alerts"

  tags = {
    Name = "${var.project_name}-disease-alerts"
  }
}

# SNS Email Subscription (only created if a valid email is provided)
resource "aws_sns_topic_subscription" "email_alerts" {
  count     = var.alert_email != "" && var.alert_email != "[email protected]" ? 1 : 0
  topic_arn = aws_sns_topic.disease_alerts.arn
  protocol  = "email"
  endpoint  = var.alert_email
}

# SNS Topic Policy
resource "aws_sns_topic_policy" "disease_alerts_policy" {
  arn = aws_sns_topic.disease_alerts.arn

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid    = "AllowCloudWatchAlarms"
        Effect = "Allow"
        Principal = {
          Service = "cloudwatch.amazonaws.com"
        }
        Action   = "sns:Publish"
        Resource = aws_sns_topic.disease_alerts.arn
      }
    ]
  })
}

# CloudWatch Log Group for CV Lambda (only if CV Lambda is deployed)
resource "aws_cloudwatch_log_group" "cv_lambda_logs" {
  count             = var.cv_lambda_deployed ? 1 : 0
  name              = "/aws/lambda/${var.cv_lambda_function_name}"
  retention_in_days = 14

  tags = {
    Name = "${var.project_name}-cv-lambda-logs"
  }
}

# CloudWatch Log Group for Sensor Lambda
resource "aws_cloudwatch_log_group" "sensor_lambda_logs" {
  name              = "/aws/lambda/${var.sensor_lambda_function_name}"
  retention_in_days = 14

  tags = {
    Name = "${var.project_name}-sensor-lambda-logs"
  }
}

# CloudWatch Alarm: CV Lambda Errors (only if CV Lambda is deployed)
resource "aws_cloudwatch_metric_alarm" "cv_lambda_errors" {
  count               = var.cv_lambda_deployed ? 1 : 0
  alarm_name          = "${var.project_name}-cv-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 3
  alarm_description   = "Triggered when CV inference Lambda has more than 3 errors in 5 minutes"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = var.cv_lambda_function_name
  }

  alarm_actions = [aws_sns_topic.disease_alerts.arn]
  ok_actions    = [aws_sns_topic.disease_alerts.arn]

  tags = {
    Name = "${var.project_name}-cv-lambda-errors"
  }
}

# CloudWatch Alarm: CV Lambda Throttles (only if CV Lambda is deployed)
resource "aws_cloudwatch_metric_alarm" "cv_lambda_throttles" {
  count               = var.cv_lambda_deployed ? 1 : 0
  alarm_name          = "${var.project_name}-cv-lambda-throttles"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Throttles"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "Triggered when CV inference Lambda is throttled"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = var.cv_lambda_function_name
  }

  alarm_actions = [aws_sns_topic.disease_alerts.arn]

  tags = {
    Name = "${var.project_name}-cv-lambda-throttles"
  }
}

# CloudWatch Alarm: CV Lambda Duration (only if CV Lambda is deployed)
resource "aws_cloudwatch_metric_alarm" "cv_lambda_duration" {
  count               = var.cv_lambda_deployed ? 1 : 0
  alarm_name          = "${var.project_name}-cv-lambda-high-duration"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 2
  metric_name         = "Duration"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Average"
  threshold           = 45000 # 45 seconds (timeout is 60s)
  alarm_description   = "Triggered when CV inference Lambda average duration exceeds 45 seconds"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = var.cv_lambda_function_name
  }

  alarm_actions = [aws_sns_topic.disease_alerts.arn]

  tags = {
    Name = "${var.project_name}-cv-lambda-high-duration"
  }
}

# CloudWatch Alarm: Sensor Lambda Errors
resource "aws_cloudwatch_metric_alarm" "sensor_lambda_errors" {
  alarm_name          = "${var.project_name}-sensor-lambda-errors"
  comparison_operator = "GreaterThanThreshold"
  evaluation_periods  = 1
  metric_name         = "Errors"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 5
  alarm_description   = "Triggered when Sensor Lambda has more than 5 errors in 5 minutes"
  treat_missing_data  = "notBreaching"

  dimensions = {
    FunctionName = var.sensor_lambda_function_name
  }

  alarm_actions = [aws_sns_topic.disease_alerts.arn]
  ok_actions    = [aws_sns_topic.disease_alerts.arn]

  tags = {
    Name = "${var.project_name}-sensor-lambda-errors"
  }
}

# CloudWatch Alarm: Sensor Lambda Invocations (ensure it's running)
resource "aws_cloudwatch_metric_alarm" "sensor_lambda_invocations" {
  alarm_name          = "${var.project_name}-sensor-lambda-no-invocations"
  comparison_operator = "LessThanThreshold"
  evaluation_periods  = 5
  metric_name         = "Invocations"
  namespace           = "AWS/Lambda"
  period              = 300
  statistic           = "Sum"
  threshold           = 1
  alarm_description   = "Triggered when Sensor Lambda has no invocations for 25 minutes"
  treat_missing_data  = "breaching"

  dimensions = {
    FunctionName = var.sensor_lambda_function_name
  }

  alarm_actions = [aws_sns_topic.disease_alerts.arn]
  ok_actions    = [aws_sns_topic.disease_alerts.arn]

  tags = {
    Name = "${var.project_name}-sensor-lambda-no-invocations"
  }
}

# CloudWatch Dashboard for AgriDrone Monitoring
resource "aws_cloudwatch_dashboard" "agridrone" {
  dashboard_name = "${var.project_name}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "CV Lambda Performance"
          region = data.aws_region.current.name
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", var.cv_lambda_function_name, { stat = "Sum", period = 60 }],
            [".", "Errors", ".", ".", { stat = "Sum", period = 60 }],
            [".", "Duration", ".", ".", { stat = "Average", period = 60 }]
          ]
          view = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title  = "Sensor Lambda Performance"
          region = data.aws_region.current.name
          metrics = [
            ["AWS/Lambda", "Invocations", "FunctionName", var.sensor_lambda_function_name, { stat = "Sum", period = 60 }],
            [".", "Errors", ".", ".", { stat = "Sum", period = 60 }],
            [".", "Duration", ".", ".", { stat = "Average", period = 60 }]
          ]
          view = "timeSeries"
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 8
        height = 6
        properties = {
          title  = "CV Lambda Error Rate"
          region = data.aws_region.current.name
          view   = "gauge"
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", var.cv_lambda_function_name, { stat = "Sum", period = 300 }]
          ]
          yAxis = {
            left = {
              min = 0
              max = 10
            }
          }
        }
      },
      {
        type   = "metric"
        x      = 8
        y      = 6
        width  = 8
        height = 6
        properties = {
          title  = "Sensor Lambda Error Rate"
          region = data.aws_region.current.name
          view   = "gauge"
          metrics = [
            ["AWS/Lambda", "Errors", "FunctionName", var.sensor_lambda_function_name, { stat = "Sum", period = 300 }]
          ]
          yAxis = {
            left = {
              min = 0
              max = 10
            }
          }
        }
      },
      {
        type   = "alarm"
        x      = 16
        y      = 6
        width  = 8
        height = 6
        properties = {
          title = "Alarm Status"
          alarms = compact([
            var.cv_lambda_deployed ? aws_cloudwatch_metric_alarm.cv_lambda_errors[0].arn : "",
            aws_cloudwatch_metric_alarm.sensor_lambda_errors.arn,
            var.cv_lambda_deployed ? aws_cloudwatch_metric_alarm.cv_lambda_throttles[0].arn : ""
          ])
        }
      }
    ]
  })
}

# Data source for current region
data "aws_region" "current" {}

# Outputs
output "disease_alert_topic_arn" {
  description = "ARN of the SNS topic for disease alerts"
  value       = aws_sns_topic.disease_alerts.arn
}

output "disease_alert_topic_name" {
  description = "Name of the SNS topic for disease alerts"
  value       = aws_sns_topic.disease_alerts.name
}

output "cv_lambda_log_group_name" {
  description = "CloudWatch Log Group name for CV Lambda"
  value       = var.cv_lambda_deployed ? aws_cloudwatch_log_group.cv_lambda_logs[0].name : ""
}

output "sensor_lambda_log_group_name" {
  description = "CloudWatch Log Group name for Sensor Lambda"
  value       = aws_cloudwatch_log_group.sensor_lambda_logs.name
}

output "dashboard_name" {
  description = "CloudWatch Dashboard name"
  value       = aws_cloudwatch_dashboard.agridrone.dashboard_name
}
