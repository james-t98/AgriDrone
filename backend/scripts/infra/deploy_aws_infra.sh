#!/bin/bash
# scripts/infra/deploy_aws_infra.sh
# Deploy AgriDrone Demo Infrastructure

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="agridrone-demo"
AWS_REGION="eu-west-1"
ALERT_EMAIL="${ALERT_EMAIL:-[email protected]}"

# Get the script directory for absolute path resolution
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TERRAFORM_DIR="${SCRIPT_DIR}/../../terraform"

echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   AgriDrone AI Demo - Infrastructure Deployment           ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Check prerequisites
echo -e "${YELLOW}[1/7] Checking prerequisites...${NC}"

if ! command -v terraform &> /dev/null; then
    echo -e "${RED}❌ Terraform not found. Please install: https://www.terraform.io/downloads${NC}"
    exit 1
fi

if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI not found. Please install: https://aws.amazon.com/cli/${NC}"
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker not found. Please install: https://docs.docker.com/get-docker/${NC}"
    exit 1
fi

# Check AWS credentials
if ! aws sts get-caller-identity &> /dev/null; then
    echo -e "${RED}❌ AWS credentials not configured. Run 'aws configure'${NC}"
    exit 1
fi

AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo -e "${GREEN}✓ AWS Account: ${AWS_ACCOUNT_ID}${NC}"
echo -e "${GREEN}✓ Region: ${AWS_REGION}${NC}"
echo -e "${GREEN}✓ All prerequisites met${NC}"
echo ""

# Build and push CV model Docker image (if Dockerfile exists)
echo -e "${YELLOW}[2/7] Checking CV model Docker image setup...${NC}"

ECR_REPO_NAME="${PROJECT_NAME}-cv-model"
ECR_URI="${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}"

# Note: ECR repository is created by Terraform, not here
# We'll build and push the Docker image after Terraform creates the ECR repo

if [ -d "lambda/cv_inference" ]; then
    echo -e "${BLUE}ℹ️  CV inference Docker directory found. Will build after Terraform creates ECR.${NC}"
    BUILD_CV_IMAGE=true
else
    echo -e "${YELLOW}⚠ lambda/cv_inference directory not found. Skipping Docker build.${NC}"
    BUILD_CV_IMAGE=false
fi
echo ""

# Initialize Terraform
echo -e "${YELLOW}[3/7] Initializing Terraform...${NC}"
cd "${TERRAFORM_DIR}"

if [ ! -f "terraform.tfstate" ]; then
    terraform init
else
    terraform init -upgrade
fi
echo -e "${GREEN}✓ Terraform initialized${NC}"
echo ""

# Check if ECR repo exists in AWS but not in Terraform state - if so, import it
echo -e "${YELLOW}Checking for existing ECR repository...${NC}"
if aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --region ${AWS_REGION} &> /dev/null; then
    # Check if it's already in the Terraform state
    if ! terraform state show module.lambda_functions.aws_ecr_repository.cv_model &> /dev/null; then
        echo -e "${BLUE}ℹ️  ECR repository exists but not in Terraform state. Importing...${NC}"
        terraform import module.lambda_functions.aws_ecr_repository.cv_model ${ECR_REPO_NAME} || true
        echo -e "${GREEN}✓ ECR repository imported${NC}"
    else
        echo -e "${GREEN}✓ ECR repository already in Terraform state${NC}"
    fi
else
    echo -e "${YELLOW}⊘ ECR repository does not exist yet (Terraform will create it)${NC}"
fi
echo ""

# Validate Terraform configuration
echo -e "${YELLOW}[4/7] Validating Terraform configuration...${NC}"
terraform validate
echo -e "${GREEN}✓ Terraform configuration valid${NC}"
echo ""

# Plan deployment
echo -e "${YELLOW}[5/7] Planning infrastructure deployment...${NC}"
terraform plan \
    -var="aws_region=${AWS_REGION}" \
    -var="project_name=${PROJECT_NAME}" \
    -var="alert_email=${ALERT_EMAIL}" \
    -out=tfplan

echo -e "${GREEN}✓ Terraform plan created${NC}"
echo ""

# Confirm deployment
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Ready to deploy infrastructure. Estimated monthly cost: €3.83${NC}"
echo -e "${YELLOW}Daily cost (on-demand): €0.13${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
read -p "$(echo -e ${YELLOW}Proceed with deployment? [y/N]: ${NC})" -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${RED}Deployment cancelled${NC}"
    cd ..
    exit 0
fi

# Apply infrastructure
echo -e "${YELLOW}[6/7] Deploying infrastructure...${NC}"
terraform apply tfplan

echo -e "${GREEN}✓ Infrastructure deployed successfully${NC}"
echo ""

# Extract outputs
echo -e "${YELLOW}[7/7] Extracting deployment outputs...${NC}"

API_GATEWAY_URL=$(terraform output -raw api_gateway_url 2>/dev/null || echo "")
S3_BUCKET_IMAGES=$(terraform output -raw s3_bucket_images 2>/dev/null || echo "")
S3_BUCKET_REPORTS=$(terraform output -raw s3_bucket_reports 2>/dev/null || echo "")
S3_BUCKET_LEGAL=$(terraform output -raw s3_bucket_legal 2>/dev/null || echo "")
SNS_TOPIC_ARN=$(terraform output -raw sns_topic_arn 2>/dev/null || echo "")

cd ..

# Generate .env file at application root
echo -e "${YELLOW}Generating .env file...${NC}"

# Get the application root directory (4 levels up from terraform: terraform -> backend -> scripts -> infra)
APP_ROOT_DIR="${SCRIPT_DIR}/../../.."

cat > "${APP_ROOT_DIR}/.env" << EOF
# AgriDrone Demo - Environment Variables
# Generated on $(date)

# API Gateway
VITE_API_GATEWAY_URL=${API_GATEWAY_URL}

# AWS Configuration
VITE_AWS_REGION=${AWS_REGION}
VITE_AWS_ACCOUNT_ID=${AWS_ACCOUNT_ID}

# S3 Buckets
VITE_S3_BUCKET_IMAGES=${S3_BUCKET_IMAGES}
VITE_S3_BUCKET_REPORTS=${S3_BUCKET_REPORTS}
VITE_S3_BUCKET_LEGAL=${S3_BUCKET_LEGAL}

# Feature Flags
VITE_ENABLE_REALTIME_SENSORS=true
VITE_ENABLE_VIDEO_CLASSIFICATION=true

# Demo Configuration
VITE_FARM_ID=NL_Farm_001
VITE_FIELD_ZONES=Zone_1,Zone_2,Zone_3

# CrewAI Platform (configure manually)
# VITE_CREWAI_WORKSPACE_URL=https://app.crewai.com/workspace/agridrone-demo
EOF

echo -e "${GREEN}✓ .env file created at ${APP_ROOT_DIR}/.env${NC}"
echo ""

# Generate backend config for scripts
cat > scripts/config.json << EOF
{
  "aws_region": "${AWS_REGION}",
  "s3_bucket_images": "${S3_BUCKET_IMAGES}",
  "s3_bucket_reports": "${S3_BUCKET_REPORTS}",
  "s3_bucket_legal": "${S3_BUCKET_LEGAL}",
  "dynamodb_tables": {
    "cv_results": "${PROJECT_NAME}-cv-results",
    "sensor_data": "${PROJECT_NAME}-sensor-data",
    "flight_logs": "${PROJECT_NAME}-flight-logs",
    "agent_outputs": "${PROJECT_NAME}-agent-outputs"
  },
  "farm_id": "NL_Farm_001"
}
EOF

echo -e "${GREEN}✓ scripts/config.json created${NC}"
echo ""

# Display deployment summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║            Deployment Completed Successfully!              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}📡 API Gateway URL:${NC}"
echo -e "   ${API_GATEWAY_URL}"
echo ""
echo -e "${GREEN}🪣 S3 Buckets:${NC}"
echo -e "   Images:  ${S3_BUCKET_IMAGES}"
echo -e "   Reports: ${S3_BUCKET_REPORTS}"
echo -e "   Legal:   ${S3_BUCKET_LEGAL}"
echo ""
echo -e "${GREEN}🔔 SNS Topic ARN:${NC}"
echo -e "   ${SNS_TOPIC_ARN}"
echo ""
echo -e "${YELLOW}⚠️  Important: SNS email subscription confirmation required${NC}"
echo -e "   Check ${ALERT_EMAIL} for confirmation email"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Next Steps:${NC}"
echo -e "  1. Confirm SNS email subscription (check inbox)"
echo -e "  2. Run: ${GREEN}bash scripts/infra/populate_data.sh${NC}"
echo -e "  3. Configure CrewAI Platform with agents YAML"
echo -e "  4. Start frontend: ${GREEN}cd frontend && npm run dev${NC}"
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo ""
echo -e "${GREEN}💰 Estimated Costs:${NC}"
echo -e "   Monthly (full): €3.83"
echo -e "   Daily: €0.13"
echo -e "   8-hour session: €0.04"
echo ""
echo -e "${YELLOW}🧹 To destroy infrastructure when done:${NC}"
echo -e "   ${GREEN}bash scripts/infra/cleanup_aws_infra.sh${NC}"
echo ""
echo -e "${GREEN}✨ Happy demoing!${NC}"