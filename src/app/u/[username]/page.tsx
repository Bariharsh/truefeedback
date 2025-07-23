"use client";
import React, {  useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";

export default function PublicProfilePage() {
  const { username } = useParams();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState<{ content: string }[]>([]);
  const [isSuggestionLoading, setIsSuggestionLoading] = useState(false);
  const [IsSend, setIsSend] = useState(false);
  // const [acceptMessages, setAcceptMessages] = useState(true);

  const handleSuggestion = async () => {
    setIsSuggestionLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages", {
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
    // if (!acceptMessages) {
    //   toast.error("This user is not accepting messages.");
    //   setIsSend(false);
    //   return;
    // }
    try {
      await axios.post<ApiResponse>("/api/send-message", {
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

  // useEffect(() => {
  //   const fetchAcceptanceStatus = async () => {
  //     try {
  //       const response = await axios.get(
  //         `/api/check-accept-messages/${username}`
  //       );
  //       setAcceptMessages(response.data.acceptMessages);
  //     } catch (error) {
  //       const axiosError = error as AxiosError<ApiResponse>;
  //       console.error("Error fetching acceptance status:", axiosError);
  //       setAcceptMessages(false);
  //     }
  //   };

  //   if (username) {
  //     fetchAcceptanceStatus();
  //   }
  // }, [username]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white px-4 py-10 flex flex-col items-center">
      <div className="w-full max-w-2xl bg-zinc-900 p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">
          Public Profile Link
        </h1>

        <p className="text-pink-500 text-sm mb-2">
          Send Anonymous Message to @{username}
        </p>

        <textarea
          className="w-full p-3 rounded-md bg-zinc-800 border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white resize-none"
          rows={3}
          placeholder="Type your message here..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

        <div className="mt-4 flex justify-end">
          <Button onClick={handleSend} disabled={IsSend}>
            Send It
          </Button>
        </div>

        <hr className="my-6 border-zinc-700" />

        <div className="text-center mb-4">
          <Button
            variant="outline"
            onClick={handleSuggestion}
            disabled={isSuggestionLoading}
          >
            {isSuggestionLoading ? "Loading..." : "Suggest Messages"}
          </Button>
          <p className="mt-2 text-gray-400 text-sm">
            Click on any message below to select it.
          </p>
        </div>

        {suggestions.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
            {suggestions.map((suggestion, index) => (
              <div
                key={index}
                onClick={() => setMessage(suggestion.content)}
                className="cursor-pointer bg-zinc-800 border border-zinc-700 rounded-lg p-3 hover:bg-zinc-700 transition"
              >
                {suggestion.content}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
