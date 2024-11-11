import { NextResponse } from 'next/server'
import axios from 'axios'

const API_KEY = process.env.OPENFORMAT_API_KEY
const APP_ID = process.env.OPENFORMAT_APP_ID

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('wallet')

    if (!walletAddress) {
        return NextResponse.json(
            { error: 'Wallet address is required' }, 
            { status: 400 }
        )
    }

    if (!API_KEY || !APP_ID) {
        console.error('Missing environment variables:', { 
            hasApiKey: !!API_KEY, 
            hasAppId: !!APP_ID 
        })
        return NextResponse.json(
            { error: 'Server configuration error' }, 
            { status: 500 }
        )
    }

    try {
        const queryParams = {
            app_id: APP_ID.toLowerCase(),
            user_id: walletAddress.toLowerCase(),
            chain: "arbitrum-sepolia",
        }

        const response = await axios({
            method: "get",
            url: "https://api.openformat.tech/v1/profile",
            headers: {
                "X-API-KEY": API_KEY,
                "Content-Type": "application/json",
            },
            params: queryParams,
        })

        const xpBalance = response.data.xp_balance === null 
            ? 0 
            : Number(response.data.xp_balance)
        
        return NextResponse.json({ xpBalance })
    } catch (error) {
        console.error('API Error:', error)
        return NextResponse.json(
            { xpBalance: 0 }
        )
    }
} 