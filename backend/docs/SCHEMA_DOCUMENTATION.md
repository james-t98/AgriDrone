# AgriDrone AI Backend - Database Schema Documentation

Complete documentation of all DynamoDB table schemas, S3 bucket structures, and access patterns.

---

## 1. DynamoDB Tables

### 1.1 cv_results Table

**Purpose:** Store computer vision inference results from YOLOv8 model

**Table Configuration:**
- **Name:** `agridrone-demo-cv-results`
- **Billing Mode:** PAY_PER_REQUEST
- **Primary Key:** 
  - Partition Key: `image_id` (String)
  - Sort Key: `timestamp` (Number - Unix epoch)
- **Global Secondary Index:**
  - Name: `farm_id-timestamp-index`
  - Partition Key: `farm_id` (String)
  - Sort Key: `timestamp` (Number)
  - Projection: ALL

#### Schema Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `image_id` | String | ✓ | Unique image identifier | `img_20260117_143022_zone3` |
| `timestamp` | Number | ✓ | Unix epoch timestamp | `1737122222` |
| `farm_id` | String | ✓ | Farm identifier | `NL_Farm_001` |
| `field_zone` | String | ✓ | Zone identifier | `Zone_3` |
| `s3_uri` | String | ✓ | S3 location of image | `s3://bucket/path/image.jpg` |
| `classification` | String | ✓ | Classification result | `healthy` \| `diseased` \| `pest` \| `weed` |
| `disease_type` | String | ✗ | Disease classification | `late_blight` \| `early_blight` \| `leaf_curl` |
| `pest_type` | String | ✗ | Pest classification | `aphids` \| `beetles` |
| `weed_type` | String | ✗ | Weed classification | `broadleaf` \| `grass` |
| `confidence` | Number | ✓ | Model confidence (0.0-1.0) | `0.92` |
| `bbox_coords` | Map | ✓ | Bounding box coordinates | `{x: 120, y: 85, width: 200, height: 180}` |
| `severity_score` | Number | ✗ | Severity rating (0.0-10.0) | `7.5` |
| `affected_area_percentage` | Number | ✗ | % of image affected | `35.2` |
| `processed_by` | String | ✓ | Lambda function name | `cv_inference_lambda` |
| `model_version` | String | ✓ | YOLOv8 model version | `yolov8-nano-v1.0` |

#### Access Patterns

```python
# 1. Get single result by image_id
response = table.get_item(
    Key={'image_id': 'img_20260117_143022_zone3', 'timestamp': 1737122222}
)

# 2. Get all results for a farm (using GSI)
response = table.query(
    IndexName='farm_id-timestamp-index',
    KeyConditionExpression=Key('farm_id').eq('NL_Farm_001'),
    ScanIndexForward=False,  # Most recent first
    Limit=100
)

# 3. Get results by date range for a farm
response = table.query(
    IndexName='farm_id-timestamp-index',
    KeyConditionExpression=Key('farm_id').eq('NL_Farm_001') & 
                          Key('timestamp').between(start_date, end_date)
)
```

---

### 1.2 sensor_data Table

**Purpose:** Store IoT sensor readings from field devices

**Table Configuration:**
- **Name:** `agridrone-demo-sensor-data`
- **Billing Mode:** PAY_PER_REQUEST
- **Primary Key:**
  - Partition Key: `sensor_id` (String)
  - Sort Key: `timestamp` (Number - Unix epoch)
- **DynamoDB Streams:** Enabled (NEW_IMAGE) for real-time updates

#### Schema Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `sensor_id` | String | ✓ | Unique sensor identifier | `soil_sensor_zone1_01` |
| `timestamp` | Number | ✓ | Unix epoch timestamp | `1737122222` |
| `farm_id` | String | ✓ | Farm identifier | `NL_Farm_001` |
| `field_zone` | String | ✓ | Zone identifier | `Zone_1` |
| `sensor_type` | String | ✓ | Type of sensor | `soil` \| `weather` \| `crop` |
| `moisture_percentage` | Number | ✓ | Soil moisture (0-100%) | `65.3` |
| `pH_level` | Number | ✓ | Soil pH level (0-14) | `6.8` |
| `temperature_celsius` | Number | ✓ | Temperature in Celsius | `12.5` |
| `NPK_values` | Map | ✓ | Nutrient levels (ppm) | `{nitrogen: 45, phosphorus: 22, potassium: 38}` |
| `leaf_wetness_duration_hours` | Number | ✗ | Hours of leaf wetness | `4.5` |
| `wind_speed_kmh` | Number | ✗ | Wind speed (weather stations) | `15.2` |
| `humidity_percentage` | Number | ✗ | Humidity % (weather stations) | `75.0` |
| `precipitation_mm` | Number | ✗ | Precipitation (weather stations) | `2.3` |
| `battery_level` | Number | ✓ | Battery percentage (0-100) | `85` |
| `status` | String | ✓ | Sensor status | `online` \| `offline` \| `calibrating` |

#### Access Patterns

```python
# 1. Get latest reading for a sensor
response = table.query(
    KeyConditionExpression=Key('sensor_id').eq('soil_sensor_zone1_01'),
    ScanIndexForward=False,
    Limit=1
)

# 2. Get historical data for a sensor
response = table.query(
    KeyConditionExpression=Key('sensor_id').eq('soil_sensor_zone1_01') &
                          Key('timestamp').between(start_time, end_time)
)

# 3. Stream updates to frontend (using DynamoDB Streams)
# Automatically triggers Lambda/WebSocket for real-time dashboard updates
```

---

### 1.3 flight_logs Table

**Purpose:** Track drone flight missions and coverage

**Table Configuration:**
- **Name:** `agridrone-demo-flight-logs`
- **Billing Mode:** PAY_PER_REQUEST
- **Primary Key:**
  - Partition Key: `flight_id` (String)
- **Global Secondary Index:**
  - Name: `flight_date-index`
  - Partition Key: `flight_date` (String - YYYY-MM-DD)
  - Projection: ALL

#### Schema Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `flight_id` | String | ✓ | Unique flight identifier | `flight_drone1_20260117_session` |
| `flight_date` | String | ✓ | Date (YYYY-MM-DD) | `2026-01-17` |
| `drone_id` | String | ✓ | Drone identifier | `drone_001` |
| `farm_id` | String | ✓ | Farm identifier | `NL_Farm_001` |
| `flight_start` | Number | ✓ | Start timestamp (Unix epoch) | `1737122000` |
| `flight_end` | Number | ✓ | End timestamp (Unix epoch) | `1737125600` |
| `battery_start_percentage` | Number | ✓ | Starting battery % | `100` |
| `battery_end_percentage` | Number | ✓ | Ending battery % | `35` |
| `battery_cycles` | Number | ✓ | Total charge cycles | `87` |
| `field_zones_covered` | List | ✓ | Zones visited | `["Zone_1", "Zone_2"]` |
| `coverage_percentage` | Number | ✓ | % of farm covered | `85.5` |
| `images_captured` | Number | ✓ | Total images taken | `342` |
| `coverage_map_s3_uri` | String | ✓ | S3 location of coverage GeoJSON | `s3://bucket/coverage.geojson` |
| `weather_conditions` | Map | ✓ | Weather during flight | `{temperature_c: 12, wind_speed_kmh: 8}` |
| `maintenance_alert` | String | ✗ | Warning message if needed | `Battery degradation detected` |
| `status` | String | ✓ | Flight status | `completed` \| `failed` \| `in_progress` |

#### Access Patterns

```python
# 1. Get flight details
response = table.get_item(
    Key={'flight_id': 'flight_drone1_20260117_session'}
)

# 2. Get all flights for a specific date (using GSI)
response = table.query(
    IndexName='flight_date-index',
    KeyConditionExpression=Key('flight_date').eq('2026-01-17')
)

# 3. Get flights by drone (requires scan or additional GSI)
response = table.scan(
    FilterExpression=Attr('drone_id').eq('drone_001')
)
```

---

### 1.4 agent_outputs Table

**Purpose:** Store CrewAI agent execution results and reports

**Table Configuration:**
- **Name:** `agridrone-demo-agent-outputs`
- **Billing Mode:** PAY_PER_REQUEST
- **Primary Key:**
  - Partition Key: `agent_name` (String)
  - Sort Key: `execution_timestamp` (Number - Unix epoch)

#### Schema Fields

| Field Name | Type | Required | Description | Example |
|------------|------|----------|-------------|---------|
| `agent_name` | String | ✓ | Agent identifier | `crop_visual_agent` \| `compliance_agent` |
| `execution_timestamp` | Number | ✓ | Unix epoch timestamp | `1737122222` |
| `farm_id` | String | ✓ | Farm identifier | `NL_Farm_001` |
| `execution_date` | String | ✓ | Date (YYYY-MM-DD) | `2026-01-17` |
| `execution_duration_ms` | Number | ✓ | Duration in milliseconds | `15432` |
| `status` | String | ✓ | Execution status | `success` \| `failed` \| `timeout` |
| `report_json` | Map | ✓ | Structured agent output | `{summary: "...", findings: [...]}` |
| `s3_report_uri` | String | ✓ | S3 location of detailed report | `s3://bucket/reports/agent_report.md` |
| `token_usage` | Map | ✗ | LLM token usage | `{input_tokens: 1500, output_tokens: 800}` |
| `error_message` | String | ✗ | Error details if failed | `Timeout after 300s` |

#### Access Patterns

```python
# 1. Get latest agent output
response = table.query(
    KeyConditionExpression=Key('agent_name').eq('crop_visual_agent'),
    ScanIndexForward=False,
    Limit=1
)

# 2. Get agent execution history
response = table.query(
    KeyConditionExpression=Key('agent_name').eq('crop_visual_agent') &
                          Key('execution_timestamp').between(start_date, end_date)
)
```

---

## 2. S3 Bucket Structures

### 2.1 agridrone-demo-images

**Purpose:** Store crop images captured by drones

**Folder Structure:**
```
{farm_id}/{date}/{category}/{drone_id}/{timestamp}.jpg

Examples:
NL_Farm_001/2026-01-17/diseased/drone_001/143022.jpg
NL_Farm_001/2026-01-17/healthy/drone_002/140512.jpg
NL_Farm_001/2026-01-17/pest/drone_001/145633.jpg
```

**Lifecycle Policy:**
- Transition to Glacier after 90 days

---

### 2.2 agridrone-demo-reports

**Purpose:** Store agent-generated reports

**Folder Structure:**
```
daily/{farm_id}/{year}/{month}/{date}_daily_report.{format}
agent_specific/{agent_name}/{farm_id}/{date}_report.json

Examples:
daily/NL_Farm_001/2026/01/17_daily_report.md
daily/NL_Farm_001/2026/01/17_daily_report.json
agent_specific/compliance_agent/NL_Farm_001/2026-01-17_report.json
```

---

### 2.3 agridrone-demo-legal

**Purpose:** Store legal documents and regulations

**Folder Structure:**
```
{country}/{category}/{version}/{document}.pdf

Examples:
EU/nitrogen_regulations/v2024.1/directive_2024_1357.pdf
NL/nitrogen_legislation/v2024.1/wet_stikstofreductie.pdf
```

---

## 3. API Endpoints Summary

| Endpoint | Method | Purpose | Lambda Function |
|----------|--------|---------|-----------------|
| `/classify` | POST | Submit image for CV analysis | `cv_inference` (Docker) |
| `/cv-results` | GET | Query historical CV results | `cv_results_query` |
| `/sensor-data` | GET | Query sensor readings | `sensor_data_query` |
| `/sensor-data/stream` | GET | Trigger mock sensor generation | `mock_sensor` |
| `/flights` | GET | Query flight logs | `flights_query` |
| `/reports/{date}` | GET | Retrieve daily reports | `reports_query` |

---

## 4. Data Relationships

```mermaid
graph TB
    A[Drone Flight] -->|Captures| B[Images]
    B -->|Classified by| C[CV Lambda]
    C -->|Stores results in| D[cv_results Table]
    D -->|Used by| E[Crop Visual Agent]
    
    F[IoT Sensors] -->|Generate| G[Sensor Readings]
    G -->|Stored in| H[sensor_data Table]
    H -->|Stream to| I[Dashboard]
    
    D -->|Input to| J[Daily Report Generation]
    H -->|Input to| J
    J -->|Creates| K[Reports in S3]
    
    L[Flight Logs]
    A -->|Logged in| L
