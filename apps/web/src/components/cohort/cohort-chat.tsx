"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MessageSquare, 
  Send, 
  Users,
  Smile
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ChatMessage {
  id: string;
  cohortId: string;
  userId: string;
  content: string;
  timestamp: Date;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface CohortChatProps {
  cohortId: string;
  messages: ChatMessage[];
  isMember: boolean;
}

/**
 * Cohort chat component
 * Provides real-time messaging for cohort members
 */
export function CohortChat({ cohortId, messages, isMember }: CohortChatProps) {
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || isLoading) return;

    setIsLoading(true);
    try {
      // TODO: Implement actual message sending
      console.log("Sending message:", newMessage);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setNewMessage("");
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserDisplayName = (userId: string) => {
    // TODO: Get actual user names from user data
    return `User ${userId.slice(-4)}`;
  };

  const getUserInitials = (userId: string) => {
    return userId.slice(-2).toUpperCase();
  };

  if (!isMember) {
    return (
      <Card className="rounded-none sm:rounded-lg">
        <CardContent className="p-12 text-center">
          <MessageSquare className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-900 mb-2">Join to participate in chat</h3>
          <p className="text-slate-600">
            You need to be a member of this cohort to view and send messages.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <Card>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Chat</h2>
              <p className="text-slate-600">Connect with your cohort members</p>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Users className="h-4 w-4" />
              <span>{messages.length} messages</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chat Messages */}
      <Card className="h-96 rounded-none sm:rounded-lg">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Messages</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-80 px-6">
            {messages.length > 0 ? (
              <div className="space-y-4 pb-4">
                {messages
                  .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
                  .map((message) => (
                    <div key={message.id} className="flex gap-3">
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarImage src={message.user?.avatar} />
                        <AvatarFallback className="text-xs">
                          {getUserInitials(message.userId)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-medium text-slate-900 text-sm">
                            {message.user?.name || getUserDisplayName(message.userId)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {formatDistanceToNow(message.timestamp)} ago
                          </span>
                        </div>
                        <p className="text-slate-700 text-sm leading-relaxed">
                          {message.content}
                        </p>
                      </div>
                    </div>
                  ))}
                <div ref={messagesEndRef} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-center">
                <MessageSquare className="h-12 w-12 text-slate-400 mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No messages yet</h3>
                <p className="text-slate-600">
                  Start the conversation with your cohort members!
                </p>
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Message Input */}
      <Card className="rounded-none sm:rounded-lg">
        <CardContent className="p-4">
          <form onSubmit={handleSendMessage} className="flex gap-3">
            <div className="flex-1">
              <Input
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type your message..."
                disabled={isLoading}
                className="border-slate-200 focus:border-primary-500"
              />
            </div>
            <Button 
              type="submit" 
              disabled={!newMessage.trim() || isLoading}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </form>
          
          <div className="flex items-center justify-between mt-3 text-xs text-slate-500">
            <div className="flex items-center gap-4">
              <span>Press Enter to send</span>
              <span>•</span>
              <span>Messages are visible to all cohort members</span>
            </div>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Smile className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
