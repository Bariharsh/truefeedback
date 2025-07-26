import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { NextRequest } from "next/server";
import mongoose from "mongoose";

export async function DELETE(req: NextRequest) {
  await dbConnect();
  
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ success: false, message: "Not Authorized" }, { status: 401 });
  }

  const user = session.user as User;

  // ✅ Extract messageid from URL
  const url = new URL(req.url);
  const pathParts = url.pathname.split("/");
  const messageid = pathParts[pathParts.length - 1];

  // ✅ Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(messageid)) {
    return Response.json({ success: false, message: "Invalid message ID" }, { status: 400 });
  }

  try {
    const update = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: new mongoose.Types.ObjectId(messageid) } } }
    );

    if (!update.modifiedCount) {
      return Response.json({ success: false, message: "Message not found" }, { status: 404 });
    }

    return Response.json({ success: true, message: "Message deleted" }, { status: 200 });
  } catch (err) {
    console.error("Error deleting message:", err);
    return Response.json({ success: false, message: "Server error" }, { status: 500 });
  }
}
