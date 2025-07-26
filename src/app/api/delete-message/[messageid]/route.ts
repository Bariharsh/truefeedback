// route.ts
import { getServerSession } from "next-auth";
// import { authOptions } from "../../../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";


export async function DELETE(request: Request, { params }: { params: { messageid: string } }) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return Response.json({ success:false, message:"Not Authorized" }, { status:401 });
  }
  const user = session.user as User;
  const { messageid } = params;
  try {
    const update = await UserModel.updateOne(
      { _id: user._id },
      { $pull: { messages: { _id: messageid } } }
    );
    if (!update.modifiedCount) {
      return Response.json({ success:false, message:"Message not found" }, { status:404 });
    }
    return Response.json({ success:true, message:"Message deleted" }, { status:200 });
  } catch {
    return Response.json({ success:false, message:"Server error" }, { status:500 });
  }
}
