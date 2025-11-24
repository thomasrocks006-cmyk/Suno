#!/bin/bash
# Quick search through indexed repository
# Usage: npm run search <query>

OUTPUT_DIR=".repo-index"
LATEST_INDEX="$OUTPUT_DIR/latest-index.json"

if [ ! -f "$LATEST_INDEX" ]; then
    echo "❌ No index found. Run 'npm run index' first."
    exit 1
fi

QUERY="$1"

if [ -z "$QUERY" ]; then
    echo "Usage: npm run search <query>"
    exit 1
fi

echo "🔍 Searching for: $QUERY"
echo "----------------------------------------"

# Search in file paths
jq -r ".files[] | select(.path | contains(\"$QUERY\")) | \"📄 \" + .path + \" (\" + (.lines|tostring) + \" lines)\"" "$LATEST_INDEX"

echo ""
echo "Search complete. For content search, use: grep -r '$QUERY' ."
