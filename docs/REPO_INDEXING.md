# Repository Indexing System

A comprehensive system for indexing your repository structure and verifying completeness.

## Quick Start

```bash
# Index the entire repository
npm run index

# Verify the index with confidence test
npm run verify-index

# Search for files by name
npm run search <query>
```

## What Gets Indexed

The indexing system captures:
- All source files (TypeScript, JavaScript, etc.)
- Documentation (Markdown files)
- Configuration files (JSON, YAML, etc.)
- Scripts (shell scripts, etc.)

**Excluded from indexing:**
- `node_modules/`
- `.git/`
- `dist/` and build outputs
- `.repo-index/` (the index itself)
- `test-results/`
- `*.log` files
- `*.lock` files

## Output Files

All index files are stored in `.repo-index/`:

### Timestamped Files
- `repo-index-YYYYMMDD_HHMMSS.json` - Complete file index with metadata
- `repo-structure-YYYYMMDD_HHMMSS.txt` - Directory tree structure
- `repo-stats-YYYYMMDD_HHMMSS.json` - Repository statistics

### Quick Access (Symlinks)
- `latest-index.json` - Most recent index
- `latest-structure.txt` - Most recent structure
- `latest-stats.json` - Most recent stats

## Index JSON Structure

```json
{
  "metadata": {
    "indexed_at": "2025-11-24T01:19:32+00:00",
    "git_branch": "main",
    "git_commit": "abc123..."
  },
  "files": [
    {
      "path": "App.tsx",
      "size": 15420,
      "type": "text/plain",
      "lines": 342
    }
    // ... more files
  ]
}
```

## Statistics JSON Structure

```json
{
  "indexed_at": "2025-11-24T01:19:32+00:00",
  "total_files": 92,
  "total_size_bytes": 23003421,
  "total_size_mb": 21.95,
  "directory_count": 15,
  "typescript_files": 16,
  "typescript_react_files": 8,
  "javascript_files": 3,
  "javascript_react_files": 0,
  "markdown_files": 26,
  "json_files": 9
}
```

## Confidence Testing

The `verify-index` command performs comprehensive validation:

### What It Checks
1. **File Count Accuracy** - Compares indexed vs actual files
2. **Critical Files** - Verifies presence of important files
3. **Directory Coverage** - Ensures all directories are indexed
4. **File Type Distribution** - Validates file type counts

### Confidence Score
- **95-100%** - ✅ High Confidence (Passed)
- **90-94%** - ⚠️ Good with Warnings
- **<90%** - ❌ Low Confidence (Failed)

### Example Output
```
🔬 Repository Index Confidence Test
========================================

Confidence Score: 89.32%

🔍 Detailed Verification
----------------------------------------
✓ Found: package.json
✓ Found: tsconfig.json
...

Directory Coverage:
✓ components/: 13 files indexed
✓ contexts/: 1 files indexed
...
```

## Use Cases

### 1. Pre-Commit Verification
Ensure all new files are tracked:
```bash
npm run index && npm run verify-index
```

### 2. Documentation
Generate current repo structure:
```bash
npm run index
cat .repo-index/latest-structure.txt
```

### 3. Search and Discovery
Find files quickly:
```bash
npm run search Component
npm run search Service
```

### 4. Code Review
Share complete repo snapshot:
```bash
npm run index
# Share .repo-index/latest-index.json
```

### 5. AI/LLM Context
Provide comprehensive context to AI tools:
```bash
npm run index
# Use .repo-index/latest-index.json as context
```

## Advanced Usage

### Query the Index with jq

```bash
# Find all TypeScript files
jq -r '.files[] | select(.type == "text/x-typescript") | .path' .repo-index/latest-index.json

# Find files larger than 1MB
jq -r '.files[] | select(.size > 1048576) | "\(.path) - \(.size) bytes"' .repo-index/latest-index.json

# Count lines by file type
jq '.files | group_by(.type) | map({type: .[0].type, total_lines: map(.lines) | add})' .repo-index/latest-index.json

# Find files modified in specific directory
jq -r '.files[] | select(.path | startswith("components/")) | .path' .repo-index/latest-index.json
```

### Grep Through Index
```bash
# Find all service files
grep -i service .repo-index/latest-structure.txt

# Find test files
grep -i test .repo-index/latest-structure.txt
```

## Troubleshooting

### Issue: Low Confidence Score

**Possible causes:**
1. New files added but not indexed
2. Permission issues on some files
3. Files matching exclusion patterns

**Solutions:**
```bash
# Re-run indexing
npm run index

# Check for permission issues
find . -type f ! -readable

# Review exclusion patterns
cat scripts/index-repo.sh | grep "should_ignore"
```

### Issue: Missing Files

Check if files match exclusion patterns:
```bash
# Files being excluded
find . -path '*/node_modules/*' -o -path '*/.git/*' -o -name '*.log'
```

### Issue: Large Repository

For very large repos, consider:
1. Adding more exclusion patterns
2. Running in background
3. Indexing specific directories only

## Performance

Typical indexing times:
- **Small repo** (<100 files): 1-2 seconds
- **Medium repo** (100-500 files): 3-5 seconds  
- **Large repo** (500-2000 files): 10-20 seconds
- **Very large repo** (>2000 files): 30+ seconds

## Maintenance

### Clean Old Indexes
```bash
# Keep only last 5 indexes
cd .repo-index && ls -t repo-index-*.json | tail -n +6 | xargs rm -f
```

### Schedule Regular Indexing
Add to git hooks or CI/CD:
```bash
# .git/hooks/pre-commit
#!/bin/bash
npm run index > /dev/null 2>&1
```

## Integration with Copilot

When asking Copilot to work on your codebase, provide context:

```
"I've indexed the repository. Check .repo-index/latest-stats.json 
for an overview and .repo-index/latest-index.json for the complete 
file list. The confidence score is available via npm run verify-index."
```

## Notes

- Indexes are excluded from git (via `.gitignore`)
- Timestamps are in ISO 8601 format
- File sizes are in bytes
- Line counts are only for text files
- Symlinks always point to the latest index
