import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyOwnerToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get('bookdesk_owner')?.value
  const owner = token ? verifyOwnerToken(token) : null
  if (!owner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const mimeType = file.type || 'image/jpeg'
  const base64 = buffer.toString('base64')
  const dataUrl = `data:${mimeType};base64,${base64}`
  return NextResponse.json({ url: dataUrl })
}
