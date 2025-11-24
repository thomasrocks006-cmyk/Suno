import React, { useState, useEffect } from 'react';
import { PersonalizationContext } from '../types';
import {
  generateMetaphorSuggestions,
  generatePowerLines,
  extractLocationContext,
  extractMemoryElements,
  estimateSyllables,
  MetaphorSuggestion,
  PowerLineSuggestion,
  LocationContext
} from '../services/personalizationService';

interface PersonalizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApply: (context: PersonalizationContext) => void;
  topic: string;
  mood: string;
  genre: string;
  initialContext?: PersonalizationContext;
}

type Tab = 'world' | 'metaphor' | 'powerlines';

export const PersonalizationModal: React.FC<PersonalizationModalProps> = ({
  isOpen,
  onClose,
  onApply,
  topic,
  mood,
  genre,
  initialContext
}) => {
  const [activeTab, setActiveTab] = useState<Tab>('world');
  const [locationInput, setLocationInput] = useState('');
  const [locationContext, setLocationContext] = useState<LocationContext | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  const [personName, setPersonName] = useState('');
  const [relationshipType, setRelationshipType] = useState<'romantic' | 'ex' | 'crush' | 'friend' | 'family' | 'self' | 'abstract'>('abstract');
  const [keyDetail, setKeyDetail] = useState('');
  
  const [memoryDescription, setMemoryDescription] = useState('');
  const [memoryElements, setMemoryElements] = useState<any>(null);
  
  const [languagePreference, setLanguagePreference] = useState<'poetic' | 'conversational' | 'slang' | 'formal'>('conversational');
  
  const [metaphorSuggestions, setMetaphorSuggestions] = useState<MetaphorSuggestion[]>([]);
  const [selectedMetaphor, setSelectedMetaphor] = useState<MetaphorSuggestion | null>(null);
  const [metaphorIntensity, setMetaphorIntensity] = useState<'subtle' | 'moderate' | 'central'>('moderate');
  const [isLoadingMetaphors, setIsLoadingMetaphors] = useState(false);
  
  const [powerLineSuggestions, setPowerLineSuggestions] = useState<PowerLineSuggestion[]>([]);
  const [selectedPowerLines, setSelectedPowerLines] = useState<Set<number>>(new Set());
  const [placementStrategy, setPlacementStrategy] = useState<'automatic' | 'prioritize-chorus' | 'spread-evenly' | 'climactic'>('automatic');
  const [allowAdaptation, setAllowAdaptation] = useState(true);
  const [isLoadingPowerLines, setIsLoadingPowerLines] = useState(false);

  // Load initial context if provided
  useEffect(() => {
    if (initialContext && initialContext.enabled) {
      if (initialContext.yourWorld.location) {
        setLocationInput(`${initialContext.yourWorld.location.city}${initialContext.yourWorld.location.neighborhood ? ', ' + initialContext.yourWorld.location.neighborhood : ''}, ${initialContext.yourWorld.location.country}`);
        setLocationContext(initialContext.yourWorld.location);
      }
      if (initialContext.yourWorld.relationship) {
        setPersonName(initialContext.yourWorld.relationship.personName || '');
        setRelationshipType(initialContext.yourWorld.relationship.relationshipType);
        setKeyDetail(initialContext.yourWorld.relationship.keyDetail || '');
      }
      if (initialContext.yourWorld.memory) {
        setMemoryDescription(initialContext.yourWorld.memory.description);
        setMemoryElements(initialContext.yourWorld.memory.extractedElements);
      }
      if (initialContext.yourWorld.languagePreference) {
        setLanguagePreference(initialContext.yourWorld.languagePreference);
      }
      if (initialContext.metaphorLab) {
        setMetaphorIntensity(initialContext.metaphorLab.intensity);
      }
      if (initialContext.powerLines) {
        setPlacementStrategy(initialContext.powerLines.placementStrategy);
      }
    }
  }, [initialContext]);

  const handleExtractLocation = async () => {
    if (!locationInput.trim()) return;
    setIsLoadingLocation(true);
    try {
      const context = await extractLocationContext(locationInput);
      setLocationContext(context);
    } catch (error) {
      console.error('Failed to extract location:', error);
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const handleExtractMemory = async () => {
    if (!memoryDescription.trim()) return;
    try {
      const elements = await extractMemoryElements(memoryDescription);
      setMemoryElements(elements);
    } catch (error) {
      console.error('Failed to extract memory elements:', error);
    }
  };

  const handleGenerateMetaphors = async () => {
    setIsLoadingMetaphors(true);
    try {
      const suggestions = await generateMetaphorSuggestions(topic, mood, genre);
      setMetaphorSuggestions(suggestions);
      if (suggestions.length > 0 && !selectedMetaphor) {
        setSelectedMetaphor(suggestions[0]);
      }
    } catch (error) {
      console.error('Failed to generate metaphors:', error);
    } finally {
      setIsLoadingMetaphors(false);
    }
  };

  const handleGeneratePowerLines = async () => {
    if (!selectedMetaphor) return;
    setIsLoadingPowerLines(true);
    try {
      const lines = await generatePowerLines(
        selectedMetaphor.metaphor,
        topic,
        mood,
        genre,
        locationContext || undefined,
        memoryDescription || undefined
      );
      setPowerLineSuggestions(lines);
    } catch (error) {
      console.error('Failed to generate power lines:', error);
    } finally {
      setIsLoadingPowerLines(false);
    }
  };

  const togglePowerLine = (index: number) => {
    const newSelected = new Set(selectedPowerLines);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      if (newSelected.size < 3) {
        newSelected.add(index);
      }
    }
    setSelectedPowerLines(newSelected);
  };

  const handleApply = () => {
    const context: PersonalizationContext = {
      yourWorld: {
        location: locationContext || undefined,
        relationship: personName || keyDetail ? {
          personName: personName || undefined,
          relationshipType,
          keyDetail: keyDetail || undefined
        } : undefined,
        memory: memoryDescription ? {
          description: memoryDescription,
          extractedElements: memoryElements || {}
        } : undefined,
        languagePreference
      },
      metaphorLab: selectedMetaphor ? {
        chosenMetaphor: selectedMetaphor.metaphor,
        metaphorType: selectedMetaphor.type,
        intensity: metaphorIntensity
      } : undefined,
      powerLines: {
        selectedLines: Array.from(selectedPowerLines).map(idx => ({
          text: powerLineSuggestions[idx].text,
          suggestedPlacement: powerLineSuggestions[idx].suggestedPlacement,
          syllableCount: powerLineSuggestions[idx].syllableCount,
          allowAdaptation
        })),
        placementStrategy
      },
      enabled: true
    };
    
    onApply(context);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-gradient-to-br from-suno-dark via-gray-900 to-suno-dark border border-suno-primary/30 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-suno-primary/20 to-suno-secondary/20 p-6 border-b border-suno-primary/30">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-suno-primary to-suno-secondary">
                ✨ Personalization Studio
              </h2>
              <p className="text-gray-400 text-sm mt-1">Make this song uniquely yours</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition p-2 hover:bg-white/10 rounded-lg"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-suno-primary/20 bg-black/30">
          <button
            onClick={() => setActiveTab('world')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'world'
                ? 'text-suno-primary border-b-2 border-suno-primary bg-suno-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            📍 Your World
          </button>
          <button
            onClick={() => setActiveTab('metaphor')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'metaphor'
                ? 'text-suno-primary border-b-2 border-suno-primary bg-suno-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            💭 Metaphor Lab
          </button>
          <button
            onClick={() => setActiveTab('powerlines')}
            className={`flex-1 px-6 py-4 font-medium transition ${
              activeTab === 'powerlines'
                ? 'text-suno-primary border-b-2 border-suno-primary bg-suno-primary/10'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            💎 Power Lines
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-240px)]">
          {activeTab === 'world' && (
            <div className="space-y-6">
              {/* Location */}
              <div className="bg-black/40 border border-suno-primary/20 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  📍 Where do you live?
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={locationInput}
                    onChange={(e) => setLocationInput(e.target.value)}
                    placeholder="e.g., South Yarra, Melbourne, Australia"
                    className="flex-1 bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-suno-primary focus:outline-none"
                    onKeyDown={(e) => e.key === 'Enter' && handleExtractLocation()}
                  />
                  <button
                    onClick={handleExtractLocation}
                    disabled={isLoadingLocation}
                    className="bg-suno-primary hover:bg-suno-primary/80 text-white px-4 py-2 rounded-lg transition disabled:opacity-50"
                  >
                    {isLoadingLocation ? '...' : 'Extract'}
                  </button>
                </div>
                {locationContext && (
                  <div className="mt-3 p-3 bg-suno-primary/10 rounded-lg border border-suno-primary/30">
                    <p className="text-xs text-gray-400 mb-2">🤖 AI Suggestions:</p>
                    {locationContext.landmarks.length > 0 && (
                      <p className="text-sm text-white mb-1">
                        <span className="text-suno-primary">Landmarks:</span> {locationContext.landmarks.join(', ')}
                      </p>
                    )}
                    {locationContext.culturalNotes.length > 0 && (
                      <p className="text-sm text-white">
                        <span className="text-suno-primary">Culture:</span> {locationContext.culturalNotes.join(', ')}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Relationship */}
              <div className="bg-black/40 border border-suno-primary/20 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  👤 Who is this song about? (optional)
                </label>
                <input
                  type="text"
                  value={personName}
                  onChange={(e) => setPersonName(e.target.value)}
                  placeholder="Person's name (or leave blank)"
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-suno-primary focus:outline-none mb-3"
                />
                <div className="grid grid-cols-4 gap-2 mb-3">
                  {['romantic', 'ex', 'crush', 'friend', 'family', 'self', 'abstract'].map((type) => (
                    <button
                      key={type}
                      onClick={() => setRelationshipType(type as any)}
                      className={`px-3 py-2 rounded-lg text-sm transition ${
                        relationshipType === type
                          ? 'bg-suno-primary text-white'
                          : 'bg-black/50 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={keyDetail}
                  onChange={(e) => setKeyDetail(e.target.value)}
                  placeholder='Key detail (e.g., "their laugh", "blue eyes")'
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-suno-primary focus:outline-none"
                />
              </div>

              {/* Memory */}
              <div className="bg-black/40 border border-suno-primary/20 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  🎬 Anchor this song to a memory (optional)
                </label>
                <textarea
                  value={memoryDescription}
                  onChange={(e) => setMemoryDescription(e.target.value)}
                  onBlur={handleExtractMemory}
                  placeholder="Describe a specific moment... (e.g., 'The night we drove to the beach at 2am')"
                  rows={3}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:border-suno-primary focus:outline-none resize-none"
                />
                {memoryElements && (
                  <div className="mt-3 p-3 bg-suno-primary/10 rounded-lg border border-suno-primary/30 text-xs text-gray-300 space-y-1">
                    {memoryElements.timeOfDay && <p>⏰ Time: {memoryElements.timeOfDay}</p>}
                    {memoryElements.setting && <p>📍 Setting: {memoryElements.setting}</p>}
                    {memoryElements.emotion && <p>💭 Emotion: {memoryElements.emotion}</p>}
                    {memoryElements.sensoryDetails && memoryElements.sensoryDetails.length > 0 && (
                      <p>✨ Details: {memoryElements.sensoryDetails.join(', ')}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Language Preference */}
              <div className="bg-black/40 border border-suno-primary/20 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  💬 Language Style
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['poetic', 'conversational', 'slang', 'formal'] as const).map((pref) => (
                    <button
                      key={pref}
                      onClick={() => setLanguagePreference(pref)}
                      className={`px-4 py-2 rounded-lg text-sm transition ${
                        languagePreference === pref
                          ? 'bg-suno-primary text-white'
                          : 'bg-black/50 text-gray-400 hover:bg-white/10'
                      }`}
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'metaphor' && (
            <div className="space-y-6">
              {metaphorSuggestions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">Generate metaphor suggestions based on your song's topic, mood, and genre.</p>
                  <button
                    onClick={handleGenerateMetaphors}
                    disabled={isLoadingMetaphors}
                    className="bg-gradient-to-r from-suno-primary to-suno-secondary hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {isLoadingMetaphors ? 'Generating...' : '✨ Generate Metaphors'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-3">
                    {metaphorSuggestions.map((suggestion, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedMetaphor(suggestion)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedMetaphor?.metaphor === suggestion.metaphor
                            ? 'bg-suno-primary/20 border-suno-primary'
                            : 'bg-black/40 border-suno-primary/20 hover:border-suno-primary/50'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium mb-1">{suggestion.metaphor}</h4>
                            <p className="text-sm text-gray-400 mb-2">{suggestion.description}</p>
                            <p className="text-xs text-suno-primary">
                              {suggestion.type} • {suggestion.bestFit}
                            </p>
                          </div>
                          {selectedMetaphor?.metaphor === suggestion.metaphor && (
                            <span className="text-suno-primary text-xl">✓</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedMetaphor && (
                    <div className="bg-black/40 border border-suno-primary/20 rounded-lg p-4">
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        🎚️ Metaphor Intensity
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['subtle', 'moderate', 'central'] as const).map((intensity) => (
                          <button
                            key={intensity}
                            onClick={() => setMetaphorIntensity(intensity)}
                            className={`px-4 py-2 rounded-lg text-sm transition ${
                              metaphorIntensity === intensity
                                ? 'bg-suno-primary text-white'
                                : 'bg-black/50 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {intensity}
                          </button>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {metaphorIntensity === 'subtle' && '• Mentioned 1-2 times as background'}
                        {metaphorIntensity === 'moderate' && '• Present throughout, balanced with other themes'}
                        {metaphorIntensity === 'central' && '• Song revolves around this metaphor'}
                      </p>
                    </div>
                  )}

                  <button
                    onClick={handleGenerateMetaphors}
                    disabled={isLoadingMetaphors}
                    className="w-full bg-black/50 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-lg transition disabled:opacity-50 border border-gray-700"
                  >
                    {isLoadingMetaphors ? 'Generating...' : '🔄 Generate More Metaphors'}
                  </button>
                </>
              )}
            </div>
          )}

          {activeTab === 'powerlines' && (
            <div className="space-y-6">
              {!selectedMetaphor ? (
                <div className="text-center py-12">
                  <p className="text-gray-400">Please select a metaphor in the Metaphor Lab first.</p>
                </div>
              ) : powerLineSuggestions.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-400 mb-4">Generate powerful lines that complement your chosen metaphor.</p>
                  <button
                    onClick={handleGeneratePowerLines}
                    disabled={isLoadingPowerLines}
                    className="bg-gradient-to-r from-suno-primary to-suno-secondary hover:opacity-90 text-white px-6 py-3 rounded-lg font-medium transition disabled:opacity-50"
                  >
                    {isLoadingPowerLines ? 'Generating...' : '💎 Generate Power Lines'}
                  </button>
                </div>
              ) : (
                <>
                  <div className="bg-suno-primary/10 border border-suno-primary/30 rounded-lg p-3 text-sm text-gray-300">
                    Select up to 3 lines to include in your song. Selected: {selectedPowerLines.size}/3
                  </div>

                  <div className="space-y-3">
                    {powerLineSuggestions.map((line, idx) => (
                      <div
                        key={idx}
                        onClick={() => togglePowerLine(idx)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                          selectedPowerLines.has(idx)
                            ? 'bg-suno-primary/20 border-suno-primary'
                            : 'bg-black/40 border-suno-primary/20 hover:border-suno-primary/50'
                        }`}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <p className="text-white font-medium flex-1">{line.text}</p>
                          {selectedPowerLines.has(idx) && (
                            <span className="text-suno-primary text-xl ml-2">✓</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <span>{line.syllableCount} syllables</span>
                          <span>•</span>
                          <span>Best fit: {line.suggestedPlacement.join(', ')}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">{line.explanation}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-black/40 border border-suno-primary/20 rounded-lg p-4 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        📍 Placement Strategy
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {(['automatic', 'prioritize-chorus', 'spread-evenly', 'climactic'] as const).map((strategy) => (
                          <button
                            key={strategy}
                            onClick={() => setPlacementStrategy(strategy)}
                            className={`px-3 py-2 rounded-lg text-sm transition ${
                              placementStrategy === strategy
                                ? 'bg-suno-primary text-white'
                                : 'bg-black/50 text-gray-400 hover:bg-white/10'
                            }`}
                          >
                            {strategy.replace('-', ' ')}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="adapt"
                        checked={allowAdaptation}
                        onChange={(e) => setAllowAdaptation(e.target.checked)}
                        className="w-4 h-4 text-suno-primary bg-black/50 border-gray-700 rounded focus:ring-suno-primary"
                      />
                      <label htmlFor="adapt" className="text-sm text-gray-300">
                        Allow AI to adapt lines to fit song structure
                      </label>
                    </div>
                  </div>

                  <button
                    onClick={handleGeneratePowerLines}
                    disabled={isLoadingPowerLines}
                    className="w-full bg-black/50 hover:bg-white/10 text-gray-300 px-4 py-2 rounded-lg transition disabled:opacity-50 border border-gray-700"
                  >
                    {isLoadingPowerLines ? 'Generating...' : '🔄 Generate More Lines'}
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-black/40 border-t border-suno-primary/30 p-4 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-6 py-2 text-gray-400 hover:text-white transition"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            className="bg-gradient-to-r from-suno-primary to-suno-secondary hover:opacity-90 text-white px-8 py-2 rounded-lg font-medium transition"
          >
            Apply Personalization
          </button>
        </div>
      </div>
    </div>
  );
};
