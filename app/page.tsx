import { TierProgressionComponent } from "@/components/tier-progression"
import { fetchUserProfile } from "@/lib/api"

export default async function Page() {
  const walletAddress = "0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266"
  const { xpBalance } = await fetchUserProfile(walletAddress)

  return (
    <div className="min-h-screen w-full">
      <div className="max-w-5xl mx-auto py-8">
        <div className="max-w-3xl mx-auto">
          <TierProgressionComponent currentPoints={xpBalance} />
        </div>
      </div>
    </div>
  )
}