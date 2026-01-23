# terraform/modules/lambda/query_lambda_code/cv_results_query.py
# Lambda function to query CV results from DynamoDB

import json
import os
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['DYNAMODB_TABLE_CV']
table = dynamodb.Table(table_name)

class DecimalEncoder(json.JSONEncoder):
    """Helper class to convert Decimal to float for JSON serialization"""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def handler(event, context):
    """
    Lambda handler for GET /cv-results
    Query Parameters:
    - farm_id (required): Farm identifier
    - start_date (optional): Start timestamp (Unix epoch)
    - end_date (optional): End timestamp (Unix epoch)
    - limit (optional): Maximum number of results (default 100, max 1000)
    """
    
    try:
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
        
        start_date = params.get('start_date')
        end_date = params.get('end_date')
        limit = int(params.get('limit', 100))
        
        # Enforce max limit
        if limit > 1000:
            limit = 1000
        
        # Build query using GSI farm_id-timestamp-index
        query_kwargs = {
            'IndexName': 'farm_id-timestamp-index',
            'KeyConditionExpression': Key('farm_id').eq(farm_id),
            'Limit': limit,
            'ScanIndexForward': False  # Most recent first
        }
        
        # Add time range filter if provided
        if start_date and end_date:
            query_kwargs['KeyConditionExpression'] &= Key('timestamp').between(
                int(start_date), 
                int(end_date)
            )
        elif start_date:
            query_kwargs['KeyConditionExpression'] &= Key('timestamp').gte(int(start_date))
        elif end_date:
            query_kwargs['KeyConditionExpression'] &= Key('timestamp').lte(int(end_date))
        
        # Execute query
        response = table.query(**query_kwargs)
        items = response.get('Items', [])
        
        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'items': items,
                'count': len(items)
            }, cls=DecimalEncoder)
        }
    
    except ValueError as e:
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'error': 'ValidationError',
                'message': f'Invalid parameter format: {str(e)}'
            })
        }
    
    except Exception as e:
        print(f"Error querying CV results: {str(e)}")
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
