"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

export function MVPVsVision() {
  const availableToday = [
    "Website analysis & ICP generation",
    "Value proposition builder",
    "Email sequence templates",
    "LinkedIn post generation",
    "Landing page templates",
    "Google Slides export",
    "Plain text export",
    "Basic persona insights"
  ];

  const comingSoon = [
    "Team collaboration features",
    "API access for integrations",
    "Advanced analytics dashboard",
    "Custom template builder",
    "A/B testing for content",
    "CRM integrations",
    "Advanced persona scoring",
    "White-label options"
  ];

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-4 leading-tight">
              Available Today vs Coming Soon
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
              We&apos;re transparent about what&apos;s ready now and what&apos;s in development. 
              Start using Flowtusk today with our core features.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Today */}
            <Card className="p-8 border-2 border-green-200 bg-green-50/30">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-green-900">Available TODAY</h3>
                  <p className="text-green-700">Core features ready to use</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {availableToday.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <CheckCircle2 className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-green-100 rounded-lg">
                <p className="text-sm text-green-800 font-medium">
                  ✅ Start using these features immediately - no waiting required
                </p>
              </div>
            </Card>

            {/* Coming Soon */}
            <Card className="p-8 border-2 border-gray-200 bg-gray-50/30">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="h-6 w-6 text-gray-600" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">Coming Soon</h3>
                  <p className="text-gray-600">Advanced features in development</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {comingSoon.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Clock className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-600">
                  🚧 These features are in active development - stay tuned for updates
                </p>
              </div>
            </Card>
          </div>

          {/* Bottom Message */}
          <div className="text-center mt-12">
            <Card className="inline-block p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6 text-white" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-gray-900">Ready to get started?</h4>
                  <p className="text-sm text-gray-600">All core features are available today</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
