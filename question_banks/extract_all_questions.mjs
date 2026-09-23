#!/usr/bin/env node

import fs from 'fs';

// Read all four JSON files
let exam, bankComplete, bank, bankAll;

try {
  exam = JSON.parse(fs.readFileSync('./exam-questions.json', 'utf8'));
  bankComplete = JSON.parse(fs.readFileSync('./questions-bank-complete.json', 'utf8'));
  bank = JSON.parse(fs.readFileSync('./questions-bank.json', 'utf8'));
  bankAll = JSON.parse(fs.readFileSync('./questions-bank-all.json', 'utf8'));
} catch (e) {
  console.error('Error reading files:', e.message);
  process.exit(1);
}

// Collect all questions
const allQuestions = [];
const seenQuestions = new Set();
const domains = new Set();

function addQuestion(q, source) {
  if (!q || !q.question) return;

  // Create a unique key based on question text (for deduplication)
  const key = q.question.substring(0, 50);
  if (seenQuestions.has(key)) return;
  seenQuestions.add(key);

  const normalized = {
    id: q.id || `Q-${allQuestions.length + 1}`,
    domain: q.domain || 'General',
    question: q.question,
    options: q.options || [],
    correctAnswers: Array.isArray(q.correctAnswers) ? q.correctAnswers : (q.correct ? (Array.isArray(q.correct) ? q.correct : [q.correct]) : [0]),
    correctAnswerText: q.correctAnswerText || (q.correct !== undefined ? (Array.isArray(q.correct) ? q.correct.map(i => q.options?.[i]) : [q.options?.[q.correct]]) : []),
    type: q.type || (q.questionType ? (q.questionType.includes('multiple') ? 'multiple' : 'single') : (q.pick === 2 ? 'multiple' : 'single')),
    explanation: q.explanation || q.why || ''
  };

  allQuestions.push(normalized);
  if (normalized.domain) domains.add(normalized.domain);
}

console.log('Processing exam-questions.json...');
if (exam.sets && Array.isArray(exam.sets)) {
  exam.sets.forEach(set => {
    if (set.questions && Array.isArray(set.questions)) {
      console.log(`  Set ${set.setId}: ${set.questions.length} questions`);
      set.questions.forEach(q => {
        addQuestion(q, 'exam-questions.json');
      });
    }
  });
}

console.log('Processing questions-bank-complete.json...');
if (bankComplete.questions && Array.isArray(bankComplete.questions)) {
  console.log(`  Found ${bankComplete.questions.length} questions`);
  bankComplete.questions.forEach(q => {
    addQuestion(q, 'questions-bank-complete.json');
  });
}

console.log('Processing questions-bank.json...');
if (bank.questions && Array.isArray(bank.questions)) {
  console.log(`  Found ${bank.questions.length} questions`);
  bank.questions.forEach(q => {
    addQuestion(q, 'questions-bank.json');
  });
}

console.log('Processing questions-bank-all.json...');
if (bankAll.questions && Array.isArray(bankAll.questions)) {
  console.log(`  Found ${bankAll.questions.length} questions`);
  bankAll.questions.forEach(q => {
    addQuestion(q, 'questions-bank-all.json');
  });
}

// Create metadata
const sortedDomains = Array.from(domains).sort();
const metadata = {
  title: 'Claude Certified Developer - Complete Question Bank',
  totalQuestions: allQuestions.length,
  extractionDate: new Date().toISOString().split('T')[0],
  source: 'Combined from: exam-questions.json, questions-bank-complete.json, questions-bank.json, questions-bank-all.json',
  domains: sortedDomains,
  domainStats: {}
};

// Calculate domain statistics
sortedDomains.forEach(domain => {
  const count = allQuestions.filter(q => q.domain === domain).length;
  metadata.domainStats[domain] = count;
});

// Create the final combined file
const combined = {
  metadata,
  questions: allQuestions
};

// Write to file
fs.writeFileSync('./all_questions_combined.json', JSON.stringify(combined, null, 2));

console.log(`\n✓ Successfully combined ${allQuestions.length} unique questions`);
console.log(`✓ From ${sortedDomains.length} domains`);
console.log(`✓ Saved to: all_questions_combined.json\n`);

console.log('Domain breakdown:');
sortedDomains.forEach(domain => {
  console.log(`  ${domain}: ${metadata.domainStats[domain]} questions`);
});
