import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  const user = session.user as User;

  try {
    console.log("Session user._id:", user._id, typeof user._id);
    const userId = new mongoose.Types.ObjectId(user._id);
    
    console.log("Querying for userId:", userId);

    const foundUser = await UserModel.findById(userId);
    console.log("Found user:", foundUser);

    const result = await UserModel.aggregate([
      { $match: { _id: userId } },
      { $unwind: "$messages" },
      { $sort: { "messages.createdAt": -1 } },
      {
        $group: {
          _id: "$_id",
          messages: { $push: "$messages" },
        },
      },
    ]);
    console.log("Result:", result);

    if (!result || result.length === 0) {
      return Response.json(
        { success: false, message: "No messages found for user" },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        messages: result[0].messages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get messages:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error while fetching messages",
      },
      { status: 500 }
    );
  }
}
