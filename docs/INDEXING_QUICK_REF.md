# Quick Reference: Repository Indexing

## Commands

```bash
npm run index          # Index entire repository
npm run verify-index   # Run confidence test
npm run search <query> # Search indexed files
```

## View Index Data

```bash
# Structure
cat .repo-index/latest-structure.txt

# Statistics  
cat .repo-index/latest-stats.json | jq

# Full index
cat .repo-index/latest-index.json | jq
```

## Common Queries

```bash
# All TypeScript files
jq -r '.files[] | select(.path | endswith(".tsx") or endswith(".ts")) | .path' .repo-index/latest-index.json

# Files over 100 lines
jq -r '.files[] | select(.lines > 100) | "\(.path) - \(.lines) lines"' .repo-index/latest-index.json

# Components
jq -r '.files[] | select(.path | startswith("components/")) | .path' .repo-index/latest-index.json

# Largest files
jq -r '.files | sort_by(.size) | reverse | .[0:10] | .[] | "\(.path) - \(.size) bytes"' .repo-index/latest-index.json
```

## Confidence Score Guide

- **95-100%** ✅ Excellent
- **90-94%** ⚠️ Good  
- **<90%** ❌ Needs review

## Files Excluded

- `node_modules/`
- `.git/`
- `dist/`
- `.repo-index/`
- `test-results/`
- `*.log`
- `*.lock`

## Integration with Copilot

```
"I've indexed the repo. Check .repo-index/latest-stats.json"
"Show me all files with TODO comments based on the index"
"Which components are the largest according to the index?"
```

## Troubleshooting

```bash
# Re-index if issues
npm run index

# Check for missing files
find . -type f | wc -l
jq '.files | length' .repo-index/latest-index.json

# View exclusion patterns
cat scripts/index-repo.sh | grep -A 10 "should_ignore"
```
