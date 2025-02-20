import React, { useEffect, useRef } from 'react';
import { useChat } from '../../lib/hooks/useChat';
import { useAI } from '../../lib/hooks/useAI';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ProgressTracker from './ProgressTracker';
import ResumeUpload from './ResumeUpload';
import Button from '../common/Button';
import { Rocket, RefreshCcw } from 'lucide-react';
import { toast } from 'react-hot-toast';

const EnhancedChat: React.FC = () => {
  const {
    messages,
    session,
    loading: chatLoading,
    sendMessage,
    updateContext,
    updateStep,
    resetSession
  } = useChat();

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
      await sendMessage(currentInput);
      setCurrentInput('');

      // Generate AI response based on current step
      if (session?.current_step === 'goals') {
        await updateContext({ careerGoal: currentInput });
        await updateStep('recipient');
        
        const response = `Great choice! ${currentInput} is a growing field with lots of opportunities.

Now, let's personalize your outreach. Please provide:

1. A LinkedIn profile URL of someone you'd like to connect with, or
2. A specific job posting you're interested in

This helps me tailor the message to make a strong connection.`;
        
        await sendMessage(response, 'assistant');
      } else if (session?.current_step === 'recipient') {
        await updateContext({ recipient: currentInput });
        await updateStep('message');
        
        // Generate the actual message
        const generatedMessage = await generateMessage(
          session.context.resume || '',
          currentInput,
          messageType,
          messageTone
        );

        if (generatedMessage) {
          await sendMessage(generatedMessage, 'assistant');
        }
      }
    } catch (error) {
      console.error('Message error:', error);
      toast.error('Failed to process message');
    }
  };

  const handleRegenerate = async () => {
    if (!session?.context.recipient) return;

    try {
      const generatedMessage = await generateMessage(
        session.context.resume || '',
        session.context.recipient,
        messageType,
        messageTone
      );

      if (generatedMessage) {
        await sendMessage(generatedMessage, 'assistant');
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
        <ProgressTracker
          currentStep={session?.current_step as any || 'intro'}
        />
        <Button
          variant="secondary"
          size="sm"
          icon={RefreshCcw}
          onClick={handleReset}
        >
          New Message
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 mb-6">
        <MessageList
          messages={messages}
          isTyping={chatLoading || aiLoading}
          onCopy={(content) => {
            navigator.clipboard.writeText(content);
            toast.success('Copied to clipboard');
          }}
          onSend={(content) => {
            if (messageType === 'linkedin') {
              window.open('https://linkedin.com/messaging', '_blank');
            } else {
              window.location.href = `mailto:?body=${encodeURIComponent(content)}`;
            }
          }}
        />
        <div ref={messagesEndRef} />
      </div>

      <div className="mt-auto">
        {session?.current_step === 'resume' && !session.context.resume && (
          <ResumeUpload
            onUpload={async (content) => {
              await updateContext({ resume: content });
              await updateStep('goals');
              await sendMessage(
                `Thanks for sharing your resume! I've analyzed it and noticed your experience in software development and project management.

What type of role are you targeting? For example:
• Software Engineering
• Product Management
• Data Science
• Marketing
• Finance

Or tell me about your ideal role!`,
                'assistant'
              );
            }}
            isLoading={chatLoading}
            fileName=""
            isDragging={false}
            onDragOver={() => {}}
            onDragLeave={() => {}}
            onDrop={() => {}}
          />
        )}

        <MessageInput
          step={session?.current_step as any || 'intro'}
          currentInput={currentInput}
          setCurrentInput={setCurrentInput}
          onSubmit={handleSendMessage}
          onRegenerate={session?.current_step === 'message' ? handleRegenerate : undefined}
          messageType={messageType}
          setMessageType={setMessageType}
          tone={messageTone}
          setTone={setMessageTone}
          isTyping={chatLoading || aiLoading}
        />
      </div>
    </div>
  );
};

export default EnhancedChat;