import React, { useState, useEffect, useRef } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { useAI } from '../lib/hooks/useAI';
import { useMessages } from '../lib/hooks/useMessages';
import { ResumeService } from '../lib/services/resume.service';

import Navbar from '../components/layout/Navbar';
import ProgressTracker from '../components/chat/ProgressTracker';
import MessageList from '../components/chat/MessageList';
import MessageInput from '../components/chat/MessageInput';
import ResumeUpload from '../components/chat/ResumeUpload';
import AuthModal from '../components/auth/AuthModal';

type Step = 'intro' | 'resume' | 'goals' | 'recipient' | 'message';
type MessageType = 'email' | 'cover-letter' | 'linkedin';
type MessageTone = 'professional' | 'casual' | 'enthusiastic';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  messageType?: MessageType;
  isStarred?: boolean;
}

const ChatApp = () => {
  const { user, isGuest, guestMessagesLeft, decrementGuestMessages } = useAuth();
  const { generateMessage, analyzeJobMatch } = useAI();
  const { saveMessage, toggleStar } = useMessages(user?.id || null);
  
  // Start at 'resume' so we only show the upload first
  const [step, setStep] = useState<Step>('resume');
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentInput, setCurrentInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [resume, setResume] = useState<string | null>(null);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [messageType, setMessageType] = useState<MessageType>('email');
  const [messageTone, setMessageTone] = useState<MessageTone>('professional');
  const [showAuthModal, setShowAuthModal] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Helper to add an AI message
  const addAIMessage = async (content: string, delay = 500) => {
    setIsTyping(true);
    await new Promise(resolve => setTimeout(resolve, delay));
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'ai', content }
    ]);
    setIsTyping(false);
  };

  // Handle resume upload
  const handlePdfUpload = async (file: File) => {
    setIsLoading(true);
    setFileName(file.name);

    try {
      // Simulate PDF processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (user) {
        try {
          const resumeData = await ResumeService.createResume(
            user.id,
            'Sample resume content',
            file.name
          );
          setResumeId(resumeData.id);
        } catch (error) {
          console.error('Failed to save resume:', error);
          setResumeId(crypto.randomUUID());
        }
      } else {
        setResumeId(crypto.randomUUID());
      }
      
      setResume('Sample resume content');
      
      // After uploading, set the step to 'goals'
      setStep('goals');
      
      // Now that we have a resume, add an AI welcome or "next-step" message
      await addAIMessage(`Thanks for sharing your resume! I've analyzed it and noticed your experience in software development and project management.

What type of role are you targeting? For example:
• Software Engineering
• Product Management
• Data Science
• Marketing
• Finance

Or tell me about your ideal role!`);
      
    } catch (error) {
      toast.error('Error processing PDF. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Drag & drop events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') {
      handlePdfUpload(file);
    } else {
      toast.error('Please upload a PDF file');
    }
  };

  // User has specified career goals
  const handleCareerGoalSubmit = async (goal: string) => {
    setMessages(prev => [
      ...prev,
      { id: Date.now().toString(), type: 'user', content: goal }
    ]);

    await addAIMessage(`Great choice! ${goal} is a growing field with lots of opportunities.

Now, let's personalize your outreach. Please provide:

1. A LinkedIn profile URL of someone you'd like to connect with, or
2. A specific job posting you're interested in

This helps me tailor the message to make a strong connection.`);
    
    setStep('recipient');
    setCurrentInput('');
  };

  // Generate a new message using AI
  const handleGenerate = async () => {
    if (!resume) {
      toast.error('Please upload your resume first');
      return;
    }
    if (isGuest && guestMessagesLeft <= 0) {
      setShowAuthModal(true);
      toast.error('You have used all your guest messages. Please sign up to continue.');
      return;
    }
    setIsTyping(true);
    try {
      const generatedContent = await generateMessage(
        resume,
        currentInput,
        messageType,
        messageTone
      );
      if (!generatedContent) throw new Error('Failed to generate message');

      if (isGuest) decrementGuestMessages();

      if (user && resumeId) {
        try {
          await saveMessage(resumeId, generatedContent, messageType, currentInput);
        } catch (error) {
          console.error('Failed to save message:', error);
        }
      }

      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), type: 'user', content: currentInput },
        { id: (Date.now() + 1).toString(), type: 'ai', content: generatedContent, messageType }
      ]);
      setStep('message');

      if (isGuest && guestMessagesLeft <= 1) {
        toast.success('Sign up to unlock unlimited message generation!', { duration: 5000, icon: '🚀' });
      }

      // Analyze job match if a job posting was provided
      if (currentInput.toLowerCase().includes('job') || currentInput.toLowerCase().includes('position')) {
        const analysis = await analyzeJobMatch(resume, currentInput);
        if (analysis) {
          await addAIMessage(`
I've analyzed your resume against this job posting:

Match Score: ${analysis.score}%

Missing Keywords:
${analysis.missingKeywords.map(kw => `• ${kw}`).join('\n')}

Recommendations:
${analysis.recommendations.map(rec => `• ${rec}`).join('\n')}

Would you like me to help you optimize your resume for this role?`);
        }
      }
    } catch (error: any) {
      toast.error(error.message || 'Error generating message');
    } finally {
      setIsTyping(false);
      setCurrentInput('');
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  // Star/unstar messages
  const handleStarMessage = async (id: string, isStarred: boolean) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    try {
      await toggleStar(id, isStarred);
      setMessages(prev =>
        prev.map(m => (m.id === id ? { ...m, isStarred } : m))
      );
    } catch (error) {
      toast.error('Failed to update message');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Toaster position="top-right" />
      <Navbar showDemoWarning={!import.meta.env.VITE_OPENAI_API_KEY} variant="app" />

      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        {/* If you want to greet the user at the top, you can keep this or remove it */}
        {user && user.displayName && (
          <div className="mt-4 text-xl font-semibold text-gray-800">
            Welcome back, {user.displayName}!
          </div>
        )}

        <ProgressTracker currentStep={step} />

        {isGuest && (
          <div className="bg-primary-50 border border-primary-200 rounded-lg p-4 my-6">
            <p className="text-primary-900 font-medium">
              Guest Mode: {guestMessagesLeft} message{guestMessagesLeft !== 1 ? 's' : ''} remaining
            </p>
            <p className="text-primary-600 text-sm mt-1">
              Sign up to unlock unlimited message generation!
            </p>
          </div>
        )}

        <div className="flex-1 flex flex-col min-h-0 py-6">
          {/* 
            If no resume is uploaded and we're on the 'resume' step, 
            ONLY show the resume upload component. 
            Otherwise, show the chat interface. 
          */}
          {step === 'resume' && !resume ? (
            <div 
              className={`p-4 border rounded-lg ${isDragging ? 'border-blue-400 border-dashed bg-blue-50' : 'border-gray-300'}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <ResumeUpload
                onUpload={handlePdfUpload}
                isLoading={isLoading}
                fileName={fileName}
                isDragging={isDragging}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              />
            </div>
          ) : (
            <>
              {/* Chat interface: messages, input, etc. */}
              <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto custom-scrollbar space-y-6 mb-6 transition-all duration-300 ease-in-out"
              >
                <MessageList
                  messages={messages}
                  isTyping={isTyping}
                  onCopy={(content) => {
                    navigator.clipboard.writeText(content);
                    toast.success(
                      user && user.displayName
                        ? `Copied to clipboard, ${user.displayName}!`
                        : 'Copied to clipboard!'
                    );
                  }}
                  onSave={async (content) => {
                    if (!user && !isGuest) {
                      setShowAuthModal(true);
                      return;
                    }
                    toast.success('Message saved!');
                  }}
                  onSend={(content) => {
                    if (messageType === 'linkedin') {
                      window.open('https://linkedin.com/messaging', '_blank');
                    } else {
                      window.location.href = `mailto:?body=${encodeURIComponent(content)}`;
                    }
                  }}
                  onStar={handleStarMessage}
                />
                <div ref={messagesEndRef} />
              </div>

              <div className="mt-auto pt-4 bg-white">
                <MessageInput
                  step={step}
                  currentInput={currentInput}
                  setCurrentInput={setCurrentInput}
                  onSubmit={
                    step === 'goals'
                      ? () => handleCareerGoalSubmit(currentInput)
                      : (step === 'recipient' || step === 'message')
                      ? handleGenerate
                      : () => {}
                  }
                  onRegenerate={step === 'message' ? handleRegenerate : undefined}
                  messageType={messageType}
                  setMessageType={setMessageType}
                  tone={messageTone}
                  setTone={setMessageTone}
                  isTyping={isTyping}
                  suggestedInputs={
                    step === 'goals'
                      ? ['Software Engineering', 'Data Science', 'Product Management', 'Marketing', 'Finance']
                      : undefined
                  }
                />
              </div>
            </>
          )}
        </div>
      </div>

      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
};

export default ChatApp;
