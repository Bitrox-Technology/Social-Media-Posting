import React from 'react';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
}

interface StepsProps {
  steps: Step[];
  currentStep: string;
}

export const Steps: React.FC<StepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center items-center space-x-4">
      {steps.map((step, index) => {
        const isCurrent = step.id === currentStep;
        const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

        return (
          <React.Fragment key={step.id}>
            {index > 0 && (
              <div className={`h-1 w-16 ${isCompleted ? 'bg-yellow-500' : 'bg-gray-700'}`} />
            )}
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center
                  ${isCurrent ? 'bg-yellow-500 text-black' : 
                    isCompleted ? 'bg-yellow-600 text-white' : 'bg-gray-700 text-gray-300'}`}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : index + 1}
              </div>
              <span className={`mt-2 text-sm ${isCurrent ? 'text-yellow-500' : 'text-gray-400'}`}>
                {step.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}