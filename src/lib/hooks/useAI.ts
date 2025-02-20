/**
 * Custom hook for AI-powered features
 */

import { useState, useCallback } from 'react';
import { AIService } from '../services/ai.service';
import { JobApplication, Message } from '../types';
import { toast } from 'react-hot-toast';

export const useAI = () => {
  const [loading, setLoading] = useState(false);

  const generateMessage = useCallback(async (
    resume: string,
    recipientInfo: string,
    messageType: 'email' | 'cover-letter' | 'linkedin',
    tone: 'professional' | 'casual' | 'enthusiastic' = 'professional'
  ) => {
    setLoading(true);
    try {
      const message = await AIService.generateMessage(
        resume,
        recipientInfo,
        messageType,
        tone
      );
      return message;
    } catch (error: any) {
      toast.error(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzeJobMatch = useCallback(async (
    resume: string,
    jobDescription: string
  ) => {
    setLoading(true);
    try {
      const analysis = await AIService.analyzeJobMatch(resume, jobDescription);
      return analysis;
    } catch (error: any) {
      toast.error('Failed to analyze job match');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateFollowUp = useCallback(async (
    application: JobApplication,
    previousMessage?: Message
  ) => {
    setLoading(true);
    try {
      const message = await AIService.generateFollowUp(application, previousMessage);
      return message;
    } catch (error: any) {
      toast.error('Failed to generate follow-up message');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecommendations = useCallback(async (userId: string) => {
    setLoading(true);
    try {
      const recommendations = await AIService.getRecommendations(userId);
      return recommendations;
    } catch (error: any) {
      toast.error('Failed to get recommendations');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    generateMessage,
    analyzeJobMatch,
    generateFollowUp,
    getRecommendations
  };
};