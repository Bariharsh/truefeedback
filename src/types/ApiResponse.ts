import { Message } from "@/model/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    statusCode: number;
    isAcceptingMessages?: boolean;
    messages?: Array<Message>;
}