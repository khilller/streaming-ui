'use client'

import Image from "next/image";
import { useState } from "react";
import { AI } from "@/utils/action";
import { useActions, useUIState } from 'ai/rsc'




export default function Home() {

  const [input, setInput] = useState<string>('');
  const [conversation, setConversation] = useUIState<typeof AI>();
  const { submitUserMessage } = useActions();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setInput('');
    setConversation(currentConversation => [
      ...currentConversation,
      <div>{input}</div>
    ]);
    const message = await submitUserMessage(input);
    setConversation(currentConversation => [
      ...currentConversation,
      message
    ]);
  }


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {conversation.map((message, i)=> (
          <div key={i}>{message}</div>
        ))}
      </div>
      <div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="border border-gray-300 rounded p-2"
          />
          <button>Send Message</button>
        </form>
      </div>
    </main>
  );
}
