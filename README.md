# Claude Certified Developer - Exam Practice Platform

A comprehensive web-based exam practice platform for the Claude Certified Developer (CCDV) certification. This application provides an interactive testing environment with detailed question reviews, performance analytics, and a complete question library.

## 📋 Features

- **Full-Length Practice Exams**
  - 30 randomized questions per session
  - 65-minute time limit with live timer
  - Pause/Resume functionality
  - Real-time question navigation

- **Comprehensive Question Library**
  - 176+ questions across 33+ domains
  - Single-choice and multiple-choice questions
  - Detailed explanations for each question
  - Search and filter capabilities by domain and question type

- **Detailed Results & Analysis**
  - Immediate score calculation with passing criteria (72%)
  - Breakdown of correct, incorrect, and unanswered questions
  - Detailed review of each question with correct answers highlighted
  - Performance trend charts and attempt history

- **Progress Tracking**
  - User profiles with name customization
  - Exam attempt history with timestamps
  - Best score, average score, and pass/fail statistics
  - Performance visualization with trend charts

- **Smart Features**
  - Randomized question and option ordering for each attempt
  - Partial credit scoring for multiple-choice questions
  - Session persistence (resume interrupted exams)
  - Responsive design for desktop and mobile devices

## 🛠️ Technology Stack

- **Frontend**
  - React 18 with TypeScript
  - Vite (build tool)
  - CSS3 for styling

- **Data Storage**
  - IndexedDB for local persistence
  - JSON-based question bank

- **Development**
  - Node.js and npm
  - ESM modules

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

## 🚀 Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd "Claude Certified Developer"
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The application will be available at `http://localhost:5173`

4. **Build for production**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```
├── src/
│   ├── components/           # React components
│   │   ├── Dashboard.tsx     # Main dashboard view
│   │   ├── ExamScreen.tsx    # Exam interface
│   │   ├── ResultsPage.tsx   # Results and detailed review
│   │   ├── QuestionsLibrary.tsx  # Question browser
│   │   └── ...other components
│   ├── utils/
│   │   ├── questionBank.ts   # Question data management
│   │   ├── scoring.ts        # Scoring logic
│   │   └── ...utilities
│   ├── db/
│   │   └── database.ts       # IndexedDB operations
│   ├── types/
│   │   └── index.ts          # TypeScript interfaces
│   └── App.tsx               # Main app component
├── claude_certified_developer_questions_bank.json  # Question database
├── question_banks/           # Archived question files
├── index.html
├── vite.config.ts
└── package.json
```

## 🎯 How to Use

### Taking an Exam
1. Click **"Start New Exam"** on the dashboard
2. Answer 30 randomized questions within 65 minutes
3. Use the question navigator to jump between questions
4. Click **"Submit Exam"** when finished

### Pausing an Exam
- Click the **"Pause"** button to pause
- The timer will freeze and resume state will be saved
- Click **"Resume"** to continue later

### Viewing Results
- After submitting, see your score and percentage
- View breakdown of correct, incorrect, and unanswered questions
- Click on each question to see detailed explanation and correct answers

### Exploring Questions
- Click **"View All Questions"** to access the Questions Library
- Search by question text or content
- Filter by domain or question type
- Expand questions to see answers and explanations

### Tracking Progress
- Dashboard displays your exam statistics:
  - Total attempts
  - Best, average, and latest scores
  - Pass/fail counts
  - Performance trend chart

## 📊 Scoring System

- **Exam Passing Score**: 22/30 (72%)
- **Correct Answer**: Full 1 point
- **Multiple Choice**: Partial credit (1/N points per correct answer, where N = number of correct answers)
- **Incorrect Answer**: 0 points
- **Unanswered**: 0 points

## 💾 Data Persistence

All data is stored locally in your browser using IndexedDB:
- Exam attempts and scores
- User name preferences
- Current exam state (for resume functionality)

No data is sent to external servers.

## 🔄 Question Bank

The application includes **176+ practice questions** organized by:
- LLM Fundamentals
- Prompt Engineering
- API Mechanics
- Model Selection
- Cost & Tokens
- Output Handling
- Tools & MCPs
- Agents & Workflows
- Claude Code
- Security & Safety
- Configuration Management
- And 22+ more domains

Questions are sourced from official Claude Certified Developer practice materials and are regularly updated.

## 🎨 Customization

### Adding New Questions
Edit `claude_certified_developer_questions_bank.json` and add questions in this format:
```json
{
  "id": "unique-id",
  "domain": "Domain Name",
  "question": "Question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctAnswers": [0, 1],
  "explanation": "Explanation of correct answer"
}
```

### Modifying Exam Settings
Edit `src/utils/scoring.ts` and `src/components/ExamScreen.tsx`:
- `QUESTIONS_PER_EXAM`: Number of questions per session (default: 30)
- `EXAM_DURATION_MS`: Time limit in milliseconds (default: 65 minutes)
- `PASSING_PERCENTAGE`: Passing score percentage (default: 72%)

## 🧪 Testing

### Manual Testing Checklist
- ✅ Start and complete a practice exam
- ✅ Verify timer counts down correctly
- ✅ Test pause/resume functionality
- ✅ Review results and detailed answers
- ✅ Check score calculations
- ✅ Test search and filtering in Questions Library
- ✅ Verify performance chart displays correctly
- ✅ Test exam resume after page refresh

## 🐛 Known Issues & Troubleshooting

### Timer Issues
- If timer appears frozen, hard refresh browser (Ctrl+Shift+R)
- Timer pauses when exam is paused and resumes correctly

### Questions Not Loading
- Clear browser cache and refresh
- Check browser console for errors
- Verify `claude_certified_developer_questions_bank.json` is in root directory

### Storage Issues
- IndexedDB is not supported in private/incognito mode
- Clear browser storage if experiencing data issues (Settings → Privacy → Clear Data)

## 📈 Future Enhancements

- [ ] Cloud sync for exam attempts
- [ ] Timed practice mode with custom durations
- [ ] Question difficulty ratings
- [ ] Topic-wise mini quizzes
- [ ] Detailed performance analytics
- [ ] Question bookmarking for review
- [ ] Export results to PDF
- [ ] Offline mode support
- [ ] Dark mode theme
- [ ] Multi-language support

## 📄 License

This project is for educational purposes as part of the Claude Certified Developer certification program.

## 🤝 Contributing

Contributions are welcome! To contribute:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Commit your changes (`git commit -m 'Add improvement'`)
4. Push to the branch (`git push origin feature/improvement`)
5. Open a Pull Request

## 📞 Support

For issues, questions, or feedback:
- Check existing GitHub issues
- Review the troubleshooting section above
- Create a new issue with detailed description

## 📚 Resources

- [Claude API Documentation](https://claude.ai/docs)
- [Claude Certified Developer](https://www.anthropic.com/claude-certified-developer)
- [Claude Code Guide](https://claude.com/claude-code)

---

**Last Updated**: September 2026

Built with ❤️ for Claude Certified Developer exam preparation
