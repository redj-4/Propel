import React, { useState } from 'react';
import { useAI } from '../../lib/hooks/useAI';
import { Mic, Play, Pause, CheckCircle } from 'lucide-react';
import Button from '../common/Button';

interface Question {
  id: string;
  question: string;
  type: string;
  expectedPoints: string[];
}

interface MockInterviewProps {
  resumeData?: any;
}

const MockInterview: React.FC<MockInterviewProps> = ({ resumeData }) => {
  const { generateInterviewQuestions, analyzeResponse, loading } = useAI();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const startInterview = async () => {
    const newQuestions = await generateInterviewQuestions(resumeData);
    if (newQuestions) {
      setQuestions(newQuestions);
      setCurrentQuestion(0);
      setFeedback(null);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const submitResponse = async () => {
    setIsRecording(false);
    // In a real implementation, you would send the recorded audio/transcript.
    const response = await analyzeResponse("Sample response", resumeData);
    setFeedback(response);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          AI Mock Interview
        </h2>
        <Button
          variant="primary"
          onClick={startInterview}
          isLoading={loading}
          icon={Play}
        >
          Start Interview
        </Button>
      </div>

      {questions.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <div className="mb-6">
            <span className="text-sm text-gray-500">
              Question {currentQuestion + 1} of {questions.length}
            </span>
            <h3 className="text-xl font-semibold text-gray-900 mt-2">
              {questions[currentQuestion].question}
            </h3>
          </div>

          <div className="flex items-center space-x-4">
            <Button
              variant={isRecording ? 'secondary' : 'primary'}
              onClick={toggleRecording}
              icon={isRecording ? Pause : Mic}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </Button>
            <Button
              variant="secondary"
              onClick={submitResponse}
              disabled={!isRecording}
              icon={CheckCircle}
            >
              Submit Response
            </Button>
          </div>

          {feedback && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2">
                AI Feedback
              </h4>
              <p className="text-gray-600">
                {feedback}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MockInterview;
