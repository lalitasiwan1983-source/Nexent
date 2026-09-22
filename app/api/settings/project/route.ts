import { NextRequest, NextResponse } from 'next/server';

export async function PATCH(req: NextRequest) {
  try {
    const userId = req.headers.get('x-user-id');
    const projectId = req.headers.get('x-project-id');

    if (!userId || !projectId) {
      return NextResponse.json({ error: 'Unauthorized: User and project validation required' }, { status: 401 });
    }

    const body = await req.json();
    let { projectName } = body;

    if (!projectName) {
      return NextResponse.json({ error: 'Validation Error: Project name is required' }, { status: 400 });
    }

    projectName = projectName.trim();

    if (projectName === '') {
      return NextResponse.json({ error: 'Validation Error: Project name cannot be empty' }, { status: 400 });
    }

    if (projectName.length > 100) {
      return NextResponse.json({ error: 'Validation Error: Project name cannot exceed 100 characters' }, { status: 400 });
    }

    // In a production server-side database flow, we would update the project name here.
    // We return the sanitized and updated project details for client-side synchronization.
    return NextResponse.json({
      success: true,
      data: {
        projectId,
        projectName,
        updatedAt: new Date().toISOString(),
      }
    });
  } catch (error) {
    console.error('Error updating project settings:', error);
    return NextResponse.json({ error: 'Internal server error while saving project' }, { status: 500 });
  }
}
