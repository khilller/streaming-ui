'use client'

import React, { useState, useRef, useEffect } from "react";
import { AI, ClientMessage } from "@/utils/action";
import { useActions, useUIState } from 'ai/rsc'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send, RefreshCw } from "lucide-react";
import { UserMessage } from "@/components/chat/UserMessage";
import { useRouter } from 'next/navigation';

const exampleMessages = [
  {
    heading: 'What are the',
    subheading: 'ingredients for Butter Chicken?',
    message: 'What are the ingredients for Butter Chicken?'
  },
  {
    heading: 'Whats a good ',
    subheading: 'recipes for tomatoes?',
    message: 'Whats a good recipe using tomatoes?'
  },
  {
    heading: 'What is a good',
    subheading: 'vegetarian recipe?',
    message: 'What is a good vegetarian recipe?'
  },
  {
    heading: 'Can you suggest',
    subheading: 'an easy Indian recipe?',
    message: 'Can you suggest an easy Indian recipe?'
  }
];

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { continueConversation } = useActions();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage(input);
  }

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const newMessage: ClientMessage = {
      id: Date.now(),
      role: 'user',
      display: message
    };

    setConversation(currentConversation => [...currentConversation, newMessage]);
    setInput('');
    
    const response = await continueConversation(message);
    setConversation(currentConversation => [
      ...currentConversation,
      response
    ]);
  }

  const handleExampleClick = (message: string) => {
    sendMessage(message);
  }

  const handleRefresh = () => {
    setConversation([]);
    setInput('');
  }

  return (
    <main className="h-screen flex flex-col bg-gray-100">
      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex flex-col gap-4">
          {conversation.map((message, i) => (
            <div key={i} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[70%] p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-white text-gray-800 rounded-bl-none'
              }`}>
                {message.display}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <div className="bg-white border-t">
        {conversation.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            {exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className={`cursor-pointer rounded-lg border bg-white p-4 hover:bg-zinc-50 dark:bg-zinc-950 dark:hover:bg-zinc-900 ${
                  index > 1 ? 'hidden md:block' : ''
                }`}
                onClick={() => handleExampleClick(example.message)}
              >
                <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{example.heading}</h3>
                <p className="text-zinc-500 dark:text-zinc-400">{example.subheading}</p>
              </div>
            ))}
          </div>
        )}
        <form className="p-4 flex items-center gap-2" onSubmit={handleSubmit}>
          <Input 
            className="flex-grow" 
            placeholder="Type your message..." 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
            <Send className="h-5 w-5" />
          </Button>
          <Button type="button" onClick={handleRefresh} className="bg-gray-200 hover:bg-gray-300">
            <RefreshCw className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </main>
  );
}