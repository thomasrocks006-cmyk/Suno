/**
 * COST TRACKING SERVICE
 * 
 * Tracks API costs across all operations to help users understand their spending.
 * All costs are stored in localStorage and can be viewed in a dashboard.
 */

export interface CostEntry {
  id: string;
  timestamp: number;
  operation: 'generation' | 'rewrite' | 'analysis' | 'variation' | 'line_edit' | 'chat' | 'image';
  model: string;
  estimatedCost: number;
  songId?: string;
  songTitle?: string;
}

export interface CostSummary {
  totalCost: number;
  operationCounts: Record<string, number>;
  operationCosts: Record<string, number>;
  todayCost: number;
  weekCost: number;
  monthCost: number;
  averageCostPerSong: number;
}

// Pricing per model (in USD)
const MODEL_COSTS = {
  'gemini-2.5-flash': {
    input: 0.00001875 / 1000,  // per token
    output: 0.000075 / 1000,   // per token
  },
  'gemini-2.0-flash-exp': {
    input: 0.00001875 / 1000,
    output: 0.000075 / 1000,
  },
  'gemini-3-pro-preview': {
    input: 0.000125 / 1000,
    output: 0.0005 / 1000,
  },
  'imagen-3.0-fast': {
    perImage: 0.02,
  },
} as const;

// Estimated token counts for different operations
const OPERATION_ESTIMATES = {
  generation_text: { input: 2000, output: 800 },
  generation_image: { images: 1 },
  base_analysis: { input: 4000, output: 2000 },
  agent_analysis_flash: { input: 2500, output: 800 },
  agent_analysis_pro: { input: 2500, output: 1200 },
  rewrite: { input: 3500, output: 1000 },
  variation: { input: 3000, output: 2400 }, // 3 variations
  line_edit: { input: 500, output: 300 },
  chat_question: { input: 1500, output: 500 },
} as const;

class CostTrackingService {
  private storageKey = 'suno_cost_tracking';
  
  /**
   * Track a new cost entry
   */
  track(entry: Omit<CostEntry, 'id' | 'timestamp'>): void {
    const fullEntry: CostEntry = {
      ...entry,
      id: crypto.randomUUID(),
      timestamp: Date.now(),
    };
    
    const entries = this.getAllEntries();
    entries.push(fullEntry);
    
    // Keep only last 1000 entries to avoid localStorage bloat
    const trimmedEntries = entries.slice(-1000);
    localStorage.setItem(this.storageKey, JSON.stringify(trimmedEntries));
    
    console.log(`[Cost] Tracked: ${entry.operation} - $${entry.estimatedCost.toFixed(4)}`);
  }
  
  /**
   * Get all cost entries
   */
  getAllEntries(): CostEntry[] {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];
    
    try {
      return JSON.parse(data) as CostEntry[];
    } catch (e) {
      console.error('[Cost] Failed to parse cost entries:', e);
      return [];
    }
  }
  
  /**
   * Get cost summary with various metrics
   */
  getSummary(): CostSummary {
    const entries = this.getAllEntries();
    const now = Date.now();
    const dayMs = 24 * 60 * 60 * 1000;
    
    const totalCost = entries.reduce((sum, e) => sum + e.estimatedCost, 0);
    
    const operationCounts: Record<string, number> = {};
    const operationCosts: Record<string, number> = {};
    
    entries.forEach(entry => {
      operationCounts[entry.operation] = (operationCounts[entry.operation] || 0) + 1;
      operationCosts[entry.operation] = (operationCosts[entry.operation] || 0) + entry.estimatedCost;
    });
    
    const todayEntries = entries.filter(e => e.timestamp > now - dayMs);
    const weekEntries = entries.filter(e => e.timestamp > now - 7 * dayMs);
    const monthEntries = entries.filter(e => e.timestamp > now - 30 * dayMs);
    
    const todayCost = todayEntries.reduce((sum, e) => sum + e.estimatedCost, 0);
    const weekCost = weekEntries.reduce((sum, e) => sum + e.estimatedCost, 0);
    const monthCost = monthEntries.reduce((sum, e) => sum + e.estimatedCost, 0);
    
    // Calculate average cost per song (generation + analysis)
    const generations = entries.filter(e => e.operation === 'generation');
    const averageCostPerSong = generations.length > 0 
      ? totalCost / generations.length 
      : 0;
    
    return {
      totalCost,
      operationCounts,
      operationCosts,
      todayCost,
      weekCost,
      monthCost,
      averageCostPerSong,
    };
  }
  
  /**
   * Get entries for a specific song
   */
  getEntriesForSong(songId: string): CostEntry[] {
    return this.getAllEntries().filter(e => e.songId === songId);
  }
  
  /**
   * Clear all cost tracking data
   */
  clear(): void {
    localStorage.removeItem(this.storageKey);
    console.log('[Cost] Tracking data cleared');
  }
  
  /**
   * Export cost data as CSV
   */
  exportCSV(): string {
    const entries = this.getAllEntries();
    const headers = ['Date', 'Operation', 'Model', 'Cost', 'Song Title'];
    const rows = entries.map(e => [
      new Date(e.timestamp).toISOString(),
      e.operation,
      e.model,
      e.estimatedCost.toFixed(4),
      e.songTitle || 'N/A',
    ]);
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  }
}

// Singleton instance
export const costTracking = new CostTrackingService();

/**
 * Helper functions to calculate and track costs for specific operations
 */

export function trackGeneration(songId: string, songTitle: string): void {
  // Text generation
  const textCost = 
    OPERATION_ESTIMATES.generation_text.input * MODEL_COSTS['gemini-2.5-flash'].input +
    OPERATION_ESTIMATES.generation_text.output * MODEL_COSTS['gemini-2.5-flash'].output;
  
  costTracking.track({
    operation: 'generation',
    model: 'gemini-2.5-flash',
    estimatedCost: textCost,
    songId,
    songTitle,
  });
  
  // Image generation
  costTracking.track({
    operation: 'image',
    model: 'imagen-3.0-fast',
    estimatedCost: MODEL_COSTS['imagen-3.0-fast'].perImage,
    songId,
    songTitle,
  });
}

export function trackAnalysis(songId: string, songTitle: string): void {
  // Base analysis
  const baseCost = 
    OPERATION_ESTIMATES.base_analysis.input * MODEL_COSTS['gemini-3-pro-preview'].input +
    OPERATION_ESTIMATES.base_analysis.output * MODEL_COSTS['gemini-3-pro-preview'].output;
  
  costTracking.track({
    operation: 'analysis',
    model: 'gemini-3-pro-preview',
    estimatedCost: baseCost,
    songId,
    songTitle,
  });
  
  // 4 Flash agents
  const flashAgentCost = 
    OPERATION_ESTIMATES.agent_analysis_flash.input * MODEL_COSTS['gemini-2.0-flash-exp'].input +
    OPERATION_ESTIMATES.agent_analysis_flash.output * MODEL_COSTS['gemini-2.0-flash-exp'].output;
  
  for (let i = 0; i < 4; i++) {
    costTracking.track({
      operation: 'analysis',
      model: 'gemini-2.0-flash-exp',
      estimatedCost: flashAgentCost,
      songId,
      songTitle,
    });
  }
  
  // 1 Pro agent (Storyteller)
  const proAgentCost = 
    OPERATION_ESTIMATES.agent_analysis_pro.input * MODEL_COSTS['gemini-3-pro-preview'].input +
    OPERATION_ESTIMATES.agent_analysis_pro.output * MODEL_COSTS['gemini-3-pro-preview'].output;
  
  costTracking.track({
    operation: 'analysis',
    model: 'gemini-3-pro-preview',
    estimatedCost: proAgentCost,
    songId,
    songTitle,
  });
}

export function trackRewrite(songId: string, songTitle: string, useProModel: boolean): void {
  const model = useProModel ? 'gemini-3-pro-preview' : 'gemini-2.5-flash';
  const costs = MODEL_COSTS[model];
  
  const cost = 
    OPERATION_ESTIMATES.rewrite.input * costs.input +
    OPERATION_ESTIMATES.rewrite.output * costs.output;
  
  costTracking.track({
    operation: 'rewrite',
    model,
    estimatedCost: cost,
    songId,
    songTitle,
  });
}

export function trackVariation(songId: string, songTitle: string): void {
  const cost = 
    OPERATION_ESTIMATES.variation.input * MODEL_COSTS['gemini-2.5-flash'].input +
    OPERATION_ESTIMATES.variation.output * MODEL_COSTS['gemini-2.5-flash'].output;
  
  costTracking.track({
    operation: 'variation',
    model: 'gemini-2.5-flash',
    estimatedCost: cost,
    songId,
    songTitle,
  });
}

export function trackLineEdit(songId?: string, songTitle?: string): void {
  const cost = 
    OPERATION_ESTIMATES.line_edit.input * MODEL_COSTS['gemini-2.5-flash'].input +
    OPERATION_ESTIMATES.line_edit.output * MODEL_COSTS['gemini-2.5-flash'].output;
  
  costTracking.track({
    operation: 'line_edit',
    model: 'gemini-2.5-flash',
    estimatedCost: cost,
    songId,
    songTitle,
  });
}

export function trackChatQuestion(songId?: string, songTitle?: string): void {
  const cost = 
    OPERATION_ESTIMATES.chat_question.input * MODEL_COSTS['gemini-2.0-flash-exp'].input +
    OPERATION_ESTIMATES.chat_question.output * MODEL_COSTS['gemini-2.0-flash-exp'].output;
  
  costTracking.track({
    operation: 'chat',
    model: 'gemini-2.0-flash-exp',
    estimatedCost: cost,
    songId,
    songTitle,
  });
}
