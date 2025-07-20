import { generateText } from 'ai';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
 
export async function POST(req: Request) {
  const {messages} = await req.json();
  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. each question should be separated by '||'. these questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. for example, your output should be structured like this: 'What's a hobby you've recently started?||If you could have dinner with any historical figure, who would it be?||What's a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

    const result = await generateText({
      model: 'xai/grok-3',
      prompt,
      messages
    });
    return Response.json(result);
  } catch (error) {
    if(error instanceof OpenAI.APIError){
      const {name, status, headers, message} = error;
      return NextResponse.json({
        name,status,headers,message
      }, {status})
    } else {
      console.log("An unexpected error occurred:", error);
      throw error
    }
  }
}