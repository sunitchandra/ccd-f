import { useState, useMemo } from 'react';
import { getQuestionBank } from '../utils/questionBank';
import './QuestionsLibrary.css';

interface QuestionsLibraryProps {
  onBackToDashboard: () => void;
}

export default function QuestionsLibrary({ onBackToDashboard }: QuestionsLibraryProps) {
  const questions = useMemo(() => getQuestionBank(), []);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [filterDomain, setFilterDomain] = useState<string>('all');
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  const domains = useMemo(() => {
    const unique = new Set(questions.map(q => (q as any).domain || 'Other'));
    return Array.from(unique).sort();
  }, [questions]);

  const filteredQuestions = useMemo(() => {
    return questions.filter(q => {
      const matchesDomain = filterDomain === 'all' || (q as any).domain === filterDomain;
      const matchesType = filterType === 'all' || q.type === filterType;
      const matchesSearch =
        q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.options.some(opt => opt.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesDomain && matchesType && matchesSearch;
    });
  }, [questions, filterDomain, filterType, searchTerm]);

  const typeCount = {
    single: questions.filter(q => q.type === 'single').length,
    multiple: questions.filter(q => q.type === 'multiple').length,
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="questions-library">
      <header className="library-header">
        <h1>Questions Library</h1>
        <button onClick={onBackToDashboard} className="btn-back">
          ← Back to Dashboard
        </button>
      </header>

      <div className="library-stats">
        <div className="stat">
          <span className="stat-label">Total Questions</span>
          <span className="stat-value">{questions.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Single Choice</span>
          <span className="stat-value">{typeCount.single}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Multiple Choice</span>
          <span className="stat-value">{typeCount.multiple}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Domains</span>
          <span className="stat-value">{domains.length}</span>
        </div>
      </div>

      <div className="library-filters">
        <div className="filter-group">
          <label>Search Questions</label>
          <input
            type="text"
            placeholder="Type to search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="filter-group">
          <label>Domain</label>
          <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)} className="filter-select">
            <option value="all">All Domains ({questions.length})</option>
            {domains.map(domain => {
              const count = questions.filter(q => (q as any).domain === domain).length;
              return (
                <option key={domain} value={domain}>
                  {domain} ({count})
                </option>
              );
            })}
          </select>
        </div>

        <div className="filter-group">
          <label>Type</label>
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="filter-select">
            <option value="all">All Types</option>
            <option value="single">Single Choice ({typeCount.single})</option>
            <option value="multiple">Multiple Choice ({typeCount.multiple})</option>
          </select>
        </div>

        <button
          onClick={() => {
            setFilterDomain('all');
            setFilterType('all');
            setSearchTerm('');
          }}
          className="btn-reset"
        >
          Reset Filters
        </button>
      </div>

      <div className="library-results">
        <div className="results-info">
          Showing {filteredQuestions.length} of {questions.length} questions
        </div>

        <div className="questions-list">
          {filteredQuestions.length === 0 ? (
            <div className="no-results">
              <p>No questions found matching your filters.</p>
              <button onClick={() => {
                setFilterDomain('all');
                setFilterType('all');
                setSearchTerm('');
              }} className="btn-secondary">
                Clear all filters
              </button>
            </div>
          ) : (
            filteredQuestions.map((question, index) => (
              <div key={question.id} className="question-item">
                <div
                  className="question-header"
                  onClick={() => toggleExpanded(question.id)}
                >
                  <div className="question-title">
                    <span className="question-number">{index + 1}</span>
                    <div className="question-meta">
                      <h3>{question.question}</h3>
                      <div className="question-badges">
                        <span className="badge domain">{(question as any).domain || 'Other'}</span>
                        <span className="badge type">
                          {question.type === 'single' ? 'Single Choice' : 'Multiple Choice'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <span className="expand-icon">
                    {expandedId === question.id ? '▼' : '▶'}
                  </span>
                </div>

                {expandedId === question.id && (
                  <div className="question-details">
                    <div className="options-section">
                      <h4>Options:</h4>
                      <div className="options-list">
                        {question.options.map((option, optIndex) => {
                          const isCorrect = question.correctAnswers.includes(optIndex);
                          return (
                            <div
                              key={optIndex}
                              className={`option ${isCorrect ? 'correct' : ''}`}
                            >
                              <span className="option-letter">
                                {String.fromCharCode(65 + optIndex)}
                              </span>
                              <span className="option-text">{option}</span>
                              {isCorrect && <span className="correct-badge">✓ Correct</span>}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {question.explanation && (
                      <div className="explanation-section">
                        <h4>Explanation:</h4>
                        <p>{question.explanation}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
