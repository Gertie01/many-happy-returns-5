import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt, modelId, apiKey } = body;

    // 1. Validation Logic
    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid prompt' }, { status: 400 });
    }

    const activeModel = "rudalle-Malevich";
    if (modelId !== activeModel) {
      return NextResponse.json({ error: 'Unsupported model version' }, { status: 400 });
    }

    if (prompt.length > 2000) {
      return NextResponse.json({ error: 'Prompt too long' }, { status: 400 });
    }

    // Call the internal Python/Torch API
    const internalApiUrl = process.env.INTERNAL_API_URL;
    const internalApiKey = process.env.INTERNAL_API_KEY;

    if (!internalApiUrl || !internalApiKey) {
      return NextResponse.json({ 
        error: 'Internal API configuration missing' 
      }, { status: 500 });
    }

    const response = await fetch(`${internalApiUrl}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${internalApiKey}`,
      },
      body: JSON.stringify({
        prompt,
        model: activeModel,
      }),
    });

    if (!response.ok) {
      return NextResponse.json({
        error: 'Failed to generate image'
      }, { status: response.status });
    }

    const generatedData = await response.json();

    return NextResponse.json({
      success: true,
      model: activeModel,
      timestamp: new Date().toISOString(),
      images: generatedData.images,
      status: 'unlimited'
    }, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
      }
    });

  } catch (error: any) {
    return NextResponse.json({
      error: 'Internal Generation Error',
      details: error.message
    }, { status: 500 });
  }
}
