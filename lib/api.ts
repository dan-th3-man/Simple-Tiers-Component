export async function fetchUserProfile(walletAddress: string) {
    try {
        const response = await fetch(`/api/profile?wallet=${walletAddress}`)
        const data = await response.json()
        
        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch profile')
        }

        return { xpBalance: data.xpBalance }
    } catch (error) {
        console.error('API Error:', error)
        return { xpBalance: 0 }
    }
} 