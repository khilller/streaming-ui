'use client'

import React, { useState } from "react";
import { AI } from "@/utils/action";
import { useActions, useUIState } from 'ai/rsc'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export default function Home() {
  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setInput('');
    setConversation(currentConversation => [
      ...currentConversation,
      <div key={currentConversation.length} className="flex justify-end">
        <div className="max-w-[70%] p-3 rounded-lg bg-blue-500 text-white rounded-br-none">
          {input}
        </div>
      </div>
    ]);
    
    const message = await submitUserMessage(input);
    setConversation(currentConversation => [
      ...currentConversation,
      <div key={currentConversation.length} className="flex justify-start">
        <div className="max-w-[70%] p-3 rounded-lg bg-white text-gray-800 rounded-bl-none">
          {message}
        </div>
      </div>
    ]);
  }

  return (
    <main className="min-h-screen flex flex-col bg-gray-100">
      <div className="grow flex flex-col gap-4 p-4 overflow-y-auto">
        {conversation}
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