"use client";

import { useState } from "react";
import { ValuePropBuilder } from "./ValuePropBuilder";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Sparkles } from "lucide-react";

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

type ValuePropBuilderWrapperProps = {
  valuePropData: ValuePropData;
  websiteUrl: string;
  onGenerateLandingPage: (icp: ICP) => void;
};

export function ValuePropBuilderWrapper({
  valuePropData,
  websiteUrl,
  onGenerateLandingPage,
}: ValuePropBuilderWrapperProps) {
  const [localVariables, setLocalVariables] = useState(valuePropData.variables);
  const [localVariations, setLocalVariations] = useState(valuePropData.variations);
  const [isGeneratingVariations, setIsGeneratingVariations] = useState(false);

  const handleVariableChange = (key: string, value: string) => {
    setLocalVariables(prev =>
      prev.map(v => v.key === key ? { ...v, selectedValue: value } : v)
    );
  };

  const handleGenerateVariations = async () => {
    setIsGeneratingVariations(true);
    try {
      // Re-generate variations with updated variables
      const response = await fetch("/api/generate-value-prop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          icp: valuePropData.icp,
          websiteUrl,
          variables: localVariables
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setLocalVariations(data.variations);
      }
    } catch (error) {
      console.error("Error generating variations:", error);
    } finally {
      setIsGeneratingVariations(false);
    }
  };

  return (
    <div className="space-y-4">
      <ValuePropBuilder
        personaTitle={valuePropData.icp.title}
        variables={localVariables}
        onVariableChange={handleVariableChange}
        onGenerateVariations={handleGenerateVariations}
        variations={localVariations}
        isGeneratingVariations={isGeneratingVariations}
      />
      
      {/* CTA to generate landing page */}
      <Card className="p-4 border-2 border-dashed border-purple-300 dark:border-purple-700 bg-gradient-to-r from-pink-500/5 to-purple-500/5">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm mb-1">
              Ready for the next step?
            </p>
            <p className="text-xs text-muted-foreground">
              Generate a full landing page based on this value proposition
            </p>
          </div>
          <Button
            onClick={() => onGenerateLandingPage(valuePropData.icp)}
            className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700"
          >
            <Sparkles className="h-4 w-4 mr-2" />
            Generate Landing Page
          </Button>
        </div>
      </Card>
    </div>
  );
}

