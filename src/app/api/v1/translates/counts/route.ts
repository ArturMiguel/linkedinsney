import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const total = (await prisma.translation.count()) + 28473;

  return NextResponse.json({
    data: total
  }, {
    status: 200
  });
}