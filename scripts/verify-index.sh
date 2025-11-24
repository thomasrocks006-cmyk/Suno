#!/bin/bash
# Confidence Test for Repository Indexing
# Verifies that the index captured all expected files

set -e

OUTPUT_DIR=".repo-index"
LATEST_INDEX="$OUTPUT_DIR/latest-index.json"
LATEST_STATS="$OUTPUT_DIR/latest-stats.json"

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔬 Repository Index Confidence Test${NC}"
echo "========================================"
echo ""

if [ ! -f "$LATEST_INDEX" ]; then
    echo -e "${RED}❌ No index found. Run 'npm run index' first.${NC}"
    exit 1
fi

# Count actual files
echo -e "${BLUE}Counting actual files in repository...${NC}"
ACTUAL_COUNT=$(find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' -not -path '*/.repo-index/*' -not -path '*/test-results/*' | wc -l | xargs)
echo "Actual files (excluding ignored): $ACTUAL_COUNT"

# Count indexed files
echo -e "${BLUE}Counting indexed files...${NC}"
INDEXED_COUNT=$(jq '.files | length' "$LATEST_INDEX")
echo "Indexed files: $INDEXED_COUNT"

# Calculate confidence
CONFIDENCE=0
if [ "$ACTUAL_COUNT" -gt 0 ]; then
    CONFIDENCE=$(awk "BEGIN {printf \"%.2f\", ($INDEXED_COUNT / $ACTUAL_COUNT) * 100}")
fi

echo ""
echo "========================================"
echo -e "${BLUE}Confidence Score: ${GREEN}${CONFIDENCE}%${NC}"
echo "========================================"
echo ""

# Detailed checks
echo -e "${BLUE}🔍 Detailed Verification${NC}"
echo "----------------------------------------"

# Check for critical files
CRITICAL_FILES=(
    "package.json"
    "tsconfig.json"
    "vite.config.ts"
    "README.md"
    "App.tsx"
    "index.tsx"
)

MISSING_CRITICAL=0
for file in "${CRITICAL_FILES[@]}"; do
    if jq -e ".files[] | select(.path == \"$file\")" "$LATEST_INDEX" > /dev/null 2>&1; then
        echo -e "${GREEN}✓${NC} Found: $file"
    else
        echo -e "${RED}✗${NC} Missing: $file"
        ((MISSING_CRITICAL++))
    fi
done

echo ""
echo "----------------------------------------"

# Check for common directories
echo -e "${BLUE}Directory Coverage:${NC}"
DIRS=("components" "contexts" "services" "tests" "docs" "scripts")
MISSING_DIRS=0

for dir in "${DIRS[@]}"; do
    if [ -d "$dir" ]; then
        COUNT=$(jq -r ".files[] | select(.path | startswith(\"$dir/\")) | .path" "$LATEST_INDEX" | wc -l | xargs)
        if [ "$COUNT" -gt 0 ]; then
            echo -e "${GREEN}✓${NC} $dir/: $COUNT files indexed"
        else
            echo -e "${YELLOW}⚠${NC} $dir/: No files indexed"
            ((MISSING_DIRS++))
        fi
    fi
done

echo ""
echo "----------------------------------------"

# File type distribution
echo -e "${BLUE}File Type Distribution:${NC}"
if [ -f "$LATEST_STATS" ]; then
    echo "TypeScript: $(jq -r '.typescript_files' "$LATEST_STATS") files"
    echo "JavaScript: $(jq -r '.javascript_files' "$LATEST_STATS") files"
    echo "Markdown: $(jq -r '.markdown_files' "$LATEST_STATS") files"
    echo "JSON: $(jq -r '.json_files' "$LATEST_STATS") files"
fi

echo ""
echo "========================================"
echo -e "${BLUE}📊 Final Assessment${NC}"
echo "========================================"

# Determine overall status
PASSED=true
WARNINGS=()

CONF_CHECK=$(awk "BEGIN {print ($CONFIDENCE < 95)}")
if [ "$CONF_CHECK" = "1" ]; then
    WARNINGS+=("Confidence below 95%")
    CONF_CHECK_90=$(awk "BEGIN {print ($CONFIDENCE < 90)}")
    if [ "$CONF_CHECK_90" = "1" ]; then
        PASSED=false
    fi
fi

if [ "$MISSING_CRITICAL" -gt 0 ]; then
    WARNINGS+=("$MISSING_CRITICAL critical files missing")
    PASSED=false
fi

if [ "$MISSING_DIRS" -gt 2 ]; then
    WARNINGS+=("Multiple expected directories have no indexed files")
fi

# Check for significant discrepancy
DIFF=$((ACTUAL_COUNT - INDEXED_COUNT))
DIFF_ABS=${DIFF#-}
if [ "$DIFF_ABS" -gt 5 ]; then
    WARNINGS+=("File count discrepancy: $DIFF files")
fi

# Print results
echo ""
if [ "$PASSED" = true ] && [ ${#WARNINGS[@]} -eq 0 ]; then
    echo -e "${GREEN}✅ PASSED - High Confidence${NC}"
    echo "The index appears to have captured all repository files successfully."
elif [ "$PASSED" = true ]; then
    echo -e "${YELLOW}⚠️  PASSED WITH WARNINGS${NC}"
    for warning in "${WARNINGS[@]}"; do
        echo "  • $warning"
    done
else
    echo -e "${RED}❌ FAILED - Low Confidence${NC}"
    echo "The index may be incomplete. Issues found:"
    for warning in "${WARNINGS[@]}"; do
        echo "  • $warning"
    done
    echo ""
    echo "Suggested actions:"
    echo "  1. Check for permission issues"
    echo "  2. Verify .gitignore patterns"
    echo "  3. Re-run: npm run index"
fi

echo ""
echo "Detailed reports available at:"
echo "  - $OUTPUT_DIR/latest-index.json"
echo "  - $OUTPUT_DIR/latest-stats.json"
echo "  - $OUTPUT_DIR/latest-structure.txt"
echo ""

# Exit with appropriate code
if [ "$PASSED" = true ]; then
    exit 0
else
    exit 1
fi
