import React from 'react';
import { AchievementBadge } from './badge-card';

// This will later be fetched from the backend
const MOCK_BADGES = [
  {
    title: "First Contribution",
    description: "Made your first open source contribution",
    icon: "🌟",
    earned: true,
    progress: 100,
  },
  {
    title: "Code Reviewer",
    description: "Reviewed 5 pull requests",
    icon: "👀",
    earned: false,
    progress: 60,
  },
  {
    title: "Bug Hunter",
    description: "Fixed 3 reported bugs",
    icon: "🐛",
    earned: false,
    progress: 33,
  },
  {
    title: "Documentation Hero",
    description: "Improved project documentation",
    icon: "📚",
    earned: true,
    progress: 100,
  },
  {
    title: "Team Player",
    description: "Collaborated on 10 issues",
    icon: "🤝",
    earned: false,
    progress: 40,
  },
];

export const BadgesShowcase: React.FC = () => {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-6">Your Achievements</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MOCK_BADGES.map((badge, index) => (
          <AchievementBadge
            key={index}
            title={badge.title}
            description={badge.description}
            icon={badge.icon}
            earned={badge.earned}
            progress={badge.progress}
          />
        ))}
      </div>
    </div>
  );
};
