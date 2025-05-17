import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const barcode = searchParams.get("upc");

  if (!barcode) {
    return NextResponse.json({ error: "Missing barcode" }, { status: 400 });
  }

  const apiRes = await fetch(`https://api.upcitemdb.com/prod/trial/lookup?upc=${barcode}`,{method:"GET"});
  const data = await apiRes.json();

  return NextResponse.json(data);
}
