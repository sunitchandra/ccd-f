import fs from 'fs';

// Read the current questions-bank.json
const currentBank = JSON.parse(fs.readFileSync('./questions-bank.json', 'utf8'));

// The issue: We have 32 questions but claim 531
// Solution: We need to add all 500 practice questions

const allQuestions = currentBank.questions;

// Update metadata to reflect actual count
currentBank.metadata.totalQuestions = allQuestions.length;

// Write back
fs.writeFileSync('./questions-bank.json', JSON.stringify(currentBank, null, 2));

console.log(`✓ Updated questions-bank.json`);
console.log(`Total questions: ${allQuestions.length}`);
console.log(`Single choice: ${allQuestions.filter(q => q.type === 'single').length}`);
console.log(`Multiple choice: ${allQuestions.filter(q => q.type === 'multiple').length}`);
