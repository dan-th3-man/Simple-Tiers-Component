'use client'

import { useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { ThemeToggle } from "@/components/theme-toggle"
import { fetchUserProfile } from "@/lib/api"
import { cn } from "@/lib/utils"


const tiers: { name: string; pointsRequired: number; color: string }[] = [
  {
    "name": "Amateur",
    "pointsRequired": 1000,
    "color": "bg-orange-500"
  },
  {
    "name": "Pro",
    "pointsRequired": 2500,
    "color": "bg-green-500"
  },
  {
    "name": "Expert",
    "pointsRequired": 5000,
    "color": "bg-sky-500"
  },
  {
    "name": "Legend",
    "pointsRequired": 10000,
    "color": "bg-pink-500"
  }
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
    // Return null if user hasn't reached first tier
    if (points < tiers[0].pointsRequired) return null
    
    // Find the highest tier the user qualifies for
    for (let i = tiers.length - 1; i >= 0; i--) {
      if (points >= tiers[i].pointsRequired) {
        return tiers[i]
      }
    }
    return null
  }

  const getProgress = (points: number, currentTier: typeof tiers[0] | null, nextTier: typeof tiers[0]) => {
    // If no current tier, calculate progress to first tier
    if (!currentTier) {
        return (points / tiers[0].pointsRequired) * 100
    }
    
    // If at max tier or above max tier points, return 100%
    if (nextTier === currentTier || points >= tiers[tiers.length - 1].pointsRequired) {
        return 100
    }
    
    // Calculate progress percentage
    const progressPoints = points - currentTier.pointsRequired
    const tierRange = nextTier.pointsRequired - currentTier.pointsRequired
    return Math.min(100, Math.max(0, (progressPoints / tierRange) * 100))
  }

  if (isLoading) {
    return (
      <Card className={cn(
        "w-full p-8 rounded-lg relative",
        "dark:bg-black/40 dark:backdrop-blur-sm dark:border-white/10 dark:shadow-xl",
        "bg-white/80 border-black/5 shadow-lg"
      )}>
        <div className="flex items-center justify-center h-40">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className={cn(
        "w-full p-8 rounded-lg relative",
        "dark:bg-black/40 dark:backdrop-blur-sm dark:border-white/10 dark:shadow-xl",
        "bg-white/80 border-black/5 shadow-lg"
      )}>
        <div className="flex flex-col items-center justify-center h-40 gap-2">
          <div className="text-destructive font-medium">Failed to load profile data</div>
          <div className="text-sm text-muted-foreground">{error}</div>
          <div className="text-xs text-muted-foreground">Wallet: {walletAddress}</div>
        </div>
      </Card>
    )
  }

  const currentTier = getCurrentTier(currentPoints)
  const nextTierIndex = currentTier ? tiers.indexOf(currentTier) + 1 : 0
  const nextTier = nextTierIndex < tiers.length ? tiers[nextTierIndex] : tiers[tiers.length - 1]
  const progress = getProgress(currentPoints, currentTier, nextTier)

  const pointsRemaining = currentTier && nextTier === currentTier 
    ? 0 
    : Math.max(0, (currentTier ? nextTier : tiers[0]).pointsRequired - currentPoints)

  return (
    <Card className={cn(
      "w-full p-8 rounded-lg relative",
      "dark:bg-black/40 dark:backdrop-blur-sm dark:border-white/10 dark:shadow-xl",
      "bg-white/80 border-black/5 shadow-lg"
    )}>
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
              {currentTier ? (
                <>
                  <span className="text-sm text-muted-foreground">Current Tier:</span>
                  <Badge className={`text-white ${currentTier.color}`}>{currentTier.name}</Badge>
                  <span className="text-xs text-muted-foreground">
                    ({currentPoints.toLocaleString()} points)
                  </span>
                </>
              ) : (
                <span className="text-sm text-muted-foreground">
                  {currentPoints.toLocaleString()} points earned
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Next Tier:</span>
              <Badge className={`text-white ${nextTier.color}`}>
                {nextTier.name}
              </Badge>
            </div>
          </div>
          <div className="space-y-1">
            <Progress 
              value={progress}
              className="w-full h-3" 
            />
            <div className="flex justify-end">
              <span className="text-sm text-muted-foreground">
                {currentTier 
                  ? pointsRemaining === 0 
                    ? currentPoints >= tiers[tiers.length - 1].pointsRequired 
                      ? `Max tier reached (${currentPoints} points)` 
                      : "Max tier reached"
                    : `${pointsRemaining} points to ${nextTier.name}`
                  : `${tiers[0].pointsRequired - currentPoints} points to ${tiers[0].name}`
                }
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm pt-4">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={cn(
                  "flex flex-col items-center p-3 rounded-lg transition-colors duration-200",
                  // Only highlight if there's a current tier and it matches
                  currentTier === tier
                    ? "dark:bg-secondary/20 bg-secondary/30"
                    : "dark:bg-secondary/10 bg-secondary/20"
                )}
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