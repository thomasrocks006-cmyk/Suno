import React, { useState, useEffect, useRef } from 'react';
import { GeneratedSong, ChatMessage, RewritePlanProposal } from '../types';
import { chatWithAnalysisAgent, generateRewritePlan } from '../services/geminiService';

interface FloatingAnalysisAgentProps {
  song: GeneratedSong;
  onUpdateSong: (updatedSong: GeneratedSong) => void;
  onPlanUpdate: (plan: RewritePlanProposal) => void;
  isVisible: boolean;
  onToggle: () => void;
  focusedSection?: 'score' | 'lyrics' | 'sonic' | 'dnaMatch' | 'general';
  highlightedText?: string;
  onClearHighlight?: () => void;
}

export const FloatingAnalysisAgent: React.FC<FloatingAnalysisAgentProps> = ({
  song,
  onUpdateSong,
  onPlanUpdate,
  isVisible,
  onToggle,
  focusedSection,
  highlightedText,
  onClearHighlight
}) => {
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(song.chatHistory || []);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isGeneratingPlan, setIsGeneratingPlan] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  const autoGeneratePlan = async (insights: string[]) => {
    if (!song.analysis || isGeneratingPlan) return;
    
    setIsGeneratingPlan(true);
    try {
      const plan = await generateRewritePlan(
        song, 
        song.hasAdvancedLogic, 
        song.hasMetaphorLogic, 
        song.hasCommercialMode,
        insights
      );
      onPlanUpdate(plan);
    } catch (e) {
      console.error('Auto plan generation failed:', e);
    } finally {
      setIsGeneratingPlan(false);
    }
  };

  // Auto-generate plan whenever chat insights are added
  useEffect(() => {
    if (chatMessages.length > 0 && song.analysis) {
      const keyInsights = chatMessages
        .filter(msg => msg.role === 'agent')
        .filter(msg => 
          msg.content.toLowerCase().includes('key point') || 
          msg.content.toLowerCase().includes('flag this') ||
          msg.content.toLowerCase().includes('important') ||
          msg.content.toLowerCase().includes('should') ||
          msg.content.toLowerCase().includes('recommend')
        )
        .map(msg => msg.content);

      if (keyInsights.length > 0) {
        autoGeneratePlan(keyInsights);
      }
    }
  }, [chatMessages.length]);

  const handleSendMessage = async () => {
    if (!chatInput.trim() || !song.analysis) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: chatInput,
      timestamp: Date.now(),
      highlightedText: highlightedText,
      context: focusedSection
    };

    const updatedMessages = [...chatMessages, userMsg];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    try {
      const agentResponse = await chatWithAnalysisAgent(
        song, 
        chatInput, 
        chatMessages, 
        highlightedText,
        focusedSection
      );

      const agentMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'agent',
        content: agentResponse,
        timestamp: Date.now()
      };

      const finalMessages = [...updatedMessages, agentMsg];
      setChatMessages(finalMessages);
      onUpdateSong({ ...song, chatHistory: finalMessages });
      
      if (onClearHighlight) onClearHighlight();
    } catch (e) {
      console.error('Chat failed:', e);
    } finally {
      setIsChatLoading(false);
    }
  };

  if (!isVisible) {
    return (
      <button
        onClick={onToggle}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-transform hover:scale-110 animate-pulse"
        title="Open Analysis Agent"
      >
        🤖
      </button>
    );
  }

  return (
    <div className={`fixed ${isMinimized ? 'bottom-6 right-6' : 'top-4 right-4 bottom-4'} z-50 ${isMinimized ? 'w-80' : 'w-96'} flex flex-col bg-gradient-to-br from-gray-900 to-black border-2 border-indigo-500/50 rounded-2xl shadow-2xl transition-all duration-300`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-4 py-3 rounded-t-2xl flex items-center justify-between cursor-move">
        <div className="flex items-center gap-3">
          <span className="text-2xl animate-pulse">🤖</span>
          <div>
            <h3 className="text-sm font-bold text-white">Analysis Agent</h3>
            <p className="text-[10px] text-indigo-200">
              {focusedSection ? `Discussing: ${focusedSection}` : 'Orchestrating rewrite plan'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isGeneratingPlan && (
            <span className="text-xs text-yellow-300 animate-pulse">Updating plan...</span>
          )}
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="text-white/70 hover:text-white text-xl"
            title={isMinimized ? 'Expand' : 'Minimize'}
          >
            {isMinimized ? '⬆' : '⬇'}
          </button>
          <button
            onClick={onToggle}
            className="text-white/70 hover:text-white text-xl"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages */}
          <div className="flex-grow overflow-y-auto custom-scrollbar bg-black/40 p-4 space-y-3">
            {chatMessages.length === 0 ? (
              <div className="text-center py-8 px-4">
                <p className="text-sm text-gray-300 mb-2">👋 I'm your analysis orchestrator</p>
                <p className="text-xs text-gray-500 mb-3">
                  I'm analyzing the song in real-time and building a comprehensive rewrite plan.
                </p>
                <div className="text-[10px] text-indigo-400 space-y-1">
                  <p>• Click any metric to discuss it</p>
                  <p>• Highlight lyrics for specific feedback</p>
                  <p>• I'll update the rewrite plan automatically</p>
                  <p>• I'm not a yes-man - I give honest critiques</p>
                </div>
              </div>
            ) : (
              <>
                {chatMessages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`max-w-[85%] rounded-lg p-3 ${
                      msg.role === 'user'
                        ? 'bg-indigo-600/40 border border-indigo-500/40'
                        : 'bg-gray-800/80 border border-gray-700/40'
                    }`}>
                      {msg.context && (
                        <div className="text-[9px] text-indigo-300 mb-1 uppercase tracking-wider">
                          {msg.context}
                        </div>
                      )}
                      {msg.highlightedText && (
                        <div className="text-xs text-yellow-400 mb-2 pb-2 border-b border-white/10">
                          📍 "{msg.highlightedText}"
                        </div>
                      )}
                      <p className="text-xs text-gray-200 whitespace-pre-wrap leading-relaxed">
                        {msg.content}
                      </p>
                      <div className="text-[8px] text-gray-500 mt-2">
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </>
            )}

            {isChatLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-800/80 border border-gray-700/40 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Highlighted Text Display */}
          {highlightedText && (
            <div className="bg-yellow-900/20 border-t border-yellow-500/30 px-3 py-2 flex items-center justify-between">
              <div className="text-xs text-yellow-300 truncate flex-grow">
                <span className="font-bold">Selected:</span> "{highlightedText.substring(0, 50)}{highlightedText.length > 50 ? '...' : ''}"
              </div>
              {onClearHighlight && (
                <button
                  onClick={onClearHighlight}
                  className="text-xs text-gray-400 hover:text-white ml-2"
                >
                  ✕
                </button>
              )}
            </div>
          )}

          {/* Input */}
          <div className="p-3 bg-black/60 border-t border-white/10 rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                placeholder={focusedSection ? `Discuss ${focusedSection}...` : "Ask about anything..."}
                className="flex-grow bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500/50"
                disabled={isChatLoading || !song.analysis}
              />
              <button
                onClick={handleSendMessage}
                disabled={!chatInput.trim() || isChatLoading || !song.analysis}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-xs font-bold transition"
              >
                {isChatLoading ? '...' : 'Send'}
              </button>
            </div>
          </div>
        </>
      )}

      {isMinimized && (
        <div className="p-4 text-center">
          <p className="text-xs text-gray-400">
            {chatMessages.length > 0 ? `${chatMessages.length} messages` : 'Ready to help'}
          </p>
        </div>
      )}
    </div>
  );
};
