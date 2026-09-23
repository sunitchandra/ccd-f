#!/usr/bin/env node

import fs from 'fs';

// Read all four JSON files
const exam = JSON.parse(fs.readFileSync('./exam-questions.json', 'utf8'));
const bankComplete = JSON.parse(fs.readFileSync('./questions-bank-complete.json', 'utf8'));
const bank = JSON.parse(fs.readFileSync('./questions-bank.json', 'utf8'));
const bankAll = JSON.parse(fs.readFileSync('./questions-bank-all.json', 'utf8'));

// Collect all unique questions
const questionMap = new Map();
const domains = new Set();

function normalizeQuestion(q) {
  return q.question || q.q || '';
}

function addQuestion(q, source) {
  if (!q || !q.question) return;

  const key = normalizeQuestion(q);
  if (!questionMap.has(key)) {
    const normalized = {
      id: q.id || `Q-${questionMap.size + 1}`,
      domain: q.domain || 'General',
      question: q.question,
      options: q.options || [],
      correctAnswers: Array.isArray(q.correctAnswers) ? q.correctAnswers : [q.correct?.[0] || 0],
      correctAnswerText: q.correctAnswerText || (q.correctAnswers?.map((i) => q.options?.[i]) || []),
      type: q.type || (q.questionType || (q.pick === 1 ? 'single' : 'multiple')),
      explanation: q.explanation || q.why || '',
      source: source
    };

    questionMap.set(key, normalized);
    if (normalized.domain) domains.add(normalized.domain);
  }
}

// Process exam-questions.json (has nested sets structure)
if (exam.sets && Array.isArray(exam.sets)) {
  exam.sets.forEach(set => {
    if (set.questions && Array.isArray(set.questions)) {
      set.questions.forEach(q => {
        addQuestion(q, 'exam-questions.json');
      });
    }
  });
}

// Process questions-bank-complete.json
if (bankComplete.questions && Array.isArray(bankComplete.questions)) {
  bankComplete.questions.forEach(q => {
    addQuestion(q, 'questions-bank-complete.json');
  });
}

// Process questions-bank.json
if (bank.questions && Array.isArray(bank.questions)) {
  bank.questions.forEach(q => {
    addQuestion(q, 'questions-bank.json');
  });
}

// Process questions-bank-all.json
if (bankAll.questions && Array.isArray(bankAll.questions)) {
  bankAll.questions.forEach(q => {
    addQuestion(q, 'questions-bank-all.json');
  });
}

// Convert map to array
const allQuestions = Array.from(questionMap.values());

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

console.log(`✓ Successfully combined ${allQuestions.length} unique questions`);
console.log(`✓ From ${sortedDomains.length} domains`);
console.log(`✓ Saved to: all_questions_combined.json\n`);

console.log('Domain breakdown:');
sortedDomains.forEach(domain => {
  console.log(`  ${domain}: ${metadata.domainStats[domain]} questions`);
});
