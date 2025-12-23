
import React, { useState, useEffect, useCallback } from 'react';
import { Question, UserAnswer, Difficulty } from '../types';

interface MockTestProps {
  questions: Question[];
  onComplete: (answers: UserAnswer[]) => void;
  onRestart: () => void;
}

const MockTest: React.FC<MockTestProps> = ({ questions, onComplete, onRestart }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<UserAnswer[]>(
    questions.map(q => ({ questionId: q.id, selectedOption: null, isCorrect: null }))
  );
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes
  const [bookmarks, setBookmarks] = useState<Set<number>>(new Set());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 0) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOptionSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    const isCorrect = optionIndex === questions[currentIndex].correctAnswer;
    newAnswers[currentIndex] = {
      ...newAnswers[currentIndex],
      selectedOption: optionIndex,
      isCorrect
    };
    setAnswers(newAnswers);
  };

  const toggleBookmark = () => {
    setBookmarks(prev => {
      const next = new Set(prev);
      if (next.has(currentIndex)) next.delete(currentIndex);
      else next.add(currentIndex);
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    if (confirm("Are you sure you want to finish the test?")) {
      onComplete(answers);
    }
  }, [answers, onComplete]);

  const currentQuestion = questions[currentIndex];
  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-8">
      {/* Left: Sidebar Question Map */}
      <div className="lg:w-1/4 order-2 lg:order-1">
        <div className="bg-white border border-slate-200 rounded-2xl p-6 sticky top-24">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-slate-900">Question Map</h3>
            <span className={`text-sm font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-slate-600'}`}>
              🕒 {formatTime(timeLeft)}
            </span>
          </div>
          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-full aspect-square text-xs font-bold rounded-lg flex items-center justify-center transition-all border
                  ${currentIndex === idx ? 'ring-2 ring-indigo-500 border-indigo-500' : ''}
                  ${answers[idx].selectedOption !== null ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'}
                  ${bookmarks.has(idx) ? 'ring-2 ring-amber-400' : ''}
                `}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <div className="space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-indigo-600 rounded-sm"></span> Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-white border border-slate-200 rounded-sm"></span> Not Answered
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 ring-2 ring-amber-400 rounded-sm"></span> Bookmarked
            </div>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full mt-8 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl shadow-lg shadow-green-200 transition-all"
          >
            Submit Test
          </button>
        </div>
      </div>

      {/* Right: Question Card */}
      <div className="lg:w-3/4 order-1 lg:order-2 flex flex-col gap-6">
        <div className="bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm">
          {/* Progress bar */}
          <div className="h-1.5 w-full bg-slate-100">
            <div 
              className="h-full bg-indigo-600 transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wider">
                  Question {currentIndex + 1} of {questions.length}
                </span>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border
                  ${currentQuestion.difficulty === Difficulty.EASY ? 'text-green-600 bg-green-50 border-green-200' : 
                    currentQuestion.difficulty === Difficulty.MEDIUM ? 'text-amber-600 bg-amber-50 border-amber-200' : 
                    'text-red-600 bg-red-50 border-red-200'}
                `}>
                  {currentQuestion.difficulty}
                </span>
              </div>
              <button 
                onClick={toggleBookmark}
                className={`p-2 rounded-lg transition-colors ${bookmarks.has(currentIndex) ? 'text-amber-500 bg-amber-50' : 'text-slate-400 hover:bg-slate-100'}`}
              >
                <svg className="w-6 h-6" fill={bookmarks.has(currentIndex) ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </button>
            </div>

            <h2 className="text-xl md:text-2xl font-semibold text-slate-900 mb-8 leading-relaxed">
              {currentQuestion.text}
            </h2>

            <div className="grid grid-cols-1 gap-4 mb-8">
              {currentQuestion.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  className={`flex items-center p-5 rounded-2xl border text-left transition-all duration-200 group
                    ${answers[currentIndex].selectedOption === idx 
                      ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' 
                      : 'border-slate-200 hover:border-indigo-300 hover:bg-slate-50'}
                  `}
                >
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold mr-4 transition-colors
                    ${answers[currentIndex].selectedOption === idx 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-slate-100 text-slate-500 group-hover:bg-indigo-100 group-hover:text-indigo-600'}
                  `}>
                    {String.fromCharCode(65 + idx)}
                  </div>
                  <span className={`text-lg font-medium ${answers[currentIndex].selectedOption === idx ? 'text-indigo-900' : 'text-slate-700'}`}>
                    {option}
                  </span>
                </button>
              ))}
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <button
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex(prev => prev - 1)}
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 disabled:opacity-50 transition-all flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Previous
              </button>
              <div className="flex gap-4">
                 <button
                  onClick={() => {
                    const newAnswers = [...answers];
                    newAnswers[currentIndex] = { ...newAnswers[currentIndex], selectedOption: null, isCorrect: null };
                    setAnswers(newAnswers);
                  }}
                  className="px-4 py-2.5 text-slate-500 hover:text-slate-700 font-medium transition-colors"
                >
                  Clear Choice
                </button>
                <button
                  onClick={() => {
                    if (currentIndex < questions.length - 1) {
                      setCurrentIndex(prev => prev + 1);
                    } else {
                      handleSubmit();
                    }
                  }}
                  className="px-8 py-2.5 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 transition-all flex items-center shadow-lg shadow-indigo-100"
                >
                  {currentIndex === questions.length - 1 ? 'Finish' : 'Next'}
                  {currentIndex !== questions.length - 1 && (
                    <svg className="w-4 h-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-900 rounded-2xl p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-2xl">💡</div>
            <div>
              <p className="text-white/60 text-sm">Exam Tip</p>
              <p className="font-medium">Read all options carefully before marking your answer.</p>
            </div>
          </div>
          <button 
            onClick={onRestart}
            className="text-white/40 hover:text-white transition-colors text-sm font-medium"
          >
            Restart Test
          </button>
        </div>
      </div>
    </div>
  );
};

export default MockTest;
