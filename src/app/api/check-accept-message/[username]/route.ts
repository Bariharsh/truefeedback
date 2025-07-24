import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function GET(req: NextRequest, { params }: any) {
  const { username } = params;

  await dbConnect();

  const user = await UserModel.findOne({ username });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ canAcceptMessages: user.isAcceptingMessages });
}
