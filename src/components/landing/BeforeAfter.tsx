"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle2, TrendingUp } from "lucide-react";

export function BeforeAfter() {
  const examples = [
    {
      type: "Landing Page Hero",
      before: "The Ultimate Solution for Your Business Needs",
      after: "Stop Losing 40% of Your Pipeline to Poor ICP Targeting - Get 3x More Qualified Leads in 30 Days",
      metric: "2% → 8% conversion"
    },
    {
      type: "Email Subject Line",
      before: "Check out our new features!",
      after: "How [Company] increased lead quality by 300% (and you can too)",
      metric: "15% → 45% open rate"
    },
    {
      type: "LinkedIn Post",
      before: "Excited to announce our latest product update! 🚀",
      after: "Most B2B companies are targeting the wrong people. Here's how to find your ideal customer profile in 15 minutes...",
      metric: "50 → 2,400 engagement"
    }
  ];

  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
              See The Difference
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Generic messaging vs. customer-focused messaging. The results speak for themselves.
            </p>
          </div>

          {/* Before/After Examples */}
          <div className="space-y-8">
            {examples.map((example, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Before */}
                  <div className="p-8 bg-red-50 border-r border-red-200">
                    <div className="flex items-center mb-4">
                      <AlertTriangle className="h-5 w-5 text-red-600 mr-2" />
                      <h3 className="font-semibold text-red-900">Before (Without Clarity)</h3>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-red-200 mb-4">
                      <p className="text-gray-700 italic">&ldquo;{example.before}&rdquo;</p>
                    </div>
                    <div className="flex items-center text-sm text-red-600">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      Low engagement, poor conversion
                    </div>
                  </div>

                  {/* After */}
                  <div className="p-8 bg-green-50">
                    <div className="flex items-center mb-4">
                      <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="font-semibold text-green-900">After (With Flowtusk)</h3>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-green-200 mb-4">
                      <p className="text-gray-700 font-medium">&ldquo;{example.after}&rdquo;</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {example.metric}
                      </Badge>
                      <span className="text-sm text-green-600 font-medium">
                        {example.type}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Bottom Summary */}
          <div className="text-center mt-12">
            <Card className="inline-block p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center justify-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">3x</div>
                  <div className="text-sm text-gray-600">Higher Engagement</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">4x</div>
                  <div className="text-sm text-gray-600">Better Conversion</div>
                </div>
                <div className="w-px h-12 bg-gray-300"></div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">15 min</div>
                  <div className="text-sm text-gray-600">Setup Time</div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
