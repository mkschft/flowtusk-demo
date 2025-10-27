"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MessageSquare, 
  Mail, 
  Layout, 
  FileText,
  ArrowRight,
  Sparkles,
  Clock
} from "lucide-react";

type ContentChoice = {
  id: 'linkedin' | 'email' | 'landing' | 'lead-magnet';
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  timeEstimate: string;
  features: string[];
  gradient: string;
  available: boolean;
};

type ContentChoiceCardProps = {
  onSelect: (choice: ContentChoice['id']) => void;
};

export function ContentChoiceCard({ onSelect }: ContentChoiceCardProps) {
  const choices: ContentChoice[] = [
    {
      id: 'linkedin',
      title: 'LinkedIn Outreach',
      description: 'Personalized connection requests and follow-up sequences',
      icon: <MessageSquare className="h-6 w-6" />,
      badge: 'Popular',
      timeEstimate: '2 min',
      features: [
        '3-message sequence',
        'Personalization hooks',
        'Response templates',
        'Timing recommendations'
      ],
      gradient: 'from-blue-500 to-cyan-500',
      available: true
    },
    {
      id: 'email',
      title: 'Email Sequence',
      description: 'Multi-touch email campaigns that convert',
      icon: <Mail className="h-6 w-6" />,
      badge: 'Best for outreach',
      timeEstimate: '3 min',
      features: [
        '5-email nurture sequence',
        'Subject line variations',
        'Follow-up timing',
        'CTA optimization'
      ],
      gradient: 'from-pink-500 to-rose-500',
      available: true
    },
    {
      id: 'landing',
      title: 'Landing Page',
      description: 'High-converting landing page tailored to your ICP',
      icon: <Layout className="h-6 w-6" />,
      timeEstimate: '3 min',
      features: [
        'Hero + CTA',
        'Social proof',
        'Feature benefits',
        'Problem-solution fit'
      ],
      gradient: 'from-purple-500 to-indigo-500',
      available: true
    },
    {
      id: 'lead-magnet',
      title: 'Lead Magnet',
      description: 'Downloadable resources to capture emails',
      icon: <FileText className="h-6 w-6" />,
      badge: 'Coming soon',
      timeEstimate: '5 min',
      features: [
        'Template ideas',
        'Checklist generator',
        'Guide outline',
        'Landing page copy'
      ],
      gradient: 'from-amber-500 to-orange-500',
      available: false
    }
  ];

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-500/10 via-purple-500/10 to-blue-500/10 border-b">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h3 className="font-bold text-lg">What do you want to create next?</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          Choose a content type to generate for your <span className="font-semibold">selected persona</span>
        </p>
      </div>

      {/* Content Choices Grid */}
      <div className="p-4 grid md:grid-cols-2 gap-4">
        {choices.map((choice) => (
          <Card
            key={choice.id}
            className={`group relative overflow-hidden border-2 transition-all duration-300 ${
              choice.available 
                ? 'hover:shadow-xl hover:-translate-y-1 cursor-pointer' 
                : 'opacity-60 cursor-not-allowed'
            }`}
            onClick={() => choice.available && onSelect(choice.id)}
          >
            {/* Gradient overlay */}
            <div className={`absolute inset-0 bg-gradient-to-br ${choice.gradient} opacity-5 group-hover:opacity-10 transition-opacity`} />
            
            <div className="relative p-4 space-y-3">
              {/* Icon & Badge */}
              <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg bg-gradient-to-br ${choice.gradient} bg-opacity-10`}>
                  <div className="text-foreground">
                    {choice.icon}
                  </div>
                </div>
                {choice.badge && (
                  <Badge 
                    variant={choice.available ? "default" : "secondary"}
                    className="text-xs"
                  >
                    {choice.badge}
                  </Badge>
                )}
              </div>

              {/* Title & Description */}
              <div>
                <h4 className="font-semibold mb-1 flex items-center gap-2">
                  {choice.title}
                  {choice.available && (
                    <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  )}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {choice.description}
                </p>
              </div>

              {/* Time Estimate */}
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{choice.timeEstimate}</span>
              </div>

              {/* Features */}
              <div className="pt-2 border-t space-y-1">
                {choice.features.map((feature, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <div className={`h-1 w-1 rounded-full bg-gradient-to-r ${choice.gradient}`} />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              {choice.available && (
                <Button
                  size="sm"
                  className={`w-full bg-gradient-to-r ${choice.gradient} hover:opacity-90 transition-opacity`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(choice.id);
                  }}
                >
                  Generate {choice.title}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>

      {/* Footer Tip */}
      <div className="p-4 bg-muted/30 border-t">
        <p className="text-xs text-muted-foreground text-center">
          💡 <span className="font-medium">Pro tip:</span> Generate multiple content types to create a complete inbound marketing funnel
        </p>
      </div>
    </Card>
  );
}

