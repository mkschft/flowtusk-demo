"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type WireframeSection = 'hero' | 'testimonial' | 'features' | 'problemSolution' | 'stats' | 'cta';

interface WireframeLandingPageProps {
  sections?: WireframeSection[];
}

export function WireframeLandingPage({ 
  sections = ['hero', 'testimonial', 'features', 'problemSolution', 'stats', 'cta'] 
}: WireframeLandingPageProps) {
  return (
    <div className="space-y-6 grayscale">
      {/* Wireframe Hero */}
      {sections.includes('hero') && (
        <Card className="overflow-hidden border-2 border-dashed">
          <div className="h-80 bg-muted/30 flex items-center justify-center p-8">
            <div className="space-y-4 max-w-2xl w-full text-center">
              {/* Headline placeholder */}
              <div className="h-12 bg-muted/60 animate-pulse rounded mx-auto w-3/4" />
              {/* Subheadline placeholder */}
              <div className="h-6 bg-muted/40 animate-pulse rounded mx-auto w-2/3" />
              {/* CTA placeholder */}
              <div className="h-12 w-40 bg-muted/60 animate-pulse rounded mx-auto mt-6" />
            </div>
          </div>
        </Card>
      )}

      {/* Wireframe Testimonial */}
      {sections.includes('testimonial') && (
        <Card className="p-6 border-dashed">
          <div className="flex gap-4">
            {/* Quote icon placeholder */}
            <div className="w-8 h-8 bg-muted/40 animate-pulse rounded shrink-0" />
            <div className="flex-1 space-y-3">
              {/* Quote text */}
              <div className="space-y-2">
                <div className="h-4 bg-muted/40 animate-pulse rounded w-full" />
                <div className="h-4 bg-muted/40 animate-pulse rounded w-5/6" />
              </div>
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-muted/50 animate-pulse" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 bg-muted/40 animate-pulse rounded w-32" />
                  <div className="h-3 bg-muted/30 animate-pulse rounded w-40" />
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Wireframe Features Grid */}
      {sections.includes('features') && (
        <div className="grid md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-5 border-dashed">
              {/* Icon placeholder */}
              <div className="w-10 h-10 rounded-lg bg-muted/50 animate-pulse mb-3" />
              {/* Title placeholder */}
              <div className="h-4 bg-muted/40 animate-pulse rounded mb-2 w-3/4" />
              {/* Description placeholder */}
              <div className="space-y-2">
                <div className="h-3 bg-muted/30 animate-pulse rounded" />
                <div className="h-3 bg-muted/30 animate-pulse rounded w-5/6" />
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Wireframe Problem-Solution */}
      {sections.includes('problemSolution') && (
        <Card className="p-6 bg-muted/10 border-dashed">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Problems */}
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
            {/* Solution */}
            <div>
              <div className="h-4 bg-muted/40 animate-pulse rounded w-32 mb-3" />
              <div className="space-y-2">
                <div className="h-3 bg-muted/30 animate-pulse rounded" />
                <div className="h-3 bg-muted/30 animate-pulse rounded" />
                <div className="h-3 bg-muted/30 animate-pulse rounded w-4/5" />
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Wireframe Stats */}
      {sections.includes('stats') && (
        <Card className="p-6 border-dashed">
          <div className="grid grid-cols-3 gap-6 text-center">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <div className="h-8 bg-muted/50 animate-pulse rounded w-20 mx-auto mb-2" />
                <div className="h-3 bg-muted/30 animate-pulse rounded w-24 mx-auto" />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Wireframe Final CTA */}
      {sections.includes('cta') && (
        <Card className="p-8 bg-muted/10 border-dashed">
          <div className="text-center space-y-4">
            <div className="h-8 bg-muted/40 animate-pulse rounded w-64 mx-auto" />
            <div className="h-4 bg-muted/30 animate-pulse rounded w-96 mx-auto" />
            <div className="h-12 w-40 bg-muted/50 animate-pulse rounded mx-auto mt-4" />
          </div>
        </Card>
      )}

      {/* Wireframe Loading Indicator */}
      <div className="text-center text-xs text-muted-foreground py-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-pulse" />
          <span>Generating content...</span>
        </div>
      </div>
    </div>
  );
}

