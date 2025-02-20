import React from 'react';
import { Rocket, Copy, Send, Save, Star, StarOff, Edit3 } from 'lucide-react';
import Button from '../common/Button';

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  messageType?: 'email' | 'cover-letter' | 'linkedin';
  tone?: 'professional' | 'casual' | 'enthusiastic';
  isStarred?: boolean;
}

interface MessageListProps {
  messages: Message[];
  isTyping: boolean;
  onCopy?: (content: string) => void;
  onSave?: (content: string) => void;
  onSend?: (content: string) => void;
  onStar?: (id: string, isStarred: boolean) => void;
  onEdit?: (id: string) => void;
}

const MessageList: React.FC<MessageListProps> = ({ 
  messages, 
  isTyping,
  onCopy,
  onSave,
  onSend,
  onStar,
  onEdit
}) => {
  return (
    <div className="space-y-6">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div 
            className={`chat-bubble ${
              message.type === 'user' 
                ? 'chat-bubble-user' 
                : 'chat-bubble-ai'
            }`}
          >
            {message.type === 'ai' && (
              <div className="absolute -left-12 top-0 p-2 rounded-full bg-primary-50">
                <Rocket className="w-6 h-6 text-primary-900" />
              </div>
            )}
            <div className="prose max-w-none">
              {message.content.split('\n').map((line, i) => (
                <p key={i} className="mb-2 last:mb-0">
                  {line}
                </p>
              ))}
            </div>
            {message.type === 'ai' && message.messageType && (
              <div className="mt-4 flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Copy}
                  onClick={() => onCopy?.(message.content)}
                >
                  Copy
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Send}
                  onClick={() => onSend?.(message.content)}
                >
                  {message.messageType === 'linkedin' ? 'Open LinkedIn' : 'Send Email'}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  icon={Save}
                  onClick={() => onSave?.(message.content)}
                >
                  Save
                </Button>
                {onStar && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={message.isStarred ? Star : StarOff}
                    onClick={() => onStar(message.id, !message.isStarred)}
                  >
                    {message.isStarred ? 'Unstar' : 'Star'}
                  </Button>
                )}
                {onEdit && (
                  <Button
                    variant="secondary"
                    size="sm"
                    icon={Edit3}
                    onClick={() => onEdit(message.id)}
                  >
                    Edit
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
      {isTyping && (
        <div className="flex justify-start">
          <div className="chat-bubble-ai">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageList;