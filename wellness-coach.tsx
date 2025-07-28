import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Sparkles, MessageCircle } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import type { ChatMessage } from "@shared/schema";

interface WellnessCoachProps {
  userId: number;
  isExpanded?: boolean;
  onToggle?: () => void;
}

export default function WellnessCoach({ userId, isExpanded = false, onToggle }: WellnessCoachProps) {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  const { data: messages, isLoading } = useQuery<ChatMessage[]>({
    queryKey: ["/api/chat", userId],
    enabled: isExpanded
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (messageText: string) => {
      const response = await apiRequest("/api/chat", "POST", {
        userId,
        message: messageText,
        isFromUser: true,
        messageType: "general"
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", userId] });
      setMessage("");
    }
  });

  const generateGreetingMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest(`/api/chat/greeting/${userId}`, "POST");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat", userId] });
    }
  });

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || sendMessageMutation.isPending) return;

    setIsTyping(true);
    await sendMessageMutation.mutateAsync(message.trim());
    setIsTyping(false);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Generate initial greeting when chat is first expanded and no messages exist
    if (isExpanded && messages && messages.length === 0 && !isLoading) {
      generateGreetingMutation.mutate();
    }
  }, [isExpanded, messages, isLoading]);

  if (!isExpanded) {
    return (
      <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={onToggle}>
        <CardContent className="p-4">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10 bg-gradient-to-r from-purple-500 to-pink-500">
              <AvatarFallback className="flex h-full w-full items-center justify-center rounded-full text-white font-semibold bg-[#2b3245]">W</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">Wellness Coach</h3>
              <p className="text-sm text-gray-500">Your AI wellness companion</p>
            </div>
            <MessageCircle className="h-5 w-5 text-gray-400" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-96 flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8 bg-gradient-to-r from-purple-500 to-pink-500">
              <AvatarFallback className="text-white text-sm font-semibold">W</AvatarFallback>
            </Avatar>
            <CardTitle className="text-lg">Wellness Coach</CardTitle>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onToggle}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-4 pb-4">
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-500"></div>
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.isFromUser ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-3 py-2 ${
                      msg.isFromUser
                        ? "bg-primary text-white"
                        : "bg-gray-100 text-gray-900"
                    }`}
                  >
                    {!msg.isFromUser && (
                      <div className="flex items-center mb-1">
                        <Sparkles className="h-3 w-3 mr-1 text-purple-500" />
                        <span className="text-xs font-medium text-purple-600">Wellness</span>
                      </div>
                    )}
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {new Date(msg.timestamp!).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit',
                        hour12: true 
                      })}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Sparkles className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                <p className="text-sm">Your wellness coach is ready to help!</p>
              </div>
            )}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex space-x-2">
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask about your wellness..."
              className="flex-1"
              disabled={sendMessageMutation.isPending}
            />
            <Button 
              type="submit" 
              size="sm"
              disabled={!message.trim() || sendMessageMutation.isPending}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}