import React, { useState, useRef, useEffect } from 'react';
import { SongAnalysis, ScoreComponent } from '../types';
import { GoogleGenAI } from '@google/genai';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

interface DeepAnalysisAssistantProps {
  analysis: SongAnalysis;
  apiKey: string;
  freeQuestionLimit?: number;
}

export const DeepAnalysisAssistant: React.FC<DeepAnalysisAssistantProps> = ({
  analysis,
  apiKey,
  freeQuestionLimit = 3
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '0',
      role: 'assistant',
      content: "👋 Hi! I'm your Deep Analysis Assistant. Ask me anything about your song analysis - I have full context of all 11 categories, agent debates, and scoring rationale.",
      timestamp: Date.now()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [showRateLimitWarning, setShowRateLimitWarning] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen && !isMinimized) {
      inputRef.current?.focus();
    }
  }, [isOpen, isMinimized]);

  // Build context from analysis
  const buildContext = (): string => {
    // Group scores by category
    const categoryScores = new Map<string, ScoreComponent[]>();
    (analysis.scoreBreakdown || []).forEach((score: ScoreComponent) => {
      if (!categoryScores.has(score.category)) {
        categoryScores.set(score.category, []);
      }
      categoryScores.get(score.category)!.push(score);
    });

    const scoreBreakdown = Array.from(categoryScores.entries())
      .map(([category, components]) => {
        const avgScore = components.reduce((sum, c) => sum + c.score, 0) / components.length;
        const reasoning = components.map(c => `${c.agent || 'Agent'}: ${c.reason}`).join('; ');
        return `${category}: ${avgScore.toFixed(1)}/10 - ${reasoning}`;
      })
      .join('\n');

    const songDNA = (analysis.dnaMatch ? [analysis.dnaMatch] : [])
      .map((dna: any) => `${dna.referenceSong} by ${dna.artist} (${dna.matchScore}% match)`)
      .join('\n');

    return `
SONG ANALYSIS CONTEXT:
======================

OVERALL SCORE: ${analysis.overallScore}/10

11-CATEGORY BREAKDOWN:
${scoreBreakdown}

SONG DNA INSIGHTS:
${songDNA}

STRENGTHS:
${(analysis.strengths || []).join(', ')}

WEAKNESSES:
${(analysis.weaknesses || []).join(', ')}
`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    // Check rate limit
    if (questionCount >= freeQuestionLimit) {
      setShowRateLimitWarning(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setQuestionCount(prev => prev + 1);

    try {
      const genAI = new GoogleGenAI({ apiKey });
      
      const context = buildContext();
      const prompt = `You are a helpful music analysis assistant. You have access to a detailed song analysis including scores, agent debates, and DNA insights.

${context}

USER QUESTION: ${userMessage.content}

Provide a concise, helpful answer (2-4 sentences) using the analysis context. Be conversational and insightful. If the question is about a specific category or agent, focus on that. If it's general, synthesize key insights.`;

      const response = await genAI.models.generateContent({
        model: 'gemini-2.0-flash-exp',
        contents: [{ parts: [{ text: prompt }] }]
      });
      
      const responseText = response.text || 'No response generated.';

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseText,
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Failed to get assistant response:', error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "I'm sorry, I encountered an error processing your question. Please try again.",
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "What are my song's biggest strengths?",
    "Which category scored lowest and why?",
    "What did the agents disagree about most?",
    "How can I improve the commercial viability?",
    "Is my hook strong enough?",
    "What makes this song unique?"
  ];

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    inputRef.current?.focus();
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-gradient-to-br from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all hover:scale-105 flex items-center gap-2 z-50"
        aria-label="Open Deep Analysis Assistant"
      >
        <span className="text-xl">💬</span>
        <span className="font-semibold">Ask AI Assistant</span>
      </button>
    );
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all ${
        isMinimized ? 'w-80' : 'w-96'
      }`}
      role="region"
      aria-label="Deep Analysis Assistant"
    >
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-2">
          <span className="text-xl">💬</span>
          <div>
            <div className="font-bold text-sm">Deep Analysis Assistant</div>
            <div className="text-xs opacity-80">
              {freeQuestionLimit - questionCount} free question{freeQuestionLimit - questionCount !== 1 ? 's' : ''} left
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/70 hover:text-white transition p-1"
            aria-label={isMinimized ? 'Maximize' : 'Minimize'}
          >
            {isMinimized ? '⬆' : '⬇'}
          </button>
          <button
            onClick={() => setIsOpen(false)}
            className="text-white/70 hover:text-white transition p-1"
            aria-label="Close assistant"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <div className="bg-gray-900 h-96 overflow-y-auto custom-scrollbar p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-lg px-4 py-2 ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-800 text-gray-200 border border-gray-700'
                  }`}
                >
                  <div className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </div>
                  <div className={`text-[10px] mt-1 ${
                    message.role === 'user' ? 'text-blue-200' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800 text-gray-400 rounded-lg px-4 py-2 border border-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="animate-pulse">●</span>
                    <span className="animate-pulse delay-100">●</span>
                    <span className="animate-pulse delay-200">●</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Suggested Questions (only show at start) */}
          {messages.length === 1 && (
            <div className="bg-gray-800 border-t border-gray-700 p-3">
              <div className="text-xs text-gray-400 mb-2">Suggested questions:</div>
              <div className="flex flex-wrap gap-2">
                {suggestedQuestions.slice(0, 3).map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-xs px-2 py-1 bg-purple-500/20 text-purple-300 rounded hover:bg-purple-500/30 transition"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Rate Limit Warning */}
          {showRateLimitWarning && (
            <div className="bg-yellow-500/20 border-t border-yellow-500/30 p-3">
              <div className="flex items-start gap-2">
                <span className="text-yellow-400 text-sm">⚠️</span>
                <div className="flex-grow">
                  <div className="text-xs text-yellow-300 font-semibold mb-1">
                    Free Question Limit Reached
                  </div>
                  <div className="text-xs text-yellow-400">
                    You've used all {freeQuestionLimit} free questions. Upgrade to Pro for unlimited assistant access!
                  </div>
                </div>
                <button
                  onClick={() => setShowRateLimitWarning(false)}
                  className="text-yellow-400 hover:text-yellow-300"
                  aria-label="Dismiss warning"
                >
                  ✕
                </button>
              </div>
            </div>
          )}

          {/* Input */}
          <form onSubmit={handleSubmit} className="bg-gray-900 border-t border-gray-700 p-3">
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  questionCount >= freeQuestionLimit
                    ? 'Upgrade for more questions...'
                    : 'Ask about your analysis...'
                }
                disabled={questionCount >= freeQuestionLimit || isLoading}
                className="flex-grow px-3 py-2 bg-gray-800 border border-gray-700 rounded text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed"
                aria-label="Question input"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading || questionCount >= freeQuestionLimit}
                className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition font-semibold text-sm"
                aria-label="Send question"
              >
                {isLoading ? '⟳' : '→'}
              </button>
            </div>
            
            {questionCount < freeQuestionLimit && (
              <div className="text-xs text-gray-500 mt-2">
                💡 Ask about specific categories, agent opinions, or improvement suggestions
              </div>
            )}
          </form>
        </>
      )}
    </div>
  );
};
