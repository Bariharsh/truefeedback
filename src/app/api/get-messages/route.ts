import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json(
      { success: false, message: "Not Authenticated" },
      { status: 401 }
    );
  }

  try {
    // Aggregate messages from all users, flatten them, and sort by date
    const result = await UserModel.aggregate([
      { $unwind: "$messages" },
      {
        $project: {
          _id: 0,
          messageId: "$messages._id",
          content: "$messages.content",
          createdAt: "$messages.createdAt",
          fromUser: "$username",
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    return Response.json(
      {
        success: true,
        messages: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Failed to get all messages:", error);
    return Response.json(
      {
        success: false,
        message: "Internal server error while fetching messages",
      },
      { status: 500 }
    );
  }
}
