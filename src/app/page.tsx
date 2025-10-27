"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowUp, Plus, MessageSquare, Sparkles, Search, Brain, Wand2, ChevronDown, Check, Users, MapPin, CheckCircle2 } from "lucide-react";
import { LinkedInProfileDrawer } from "@/components/LinkedInProfileDrawer";
import { ValuePropBuilderWrapper } from "@/components/ValuePropBuilderWrapper";
import { ContentChoiceCard } from "@/components/ContentChoiceCard";
import { FunnelSummaryCard } from "@/components/FunnelSummaryCard";
import { FunnelChoiceCard } from "@/components/FunnelChoiceCard";
import { EmailTypeChoice } from "@/components/EmailTypeChoice";
import { SequenceLengthChoice } from "@/components/SequenceLengthChoice";
import { OneTimeEmailCard } from "@/components/OneTimeEmailCard";
import { LinkedInOutreachCard } from "@/components/LinkedInOutreachCard";
import { EmailSequenceCard } from "@/components/EmailSequenceCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SystemMessage } from "@/components/ui/system-message";
import { nanoid } from "nanoid";

type ICP = {
  id: string;
  title: string;
  description: string;
  painPoints: string[];
  goals: string[];
  demographics: string;
  personaName: string;
  personaRole: string;
  personaCompany: string;
  location: string;
  country: string;
};

type LinkedInPost = {
  id: string;
  content: string;
  timestamp: string;
  engagement: number;
};

type LinkedInProfile = {
  id: string;
  name: string;
  headline: string;
  company: string;
  location: string;
  photoUrl: string;
  matchScore: number;
  matchReasons: string[];
  recentPosts: LinkedInPost[];
  experience: {
    title: string;
    company: string;
    duration: string;
  }[];
};

type ThinkingStep = {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  startTime?: number;
  duration?: number;
  substeps?: string[];
};

type ValuePropVariable = {
  key: string;
  label: string;
  type: 'dropdown' | 'input';
  options?: string[];
  selectedValue: string;
  placeholder?: string;
};

type ValuePropVariation = {
  id: string;
  style: string;
  text: string;
  useCase: string;
  emoji: string;
};

type ValuePropData = {
  variables: ValuePropVariable[];
  variations: ValuePropVariation[];
  icp: ICP;
};

type LinkedInMessage = {
  id: string;
  step: number;
  type: 'connection' | 'follow-up-1' | 'follow-up-2';
  title: string;
  timing: string;
  characterCount: number;
  message: string;
  personalizationTips: string[];
  expectedResponse: string;
};

type LinkedInOutreachData = {
  messages: LinkedInMessage[];
  overallStrategy: string;
  keyTakeaways: string[];
};

type EmailMessage = {
  id: string;
  step: number;
  type: 'intro' | 'value' | 'social-proof' | 'urgency' | 'breakup';
  dayNumber: number;
  subjectLines: string[];
  body: string;
  cta: string;
  openRateBenchmark: string;
  replyRateBenchmark: string;
  tips: string[];
};

type EmailSequenceData = {
  emails: EmailMessage[];
  sequenceGoal: string;
  bestPractices: string[];
  expectedOutcome: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  component?: "icps" | "value-prop" | "funnel-summary" | "funnel-choice" | "continue-to-funnel" | "email-type-choice" | "sequence-length-choice" | "one-time-email" | "linkedin-outreach" | "email-sequence";
  data?: ICP[] | ValuePropData | { icp: ICP; valueProp?: string } | LinkedInOutreachData | EmailSequenceData | Record<string, unknown>;
  thinking?: ThinkingStep[];
};

// Enhanced Generation State Types
type GenerationStep = 'analysis' | 'icp-selection' | 'value-prop' | 'funnel' | 'content-choice' | 'generation' | 'complete';

type GeneratedContent = {
  icps?: ICP[];
  valueProp?: ValuePropData;
  funnelSummary?: Record<string, unknown>;
  emailSequence?: EmailSequenceData;
  linkedinOutreach?: LinkedInOutreachData;
};

type GenerationState = {
  currentStep: GenerationStep;
  completedSteps: string[];
  generatedContent: GeneratedContent;
  isGenerating: boolean;
  generationId?: string;
  lastGenerationTime?: Date;
};

type UserJourney = {
  websiteAnalyzed: boolean;
  icpSelected: boolean;
  valuePropGenerated: boolean;
  contentChoiceMade: boolean;
  finalContentGenerated: boolean;
};

type ConversationMemory = {
  id: string;
  websiteUrl: string;
  selectedIcp: ICP | null;
  generationHistory: Array<{
    timestamp: Date;
    action: string;
    result: Record<string, unknown>;
    success: boolean;
  }>;
  userPreferences: {
    preferredContentType: string;
    lastAction: string;
  };
};

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
  // Enhanced state management
  generationState: GenerationState;
  userJourney: UserJourney;
  memory: ConversationMemory;
};

// Generation Manager Class
class GenerationManager {
  private cache: Map<string, unknown> = new Map();
  private pendingGenerations: Map<string, Promise<unknown>> = new Map();
  private completedGenerations: Set<string> = new Set();

  createKey(type: string, params: Record<string, unknown>): string {
    return `${type}:${JSON.stringify(params)}`;
  }

  async generate<T>(
    type: string,
    params: Record<string, unknown>,
    generator: () => Promise<T>
  ): Promise<T> {
    const key = this.createKey(type, params);

    // Check cache first
    if (this.cache.has(key)) {
      console.log(`🎯 [GenerationManager] Cache hit for ${type}`);
      return this.cache.get(key);
    }

    // Check if already generating
    if (this.pendingGenerations.has(key)) {
      console.log(`⏳ [GenerationManager] Waiting for existing generation: ${type}`);
      return this.pendingGenerations.get(key);
    }

    // Check if already completed
    if (this.completedGenerations.has(key)) {
      console.log(`✅ [GenerationManager] Already completed: ${type}`);
      return this.cache.get(key);
    }

    // Start generation
    console.log(`🚀 [GenerationManager] Starting generation: ${type}`);
    const promise = this.executeGeneration(key, generator);
    this.pendingGenerations.set(key, promise);

    try {
      const result = await promise;
      this.cache.set(key, result);
      this.completedGenerations.add(key);
      return result;
    } finally {
      this.pendingGenerations.delete(key);
    }
  }

  private async executeGeneration<T>(key: string, generator: () => Promise<T>): Promise<T> {
    try {
      return await generator();
    } catch (error) {
      console.error(`❌ [GenerationManager] Generation failed for ${key}:`, error);
      throw error;
    }
  }

  isGenerating(type: string, params: Record<string, unknown>): boolean {
    const key = this.createKey(type, params);
    return this.pendingGenerations.has(key);
  }

  isCompleted(type: string, params: Record<string, unknown>): boolean {
    const key = this.createKey(type, params);
    return this.completedGenerations.has(key);
  }

  clearCache(): void {
    this.cache.clear();
    this.pendingGenerations.clear();
    this.completedGenerations.clear();
  }
}

// Enhanced Memory Manager Class with Persistence
class MemoryManager {
  private memories: Map<string, ConversationMemory> = new Map();
  private readonly STORAGE_KEY = 'flowtusk_conversation_memories';

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([id, memory]) => {
          this.memories.set(id, memory as ConversationMemory);
        });
        console.log('📚 [MemoryManager] Loaded memories from storage');
      }
    } catch (error) {
      console.error('❌ [MemoryManager] Failed to load memories:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const data = Object.fromEntries(this.memories);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
      console.log('💾 [MemoryManager] Saved memories to storage');
    } catch (error) {
      console.error('❌ [MemoryManager] Failed to save memories:', error);
    }
  }

  getMemory(conversationId: string): ConversationMemory | null {
    return this.memories.get(conversationId) || null;
  }

  updateMemory(conversationId: string, updates: Partial<ConversationMemory>): void {
    const current = this.getMemory(conversationId);
    const updated = { ...current, ...updates };
    this.memories.set(conversationId, updated);
    this.saveToStorage();
  }

  addGenerationRecord(conversationId: string, action: string, result: Record<string, unknown>, success: boolean = true): void {
    const memory = this.getMemory(conversationId);
    if (memory) {
      memory.generationHistory.push({
        timestamp: new Date(),
        action,
        result,
        success
      });
      this.saveToStorage();
    }
  }

  getLastAction(conversationId: string): string | null {
    const memory = this.getMemory(conversationId);
    return memory?.userPreferences.lastAction || null;
  }

  setLastAction(conversationId: string, action: string): void {
    const memory = this.getMemory(conversationId);
    if (memory) {
      memory.userPreferences.lastAction = action;
      this.saveToStorage();
    }
  }

  getGenerationHistory(conversationId: string): Array<{
    timestamp: Date;
    action: string;
    result: Record<string, unknown>;
    success: boolean;
  }> {
    const memory = this.getMemory(conversationId);
    return memory?.generationHistory || [];
  }

  getCompletedActions(conversationId: string): string[] {
    const history = this.getGenerationHistory(conversationId);
    return history
      .filter(record => record.success)
      .map(record => record.action);
  }

  canPerformAction(conversationId: string, action: string): boolean {
    const completed = this.getCompletedActions(conversationId);
    const memory = this.getMemory(conversationId);
    
    if (!memory) return false;

    // Define action dependencies (using actual recorded action names)
    const dependencies: Record<string, string[]> = {
      'select-icp': [], // No prerequisite - ICPs can be selected when shown
      'value-prop': ['select-icp'],
      'funnel': ['value-prop'],
      'make-content-choice': ['funnel'],
      'email': ['make-content-choice'],
      'linkedin': ['make-content-choice'],
    };

    const required = dependencies[action] || [];
    return required.every(dep => completed.includes(dep));
  }

  clearMemory(conversationId: string): void {
    this.memories.delete(conversationId);
    this.saveToStorage();
  }

  exportMemory(conversationId: string): string {
    const memory = this.getMemory(conversationId);
    return JSON.stringify(memory, null, 2);
  }
}

// Initialize managers
const generationManager = new GenerationManager();
const memoryManager = new MemoryManager();

// Smart Button Component with State Management
interface SmartButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  action: string;
  onClick: () => void | Promise<void>;
  children: React.ReactNode;
  disabled?: boolean;
  loadingText?: string;
  conversationId?: string;
}

// Memory Status Indicator Component
const MemoryStatusIndicator: React.FC<{ conversationId: string }> = ({ conversationId }) => {
  const memory = memoryManager.getMemory(conversationId);
  const completedActions = memoryManager.getCompletedActions(conversationId);
  
  if (!memory || completedActions.length === 0) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-white dark:bg-gray-800 border rounded-lg p-3 shadow-lg max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm font-medium">Memory Active</span>
      </div>
      <div className="text-xs text-gray-600 dark:text-gray-400">
        <div>Completed: {completedActions.length} actions</div>
        <div>Last: {memory.userPreferences.lastAction || 'None'}</div>
      </div>
    </div>
  );
};

export const SmartButton: React.FC<SmartButtonProps> = ({ 
  action, 
  onClick, 
  children, 
  disabled: propDisabled,
  loadingText = "Generating...",
  conversationId,
  ...props 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  
  const isActionDisabled = (action: string): boolean => {
    if (!conversationId) return false;
    
    // Check if generation is in progress
    if (generationManager.isGenerating(action, {})) {
      return true;
    }
    
    // Check if already completed (for certain actions)
    if (['value-prop', 'email', 'linkedin', 'landing'].includes(action)) {
      return generationManager.isCompleted(action, {});
    }
    
    return false;
  };

  const handleClick = async () => {
    if (isActionDisabled(action) || isLoading || propDisabled) return;
    
    setIsLoading(true);
    
    try {
      await onClick();
    } catch (error) {
      console.error(`SmartButton error for ${action}:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const isDisabled = propDisabled || isActionDisabled(action) || isLoading;
  
  return (
    <button
      {...props}
      disabled={isDisabled}
      onClick={handleClick}
      className={`${props.className || ''} ${isDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
};

// Thinking Block Component
function ThinkingBlock({ thinking }: { thinking: ThinkingStep[] }) {
  const [expanded, setExpanded] = useState(false);
  const totalTime = thinking.reduce((sum, s) => sum + (s.duration || 0), 0);
  const allComplete = thinking.every(s => s.status === 'complete');
  const hasError = thinking.some(s => s.status === 'error');
  
  return (
    <Card className="border-l-4 border-l-purple-500">
      <button 
        onClick={() => setExpanded(!expanded)}
        className="w-full p-3 flex items-center justify-between hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {hasError ? (
            <div className="h-9 w-9 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
              <span className="text-red-600 dark:text-red-400">✗</span>
            </div>
          ) : allComplete ? (
            <div className="h-9 w-9 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            </div>
          ) : (
            <div className="h-9 w-9 rounded-full bg-purple-100 dark:bg-purple-950 flex items-center justify-center">
              <Loader2 className="h-5 w-5 animate-spin text-purple-600 dark:text-purple-400" />
            </div>
          )}
          <div className="text-left">
            <div className="text-sm font-medium">
              {hasError ? 'Error occurred' : allComplete ? 'Analysis complete' : 'Thinking...'}
            </div>
            <div className="text-xs text-muted-foreground">
              {thinking.filter(s => s.status === 'complete').length} / {thinking.length} steps
              {totalTime > 0 && ` • ${(totalTime / 1000).toFixed(1)}s`}
            </div>
          </div>
        </div>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="px-3 pb-3 space-y-3 border-t pt-3">
          {thinking.map(step => (
            <div key={step.id} className="flex items-start gap-2">
              <div className="mt-1 shrink-0">
                {step.status === 'complete' && (
                  <div className="h-5 w-5 rounded-full bg-green-100 dark:bg-green-950 flex items-center justify-center">
                    <Check className="h-3 w-3 text-green-600 dark:text-green-400" />
                  </div>
                )}
                {step.status === 'running' && (
                  <Loader2 className="h-5 w-5 animate-spin text-purple-600 dark:text-purple-400" />
                )}
                {step.status === 'pending' && (
                  <div className="h-5 w-5 rounded-full bg-muted border-2 border-muted-foreground/20" />
                )}
                {step.status === 'error' && (
                  <div className="h-5 w-5 rounded-full bg-red-100 dark:bg-red-950 flex items-center justify-center">
                    <span className="text-xs text-red-600 dark:text-red-400">✗</span>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{step.label}</span>
                  {step.duration && (
                    <span className="text-xs text-muted-foreground shrink-0">
                      {(step.duration / 1000).toFixed(1)}s
                    </span>
                  )}
                </div>
                {step.substeps && step.substeps.length > 0 && (
                  <div className="mt-1.5 space-y-1">
                    {step.substeps.map((substep, idx) => (
                      <div key={idx} className="text-xs text-muted-foreground flex items-start gap-1.5">
                        <span className="mt-1">→</span>
                        <span>{substep}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>("");
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [selectedIcp, setSelectedIcp] = useState<ICP | null>(null);
  const [showProfilesDrawer, setShowProfilesDrawer] = useState(false);
  const [selectedProfilesICP, setSelectedProfilesICP] = useState<ICP | null>(null);
  const [linkedInProfiles, setLinkedInProfiles] = useState<LinkedInProfile[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConversation = conversations.find(c => c.id === activeConversationId);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeConversation?.messages]);

  const createNewConversation = () => {
    const newConvId = nanoid();
    const newConv: Conversation = {
      id: newConvId,
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
      generationState: {
        currentStep: 'analysis',
        completedSteps: [],
        generatedContent: {},
        isGenerating: false,
        generationId: undefined,
        lastGenerationTime: undefined,
      },
      userJourney: {
        websiteAnalyzed: false,
        icpSelected: false,
        valuePropGenerated: false,
        contentChoiceMade: false,
        finalContentGenerated: false,
      },
      memory: {
        id: newConvId,
        websiteUrl: "",
        selectedIcp: null,
        generationHistory: [],
        userPreferences: {
          preferredContentType: "",
          lastAction: "",
        },
      },
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConvId);
    setSelectedIcp(null);
    setWebsiteUrl("");
    
    // Initialize memory manager
    memoryManager.updateMemory(newConvId, newConv.memory);
  };

  const addMessage = (message: ChatMessage) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, messages: [...conv.messages, message] }
          : conv
      )
    );
  };

  // Enhanced state management utilities
  const updateGenerationState = (updates: Partial<GenerationState>) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { 
              ...conv, 
              generationState: { ...conv.generationState, ...updates },
              lastGenerationTime: new Date()
            }
          : conv
      )
    );
  };

  const updateUserJourney = (updates: Partial<UserJourney>) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? { ...conv, userJourney: { ...conv.userJourney, ...updates } }
          : conv
      )
    );
  };

  // const updateConversationMemory = (updates: Partial<ConversationMemory>) => {
  //   setConversations(prev =>
  //     prev.map(conv =>
  //       conv.id === activeConversationId
  //         ? { ...conv, memory: { ...conv.memory, ...updates } }
  //         : conv
  //     )
  //   );
  //   // Also update memory manager
  //   memoryManager.updateMemory(activeConversationId, updates);
  // };

  const isGenerationInProgress = (type: string, params: Record<string, unknown> = {}): boolean => {
    return generationManager.isGenerating(type, params);
  };

  const isGenerationCompleted = (type: string, params: Record<string, unknown> = {}): boolean => {
    return generationManager.isCompleted(type, params);
  };

  const canPerformAction = (action: string): boolean => {
    if (!activeConversation) return false;
    
    const { generationState } = activeConversation;
    
    // Check if generation is in progress
    if (generationState.isGenerating) {
      return false;
    }
    
    // Use memory manager for dependency checking
    const memoryCanPerform = memoryManager.canPerformAction(activeConversationId, action);
    
    // Additional checks for specific actions
    switch (action) {
      case 'select-icp':
        return memoryCanPerform && !generationState.isGenerating;
      case 'generate-value-prop':
        return memoryCanPerform && !generationState.isGenerating;
      case 'generate-funnel':
        return memoryCanPerform && !generationState.isGenerating;
      case 'make-content-choice':
        return memoryCanPerform && !generationState.isGenerating;
      case 'generate-email':
        return memoryCanPerform && !generationState.isGenerating;
      case 'generate-landing':
        return memoryCanPerform && !generationState.isGenerating;
      default:
        return !generationState.isGenerating;
    }
  };


  const updateThinkingStep = (messageId: string, stepId: string, updates: Partial<ThinkingStep>) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: conv.messages.map(m =>
                m.id === messageId
                  ? {
                      ...m,
                      thinking: m.thinking?.map(s =>
                        s.id === stepId ? { ...s, ...updates } : s
                      ),
                    }
                  : m
              ),
            }
          : conv
      )
    );
  };

  const updateConversationTitle = (title: string) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId ? { ...conv, title } : conv
      )
    );
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    // Ensure we have an active conversation and get the ID
    const convId = ensureActiveConversation();
    
    // Wait a tick for state to settle if we just created a new conversation
    if (convId !== activeConversationId) {
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: "user",
      content: input,
    };

    addMessage(userMessage);
    const userInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Check if it's a URL - analyze website
      const urlPattern = /https?:\/\/[^\s]+/;
      if (urlPattern.test(userInput)) {
        const url = userInput.match(urlPattern)?.[0] || "";
        setWebsiteUrl(url);
        updateConversationTitle(new URL(url).hostname);

        // Create thinking message with all steps
        const thinkingMsgId = nanoid();
        addMessage({
          id: thinkingMsgId,
          role: "assistant",
          content: "thinking",
          thinking: [
            { id: 'analyze', label: 'Analyzing website', status: 'pending' },
            { id: 'extract', label: 'Extracting visuals', status: 'pending' },
            { id: 'generate', label: 'Generating customer profiles', status: 'pending' },
          ],
        });

        // Step 1: Analyze website
        const analyzeStart = Date.now();
        updateThinkingStep(thinkingMsgId, 'analyze', { 
          status: 'running', 
          startTime: analyzeStart,
          substeps: ['Fetching website content', 'Parsing structure']
        });

        const analyzeRes = await fetch("/api/analyze-website", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });

        if (!analyzeRes.ok) throw new Error("Failed to analyze website");
        const { content, metadata } = await analyzeRes.json();
        
        const analyzeSubsteps = [
          `Parsed ${Math.round(content.length / 1000)}k characters`,
          metadata?.heroImage ? 'Found hero image' : 'No hero image found'
        ];
        
        updateThinkingStep(thinkingMsgId, 'analyze', { 
          status: 'complete',
          duration: Date.now() - analyzeStart,
          substeps: analyzeSubsteps
        });

        // Step 2: Extract visuals
        const extractStart = Date.now();
        updateThinkingStep(thinkingMsgId, 'extract', { 
          status: 'running',
          startTime: extractStart,
          substeps: ['Analyzing brand colors', 'Extracting images']
        });

        // Store metadata
        // Note: metadata saved for future use

        updateThinkingStep(thinkingMsgId, 'extract', { 
          status: 'complete',
          duration: Date.now() - extractStart,
          substeps: [
            metadata?.heroImage ? `Hero image: ${new URL(metadata.heroImage).hostname}` : 'Using gradient fallback',
            'Visual metadata ready'
          ]
        });

        // Step 3: Generate ICPs
        const icpStart = Date.now();
        updateThinkingStep(thinkingMsgId, 'generate', { 
          status: 'running',
          startTime: icpStart,
          substeps: ['Analyzing content patterns', 'Identifying target audiences', 'Creating personas']
        });

        const icpRes = await fetch("/api/generate-icps", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content }),
        });

        if (!icpRes.ok) throw new Error("Failed to generate ICPs");
        const { icps, brandColors, summary } = await icpRes.json();
        
        // Store brand colors
        // Note: brandColors saved for future use

        updateThinkingStep(thinkingMsgId, 'generate', { 
          status: 'complete',
          duration: Date.now() - icpStart,
          substeps: [
            `Generated ${icps.length} customer profiles`,
            `Brand colors: ${brandColors?.primary || 'default'}`,
            'Personas ready for selection'
          ]
        });

        // Build summary message
        const hostname = new URL(url).hostname.replace('www.', '');
        const businessDesc = summary?.businessDescription || "your business";
        const targetMarket = summary?.targetMarket || "";
        const painPoints = summary?.painPointsWithMetrics || [];
        const multiplier = summary?.opportunityMultiplier || "3";
        
        const summaryText = `I've analyzed **${hostname}** and discovered key insights:

${businessDesc}${targetMarket ? ` ${targetMarket}` : ''}

**Key Pain Points & Impact:**
${painPoints.slice(0, 3).map((p: { pain: string; metric: string }) => `• **${p.pain}** — ${p.metric}`).join('\n')}

**Growth Opportunity:** By targeting the right customer profile with personalized messaging, you have potential to reach up to **${multiplier}x more qualified leads** and significantly improve conversion rates.

I've identified **${icps.length} ideal customer profiles** below. Select one to customize your funnel:`;

        // Show summary
        addMessage({
          id: nanoid(),
          role: "assistant",
          content: summaryText,
        });

        // Show ICP cards
        addMessage({
          id: nanoid(),
          role: "assistant",
          content: "",
          component: "icps",
          data: icps,
        });

        // Record website analysis completion
        updateUserJourney({ websiteAnalyzed: true });
        memoryManager.addGenerationRecord(activeConversationId, 'website-analyzed', { icps, summary } as Record<string, unknown>);
      } else if (selectedIcp && websiteUrl) {
        // Chat refinement
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            messages: activeConversation?.messages.map(m => ({
              role: m.role,
              content: m.content,
            })) || [],
            websiteUrl,
            icp: selectedIcp,
          }),
        });

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let assistantMessage = "";

        const assistantMsgId = nanoid();
        addMessage({ id: assistantMsgId, role: "assistant", content: "" });

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value);
            assistantMessage += chunk;

            setConversations(prev =>
              prev.map(conv =>
                conv.id === activeConversationId
                  ? {
                      ...conv,
                      messages: conv.messages.map(m =>
                        m.id === assistantMsgId ? { ...m, content: assistantMessage } : m
                      ),
                    }
                  : conv
              )
            );
          }

          // Parse JSON and update landing page
          try {
            const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
              const parsed = JSON.parse(jsonMatch[0]);
              
              setConversations(prev =>
                prev.map(conv =>
                  conv.id === activeConversationId
                    ? {
                        ...conv,
                        messages: conv.messages.map(m =>
                          m.id === assistantMsgId
                            ? { ...m, content: parsed.message || assistantMessage }
                            : m.component === "landing-preview"
                            ? { ...m, data: { ...m.data, ...parsed.updates } }
                            : m
                        ),
                      }
                    : conv
                )
              );
            }
          } catch {
            // Not JSON
          }
        }
      }
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "Sorry, something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-create conversation if none exists
  const ensureActiveConversation = () => {
    if (!activeConversationId || !activeConversation) {
      const newConv: Conversation = {
        id: nanoid(),
        title: "New conversation",
        messages: [],
        createdAt: new Date(),
      };
      setConversations(prev => [newConv, ...prev]);
      setActiveConversationId(newConv.id);
      return newConv.id; // Return the new ID immediately
    }
    return activeConversationId;
  };

  // Mock LinkedIn profile generator
  const generateMockProfiles = (): LinkedInProfile[] => {
    const mockProfiles: LinkedInProfile[] = [
      {
        id: '1',
        name: 'Sarah Chen',
        headline: 'VP of Marketing at FastGrow | Growth Strategy & B2B SaaS',
        company: 'FastGrow',
        location: 'San Francisco, CA',
        photoUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=SarahChen`,
        matchScore: 94,
        matchReasons: [
          'Matches target role and seniority',
          'Active in B2B marketing communities',
          'Recent posts about growth challenges'
        ],
        recentPosts: [
          {
            id: 'p1',
            content: 'Struggling to scale our demand gen without increasing CAC. Any proven frameworks?',
            timestamp: '2d ago',
            engagement: 127
          },
          {
            id: 'p2',
            content: 'Just implemented account-based marketing. Results are promising but resource-intensive.',
            timestamp: '1w ago',
            engagement: 89
          }
        ],
        experience: [
          { title: 'VP Marketing', company: 'FastGrow', duration: '2y 3m' },
          { title: 'Director of Growth', company: 'ScaleUp Inc', duration: '3y 1m' }
        ]
      },
      {
        id: '2',
        name: 'Michael Rodriguez',
        headline: 'Chief Revenue Officer | Scaling B2B SaaS to $50M ARR',
        company: 'CloudSync',
        location: 'Austin, TX',
        photoUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=MichaelRodriguez`,
        matchScore: 91,
        matchReasons: [
          'Decision maker for revenue tools',
          'Actively hiring growth team',
          'Budget owner for marketing stack'
        ],
        recentPosts: [
          {
            id: 'p3',
            content: 'Looking for recommendations on modern lead gen tools. What\'s actually working in 2024?',
            timestamp: '3d ago',
            engagement: 203
          }
        ],
        experience: [
          { title: 'Chief Revenue Officer', company: 'CloudSync', duration: '1y 8m' },
          { title: 'VP Sales', company: 'DataStream', duration: '4y 2m' }
        ]
      },
      {
        id: '3',
        name: 'Emily Watson',
        headline: 'Head of Demand Generation | Building Scalable Growth Engines',
        company: 'TechVision',
        location: 'New York, NY',
        photoUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=EmilyWatson`,
        matchScore: 89,
        matchReasons: [
          'Pain points align with solution',
          'Company in growth phase (Series B)',
          'Recent budget allocation for tools'
        ],
        recentPosts: [
          {
            id: 'p4',
            content: 'Our pipeline is healthy but conversion rates dropped 15%. Time to revisit our ICP.',
            timestamp: '5d ago',
            engagement: 156
          },
          {
            id: 'p5',
            content: 'Personalization at scale is the holy grail. Who\'s cracked this?',
            timestamp: '2w ago',
            engagement: 94
          }
        ],
        experience: [
          { title: 'Head of Demand Gen', company: 'TechVision', duration: '2y 1m' },
          { title: 'Senior Marketing Manager', company: 'InnovateCo', duration: '3y 6m' }
        ]
      },
      {
        id: '4',
        name: 'David Park',
        headline: 'Director of Marketing Operations | MarTech Stack Optimization',
        company: 'Velocity Labs',
        location: 'Seattle, WA',
        photoUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=DavidPark`,
        matchScore: 87,
        matchReasons: [
          'Owns marketing technology decisions',
          'Looking to consolidate tools',
          'Budget cycle starts next quarter'
        ],
        recentPosts: [
          {
            id: 'p6',
            content: 'Auditing our martech stack. 23 tools, but only using 40% of features. Time to streamline.',
            timestamp: '1w ago',
            engagement: 178
          }
        ],
        experience: [
          { title: 'Director Marketing Ops', company: 'Velocity Labs', duration: '1y 11m' },
          { title: 'Marketing Operations Lead', company: 'GrowthCorp', duration: '2y 8m' }
        ]
      },
      {
        id: '5',
        name: 'Jennifer Liu',
        headline: 'Growth Marketing Lead | Performance Marketing & Analytics',
        company: 'Momentum',
        location: 'Boston, MA',
        photoUrl: `https://api.dicebear.com/7.x/notionists/svg?seed=JenniferLiu`,
        matchScore: 85,
        matchReasons: [
          'Data-driven decision maker',
          'Experimenting with new channels',
          'Team recently expanded'
        ],
        recentPosts: [
          {
            id: 'p7',
            content: 'Attribution modeling is broken. We need better visibility into what actually drives conversions.',
            timestamp: '4d ago',
            engagement: 142
          },
          {
            id: 'p8',
            content: 'Hiring 2 growth marketers. DM if interested! Looking for people who love experiments.',
            timestamp: '1w ago',
            engagement: 67
          }
        ],
        experience: [
          { title: 'Growth Marketing Lead', company: 'Momentum', duration: '1y 5m' },
          { title: 'Senior Growth Manager', company: 'StartupXYZ', duration: '2y 3m' }
        ]
      }
    ];

    return mockProfiles;
  };

  const handleShowProfiles = (e: React.MouseEvent, icp: ICP) => {
    e.stopPropagation(); // Prevent card click
    setSelectedProfilesICP(icp);
    setLoadingProfiles(true);
    setShowProfilesDrawer(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const profiles = generateMockProfiles();
      setLinkedInProfiles(profiles);
      setLoadingProfiles(false);
    }, 800);
  };

  const handleSelectIcp = async (icp: ICP) => {
    // Check if action is allowed
    if (!canPerformAction('select-icp')) {
      console.log('🚫 [handleSelectIcp] Action not allowed - generation in progress or prerequisites not met');
      return;
    }

    // Check if already completed for this ICP
    if (isGenerationCompleted('value-prop', { icp: icp.id })) {
      console.log('✅ [handleSelectIcp] Value prop already generated for this ICP');
      setSelectedIcp(icp);
      updateUserJourney({ icpSelected: true });
      return;
    }

    // Check if currently generating
    if (isGenerationInProgress('value-prop', { icp: icp.id })) {
      console.log('⏳ [handleSelectIcp] Value prop generation already in progress');
      return;
    }

    setSelectedIcp(icp);
    updateGenerationState({ 
      isGenerating: true, 
      generationId: `value-prop-${icp.id}`,
      currentStep: 'value-prop'
    });
    updateUserJourney({ icpSelected: true });
    
    // Record ICP selection
    memoryManager.addGenerationRecord(activeConversationId, 'select-icp', { icpId: icp.id, icpTitle: icp.title } as Record<string, unknown>);

    addMessage({
      id: nanoid(),
      role: "user",
      content: `Create value proposition for: ${icp.title}`,
    });

    // Create thinking message for value prop
    const thinkingMsgId = nanoid();
    addMessage({
      id: thinkingMsgId,
      role: "assistant",
      content: "thinking",
      thinking: [
        { id: 'analyze', label: 'Analyzing persona insights', status: 'pending' },
        { id: 'generate', label: 'Crafting value proposition', status: 'pending' },
        { id: 'variations', label: 'Creating variations', status: 'pending' },
      ],
    });

    try {
      // Use idempotent generation
      const valuePropData = await generationManager.generate(
        'value-prop',
        { icp: icp.id, websiteUrl },
        async () => {
          // Step 1: Analyze
          const analyzeStart = Date.now();
          updateThinkingStep(thinkingMsgId, 'analyze', { 
            status: 'running', 
            startTime: analyzeStart,
            substeps: ['Extracting pain points', 'Identifying goals']
          });

          await new Promise(resolve => setTimeout(resolve, 400));

          updateThinkingStep(thinkingMsgId, 'analyze', { 
            status: 'complete',
            duration: Date.now() - analyzeStart,
            substeps: [`${icp.painPoints.length} pain points identified`, `${icp.goals.length} goals mapped`]
          });

          // Step 2: Generate value prop
          const generateStart = Date.now();
          updateThinkingStep(thinkingMsgId, 'generate', { 
            status: 'running',
            startTime: generateStart,
            substeps: ['Creating template with variables']
          });

          const valuePropRes = await fetch("/api/generate-value-prop", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              icp,
              websiteUrl
            }),
          });

          if (!valuePropRes.ok) throw new Error("Failed to generate value prop");
          const data = await valuePropRes.json();

          updateThinkingStep(thinkingMsgId, 'generate', { 
            status: 'complete',
            duration: Date.now() - generateStart,
            substeps: ['Template ready with 7 variables']
          });

          // Step 3: Variations (already generated)
          const variationsStart = Date.now();
          updateThinkingStep(thinkingMsgId, 'variations', { 
            status: 'running',
            startTime: variationsStart,
            substeps: ['Generating 5 style variations']
          });

          await new Promise(resolve => setTimeout(resolve, 300));

          updateThinkingStep(thinkingMsgId, 'variations', { 
            status: 'complete',
            duration: Date.now() - variationsStart,
            substeps: ['5 variations ready']
          });

          return data;
        }
      );

      // Show value prop builder
      const valuePropMsgId = nanoid();
      addMessage({
        id: valuePropMsgId,
        role: "assistant",
        content: `Here's your personalized value proposition for **${icp.title}**. Customize the variables to match your messaging, then click "Generate Variations" to see different styles.`,
        component: "value-prop",
        data: {
          ...valuePropData,
          icp
        },
      });

      // Update state with generated content
      updateGenerationState({
        generatedContent: {
          ...activeConversation?.generationState.generatedContent,
          valueProp: valuePropData
        },
        completedSteps: [...(activeConversation?.generationState.completedSteps || []), 'value-prop']
      });
      updateUserJourney({ valuePropGenerated: true });

      // Record in memory
      memoryManager.addGenerationRecord(activeConversationId, 'value-prop', valuePropData);
      memoryManager.setLastAction(activeConversationId, 'select-icp');

      // Ask user if they want to continue
      await new Promise(resolve => setTimeout(resolve, 500));
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "🎉 Great! Your value proposition is ready. Would you like to create an outreach strategy to connect with this audience?",
        component: "continue-to-funnel",
        data: { icp },
      });

    } catch (error) {
      console.error("Error:", error);
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "Sorry, something went wrong generating the value proposition. Please try again.",
      });
      memoryManager.addGenerationRecord(activeConversationId, 'value-prop', null, false);
    } finally {
      updateGenerationState({ 
        isGenerating: false, 
        generationId: undefined 
      });
    }
  };

  const handleGenerateFunnel = async (icp: ICP) => {
    console.log('🚀 [handleGenerateFunnel] Starting funnel generation for ICP:', icp.id);
    
    // Show funnel summary
    addMessage({
      id: nanoid(),
      role: "assistant",
      content: `Perfect! Here's your complete outreach strategy for **${icp.title}**:`,
      component: "funnel-summary",
      data: { 
        icp,
        valueProp: activeConversation?.generationState.generatedContent.valueProp?.variations?.[0]?.text || "Your value proposition",
        strategy: `This strategy works because ${icp.personaRole}s typically respond well to personalized email outreach that addresses their specific pain points.`,
        benchmarks: "25-35% open rate, 5-8% conversion rate, 15-25% lead capture rate"
      },
    });

    // Show funnel choices after summary
    await new Promise(resolve => setTimeout(resolve, 300));
    addMessage({
      id: nanoid(),
      role: "assistant",
      content: "",
      component: "funnel-choice",
      data: { icp },
    });

    // Record funnel generation in memory
    memoryManager.addGenerationRecord(activeConversationId, 'funnel', { 
      icp, 
      valueProp: activeConversation?.generationState.generatedContent.valueProp 
    } as Record<string, unknown>);
  };

  const handleContentChoice = async (
    choice: 'linkedin' | 'email' | 'landing' | 'lead-magnet',
    icp: ICP
  ) => {
    // Check if action is allowed
    if (!canPerformAction('make-content-choice')) {
      console.log('🚫 [handleContentChoice] Action not allowed - generation in progress or prerequisites not met');
      return;
    }

    if (choice === 'lead-magnet') {
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "🎨 Lead Magnet Generator is coming soon! This will help you create downloadable resources like checklists, templates, and guides to capture emails.",
      });
      return;
    }

    // Check if already completed for this choice and ICP
    if (isGenerationCompleted(choice, { icp: icp.id })) {
      console.log(`✅ [handleContentChoice] ${choice} already generated for this ICP`);
      updateUserJourney({ contentChoiceMade: true });
      return;
    }

    // Check if currently generating
    if (isGenerationInProgress(choice, { icp: icp.id })) {
      console.log(`⏳ [handleContentChoice] ${choice} generation already in progress`);
      return;
    }

    updateGenerationState({ 
      isGenerating: true, 
      generationId: `${choice}-${icp.id}`,
      currentStep: 'generation'
    });
    updateUserJourney({ contentChoiceMade: true });

    const choiceTitles = {
      linkedin: 'LinkedIn Outreach Sequence',
      email: 'Email Nurture Sequence',
      landing: 'Landing Page',
      'lead-magnet': 'Lead Magnet'
    };

    addMessage({
      id: nanoid(),
      role: "user",
      content: `Generate ${choiceTitles[choice]} for: ${icp.title}`,
    });

    // Create thinking message
    const thinkingMsgId = nanoid();
    const thinkingSteps = choice === 'linkedin' 
      ? [
          { id: 'analyze', label: 'Analyzing LinkedIn best practices', status: 'pending' as const },
          { id: 'connection', label: 'Crafting connection request', status: 'pending' as const },
          { id: 'followups', label: 'Creating follow-up messages', status: 'pending' as const },
        ]
      : [
          { id: 'analyze', label: 'Analyzing email sequence strategy', status: 'pending' as const },
          { id: 'subjects', label: 'Generating subject line variations', status: 'pending' as const },
          { id: 'emails', label: 'Writing email sequence', status: 'pending' as const },
        ];

    addMessage({
      id: thinkingMsgId,
      role: "assistant",
      content: "thinking",
      thinking: thinkingSteps,
    });

    try {
      // Use idempotent generation
      const data = await generationManager.generate(
        choice,
        { icp: icp.id, websiteUrl },
        async () => {
          const apiRoute = choice === 'linkedin' 
            ? '/api/generate-linkedin-outreach'
            : '/api/generate-email-sequence';

          // Step 1: Analyze
          const analyzeStart = Date.now();
          updateThinkingStep(thinkingMsgId, 'analyze', { 
            status: 'running',
            startTime: analyzeStart,
          });

          await new Promise(resolve => setTimeout(resolve, 400));

          updateThinkingStep(thinkingMsgId, 'analyze', { 
            status: 'complete',
            duration: Date.now() - analyzeStart,
          });

          // Step 2
          const step2Start = Date.now();
          const step2Id = choice === 'linkedin' ? 'connection' : 'subjects';
          updateThinkingStep(thinkingMsgId, step2Id, { 
            status: 'running',
            startTime: step2Start,
          });

          const response = await fetch(apiRoute, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              icp,
              websiteUrl
            }),
          });

          if (!response.ok) throw new Error(`Failed to generate ${choice} content`);
          const result = await response.json();

          updateThinkingStep(thinkingMsgId, step2Id, { 
            status: 'complete',
            duration: Date.now() - step2Start,
          });

          return result;
        }
      );

      // Step 3
      const step3Start = Date.now();
      const step3Id = choice === 'linkedin' ? 'followups' : 'emails';
      updateThinkingStep(thinkingMsgId, step3Id, { 
        status: 'running',
        startTime: step3Start,
      });

      await new Promise(resolve => setTimeout(resolve, 300));

      updateThinkingStep(thinkingMsgId, step3Id, { 
        status: 'complete',
        duration: Date.now() - step3Start,
      });

      // Show results
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: `Here's your ${choiceTitles[choice]} for **${icp.title}**. All messages are ready to copy and customize!`,
        component: choice === 'linkedin' ? 'linkedin-outreach' : 'email-sequence',
        data: { ...data, personaTitle: icp.title },
      });

      // Update state with generated content
      updateGenerationState({
        generatedContent: {
          ...activeConversation?.generationState.generatedContent,
          [choice === 'linkedin' ? 'linkedinOutreach' : 'emailSequence']: data
        },
        completedSteps: [...(activeConversation?.generationState.completedSteps || []), choice]
      });
      updateUserJourney({ finalContentGenerated: true });

      // Show content choice again
      await new Promise(resolve => setTimeout(resolve, 500));
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: `Want to create more content for **${icp.title}**?`,
        component: "content-choice",
        data: { icp },
      });

      // Record in memory
      memoryManager.addGenerationRecord(activeConversationId, choice, data);
      memoryManager.setLastAction(activeConversationId, 'content-choice');

    } catch (error) {
      console.error("Error:", error);
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: `Sorry, something went wrong generating the ${choiceTitles[choice]}. Please try again.`,
      });
      memoryManager.addGenerationRecord(activeConversationId, choice, null, false);
    } finally {
      updateGenerationState({ 
        isGenerating: false, 
        generationId: undefined 
      });
    }
  };

  // New simplified flow handlers
  const handleFunnelChoice = async (choice: 'email' | 'landing', icp: ICP) => {
    if (choice === 'landing') {
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "",
        component: "landing-page-choice",
        data: { icp },
      });
    } else if (choice === 'email') {
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "",
        component: "email-type-choice",
        data: { icp },
      });
    }
  };

  const handleEmailTypeChoice = async (type: 'one-time' | 'sequence', icp: ICP) => {
    if (type === 'one-time') {
      // Generate one-time email directly
      setIsLoading(true);
      addMessage({
        id: nanoid(),
        role: "user",
        content: `Generate one-time email for: ${icp.title}`,
      });

      try {
        const response = await fetch("/api/generate-one-time-email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ icp, websiteContext: websiteUrl }),
        });

        if (!response.ok) throw new Error("Failed to generate one-time email");
        const data = await response.json();

        addMessage({
          id: nanoid(),
          role: "assistant",
          content: `Here's your **One-Time Email** for **${icp.title}**:`,
          component: "one-time-email",
          data: { ...data, personaTitle: icp.title },
        });
      } catch (error) {
        console.error("Error:", error);
        addMessage({
          id: nanoid(),
          role: "assistant",
          content: "Sorry, something went wrong generating the email. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    } else if (type === 'sequence') {
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "",
        component: "sequence-length-choice",
        data: { icp },
      });
    }
  };

  const handleSequenceLengthChoice = async (days: 5 | 7 | 10, icp: ICP) => {
    setIsLoading(true);
    addMessage({
      id: nanoid(),
      role: "user",
      content: `Generate ${days}-day email sequence for: ${icp.title}`,
    });

    try {
      const response = await fetch("/api/generate-email-sequence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icp, websiteUrl, sequenceLength: days }),
      });

      if (!response.ok) throw new Error("Failed to generate email sequence");
      const data = await response.json();

      addMessage({
        id: nanoid(),
        role: "assistant",
        content: `Here's your **${days}-Day Email Sequence** for **${icp.title}**:`,
        component: "email-sequence",
        data: { ...data, personaTitle: icp.title },
      });
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "Sorry, something went wrong generating the sequence. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFunnelSummaryRegenerate = async (icp: ICP) => {
    // Regenerate funnel summary with same data
    addMessage({
      id: nanoid(),
      role: "assistant",
      content: `Here's your updated marketing funnel strategy for **${icp.title}**:`,
      component: "funnel-summary",
      data: { 
        icp,
        valueProp: "Your value proposition",
        strategy: `This funnel works because ${icp.personaRole}s typically respond well to personalized email outreach followed by targeted landing pages that address their specific pain points.`,
        benchmarks: "25-35% open rate, 5-8% conversion rate, 15-25% lead capture rate"
      },
    });
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r flex flex-col">
        <div className="p-4 border-b">
          <div className="font-semibold mb-4">Flowtusk</div>
          <Button
            onClick={createNewConversation}
            className="w-full"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" />
            New conversation
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-1">
            {conversations.map(conv => (
              <button
                key={conv.id}
                onClick={() => setActiveConversationId(conv.id)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  conv.id === activeConversationId
                    ? "bg-muted"
                    : "hover:bg-muted/50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 shrink-0" />
                  <span className="truncate">{conv.title}</span>
                </div>
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Messages */}
        <ScrollArea className="flex-1 px-4 py-12" ref={scrollRef}>
          <div className="space-y-4 mx-auto max-w-3xl">
            {!activeConversation?.messages.length && (
              <div className="text-center py-20">
                <Sparkles className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h2 className="text-2xl font-bold mb-2">
                  Generate Landing Pages
                </h2>
                <p className="text-muted-foreground mb-6">
                  Enter a website URL to get started
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {["https://taxstar.app", "https://stripe.com", "https://linear.app"].map(url => (
                    <Button
                      key={url}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        if (!activeConversation) createNewConversation();
                        setInput(url);
                        setTimeout(() => {
                          const form = document.querySelector('form');
                          form?.requestSubmit();
                        }, 100);
                      }}
                    >
                      {url}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {activeConversation?.messages.map(message => (
              <div
                key={message.id}
                className={`flex w-full flex-col gap-2 ${
                  message.role === "user" ? "items-end" : "items-start"
                }`}
              >
                {message.role === "user" ? (
                  <div className="bg-muted text-foreground max-w-[85%] rounded-3xl px-5 py-2.5 text-sm">
                    {message.content}
                  </div>
                ) : (
                  <div className="w-full space-y-4">
                    {/* Thinking Block */}
                    {message.content === "thinking" && message.thinking && (
                      <ThinkingBlock thinking={message.thinking} />
                    )}
                    
                    {/* Status Messages (Legacy - fallback) */}
                    {message.content === "crawling_website" && (
                      <SystemMessage variant="loading" icon={<Search className="h-4 w-4" />}>
                        Crawling website and extracting content...
                      </SystemMessage>
                    )}
                    {message.content.startsWith("crawl_complete:") && (() => {
                      const [, pages, source, filepath] = message.content.split(":");
                      return (
                        <SystemMessage variant="success">
                          Crawled {pages} page{pages !== "1" ? "s" : ""} using {source === "firecrawl" ? "Firecrawl" : "Jina AI"}
                          <div className="text-xs text-muted-foreground mt-1">
                            Blueprint saved: {filepath?.split("/").pop()}
                          </div>
                        </SystemMessage>
                      );
                    })()}
                    {message.content === "generating_icps" && (
                      <SystemMessage variant="loading" icon={<Brain className="h-4 w-4" />}>
                        Generating ideal customer profiles...
                      </SystemMessage>
                    )}
                    {message.content === "crafting_landing_page" && (
                      <SystemMessage variant="loading" icon={<Wand2 className="h-4 w-4" />}>
                        Crafting your landing page...
                      </SystemMessage>
                    )}
                    
                    {/* Regular text content */}
                    {message.content && 
                     !message.content.startsWith("crawl_complete:") &&
                     !["crawling_website", "generating_icps", "crafting_landing_page", "thinking"].includes(message.content) && (
                      <div className="text-sm leading-relaxed whitespace-pre-line">
                        {message.content.split('**').map((part, i) => 
                          i % 2 === 0 ? (
                            <span key={i}>{part}</span>
                          ) : (
                            <strong key={i} className="font-semibold">{part}</strong>
                          )
                        )}
                      </div>
                    )}

                    {/* ICP Cards */}
                    {message.component === "icps" && message.data && (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {(message.data as ICP[]).map((icp, idx) => {
                          const colors = [
                            { 
                              gradient: "from-pink-500/10 to-purple-500/10",
                              border: "border-pink-200 dark:border-pink-800",
                              badge: "bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-300",
                              avatar: "ring-pink-200 dark:ring-pink-800",
                              progress: "bg-gradient-to-r from-pink-500 to-purple-500"
                            },
                            { 
                              gradient: "from-purple-500/10 to-blue-500/10",
                              border: "border-purple-200 dark:border-purple-800",
                              badge: "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300",
                              avatar: "ring-purple-200 dark:ring-purple-800",
                              progress: "bg-gradient-to-r from-purple-500 to-blue-500"
                            },
                            { 
                              gradient: "from-blue-500/10 to-cyan-500/10",
                              border: "border-blue-200 dark:border-blue-800",
                              badge: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
                              avatar: "ring-blue-200 dark:ring-blue-800",
                              progress: "bg-gradient-to-r from-blue-500 to-cyan-500"
                            }
                          ];
                          const color = colors[idx % colors.length];
                          
                          // Generate consistent avatar
                          const avatarUrl = `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(icp.personaName || icp.title)}`;
                          
                          // Calculate match score based on data richness
                          const matchScore = Math.min(84 + idx * 4 + (icp.painPoints.length * 2), 98);
                          
                          return (
                            <Card
                              key={icp.id}
                              className={`group relative overflow-hidden border-2 ${color.border} hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-1`}
                              onClick={() => handleSelectIcp(icp)}
                            >
                              {/* Gradient background */}
                              <div className={`absolute inset-0 bg-gradient-to-br ${color.gradient}`} />
                              
                              <div className="relative p-4 space-y-3">
                                {/* Persona Header */}
                                <div className="flex items-start gap-3">
                                  {/* Avatar with online indicator */}
                                  <div className="relative shrink-0">
                                    <img 
                                      src={avatarUrl}
                                      alt={icp.personaName}
                                      className={`w-12 h-12 rounded-xl ring-2 ${color.avatar} ring-offset-2 ring-offset-background group-hover:scale-110 transition-transform`}
                                    />
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background" />
                                  </div>
                                  
                                  <div className="flex-1 min-w-0">
                                    <h3 className="font-bold text-sm mb-0.5 truncate">
                                      {icp.personaName}
                                    </h3>
                                    <p className="text-xs text-muted-foreground truncate">
                                      {icp.personaRole}
                                    </p>
                                    <p className="text-xs text-muted-foreground/70 truncate">
                                      {icp.personaCompany}
                                    </p>
                                    {icp.location && icp.country && (
                                      <div className="flex items-center gap-1 mt-1">
                                        <MapPin className="h-3 w-3 text-muted-foreground/50" />
                                        <p className="text-xs text-muted-foreground/60 truncate">
                                          {icp.location}, {icp.country}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {/* ICP Segment with Score */}
                                <div className="flex items-start gap-2">
                                  <div className="flex-1 min-w-0">
                                    <Badge className={`${color.badge} text-xs font-medium mb-1.5`}>
                                      {icp.title}
                                    </Badge>
                                    <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                                      {icp.description}
                                    </p>
                                  </div>
                                  {/* Conversion Score Badge */}
                                  <div className="flex flex-col items-center gap-0.5 shrink-0">
                                    <div className={`w-11 h-11 rounded-full ${color.badge} flex items-center justify-center border-2 ${color.border}`}>
                                      <span className="text-sm font-bold">{matchScore}%</span>
                                    </div>
                                    <span className="text-[9px] text-muted-foreground font-medium">FIT</span>
                                  </div>
                                </div>

                                {/* Pain Points - Icon + Word */}
                                <div className="pt-2 border-t border-border/50">
                                  <p className="text-xs font-medium text-muted-foreground mb-1.5">
                                    Key Challenges
                                  </p>
                                  <div className="flex flex-wrap gap-2">
                                    {icp.painPoints.slice(0, 3).map((point, pidx) => {
                                      // Extract first 1-2 words or key term
                                      const shortPoint = point.split(' ').slice(0, 2).join(' ').replace(/[^a-zA-Z0-9\s]/g, '');
                                      const icons = ['⚠️', '⏱️', '💸', '📉', '🔧', '⚡'];
                                      return (
                                        <div key={pidx} className="flex items-center gap-1">
                                          <span className="text-xs">{icons[pidx % icons.length]}</span>
                                          <span className="text-xs font-medium">{shortPoint}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* LinkedIn Profiles CTA */}
                                <div className="pt-2 border-t border-border/50 space-y-2">
                                  <div className="flex items-center justify-between">
                                    <p className="text-xs text-muted-foreground">
                                      <span className="font-semibold text-foreground">12+ LinkedIn profiles</span> found
                                    </p>
                                  </div>
                                  <Button 
                                    size="sm"
                                    variant="outline"
                                    className={`w-full h-8 text-xs ${color.badge} border-2 ${color.border} hover:shadow-md transition-all`}
                                    onClick={(e) => handleShowProfiles(e, icp)}
                                  >
                                    <Users className="h-3 w-3 mr-1.5" />
                                    Show Profiles
                                  </Button>
                                </div>

                                {/* Hover CTA */}
                                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="w-7 h-7 rounded-full bg-foreground text-background flex items-center justify-center text-xs font-bold">
                                    →
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })}
                      </div>
                    )}

                    {/* Value Prop Builder */}
                    {message.component === "value-prop" && message.data && (
                      <ValuePropBuilderWrapper
                        valuePropData={message.data as ValuePropData}
                        websiteUrl={websiteUrl}
                        conversationId={activeConversationId}
                      />
                    )}

                    {/* Content Choice Card */}
                    {message.component === "content-choice" && message.data && (() => {
                      const { icp } = message.data as { icp: ICP };
                      return (
                        <ContentChoiceCard
                          onSelect={(choice) => handleContentChoice(choice, icp)}
                        />
                      );
                    })()}

                    {/* Funnel Summary Card */}
                    {message.component === "funnel-summary" && message.data && (() => {
                      const data = message.data as { icp: ICP; valueProp?: string; strategy?: string; benchmarks?: string };
                      return (
                        <FunnelSummaryCard
                          data={data}
                          onRegenerate={() => handleFunnelSummaryRegenerate(data.icp)}
                        />
                      );
                    })()}

                    {/* Funnel Choice Card */}
                    {/* Continue to Funnel Prompt */}
                    {message.component === "continue-to-funnel" && message.data && (() => {
                      const { icp } = message.data as { icp: ICP };
                      return (
                        <Card className="p-6 border-2 border-purple-200 dark:border-purple-800 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-950/20 dark:to-pink-950/20">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex-1">
                              <p className="text-sm text-muted-foreground">
                                Ready to create personalized outreach content for your target audience?
                              </p>
                            </div>
                            <Button
                              onClick={() => handleGenerateFunnel(icp)}
                              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold shadow-lg"
                            >
                              <Sparkles className="h-4 w-4 mr-2" />
                              Create Outreach Strategy
                            </Button>
                          </div>
                        </Card>
                      );
                    })()}

                    {message.component === "funnel-choice" && message.data && (() => {
                      const { icp } = message.data as { icp: ICP };
                      return (
                        <FunnelChoiceCard
                          onSelect={(choice) => handleFunnelChoice(choice, icp)}
                          conversationId={activeConversationId}
                        />
                      );
                    })()}

                    {/* Email Type Choice */}
                    {message.component === "email-type-choice" && message.data && (() => {
                      const { icp } = message.data as { icp: ICP };
                      return (
                        <EmailTypeChoice
                          onSelect={(type) => handleEmailTypeChoice(type, icp)}
                        />
                      );
                    })()}

                    {/* Sequence Length Choice */}
                    {message.component === "sequence-length-choice" && message.data && (() => {
                      const { icp } = message.data as { icp: ICP };
                      return (
                        <SequenceLengthChoice
                          onSelect={(days) => handleSequenceLengthChoice(days, icp)}
                        />
                      );
                    })()}

                    {/* Landing Page Choice */}
                    {/* One-Time Email Card */}
                    {message.component === "one-time-email" && message.data && (() => {
                      const data = message.data as Record<string, unknown>;
                      return (
                        <OneTimeEmailCard
                          data={data}
                          personaTitle={data.personaTitle || "Your Persona"}
                        />
                      );
                    })()}

                    {/* LinkedIn Outreach */}
                    {message.component === "linkedin-outreach" && message.data && (() => {
                      const data = message.data as LinkedInOutreachData & { personaTitle: string };
                      return (
                        <LinkedInOutreachCard
                          data={data}
                          personaTitle={data.personaTitle}
                        />
                      );
                    })()}

                    {/* Email Sequence */}
                    {message.component === "email-sequence" && message.data && (() => {
                      const data = message.data as EmailSequenceData & { personaTitle: string };
                      return (
                        <EmailSequenceCard
                          data={data}
                          personaTitle={data.personaTitle}
                        />
                      );
                    })()}

                  </div>
                )}
              </div>
            ))}

            {isLoading && !activeConversation?.messages.some(m => 
              m.content.includes("🔍") || 
              m.content.includes("✨") || 
              m.content.includes("🧠")
            ) && (
              <div className="flex items-start gap-2">
                <Loader2 className="h-4 w-4 animate-spin mt-1" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="mx-auto w-full max-w-3xl px-4 pb-4">
          <form
            onSubmit={handleSendMessage}
            className="relative w-full rounded-3xl border bg-background p-3 shadow-sm"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                !websiteUrl
                  ? "Enter a website URL to analyze..."
                  : selectedIcp
                  ? "Ask me to refine the page..."
                  : "What would you like to do?"
              }
              disabled={isLoading}
              className="border-0 pr-12 focus-visible:ring-0 bg-transparent"
            />
            <Button
              type="submit"
              disabled={isLoading || !input.trim()}
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 h-9 w-9 rounded-full"
            >
              {isLoading ? (
                <span className="h-3 w-3 rounded-sm bg-white" />
              ) : (
                <ArrowUp className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* LinkedIn Profiles Drawer */}
      <LinkedInProfileDrawer
        open={showProfilesDrawer}
        onOpenChange={setShowProfilesDrawer}
        icp={selectedProfilesICP}
        profiles={linkedInProfiles}
        loading={loadingProfiles}
      />

      {/* Memory Status Indicator */}
      {activeConversationId && (
        <MemoryStatusIndicator conversationId={activeConversationId} />
      )}
    </div>
  );
}
