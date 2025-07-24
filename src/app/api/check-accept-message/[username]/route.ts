import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(req: NextRequest, context: { params: Record<string, string> }) {
  const { username } = context.params;

  await dbConnect();

  const user = await UserModel.findOne({ username });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ canAcceptMessages: user.isAcceptingMessages });
}
