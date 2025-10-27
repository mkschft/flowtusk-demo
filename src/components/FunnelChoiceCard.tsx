"use client";

import { Card } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  ArrowRight
} from "lucide-react";
import { SmartButton } from "@/app/page";

type FunnelChoiceCardProps = {
  onSelect: (choice: 'email' | 'landing') => void;
  conversationId?: string;
};

export function FunnelChoiceCard({ onSelect, conversationId }: FunnelChoiceCardProps) {

  return (
    <Card className="border-2 border-purple-200 dark:border-purple-800 overflow-hidden">
      {/* Header */}
      <div className="p-4 bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-b">
        <h3 className="font-bold text-lg">Ready to Connect?</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Generate personalized outreach to reach your ideal customers
        </p>
      </div>

      {/* Email Option Card */}
      <div className="p-4">
        <Card
          className="group relative overflow-hidden border-2 border-blue-300 dark:border-blue-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          onClick={() => onSelect('email')}
        >
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-cyan-500 opacity-5 group-hover:opacity-10 transition-opacity" />
          
          <div className="relative p-6 flex items-center gap-4">
            {/* Icon */}
            <div className="p-4 rounded-xl bg-blue-100 dark:bg-blue-950 group-hover:scale-110 transition-transform">
              <div className="text-blue-600 dark:text-blue-400">
                <Mail className="h-8 w-8" />
              </div>
            </div>
            
            {/* Content */}
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                Connect via Email
                <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Create personalized email sequences designed for your ideal customer profile. Choose between LinkedIn connection requests or direct email campaigns.
              </p>
            </div>

            {/* Smart Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
              <SmartButton
                action="make-content-choice"
                onClick={(e) => {
                  e.stopPropagation();
                  onSelect('email');
                }}
                conversationId={conversationId}
                className="px-6 py-3 bg-white text-black font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all"
                loadingText="Setting up email options..."
              >
                Start Email Outreach
              </SmartButton>
            </div>
          </div>
        </Card>
      </div>

      {/* Footer Tip */}
      <div className="p-4 bg-muted/30 border-t">
        <p className="text-xs text-muted-foreground text-center">
          💡 <span className="font-medium">Pro tip:</span> Email outreach is the most effective way to connect directly with decision-makers in your target market
        </p>
      </div>
    </Card>
  );
}
