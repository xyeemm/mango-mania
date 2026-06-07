// src/app/api/orders/route.ts

import { getOrdersCollection, serializeOrder, validateOrder } from '@/lib/mongodb'
import { type StoreOrder } from '@/types/order'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/orders
 * Fetches ALL orders to populate your admin dashboard list
 */
export async function GET(request: NextRequest) {
    try {
        const collection = await getOrdersCollection()
        
        // Grab everything out of your MongoDB collection as a clean array, sorted by createdAt desc
        const rawOrders = await collection.find({}).sort({ createdAt: -1 }).toArray()
        
        // Run them through your serializer to format MongoDB _id fields properly
        const orders = rawOrders.map(serializeOrder)
        
        return NextResponse.json(orders)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch orders.' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/orders
 * Creates a brand new order from the checkout checkout cart
 */
export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as StoreOrder
        const collection = await getOrdersCollection()

        // 1. Validate form fields format
        if (!validateOrder(body)) {
            return NextResponse.json(
                { error: 'Invalid order payload format.' },
                { status: 400 }
            )
        }

        // 2. Check if an order with that custom string ID already exists
        const existing = await collection.findOne({ id: body.id })
        if (existing) {
            return NextResponse.json(
                { error: 'Order ID already exists inside MongoDB.' },
                { status: 409 }
            )
        }

        // 3. Save the new order straight to the cloud cluster database
        await collection.insertOne({ ...body })
        
        // Return the clean data object back so the frontend can read it successfully
        return NextResponse.json(body, { status: 201 })
    } catch (error) {
        return NextResponse.json(
            { error: 'Internal server database error.' },
            { status: 500 }
        )
    }
}
