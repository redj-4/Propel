/**
 * Service for managing message generation and storage
 */

import { supabase } from '../supabase';
import { Message, MessageType } from '../types';
import { ERROR_MESSAGES } from '../constants';

export class MessageService {
  /**
   * Save a generated message
   * @throws {Error} If save fails
   */
  static async saveMessage(
    userId: string,
    resumeId: string,
    content: string,
    messageType: MessageType,
    recipientUrl?: string
  ): Promise<Message> {
    const { data, error } = await supabase
      .from('generated_messages')
      .insert({
        user_id: userId,
        resume_id: resumeId,
        content,
        message_type: messageType,
        recipient_url: recipientUrl,
        is_starred: false
      })
      .select()
      .single();

    if (error) {
      throw new Error(ERROR_MESSAGES.DATABASE.SAVE_FAILED);
    }

    return data;
  }

  /**
   * Get user's saved messages
   * @throws {Error} If fetch fails
   */
  static async getUserMessages(userId: string): Promise<Message[]> {
    const { data, error } = await supabase
      .from('generated_messages')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(ERROR_MESSAGES.DATABASE.LOAD_FAILED);
    }

    return data;
  }

  /**
   * Toggle message star status
   * @throws {Error} If update fails
   */
  static async toggleStar(messageId: string, isStarred: boolean): Promise<void> {
    const { error } = await supabase
      .from('generated_messages')
      .update({ is_starred: isStarred })
      .eq('id', messageId);

    if (error) {
      throw new Error(ERROR_MESSAGES.DATABASE.UPDATE_FAILED);
    }
  }

  /**
   * Delete a message
   * @throws {Error} If deletion fails
   */
  static async deleteMessage(messageId: string): Promise<void> {
    const { error } = await supabase
      .from('generated_messages')
      .delete()
      .eq('id', messageId);

    if (error) {
      throw new Error(ERROR_MESSAGES.DATABASE.DELETE_FAILED);
    }
  }
}