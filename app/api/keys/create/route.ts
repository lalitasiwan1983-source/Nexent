import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectId, projectName } = body;

    if (!projectId) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }

    // Generate cryptographically secure API key: nx_live_ + 32 random alphanumeric bytes
    const randomBytes = crypto.randomBytes(24).toString('base64url');
    const fullKey = `nx_live_${randomBytes}`;
    const maskedKey = `nx_live_${'•'.repeat(24)}${randomBytes.slice(-4)}`;

    return NextResponse.json({
      success: true,
      key: fullKey,
      maskedKey,
      prefix: `nx_live_${randomBytes.slice(0, 4)}...`,
      createdAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Failed to generate API key' }, { status: 500 });
  }
}
