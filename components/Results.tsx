
import React, { useMemo } from 'react';
import { Question, UserAnswer, TestResult } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface ResultsProps {
  questions: Question[];
  answers: UserAnswer[];
  aiTips: string;
  onRestart: () => void;
}

const Results: React.FC<ResultsProps> = ({ questions, answers, aiTips, onRestart }) => {
  const result = useMemo((): TestResult => {
    const correct = answers.filter(a => a.isCorrect === true).length;
    const skipped = answers.filter(a => a.selectedOption === null).length;
    const incorrect = answers.length - correct - skipped;
    const accuracy = (correct / (answers.length - skipped)) * 100 || 0;
    
    const subjectAnalysis: { [key: string]: { correct: number, total: number } } = {};
    questions.forEach((q, idx) => {
      if (!subjectAnalysis[q.subject]) {
        subjectAnalysis[q.subject] = { correct: 0, total: 0 };
      }
      subjectAnalysis[q.subject].total += 1;
      if (answers[idx].isCorrect) {
        subjectAnalysis[q.subject].correct += 1;
      }
    });

    return {
      score: correct,
      totalQuestions: questions.length,
      correctAnswers: correct,
      incorrectAnswers: incorrect,
      skippedAnswers: skipped,
      accuracy: Math.round(accuracy),
      subjectAnalysis,
      aiTips
    };
  }, [questions, answers, aiTips]);

  const pieData = [
    { name: 'Correct', value: result.correctAnswers, color: '#10b981' },
    { name: 'Incorrect', value: result.incorrectAnswers, color: '#ef4444' },
    { name: 'Skipped', value: result.skippedAnswers, color: '#94a3b8' },
  ];

  // Fix: Explicitly type entries to avoid 'unknown' property access errors for 'correct' and 'total'
  const barData = (Object.entries(result.subjectAnalysis) as [string, { correct: number; total: number }][]).map(([subject, data]) => ({
    subject,
    accuracy: Math.round((data.correct / data.total) * 100),
  }));

  return (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Test Performance Report</h1>
          <p className="text-slate-500">Comprehensive analysis of your strengths and opportunities.</p>
        </div>
        <button
          onClick={onRestart}
          className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Take New Test
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Total Score</p>
          <h2 className="text-4xl font-black text-indigo-600">{result.score}/{result.totalQuestions}</h2>
          <p className="text-xs text-slate-400 mt-2">1 point for each correct answer</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Accuracy</p>
          <h2 className="text-4xl font-black text-emerald-600">{result.accuracy}%</h2>
          <p className="text-xs text-slate-400 mt-2">Based on attempted questions</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Correct</p>
          <h2 className="text-4xl font-black text-slate-900">{result.correctAnswers}</h2>
          <p className="text-xs text-slate-400 mt-2">Out of {result.totalQuestions} total</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <p className="text-slate-500 text-sm font-medium mb-1">Incorrect</p>
          <h2 className="text-4xl font-black text-rose-600">{result.incorrectAnswers}</h2>
          <p className="text-xs text-slate-400 mt-2">{result.skippedAnswers} questions skipped</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Charts Section */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Performance Mix</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36}/>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Accuracy by Topic</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} layout="vertical">
                  <XAxis type="number" domain={[0, 100]} hide />
                  <YAxis dataKey="subject" type="category" width={100} />
                  <Tooltip />
                  <Bar dataKey="accuracy" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* AI Section */}
        <div className="space-y-8">
          <div className="bg-indigo-900 rounded-3xl p-8 text-white relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-indigo-400">✦</span> AI Mentor Tips
            </h3>
            <div className="space-y-6">
              <div className="prose prose-invert prose-sm">
                <div dangerouslySetInnerHTML={{ __html: aiTips.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10">
              <p className="text-white/60 text-xs italic">
                Tips generated based on your accuracy trends and difficulty level performance.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm mb-12">
        <h3 className="text-xl font-bold text-slate-900 mb-8">Review Questions</h3>
        <div className="space-y-6">
          {questions.map((q, idx) => (
            <div key={q.id} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50">
              <div className="flex justify-between items-start mb-4 gap-4">
                <h4 className="text-lg font-semibold text-slate-900">{idx + 1}. {q.text}</h4>
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${answers[idx].isCorrect ? 'bg-emerald-100 text-emerald-700' : answers[idx].selectedOption === null ? 'bg-slate-200 text-slate-600' : 'bg-rose-100 text-rose-700'}`}>
                  {answers[idx].isCorrect ? 'Correct' : answers[idx].selectedOption === null ? 'Skipped' : 'Incorrect'}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {q.options.map((opt, oIdx) => (
                  <div 
                    key={oIdx}
                    className={`p-3 rounded-lg border text-sm ${
                      oIdx === q.correctAnswer 
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-900 font-medium' 
                        : oIdx === answers[idx].selectedOption 
                          ? 'border-rose-500 bg-rose-50 text-rose-900' 
                          : 'border-slate-200 bg-white text-slate-500'
                    }`}
                  >
                    <span className="font-bold mr-2">{String.fromCharCode(65 + oIdx)}.</span> {opt}
                  </div>
                ))}
              </div>
              <div className="bg-indigo-50/50 p-4 rounded-xl border border-indigo-100 text-sm">
                <p className="text-indigo-900 font-bold mb-1">Explanation:</p>
                <p className="text-indigo-800 leading-relaxed">{q.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Results;
