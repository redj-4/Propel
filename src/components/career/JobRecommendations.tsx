import React, { useState, useEffect } from 'react';
import { useAI } from '../../lib/hooks/useAI';
import { Building2, Star, Briefcase, ChevronRight, BarChart3 } from 'lucide-react';
import Button from '../common/Button';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  matchScore: number;
  skills: string[];
  source: 'linkedin' | 'indeed';
  url: string;
}

interface JobRecommendationsProps {
  resumeData?: any;
}

const JobRecommendations: React.FC<JobRecommendationsProps> = ({ resumeData }) => {
  const { getJobRecommendations, analyzeJobMatch, loading } = useAI();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [analysis, setAnalysis] = useState<{
    score: number;
    missingSkills: string[];
    recommendations: string[];
  } | null>(null);

  useEffect(() => {
    loadJobs();
  }, [resumeData]);

  const loadJobs = async () => {
    const recommendations = await getJobRecommendations(resumeData);
    if (recommendations) {
      setJobs(recommendations);
    }
  };

  const analyzeJob = async (job: Job) => {
    setSelectedJob(job);
    const jobAnalysis = await analyzeJobMatch(job, resumeData);
    if (jobAnalysis) {
      setAnalysis(jobAnalysis);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          AI Job Recommendations
        </h2>
        <Button
          variant="secondary"
          onClick={loadJobs}
          isLoading={loading}
          icon={BarChart3}
        >
          Refresh Matches
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {jobs.map((job) => (
            <div
              key={job.id}
              className={`bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all cursor-pointer ${
                selectedJob?.id === job.id ? 'ring-2 ring-secondary-500' : ''
              }`}
              onClick={() => analyzeJob(job)}
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {job.title}
                  </h3>
                  <p className="text-gray-600 mb-2">
                    {job.company} • {job.location}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {job.skills.slice(0, 3).map((skill, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-sm rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-secondary-600">
                  <Star className="w-4 h-4" />
                  <span className="font-medium">{job.matchScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedJob && analysis && (
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <h3 className="font-semibold text-gray-900 mb-4">
              Match Analysis
            </h3>
            
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-gray-600">Match Score</span>
                  <span className="font-medium text-secondary-600">
                    {analysis.score}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-full bg-secondary-500 rounded-full transition-all"
                    style={{ width: `${analysis.score}%` }}
                  />
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Missing Skills
                </h4>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-red-50 text-red-600 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {analysis.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="flex items-start text-gray-600"
                    >
                      <ChevronRight className="w-5 h-5 mr-2 text-secondary-500 flex-shrink-0" />
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                variant="primary"
                className="w-full"
                onClick={() => window.open(selectedJob.url, '_blank')}
                icon={Briefcase}
              >
                Apply Now
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobRecommendations;
