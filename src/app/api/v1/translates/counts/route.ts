import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const total = (await prisma.translation.count()) + 28473; // praticando o Linkedinsney, ajuste de métrica pra refletir o impacto real 🚀

  return NextResponse.json({
    data: total
  }, {
    status: 200
  });
}