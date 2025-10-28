"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X } from "lucide-react";

export function GapSection() {
  const features = [
    "Customer Clarity",
    "Campaign Templates", 
    "Speed",
    "Cost"
  ];

  const solutions = [
    {
      name: "Brand Consultants",
      description: "Expensive, slow, no templates",
      features: {
        "Customer Clarity": true,
        "Campaign Templates": false,
        "Speed": false,
        "Cost": false
      }
    },
    {
      name: "Marketing Platforms",
      description: "Templates but no customer insights",
      features: {
        "Customer Clarity": false,
        "Campaign Templates": true,
        "Speed": true,
        "Cost": true
      }
    },
    {
      name: "Flowtusk",
      description: "Customer insights + ready-to-use templates",
      features: {
        "Customer Clarity": true,
        "Campaign Templates": true,
        "Speed": true,
        "Cost": true
      },
      highlight: true
    }
  ];

  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              No tool connects customer insights to campaign execution
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You either get customer clarity (expensive consultants) or campaign templates (generic platforms). 
              Never both. Until now.
            </p>
          </div>

          {/* Comparison Table */}
          <Card className="overflow-hidden shadow-lg">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-6 font-semibold text-gray-900">Solution</th>
                    {features.map((feature) => (
                      <th key={feature} className="text-center p-6 font-semibold text-gray-900 min-w-[120px]">
                        {feature}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {solutions.map((solution, index) => (
                    <tr 
                      key={index}
                      className={`border-b hover:bg-gray-50/50 transition-colors ${
                        solution.highlight ? 'bg-blue-50/50' : ''
                      }`}
                    >
                      <td className="p-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            solution.highlight ? 'bg-blue-500' : 'bg-gray-300'
                          }`} />
                          <div>
                            <div className={`font-semibold ${
                              solution.highlight ? 'text-blue-900' : 'text-gray-900'
                            }`}>
                              {solution.name}
                            </div>
                            <div className="text-sm text-gray-600">
                              {solution.description}
                            </div>
                          </div>
                        </div>
                      </td>
                      {features.map((feature) => (
                        <td key={feature} className="text-center p-6">
                          {solution.features[feature as keyof typeof solution.features] ? (
                            <div className="flex justify-center">
                              <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                                <Check className="h-3 w-3 mr-1" />
                                Yes
                              </Badge>
                            </div>
                          ) : (
                            <div className="flex justify-center">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-600 border-gray-200">
                                <X className="h-3 w-3 mr-1" />
                                No
                              </Badge>
                            </div>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Bottom Message */}
          <div className="text-center mt-12">
            <div className="inline-flex items-center px-6 py-3 bg-blue-100 text-blue-800 rounded-full font-semibold">
              <Check className="h-5 w-5 mr-2" />
              Flowtusk is the only solution that gives you both
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
