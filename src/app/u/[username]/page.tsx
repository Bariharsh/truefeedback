"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<{ content: string }[]>([]);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [IsSend, setIsSend] = useState(false);
  const [canAcceptMessage, setCanAcceptMessage] = useState(true);
  const [loadingStatus, setLoadingStatus] = useState(true);




  const handleSuggestion = async () => {
    setIsSuggestionLoading(true);
    try {
      const response = await axios.post<ApiResponse>(`/api/suggest-messages`, {
        messages: [
          {
            role: "system",
            content:
              "You are a helpful assistant that generates anonymous message suggestions.",
          },
          {
            role: "user",
            content:
              "Give me 4 suggestions to send anonymously message. Format each suggestion like:\n1. message\n2. message\n3. message\n4. message",
          },
        ],
      });

      const fullText = response.data.message;

      // Split by numbered list format
      const matches = fullText.split(/\d\.\s/).filter(Boolean);

      const generatedSuggestions = matches.map((s) => ({
        content: s.trim(),
      }));

      setSuggestions(generatedSuggestions);
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to fetch messages"
      );
    } finally {
      setIsSuggestionLoading(false);
    }
  };

  const handleSend = async () => {
    setIsSend(true);
    setError("");

    if (!canAcceptMessage) {
      toast.error("Please accept messages before sending");
    }

    try {
      await axios.post<ApiResponse>(`/api/send-message`, {
        username,
        content: message,
      });
      setIsSend(false);
      toast.success("Message sent!");
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast.error(
        axiosError.response?.data.message || "Failed to send message"
      );
    } finally {
      setMessage("");
    }
  };

  useEffect(() => {
    const fetchAcceptStatus = async () => {
      try {
        const response = await axios.get(
          `/api/check-accept-message/${username}`
        );
        setCanAcceptMessage(response.data.canAcceptMessages);
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>;
        toast.error(
          axiosError.response?.data.message || "Failed to check accept messages"
        );
      } finally {
        setLoadingStatus(false);
      }
    };

    fetchAcceptStatus();
  }, [username]);

  if (loadingStatus) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
        <div className="flex items-center gap-3 text-blue-400 bg-gray-800 p-4 rounded-md shadow">
          <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          <p className="font-medium text-white">
            Checking messaging settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-12 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-zinc-900 border border-zinc-800 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 text-center text-white">
          Public Profile
        </h1>

        <p className="text-pink-500 text-sm mb-6 text-center">
          Send Anonymous Message
        </p>

        <textarea
          className="w-full p-4 rounded-xl bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white resize-none transition disabled:opacity-50"
          rows={4}
          placeholder={
            canAcceptMessage
              ? "Type your anonymous message here..."
              : "Messaging is turned off for this user."
          }
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          disabled={!canAcceptMessage}
        />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="mt-4 flex justify-end">
          <Button
            onClick={handleSend}
            disabled={IsSend || !canAcceptMessage || message.trim() === ""}
          >
            {canAcceptMessage ? "Send It" : "Messaging Disabled"}
          </Button>
        </div>

        {!canAcceptMessage && (
          <p className="text-red-400 text-sm mt-3 text-center">
            Messaging has been disabled..
          </p>
        )}

        <Separator className="my-8 bg-zinc-700" />

        <div className="text-center mb-4">
          <Button
            variant="outline"
            onClick={handleSuggestion}
            disabled={isSuggestionLoading || !canAcceptMessage}
          >
            {isSuggestionLoading ? "Loading..." : "Suggest Messages"}
          </Button>
          <p className="mt-2 text-zinc-400 text-sm">
            Click any suggestion to autofill the message box.
          </p>
        </div>

        {suggestions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => setMessage(suggestion.content)}
                className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg p-4 transition"
              >
                {suggestion.content}
              </div>
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link href="/dashboard">
            <Button variant="secondary">← Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
