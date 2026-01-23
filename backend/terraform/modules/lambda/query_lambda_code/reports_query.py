# terraform/modules/lambda/query_lambda_code/reports_query.py
# Lambda function to retrieve reports from S3

import json
import os
import boto3
from datetime import datetime

s3 = boto3.client('s3')
bucket_name = os.environ['S3_BUCKET_REPORTS']

def handler(event, context):
    """
    Lambda handler for GET /reports/{date}
    Path Parameters:
    - date: Report date (YYYY-MM-DD)
    
    Query Parameters:
    - farm_id (required): Farm identifier
    - format (optional): Report format (markdown, json, pdf) - default: markdown
    """
    
    try:
        # Parse path parameters
        path_params = event.get('pathParameters', {}) or {}
        date_str = path_params.get('date')
        
        if not date_str:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'ValidationError',
                    'message': 'Missing required path parameter: date'
                })
            }
        
        # Parse query parameters
        params = event.get('queryStringParameters', {}) or {}
        farm_id = params.get('farm_id')
        
        if not farm_id:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'ValidationError',
                    'message': 'Missing required parameter: farm_id'
                })
            }
        
        report_format = params.get('format', 'markdown')
        
        # Validate date format
        try:
            date_obj = datetime.strptime(date_str, '%Y-%m-%d')
            year = date_obj.strftime('%Y')
            month = date_obj.strftime('%m')
        except ValueError:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'ValidationError',
                    'message': 'Invalid date format. Expected YYYY-MM-DD'
                })
            }
        
        # Construct S3 key based on format
        if report_format == 'markdown':
            s3_key = f"daily/{farm_id}/{year}/{month}/{date_str}_daily_report.md"
            content_type = 'text/markdown'
        elif report_format == 'json':
            s3_key = f"daily/{farm_id}/{year}/{month}/{date_str}_daily_report.json"
            content_type = 'application/json'
        elif report_format == 'pdf':
            s3_key = f"daily/{farm_id}/{year}/{month}/{date_str}_daily_report.pdf"
            content_type = 'application/pdf'
        else:
            return {
                'statusCode': 400,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'ValidationError',
                    'message': 'Invalid format. Supported formats: markdown, json, pdf'
                })
            }
        
        # Retrieve report from S3
        try:
            response = s3.get_object(Bucket=bucket_name, Key=s3_key)
            report_content = response['Body'].read()
            
            # Decode if text format
            if content_type in ['text/markdown', 'application/json']:
                report_content = report_content.decode('utf-8')
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': content_type,
                    'Access-Control-Allow-Origin': '*'
                },
                'body': report_content
            }
        
        except s3.exceptions.NoSuchKey:
            return {
                'statusCode': 404,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({
                    'error': 'NotFound',
                    'message': f'Report not found for date {date_str} and farm {farm_id}'
                })
            }
    
    except Exception as e:
        print(f"Error retrieving report: {str(e)}")
        return {
            'statusCode': 500,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'InternalServerError',
                'message': str(e)
            })
        }
