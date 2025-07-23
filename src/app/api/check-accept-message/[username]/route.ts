

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";


export async function GET(request: Request, { params }: { params: { username: string } }) {
    try {
        await dbConnect()
        const user = await UserModel.findOne({ username: params.username })

        if(!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {status: 404})
        }

        return Response.json({
            success: true,
            message:
        })

    } catch (error) {
        
    }
}