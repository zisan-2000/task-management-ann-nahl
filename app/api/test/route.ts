import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({ message: "API routing is working!" }, { status: 200 })
}

export async function POST() {
  return NextResponse.json({ message: "POST request received!" }, { status: 200 })
}
