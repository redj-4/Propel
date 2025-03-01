import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import Navbar from '../components/layout/Navbar';
import EnhancedChat from '../components/chat/EnhancedChat';
import CareerCoaching from '../components/career/CareerCoaching';
import MockInterview from '../components/career/MockInterview';
import JobRecommendations from '../components/career/JobRecommendations';
import ResumeUpload from '../components/chat/ResumeUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Brain, MessageSquare, Briefcase, Mic } from 'lucide-react';

const CareerCoachPage = () => {
  const { user, isGuest } = useAuth();
  const [resumeData, setResumeData] = useState<any>(null);
  const [isResumeLoading, setResumeLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleResumeUpload = async (file: File) => {
    setResumeLoading(true);
    setFileName(file.name);
    // Simulate resume parsing – replace this with your resume parser logic.
    const parsedData = await new Promise(resolve => {
      setTimeout(() => {
        resolve({
          name: "John Doe",
          skills: ["React", "Node.js", "Python"],
          experience: "3 years",
          education: "Bachelor's in Computer Science"
        });
      }, 2000);
    });
    setResumeData(parsedData);
    setResumeLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!resumeData ? (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Welcome to Your Personal AI Career Coach
            </h1>
            <p className="text-gray-600 mb-6">
              Please upload your resume to get started with personalized career guidance.
            </p>
            <ResumeUpload
              onUpload={handleResumeUpload}
              isLoading={isResumeLoading}
              fileName={fileName}
              isDragging={false} // You can manage drag state here if needed.
              onDragOver={() => {}}
              onDragLeave={() => {}}
              onDrop={() => {}}
            />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Live Career Coach
                </h1>
                <p className="text-gray-600 mt-1">
                  Chat with your personal career coach for guidance across multiple areas.
                </p>
              </div>
            </div>
            <Tabs defaultValue="chat" className="space-y-6">
              <TabsList>
                <TabsTrigger value="chat" className="flex items-center">
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Career Chat
                </TabsTrigger>
                <TabsTrigger value="advice" className="flex items-center">
                  <Brain className="w-4 h-4 mr-2" />
                  Career Advice
                </TabsTrigger>
                <TabsTrigger value="interview" className="flex items-center">
                  <Mic className="w-4 h-4 mr-2" />
                  Mock Interview
                </TabsTrigger>
                <TabsTrigger value="jobs" className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2" />
                  Job Matches
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat">
                <div className="bg-white rounded-xl shadow-sm p-6 min-h-[600px]">
                  <EnhancedChat resumeData={resumeData} />
                </div>
              </TabsContent>

              <TabsContent value="advice">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <CareerCoaching resumeData={resumeData} />
                </div>
              </TabsContent>

              <TabsContent value="interview">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <MockInterview resumeData={resumeData} />
                </div>
              </TabsContent>

              <TabsContent value="jobs">
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <JobRecommendations resumeData={resumeData} />
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </main>
    </div>
  );
};

export default CareerCoachPage;
