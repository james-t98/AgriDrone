# terraform/modules/lambda/query_lambda_code/sensor_data_query.py
# Lambda function to query sensor data from DynamoDB

import json
import os
import boto3
from boto3.dynamodb.conditions import Key
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['DYNAMODB_TABLE_SENSORS']
table = dynamodb.Table(table_name)

class DecimalEncoder(json.JSONEncoder):
    """Helper class to convert Decimal to float for JSON serialization"""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def handler(event, context):
    """
    Lambda handler for GET /sensor-data
    Query Parameters:
    - sensor_id (optional): Specific sensor identifier
    - farm_id (optional): Farm identifier (for filtering, requires scan)
    - start_timestamp (optional): Start timestamp (Unix epoch)
    - end_timestamp (optional): End timestamp (Unix epoch)
    - limit (optional): Maximum number of results (default 100, max 1000)
    """
    
    try:
        # Parse query parameters
        params = event.get('queryStringParameters', {}) or {}
        
        sensor_id = params.get('sensor_id')
        farm_id = params.get('farm_id')
        start_timestamp = params.get('start_timestamp')
        end_timestamp = params.get('end_timestamp')
        limit = int(params.get('limit', 100))
        
        # Enforce max limit
        if limit > 1000:
            limit = 1000
        
        if sensor_id:
            # Query by sensor_id (primary key)
            query_kwargs = {
                'KeyConditionExpression': Key('sensor_id').eq(sensor_id),
                'Limit': limit,
                'ScanIndexForward': False  # Most recent first
            }
            
            # Add time range filter if provided
            if start_timestamp and end_timestamp:
                query_kwargs['KeyConditionExpression'] &= Key('timestamp').between(
                    int(start_timestamp), 
                    int(end_timestamp)
                )
            elif start_timestamp:
                query_kwargs['KeyConditionExpression'] &= Key('timestamp').gte(int(start_timestamp))
            elif end_timestamp:
                query_kwargs['KeyConditionExpression'] &= Key('timestamp').lte(int(end_timestamp))
            
            response = table.query(**query_kwargs)
            items = response.get('Items', [])
        
        elif farm_id:
            # Scan with farm_id filter (less efficient but needed for demo)
            scan_kwargs = {
                'Limit': limit,
                'FilterExpression': Key('farm_id').eq(farm_id)
            }
            
            response = table.scan(**scan_kwargs)
            items = response.get('Items', [])
            
            # Sort by timestamp descending
            items.sort(key=lambda x: x.get('timestamp', 0), reverse=True)
        
        else:
            # Return latest readings for all sensors (limited scan)
            scan_kwargs = {
                'Limit': limit
            }
            response = table.scan(**scan_kwargs)
            items = response.get('Items', [])
            
            # Sort by timestamp descending
            items.sort(key=lambda x: x.get('timestamp', 0), reverse=True)
        
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
        print(f"Error querying sensor data: {str(e)}")
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
