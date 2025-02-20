import React, { useState } from 'react';
import { useAI } from '../../lib/hooks/useAI';
import { Sparkles, Target, BookOpen, Briefcase } from 'lucide-react';
import Button from '../common/Button';

interface CareerAdvice {
  title: string;
  content: string;
  type: 'skill' | 'industry' | 'application';
}

const CareerCoaching: React.FC = () => {
  const { generateAdvice, loading } = useAI();
  const [advice, setAdvice] = useState<CareerAdvice[]>([]);

  const getCareerAdvice = async () => {
    const newAdvice = await generateAdvice();
    if (newAdvice) {
      setAdvice(newAdvice);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          AI Career Coach
        </h2>
        <Button
          variant="primary"
          onClick={getCareerAdvice}
          isLoading={loading}
          icon={Sparkles}
        >
          Get Personalized Advice
        </Button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {advice.map((item, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex items-start space-x-4">
              {item.type === 'skill' && (
                <Target className="w-6 h-6 text-secondary-500" />
              )}
              {item.type === 'industry' && (
                <BookOpen className="w-6 h-6 text-accent-500" />
              )}
              {item.type === 'application' && (
                <Briefcase className="w-6 h-6 text-primary-500" />
              )}
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-600">
                  {item.content}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CareerCoaching;