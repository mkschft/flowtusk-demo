"use client";

import { ReactNode } from "react";
import { cn } from "@/lib/utils";

type SectionFidelity = 'skeleton' | 'draft' | 'refined' | 'polished';

interface LandingPageSectionProps {
  fidelity: SectionFidelity;
  type: 'hero' | 'testimonial' | 'features' | 'problemSolution' | 'stats' | 'cta';
  children: ReactNode;
  className?: string;
}

const fidelityStyles: Record<SectionFidelity, string> = {
  skeleton: 'grayscale animate-pulse border-2 border-dashed bg-muted/20',
  draft: 'border-2 border-dashed',
  refined: 'border shadow-sm',
  polished: 'shadow-lg transition-all hover:shadow-xl',
};

export function LandingPageSection({ 
  fidelity, 
  type, 
  children, 
  className 
}: LandingPageSectionProps) {
  return (
    <div 
      className={cn(
        'relative rounded-lg overflow-hidden',
        fidelityStyles[fidelity],
        className
      )}
      data-fidelity={fidelity}
      data-section={type}
    >
      {children}
      
      {/* Fidelity indicator badge */}
      {fidelity !== 'polished' && (
        <div className="absolute top-2 right-2 z-10">
          <div className="text-[10px] px-2 py-0.5 rounded-full bg-background/80 backdrop-blur-sm border text-muted-foreground font-medium">
            {fidelity === 'skeleton' && '□ Skeleton'}
            {fidelity === 'draft' && '◐ Draft'}
            {fidelity === 'refined' && '◕ Refined'}
          </div>
        </div>
      )}
    </div>
  );
}

