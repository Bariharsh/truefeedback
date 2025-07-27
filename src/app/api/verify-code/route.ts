import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodedUsername = decodeURIComponent(username);

    const user = await UserModel.findOne({
      username: decodedUsername,
    });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    const isCodeValid = user.verifyCode === code;

    const isCodeNotExpire = new Date(user.verifyCodeExpire) > new Date()

    if(isCodeValid && isCodeNotExpire) {
        user.isVerified = true
        await user.save()

        return Response.json(
          {
            success: true,
            message: "Account verified successfully",
          },
          { status: 200 }
        );
    } else if(!isCodeNotExpire) {
        return Response.json({
            success: false,
            message: "Verification code has expired",
        },{status: 400})
    } else {
        return Response.json(
          {
            success: true,
            message: "Incorrect verification code",
          },
          { status: 400 }
        );
    }

  } catch (error) {
    console.error("Error Verifying User", error);
    return Response.json(
      {
        success: false,
        message: "Error Verifying User ",
      },
      { status: 500 }
    );
  }
}
export const POST_api_verify_code = POST;