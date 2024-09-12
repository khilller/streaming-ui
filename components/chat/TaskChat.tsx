'use client'

import React, { useState, useRef, useEffect } from "react"
import { AI, ClientMessage, ServerMessage } from '@/utils/action'
import { useActions, useUIState } from "ai/rsc"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Send, RefreshCw, Plus } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"


const exampleMessages = [
    {
      heading: "What can",
      subheading: "you do?",
      message: "What can you do?"
    },
    {
      heading: "What are all ",
      subheading: "my tasks?",
      message: "What are all my tasks?"
    },
    {
      heading: "Add a new task",
      subheading: "Create a new facade render of the building",
      message: "Create a new facade render of the building."
    },
    {
      heading: "Delete a task",
      subheading: "for a modern office building",
      message: "Delete the task for a modern office building."
    }
]


export default function TaskChat() {
    const [input, setInput] = useState<string>("")
    const [conversation, setConversation] = useUIState<typeof AI>()
    const { getTasks } = useActions()
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const router = useRouter()
    const { toast } = useToast()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [conversation])

    useEffect(() => {
      // Reset conversation and input when the component mounts
      setConversation([]);
      setInput('');
    }, []);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(),
        await sendMessage(input)

    }

    const sendMessage = async (message: string) => {
        if(!message) return

        const newMessage: ClientMessage = {
            id: Date.now(),
            role: "user",
            display: message
        }

        setConversation(currentConversation => [...currentConversation, newMessage])
        setInput("")

        try {
          
          const response = await getTasks(message)
          setConversation(currentConversation => [...currentConversation, response])
          
        } catch (error) {
          console.error('Failed to send message:', error)
          toast({
            variant: "destructive",
            title: "Error",
            description: "An error occurred. Please try again.",
            duration: 5000,
          })
        }

        //const response = await continueConversation(message)

    }

    const handleExampleClick = async (message: string) => {
        await sendMessage(message)
    }

    const handleRefresh = () => {
        window.location.reload()
        setConversation([])
        setInput("")
    }

return (
  <main className="flex flex-col bg-white">
    <div className="flex-grow overflow-y-auto p-4">
      <div className="max-w-2xl mx-auto mb-20"> {/* Added bottom margin to prevent content from being hidden behind the input */}
        {conversation.length === 0 && (
          <div className="mb-8 bg-gray-100 rounded-lg p-6 shadow-md">
            <h2 className="text-2xl font-bold mb-2 text-black">Welcome to OfficeLens!</h2>
            <p className="text-gray-600">This is an intelligent assistant designed to streamline your workday. OfficeLens can help with:</p>
        <ul className="list-disc list-inside text-gray-600 mt-2 space-y-1">
          <li>Day-to-day information gathering and research</li>
          <li>Answering questions about architectural details</li>
          <li>Assisting with image renders</li>
          <li>Offering quick explanations of industry terms or concepts</li>
        </ul>
        <p className="text-gray-600 mt-2">
          Simply type your question or request, and OfficeLens will provide you with accurate, relevant information to boost your productivity and make your workday easier.
        </p>
          </div>
        )}
        <div className="flex flex-col gap-4 mb-4">
          {conversation.map((message, i) => (
            message && message.role ? (
              <div key={i} className={`flex p-4 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[90%] p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  {message.display}
                </div>
              </div>
            ) : null
          ))}
        </div>
        {conversation.length === 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
            {exampleMessages.map((example, index) => (
              <div
                key={example.heading}
                className="cursor-pointer rounded-lg border shadow-md border-gray-200 bg-white p-4 hover:bg-gray-50"
                onClick={() => handleExampleClick(example.message)}
              >
                <h3 className="font-semibold text-black">{example.heading}</h3>
                <p className="text-gray-600">{example.subheading}</p>
              </div>
            ))}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
    <div className="border-t border-gray-200 bg-white fixed bottom-0 left-0 right-0">
      <div className="max-w-2xl mx-auto relative">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="absolute left-7 top-1/2 transform -translate-y-1/2 size-7 rounded-full bg-background p-0"
                onClick={handleRefresh}
                >
                <Plus size={16} />
                <span className="sr-only">New Chat</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <form className="p-4 flex items-center gap-2" onSubmit={handleSubmit}>
          <Input 
            className="flex-grow bg-white border-gray-300 pl-12" // Added left padding to accommodate the new button
            placeholder="Send a message" 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
          />
          <Button type="submit" className="bg-primary text-white hover:bg-gray-800">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  </main>
);
}
