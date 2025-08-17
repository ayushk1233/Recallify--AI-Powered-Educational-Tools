'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '../components/ThemeProvider'

interface Flashcard {
  front: string
  back: string
}

interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

const formatStudyBuddyResponse = (text: string) => {
  if (!text) return null;
  
  const sections = text.split('\n\n');
  
  return (
    <div className="space-y-4">
      {sections.map((section, index) => {
        const trimmedSection = section.trim();
        if (!trimmedSection) return null;
        
        if (trimmedSection.startsWith('**') && trimmedSection.endsWith('**')) {
          const heading = trimmedSection.slice(2, -2);
          return (
            <h3 key={index} className="text-lg font-semibold text-[color:var(--text-primary)] mb-2">
              {heading}
            </h3>
          );
        }
        
        if (trimmedSection.includes('**')) {
          const parts = trimmedSection.split('**');
          return (
            <p key={index} className="leading-relaxed">
              {parts.map((part, partIndex) => 
                partIndex % 2 === 1 ? (
                  <strong key={partIndex} className="font-semibold">{part}</strong>
                ) : (
                  part
                )
              )}
            </p>
          );
        }
        
        if (trimmedSection.startsWith('###')) {
          const heading = trimmedSection.slice(3).trim();
          return (
            <h3 key={index} className="text-lg font-semibold text-[color:var(--text-primary)] mb-2">
              {heading}
            </h3>
          );
        }
        
        if (trimmedSection.includes('•')) {
          const bulletPoints = trimmedSection.split('•').filter(point => point.trim());
          return (
            <div key={index} className="space-y-3">
              {bulletPoints.map((point, pointIndex) => {
                const trimmedPoint = point.trim();
                if (!trimmedPoint) return null;
                
                if (trimmedPoint.includes('**')) {
                  const parts = trimmedPoint.split('**');
                  return (
                    <div key={pointIndex} className="flex items-start space-x-2">
                      <span className="text-[color:var(--color-blue)] mt-1">•</span>
                      <span>
                        {parts.map((part, partIndex) => 
                          partIndex % 2 === 1 ? (
                            <strong key={partIndex} className="font-semibold">{part}</strong>
                          ) : (
                            part
                          )
                        )}
                      </span>
                    </div>
                  );
                }
                return (
                  <div key={pointIndex} className="flex items-start space-x-2">
                    <span className="text-[color:var(--color-blue)] mt-1">•</span>
                    <span>{trimmedPoint}</span>
                  </div>
                );
              })}
            </div>
          );
        }
        
        if (trimmedSection.match(/^\d+\.|^[•\-\*]/)) {
          const lines = trimmedSection.split('\n');
          return (
            <div key={index} className="space-y-2">
              {lines.map((line, lineIndex) => {
                const trimmedLine = line.trim();
                
                if (trimmedLine.match(/^\d+\./)) {
                  const number = trimmedLine.match(/^\d+\./)?.[0];
                  const content = trimmedLine.replace(/^\d+\.\s*/, '');
                  
                  if (content.includes('**')) {
                    const parts = content.split('**');
                    return (
                      <div key={lineIndex} className="flex items-start space-x-2">
                        <span className="text-[color:var(--color-blue)] mt-1 font-medium">{number}</span>
                        <span>
                          {parts.map((part, partIndex) => 
                            partIndex % 2 === 1 ? (
                              <strong key={partIndex} className="font-semibold">{part}</strong>
                            ) : (
                              part
                            )
                          )}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={lineIndex} className="flex items-start space-x-2">
                      <span className="text-[color:var(--color-blue)] mt-1 font-medium">{number}</span>
                      <span>{content}</span>
                    </div>
                  );
                }
                
                if (trimmedLine.match(/^[•\-\*]/)) {
                  const bullet = '•';
                  const content = trimmedLine.replace(/^[•\-\*]\s*/, '');
                  
                  if (content.includes('**')) {
                    const parts = content.split('**');
                    return (
                      <div key={lineIndex} className="flex items-start space-x-2">
                        <span className="text-[color:var(--color-blue)] mt-1">{bullet}</span>
                        <span>
                          {parts.map((part, partIndex) => 
                            partIndex % 2 === 1 ? (
                              <strong key={partIndex} className="font-semibold">{part}</strong>
                            ) : (
                              part
                            )
                          )}
                        </span>
                      </div>
                    );
                  }
                  return (
                    <div key={lineIndex} className="flex items-start space-x-2">
                      <span className="text-[color:var(--color-blue)] mt-1">{bullet}</span>
                      <span>{content}</span>
                    </div>
                  );
                }
                return <p key={lineIndex}>{trimmedLine}</p>;
              })}
            </div>
          );
        }
        
        return (
          <p key={index} className="leading-relaxed">
            {trimmedSection}
          </p>
        );
      })}
    </div>
  );
};

export default function LearnAI() {
  const [activeTab, setActiveTab] = useState('flashcards')
  const [loading, setLoading] = useState(false)
  const { theme, toggleTheme } = useTheme()

  // Flashcard states
  const [notes, setNotes] = useState('')
  const [flashcards, setFlashcards] = useState<Flashcard[]>([])
  const [currentCard, setCurrentCard] = useState(0)
  const [flipped, setFlipped] = useState(false)
  
  // Quiz states
  const [quizText, setQuizText] = useState('')
  const [quiz, setQuiz] = useState<QuizQuestion[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [userAnswers, setUserAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  
  // Study Buddy states
  const [question, setQuestion] = useState('')
  const [answer, setAnswer] = useState('')
  const [chatHistory, setChatHistory] = useState<{question: string, answer: string}[]>([])

  // Sidebar states
  const [streak, setStreak] = useState(7)
  const [dailyGoals, setDailyGoals] = useState({
    flashcards: { target: 10, completed: 0 },
    quizzes: { target: 5, completed: 0 },
    notes: { target: 3, completed: 0 }
  })
  const [savedNotes, setSavedNotes] = useState<{title: string, content: string, subject: string, date: string}[]>([])

  const generateFlashcards = async () => {
    if (!notes.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/flashcards', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      })
      
      const data = await response.json()
      if (data.flashcards) {
        setFlashcards(data.flashcards)
        setCurrentCard(0)
        setFlipped(false)
        
        setDailyGoals(prev => ({
          ...prev,
          flashcards: { ...prev.flashcards, completed: prev.flashcards.completed + 1 }
        }))
      }
    } catch (error) {
      console.error('Error generating flashcards:', error)
    }
    setLoading(false)
  }

  const calculateQuizTime = (questionCount: number) => {
    const baseTime = 3 * 60
    const baseQuestions = 5
    const timePerQuestion = baseTime / baseQuestions
    return Math.round(questionCount * timePerQuestion)
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  const generateQuiz = async () => {
    if (!quizText.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: quizText })
      })
      
      const data = await response.json()
      if (data.quiz) {
        setQuiz(data.quiz)
        setCurrentQuestion(0)
        setSelectedAnswer(null)
        setShowResults(false)
        setScore(0)
        setUserAnswers([])
        
        const quizTime = calculateQuizTime(data.quiz.length)
        setTimeLeft(quizTime)
        setIsTimerRunning(true)
        
        setDailyGoals(prev => ({
          ...prev,
          quizzes: { ...prev.quizzes, completed: prev.quizzes.completed + 1 }
        }))
      }
    } catch (error) {
      console.error('Error generating quiz:', error)
    }
    setLoading(false)
  }

  const askStudyBuddy = async () => {
    if (!question.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('/api/study-buddy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question })
      })
      
      const data = await response.json()
      if (data.answer) {
        const newChat = { question, answer: data.answer }
        setChatHistory(prev => [...prev, newChat])
        setAnswer(data.answer)
        setQuestion('')
        
        setDailyGoals(prev => ({
          ...prev,
          notes: { ...prev.notes, completed: prev.notes.completed + 1 }
        }))
      }
    } catch (error) {
      console.error('Error asking study buddy:', error)
    }
    setLoading(false)
  }

  const saveNote = (title: string, content: string, subject: string) => {
    const newNote = {
      title,
      content,
      subject,
      date: new Date().toLocaleDateString()
    }
    setSavedNotes(prev => [...prev, newNote])
  }

  const nextCard = () => {
    if (currentCard < flashcards.length - 1) {
      setCurrentCard(currentCard + 1)
      setFlipped(false)
    }
  }

  const prevCard = () => {
    if (currentCard > 0) {
      setCurrentCard(currentCard - 1)
      setFlipped(false)
    }
  }

  const selectAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
    
    const newUserAnswers = [...userAnswers]
    newUserAnswers[currentQuestion] = answerIndex
    setUserAnswers(newUserAnswers)
    
    if (answerIndex === quiz[currentQuestion].correct) {
      setScore(score + 1)
    }
    
    setTimeout(() => {
      if (currentQuestion < quiz.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer(null)
      } else {
        setShowResults(true)
      }
    }, 500)
  }

  useEffect(() => {
    const isTypingTarget = (t: EventTarget | null) => {
      const el = t as HTMLElement | null
      if (!el) return false
      const tag = el.tagName?.toLowerCase()
      return tag === 'input' || tag === 'textarea' || el.isContentEditable === true
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeTab !== 'flashcards') return

      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (!flashcards.length) generateFlashcards()
        return
      }

      if (isTypingTarget(e.target)) return

      if (!flashcards.length) return

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault()
          nextCard()
          break
        case 'ArrowLeft':
          e.preventDefault()
          prevCard()
          break
        case ' ':
          e.preventDefault()
          setFlipped(prev => !prev)
          break
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeTab, flashcards.length, currentCard, notes])

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null
    
    if (isTimerRunning && timeLeft > 0 && !showResults) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false)
            setShowResults(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else if (timeLeft === 0 && isTimerRunning) {
      setIsTimerRunning(false)
    }
    
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isTimerRunning, timeLeft, showResults])

  return (
    <div className="page-gradient">
      <div className="container mx-auto px-4 py-8 relative">
        <div className="absolute top-2 right-2 z-10">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 rounded-lg shadow-lg bg-[color:var(--button-bg-primary)] text-white hover:bg-[color:var(--button-bg-primary-hover)] transition-all duration-300 font-medium backdrop-blur-sm border border-white/20 hover:scale-105"
            title="Toggle theme"
          >
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>

        <div className="text-center mb-8">
          <div className="flex justify-center items-center mb-4">
            <div className="relative group">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/50 relative overflow-hidden transition-all duration-300 group-hover:scale-105 group-hover:shadow-blue-400/60">
                <div className="text-4xl font-bold text-white relative z-10">R</div>
                
                <div className="absolute inset-0 bg-gradient-to-br from-blue-300/20 to-blue-700/30 rounded-2xl">
                  <div className="absolute top-3 right-3 w-6 h-4 bg-blue-200/50 rounded-full"></div>
                  <div className="absolute bottom-4 left-4 w-3 h-3 bg-blue-300/60 rounded-full"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400/70 rounded-full"></div>
                  <div className="absolute top-1/3 left-1/3 w-2 h-2 bg-blue-300/50 rounded-full"></div>
                  <div className="absolute bottom-1/3 right-1/3 w-2 h-2 bg-blue-300/50 rounded-full"></div>
                  
                  <div className="absolute top-1/2 left-0 w-1 h-8 bg-gradient-to-b from-blue-300/40 to-transparent"></div>
                  <div className="absolute top-0 left-1/2 w-8 h-1 bg-gradient-to-r from-blue-300/40 to-transparent"></div>
                  <div className="absolute bottom-0 right-1/2 w-6 h-1 bg-gradient-to-l from-blue-300/40 to-transparent"></div>
                </div>
                
                <div className="absolute inset-0 bg-blue-400/20 rounded-2xl blur-xl animate-pulse"></div>
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-transparent rounded-2xl"></div>
              </div>
              
              <div className="absolute -inset-2 bg-blue-400/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
          </div>
          
          <h1 className="text-4xl font-bold text-[color:var(--text-primary)] mb-2">Recallify</h1>
          
          <p className="text-[color:var(--text-secondary)] text-lg">AI-Powered Educational Tools</p>
          <p className="text-[color:var(--text-primary)] font-semibold text-xl mt-2">Turn Learning into a Game 🎮</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="gradient-card rounded-lg p-2 flex space-x-2 shadow-xl">
            {[
              { id: 'flashcards', label: '🃏 Flashcards', desc: 'Make Flashcards' },
              { id: 'quiz', label: '📝 Quiz', desc: 'Create Quiz' },
              { id: 'study-buddy', label: '🤖 Study Buddy', desc: 'Ask Questions' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-lg transition-all duration-300 ${
                  activeTab === tab.id
                  ? 'bg-[color:var(--button-bg-primary)] text-white shadow-lg'
                  : 'text-[color:var(--text-secondary)] hover:bg-[color:var(--button-bg-secondary)]/50 hover:scale-105'
                }`}
              >
                <div className="text-sm font-medium">{tab.label}</div>
                <div className="text-xs opacity-75">{tab.desc}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-8">
          <div className="w-80 flex-shrink-0">
            <div className="gradient-card rounded-xl p-6 shadow-xl mb-6">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-[color:var(--text-primary)] mb-2">🔥 {streak}</div>
                <div className="text-[color:var(--text-secondary)] text-sm">Day Streak</div>
              </div>
              
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-[color:var(--text-primary)] text-center">Daily Goals</h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[color:var(--text-secondary)]">📚 Flashcards</span>
                    <span className="text-[color:var(--text-primary)] font-medium">
                      {dailyGoals.flashcards.completed}/{dailyGoals.flashcards.target}
                    </span>
                  </div>
                  <div className="w-full bg-[color:var(--bg-secondary)]/20 rounded-full h-2">
                    <div 
                      className="bg-[color:var(--color-green)] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((dailyGoals.flashcards.completed / dailyGoals.flashcards.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[color:var(--text-secondary)]">📝 Quizzes</span>
                    <span className="text-[color:var(--text-primary)] font-medium">
                      {dailyGoals.quizzes.completed}/{dailyGoals.quizzes.target}
                    </span>
                  </div>
                  <div className="w-full bg-[color:var(--bg-secondary)]/20 rounded-full h-2">
                    <div 
                      className="bg-[color:var(--color-blue)] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((dailyGoals.quizzes.completed / dailyGoals.quizzes.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-[color:var(--text-secondary)]">📖 Notes</span>
                    <span className="text-[color:var(--text-primary)] font-medium">
                      {dailyGoals.notes.completed}/{dailyGoals.notes.target}
                    </span>
                  </div>
                  <div className="w-full bg-[color:var(--bg-secondary)]/20 rounded-full h-2">
                    <div 
                      className="bg-[color:var(--color-purple)] h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((dailyGoals.notes.completed / dailyGoals.notes.target) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="gradient-card rounded-xl p-6 shadow-xl mb-6">
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)] mb-4 text-center">📚 Subjects</h3>
              <div className="space-y-3">
                <a 
                  href="https://www.khanacademy.org/math" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-[color:var(--button-bg-primary)]/10 hover:bg-[color:var(--button-bg-primary)]/20 text-[color:var(--text-primary)] rounded-lg transition-all duration-200 hover:scale-105 text-center font-medium"
                >
                  🧮 Mathematics
                </a>
                <a 
                  href="https://www.khanacademy.org/science/physics" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-[color:var(--button-bg-primary)]/10 hover:bg-[color:var(--button-bg-primary)]/20 text-[color:var(--text-primary)] rounded-lg transition-all duration-200 hover:scale-105 text-center font-medium"
                >
                  ⚡ Physics
                </a>
                <a 
                  href="https://www.khanacademy.org/science/chemistry" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="block p-3 bg-[color:var(--button-bg-primary)]/10 hover:bg-[color:var(--button-bg-primary)]/20 text-[color:var(--text-primary)] rounded-lg transition-all duration-200 hover:scale-105 text-center font-medium"
                >
                  🧪 Chemistry
                </a>
              </div>
            </div>

            <div className="gradient-card rounded-xl p-6 shadow-xl">
              <h3 className="text-lg font-semibold text-[color:var(--text-primary)] mb-4 text-center">💾 Saved Notes</h3>
              {savedNotes.length === 0 ? (
                <p className="text-[color:var(--text-secondary)] text-sm text-center">No notes saved yet</p>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {savedNotes.map((note, index) => (
                    <div key={index} className="p-3 bg-[color:var(--bg-secondary)]/10 rounded-lg">
                      <div className="text-[color:var(--text-primary)] font-medium text-sm">{note.title}</div>
                      <div className="text-[color:var(--text-secondary)] text-xs">{note.subject}</div>
                      <div className="text-[color:var(--text-secondary)] text-xs">{note.date}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-1">
            {activeTab === 'flashcards' && (
              <div className="gradient-card rounded-xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-[color:var(--text-primary)] mb-4">🃏 Flashcard Maker</h2>
                
                {flashcards.length === 0 ? (
                  <div>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Paste your study notes here and I'll create flashcards for you..."
                      className="w-full h-40 p-4 rounded-lg border border-[color:var(--input-border)] bg-[color:var(--input-bg)] text-[color:var(--input-text)] placeholder-[color:var(--input-placeholder)] focus:ring-2 focus:ring-[color:var(--input-focus-ring)] focus:border-[color:var(--input-focus-ring)] transition-all duration-200"
                    />
                    <button
                      onClick={generateFlashcards}
                      disabled={loading || !notes.trim()}
                      className="mt-4 px-6 py-3 bg-[color:var(--button-bg-primary)] hover:bg-[color:var(--button-bg-primary-hover)] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {loading ? 'Generating...' : 'Generate Flashcards'}
                    </button>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4 text-[color:var(--text-primary)]">
                      Card {currentCard + 1} of {flashcards.length}
                    </div>
                    
                    <div 
                      className={`flashcard ${flipped ? 'flipped' : ''} mb-6 cursor-pointer`}
                      onClick={() => setFlipped(!flipped)}
                    >
                      <div className="flashcard-inner">
                        <div className="flashcard-front">
                          <p className="text-lg font-medium">{flashcards[currentCard]?.front}</p>
                        </div>
                        <div className="flashcard-back">
                          <p className="text-lg">{flashcards[currentCard]?.back}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={prevCard}
                        disabled={currentCard === 0}
                        className="px-4 py-2 bg-[color:var(--button-bg-secondary)] hover:bg-[color:var(--button-bg-secondary-hover)] text-white rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setFlashcards([])}
                        className="px-4 py-2 bg-[color:var(--color-red)] hover:bg-red-600 text-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        New Flashcards
                      </button>
                      <button
                        onClick={nextCard}
                        disabled={currentCard === flashcards.length - 1}
                        className="px-4 py-2 bg-[color:var(--button-bg-secondary)] hover:bg-[color:var(--button-bg-secondary-hover)] text-white rounded-lg disabled:opacity-50 shadow-md hover:shadow-lg transition-all duration-200"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'quiz' && (
              <div className="gradient-card rounded-xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-[color:var(--text-primary)] mb-4">📝 Quiz Maker</h2>
                
                {quiz.length === 0 && !showResults ? (
                  <div>
                    <div className="mb-4 p-4 bg-[color:var(--bg-accent)]/10 rounded-lg border border-[color:var(--bg-accent)]/20">
                      <h4 className="text-lg font-semibold text-[color:var(--text-primary)] mb-2">⏱️ Quiz Timer Information</h4>
                      <p className="text-[color:var(--text-secondary)] text-sm">
                        • <strong>5 questions:</strong> 3 minutes (36 seconds per question)<br/>
                        • <strong>10 questions:</strong> 6 minutes (36 seconds per question)<br/>
                        • <strong>15 questions:</strong> 9 minutes (36 seconds per question)<br/>
                        • <strong>20 questions:</strong> 12 minutes (36 seconds per question)
                      </p>
                      <p className="text-[color:var(--text-primary)] text-sm mt-2">
                        ⚠️ Quiz will auto-submit when time runs out!
                      </p>
                    </div>
                    <textarea
                      value={quizText}
                      onChange={(e) => setQuizText(e.target.value)}
                      placeholder="Paste text here and I'll create a quiz for you..."
                      className="w-full h-40 p-4 rounded-lg border border-[color:var(--input-border)] bg-[color:var(--input-bg)] text-[color:var(--input-text)] placeholder-[color:var(--input-placeholder)] focus:ring-2 focus:ring-[color:var(--input-focus-ring)] focus:border-[color:var(--input-focus-ring)] transition-all duration-200"
                    />
                    <button
                      onClick={generateQuiz}
                      disabled={loading || !quizText.trim()}
                      className="mt-4 px-6 py-3 bg-[color:var(--color-green)] hover:bg-[color:var(--color-green-hover)] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {loading ? 'Creating Quiz...' : 'Create Quiz'}
                    </button>
                  </div>
                ) : showResults ? (
                  <div className="space-y-6">
                    <div className="text-center">
                      <h3 className="text-3xl font-bold text-[color:var(--text-primary)] mb-4">
                        {timeLeft === 0 ? '⏰ Time\'s Up!' : '🎉 Quiz Complete!'}
                      </h3>
                      {timeLeft === 0 && (
                        <div className="mb-4 p-4 bg-[color:var(--color-red)]/20 border border-[color:var(--color-red)]/30 rounded-lg">
                          <p className="text-[color:var(--color-red)] font-semibold">
                            ⚠️ Quiz auto-submitted when time ran out!
                          </p>
                        </div>
                      )}
                      <div className="bg-[color:var(--bg-secondary)]/20 rounded-xl p-6 mb-6">
                        <p className="text-2xl font-bold text-[color:var(--text-primary)] mb-2">
                          Final Score: {score} out of {quiz.length}
                        </p>
                        <p className="text-xl text-[color:var(--text-primary)] mb-4">
                          Percentage: {Math.round((score / quiz.length) * 100)}%
                        </p>
                        <div className="text-lg text-[color:var(--text-primary)]">
                          {Math.round((score / quiz.length) * 100) >= 90 ? (
                            <span className="text-[color:var(--color-green)] font-semibold">🌟 Excellent! Outstanding performance!</span>
                          ) : Math.round((score / quiz.length) * 100) >= 80 ? (
                            <span className="text-[color:var(--color-green)] font-semibold">🎯 Great job! Well done!</span>
                          ) : Math.round((score / quiz.length) * 100) >= 70 ? (
                            <span className="text-[color:var(--color-blue)] font-semibold">👍 Good work! Keep it up!</span>
                          ) : Math.round((score / quiz.length) * 100) >= 60 ? (
                            <span className="text-[color:var(--color-purple)] font-semibold">📚 Not bad! Room for improvement.</span>
                          ) : (
                            <span className="text-[color:var(--color-red)] font-semibold">💪 Keep studying! You'll get better!</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-xl font-bold text-[color:var(--text-primary)] text-center mb-4">📋 Question Review</h4>
                      {quiz.map((question, qIndex) => (
                        <div key={qIndex} className="bg-[color:var(--bg-secondary)]/10 rounded-lg p-4 space-y-3">
                          <div className="flex items-start justify-between">
                            <h5 className="text-lg font-semibold text-[color:var(--text-primary)]">
                              Question {qIndex + 1}
                            </h5>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                              userAnswers[qIndex] === question.correct
                                ? 'bg-[color:var(--color-green)] text-white'
                                : 'bg-[color:var(--color-red)] text-white'
                            }`}>
                              {userAnswers[qIndex] === question.correct ? '✓ Correct' : '✗ Incorrect'}
                            </span>
                          </div>
                          
                          <p className="text-[color:var(--text-primary)] font-medium">{question.question}</p>
                          
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className={`p-3 rounded-lg border-2 ${
                                oIndex === question.correct
                                  ? 'border-[color:var(--color-green)] bg-[color:var(--color-green)]/10'
                                  : oIndex === userAnswers[qIndex] && oIndex !== question.correct
                                  ? 'border-[color:var(--color-red)] bg-[color:var(--color-red)]/10'
                                  : 'border-[color:var(--input-border)] bg-[color:var(--bg-secondary)]/5'
                              }`}>
                                <div className="flex items-center space-x-2">
                                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                                    oIndex === question.correct
                                      ? 'bg-[color:var(--color-green)] text-white'
                                      : oIndex === userAnswers[qIndex] && oIndex !== question.correct
                                      ? 'bg-[color:var(--color-red)] text-white'
                                      : 'bg-[color:var(--bg-secondary)] text-[color:var(--text-secondary)]'
                                  }`}>
                                    {oIndex === question.correct ? '✓' : oIndex === userAnswers[qIndex] && oIndex !== question.correct ? '✗' : String.fromCharCode(65 + oIndex)}
                                  </span>
                                  <span className={`${
                                    oIndex === question.correct
                                      ? 'text-[color:var(--color-green)] font-semibold'
                                      : oIndex === userAnswers[qIndex] && oIndex !== question.correct
                                      ? 'text-[color:var(--color-red)] font-semibold'
                                      : 'text-[color:var(--text-primary)]'
                                  }`}>
                                    {option}
                                  </span>
                                  {oIndex === question.correct && (
                                    <span className="text-[color:var(--color-green)] font-semibold text-sm">(Correct Answer)</span>
                                  )}
                                  {oIndex === userAnswers[qIndex] && oIndex !== question.correct && (
                                    <span className="text-[color:var(--color-red)] font-semibold text-sm">(Your Answer)</span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                          
                          <div className="mt-3 p-3 bg-[color:var(--bg-accent)]/10 rounded-lg">
                            <p className="text-[color:var(--text-primary)] font-medium">💡 Explanation:</p>
                            <p className="text-[color:var(--text-primary)]/90">{question.explanation}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="text-center space-x-4">
                      <button
                        onClick={() => {
                          setQuiz([])
                          setShowResults(false)
                          setScore(0)
                          setSelectedAnswer(null)
                          setUserAnswers([])
                          setTimeLeft(0)
                          setIsTimerRunning(false)
                        }}
                        className="px-6 py-3 bg-[color:var(--button-bg-primary)] hover:bg-[color:var(--button-bg-primary-hover)] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Take Another Quiz
                      </button>
                      <button
                        onClick={() => {
                          setCurrentQuestion(0)
                          setShowResults(false)
                          setSelectedAnswer(null)
                          setUserAnswers([])
                          setTimeLeft(0)
                          setIsTimerRunning(false)
                        }}
                        className="px-6 py-3 bg-[color:var(--button-bg-secondary)] hover:bg-[color:var(--button-bg-secondary-hover)] text-white rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                      >
                        Review Quiz Again
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[color:var(--text-primary)] mb-2">
                        <span className="font-medium">Question {currentQuestion + 1} of {quiz.length}</span>
                        <div className="flex items-center space-x-4">
                          <span className="text-sm text-[color:var(--text-secondary)]">
                            {Math.round(((currentQuestion + 1) / quiz.length) * 100)}% Complete
                          </span>
                          <div className={`flex items-center space-x-2 px-3 py-1 rounded-lg font-mono text-lg font-bold ${
                            timeLeft <= 30 
                              ? 'bg-[color:var(--color-red)] text-white' 
                              : timeLeft <= 60 
                              ? 'bg-[color:var(--color-purple)] text-white'
                              : 'bg-[color:var(--color-blue)] text-white'
                          }`}>
                            <span className="text-sm">⏱️</span>
                            <span>{formatTime(timeLeft)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="w-full bg-[color:var(--bg-secondary)]/20 rounded-full h-2">
                        <div 
                          className="bg-[color:var(--color-blue)] h-2 rounded-full transition-all duration-300"
                          style={{ width: `${((currentQuestion + 1) / quiz.length) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-[color:var(--text-primary)] mb-4">
                        {quiz[currentQuestion]?.question}
                      </h3>
                      
                      <div className="space-y-3">
                        {quiz[currentQuestion]?.options.map((option, index) => (
                          <button
                            key={index}
                            onClick={() => selectAnswer(index)}
                            disabled={selectedAnswer !== null}
                            className={`w-full p-4 text-left rounded-lg transition-all quiz-option ${
                              selectedAnswer === null
                                ? 'bg-[color:var(--bg-secondary)]/20 text-[color:var(--text-primary)] hover:bg-[color:var(--bg-secondary)]/30'
                                : 'bg-[color:var(--bg-secondary)]/10 text-[color:var(--text-secondary)]/60'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      
                      {selectedAnswer !== null && (
                        <div className="mt-4 p-4 bg-[color:var(--bg-secondary)]/20 rounded-lg">
                          <p className="text-[color:var(--text-primary)] font-medium">Moving to next question...</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'study-buddy' && (
              <div className="gradient-card rounded-xl p-6 shadow-xl">
                <h2 className="text-2xl font-bold text-[color:var(--text-primary)] mb-4">🤖 Ask-Me Study Buddy</h2>
                
                <div className="mb-6">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask me anything you want to learn about..."
                      className="flex-1 p-4 rounded-lg border border-[color:var(--input-border)] bg-[color:var(--input-bg)] text-[color:var(--input-text)] placeholder-[color:var(--input-placeholder)] focus:ring-2 focus:ring-[color:var(--input-focus-ring)] focus:border-[color:var(--input-focus-ring)] transition-all duration-200"
                      onKeyDown={(e) => e.key === 'Enter' && askStudyBuddy()}
                    />
                    <button
                      onClick={askStudyBuddy}
                      disabled={loading || !question.trim()}
                      className="px-6 py-3 bg-[color:var(--color-purple)] hover:bg-[color:var(--color-purple-hover)] text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      {loading ? 'Thinking...' : 'Ask'}
                    </button>
                  </div>
                </div>

                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {chatHistory.map((chat, index) => (
                    <div key={index} className="space-y-2">
                      <div className="bg-[color:var(--color-blue)]/20 p-4 rounded-lg">
                        <p className="text-[color:var(--text-primary)] font-medium">You:</p>
                        <p className="text-[color:var(--text-primary)]/90">{chat.question}</p>
                      </div>
                      <div className="bg-[color:var(--color-green)]/20 p-4 rounded-lg">
                        <p className="text-[color:var(--text-primary)] font-medium">Study Buddy:</p>
                        <div className="text-[color:var(--text-primary)]/90 prose prose-sm max-w-none">
                          {formatStudyBuddyResponse(chat.answer)}
                        </div>
                        <button
                          onClick={() => saveNote(`Study Note ${index + 1}`, chat.answer, 'General')}
                          className="mt-3 px-4 py-2 bg-[color:var(--color-purple)] hover:bg-[color:var(--color-purple-hover)] text-white text-sm rounded-lg transition-all duration-200 hover:scale-105"
                        >
                          💾 Save Note
                        </button>
                      </div>
                    </div>
                  ))}
                  
                  {chatHistory.length === 0 && (
                    <div className="text-center text-[color:var(--text-secondary)]/60 py-8">
                      Ask me anything and I'll help you learn! I can explain concepts, provide examples, and answer your questions.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
