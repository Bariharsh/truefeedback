import { NextRequest,NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

interface Context {
  params: {
    username: string;
  };
}



export async function GET(req: NextRequest, context: Context) {
  await dbConnect();

  const user = await UserModel.findOne({ username: context.params.username });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ canAcceptMessages: user.isAcceptingMessages });
}
