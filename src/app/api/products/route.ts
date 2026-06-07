// src/app/api/products/route.ts

import { getProductsCollection, serializeProduct, validateProduct } from '@/lib/mongodb'
import { type MangoProduct } from '@/types/mango'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/products
 * Fetches ALL items to populate your shop grids and admin dashboard list
 */
export async function GET(request: NextRequest) {
    try {
        const collection = await getProductsCollection()
        
        // Grab everything out of your MongoDB collection as a clean array
        const rawProducts = await collection.find({}).toArray()
        
        // Run them through your serializer to format MongoDB _id fields properly
        const products = rawProducts.map(serializeProduct)
        
        return NextResponse.json(products)
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch product catalog.' },
            { status: 500 }
        )
    }
}

/**
 * POST /api/products
 * Creates a brand new mango product from your admin dashboard entry form
 */
export async function POST(request: NextRequest) {
    try {
        const body = (await request.json()) as MangoProduct
        const collection = await getProductsCollection()

        // 1. Validate form fields format
        if (!validateProduct(body)) {
            return NextResponse.json(
                { error: 'Invalid product payload format.' },
                { status: 400 }
            )
        }

        // 2. Check if a product with that custom string ID already exists
        const existing = await collection.findOne({ id: body.id })
        if (existing) {
            return NextResponse.json(
                { error: 'Product ID already exists inside MongoDB.' },
                { status: 409 }
            )
        }

        // 3. Save the new product straight to the cloud cluster database
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