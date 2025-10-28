"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Sparkles, Brain, FileText, Globe, ArrowRight } from "lucide-react";
import { useState } from "react";

export function Hero() {
  const [websiteUrl, setWebsiteUrl] = useState("");

  const handleAnalyze = () => {
    if (websiteUrl.trim()) {
      // Navigate to app with URL
      window.location.href = `/app?url=${encodeURIComponent(websiteUrl)}`;
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAnalyze();
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20 md:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-400/20 to-pink-400/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Find who you&apos;re selling to in{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              minutes not weeks
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Paste your website URL. Get customer clarity. Export ready-to-use templates—emails, 
            landing pages, LinkedIn, pitch decks—rooted in real customer insights. All in 15 minutes.
          </p>

          {/* URL Input Section */}
          <Card className="max-w-2xl mx-auto p-2 mb-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1 relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="url"
                  placeholder="Enter your website URL..."
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-10 h-12 text-lg border-0 focus-visible:ring-0 bg-transparent"
                />
              </div>
              <Button 
                onClick={handleAnalyze}
                disabled={!websiteUrl.trim()}
                size="lg"
                className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold"
              >
                <Sparkles className="mr-2 h-5 w-5" />
                Vibe Create Your Funnel
              </Button>
            </div>
          </Card>

          {/* Secondary CTA */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Button variant="outline" size="lg" asChild>
              <Link href="/app">
                Try Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <span className="text-sm text-gray-500">No credit card required</span>
          </div>

          {/* 3-Step Process */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">1. Paste URL</h3>
              <p className="text-sm text-gray-600">Enter your website and we&apos;ll analyze your content, messaging, and target audience</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">2. Get Personas</h3>
              <p className="text-sm text-gray-600">AI generates detailed customer profiles with pain points, goals, and demographics</p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mb-4">
                <FileText className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">3. Export Templates</h3>
              <p className="text-sm text-gray-600">Download ready-to-use content for emails, LinkedIn, landing pages, and more</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
