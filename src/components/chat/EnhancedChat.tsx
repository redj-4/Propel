import React, { useEffect, useRef } from 'react';
import { useChat } from '../../lib/hooks/useChat';
import { useAI } from '../../lib/hooks/useAI';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import Button from '../common/Button';
import { RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface EnhancedChatProps {
  resumeData?: any;
}

const EnhancedChat: React.FC<EnhancedChatProps> = ({ resumeData }) => {
  const { messages, sendMessage, resetSession } = useChat();
  const { generateMessage, loading: aiLoading } = useAI();
  const [currentInput, setCurrentInput] = React.useState('');
  const [messageType, setMessageType] = React.useState<'email' | 'cover-letter' | 'linkedin'>('email');
  const [messageTone, setMessageTone] = React.useState<'professional' | 'casual' | 'enthusiastic'>('professional');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!currentInput.trim()) return;
    try {
      // Send the user's message
      await sendMessage(currentInput);
      setCurrentInput('');

      // Generate an AI response using the resume context
      const aiResponse = await generateMessage(resumeData, currentInput, messageType, messageTone);
      if (aiResponse) {
        await sendMessage(aiResponse, 'assistant');
      }
    } catch (error) {
      console.error('Message error:', error);
      toast.error('Failed to process message');
    }
  };

  const handleRegenerate = async () => {
    try {
      const aiResponse = await generateMessage(resumeData, currentInput, messageType, messageTone);
      if (aiResponse) {
        await sendMessage(aiResponse, 'assistant');
      }
    } catch (error) {
      console.error('Regenerate error:', error);
      toast.error('Failed to regenerate message');
    }
  };

  const handleReset = async () => {
    await resetSession();
    toast.success('Started new conversation');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Live Career Coach Chat</h2>
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCcw}
          onClick={handleReset}
        >
          New Conversation
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 mb-6">
        <MessageList
          messages={messages}
          isTyping={aiLoading}
          onCopy={(content) => {
            navigator.clipboard.writeText(content);
            toast.success('Copied to clipboard');
          }}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto">
        <MessageInput
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          onSubmit={handleSendMessage}
          onRegenerate={handleRegenerate}
          messageType={messageType}
          setMessageType={setMessageType}
          tone={messageTone}
          setTone={setMessageTone}
          isTyping={aiLoading}
        />
      </div>
    </div>
  );
};

export default EnhancedChat;
