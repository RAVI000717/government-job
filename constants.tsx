
import React from 'react';
import { ExamType, Subject } from './types';

export const EXAM_TYPES: ExamType[] = [
  { id: 'ssc', name: 'SSC CGL/CHSL', description: 'General intelligence, Reasoning, Quant, English', icon: '🏛️' },
  { id: 'banking', name: 'IBPS/SBI Banking', description: 'Aptitude, Reasoning, Banking Awareness', icon: '🏦' },
  { id: 'railway', name: 'RRB NTPC/Group D', description: 'General Science, Math, General Awareness', icon: '🚂' },
  { id: 'upsc', name: 'UPSC CSE (Prelims)', description: 'Civil Services Aptitude, GS Paper I & II', icon: '📜' },
  { id: 'police', name: 'Police/SI Exams', description: 'Physical, Law, Aptitude, Regional Awareness', icon: '👮' },
  { id: 'teacher', name: 'TET/CTET Teaching', description: 'Child Pedagogy, Language, Subject Proficiency', icon: '🎓' },
];

export const SUBJECTS: Subject[] = [
  { id: 'gk', name: 'General Knowledge', icon: '🌏' },
  { id: 'reasoning', name: 'Logical Reasoning', icon: '🧠' },
  { id: 'math', name: 'Mathematics / Quant', icon: '🔢' },
  { id: 'english', name: 'English Language', icon: '📖' },
  { id: 'ca', name: 'Current Affairs', icon: '📰' },
];
