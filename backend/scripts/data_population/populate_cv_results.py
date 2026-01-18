# scripts/data_population/populate_cv_results.py
# Populate DynamoDB with mock CV classification results

import boto3
import time
import random
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('agridrone-demo-cv-results')

DISEASES = ['late_blight', 'early_blight', 'leaf_curl', None]
ZONES = ['Zone_1', 'Zone_2', 'Zone_3']

def generate_cv_result(day_offset, index):
    """Generate a single CV result record"""
    timestamp = int(time.time()) - (day_offset * 86400) + (index * 300)
    classification = random.choices(
        ['healthy', 'diseased', 'pest', 'weed'],
        weights=[0.70, 0.20, 0.05, 0.05]
    )[0]
    
    disease_type = None
    if classification == 'diseased':
        disease_type = random.choice(['late_blight', 'early_blight', 'leaf_curl'])
    
    zone = random.choice(ZONES)
    
    return {
        'image_id': f"img_day{day_offset}_idx{index:04d}_{zone}",
        'timestamp': timestamp,
        'farm_id': 'NL_Farm_001',
        'field_zone': zone,
        's3_uri': f"s3://agridrone-demo-images/2026-01-17/{classification}/img_{index:04d}.jpg",
        'classification': classification,
        'disease_type': disease_type,
        'confidence': Decimal(str(round(random.uniform(0.75, 0.98), 2))),
        'bbox_coords': {
            'x': random.randint(50, 300),
            'y': random.randint(50, 300),
            'width': random.randint(100, 250),
            'height': random.randint(100, 250)
        },
        'severity_score': Decimal(str(round(random.uniform(3, 9), 1))) if classification == 'diseased' else None,
        'affected_area_percentage': Decimal(str(round(random.uniform(5, 40), 1))) if classification == 'diseased' else None
    }

def main():
    """Populate 7 days of CV results"""
    print("🔬 Populating CV results to DynamoDB...")
    
    total_records = 0
    for day in range(7):
        records_per_day = random.randint(25, 35)
        for i in range(records_per_day):
            result = generate_cv_result(day, i)
            table.put_item(Item=result)
            total_records += 1
    
    print(f"✅ Inserted {total_records} CV results")

if __name__ == "__main__":
    main()
