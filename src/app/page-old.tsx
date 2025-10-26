"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, ArrowUp } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type ICP = {
  id: string;
  title: string;
  description: string;
  painPoints: string[];
  goals: string[];
  demographics: string;
};

type LandingPage = {
  headline: string;
  subheadline: string;
  valueProps: string[];
  cta: string;
  heroImage?: string;
};

type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  component?: "icps" | "preview";
  data?: any;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<"input" | "icps" | "preview">("input");
  const [icps, setIcps] = useState<ICP[]>([]);
  const [selectedIcp, setSelectedIcp] = useState<ICP | null>(null);
  const [landingPage, setLandingPage] = useState<LandingPage | null>(null);
  const [error, setError] = useState("");
  const [publishedUrl, setPublishedUrl] = useState("");

  const analyzeWebsite = async () => {
    if (!url) return;
    
    setLoading(true);
    setError("");
    
    try {
      // Step 1: Analyze website
      const analyzeRes = await fetch("/api/analyze-website", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      
      if (!analyzeRes.ok) throw new Error("Failed to analyze website");
      const { content } = await analyzeRes.json();
      
      // Step 2: Generate ICPs
      const icpRes = await fetch("/api/generate-icps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      
      if (!icpRes.ok) throw new Error("Failed to generate ICPs");
      const { icps: generatedIcps } = await icpRes.json();
      
      setIcps(generatedIcps);
      setStep("icps");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const selectIcp = async (icp: ICP) => {
    setSelectedIcp(icp);
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/generate-landing-page", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ icp, websiteUrl: url }),
      });
      
      if (!res.ok) throw new Error("Failed to generate landing page");
      const { landingPage: generated } = await res.json();
      
      setLandingPage(generated);
      setStep("preview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const publishPage = async () => {
    if (!selectedIcp || !landingPage) return;
    
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch("/api/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          websiteUrl: url,
          icp: selectedIcp,
          landingPage,
        }),
      });
      
      if (!res.ok) throw new Error("Failed to publish page");
      const { url: pageUrl, message } = await res.json();
      
      setPublishedUrl(window.location.origin + pageUrl);
      if (message) {
        alert(message);
      } else {
        alert(`Published! Share this URL: ${window.location.origin}${pageUrl}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="text-xl font-semibold">
              Flowtusk
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Step 1: URL Input */}
        {step === "input" && (
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">
                Generate Landing Pages That Convert
              </h1>
              <p className="text-xl text-muted-foreground">
                Enter any website URL and we'll create targeted landing pages for your ideal customers
              </p>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle>Enter Website URL</CardTitle>
                <CardDescription>
                  We'll analyze your website and generate ICPs with custom landing pages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && analyzeWebsite()}
                    className="flex-1"
                  />
                  <Button 
                    onClick={analyzeWebsite} 
                    disabled={!url || loading}
                    className="bg-gradient-to-r from-[#FF6B9D] to-[#A78BFA]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      "Analyze"
                    )}
                  </Button>
                </div>
                {error && <p className="text-sm text-destructive mt-2">{error}</p>}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: ICP Selection */}
        {step === "icps" && (
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <Button variant="ghost" onClick={() => setStep("input")}>
                ← Back
              </Button>
              <h2 className="text-3xl font-bold mt-4 mb-2">Select Your Target ICP</h2>
              <p className="text-muted-foreground">
                Choose the ideal customer profile you want to target
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {icps.map((icp) => (
                <Card 
                  key={icp.id} 
                  className="hover:shadow-xl transition-shadow cursor-pointer border-2 hover:border-[#A78BFA]"
                  onClick={() => selectIcp(icp)}
                >
                  <CardHeader>
                    <CardTitle>{icp.title}</CardTitle>
                    <CardDescription>{icp.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm font-semibold mb-2">Pain Points:</p>
                        <div className="flex flex-wrap gap-1">
                          {icp.painPoints.slice(0, 3).map((point, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {point}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-semibold mb-2">Goals:</p>
                        <div className="flex flex-wrap gap-1">
                          {icp.goals.slice(0, 3).map((goal, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {goal}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <Button className="w-full mt-4 bg-gradient-to-r from-[#FF6B9D] to-[#A78BFA]">
                      Select ICP
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Landing Page Preview with Chat */}
        {step === "preview" && landingPage && (
          <PreviewWithChat
            landingPage={landingPage}
            setLandingPage={setLandingPage}
            selectedIcp={selectedIcp}
            websiteUrl={url}
            onBack={() => setStep("icps")}
            onPublish={publishPage}
            publishLoading={loading}
          />
        )}
      </main>
    </div>
  );
}

type PreviewWithChatProps = {
  landingPage: LandingPage;
  setLandingPage: (page: LandingPage) => void;
  selectedIcp: ICP | null;
  websiteUrl: string;
  onBack: () => void;
  onPublish: () => void;
  publishLoading: boolean;
};

function PreviewWithChat({
  landingPage,
  setLandingPage,
  selectedIcp,
  websiteUrl,
  onBack,
  onPublish,
  publishLoading,
}: PreviewWithChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, userMessage].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          landingPage,
          websiteUrl,
          icp: selectedIcp,
        }),
      });

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      const assistantMsgId = Date.now().toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantMsgId, role: "assistant", content: "" },
      ]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          assistantMessage += chunk;

          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantMsgId ? { ...m, content: assistantMessage } : m
            )
          );
        }

        // Parse JSON response and update landing page
        try {
          const jsonMatch = assistantMessage.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            
            // Update message to show only the natural language part
            setMessages((prev) =>
              prev.map((m) =>
                m.id === assistantMsgId 
                  ? { ...m, content: parsed.message || assistantMessage }
                  : m
              )
            );
            
            // Apply updates to landing page
            if (parsed.updates) {
              setLandingPage((prev) => ({
                ...prev,
                ...(parsed.updates.headline && { headline: parsed.updates.headline }),
                ...(parsed.updates.subheadline && { subheadline: parsed.updates.subheadline }),
                ...(parsed.updates.valueProps && { valueProps: parsed.updates.valueProps }),
                ...(parsed.updates.cta && { cta: parsed.updates.cta }),
              }));
            }
          }
        } catch (e) {
          // Not JSON, that's okay - keep full message
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-[1800px]">
      <div className="mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back to ICPs
        </Button>
        <div className="flex justify-between items-center mt-4">
          <div>
            <h2 className="text-3xl font-bold">Landing Page Preview</h2>
            <p className="text-muted-foreground">Target: {selectedIcp?.title}</p>
          </div>
          <Button
            onClick={onPublish}
            disabled={publishLoading}
            className="bg-gradient-to-r from-[#FF6B9D] to-[#A78BFA]"
          >
            {publishLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publishing...
              </>
            ) : (
              "Publish Page"
            )}
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-[1fr_400px] gap-6">
        {/* Preview Panel */}
        <Card className="shadow-2xl overflow-hidden">
          <ScrollArea className="h-[calc(100vh-200px)]">
            <CardContent className="p-0">
              {/* Hero Section */}
              <div className="bg-muted/30 p-12 text-center">
                <h1 className="text-5xl font-bold mb-4">{landingPage.headline}</h1>
                <p className="text-xl text-muted-foreground mb-8">
                  {landingPage.subheadline}
                </p>
                <Button
                  size="lg"
                  className="text-lg px-8"
                >
                  {landingPage.cta}
                </Button>
              </div>

              {/* Value Props */}
              <div className="p-12">
                <h3 className="text-2xl font-bold mb-6 text-center">
                  Why Choose Us?
                </h3>
                <div className="grid md:grid-cols-3 gap-6">
                  {landingPage.valueProps.map((prop, idx) => (
                    <Card key={idx} className="text-center p-6">
                      <p className="font-semibold">{prop}</p>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Lead Form */}
              <div className="bg-muted/30 p-12">
                <div className="max-w-md mx-auto">
                  <h3 className="text-2xl font-bold mb-4 text-center">
                    Get Started Today
                  </h3>
                  <div className="space-y-4">
                    <Input placeholder="Your Name" />
                    <Input type="email" placeholder="Email Address" />
                    <Input placeholder="Company" />
                    <Button className="w-full">
                      {landingPage.cta}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Chat Panel - Prompt-Kit Style */}
        <div className="flex flex-col h-[calc(100vh-200px)] overflow-hidden">
          {/* Messages */}
          <ScrollArea className="flex-1 px-4 py-12">
            <div className="space-y-12 mx-auto max-w-3xl">
              {messages.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  <p className="text-sm mb-6 font-medium">Refine your landing page</p>
                  <div className="space-y-2 text-xs">
                    <button 
                      onClick={() => setInput("Make the headline shorter")}
                      className="block w-full text-left px-4 py-2 rounded-md hover:bg-muted transition-colors"
                    >
                      💡 Make the headline shorter
                    </button>
                    <button 
                      onClick={() => setInput("Add more urgency to the CTA")}
                      className="block w-full text-left px-4 py-2 rounded-md hover:bg-muted transition-colors"
                    >
                      💡 Add more urgency to the CTA
                    </button>
                    <button 
                      onClick={() => setInput("Rewrite value props to be more specific")}
                      className="block w-full text-left px-4 py-2 rounded-md hover:bg-muted transition-colors"
                    >
                      💡 Rewrite value props to be more specific
                    </button>
                  </div>
                </div>
              )}
              {messages.map((message) => (
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
                    <div className="text-foreground w-full text-sm leading-relaxed">
                      {message.content}
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <Loader2 className="h-4 w-4 animate-spin mt-1" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Input - Prompt-Kit Style */}
          <div className="mx-auto w-full max-w-3xl px-4 pb-4">
            <form
              onSubmit={sendMessage}
              className="relative w-full rounded-3xl border bg-background p-3 shadow-sm"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask me to refine the page..."
                disabled={isLoading}
                className="border-0 pr-12 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/70"
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
      </div>
    </div>
  );
}
