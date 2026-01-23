#!/bin/bash
# scripts/infra/populate_data.sh
# Populate all demo data

set -e

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

# Get the script directory for absolute path resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKEND_SCRIPTS_DIR="${SCRIPT_DIR}/.."

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║        AgriDrone Demo - Data Population                    ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check if config exists
if [ ! -f "${BACKEND_SCRIPTS_DIR}/config.json" ]; then
    echo -e "${YELLOW}⚠️  scripts/config.json not found at ${BACKEND_SCRIPTS_DIR}/config.json${NC}"
    echo -e "   Run: bash ${SCRIPT_DIR}/deploy_aws_infra.sh first"
    exit 1
fi

# Check Python dependencies
echo -e "${YELLOW}[1/7] Checking Python dependencies...${NC}"

if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 not found${NC}"
    exit 1
fi

if [ ! -f "${BACKEND_SCRIPTS_DIR}/requirements.txt" ]; then
    cat > "${BACKEND_SCRIPTS_DIR}/requirements.txt" << EOF
boto3>=1.28.0
requests>=2.31.0
python-dotenv>=1.0.0
Pillow>=10.0.0
EOF
fi

# Create and activate virtual environment
VENV_DIR="${BACKEND_SCRIPTS_DIR}/../.venv"

if [ ! -d "$VENV_DIR" ]; then
    echo -e "${YELLOW}Creating virtual environment at ${VENV_DIR}...${NC}"
    python3 -m venv "$VENV_DIR"
fi

source "$VENV_DIR/bin/activate"

pip install -q -r "${BACKEND_SCRIPTS_DIR}/requirements.txt"
echo -e "${GREEN}✓ Dependencies installed${NC}"
echo ""

# Run population scripts
run_script() {
    local script=$1
    local description=$2
    local step=$3
    
    echo -e "${YELLOW}[${step}/7] ${description}...${NC}"
    
    if [ -f "${BACKEND_SCRIPTS_DIR}/data_population/${script}" ]; then
        # We process from the backend directory context for imports to work nicely if they are module based
        # or just point python to the absolute path
        # Assuming scripts/data_population/*.py are standalone or expect execution from some root. 
        # Usually python scripts are best run from backend/ to allow 'scripts.data_population' imports if used,
        # but here they seem standalone. Let's run them using absolute path.
        
        # We need to temporarily cd to BACKEND_SCRIPTS_DIR/.. (backend root) or BACKEND_SCRIPTS_DIR?
        # Let's check where they expect to be. If they import from 'scripts', they should be run from backend root.
        
        # Let's run from backend root to be safe
        (cd "${BACKEND_SCRIPTS_DIR}/.." && python3 "scripts/data_population/${script}")
        
        echo -e "${GREEN}✓ ${description} complete${NC}"
    else
        echo -e "${YELLOW}⚠️  scripts/data_population/${script} not found at ${BACKEND_SCRIPTS_DIR}/data_population/${script}, skipping${NC}"
    fi
    echo ""
}

# run_script "populate_images.py" "Uploading crop images to S3" "2"
run_script "populate_cv_results.py" "Generating CV classification results" "3"
run_script "populate_sensors.py" "Generating historical sensor data" "4"
run_script "populate_flights.py" "Creating flight logs" "5"
# run_script "populate_legal_docs.py" "Uploading legal documents" "6"
# run_script "generate_past_reports.py" "Generating past agent reports" "7"

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