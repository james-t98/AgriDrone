# scripts/data_population/populate_sensors.py
# Populate DynamoDB with historical sensor data

import boto3
import time
import random
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('agridrone-demo-sensor-data')

SENSORS = [
    {"sensor_id": "soil_sensor_zone1_01", "field_zone": "Zone_1"},
    {"sensor_id": "soil_sensor_zone1_02", "field_zone": "Zone_1"},
    {"sensor_id": "soil_sensor_zone2_01", "field_zone": "Zone_2"},
    {"sensor_id": "soil_sensor_zone3_01", "field_zone": "Zone_3"},
    {"sensor_id": "weather_station_main", "field_zone": "Central"},
]

def generate_sensor_reading(sensor, timestamp):
    """Generate a single sensor reading"""
    return {
        'sensor_id': sensor['sensor_id'],
        'timestamp': timestamp,
        'farm_id': 'NL_Farm_001',
        'field_zone': sensor['field_zone'],
        'moisture_percentage': Decimal(str(round(random.uniform(45, 75), 1))),
        'pH_level': Decimal(str(round(random.uniform(6.5, 7.2), 2))),
        'temperature_celsius': Decimal(str(round(random.uniform(5, 15), 1))),
        'NPK_values': {
            'nitrogen': random.randint(35, 55),
            'phosphorus': random.randint(18, 28),
            'potassium': random.randint(30, 45)
        },
        'leaf_wetness_duration_hours': Decimal(str(round(random.uniform(0, 8), 1)))
    }

def main():
    """Populate 7 days of sensor data (every 15 minutes)"""
    print("📊 Populating sensor data to DynamoDB...")
    
    current_time = int(time.time())
    total_records = 0
    
    for sensor in SENSORS:
        # 7 days * 96 readings/day (every 15 min) = 672 readings per sensor
        for i in range(672):
            timestamp = current_time - (i * 900)  # 900 seconds = 15 minutes
            reading = generate_sensor_reading(sensor, timestamp)
            table.put_item(Item=reading)
            total_records += 1
    
    print(f"✅ Inserted {total_records} sensor readings")

if __name__ == "__main__":
    main()