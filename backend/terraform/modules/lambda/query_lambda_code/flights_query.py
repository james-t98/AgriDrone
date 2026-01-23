# terraform/modules/lambda/query_lambda_code/flights_query.py
# Lambda function to query flight logs from DynamoDB

import json
import os
import boto3
from boto3.dynamodb.conditions import Key, Attr
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['DYNAMODB_TABLE_FLIGHTS']
table = dynamodb.Table(table_name)

class DecimalEncoder(json.JSONEncoder):
    """Helper class to convert Decimal to float for JSON serialization"""
    def default(self, obj):
        if isinstance(obj, Decimal):
            return float(obj)
        return super(DecimalEncoder, self).default(obj)

def handler(event, context):
    """
    Lambda handler for GET /flights
    Query Parameters:
    - farm_id (optional): Farm identifier
    - drone_id (optional): Drone identifier
    - flight_date (optional): Flight date (YYYY-MM-DD)
    - limit (optional): Maximum number of results (default 50, max 1000)
    """
    
    try:
        # Parse query parameters
        params = event.get('queryStringParameters', {}) or {}
        
        farm_id = params.get('farm_id')
        drone_id = params.get('drone_id')
        flight_date = params.get('flight_date')
        limit = int(params.get('limit', 50))
        
        # Enforce max limit
        if limit > 1000:
            limit = 1000
        
        if flight_date:
            # Query using flight_date-index GSI
            query_kwargs = {
                'IndexName': 'flight_date-index',
                'KeyConditionExpression': Key('flight_date').eq(flight_date),
                'Limit': limit
            }
            
            response = table.query(**query_kwargs)
            items = response.get('Items', [])
            
            # Filter by farm_id or drone_id if provided
            if farm_id:
                items = [item for item in items if item.get('farm_id') == farm_id]
            if drone_id:
                items = [item for item in items if item.get('drone_id') == drone_id]
        
        elif farm_id or drone_id:
            # Scan with filter (less efficient)
            scan_kwargs = {
                'Limit': limit
            }
            
            filter_expressions = []
            if farm_id:
                filter_expressions.append(Attr('farm_id').eq(farm_id))
            if drone_id:
                filter_expressions.append(Attr('drone_id').eq(drone_id))
            
            # Combine filters
            if len(filter_expressions) == 1:
                scan_kwargs['FilterExpression'] = filter_expressions[0]
            else:
                scan_kwargs['FilterExpression'] = filter_expressions[0] & filter_expressions[1]
            
            response = table.scan(**scan_kwargs)
            items = response.get('Items', [])
        
        else:
            # Return all recent flights (limited scan)
            scan_kwargs = {
                'Limit': limit
            }
            response = table.scan(**scan_kwargs)
            items = response.get('Items', [])
        
        # Sort by flight_start descending
        items.sort(key=lambda x: x.get('flight_start', 0), reverse=True)
        
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
        print(f"Error querying flight logs: {str(e)}")
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
