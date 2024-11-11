'use client'

import { usePrivy } from '@privy-io/react-auth'
import { Button } from '@/components/ui/button'
import { TierProgressionComponent } from '@/components/tier-progression'

export default function Page() {
  const { login, authenticated, ready, user, logout } = usePrivy()

  if (!ready) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center">
        <Button 
          onClick={() => login()}
          className="px-4 py-2"
        >
          Connect Wallet
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto py-8">
        <div className="flex justify-end mb-4">
          <Button 
            variant="outline" 
            onClick={logout}
          >
            Logout
          </Button>
        </div>
        <div className="max-w-3xl mx-auto">
          {user?.wallet?.address && (
            <TierProgressionComponent walletAddress={user.wallet.address} />
          )}
        </div>
      </div>
    </div>
  )
}