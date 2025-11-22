
import React, { useState } from 'react';
import { SongInputs, StructureType, AnalysisResponse, FeedbackItem, InferredAttributes, SunoModel } from '../types';
import { StyleBuilderModal } from './StyleBuilderModal';
import { InstrumentSelector } from './InstrumentSelector';
import { analyzeSongConcept, inferAttributesFromReference } from '../services/geminiService';

interface InputFormProps {
  inputs: SongInputs;
  setInputs: React.Dispatch<React.SetStateAction<SongInputs>>;
  onSubmit: () => void;
  loadingStatus: string | null;
}

const RHYME_SCHEMES = [
  { label: 'AABB', desc: 'Couplets' },
  { label: 'ABAB', desc: 'Alternate' },
  { label: 'ABCB', desc: 'Ballad' },
  { label: 'AAAA', desc: 'Monorhyme' }
];

const VOCAL_GUIDES = [
  { label: '[Whisper]', desc: 'Intimate/Soft' },
  { label: '[Belting]', desc: 'High Power/Emotion' },
  { label: '[Shout]', desc: 'Aggressive' },
  { label: '[Spoken Word]', desc: 'Narrative/Story' },
  { label: '[Rap]', desc: 'Rhythmic Flow' },
  { label: '(Ad-libs)', desc: 'Background Layers' }
];

export const InputForm: React.FC<InputFormProps> = ({ inputs, setInputs, onSubmit, loadingStatus }) => {
  const [isStyleBuilderOpen, setIsStyleBuilderOpen] = useState(false);
  const [isInstrumentSelectorOpen, setIsInstrumentSelectorOpen] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [suggestions, setSuggestions] = useState<InferredAttributes | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isInferring, setIsInferring] = useState(false);
  const [activeSection, setActiveSection] = useState<'core' | 'style' | 'lyrics' | 'advanced'>('core');

  const toggleSection = (section: 'core' | 'style' | 'lyrics' | 'advanced') => {
    setActiveSection(activeSection === section ? section : section);
  };

  const handleChange = (field: keyof SongInputs, value: any) => {
    setInputs(prev => ({ ...prev, [field]: value }));
    // Clear feedback for a field when it changes as it might be fixed now
    if (analysis?.fieldFeedback && field in analysis.fieldFeedback) {
      const newFeedback = { ...analysis.fieldFeedback };
      delete newFeedback[field as keyof typeof newFeedback];
      setAnalysis({ ...analysis, fieldFeedback: newFeedback });
    }
  };

  const appendToInstructions = (textToAdd: string, prefix: string = '') => {
    const fullTextToAdd = prefix ? `${prefix}: ${textToAdd}` : textToAdd;
    const currentText = inputs.customInstructions;
    
    if (currentText.includes(textToAdd)) return;

    const newValue = currentText 
      ? `${currentText}\n${fullTextToAdd}`
      : fullTextToAdd;
      
    handleChange('customInstructions', newValue);
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    try {
      const result = await analyzeSongConcept(inputs);
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleInferAttributes = async () => {
    if (!inputs.artistReference && !inputs.songReference) return;
    setIsInferring(true);
    try {
      const result = await inferAttributesFromReference(inputs.artistReference, inputs.songReference);
      setSuggestions(result);
    } catch (error) {
      console.error("Inference failed", error);
    } finally {
      setIsInferring(false);
    }
  };

  const applySuggestion = (field: keyof SongInputs, suggestion: string) => {
    handleChange(field, suggestion);
    setActiveFeedback(null);
    if (suggestions) {
        // Remove the specific suggestion from state so the chip disappears
        const newSuggestions = {...suggestions};
        // @ts-ignore
        delete newSuggestions[field];
        setSuggestions(newSuggestions);
    }
  };

  const applyInferredValue = (field: keyof SongInputs, value: string) => {
      handleChange(field, value);
      if (suggestions) {
          const newSuggestions = {...suggestions};
           // @ts-ignore
          delete newSuggestions[field];
          setSuggestions(newSuggestions);
      }
  }

  // Helper to render feedback icon and tooltip
  const renderFeedback = (field: keyof SongInputs) => {
    const feedback = analysis?.fieldFeedback?.[field as keyof typeof analysis.fieldFeedback];
    
    if (!feedback || feedback.status === 'optimal') return null;

    return (
      <div className="absolute right-3 top-3 z-20">
        <button
          onClick={(e) => { e.preventDefault(); setActiveFeedback(activeFeedback === field ? null : field); }}
          className="text-orange-500 hover:text-orange-400 transition-colors animate-pulse"
          title="Click for AI Advice"
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </button>
        
        {activeFeedback === field && (
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 border border-orange-500/50 rounded-lg shadow-2xl p-4 z-30 text-left animate-in fade-in slide-in-from-top-2">
            <div className="flex justify-between items-start mb-2">
              <h5 className="text-orange-400 font-bold text-xs uppercase tracking-wider flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                AI Insight
              </h5>
              <button onClick={() => setActiveFeedback(null)} className="text-gray-500 hover:text-white">×</button>
            </div>
            <p className="text-gray-300 text-xs mb-3 leading-relaxed">{feedback.reasoning}</p>
            
            <div className="bg-black/30 rounded p-2 border border-white/5">
              <span className="text-[10px] text-gray-500 block mb-1">Suggestion:</span>
              <div className="text-white text-sm font-medium mb-2">{feedback.suggestion}</div>
              <button 
                onClick={() => applySuggestion(field, feedback.suggestion)}
                className="w-full bg-white/10 hover:bg-suno-primary hover:text-white text-gray-300 text-xs py-1.5 rounded transition-colors"
              >
                Apply Suggestion
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render Suggestion Chip (from Inference)
  const renderSuggestion = (field: keyof InferredAttributes) => {
    const suggestion = suggestions?.[field];
    // @ts-ignore
    const currentValue = inputs[field];

    if (!suggestion || suggestion === currentValue) return null;

    return (
        <div className="mt-1.5 flex items-center gap-2 animate-fade-in">
            <div className="text-[10px] bg-suno-accent/10 text-suno-accent px-2 py-1 rounded border border-suno-accent/20 flex items-center gap-2 w-full">
                <span className="font-bold shrink-0">✨ Suggestion:</span>
                <span className="truncate font-medium flex-grow">{suggestion}</span>
                <button 
                    // @ts-ignore
                    onClick={() => applyInferredValue(field, suggestion)}
                    className="bg-suno-accent hover:bg-white text-white hover:text-suno-accent px-2 py-0.5 rounded-sm text-[10px] font-bold transition-colors shrink-0"
                >
                    Apply
                </button>
            </div>
        </div>
    )
  }

  return (
    <>
      <div className="bg-suno-card p-3 md:p-6 rounded-2xl border border-white/10 shadow-xl h-full flex flex-col relative">
        {/* Header with Analyze Button */}
        <div className="flex justify-between items-center mb-3 md:mb-6 gap-2">
          <h2 className="text-lg md:text-2xl font-bold bg-gradient-to-r from-suno-primary to-suno-secondary bg-clip-text text-transparent">
            Song Parameters
          </h2>
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="text-[10px] md:text-xs bg-suno-primary/10 hover:bg-suno-primary/20 text-suno-primary border border-suno-primary/30 px-2 md:px-3 py-1 md:py-1.5 rounded-lg transition-all flex items-center gap-1 md:gap-2 whitespace-nowrap"
          >
            {isAnalyzing ? (
              <span className="animate-pulse">Analyzing...</span>
            ) : (
              <>
                <svg className="w-3 h-3 md:w-4 md:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/></svg>
                <span className="hidden sm:inline">Assistant Check</span>
                <span className="sm:hidden">Check</span>
              </>
            )}
          </button>
        </div>
        
        {/* Assistant General Advice Panel */}
        {analysis?.generalAdvice && (
          <div className="mb-3 md:mb-6 bg-blue-500/10 border border-blue-500/20 rounded-lg p-2 md:p-3 flex gap-2 md:gap-3 items-start animate-fade-in">
            <div className="text-blue-400 mt-0.5 shrink-0">
              <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
            </div>
            <div className="min-w-0 flex-grow">
              <h4 className="text-[10px] md:text-xs font-bold text-blue-400 uppercase mb-1">Assistant Note</h4>
              <p className="text-xs md:text-sm text-blue-100/80 leading-snug break-words">{analysis.generalAdvice}</p>
            </div>
            <button onClick={() => setAnalysis(null)} className="text-blue-400/50 hover:text-blue-400 shrink-0 text-lg">×</button>
          </div>
        )}
        
        <div className="space-y-3 md:space-y-5 flex-grow">
          {/* Inspiration References (Artist + Song) */}
          <div className="relative bg-white/5 p-2 md:p-3 rounded-lg border border-white/5 space-y-2 md:space-y-3">
            <div className="flex justify-between items-center">
                <label className="block text-sm font-medium text-suno-accent mb-1 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"/></svg>
                Inspiration References
                </label>
                {(inputs.artistReference || inputs.songReference) && (
                    <button 
                        onClick={handleInferAttributes}
                        disabled={isInferring}
                        className="text-[10px] bg-suno-accent text-white px-2 py-1 rounded hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20 flex items-center gap-1"
                    >
                        {isInferring ? 'Thinking...' : '✨ Smart Suggest'}
                    </button>
                )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <input
                  type="text"
                  value={inputs.artistReference}
                  onChange={(e) => handleChange('artistReference', e.target.value)}
                  placeholder="Artist (e.g. The Weeknd)"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-suno-accent focus:outline-none transition text-white placeholder-gray-600"
                />
              </div>
              <div>
                <input
                  type="text"
                  value={inputs.songReference}
                  onChange={(e) => handleChange('songReference', e.target.value)}
                  placeholder="Specific Song (e.g. Blinding Lights)"
                  className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-suno-accent focus:outline-none transition text-white placeholder-gray-600"
                />
              </div>
            </div>

            <p className="text-[10px] text-gray-500 mt-1.5 leading-tight">
              Fill these to unlock <strong>Smart Suggestions</strong> for all other fields. 
              <span className="text-gray-400 font-semibold ml-1 block mt-1">These names are NOT included in the final prompt.</span>
            </p>
          </div>

          {/* Topic */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Song Topic / Concept <span className="text-gray-600 text-xs font-normal ml-1">(Leave empty for AI)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputs.topic}
                onChange={(e) => handleChange('topic', e.target.value)}
                placeholder="e.g., A cyberpunk detective lost in neon rain"
                className={`w-full bg-suno-dark border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition text-white pr-10 ${
                  analysis?.fieldFeedback?.topic 
                    ? 'border-orange-500/50 focus:ring-orange-500' 
                    : 'border-white/10 focus:ring-suno-primary'
                }`}
              />
              {renderFeedback('topic')}
            </div>
            {renderSuggestion('topic')}
          </div>

          {/* Genre */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-400">
                Genre / Style <span className="text-gray-600 text-xs font-normal ml-1">(Leave empty for AI)</span>
              </label>
              <button 
                onClick={() => setIsStyleBuilderOpen(true)}
                className="text-xs flex items-center gap-1 text-suno-accent hover:text-white transition-colors font-medium px-2 py-0.5 rounded bg-suno-accent/10 hover:bg-suno-accent/20"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
                Style Builder
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                value={inputs.genre}
                onChange={(e) => handleChange('genre', e.target.value)}
                placeholder="e.g., Darkwave, Synthpop, 1980s"
                className={`w-full bg-suno-dark border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition text-white pr-10 ${
                  analysis?.fieldFeedback?.genre 
                    ? 'border-orange-500/50 focus:ring-orange-500' 
                    : 'border-white/10 focus:ring-suno-primary'
                }`}
              />
              {renderFeedback('genre')}
            </div>
            {renderSuggestion('genre')}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Mood */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Mood <span className="text-gray-600 text-xs font-normal ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputs.mood}
                  onChange={(e) => handleChange('mood', e.target.value)}
                  placeholder="e.g., Melancholic"
                  className={`w-full bg-suno-dark border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition text-white pr-10 ${
                    analysis?.fieldFeedback?.mood 
                      ? 'border-orange-500/50 focus:ring-orange-500' 
                      : 'border-white/10 focus:ring-suno-primary'
                  }`}
                />
                {renderFeedback('mood')}
              </div>
              {renderSuggestion('mood')}
            </div>

            {/* Vocals */}
            <div className="relative">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Vocals <span className="text-gray-600 text-xs font-normal ml-1">(Optional)</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputs.vocals}
                  onChange={(e) => handleChange('vocals', e.target.value)}
                  placeholder="e.g., Female, Ethereal"
                  className={`w-full bg-suno-dark border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition text-white pr-10 ${
                    analysis?.fieldFeedback?.vocals 
                      ? 'border-orange-500/50 focus:ring-orange-500' 
                      : 'border-white/10 focus:ring-suno-primary'
                  }`}
                />
                {renderFeedback('vocals')}
              </div>
              {renderSuggestion('vocals')}
            </div>
          </div>

          {/* Instruments */}
          <div className="relative">
             <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-400">Instruments <span className="text-gray-600 text-xs font-normal ml-1">(Optional)</span></label>
                <button 
                    onClick={() => setIsInstrumentSelectorOpen(true)}
                    className="text-xs flex items-center gap-1 text-yellow-400 hover:text-white transition-colors font-medium px-2 py-0.5 rounded bg-yellow-400/10 hover:bg-yellow-400/20"
                >
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"/></svg>
                    Select Instruments
                </button>
             </div>
             <div 
                className="w-full bg-suno-dark border border-white/10 rounded-lg px-4 py-3 min-h-[46px] flex flex-wrap gap-2 items-center cursor-pointer hover:border-suno-primary/50 transition"
                onClick={() => setIsInstrumentSelectorOpen(true)}
             >
                 {inputs.instruments && inputs.instruments.length > 0 ? (
                     inputs.instruments.map((inst, i) => (
                         <span key={i} className="bg-white/10 text-white text-xs px-2 py-1 rounded border border-white/10">{inst}</span>
                     ))
                 ) : (
                     <span className="text-gray-600 text-sm">Click to select instruments...</span>
                 )}
             </div>
          </div>


          {/* Structure */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1">Song Structure</label>
            <div className="relative">
              <select
                value={inputs.structure}
                onChange={(e) => handleChange('structure', e.target.value as StructureType)}
                className={`w-full bg-suno-dark border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition text-white appearance-none pr-10 ${
                  analysis?.fieldFeedback?.structure
                    ? 'border-orange-500/50 focus:ring-orange-500' 
                    : 'border-white/10 focus:ring-suno-primary'
                }`}
              >
                {Object.values(StructureType).map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {renderFeedback('structure')}
            </div>
          </div>

          {/* Syllable Pattern / Meter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Syllable Count / Meter <span className="text-gray-600 text-xs font-normal ml-1">(Optional)</span>
            </label>
            <div className="relative">
              <input
                type="text"
                value={inputs.syllablePattern}
                onChange={(e) => handleChange('syllablePattern', e.target.value)}
                placeholder="e.g., 8-6-8-6, Iambic Pentameter"
                className={`w-full bg-suno-dark border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition text-white pr-10 ${
                  analysis?.fieldFeedback?.syllablePattern
                    ? 'border-orange-500/50 focus:ring-orange-500' 
                    : 'border-white/10 focus:ring-suno-primary'
                }`}
              />
              {renderFeedback('syllablePattern')}
            </div>
            {renderSuggestion('syllablePattern')}
          </div>

          {/* Advanced Logic Toggles */}
          <div className="grid grid-cols-1 gap-3 my-4">
            {/* 1. Advanced Lyric Logic */}
            <div 
              className="bg-suno-card/50 border border-white/5 rounded-lg p-3 hover:border-suno-primary/30 transition-colors cursor-pointer"
              onClick={() => handleChange('advancedLyricLogic', !inputs.advancedLyricLogic)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${inputs.advancedLyricLogic ? 'bg-gradient-to-r from-suno-primary to-suno-secondary' : 'bg-gray-700'}`}>
                     <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${inputs.advancedLyricLogic ? 'translate-x-4' : ''}`} />
                   </div>
                   <div>
                     <div className="flex items-center gap-2">
                       <span className={`text-sm font-bold ${inputs.advancedLyricLogic ? 'text-white' : 'text-gray-400'}`}>Advanced Lyric Logic</span>
                       {inputs.advancedLyricLogic && <span className="text-[10px] bg-suno-primary px-1.5 rounded text-white font-bold">ON</span>}
                     </div>
                     <div className="text-[11px] text-gray-500">Enforces strict metadata, vocal cues, and expert "Show, Don't Tell" standards.</div>
                   </div>
                </div>
              </div>
            </div>

            {/* 2. Central Metaphor Anchoring */}
            <div 
              className="bg-suno-card/50 border border-white/5 rounded-lg p-3 hover:border-suno-accent/30 transition-colors cursor-pointer"
              onClick={() => handleChange('centralMetaphorLogic', !inputs.centralMetaphorLogic)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-6 rounded-full relative transition-colors duration-300 ${inputs.centralMetaphorLogic ? 'bg-gradient-to-r from-suno-accent to-blue-500' : 'bg-gray-700'}`}>
                     <div className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white shadow-md transform transition-transform duration-300 ${inputs.centralMetaphorLogic ? 'translate-x-4' : ''}`} />
                   </div>
                   <div>
                     <div className="flex items-center gap-2">
                       <span className={`text-sm font-bold ${inputs.centralMetaphorLogic ? 'text-white' : 'text-gray-400'}`}>Central Metaphor Anchoring</span>
                       {inputs.centralMetaphorLogic && <span className="text-[10px] bg-suno-accent px-1.5 rounded text-white font-bold">ON</span>}
                     </div>
                     <div className="text-[11px] text-gray-500">Anchors the song to one "Central Object" (e.g., Rust, Ocean) for thematic cohesion.</div>
                   </div>
                </div>
              </div>
            </div>
          </div>

          {/* Extra Instructions */}
          <div className="relative">
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-400">Specific Details / Instructions</label>
            </div>
            
            {/* Helpers Container */}
            <div className="space-y-2 mb-2">
              {/* Rhyme Scheme Helper */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] uppercase text-gray-500 py-1 font-semibold">Rhyme:</span>
                {RHYME_SCHEMES.map((scheme) => (
                  <button
                    key={scheme.label}
                    onClick={() => appendToInstructions(scheme.label, 'Rhyme Scheme')}
                    className="text-xs bg-white/5 hover:bg-white/10 hover:text-suno-accent border border-white/10 rounded px-2 py-1 text-gray-400 transition-all flex items-center gap-1"
                    title={`Add ${scheme.desc} rhyme scheme`}
                  >
                    <span className="font-bold">{scheme.label}</span>
                  </button>
                ))}
              </div>

              {/* Vocal Guides Helper */}
              <div className="flex flex-wrap gap-2">
                <span className="text-[10px] uppercase text-gray-500 py-1 font-semibold">Vocals:</span>
                {VOCAL_GUIDES.map((guide) => (
                  <button
                    key={guide.label}
                    onClick={() => appendToInstructions(`Use ${guide.label} sections`)}
                    className="text-xs bg-white/5 hover:bg-white/10 hover:text-suno-secondary border border-white/10 rounded px-2 py-1 text-gray-400 transition-all flex items-center gap-1"
                    title={`Add ${guide.desc} instruction`}
                  >
                    <span className="font-mono">{guide.label}</span>
                  </button>
                ))}
              </div>
              
              {/* Vocal Guide Explanation */}
              <div className="text-[10px] text-gray-500 bg-white/5 p-2 rounded border border-white/5 leading-relaxed">
                <span className="text-suno-secondary font-bold">Impact:</span> Adding vocal tags like <span className="font-mono text-gray-300">[Belting]</span> or <span className="font-mono text-gray-300">[Rap]</span> directs the AI to explicitly write these cues into the lyrics, forcing Suno v5 to change vocal texture and energy for those specific lines.
              </div>
            </div>

            <div className="relative">
              <textarea
                value={inputs.customInstructions}
                onChange={(e) => handleChange('customInstructions', e.target.value)}
                placeholder="Any specific rhymes, instruments to include..."
                rows={3}
                className={`w-full bg-suno-dark border rounded-lg px-4 py-3 focus:ring-2 focus:outline-none transition text-white resize-none ${
                  analysis?.fieldFeedback?.customInstructions
                    ? 'border-orange-500/50 focus:ring-orange-500' 
                    : 'border-white/10 focus:ring-suno-primary'
                }`}
              />
              {renderFeedback('customInstructions')}
            </div>
          </div>
        </div>

        <div className="mt-6">
          <button
            onClick={onSubmit}
            disabled={!!loadingStatus}
            className={`w-full font-bold py-4 rounded-xl text-white shadow-lg transition-all transform hover:scale-[1.02] active:scale-95 ${
              loadingStatus 
                ? 'bg-gray-600 cursor-not-allowed' 
                : 'bg-gradient-to-r from-suno-primary to-suno-secondary hover:shadow-purple-500/25'
            }`}
          >
            {loadingStatus ? (
              <span className="flex items-center justify-center gap-2 animate-pulse">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {loadingStatus}
              </span>
            ) : (
              'Generate Suno Assets'
            )}
          </button>
        </div>
      </div>

      <StyleBuilderModal 
        isOpen={isStyleBuilderOpen}
        onClose={() => setIsStyleBuilderOpen(false)}
        onApply={(newStyle) => {
          handleChange('genre', newStyle);
          setIsStyleBuilderOpen(false);
        }}
        initialStyle={inputs.genre}
      />

      <InstrumentSelector
        isOpen={isInstrumentSelectorOpen}
        onClose={() => setIsInstrumentSelectorOpen(false)}
        selectedInstruments={inputs.instruments || []}
        onChange={(newInstruments) => handleChange('instruments', newInstruments)}
        suggestedInstruments={suggestions?.instruments}
      />
    </>
  );
};
