# scripts/data_population/populate_flights.py
# Populate DynamoDB with flight logs

import boto3
from datetime import datetime, timedelta

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('agridrone-demo-flight-logs')

def generate_flight_log(drone_id, day_offset):
    """Generate a flight log entry"""
    date = datetime.now() - timedelta(days=day_offset)
    date_str = date.strftime("%Y-%m-%d")
    
    return {
        'flight_id': f"flight_{drone_id}_{date_str}_{['morning', 'afternoon'][day_offset % 2]}",
        'flight_date': date_str,
        'drone_id': drone_id,
        'farm_id': 'NL_Farm_001',
        'flight_start': int(date.timestamp()),
        'flight_end': int(date.timestamp()) + 3600,
        'battery_start_percentage': 100,
        'battery_end_percentage': random.randint(20, 35),
        'battery_cycles': random.randint(40, 60),
        'field_zones_covered': random.sample(['Zone_1', 'Zone_2', 'Zone_3'], k=random.randint(2, 3)),
        'coverage_percentage': round(random.uniform(95, 100), 1),
        'images_captured': random.randint(2400, 3000),
        'coverage_map_s3_uri': f"s3://agridrone-demo-geospatial/{date_str}/{drone_id}_coverage.geojson",
        'maintenance_alert': 'Normal operation' if random.random() > 0.2 else 'Battery replacement recommended'
    }

def main():
    """Populate 14 flight logs (2 drones × 7 days)"""
    print("🚁 Populating flight logs to DynamoDB...")
    
    total_records = 0
    for drone in ['drone_001', 'drone_002']:
        for day in range(7):
            log = generate_flight_log(drone, day)
            table.put_item(Item=log)
            total_records += 1
    
    print(f"✅ Inserted {total_records} flight logs")

if __name__ == "__main__":
    main()