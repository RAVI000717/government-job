
import React from 'react';
import { EXAM_TYPES } from '../constants';
import { ExamType } from '../types';

interface ExamSelectionProps {
  onSelect: (exam: ExamType) => void;
}

const ExamSelection: React.FC<ExamSelectionProps> = ({ onSelect }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          Master Your <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Government Exams</span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Experience realistic AI-powered mock tests designed by experts to help you ace your competitive examinations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXAM_TYPES.map((exam) => (
          <button
            key={exam.id}
            onClick={() => onSelect(exam)}
            className="group flex flex-col p-6 bg-white rounded-2xl border border-slate-200 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300 text-left relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-50 rounded-full -mr-12 -mt-12 group-hover:bg-indigo-100 transition-colors"></div>
            <div className="text-4xl mb-4 z-10">{exam.icon}</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2 z-10 group-hover:text-indigo-600 transition-colors">
              {exam.name}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed z-10">
              {exam.description}
            </p>
            <div className="mt-6 flex items-center text-indigo-600 text-sm font-semibold z-10">
              Start Practice Test 
              <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ExamSelection;
