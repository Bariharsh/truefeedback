import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function DELETE(request: Request, {params}: {params: {mesaageid: string}}) {

  const messageId = params.mesaageid;
  await dbConnect();
  const session = await getServerSession(authOptions);
  const user: User = session?.user as User;

  if (!session || !session.user) {
    return Response.json({
      success: false,
      message: "Not Authorized"
    },{status: 401})
    console.error("failed to get messages ", error);
    return Response.json({
        success: false,
        message: "Failed to get messages",
    },{status: 500})
  }

  try {
    const updateResult = await UserModel.updateOne(
      {_id: user._id},
      { $pull: { messages: {_id: messageId}}}
    )

    if(updateResult.modifiedCount === 0){
      return Response.json({
        success: false,
        message: "Message not found or already deleted"
      },{status: 404});
    }

    return Response.json({
      success: true,
      message: "Message deleted successfully"
    },{status: 201});

  } catch (error) {
    console.error("failed to delete messages ", error);
    return Response.json({
      success: false,
      message: "Failed to delete message"
    },{status: 500})
  }
  
}
