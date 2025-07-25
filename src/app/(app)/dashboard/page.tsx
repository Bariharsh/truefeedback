"use client";
import { Button } from "@/components/ui/button";
import { Message } from "@/model/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { User } from "next-auth";
import { useSession } from "next-auth/react";
import React, { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Loader2, RefreshCcw } from "lucide-react";
import MessageCard from "@/components/MessageCard";
import Link from "next/link";

function DashboardPage() {
  const [profileUrl, setProfileUrl] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const handleDeleteConfirm = async (messageId: string) => {
    try {
      await axios.delete<ApiResponse>(`${process.env.NEXTAUTH_URL}/api/delete-message/${messageId}`);
      toast.success("Message deleted successfully");
      handleDeleteMessage(messageId);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to delete message"
      );
    }
  };

  const handleDeleteMessage = (messageId: string) => {
    setMessages((prevMessages) =>
      prevMessages.filter((message) => message._id !== messageId)
    );
  };

  const { data: session } = useSession();

  const form = useForm({
    resolver: zodResolver(acceptMessageSchema),
  });

  const { register, watch, setValue } = form;
  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessages ?? false);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message ||
          "Failed to fetch accept messages status"
      );
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue]);

  const fetchMessages = useCallback(
    async (refresh: boolean) => {
      setIsLoading(true);
      setIsSwitchLoading(false);
      try {
        const response = await axios.get<ApiResponse>("/api/get-messages");
        setMessages(response.data.messages || []);

        if (refresh) {
          toast.success("Showing latest messages");
        }
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to fetch messages"
        );
      } finally {
        setIsLoading(false);
        setIsSwitchLoading(false);
      }
    },
    [setIsLoading, setMessages]
  );

  useEffect(() => {
    if (!session || !session.user) return;
    fetchMessages(false);
    fetchAcceptMessage();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages,
      });
      setValue("acceptMessages", !acceptMessages);
      toast.success(
        response.data.message ||
          "Messages acceptance status updated successfully"
      );
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to update status"
      );
    }
  };

  const user = session?.user as User | undefined;
  const username = user?.username ?? "unknown";

  useEffect(() => {
    if (typeof window !== "undefined" && session?.user) {
      const baseUrl = `${window.location.protocol}//${window.location.host}`;
      const username = (session.user as User).username;
      setProfileUrl(`${baseUrl}/u/${username}`);
    }
  }, [session]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast.success("Profile URL copied to clipboard");
  };

if (!session || !session.user) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-zinc-950 text-white px-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 max-w-md w-full text-center shadow-xl">
        <h2 className="text-3xl font-bold mb-4">Access Denied</h2>
        <p className="text-zinc-400 mb-6">
          You must be logged in to view this page.
        </p>
        <a
          href="/login"
          className="inline-block px-6 py-2 rounded-full bg-pink-600 hover:bg-pink-700 text-white font-medium transition"
        >
          Login Now
        </a>
      </div>
    </div>
  );
}

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white dark:bg-gray-900 rounded w-full max-w-6xl shadow">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
        User Dashboard
      </h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">
          Copy Your Unique Link
        </h2>
        <div className="flex items-center">
          <input
            type="text"
            value={profileUrl}
            disabled
            className="border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100 rounded p-2 flex-grow mr-2"
          />
          <Link href={`/u/${username}`}>
            <Button onClick={copyToClipboard}>Copy</Button>
          </Link>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register("acceptMessages")}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2 text-gray-800 dark:text-gray-200">
          Accept Messages: {acceptMessages ? "On" : "Off"}
        </span>
      </div>

      <Separator className="dark:bg-gray-700" />

      <Button
        className="mt-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault();
          fetchMessages(true);
        }}
      >
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="mr-2 h-4 w-4" />
        )}
        Refresh
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {messages.length > 0 ? (
          messages.map((message) => (
            <MessageCard
              key={message._id}
              message={message}
              onMessageDelete={handleDeleteConfirm}
            />
          ))
        ) : (
          <p className="text-muted-foreground dark:text-gray-400">
            No Messages to display.
          </p>
        )}
      </div>
    </div>
  );
}

export default DashboardPage;
