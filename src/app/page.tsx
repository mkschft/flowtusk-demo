"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowUp, Plus, MessageSquare, Sparkles, Search, Brain, Wand2, Quote, CheckCircle2, Zap, Target, TrendingUp, ChevronDown, Check, Eye, Users, Building, MapPin, Calendar, ExternalLink } from "lucide-react";
import { LandingPageSection } from "@/components/LandingPageSection";
import { LinkedInProfileDrawer } from "@/components/LinkedInProfileDrawer";
import { ValuePropBuilderWrapper } from "@/components/ValuePropBuilderWrapper";
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

type SectionFidelity = 'skeleton' | 'draft' | 'refined' | 'polished';

type LandingPageSection<T> = {
  fidelity: SectionFidelity;
  content: T;
  updatedAt?: number;
};

type LandingPage = {
  hero: LandingPageSection<{
    headline: string;
    subheadline: string;
    cta: string;
  }>;
  testimonial: LandingPageSection<{
    quote: string;
    author: string;
    role: string;
    company: string;
  }>;
  features: LandingPageSection<{
    items: Array<{ title: string; description: string }>;
  }>;
  problemSolution: LandingPageSection<{
    problems: string[];
    solution: string;
  }>;
  stats: LandingPageSection<{
    items: Array<{ value: string; label: string }>;
  }>;
  heroImage?: string;
  brandColors?: { primary: string; secondary: string };
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

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  component?: "icps" | "landing-preview" | "value-prop";
  data?: ICP[] | LandingPage | ValuePropData;
  thinking?: ThinkingStep[];
};

type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: Date;
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
  const [websiteMetadata, setWebsiteMetadata] = useState<{ heroImage?: string; brandColors?: { primary: string; secondary: string } }>({});
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
    const newConv: Conversation = {
      id: nanoid(),
      title: "New conversation",
      messages: [],
      createdAt: new Date(),
    };
    setConversations(prev => [newConv, ...prev]);
    setActiveConversationId(newConv.id);
    setSelectedIcp(null);
    setWebsiteUrl("");
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

  const createSkeletonLandingPage = (): LandingPage => ({
    hero: {
      fidelity: 'skeleton',
      content: { headline: '', subheadline: '', cta: '' },
    },
    testimonial: {
      fidelity: 'skeleton',
      content: { quote: '', author: '', role: '', company: '' },
    },
    features: {
      fidelity: 'skeleton',
      content: { items: [] },
    },
    problemSolution: {
      fidelity: 'skeleton',
      content: { problems: [], solution: '' },
    },
    stats: {
      fidelity: 'skeleton',
      content: { items: [] },
    },
  });

  const updateLandingPageSection = (
    messageId: string,
    sectionKey: keyof LandingPage,
    updates: Partial<LandingPageSection<any>>
  ) => {
    setConversations(prev =>
      prev.map(conv =>
        conv.id === activeConversationId
          ? {
              ...conv,
              messages: conv.messages.map(m =>
                m.id === messageId && m.component === 'landing-preview'
                  ? {
                      ...m,
                      data: {
                        ...(m.data as LandingPage),
                        [sectionKey]: {
                          ...(m.data as LandingPage)[sectionKey],
                          ...updates,
                          updatedAt: Date.now(),
                        },
                      },
                    }
                  : m
              ),
            }
          : conv
      )
    );
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
        if (metadata?.heroImage) {
          setWebsiteMetadata({ heroImage: metadata.heroImage });
        }

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
        if (brandColors) {
          setWebsiteMetadata(prev => ({ ...prev, brandColors }));
        }

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
${painPoints.slice(0, 3).map((p: any) => `• **${p.pain}** — ${p.metric}`).join('\n')}

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
            landingPage: activeConversation?.messages.find(m => m.component === "landing-preview")?.data,
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
          } catch (e) {
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
  const generateMockProfiles = (icp: ICP): LinkedInProfile[] => {
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
    e.stopPropagation(); // Prevent ICP card click
    setSelectedProfilesICP(icp);
    setLoadingProfiles(true);
    setShowProfilesDrawer(true);
    
    // Simulate loading delay
    setTimeout(() => {
      const profiles = generateMockProfiles(icp);
      setLinkedInProfiles(profiles);
      setLoadingProfiles(false);
    }, 800);
  };

  const handleSelectIcp = async (icp: ICP) => {
    setSelectedIcp(icp);
    setIsLoading(true);

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
      const valuePropData = await valuePropRes.json();

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
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "Sorry, something went wrong generating the value proposition. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateLandingPage = async (icp: ICP) => {
    setIsLoading(true);

    addMessage({
      id: nanoid(),
      role: "user",
      content: `Generate landing page for: ${icp.title}`,
    });

    // Create thinking message
    const thinkingMsgId = nanoid();
    addMessage({
      id: thinkingMsgId,
      role: "assistant",
      content: "thinking",
      thinking: [
        { id: 'skeleton', label: 'Building page structure', status: 'pending' },
        { id: 'hero', label: 'Crafting hero section', status: 'pending' },
        { id: 'testimonial', label: 'Writing testimonial', status: 'pending' },
        { id: 'features', label: 'Defining features', status: 'pending' },
        { id: 'problem-solution', label: 'Articulating value', status: 'pending' },
        { id: 'stats', label: 'Adding social proof', status: 'pending' },
      ],
    });

    try {
      // Phase 1: Show skeleton immediately
      const skeletonStart = Date.now();
      updateThinkingStep(thinkingMsgId, 'skeleton', {
        status: 'running',
        startTime: skeletonStart,
        substeps: ['Creating wireframe layout']
      });

      const landingPageId = nanoid();
      const skeletonPage = createSkeletonLandingPage();
      skeletonPage.heroImage = websiteMetadata.heroImage;
      skeletonPage.brandColors = websiteMetadata.brandColors;

      addMessage({
        id: landingPageId,
        role: "assistant",
        content: "Building your landing page...",
        component: "landing-preview",
        data: skeletonPage,
      });

      await new Promise(resolve => setTimeout(resolve, 400));

      updateThinkingStep(thinkingMsgId, 'skeleton', {
        status: 'complete',
        duration: Date.now() - skeletonStart,
        substeps: ['Wireframe ready']
      });

      // Phase 2-6: Two-phase progressive generation
      const sections = [
        { key: 'hero', label: 'hero', thinkingId: 'hero' },
        { key: 'testimonial', label: 'testimonial', thinkingId: 'testimonial' },
        { key: 'features', label: 'features', thinkingId: 'features' },
        { key: 'problemSolution', label: 'problem-solution', thinkingId: 'problem-solution' },
        { key: 'stats', label: 'stats', thinkingId: 'stats' },
      ];

      // PHASE 1: Generate all titles/headlines first
      console.log('🎯 [Client] Phase 1: Generating all titles...');
      for (const section of sections) {
        const sectionStart = Date.now();
        updateThinkingStep(thinkingMsgId, section.thinkingId, {
          status: 'running',
          startTime: sectionStart,
          substeps: ['Generating title...']
        });

        // Call API in "title" mode
        const res = await fetch("/api/generate-landing-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            icp, 
            websiteUrl,
            heroImage: websiteMetadata.heroImage,
            brandColors: websiteMetadata.brandColors,
            section: section.key,
            mode: 'title', // Generate titles only
          }),
        });

        if (!res.ok) throw new Error(`Failed to generate ${section.label} title`);
        const { sectionData } = await res.json();

        // Update with draft fidelity (titles only)
        updateLandingPageSection(landingPageId, section.key as keyof LandingPage, {
          fidelity: 'draft',
          content: sectionData,
        });

        updateThinkingStep(thinkingMsgId, section.thinkingId, {
          status: 'complete',
          duration: Date.now() - sectionStart,
          substeps: ['Title added']
        });

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log('✅ [Client] Phase 1 complete: All titles generated');

      // PHASE 2: Fill in details for each section
      console.log('🎯 [Client] Phase 2: Filling in details...');
      for (const section of sections) {
        const sectionStart = Date.now();
        updateThinkingStep(thinkingMsgId, section.thinkingId, {
          status: 'running',
          startTime: sectionStart,
          substeps: ['Adding details...']
        });

        // Call API in "full" mode
        const res = await fetch("/api/generate-landing-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            icp, 
            websiteUrl,
            heroImage: websiteMetadata.heroImage,
            brandColors: websiteMetadata.brandColors,
            section: section.key,
            mode: 'full', // Generate complete content
          }),
        });

        if (!res.ok) throw new Error(`Failed to generate ${section.label} details`);
        const { sectionData } = await res.json();

        // Update with refined fidelity (full content)
        updateLandingPageSection(landingPageId, section.key as keyof LandingPage, {
          fidelity: 'refined',
          content: sectionData,
        });

        updateThinkingStep(thinkingMsgId, section.thinkingId, {
          status: 'complete',
          duration: Date.now() - sectionStart,
          substeps: ['Title added', 'Details added']
        });

        // Small delay for UX
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      console.log('✅ [Client] Phase 2 complete: All details filled');

      // Update final message
      setConversations(prev =>
        prev.map(conv =>
          conv.id === activeConversationId
            ? {
                ...conv,
                messages: conv.messages.map(m =>
                  m.id === landingPageId
                    ? {
                        ...m,
                        content: `Here's your landing page for ${icp.title}. Ask me to "polish" or "refine" any section!`,
                      }
                    : m
                ),
              }
            : conv
        )
      );
    } catch (error) {
      console.error("Error:", error);
      addMessage({
        id: nanoid(),
        role: "assistant",
        content: "Sorry, something went wrong generating the landing page. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
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
                        onGenerateLandingPage={handleGenerateLandingPage}
                      />
                    )}

                    {/* Landing Page Preview Card */}
                    {message.component === "landing-preview" && message.data && (() => {
                      const landing = message.data as LandingPage;
                      
                      return (
                        <Card className="overflow-hidden border-2 shadow-lg">
                          {/* Preview Header */}
                          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-b px-4 py-3 flex items-center justify-between">
                            <div>
                              <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Sparkles className="h-4 w-4" />
                                Landing Page Preview
                              </h3>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                Progressive generation • Sections will fill in
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" className="h-8 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700">
                                Publish
                              </Button>
                            </div>
                          </div>

                          {/* Content with max height and scroll */}
                          <div className="bg-muted/20 max-h-[700px] overflow-y-auto">
                            <div className="space-y-6 max-w-4xl mx-auto p-6">
                              {/* Hero Section */}
                              <LandingPageSection fidelity={landing.hero.fidelity} type="hero">
                                {landing.hero.fidelity === 'skeleton' ? (
                                  <div className="h-80 flex items-center justify-center p-8">
                                    <div className="space-y-4 max-w-2xl w-full text-center">
                                      <div className="h-12 bg-muted/60 animate-pulse rounded mx-auto w-3/4" />
                                      <div className="h-6 bg-muted/40 animate-pulse rounded mx-auto w-2/3" />
                                      <div className="h-12 w-40 bg-muted/60 animate-pulse rounded mx-auto mt-6" />
                                    </div>
                                  </div>
                                ) : landing.heroImage ? (
                                  <div className="relative h-80 overflow-hidden">
                                    <img 
                                      src={landing.heroImage} 
                                      alt="Hero" 
                                      className="w-full h-full object-cover"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
                                    <div className="absolute inset-0 flex items-center justify-center p-8">
                                      <div className="text-center space-y-4 max-w-2xl">
                                        <h1 className="text-4xl font-bold tracking-tight text-white drop-shadow-lg">
                                          {landing.hero.content.headline}
                                        </h1>
                                        {landing.hero.content.subheadline ? (
                                          <p className="text-lg text-white/90 drop-shadow-md">
                                            {landing.hero.content.subheadline}
                                          </p>
                                        ) : (
                                          <div className="h-6 bg-white/20 animate-pulse rounded w-2/3 mx-auto" />
                                        )}
                                        {landing.hero.content.cta ? (
                                          <Button size="lg" className="bg-white text-black hover:bg-white/90 shadow-xl">
                                            {landing.hero.content.cta}
                                          </Button>
                                        ) : (
                                          <div className="h-12 w-40 bg-white/20 animate-pulse rounded mx-auto" />
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="p-8 bg-gradient-to-br from-pink-50/50 via-purple-50/50 to-blue-50/50 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20">
                                    <div className="text-center space-y-4 max-w-2xl mx-auto">
                                      <h1 className="text-4xl font-bold tracking-tight">
                                        {landing.hero.content.headline}
                                      </h1>
                                      {landing.hero.content.subheadline ? (
                                        <p className="text-lg text-muted-foreground">
                                          {landing.hero.content.subheadline}
                                        </p>
                                      ) : (
                                        <div className="h-6 bg-muted/40 animate-pulse rounded w-2/3 mx-auto" />
                                      )}
                                      {landing.hero.content.cta ? (
                                        <Button size="lg" className="bg-gradient-to-r from-pink-600 to-purple-600">
                                          {landing.hero.content.cta}
                                        </Button>
                                      ) : (
                                        <div className="h-12 w-40 bg-muted/40 animate-pulse rounded mx-auto" />
                                      )}
                                    </div>
                                  </div>
                                )}
                              </LandingPageSection>

                              {/* Testimonial Section */}
                              <LandingPageSection fidelity={landing.testimonial.fidelity} type="testimonial" className="p-6">
                                {landing.testimonial.fidelity === 'skeleton' ? (
                                  <div className="flex gap-4">
                                    <div className="w-8 h-8 bg-muted/40 animate-pulse rounded shrink-0" />
                                    <div className="flex-1 space-y-3">
                                      <div className="space-y-2">
                                        <div className="h-4 bg-muted/40 animate-pulse rounded w-full" />
                                        <div className="h-4 bg-muted/40 animate-pulse rounded w-5/6" />
                                      </div>
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse" />
                                        <div className="space-y-2 flex-1">
                                          <div className="h-3 bg-muted/40 animate-pulse rounded w-32" />
                                          <div className="h-3 bg-muted/30 animate-pulse rounded w-40" />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="flex gap-4">
                                    <Quote className="h-8 w-8 text-muted-foreground/30 shrink-0" />
                                    <div className="space-y-3">
                                      <p className="text-sm italic text-muted-foreground leading-relaxed">
                                        "{landing.testimonial.content.quote}"
                                      </p>
                                      <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold text-sm">
                                          {landing.testimonial.content.author.charAt(0)}
                                        </div>
                                        <div>
                                          <div className="font-semibold text-sm">{landing.testimonial.content.author}</div>
                                          <div className="text-xs text-muted-foreground">
                                            {landing.testimonial.content.role} at {landing.testimonial.content.company}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </LandingPageSection>

                              {/* Features Section */}
                              <div className="grid md:grid-cols-3 gap-4">
                                {landing.features.fidelity === 'skeleton' ? (
                                  [1, 2, 3].map((i) => (
                                    <LandingPageSection key={i} fidelity="skeleton" type="features" className="p-5">
                                      <div className="w-10 h-10 rounded-lg bg-muted/50 animate-pulse mb-3" />
                                      <div className="h-4 bg-muted/40 animate-pulse rounded mb-2 w-3/4" />
                                      <div className="space-y-2">
                                        <div className="h-3 bg-muted/30 animate-pulse rounded" />
                                        <div className="h-3 bg-muted/30 animate-pulse rounded w-5/6" />
                                      </div>
                                    </LandingPageSection>
                                  ))
                                ) : (
                                  landing.features.content.items.map((feature, idx) => {
                                    const icons = [CheckCircle2, Zap, Target];
                                    const Icon = icons[idx % icons.length];
                                    const colors = [
                                      "text-pink-600 bg-pink-100 dark:bg-pink-950",
                                      "text-purple-600 bg-purple-100 dark:bg-purple-950",
                                      "text-blue-600 bg-blue-100 dark:bg-blue-950"
                                    ];
                                    return (
                                      <LandingPageSection key={idx} fidelity={landing.features.fidelity} type="features" className="p-5 hover:shadow-lg transition-shadow">
                                        <div className={`w-10 h-10 rounded-lg ${colors[idx % colors.length]} flex items-center justify-center mb-3`}>
                                          <Icon className="h-5 w-5" />
                                        </div>
                                        <h3 className="font-semibold mb-2 text-sm">{feature.title}</h3>
                                        {feature.description ? (
                                          <p className="text-xs text-muted-foreground leading-relaxed">
                                            {feature.description}
                                          </p>
                                        ) : (
                                          <div className="space-y-2">
                                            <div className="h-3 bg-muted/30 animate-pulse rounded" />
                                            <div className="h-3 bg-muted/30 animate-pulse rounded w-5/6" />
                                          </div>
                                        )}
                                      </LandingPageSection>
                                    );
                                  })
                                )}
                              </div>

                              {/* Problem-Solution Section */}
                              <LandingPageSection fidelity={landing.problemSolution.fidelity} type="problemSolution" className="p-6 bg-muted/30">
                                {landing.problemSolution.fidelity === 'skeleton' ? (
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                      <div className="h-4 bg-muted/40 animate-pulse rounded w-32 mb-3" />
                                      <div className="space-y-2">
                                        {[1, 2, 3].map((i) => (
                                          <div key={i} className="flex items-start gap-2">
                                            <div className="w-4 h-4 bg-muted/30 animate-pulse rounded shrink-0 mt-0.5" />
                                            <div className="h-3 bg-muted/30 animate-pulse rounded flex-1" />
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <div className="h-4 bg-muted/40 animate-pulse rounded w-32 mb-3" />
                                      <div className="space-y-2">
                                        <div className="h-3 bg-muted/30 animate-pulse rounded" />
                                        <div className="h-3 bg-muted/30 animate-pulse rounded" />
                                        <div className="h-3 bg-muted/30 animate-pulse rounded w-4/5" />
                                      </div>
                                    </div>
                                  </div>
                                ) : (
                                  <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                      <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                        <span className="text-red-500">✗</span> Common Challenges
                                      </h3>
                                      <div className="space-y-2">
                                        {landing.problemSolution.content.problems.map((problem, idx) => (
                                          <div key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                                            <span className="text-red-500 mt-0.5">•</span>
                                            <span>{problem}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    <div>
                                      <h3 className="font-semibold mb-3 text-sm flex items-center gap-2">
                                        <span className="text-green-500">✓</span> Our Solution
                                      </h3>
                                      <p className="text-xs text-muted-foreground leading-relaxed">
                                        {landing.problemSolution.content.solution}
                                      </p>
                                    </div>
                                  </div>
                                )}
                              </LandingPageSection>

                              {/* Stats Section */}
                              <LandingPageSection fidelity={landing.stats.fidelity} type="stats" className="p-6">
                                {landing.stats.fidelity === 'skeleton' ? (
                                  <div className="grid grid-cols-3 gap-6 text-center">
                                    {[1, 2, 3].map((i) => (
                                      <div key={i}>
                                        <div className="h-8 bg-muted/50 animate-pulse rounded w-20 mx-auto mb-2" />
                                        <div className="h-3 bg-muted/30 animate-pulse rounded w-24 mx-auto" />
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="grid grid-cols-3 gap-6 text-center">
                                    {landing.stats.content.items.map((stat, idx) => (
                                      <div key={idx}>
                                        <div className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-1">
                                          {stat.value}
                                        </div>
                                        <div className="text-xs text-muted-foreground">{stat.label}</div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </LandingPageSection>
                            </div>
                          </div>
                        </Card>
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
    </div>
  );
}
