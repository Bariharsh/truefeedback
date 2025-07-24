"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { Message } from "@/model/User";
// import { toast } from "sonner";
// import { ApiResponse } from "@/types/ApiResponse";
// import axios, { AxiosError } from "axios";

type MessageCardProps = {
  message: Message;
  onMessageDelete: (messageId: string) => void;
};

const MessageCard = ({ message, onMessageDelete }: MessageCardProps) => {
  // const handleDeleteConfirm = async () => {
  //   try {
  //     await axios.delete<ApiResponse>(`/api/delete-message/${message._id}`);
  //     toast.success("Message deleted successfully");
  //     onMessageDelete(message._id);
  //   } catch (error) {
  //     const axiosError = error as AxiosError<ApiResponse>;
  //     toast.error(
  //       axiosError.response?.data.message || "Failed to delete message");
  //   }
  // };

  return (
    <Card className="relative shadow-md dark:bg-gray-800">
      <div className="absolute top-3 right-3">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="icon" className="w-8 h-8 p-0">
              <X className="h-4 w-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action will permanently delete this message.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => onMessageDelete(message._id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      <CardHeader>
        <CardTitle className="text-sm text-gray-800 dark:text-gray-100">
          Anonymous Message
        </CardTitle>
        <CardDescription className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(message.createdAt).toLocaleString()}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-700 dark:text-gray-200 whitespace-pre-wrap">
          {message.content}
        </p>
      </CardContent>
    </Card>
  );
};

export default MessageCard;
