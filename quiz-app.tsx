"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Clock, Trophy, RotateCcw, CheckCircle, XCircle } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
  category: string
}

interface QuizResult {
  questionId: number
  selectedAnswer: number
  isCorrect: boolean
  timeSpent: number
}

const QUIZ_QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What is the capital of France?",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: 2,
    category: "Geography",
  },
  {
    id: 2,
    question: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctAnswer: 1,
    category: "Science",
  },
  {
    id: 3,
    question: "What is the largest mammal in the world?",
    options: ["African Elephant", "Blue Whale", "Giraffe", "Polar Bear"],
    correctAnswer: 1,
    category: "Biology",
  },
  {
    id: 4,
    question: "In which year did World War II end?",
    options: ["1944", "1945", "1946", "1947"],
    correctAnswer: 1,
    category: "History",
  },
  {
    id: 5,
    question: "What is the chemical symbol for gold?",
    options: ["Go", "Gd", "Au", "Ag"],
    correctAnswer: 2,
    category: "Chemistry",
  },
  {
    id: 6,
    question: "Which programming language is known for its use in web development?",
    options: ["Python", "JavaScript", "C++", "Java"],
    correctAnswer: 1,
    category: "Technology",
  },
  {
    id: 7,
    question: "What is the smallest country in the world?",
    options: ["Monaco", "Nauru", "Vatican City", "San Marino"],
    correctAnswer: 2,
    category: "Geography",
  },
  {
    id: 8,
    question: "Who painted the Mona Lisa?",
    options: ["Vincent van Gogh", "Pablo Picasso", "Leonardo da Vinci", "Michelangelo"],
    correctAnswer: 2,
    category: "Art",
  },
]

const TIME_PER_QUESTION = 30 // seconds

export default function QuizApp() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION)
  const [quizResults, setQuizResults] = useState<QuizResult[]>([])
  const [quizState, setQuizState] = useState<"start" | "playing" | "finished">("start")
  const [questionStartTime, setQuestionStartTime] = useState(Date.now())

  const currentQuestion = QUIZ_QUESTIONS[currentQuestionIndex]
  const totalQuestions = QUIZ_QUESTIONS.length
  const correctAnswers = quizResults.filter((result) => result.isCorrect).length
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100)

  // Timer effect
  useEffect(() => {
    if (quizState !== "playing") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleNextQuestion()
          return TIME_PER_QUESTION
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizState, currentQuestionIndex])

  const startQuiz = () => {
    setQuizState("playing")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setTimeLeft(TIME_PER_QUESTION)
    setQuizResults([])
    setQuestionStartTime(Date.now())
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNextQuestion = () => {
    const timeSpent = Math.round((Date.now() - questionStartTime) / 1000)
    const isCorrect = selectedAnswer === currentQuestion.correctAnswer

    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: selectedAnswer ?? -1,
      isCorrect,
      timeSpent,
    }

    setQuizResults((prev) => [...prev, result])

    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setTimeLeft(TIME_PER_QUESTION)
      setQuestionStartTime(Date.now())
    } else {
      setQuizState("finished")
    }
  }

  const restartQuiz = () => {
    setQuizState("start")
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setTimeLeft(TIME_PER_QUESTION)
    setQuizResults([])
  }

  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-600"
    if (scorePercentage >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreMessage = () => {
    if (scorePercentage >= 90) return "Excellent! Outstanding performance!"
    if (scorePercentage >= 80) return "Great job! Well done!"
    if (scorePercentage >= 70) return "Good work! Keep it up!"
    if (scorePercentage >= 60) return "Not bad! Room for improvement."
    return "Keep practicing! You'll do better next time."
  }

  if (quizState === "start") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Trophy className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl">Quiz Challenge</CardTitle>
            <CardDescription>Test your knowledge with {totalQuestions} questions across various topics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold">{totalQuestions}</div>
                <div className="text-gray-600">Questions</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="font-semibold">{TIME_PER_QUESTION}s</div>
                <div className="text-gray-600">Per Question</div>
              </div>
            </div>
            <Button onClick={startQuiz} className="w-full" size="lg">
              Start Quiz
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizState === "finished") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
              <Trophy className={`w-10 h-10 ${getScoreColor()}`} />
            </div>
            <CardTitle className="text-3xl">Quiz Complete!</CardTitle>
            <CardDescription className="text-lg">{getScoreMessage()}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor()}`}>{scorePercentage}%</div>
              <div className="text-gray-600 mt-2">
                {correctAnswers} out of {totalQuestions} correct
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <div className="font-semibold text-green-800">{correctAnswers}</div>
                <div className="text-green-600 text-sm">Correct</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <XCircle className="w-8 h-8 text-red-600 mx-auto mb-2" />
                <div className="font-semibold text-red-800">{totalQuestions - correctAnswers}</div>
                <div className="text-red-600 text-sm">Incorrect</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <div className="font-semibold text-blue-800">
                  {Math.round(quizResults.reduce((acc, result) => acc + result.timeSpent, 0) / totalQuestions)}s
                </div>
                <div className="text-blue-600 text-sm">Avg. Time</div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Question Review</h3>
              <div className="max-h-60 overflow-y-auto space-y-2">
                {QUIZ_QUESTIONS.map((question, index) => {
                  const result = quizResults[index]
                  return (
                    <div key={question.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {result?.isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600" />
                        )}
                        <span className="text-sm">Question {index + 1}</span>
                        <Badge variant="secondary" className="text-xs">
                          {question.category}
                        </Badge>
                      </div>
                      <span className="text-sm text-gray-600">{result?.timeSpent}s</span>
                    </div>
                  )
                })}
              </div>
            </div>

            <Button onClick={restartQuiz} className="w-full" size="lg">
              <RotateCcw className="w-4 h-4 mr-2" />
              Take Quiz Again
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">
                Question {currentQuestionIndex + 1} of {totalQuestions}
              </CardTitle>
              <CardDescription>
                <Badge variant="secondary" className="mt-1">
                  {currentQuestion.category}
                </Badge>
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-5 h-5 text-blue-600" />
              <span className={`font-bold text-lg ${timeLeft <= 10 ? "text-red-600" : "text-blue-600"}`}>
                {timeLeft}s
              </span>
            </div>
          </div>
          <Progress value={(currentQuestionIndex / totalQuestions) * 100} className="mt-4" />
        </CardHeader>
        <CardContent className="space-y-6">
          <h2 className="text-xl font-semibold leading-relaxed">{currentQuestion.question}</h2>

          <div className="grid gap-3">
            {currentQuestion.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === index ? "default" : "outline"}
                className="justify-start text-left h-auto p-4 whitespace-normal"
                onClick={() => handleAnswerSelect(index)}
              >
                <span className="font-semibold mr-3">{String.fromCharCode(65 + index)}.</span>
                {option}
              </Button>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-gray-600">
              Score: {correctAnswers}/{currentQuestionIndex} correct
            </div>
            <Button onClick={handleNextQuestion} disabled={selectedAnswer === null} size="lg">
              {currentQuestionIndex === totalQuestions - 1 ? "Finish Quiz" : "Next Question"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
