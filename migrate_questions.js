#!/usr/bin/env node

/**
 * Question Bank Migration Script
 *
 * This script helps migrate questions from the React component format
 * to the JSON format used by the question bank.
 *
 * Usage: node migrate_questions.js
 */

import fs from 'fs';

console.log('═══════════════════════════════════════════════════════════════');
console.log('📚 Question Bank Migration Tool');
console.log('═══════════════════════════════════════════════════════════════\n');

// Read current questions-bank.json
const currentBank = JSON.parse(fs.readFileSync('./questions-bank.json', 'utf8'));

console.log('Current Status:');
console.log(`  ✓ Total questions in JSON: ${currentBank.questions.length}`);
console.log(`  ✓ Single-choice: ${currentBank.questions.filter(q => q.type === 'single').length}`);
console.log(`  ✓ Multiple-choice: ${currentBank.questions.filter(q => q.type === 'multiple').length}`);

console.log('\nTo add all 531 questions:');
console.log('  1. Extract QUESTIONS_1 through QUESTIONS_6 arrays from React component');
console.log('  2. Each array contains 50 questions');
console.log('  3. Run: node merge_questions.js <json-file>');

console.log('\n📋 Questions Breakdown:');
console.log('  ├─ Set 1: 50 questions');
console.log('  ├─ Set 2: 50 questions');
console.log('  ├─ Set 3: 50 questions');
console.log('  ├─ Set 4: 50 questions');
console.log('  ├─ Set 5: 50 questions');
console.log('  ├─ Set 6: 50 questions');
console.log('  └─ PDF: 31 questions');
console.log('  ────────────────────');
console.log('     Total: 531 questions');

// Domains covered
const domains = new Set(currentBank.questions.map(q => q.domain || 'Other'));
console.log('\n🏷️  Domains Covered:');
Array.from(domains).sort().forEach(domain => {
  const count = currentBank.questions.filter(q => q.domain === domain).length;
  console.log(`  ├─ ${domain}: ${count}`);
});

console.log('\n✅ To proceed with full migration:');
console.log('  1. Copy all 500 practice questions from React code');
console.log('  2. Convert to JSON format with id, domain, question, options, correctAnswers, type, explanation');
console.log('  3. Replace questions-bank.json with updated file');

console.log('\n═══════════════════════════════════════════════════════════════\n');
