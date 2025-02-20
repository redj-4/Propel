/**
 * Custom hook for managing messages
 */

import { useState, useCallback } from 'react';
import { MessageService } from '../services/message.service';
import { Message, MessageType } from '../types';
import { toast } from 'react-hot-toast';

export const useMessages = (userId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  const loadMessages = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    try {
      const data = await MessageService.getUserMessages(userId);
      setMessages(data);
    } catch (error) {
      toast.error('Failed to load messages');
      console.error('Error loading messages:', error);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const saveMessage = useCallback(async (
    resumeId: string,
    content: string,
    messageType: MessageType,
    recipientUrl?: string
  ) => {
    if (!userId) return null;

    try {
      const message = await MessageService.saveMessage(
        userId,
        resumeId,
        content,
        messageType,
        recipientUrl
      );
      setMessages(prev => [message, ...prev]);
      return message;
    } catch (error) {
      toast.error('Failed to save message');
      console.error('Error saving message:', error);
      return null;
    }
  }, [userId]);

  const toggleStar = useCallback(async (messageId: string, isStarred: boolean) => {
    try {
      await MessageService.toggleStar(messageId, isStarred);
      setMessages(prev =>
        prev.map(m =>
          m.id === messageId ? { ...m, is_starred: isStarred } : m
        )
      );
      toast.success(isStarred ? 'Message starred' : 'Message unstarred');
    } catch (error) {
      toast.error('Failed to update message');
      console.error('Error updating message:', error);
    }
  }, []);

  const deleteMessage = useCallback(async (messageId: string) => {
    try {
      await MessageService.deleteMessage(messageId);
      setMessages(prev => prev.filter(m => m.id !== messageId));
      toast.success('Message deleted');
    } catch (error) {
      toast.error('Failed to delete message');
      console.error('Error deleting message:', error);
    }
  }, []);

  return {
    messages,
    loading,
    loadMessages,
    saveMessage,
    toggleStar,
    deleteMessage
  };
};