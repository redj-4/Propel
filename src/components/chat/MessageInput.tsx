import React from 'react';
import {
  Send,
  RefreshCw,
  Mail,
  Edit3,
  Linkedin,
  Sparkles,
  FileText,
  Wand2
} from 'lucide-react';
import Button from '../common/Button';

interface MessageInputProps {
  step: 'intro' | 'resume' | 'goals' | 'recipient' | 'message';
  currentInput: string;
  setCurrentInput: (value: string) => void;
  onSubmit: () => void;
  onRegenerate?: () => void;
  messageType?: 'email' | 'cover-letter' | 'linkedin';
  setMessageType?: (type: 'email' | 'cover-letter' | 'linkedin') => void;
  tone?: 'professional' | 'casual' | 'enthusiastic';
  setTone?: (tone: 'professional' | 'casual' | 'enthusiastic') => void;
  isTyping: boolean;
  suggestedInputs?: string[];
}

const MAX_LENGTH = 500;

const MessageInput: React.FC<MessageInputProps> = ({
  step,
  currentInput,
  setCurrentInput,
  onSubmit,
  onRegenerate,
  messageType,
  setMessageType,
  tone,
  setTone,
  isTyping,
  suggestedInputs = []
}) => {
  // Set placeholder text based on step
  let placeholderText = 'Enter your message...';
  if (step === 'goals') {
    placeholderText = 'What industry are you interested in?';
  } else if (step === 'recipient') {
    placeholderText = 'Enter LinkedIn profile URL or job details...';
  } else if (step === 'message') {
    placeholderText = 'Enter your prompt for message generation...';
  }

  // Decide between textarea (for 'message') or input
  const renderInputField = () => {
    if (step === 'message') {
      return (
        <textarea
          className="w-full p-3 border border-gray-300 rounded-xl input-focus bg-white pr-12 resize-none text-sm"
          placeholder={placeholderText}
          value={currentInput}
          onChange={(e) => setCurrentInput(e.target.value)}
          onKeyDown={(e) => {
            // Submit on Enter if shift isn't held
            if (e.key === 'Enter' && !e.shiftKey && currentInput.trim()) {
              e.preventDefault();
              onSubmit();
            }
          }}
          maxLength={MAX_LENGTH}
          aria-label="Message input"
          rows={3}
        />
      );
    }
    return (
      <input
        type="text"
        className="w-full p-3 border border-gray-300 rounded-xl input-focus bg-white pr-12 text-sm"
        placeholder={placeholderText}
        value={currentInput}
        onChange={(e) => setCurrentInput(e.target.value)}
        onKeyPress={(e) => {
          if (e.key === 'Enter' && currentInput.trim()) {
            onSubmit();
          }
        }}
        maxLength={MAX_LENGTH}
        aria-label="Message input"
      />
    );
  };

  return (
    <div className="space-y-4">
      {/* Only show toggles in the message generation step */}
      {step === 'message' && setMessageType && setTone && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="message-type"
            >
              Message Type
            </label>
            <div className="flex space-x-2 mt-1" id="message-type">
              {(['email', 'cover-letter', 'linkedin'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setMessageType(type)}
                  className={`btn p-2 rounded-md text-xs font-medium transition-all ${
                    messageType === type
                      ? 'bg-primary-900 text-white'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-pressed={messageType === type}
                >
                  {type === 'email' && <Mail className="w-3 h-3 mr-1 inline-block" />}
                  {type === 'cover-letter' && <FileText className="w-3 h-3 mr-1 inline-block" />}
                  {type === 'linkedin' && <Linkedin className="w-3 h-3 mr-1 inline-block" />}
                  {type.split('-').map(
                    (word) => word.charAt(0).toUpperCase() + word.slice(1)
                  ).join(' ')}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label
              className="block text-sm font-medium text-gray-700"
              htmlFor="message-tone"
            >
              Message Tone
            </label>
            <div className="flex space-x-2 mt-1" id="message-tone">
              {(['professional', 'casual', 'enthusiastic'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`btn p-2 rounded-md text-xs font-medium transition-all ${
                    tone === t
                      ? 'bg-primary-900 text-white'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                  aria-pressed={tone === t}
                >
                  {t === 'professional' && <Edit3 className="w-3 h-3 mr-1 inline-block" />}
                  {t === 'casual' && <Wand2 className="w-3 h-3 mr-1 inline-block" />}
                  {t === 'enthusiastic' && <Sparkles className="w-3 h-3 mr-1 inline-block" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Input area */}
      <div className="flex space-x-3">
        <div className="flex-1 relative">
          {renderInputField()}
          {currentInput && (
            <button
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 text-sm"
              onClick={() => setCurrentInput('')}
              aria-label="Clear input"
            >
              ×
            </button>
          )}
        </div>
        <Button
          onClick={onSubmit}
          disabled={!currentInput.trim() || isTyping}
          variant="primary"
          icon={isTyping ? undefined : (step === 'message' ? Sparkles : Send)}
          isLoading={isTyping}
          aria-label={step === 'message' ? 'Generate' : 'Send'}
          // Apply smaller styling to the button
          className="text-sm px-4 py-2"
        >
          {isTyping
            ? step === 'message'
              ? 'Generating...'
              : 'Sending...'
            : step === 'message'
              ? 'Generate'
              : 'Send'}
        </Button>
      </div>

      {/* Character counter */}
      <div className="text-right text-xs text-gray-500">
        {currentInput.length} / {MAX_LENGTH}
      </div>

      {/* Remove the live preview area entirely */}
      {/* Regenerate button if applicable */}
      {step === 'message' && onRegenerate && (
        <div className="flex">
          <Button
            onClick={onRegenerate}
            disabled={isTyping}
            variant="outline"
            icon={RefreshCw}
            aria-label="Regenerate"
            className="text-sm px-4 py-2"
          >
            Regenerate
          </Button>
        </div>
      )}

      {/* Suggested inputs */}
      {suggestedInputs.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {suggestedInputs.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setCurrentInput(suggestion)}
              className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              aria-label={`Suggested: ${suggestion}`}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default MessageInput;
