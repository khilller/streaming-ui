'use client'

import React, { useState, useRef, useEffect } from "react";
import { AI, ClientMessage } from "@/utils/action";
import { useActions, useUIState } from 'ai/rsc'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { UserMessage } from "@/components/chat/UserMessage";

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { continueConversation } = useActions();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage: ClientMessage = {
      id: Date.now(),
      role: 'user',
      display: input
    };

    setConversation(currentConversation => [...currentConversation, newMessage]);

    setInput('');
    
    const message = await continueConversation(input);
    setConversation(currentConversation => [
      ...currentConversation,
      message
    ]);
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
      <form className="bg-white p-4 flex items-center gap-2 border-t" onSubmit={handleSubmit}>
        <Input 
          className="flex-grow" 
          placeholder="Type your message..." 
          value={input} 
          onChange={(e) => setInput(e.target.value)}
        />
        <Button type="submit" className="bg-blue-500 hover:bg-blue-600">
          <Send className="h-5 w-5" />
        </Button>
      </form>
    </main>
  );
}