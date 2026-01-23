# terraform/modules/lambda/sensor_lambda_code/index.py
# Mock Sensor Data Generator for Real-time Dashboard Updates

import json
import os
import time
import random
import boto3
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table_name = os.environ['DYNAMODB_TABLE_SENSORS']
farm_id = os.environ['FARM_ID']
sensor_count = int(os.environ.get('SENSOR_COUNT', 10))

table = dynamodb.Table(table_name)

# Sensor definitions
SENSORS = [
    {"sensor_id": "soil_sensor_zone1_01", "field_zone": "Zone_1"},
    {"sensor_id": "soil_sensor_zone1_02", "field_zone": "Zone_1"},
    {"sensor_id": "soil_sensor_zone1_03", "field_zone": "Zone_1"},
    {"sensor_id": "soil_sensor_zone2_01", "field_zone": "Zone_2"},
    {"sensor_id": "soil_sensor_zone2_02", "field_zone": "Zone_2"},
    {"sensor_id": "soil_sensor_zone2_03", "field_zone": "Zone_2"},
    {"sensor_id": "soil_sensor_zone3_01", "field_zone": "Zone_3"},
    {"sensor_id": "soil_sensor_zone3_02", "field_zone": "Zone_3"},
    {"sensor_id": "soil_sensor_zone3_03", "field_zone": "Zone_3"},
    {"sensor_id": "weather_station_main", "field_zone": "Central"},
]

def generate_sensor_reading(sensor):
    """Generate realistic sensor data with slight variations"""
    timestamp = int(time.time())
    
    # Determine sensor type
    if sensor["sensor_id"] == "weather_station_main":
        sensor_type = "weather"
    else:
        sensor_type = "soil"
    
    # Base values with realistic ranges for Netherlands agriculture
    if sensor["field_zone"] == "Zone_3":
        # Zone 3 has higher moisture (correlates with fungal disease)
        moisture = round(random.uniform(65, 85), 1)
    else:
        moisture = round(random.uniform(45, 70), 1)
    
    # Occasional anomaly injection (5% chance)
    if random.random() < 0.05:
        moisture = round(random.uniform(85, 95), 1)  # Anomaly: very high moisture
    
    # Generate battery level (70-100% for healthy sensors)
    battery_level = random.randint(70, 100)
    
    # Status: mostly online, occasionally calibrating
    status_roll = random.random()
    if status_roll < 0.95:
        status = "online"
    elif status_roll < 0.99:
        status = "calibrating"
    else:
        status = "offline"
    
    reading = {
        "sensor_id": sensor["sensor_id"],
        "timestamp": timestamp,
        "farm_id": farm_id,
        "field_zone": sensor["field_zone"],
        "sensor_type": sensor_type,
        "moisture_percentage": Decimal(str(moisture)),
        "pH_level": Decimal(str(round(random.uniform(6.5, 7.2), 2))),
        "temperature_celsius": Decimal(str(round(random.uniform(5, 15), 1))),
        "NPK_values": {
            "nitrogen": random.randint(35, 55),
            "phosphorus": random.randint(18, 28),
            "potassium": random.randint(30, 45)
        },
        "battery_level": battery_level,
        "status": status
    }
    
    # Weather station has different data
    if sensor_type == "weather":
        reading["wind_speed_kmh"] = Decimal(str(round(random.uniform(5, 25), 1)))
        reading["humidity_percentage"] = Decimal(str(round(random.uniform(60, 90), 1)))
        reading["precipitation_mm"] = Decimal(str(round(random.uniform(0, 5), 2)))
    else:
        reading["leaf_wetness_duration_hours"] = Decimal(str(round(random.uniform(0, 8), 1)))
    
    return reading

def handler(event, context):
    """Lambda handler to generate sensor data for all sensors"""
    
    try:
        generated_count = 0
        
        # Generate readings for all sensors
        for sensor in SENSORS[:sensor_count]:
            reading = generate_sensor_reading(sensor)
            
            # Write to DynamoDB
            table.put_item(Item=reading)
            generated_count += 1
        
        return {
            'statusCode': 200,
            'body': json.dumps({
                'message': f'Generated {generated_count} sensor readings',
                'timestamp': int(time.time()),
                'farm_id': farm_id
            })
        }
    
    except Exception as e:
        print(f"Error generating sensor data: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'error': str(e)
            })
        }