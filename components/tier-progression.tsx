'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { fetchUserProfile } from "@/lib/api"

type Tier = 'Bronze' | 'Silver' | 'Gold' | 'Diamond'

const tiers: { name: Tier; pointsRequired: number; color: string }[] = [
  { name: 'Bronze', pointsRequired: 0, color: 'bg-orange-600' },
  { name: 'Silver', pointsRequired: 100, color: 'bg-gray-400' },
  { name: 'Gold', pointsRequired: 250, color: 'bg-yellow-400' },
  { name: 'Diamond', pointsRequired: 500, color: 'bg-cyan-400' },
]

export function TierProgressionComponent({ walletAddress }: { walletAddress: string }) {
  const [currentPoints, setCurrentPoints] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const { xpBalance } = await fetchUserProfile(walletAddress)
        setCurrentPoints(Math.max(0, xpBalance)) // Ensure XP is never negative
      } catch (err) {
        console.error('Error loading profile:', err)
        setError('Failed to load profile data')
      } finally {
        setIsLoading(false)
      }
    }
    
    if (walletAddress) {
      loadProfile()
    }
  }, [walletAddress])

  const getCurrentTier = (points: number) => {
    // Handle zero XP case
    if (points === 0) return tiers[0]
    
    // Find the highest tier the user qualifies for
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (points >= tiers[i].pointsRequired) {
        return tiers[i]
      }
    }
    return tiers[0]
  }

  const getProgress = (points: number, currentTier: typeof tiers[0], nextTier: typeof tiers[0]) => {
    // If at max tier or above max tier points, return 100%
    if (nextTier === currentTier || points >= tiers[tiers.length - 1].pointsRequired) {
      return 100
    }
    
    // If at 0 XP, return 0%
    if (points === 0) {
      return 0
    }
    
    // Calculate progress percentage
    const progressPoints = points - currentTier.pointsRequired
    const tierRange = nextTier.pointsRequired - currentTier.pointsRequired
    return Math.min(100, Math.max(0, (progressPoints / tierRange) * 100))
  }

  if (isLoading) {
    return (
      <Card className="w-full p-8 rounded-lg shadow-sm relative">
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse">Loading...</div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full p-8 rounded-lg shadow-sm relative">
        <div className="flex flex-col items-center justify-center h-40 gap-2">
          <div className="text-destructive font-medium">Failed to load profile data</div>
          <div className="text-sm text-muted-foreground">{error}</div>
          <div className="text-xs text-muted-foreground">Wallet: {walletAddress}</div>
        </div>
      </Card>
    )
  }

  const currentTier = getCurrentTier(currentPoints)
  const nextTierIndex = tiers.indexOf(currentTier) + 1
  const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : currentTier
  const progress = getProgress(currentPoints, currentTier, nextTier)

  const pointsRemaining = nextTier === currentTier 
    ? 0 
    : Math.max(0, nextTier.pointsRequired - currentPoints)

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
                  ? currentPoints >= tiers[tiers.length - 1].pointsRequired 
                    ? `Max tier reached (${currentPoints} XP)` 
                    : "Max tier reached"
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