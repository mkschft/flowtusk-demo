"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Target, 
  TrendingUp, 
  RefreshCw,
  Loader2,
  CheckCircle2,
  Mail,
  Layout,
  Users
} from "lucide-react";

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

type FunnelSummaryData = {
  icp: ICP;
  valueProp?: string;
  strategy?: string;
  benchmarks?: string;
};

type FunnelSummaryCardProps = {
  data: FunnelSummaryData;
  onRegenerate?: () => void;
};

export function FunnelSummaryCard({ data, onRegenerate }: FunnelSummaryCardProps) {
  const [isRegenerating, setIsRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!onRegenerate) return;
    
    setIsRegenerating(true);
    try {
      await onRegenerate();
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border-b">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-bold text-lg">Your Marketing Funnel</h3>
          </div>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="h-8 w-8 p-0"
          >
            {isRegenerating ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Complete strategy for your <span className="font-semibold text-foreground">{data.icp.title}</span>
        </p>
      </div>

      {/* Content */}
      <div className="p-4 space-y-4">
        {/* Persona Recap */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-950">
            <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Target Persona</h4>
            <p className="text-sm text-muted-foreground mb-2">
              {data.icp.personaName} - {data.icp.personaRole} at {data.icp.personaCompany}
            </p>
            <div className="flex flex-wrap gap-1">
              {data.icp.painPoints.slice(0, 3).map((point, idx) => (
                <Badge key={idx} variant="secondary" className="text-xs">
                  {point.split(' ').slice(0, 2).join(' ')}
                </Badge>
              ))}
            </div>
          </div>
        </div>

        {/* Value Proposition */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
          <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-950">
            <Target className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-1">Value Proposition</h4>
            <p className="text-sm text-muted-foreground">
              {data.valueProp || "I help " + data.icp.personaRole + " at " + data.icp.personaCompany + " reduce their main challenges using our solution."}
            </p>
          </div>
        </div>

        {/* Funnel Stages */}
        <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
          <div className="p-2 rounded-lg bg-green-100 dark:bg-green-950">
            <TrendingUp className="h-5 w-5 text-green-600 dark:text-green-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-sm mb-2">Recommended Funnel</h4>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Mail className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Email Outreach</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-1">
                <Layout className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Landing Page</span>
              </div>
              <span className="text-muted-foreground">→</span>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-green-600" />
                <span className="font-medium">Lead Capture</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategy & Benchmarks */}
        <div className="p-3 rounded-lg bg-gradient-to-r from-pink-500/5 to-purple-500/5 border border-pink-200 dark:border-pink-800">
          <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            Strategy & Expected Results
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed mb-2">
            {data.strategy || `This funnel works because ${data.icp.personaRole}s typically respond well to personalized email outreach followed by targeted landing pages that address their specific pain points.`}
          </p>
          <p className="text-xs text-muted-foreground">
            <span className="font-medium">Expected:</span> 25-35% open rate, 5-8% conversion rate, 15-25% lead capture rate
          </p>
        </div>
      </div>
    </Card>
  );
}
