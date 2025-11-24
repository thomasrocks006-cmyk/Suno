# Data Structure Migration Guide

## Overview
Three services need migration to match the current `types.ts` schema:
1. `iterativeRefinementService.ts.bak`
2. `agentCoverageService.ts.bak`
3. `personalizationService.ts.bak`

## Required Changes

### 1. Property Name Updates

**Old → New:**
- `plan.lineChanges` → `plan.executionPlan.lineLevelChanges`
- `change.proposedLine` → `change.newLine`
- `change.reasoning` → `change.reason`
- `analysis.scoreAnalysis.X` → `analysis.scoreBreakdown.find(s => s.category === 'X')?.score`

### 2. Type Definitions Needed

#### AgentDebateResult (doesn't exist in types.ts)
Should be defined as:
```typescript
interface AgentDebateResult {
  lineNumber: number;
  originalLine: string;
  proposedLine: string;
  songwriterPosition: string;
  producerPosition: string;
  finalDecision: string;
  rationale: string;
}
```

This already exists in `RewritePlanProposal.agentDebates` with slightly different structure.

### 3. Service-Specific Issues

#### agentCoverageService.ts.bak (254 lines)
**Issues:**
- Line 47: Uses `plan.executionPlan.lineLevelChanges` ✅ (already fixed)
- Line 51: References `AgentDebateResult` type (not exported)
- Line 90: Uses `plan.lineChanges` ❌ (should be `plan.executionPlan.lineLevelChanges`)
- Line 185: Function signature uses `AgentDebateResult`

**Fix Strategy:**
- Replace inline type with `typeof plan.agentDebates[0]`
- Update line 90 reference
- Test with actual rewrite plan data

#### iterativeRefinementService.ts.bak (331 lines)
**Issues:**
- Multiple references to `analysis.scoreAnalysis.X` (should use `scoreBreakdown`)
- Lines 183, 224, 251, 283, 327: Access non-existent `scoreAnalysis` property
- Lines 184, 201-202, 226, 258, 285: Use `plan.lineChanges` instead of `plan.executionPlan.lineLevelChanges`
- Line 227: Uses `change.proposedLine` instead of `change.newLine`

**Fix Strategy:**
- Create helper function: `getScoreByCategory(analysis, category)` 
- Replace all property accesses with helper
- Update all `lineChanges` references
- Update field names

#### personalizationService.ts.bak (9924 bytes)
**Issues:**
- Uses `ai.getGenerativeModel()` which doesn't exist on GoogleGenAI
- Needs to use new Gemini SDK v2 API: `ai.models.generateContent()`
- Multiple API calls need migration

**Fix Strategy:**
- Replace all `ai.getGenerativeModel()` calls
- Use new SDK pattern: `ai.models.generateContent({ model, contents, config })`
- Test with actual API key

## Implementation Priority

### High Priority (Blocking UI features)
1. **agentCoverageService.ts** - Needed for agent coverage visualization
   - Estimated: 30 minutes
   - Complexity: Low (just property updates)

### Medium Priority (Quality improvements)
2. **iterativeRefinementService.ts** - Multi-pass refinement workflow
   - Estimated: 2 hours
   - Complexity: Medium (extensive property updates + testing)

### Low Priority (Optional feature)
3. **personalizationService.ts** - User personalization features
   - Estimated: 3 hours
   - Complexity: High (API migration + feature redesign)

## Testing Strategy

For each service:
1. Fix TypeScript compilation errors
2. Create minimal test case with mock data
3. Verify output matches expected schema
4. Test with real song data
5. Integration test in UI

## Current Workarounds

All three services have stub implementations that prevent compilation errors:
- `agentCoverageService.ts` - Returns empty report
- `personalizationService.ts` - Returns empty results
- No stub for `iterativeRefinementService.ts` (service not exposed to UI)

These stubs allow the app to run while the full implementations are being migrated.

## Recommendation

**Defer migration until needed:**
- The 5-agent system is working well without these features
- Focus on completing Interactive Lyrics (Phase 0) first
- Migrate services only when UI features require them

**When to migrate:**
- Agent coverage UI → Fix `agentCoverageService.ts`
- Quality improvements needed → Fix `iterativeRefinementService.ts`
- Personalization requested by users → Fix `personalizationService.ts`
