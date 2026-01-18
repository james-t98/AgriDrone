# scripts/infra/populate_data.sh
# Populate all demo data

#!/bin/bash
set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        AgriDrone Demo - Data Population                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if config exists
if [ ! -f "scripts/config.json" ]; then
    echo -e "${YELLOW}⚠️  scripts/config.json not found${NC}"
    echo -e "   Run: bash scripts/infra/deploy_aws_infra.sh first"
    exit 1
fi

# Check Python dependencies
echo -e "${YELLOW}[1/7] Checking Python dependencies...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi

if [ ! -f "scripts/requirements.txt" ]; then
    cat > scripts/requirements.txt << EOF
boto3>=1.28.0
requests>=2.31.0
python-dotenv>=1.0.0
Pillow>=10.0.0
EOF
fi

pip install -q -r scripts/requirements.txt
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Run population scripts
run_script() {
    local script=$1
    local description=$2
    
    echo -e "${YELLOW}[${3}/7] ${description}...${NC}"
    
    if [ -f "scripts/${script}" ]; then
        python3 scripts/${script}
        echo -e "${GREEN}✓ ${description} complete${NC}"
    else
        echo -e "${YELLOW}⚠️  scripts/${script} not found, skipping${NC}"
    fi
    echo ""
}

run_script "populate_images.py" "Uploading crop images to S3" "2"
run_script "populate_cv_results.py" "Generating CV classification results" "3"
run_script "populate_sensors.py" "Generating historical sensor data" "4"
run_script "populate_flights.py" "Creating flight logs" "5"
run_script "populate_legal_docs.py" "Uploading legal documents" "6"
run_script "generate_past_reports.py" "Generating past agent reports" "7"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Data Population Completed!                         ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ All demo data populated successfully${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Configure CrewAI Platform agents"
echo -e "  2. Start frontend development server"
echo -e "  3. Test video classification with webcam"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""