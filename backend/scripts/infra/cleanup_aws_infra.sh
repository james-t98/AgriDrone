# scripts/infra/cleanup_aws_infra.sh
# Cleanup AgriDrone Demo Infrastructure

#!/bin/bash
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

PROJECT_NAME="agridrone-demo"
AWS_REGION="eu-west-1"
TERRAFORM_DIR="terraform"

echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${RED}║   AgriDrone AI Demo - Infrastructure Cleanup              ║${NC}"
echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""

# Warning
echo -e "${YELLOW}⚠️  WARNING: This will destroy ALL demo infrastructure!${NC}"
echo -e "${YELLOW}    - All S3 buckets and data${NC}"
echo -e "${YELLOW}    - All DynamoDB tables and data${NC}"
echo -e "${YELLOW}    - Lambda functions${NC}"
echo -e "${YELLOW}    - API Gateway${NC}"
echo -e "${YELLOW}    - CloudWatch logs${NC}"
echo -e "${YELLOW}    - SNS topics${NC}"
echo ""
echo -e "${RED}This action CANNOT be undone!${NC}"
echo ""

read -p "$(echo -e ${RED}Are you sure you want to continue? Type 'yes' to confirm: ${NC})" -r
echo ""

if [[ ! $REPLY == "yes" ]]; then
    echo -e "${GREEN}Cleanup cancelled. Infrastructure preserved.${NC}"
    exit 0
fi

echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo -e "${YELLOW}Starting cleanup process...${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════════════${NC}"
echo ""

# Get bucket names from Terraform output or use defaults
cd ${TERRAFORM_DIR}

S3_BUCKET_IMAGES=$(terraform output -raw s3_bucket_images 2>/dev/null || echo "${PROJECT_NAME}-images")
S3_BUCKET_REPORTS=$(terraform output -raw s3_bucket_reports 2>/dev/null || echo "${PROJECT_NAME}-reports")
S3_BUCKET_LEGAL=$(terraform output -raw s3_bucket_legal 2>/dev/null || echo "${PROJECT_NAME}-legal")

cd ..

# Empty S3 buckets
echo -e "${YELLOW}[1/6] Emptying S3 buckets...${NC}"

empty_bucket() {
    local bucket=$1
    if aws s3 ls "s3://${bucket}" 2>/dev/null; then
        echo "  Emptying: ${bucket}"
        aws s3 rm "s3://${bucket}" --recursive --region ${AWS_REGION} 2>/dev/null || true
        
        # Delete all versions (if versioning enabled)
        aws s3api list-object-versions \
            --bucket "${bucket}" \
            --region ${AWS_REGION} \
            --query 'Versions[].{Key:Key,VersionId:VersionId}' \
            --output json 2>/dev/null | \
        jq -r '.[] | "--key \(.Key) --version-id \(.VersionId)"' | \
        xargs -I {} aws s3api delete-object --bucket "${bucket}" --region ${AWS_REGION} {} 2>/dev/null || true
        
        # Delete delete markers
        aws s3api list-object-versions \
            --bucket "${bucket}" \
            --region ${AWS_REGION} \
            --query 'DeleteMarkers[].{Key:Key,VersionId:VersionId}' \
            --output json 2>/dev/null | \
        jq -r '.[] | "--key \(.Key) --version-id \(.VersionId)"' | \
        xargs -I {} aws s3api delete-object --bucket "${bucket}" --region ${AWS_REGION} {} 2>/dev/null || true
        
        echo -e "    ${GREEN}✓ ${bucket} emptied${NC}"
    else
        echo -e "    ${YELLOW}⊘ ${bucket} not found (may already be deleted)${NC}"
    fi
}

empty_bucket "${S3_BUCKET_IMAGES}"
empty_bucket "${S3_BUCKET_REPORTS}"
empty_bucket "${S3_BUCKET_LEGAL}"

echo -e "${GREEN}✓ S3 buckets emptied${NC}"
echo ""

# Delete ECR images
echo -e "${YELLOW}[2/6] Deleting ECR repository images...${NC}"

ECR_REPO_NAME="${PROJECT_NAME}-cv-model"

if aws ecr describe-repositories --repository-names ${ECR_REPO_NAME} --region ${AWS_REGION} &> /dev/null; then
    echo "  Deleting images in: ${ECR_REPO_NAME}"
    
    # Get all image IDs
    IMAGE_IDS=$(aws ecr list-images \
        --repository-name ${ECR_REPO_NAME} \
        --region ${AWS_REGION} \
        --query 'imageIds[*]' \
        --output json 2>/dev/null || echo "[]")
    
    if [ "$IMAGE_IDS" != "[]" ]; then
        aws ecr batch-delete-image \
            --repository-name ${ECR_REPO_NAME} \
            --region ${AWS_REGION} \
            --image-ids "$IMAGE_IDS" &> /dev/null || true
        echo -e "    ${GREEN}✓ Images deleted${NC}"
    else
        echo -e "    ${YELLOW}⊘ No images to delete${NC}"
    fi
else
    echo -e "  ${YELLOW}⊘ ECR repository not found${NC}"
fi

echo -e "${GREEN}✓ ECR cleanup complete${NC}"
echo ""

# Stop EventBridge rules
echo -e "${YELLOW}[3/6] Disabling EventBridge rules...${NC}"

RULE_NAME="${PROJECT_NAME}-sensor-schedule"

if aws events describe-rule --name ${RULE_NAME} --region ${AWS_REGION} &> /dev/null; then
    echo "  Removing targets from rule: ${RULE_NAME}"
    
    # Get target IDs
    TARGET_IDS=$(aws events list-targets-by-rule \
        --rule ${RULE_NAME} \
        --region ${AWS_REGION} \
        --query 'Targets[].Id' \
        --output text 2>/dev/null || echo "")
    
    if [ ! -z "$TARGET_IDS" ]; then
        aws events remove-targets \
            --rule ${RULE_NAME} \
            --region ${AWS_REGION} \
            --ids $TARGET_IDS &> /dev/null || true
    fi
    
    echo -e "    ${GREEN}✓ EventBridge rule disabled${NC}"
else
    echo -e "  ${YELLOW}⊘ EventBridge rule not found${NC}"
fi

echo -e "${GREEN}✓ EventBridge cleanup complete${NC}"
echo ""

# Delete CloudWatch log groups
echo -e "${YELLOW}[4/6] Deleting CloudWatch log groups...${NC}"

LOG_GROUPS=$(aws logs describe-log-groups \
    --log-group-name-prefix "/aws/lambda/${PROJECT_NAME}" \
    --region ${AWS_REGION} \
    --query 'logGroups[].logGroupName' \
    --output text 2>/dev/null || echo "")

if [ ! -z "$LOG_GROUPS" ]; then
    for log_group in $LOG_GROUPS; do
        echo "  Deleting: ${log_group}"
        aws logs delete-log-group \
            --log-group-name ${log_group} \
            --region ${AWS_REGION} 2>/dev/null || true
    done
    echo -e "${GREEN}✓ Log groups deleted${NC}"
else
    echo -e "${YELLOW}⊘ No log groups found${NC}"
fi
echo ""

# Destroy Terraform infrastructure
echo -e "${YELLOW}[5/6] Destroying Terraform infrastructure...${NC}"

cd ${TERRAFORM_DIR}

if [ -f "terraform.tfstate" ]; then
    terraform destroy \
        -var="aws_region=${AWS_REGION}" \
        -var="project_name=${PROJECT_NAME}" \
        -auto-approve
    
    echo -e "${GREEN}✓ Terraform infrastructure destroyed${NC}"
else
    echo -e "${YELLOW}⊘ No Terraform state found${NC}"
fi

cd ..
echo ""

# Clean up local files
echo -e "${YELLOW}[6/6] Cleaning up local files...${NC}"

if [ -f ".env" ]; then
    rm .env
    echo -e "  ${GREEN}✓ Deleted .env${NC}"
fi

if [ -f "scripts/config.json" ]; then
    rm scripts/config.json
    echo -e "  ${GREEN}✓ Deleted scripts/config.json${NC}"
fi

if [ -f "${TERRAFORM_DIR}/tfplan" ]; then
    rm ${TERRAFORM_DIR}/tfplan
    echo -e "  ${GREEN}✓ Deleted Terraform plan${NC}"
fi

echo -e "${GREEN}✓ Local cleanup complete${NC}"
echo ""

# Display summary
echo -e "${BLUE}╔════════════════════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║          Cleanup Completed Successfully!                   ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════════════════════╝${NC}"
echo ""
echo -e "${GREEN}✅ All infrastructure destroyed${NC}"
echo -e "${GREEN}✅ All data deleted${NC}"
echo -e "${GREEN}✅ All local files cleaned${NC}"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}💰 Cost Savings:${NC}"
echo -e "   No more charges will be incurred for this demo"
echo -e "   Estimated savings: €0.13/day (€3.83/month)"
echo ""
echo -e "${YELLOW}📝 Note:${NC}"
echo -e "   Some resources may take a few minutes to fully delete"
echo -e "   CloudWatch logs may persist for up to 24 hours"
echo ""
echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}To redeploy:${NC}"
echo -e "   ${GREEN}bash scripts/infra/deploy_aws_infra.sh${NC}"
echo ""
echo -e "${GREEN}Thank you for using AgriDrone AI Demo! 🚁🌾${NC}"
