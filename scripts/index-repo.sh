#!/bin/bash
# Repository Indexing Script - Simplified version
# Creates a comprehensive index of the repository structure and content

OUTPUT_DIR=".repo-index"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
INDEX_FILE="$OUTPUT_DIR/repo-index-$TIMESTAMP.json"
STRUCTURE_FILE="$OUTPUT_DIR/repo-structure-$TIMESTAMP.txt"
STATS_FILE="$OUTPUT_DIR/repo-stats-$TIMESTAMP.json"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🔍 Repository Indexing Started${NC}"
echo "Timestamp: $(date)"
echo "----------------------------------------"

# Create output directory
mkdir -p "$OUTPUT_DIR"

# Function to check if path should be ignored
should_ignore() {
    local path="$1"
    case "$path" in
        */node_modules/*|*/dist/*|*/.git/*|*/.repo-index/*|*/test-results/*|*.log|*.lock)
            return 0 ;;
        *)
            return 1 ;;
    esac
}

echo -e "${BLUE}📊 Generating repository structure...${NC}"
# Generate tree structure
find . -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' \
    -not -path '*/.repo-index/*' -not -path '*/test-results/*' | \
    sed 's|^\./||' | sort > "$STRUCTURE_FILE"

echo -e "${BLUE}📝 Indexing files...${NC}"
# Initialize JSON structure
cat > "$INDEX_FILE" << 'HEADER'
{
  "metadata": {
HEADER

echo "    \"indexed_at\": \"$(date -Iseconds)\"," >> "$INDEX_FILE"
echo "    \"git_branch\": \"$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo 'unknown')\"," >> "$INDEX_FILE"
echo "    \"git_commit\": \"$(git rev-parse HEAD 2>/dev/null || echo 'unknown')\"" >> "$INDEX_FILE"

cat >> "$INDEX_FILE" << 'HEADER2'
  },
  "files": [
HEADER2

# Find all files and create index
FILE_COUNT=0
TOTAL_SIZE=0
FIRST_FILE=true
TEMP_FILE="$OUTPUT_DIR/temp_files.txt"

# Create temporary file list
find . -type f -not -path '*/node_modules/*' -not -path '*/.git/*' \
    -not -path '*/dist/*' -not -path '*/.repo-index/*' -not -path '*/test-results/*' \
    -not -name '*.log' -not -name '*.lock' > "$TEMP_FILE"

TOTAL_FILES=$(wc -l < "$TEMP_FILE" | tr -d ' ')
echo "Found $TOTAL_FILES files to index..."

while IFS= read -r file; do
    # Get file info
    RELATIVE_PATH="${file#./}"
    FILE_SIZE=$(stat -c%s "$file" 2>/dev/null || echo "0")
    FILE_TYPE=$(file -b --mime-type "$file" 2>/dev/null || echo "unknown")
    LINE_COUNT=0
    
    # Count lines for text files
    case "$file" in
        *.tsx|*.ts|*.jsx|*.js|*.json|*.md|*.sh|*.txt|*.cjs|*.mjs|*.css|*.html)
            LINE_COUNT=$(wc -l < "$file" 2>/dev/null | tr -d ' ' || echo "0")
            ;;
    esac
    
    if [[ "$FILE_TYPE" == text/* ]]; then
        LINE_COUNT=$(wc -l < "$file" 2>/dev/null | tr -d ' ' || echo "0")
    fi
    
    # Add comma for all but first entry
    if [ "$FIRST_FILE" = true ]; then
        FIRST_FILE=false
    else
        echo "," >> "$INDEX_FILE"
    fi
    
    # Escape special characters in path for JSON
    ESCAPED_PATH=$(echo "$RELATIVE_PATH" | sed 's/\\/\\\\/g' | sed 's/"/\\"/g')
    
    # Write file entry to JSON
    printf '    {\n      "path": "%s",\n      "size": %d,\n      "type": "%s",\n      "lines": %d\n    }' \
        "$ESCAPED_PATH" "$FILE_SIZE" "$FILE_TYPE" "$LINE_COUNT" >> "$INDEX_FILE"
    
    ((FILE_COUNT++))
    TOTAL_SIZE=$((TOTAL_SIZE + FILE_SIZE))
    
    # Progress indicator
    if ((FILE_COUNT % 10 == 0)); then
        echo -ne "\rIndexed: $FILE_COUNT/$TOTAL_FILES files"
    fi
done < "$TEMP_FILE"

echo -ne "\rIndexed: $FILE_COUNT/$TOTAL_FILES files\n"

# Close JSON structure
cat >> "$INDEX_FILE" << 'FOOTER'

  ]
}
FOOTER

# Calculate MB using awk instead of bc
TOTAL_MB=$(awk "BEGIN {printf \"%.2f\", $TOTAL_SIZE / 1048576}")

# Generate statistics
echo -e "${BLUE}📈 Generating statistics...${NC}"

TS_COUNT=$(find . -name "*.ts" -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | wc -l | tr -d ' ')
TSX_COUNT=$(find . -name "*.tsx" -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | wc -l | tr -d ' ')
JS_COUNT=$(find . -name "*.js" -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | wc -l | tr -d ' ')
JSX_COUNT=$(find . -name "*.jsx" -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | wc -l | tr -d ' ')
MD_COUNT=$(find . -name "*.md" -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | wc -l | tr -d ' ')
JSON_COUNT=$(find . -name "*.json" -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' | wc -l | tr -d ' ')
DIR_COUNT=$(find . -type d -not -path '*/node_modules/*' -not -path '*/.git/*' -not -path '*/dist/*' -not -path '*/.repo-index/*' | wc -l | tr -d ' ')

cat > "$STATS_FILE" << EOF
{
  "indexed_at": "$(date -Iseconds)",
  "total_files": $FILE_COUNT,
  "total_size_bytes": $TOTAL_SIZE,
  "total_size_mb": $TOTAL_MB,
  "directory_count": $DIR_COUNT,
  "typescript_files": $TS_COUNT,
  "typescript_react_files": $TSX_COUNT,
  "javascript_files": $JS_COUNT,
  "javascript_react_files": $JSX_COUNT,
  "markdown_files": $MD_COUNT,
  "json_files": $JSON_COUNT
}
EOF

# Create symlink to latest
ln -sf "$(basename "$INDEX_FILE")" "$OUTPUT_DIR/latest-index.json"
ln -sf "$(basename "$STRUCTURE_FILE")" "$OUTPUT_DIR/latest-structure.txt"
ln -sf "$(basename "$STATS_FILE")" "$OUTPUT_DIR/latest-stats.json"

# Cleanup
rm -f "$TEMP_FILE"

echo -e "${GREEN}✅ Indexing Complete!${NC}"
echo "----------------------------------------"
echo "Files indexed: $FILE_COUNT"
echo "Total size: ${TOTAL_MB} MB"
echo ""
echo "Generated files:"
echo "  - Index: $INDEX_FILE"
echo "  - Structure: $STRUCTURE_FILE"
echo "  - Stats: $STATS_FILE"
echo ""
echo "Quick access via symlinks:"
echo "  - $OUTPUT_DIR/latest-index.json"
echo "  - $OUTPUT_DIR/latest-structure.txt"
echo "  - $OUTPUT_DIR/latest-stats.json"
