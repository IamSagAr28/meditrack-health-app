import React, { useState } from 'react';
import { Button } from './button';
import { X, MessageSquare } from 'lucide-react';
import { Card } from './card';

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full p-4 shadow-lg bg-primary z-50"
        aria-label="Open chat"
      >
        <MessageSquare className="h-6 w-6" />
      </Button>

      {/* Chat window */}
      {isOpen && (
        <Card className="fixed bottom-20 right-4 w-[350px] sm:w-[400px] h-[600px] z-50 flex flex-col shadow-xl overflow-hidden">
          {/* Header */}
          <div className="p-3 border-b flex items-center justify-between bg-primary text-primary-foreground">
            <h3 className="font-medium">MediTrack Assistant</h3>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-foreground/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Iframe container */}
          <div className="flex-grow">
            <iframe
              src="https://meditrack-health-app-chatbotnew.onrender.com"
              title="MediTrack Chatbot"
              className="w-full h-full border-none"
              allow="microphone"
            />
          </div>
        </Card>
      )}
    </>
  );
}
