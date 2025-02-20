import React from 'react';
import { CheckCircle2, Circle } from 'lucide-react';

interface ProgressTrackerProps {
  currentStep: 'intro' | 'resume' | 'goals' | 'recipient' | 'message';
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ currentStep }) => {
  const steps = [
    { id: 'intro', label: 'Welcome' },
    { id: 'resume', label: 'Resume' },
    { id: 'goals', label: 'Career Goals' },
    { id: 'recipient', label: 'Recipient' },
    { id: 'message', label: 'Message' }
  ];
  
  const currentIndex = steps.findIndex(step => step.id === currentStep);
  
  return (
    <div className="w-full py-6">
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex justify-between mb-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentIndex;
            const isCurrent = index === currentIndex;
            
            return (
              <div
                key={step.id}
                className="flex flex-col items-center relative"
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 ${
                    isCompleted
                      ? 'bg-secondary-600 text-white'
                      : isCurrent
                      ? 'bg-secondary-100 text-secondary-600 ring-2 ring-secondary-600'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <Circle className="w-6 h-6" />
                  )}
                </div>
                <span className={`mt-2 text-sm font-medium ${
                  isCurrent ? 'text-secondary-600' : 'text-gray-500'
                }`}>
                  {step.label}
                </span>
                {index < steps.length - 1 && (
                  <div 
                    className={`absolute left-full top-5 w-full h-0.5 -translate-y-1/2 transition-all duration-200 ${
                      index < currentIndex ? 'bg-secondary-600' : 'bg-gray-200'
                    }`} 
                    style={{ width: 'calc(100% - 2.5rem)' }}
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-secondary-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;