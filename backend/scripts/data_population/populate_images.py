# scripts/data_population/populate_images.py
# Populate S3 with demo crop images

import boto3
import os
import requests
from pathlib import Path
import json

s3 = boto3.client('s3')
BUCKET_NAME = os.environ.get('S3_BUCKET_IMAGES', 'agridrone-demo-images')

# PlantVillage dataset URLs (sample subset)
DATASET_URLS = {
    "healthy": [
        "https://storage.googleapis.com/plantvillage/Potato___healthy/0a5e9323-dbad-432d-ac58-d291718345d9___RS_HL%207849.JPG",
        # Add 49 more URLs
    ],
    "diseased": [
        "https://storage.googleapis.com/plantvillage/Potato___Late_blight/0a3f5c55-50e0-48d8-a831-c89f1e6ca8db___RS_LB%204416.JPG",
        # Add 29 more URLs
    ],
    "pest": [
        # Custom pest damage images URLs
    ],
    "weed": [
        # Custom weed images URLs
    ]
}

def download_and_upload_image(url, category, filename):
    """Download image from URL and upload to S3"""
    try:
        response = requests.get(url, timeout=30)
        response.raise_for_status()
        
        # Upload to S3 with appropriate prefix
        s3_key = f"2026-01-17/{category}/{filename}"
        s3.put_object(
            Bucket=BUCKET_NAME,
            Key=s3_key,
            Body=response.content,
            ContentType='image/jpeg'
        )
        
        print(f"✓ Uploaded: {s3_key}")
        return s3_key
    except Exception as e:
        print(f"✗ Failed to upload {filename}: {str(e)}")
        return None

def main():
    """Main function to populate images"""
    print(f"📸 Populating images to S3 bucket: {BUCKET_NAME}")
    
    uploaded_count = 0
    for category, urls in DATASET_URLS.items():
        print(f"\nUploading {category} images...")
        for i, url in enumerate(urls):
            filename = f"img_{i:04d}_{category}.jpg"
            if download_and_upload_image(url, category, filename):
                uploaded_count += 1
    
    print(f"\n✅ Uploaded {uploaded_count} images successfully")

if __name__ == "__main__":
    main()