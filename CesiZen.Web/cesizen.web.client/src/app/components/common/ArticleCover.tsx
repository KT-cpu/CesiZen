import React from 'react';
import { BookOpen, MoonStar, Brain, HeartPulse, SmilePlus } from 'lucide-react';
import { ImageWithFallback } from '../ImageWithFallback';

interface ArticleCoverProps {
  image?: string;
  category: string;
  title: string;
  className?: string;
}

const categoryStyles: Record<string, { bg: string; icon: React.ComponentType<{ size?: number; className?: string }> }> = {
  Stress: { bg: 'from-green-600 to-emerald-500', icon: Brain },
  'Activités de détente': { bg: 'from-sky-600 to-cyan-500', icon: HeartPulse },
  Émotions: { bg: 'from-amber-500 to-orange-500', icon: SmilePlus },
  Sommeil: { bg: 'from-indigo-600 to-violet-500', icon: MoonStar },
};

export function ArticleCover({ image, category, title, className = '' }: ArticleCoverProps) {
  if (image) {
    return <ImageWithFallback src={image} alt={title} className={className} />;
  }

  const style = categoryStyles[category] || { bg: 'from-green-700 to-green-500', icon: BookOpen };
  const Icon = style.icon;

  return (
    <div className={`bg-gradient-to-br ${style.bg} ${className} flex items-center justify-center text-white`}>
      <div className="text-center px-6">
        <Icon size={34} className="mx-auto mb-3 opacity-90" />
        <div className="text-xs uppercase tracking-[0.2em] text-white/75 mb-1">CesiZen</div>
        <div className="font-semibold leading-snug max-w-xs line-clamp-3">{title}</div>
      </div>
    </div>
  );
}
