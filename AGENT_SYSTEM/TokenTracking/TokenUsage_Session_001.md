# Token Limit Tracking System

**Created:** November 25, 2025, 12:16 PM  
**Purpose:** Monitor Claude 4.5 Sonnet token usage and trigger refresh at 80% capacity  
**Token Window:** 1,000,000 tokens (1M)  
**Critical Threshold:** 800,000 tokens (80%)

---

## Current Session Metrics

**Prompt #3 of 5 Milestone Cycle**

### Token Usage Log

| Timestamp | Prompt | Input Tokens | Output Tokens | Cumulative | % of Limit | Status |
|-----------|--------|--------------|---------------|------------|------------|---------|
| 12:05 PM  | #1     | ~5,000       | ~3,000        | 8,000      | 0.8%       | ✅ Safe |
| 12:10 PM  | #2     | ~8,000       | ~12,000       | 28,000     | 2.8%       | ✅ Safe |
| 12:16 PM  | #3     | ~15,000      | ~18,000       | 61,000     | 6.1%       | ✅ Safe |

**Current Total:** 61,000 / 1,000,000 tokens (6.1%)  
**Remaining Capacity:** 939,000 tokens  
**Prompts Until 80%:** ~37 prompts at current average (16.5K/prompt)

---

## Automatic Refresh Protocol

### Trigger Conditions
When cumulative tokens reach **800,000 (80%)**, automatically execute:

#### 1. Hard Repository Re-Index (5-10 minutes)
```bash
cd /workspaces/Suno
npm run index
```
- Create new snapshot: `RepoIndex_[DATE]_[TIME].md`
- Archive old index to `AGENT_SYSTEM/RepoIndexes/archive/`
- Update reference in agent memory

#### 2. Memory File Consolidation (2 minutes)
- Archive current `AgentMemory_CURRENT.md` → `AgentMemory_[SESSION_ID].md`
- Create new `AgentMemory_CURRENT.md` with:
  - Executive summary of session (200 words)
  - Links to archived memories
  - Critical decisions carried forward
  - Current task status

#### 3. Working Files Re-Read (3 minutes)
Extract file paths from `AgentMemory_CURRENT.md` and re-read:
- All files listed in "Files Created" section
- All files listed in "Files Modified" section
- Master plan documents (Parts 1-4)
- Agent instructions

#### 4. Context Compression (1 minute)
- Summarize last 20 prompts into 500-word executive summary
- Store in `AGENT_SYSTEM/SessionSummaries/Session_[ID]_Summary.md`
- Clear non-essential context from active memory

#### 5. Validation Check (1 minute)
- Confirm all critical files accessible
- Verify agent instructions loaded
- Test memory retrieval
- Log refresh completion

**Total Refresh Time:** ~12 minutes  
**Frequency:** Once per session (when hitting 80%)

---

## Manual Override Protocol

User can trigger early refresh with command:
```
"Execute token refresh protocol now"
```

This is useful when:
- Switching to complex new task requiring full context
- Experiencing any hallucinations or context loss
- Before major architectural changes
- After completing major milestone

---

## Hallucination Warning Signs

If agent exhibits these behaviors, trigger refresh immediately:
- ❌ Referencing files that don't exist
- ❌ Contradicting previous decisions without explanation
- ❌ Forgetting recent conversation context
- ❌ Repeating same responses multiple times
- ❌ Unable to locate files that were just created
- ❌ Mixing up project names or contexts

---

## Token Optimization Best Practices

### Input Token Reduction
- Use semantic_search instead of reading entire files
- Read targeted line ranges, not full files
- Parallelize independent operations
- Archive completed work to separate files

### Output Token Reduction
- Concise responses (1-3 sentences for simple tasks)
- Avoid repeating context unnecessarily
- Use todo list for tracking instead of verbose explanations
- Link to documentation instead of reproducing it

### Context Management
- Archive agent memory every 5 prompts (900-word limit)
- Move completed tasks to separate files
- Keep active context focused on current objective
- Reference archived documents instead of re-reading

---

## Monitoring Commands

### Check Current Token Usage
Agent will report at start of each response:
```
Current tokens: [X] / 1,000,000 ([Y]%)
Next milestone: Prompt #[N]
```

### Request Full Token Report
User can ask:
```
"Show token usage report"
```

Agent will provide:
- Cumulative token count
- Breakdown by prompt
- Estimated prompts remaining
- Refresh recommendations

---

## Emergency Protocol

If tokens exceed **950,000 (95%)** without refresh:
1. **STOP ALL OPERATIONS**
2. Force immediate refresh (don't wait for completion)
3. Alert user: "⚠️ CRITICAL: Approaching token limit. Executing emergency refresh."
4. Save all in-progress work
5. Execute full refresh protocol
6. Resume with fresh context

**Never exceed 980,000 tokens** - system reliability degrades beyond this point.

---

## Next Update
Update this file at Prompt #5 with actual token measurements.
