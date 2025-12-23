
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import ExamSelection from './components/ExamSelection';
import SubjectSelection from './components/SubjectSelection';
import MockTest from './components/MockTest';
import Results from './components/Results';
import { generateMockTest, generateAITips } from './geminiService';
import { ExamType, Subject, Question, UserAnswer } from './types';

type AppState = 'exam-selection' | 'subject-selection' | 'generating' | 'testing' | 'results';

const App: React.FC = () => {
  const [state, setState] = useState<AppState>('exam-selection');
  const [selectedExam, setSelectedExam] = useState<ExamType | null>(null);
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<UserAnswer[]>([]);
  const [aiTips, setAiTips] = useState<string>('');
  const [loadingMessage, setLoadingMessage] = useState<string>('Initializing AI engine...');

  const handleExamSelect = (exam: ExamType) => {
    setSelectedExam(exam);
    setState('subject-selection');
  };

  const handleSubjectSelect = async (subject: Subject) => {
    setSelectedSubject(subject);
    setState('generating');
    
    setLoadingMessage(`Generating expert-level ${subject.name} questions for ${selectedExam?.name}...`);
    
    try {
      const q = await generateMockTest(selectedExam?.name || 'SSC', subject.name);
      setQuestions(q);
      setState('testing');
    } catch (error) {
      alert("Failed to generate test. Please try again.");
      setState('subject-selection');
    }
  };

  const handleTestComplete = async (userAnswers: UserAnswer[]) => {
    setAnswers(userAnswers);
    setState('generating');
    setLoadingMessage('AI is analyzing your performance...');

    const correctCount = userAnswers.filter(a => a.isCorrect).length;
    const subjectsSummary = [...new Set(questions.map(q => q.subject))].join(', ');
    
    try {
      const tips = await generateAITips(correctCount, questions.length, subjectsSummary);
      setAiTips(tips);
      setState('results');
    } catch (error) {
      setAiTips("Keep studying hard! Review your weak areas consistently.");
      setState('results');
    }
  };

  const handleRestart = () => {
    setState('exam-selection');
    setSelectedExam(null);
    setSelectedSubject(null);
    setQuestions([]);
    setAnswers([]);
  };

  return (
    <Layout>
      {state === 'exam-selection' && (
        <ExamSelection onSelect={handleExamSelect} />
      )}

      {state === 'subject-selection' && selectedExam && (
        <SubjectSelection 
          selectedExam={selectedExam} 
          onSelect={handleSubjectSelect} 
          onBack={() => setState('exam-selection')}
        />
      )}

      {state === 'generating' && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="relative mb-8">
             <div className="w-24 h-24 border-8 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
             <div className="absolute inset-0 flex items-center justify-center text-3xl">🤖</div>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-2">{loadingMessage}</h2>
          <p className="text-slate-500 max-w-sm">This usually takes about 10-15 seconds as our AI models tailor the questions for your exam level.</p>
        </div>
      )}

      {state === 'testing' && questions.length > 0 && (
        <MockTest 
          questions={questions} 
          onComplete={handleTestComplete} 
          onRestart={handleRestart}
        />
      )}

      {state === 'results' && (
        <Results 
          questions={questions} 
          answers={answers} 
          aiTips={aiTips}
          onRestart={handleRestart}
        />
      )}
    </Layout>
  );
};

export default App;
