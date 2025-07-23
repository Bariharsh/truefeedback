"use client";
import { useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import messages from "@/messages.json";
import Autoplay from "embla-carousel-autoplay";
import Link from "next/link";

const Home = () => {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <>
      <main className="flex-grow flex flex-col items-center justify-center px-4 md:px-16 lg:px-32 py-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
        {/* Hero Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Your Voice. Heard.
          </h1>
          <p className="mt-4 text-lg text-gray-300 max-w-xl mx-auto">
            Welcome to <span className="font-semibold text-indigo-400">Feednix</span> — a platform to share your thoughts,
            gather honest opinions, and grow through genuine insights.
          </p>
          <div className="mt-6">
            <Link href="/sign-up">
              <Button className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl px-6 py-2">
              Get Started
            </Button>            
            </Link>
          </div>
        </section>

        {/* Carousel Section */}
        <section className="w-full max-w-md">
          <Carousel plugins={[plugin.current]} className="w-full">
            <CarouselContent>
              {messages.map((message, index) => (
                <CarouselItem key={index}>
                  <div className="p-2">
                    <Card className="bg-gray-800 border border-gray-700 text-white">
                      <CardHeader>
                        <CardTitle className="text-center text-indigo-400 text-lg">{message.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex aspect-square items-center justify-center p-6 text-base text-gray-200">
                        <p className="text-center">{message.content}</p>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        {/* Features Section */}
        <section className="mt-16 w-full max-w-4xl grid md:grid-cols-3 gap-6">
          {[
            {
              icon: "💬",
              title: "Gather Feedback",
              desc: "Easily collect thoughts and suggestions from your audience or team.",
            },
            {
              icon: "⚡",
              title: "Instant Insights",
              desc: "Get fast and valuable responses to help make smarter decisions.",
            },
            {
              icon: "🔒",
              title: "Privacy First",
              desc: "We ensure your data and feedback remain secure and confidential.",
            },
          ].map((feature, index) => (
            <Card
              key={index}
              className="bg-gray-800 border border-gray-700 text-white text-center p-6 hover:shadow-xl transition"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
              <CardDescription className="text-gray-400 mt-2">{feature.desc}</CardDescription>
            </Card>
          ))}
        </section>
      </main>

      {/* Footer */}
      <footer className="text-center py-8 bg-gray-900 border-t border-gray-700">
        <p className="text-sm text-gray-400">
          © 2025 <span className="font-semibold text-white">Feednix</span>. All rights reserved.
        </p>
      </footer>
    </>
  );
};

export default Home;
