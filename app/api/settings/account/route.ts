import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized: User session required' }, { status: 401 });
    }

    const body = await req.json();
    let { name } = body;

    // Validate name
    if (name !== undefined && name !== null) {
      name = name.trim();
      if (name.length > 50) {
        return NextResponse.json({ error: 'Validation Error: Name cannot exceed 50 characters' }, { status: 400 });
      }
    } else {
      name = null;
    }

    // Return the sanitized and updated name to be updated in the client database/auth
    return NextResponse.json({
      success: true,
      data: {
        userId,
        displayName: name || null,
        updatedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error updating account settings:', error);
    return NextResponse.json({ error: 'Internal server error while saving account' }, { status: 500 });
  }
}
