import axios from "axios";

const API_KEY = process.env.NEXT_PUBLIC_OPENFORMAT_API_KEY
const APP_ID = process.env.NEXT_PUBLIC_OPENFORMAT_APP_ID

export async function fetchUserProfile(walletAddress: string) {
    console.log('Fetching user profile...', { API_KEY, APP_ID })
    
    if (!API_KEY || !APP_ID) {
        console.error('Missing API key or App ID')
        return { xpBalance: 0 }
    }
    
    const queryParams = {
        app_id: APP_ID.toLowerCase(),
        user_id: walletAddress.toLowerCase(),
        chain: "arbitrum-sepolia",
    };
    
    const axiosConfig = {
        method: "get" as const,
        url: "https://api.openformat.tech/v1/profile",
        headers: {
            "X-API-KEY": API_KEY,
            "Content-Type": "application/json",
        },
        params: queryParams,
    };

    try {
        console.log('Making API request with config:', axiosConfig)
        const response = await axios(axiosConfig)
        console.log('API response:', response.data)
        return {
            xpBalance: parseInt(response.data.xp_balance) || 0
        }
    } catch (error) {
        console.error('API Error:', error)
        throw error // Let the component handle the error
    }
} 