// app/api/inventory/[id]/history/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Hello, world!' });
}
