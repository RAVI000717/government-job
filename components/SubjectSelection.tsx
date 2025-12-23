
import React from 'react';
import { SUBJECTS } from '../constants';
import { Subject, ExamType } from '../types';

interface SubjectSelectionProps {
  selectedExam: ExamType;
  onSelect: (subject: Subject) => void;
  onBack: () => void;
}

const SubjectSelection: React.FC<SubjectSelectionProps> = ({ selectedExam, onSelect, onBack }) => {
  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-4xl mx-auto">
      <button 
        onClick={onBack}
        className="mb-8 flex items-center text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <svg className="w-5 h-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Exams
      </button>

      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-2xl">
            {selectedExam.icon}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{selectedExam.name} Preparation</h2>
            <p className="text-slate-500">Choose a subject to generate your mock test</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SUBJECTS.map((subject) => (
            <button
              key={subject.id}
              onClick={() => onSelect(subject)}
              className="flex items-center p-5 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group"
            >
              <span className="text-3xl mr-4 group-hover:scale-110 transition-transform">{subject.icon}</span>
              <span className="text-lg font-semibold text-slate-700 group-hover:text-indigo-700">{subject.name}</span>
            </button>
          ))}
          <button
            onClick={() => onSelect({ id: 'full', name: 'Full Length Test', icon: '📝' })}
            className="flex items-center p-5 bg-indigo-600 rounded-xl border border-indigo-700 hover:bg-indigo-700 transition-all duration-200 group col-span-1 sm:col-span-2"
          >
            <span className="text-3xl mr-4">📝</span>
            <span className="text-lg font-semibold text-white">Full Length Mock Test (Mix of Topics)</span>
          </button>
        </div>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
        <div className="flex gap-3">
          <svg className="w-6 h-6 text-amber-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="font-bold text-amber-900">Expert Note</h4>
            <p className="text-amber-800 text-sm">
              Our AI generates questions based on real historical data and current exam patterns for {selectedExam.name}. 
              Tests typically consist of 40 questions to be completed in 30 minutes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubjectSelection;
