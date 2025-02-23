import React from 'react';
import { BadgesShowcase } from '@/components/badges/badges-showcase';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { PageContainer } from '@/components/layout/page-container';

// Mock user data - will be replaced with real data from backend
const USER_DATA = {
  name: "Dhanush H",
  username: "dhan",
  avatar: "https://github.com/shadcn.png",
  role: "Software Engineer",
  company: "Tech Corp",
  location: "San Francisco, CA",
  email: "dhanush121@example.com",
  githubUrl: "https://github.com/johndoe",
  contributions: {
    total: 256,
    thisYear: 124,
    thisMonth: 15,
    streak: 7
  },
  skills: ["JavaScript", "React", "Node.js", "Python", "Git"],
  stats: {
    pullRequests: 45,
    issues: 32,
    codeReviews: 78,
    repositories: 12
  }
};

export default function ProfilePage() {
  return (
    <PageContainer>
      <div className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          <Card className="flex-1">
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={USER_DATA.avatar} alt={USER_DATA.name} />
                  <AvatarFallback>{USER_DATA.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-2xl font-bold">{USER_DATA.name}</h1>
                  <p className="text-muted-foreground">@{USER_DATA.username}</p>
                  <p className="mt-2">{USER_DATA.role} at {USER_DATA.company}</p>
                  <p className="text-muted-foreground">{USER_DATA.location}</p>
                  <div className="flex gap-2 mt-4">
                    <a href={USER_DATA.githubUrl} className="text-primary hover:underline">
                      GitHub Profile
                    </a>
                    <span className="text-muted-foreground">•</span>
                    <a href={`mailto:${USER_DATA.email}`} className="text-primary hover:underline">
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contribution Stats */}
          <Card className="flex-1">
            <CardHeader>
              <CardTitle>Contribution Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold">{USER_DATA.contributions.total}</div>
                  <div className="text-sm text-muted-foreground">Total Contributions</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold">{USER_DATA.contributions.streak}</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold">{USER_DATA.contributions.thisYear}</div>
                  <div className="text-sm text-muted-foreground">This Year</div>
                </div>
                <div className="text-center p-4 bg-primary/10 rounded-lg">
                  <div className="text-3xl font-bold">{USER_DATA.contributions.thisMonth}</div>
                  <div className="text-sm text-muted-foreground">This Month</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Activity Stats */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Activity Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4">
                <div className="text-2xl font-bold">{USER_DATA.stats.pullRequests}</div>
                <div className="text-sm text-muted-foreground">Pull Requests</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold">{USER_DATA.stats.issues}</div>
                <div className="text-sm text-muted-foreground">Issues</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold">{USER_DATA.stats.codeReviews}</div>
                <div className="text-sm text-muted-foreground">Code Reviews</div>
              </div>
              <div className="text-center p-4">
                <div className="text-2xl font-bold">{USER_DATA.stats.repositories}</div>
                <div className="text-sm text-muted-foreground">Repositories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {USER_DATA.skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Badges Section */}
        <BadgesShowcase />
      </div>
    </PageContainer>
  );
}
