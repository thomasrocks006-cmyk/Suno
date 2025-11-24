#!/bin/bash
# Display repository index summary in a readable format

OUTPUT_DIR=".repo-index"
STATS_FILE="$OUTPUT_DIR/latest-stats.json"
INDEX_FILE="$OUTPUT_DIR/latest-index.json"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

if [ ! -f "$STATS_FILE" ] || [ ! -f "$INDEX_FILE" ]; then
    echo -e "${YELLOW}⚠️  No index found. Run 'npm run index' first.${NC}"
    exit 1
fi

echo -e "${BLUE}╔════════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Repository Index Summary              ║${NC}"
echo -e "${BLUE}╚════════════════════════════════════════════╝${NC}"
echo ""

# Read stats
TOTAL_FILES=$(jq -r '.total_files' "$STATS_FILE")
TOTAL_SIZE=$(jq -r '.total_size_mb' "$STATS_FILE")
TS_FILES=$(jq -r '.typescript_files' "$STATS_FILE")
TSX_FILES=$(jq -r '.typescript_react_files' "$STATS_FILE")
JS_FILES=$(jq -r '.javascript_files' "$STATS_FILE")
MD_FILES=$(jq -r '.markdown_files' "$STATS_FILE")
JSON_FILES=$(jq -r '.json_files' "$STATS_FILE")
DIR_COUNT=$(jq -r '.directory_count' "$STATS_FILE")
INDEXED_AT=$(jq -r '.indexed_at' "$STATS_FILE")

# Display overview
echo -e "${CYAN}📊 Overview${NC}"
echo "  Total Files: $TOTAL_FILES"
echo "  Total Size: $TOTAL_SIZE MB"
echo "  Directories: $DIR_COUNT"
echo "  Indexed: $INDEXED_AT"
echo ""

# Display breakdown
echo -e "${CYAN}📁 File Types${NC}"
echo "  TypeScript: $TS_FILES files"
echo "  TSX/React: $TSX_FILES files"
echo "  JavaScript: $JS_FILES files"
echo "  Markdown: $MD_FILES files"
echo "  JSON: $JSON_FILES files"
echo ""

# Top 5 largest files
echo -e "${CYAN}📏 Largest Files${NC}"
jq -r '.files | sort_by(.size) | reverse | .[0:5] | .[] | "  \(.path) - \(.size) bytes"' "$INDEX_FILE"
echo ""

# Top 5 longest files (by lines)
echo -e "${CYAN}📝 Longest Files${NC}"
jq -r '.files | sort_by(.lines) | reverse | .[0:5] | .[] | "  \(.path) - \(.lines) lines"' "$INDEX_FILE"
echo ""

# Directory breakdown
echo -e "${CYAN}🗂️  Directory Breakdown${NC}"
for dir in components contexts services tests docs scripts; do
    if [ -d "$dir" ]; then
        COUNT=$(jq -r ".files[] | select(.path | startswith(\"$dir/\")) | .path" "$INDEX_FILE" | wc -l | tr -d ' ')
        if [ "$COUNT" -gt 0 ]; then
            echo "  $dir/: $COUNT files"
        fi
    fi
done
echo ""

# Total lines of code
TOTAL_LINES=$(jq '[.files[].lines] | add' "$INDEX_FILE")
echo -e "${CYAN}📊 Statistics${NC}"
echo "  Total Lines: $TOTAL_LINES"
echo "  Avg Lines/File: $(awk "BEGIN {printf \"%.0f\", $TOTAL_LINES / $TOTAL_FILES}")"
echo ""

echo -e "${GREEN}✅ Index is ready for use${NC}"
echo ""
echo "Use these commands:"
echo "  npm run verify-index  - Check completeness"
echo "  npm run search <term> - Search files"
echo "  cat $INDEX_FILE | jq - View full index"
