/**
 * Service for managing resume uploads and processing
 */

import { supabase } from '../supabase';
import { Resume } from '../types';
import { ERROR_MESSAGES } from '../constants';

export class ResumeService {
  /**
   * Create a new resume record
   * @throws {Error} If creation fails
   */
  static async createResume(
    userId: string,
    content: string,
    filePath?: string
  ): Promise<Resume> {
    const { data, error } = await supabase
      .from('resumes')
      .insert({
        user_id: userId,
        content,
        file_path: filePath,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (error) {
      throw new Error(ERROR_MESSAGES.DATABASE.SAVE_FAILED);
    }

    return data;
  }

  /**
   * Get user's resumes
   * @throws {Error} If fetch fails
   */
  static async getUserResumes(userId: string): Promise<Resume[]> {
    const { data, error } = await supabase
      .from('resumes')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(ERROR_MESSAGES.DATABASE.LOAD_FAILED);
    }

    return data;
  }

  /**
   * Delete a resume
   * @throws {Error} If deletion fails
   */
  static async deleteResume(resumeId: string): Promise<void> {
    const { error } = await supabase
      .from('resumes')
      .delete()
      .eq('id', resumeId);

    if (error) {
      throw new Error(ERROR_MESSAGES.DATABASE.DELETE_FAILED);
    }
  }
}