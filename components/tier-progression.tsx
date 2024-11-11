'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"

type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond'

const tiers: { name: Tier; pointsRequired: number; color: string }[] = [
  { name: 'Bronze', pointsRequired: 0, color: 'bg-orange-600' },
  { name: 'Silver', pointsRequired: 100, color: 'bg-gray-400' },
  { name: 'Gold', pointsRequired: 250, color: 'bg-yellow-400' },
  { name: 'Diamond', pointsRequired: 500, color: 'bg-cyan-400' },
]

export function TierProgressionComponent({ currentPoints }: { currentPoints: number }) {
  const getCurrentTier = (points: number) => {
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (points >= tiers[i].pointsRequired) {
        return tiers[i]
      }
    }
    return tiers[0]
  }

  const currentTier = getCurrentTier(currentPoints)
  const nextTierIndex = tiers.indexOf(currentTier) + 1
  const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : currentTier
  const progress = nextTier === currentTier
    ? 100
    : ((currentPoints - currentTier.pointsRequired) / (nextTier.pointsRequired - currentTier.pointsRequired)) * 100

  const pointsRemaining = nextTier === currentTier 
    ? 0 
    : nextTier.pointsRequired - currentPoints

  return (
    <Card className="w-full p-8 rounded-lg shadow-sm relative">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Tier Progress</CardTitle>
        <p className="text-sm text-muted-foreground">
          Your current tier and progress towards the next
        </p>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Current Tier:</span>
              <Badge className={`text-white ${currentTier.color}`}>{currentTier.name}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {nextTier === currentTier ? "Max Tier Reached" : "Next Tier:"}
              </span>
              <Badge className={`text-white ${nextTier.color}`}>
                {nextTier === currentTier ? currentTier.name : nextTier.name}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <Progress value={progress} className="w-full h-3" />
            <div className="flex justify-end">
              <span className="text-sm text-muted-foreground">
                {pointsRemaining === 0 
                  ? "Max tier reached" 
                  : `${pointsRemaining} points to ${nextTier.name}`}
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm pt-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col items-center p-3 rounded-lg transition-colors duration-200 ${
                  tier === currentTier ? 'bg-secondary' : 'bg-secondary/50'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${tier.color} mb-2 transition-colors duration-200`} />
                <span className="font-medium">{tier.name}</span>
                <span className="text-xs text-muted-foreground">
                  {tier.pointsRequired} points
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}