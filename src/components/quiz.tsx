'use client';

import React, { useState, useEffect } from 'react';

interface Question {
  id: number;
  text: string;
  options: string[];
  correct_answer: string;
}

const Quiz: React.FC = () => {
  // All hooks declared at the top
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [answered, setAnswered] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(15); // Timer: 15 seconds
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);

  // Fetch questions on mount
  useEffect(() => {
    fetch('http://localhost:5000/api/questions')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        return res.json();
      })
      .then((data) => setQuestions(data))
      .catch((err) => console.error('Fetch error:', err));
  }, []);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(15);
    setIsTimeUp(false);
  }, [currentQuestionIndex]);

  // Countdown timer logic
  useEffect(() => {
    if (answered || isTimeUp || !questions.length) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsTimeUp(true);
          setAnswered(true); // Auto-mark as answered
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [answered, isTimeUp, questions.length]);

  const handleAnswer = (option: string) => {
    if (!questions[currentQuestionIndex]) return;
    setSelectedOption(option);
    if (option === questions[currentQuestionIndex].correct_answer) {
      setScore(score + 1);
    }
    setAnswered(true);
  };

  const handleNext = () => {
    setAnswered(false);
    setSelectedOption(null);
    setCurrentQuestionIndex(currentQuestionIndex + 1);
  };

  const handleReset = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setAnswered(false);
    setSelectedOption(null);
    setTimeLeft(15);
    setIsTimeUp(false);
  };

  // Early return for loading state
  if (!questions.length) return <p className="text-center text-gray-600">Loading...</p>;

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercentage = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md animate-fade animate-once animate-duration-500">
      {/* Progress Bar and Timer */}
      <div className="mb-6">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="h-2.5 rounded-full transition-all duration-300 progress-gradient"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          Question {currentQuestionIndex + 1} of {questions.length}
        </p>
        <p className={`text-sm mt-2 ${timeLeft <= 5 ? 'text-red-500 font-bold' : 'text-gray-600'}`}>
          Time Left: {timeLeft}s
        </p>
      </div>

      {/* Question */}
      <h2 className="text-2xl font-semibold text-gray-800 mb-4 animate-slide-in-top animate-once animate-duration-500">
        {currentQuestion.text}
      </h2>

      {/* Options */}
      <div className="space-y-2">
        {currentQuestion.options.map((option, index) => (
          <button
            key={option}
            onClick={() => handleAnswer(option)}
            disabled={answered || isTimeUp}
            className={`w-full p-3 text-left rounded-md transition-transform duration-200 ${
              answered || isTimeUp
                ? option === currentQuestion.correct_answer
                  ? 'bg-green-500 text-white'
                  : option === selectedOption
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200'
                : 'bg-blue-500 text-white hover:bg-blue-600 hover:scale-105'
            } animate-scale-in animate-once animate-duration-500 animate-delay-${index * 100}`}
            aria-label={`Select ${option}`}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Feedback */}
      {(answered || isTimeUp) && (
        <p className="mt-4 text-lg animate-slide-in-bottom animate-once animate-duration-500 text-gray-500">
          {isTimeUp && !selectedOption
            ? `Time's up! The answer is ${currentQuestion.correct_answer}.`
            : selectedOption === currentQuestion.correct_answer
            ? 'Correct!'
            : `Incorrect! The answer is ${currentQuestion.correct_answer}.`}{' '}
          Score: {score}
        </p>
      )}

      {/* Next Button */}
      {(answered || isTimeUp) && currentQuestionIndex < questions.length - 1 && (
        <button
          onClick={handleNext}
          className="mt-4 w-full p-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors animate-fade animate-once animate-duration-500"
        >
          Next Question
        </button>
      )}

      {/* End of Quiz */}
      {(answered || isTimeUp) && currentQuestionIndex === questions.length - 1 && (
        <div className="mt-4">
          <p className="text-lg font-bold animate-fade animate-once animate-duration-500 text-green-700">
            Quiz Complete! Final Score: {score}/{questions.length}
          </p>
          <button
            onClick={handleReset}
            className="mt-4 w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors animate-fade animate-once animate-duration-500"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default React.memo(Quiz);