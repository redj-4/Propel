import React from 'react';
import { Send, RefreshCw, Mail, Edit3, Linkedin, Sparkles, FileText, Zap, Wand2 } from 'lucide-react';
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
  if (step === 'message' && setMessageType && setTone) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Message Type
            </label>
            <div className="flex-1 grid grid-cols-3 gap-4">
              {(['email', 'cover-letter', 'linkedin'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setMessageType(type)}
                  className={`btn p-4 rounded-xl text-sm font-medium transition-all ${
                    messageType === type
                      ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {type === 'email' && <Mail className="w-4 h-4 mr-2 inline-block" />}
                  {type === 'cover-letter' && <FileText className="w-4 h-4 mr-2 inline-block" />}
                  {type === 'linkedin' && <Linkedin className="w-4 h-4 mr-2 inline-block" />}
                  {type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Message Tone
            </label>
            <div className="flex-1 grid grid-cols-3 gap-4">
              {(['professional', 'casual', 'enthusiastic'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`btn p-4 rounded-xl text-sm font-medium transition-all ${
                    tone === t
                      ? 'bg-primary-900 text-white shadow-lg shadow-primary-900/20'
                      : 'bg-white text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {t === 'professional' && <Edit3 className="w-4 h-4 mr-2 inline-block" />}
                  {t === 'casual' && <Wand2 className="w-4 h-4 mr-2 inline-block" />}
                  {t === 'enthusiastic' && <Sparkles className="w-4 h-4 mr-2 inline-block" />}
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="flex space-x-4">
          <Button
            onClick={onSubmit}
            disabled={isTyping}
            variant="primary"
            icon={isTyping ? undefined : Sparkles}
            isLoading={isTyping}
          >
            {isTyping ? 'Generating...' : 'Generate Message'}
          </Button>
          {onRegenerate && (
            <Button
              onClick={onRegenerate}
              disabled={isTyping}
              variant="outline"
              icon={RefreshCw}
            >
              Regenerate
            </Button>
          )}
        </div>
        <div className="flex space-x-4 mt-4">
          <Button
            variant="secondary"
            size="sm"
            icon={Zap}
            onClick={() => setCurrentInput(currentInput + ' (Make it more concise)')}
          >
            Make it More Concise
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Sparkles}
            onClick={() => setCurrentInput(currentInput + ' (Make it more enthusiastic)')}
          >
            More Enthusiastic
          </Button>
          <Button
            variant="secondary"
            size="sm"
            icon={Edit3}
            onClick={() => setCurrentInput(currentInput + ' (Emphasize technical skills)')}
          >
            Emphasize Skills
          </Button>
        </div>
      </div>
    );
  }

  if (step === 'goals' || step === 'recipient') {
    return (
      <div className="space-y-4">
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <input
              type="text"
              className="w-full p-4 border border-gray-300 rounded-xl input-focus bg-white pr-12"
              placeholder={
                step === 'goals'
                  ? "What industry are you interested in?"
                  : "Enter LinkedIn profile URL or job details..."
              }
              value={currentInput}
              onChange={(e) => setCurrentInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && currentInput.trim()) {
                  onSubmit();
                }
              }}
            />
            {currentInput && (
              <button
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                onClick={() => setCurrentInput('')}
              >
                ×
              </button>
            )}
          </div>
          <Button
            onClick={onSubmit}
            disabled={!currentInput.trim()}
            variant="primary"
            icon={Send}
          >
            Send
          </Button>
        </div>
        {suggestedInputs.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {suggestedInputs.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => setCurrentInput(suggestion)}
                className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  return null;
};

export default MessageInput;