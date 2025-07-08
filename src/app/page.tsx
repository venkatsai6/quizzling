"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import Quiz from "@/components/quiz";
import Starfield from "@/components/starfield";
import { Orbitron } from "next/font/google";
const orbitron = Orbitron({ subsets: ["latin"] });
// Apply in h1:

const Home: React.FC = () => {
  const [showQuiz, setShowQuiz] = useState(false);
  const titleRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const quizRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (button) {
      button.addEventListener("mouseenter", () => {
        gsap.to(button, { scale: 1.1, duration: 0.3, ease: "power2.out" });
      });
      button.addEventListener("mouseleave", () => {
        gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" });
      });
    }
    // Animate the title
    const title = titleRef.current;
    if (title) {
      // Split text into spans for letter-by-letter animation
      const letters = title.textContent?.split("") || [];
      title.textContent = "";
      letters.forEach((letter) => {
        const span = document.createElement("span");
        span.textContent = letter;
        span.className = "inline-block";
        title.appendChild(span);
      });

      gsap.fromTo(
        title.querySelectorAll("span"),
        { opacity: 0, y: 50, scale: 0.5, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          onComplete: () => {
            // Animate the start button after title animation
            gsap.fromTo(
              buttonRef.current,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
            );
          },
        }
      );
    }
  }, []);

  const handleStart = () => {
    setShowQuiz(true);
    // Animate quiz entrance
    gsap.fromTo(
      quizRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 0.6, ease: "power3.out" }
    );
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-white overflow-hidden">
      {/* Starfield Background */}
      <Starfield />

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        {!showQuiz ? (
          <div className="text-center">
            <h1
              ref={titleRef}
              className={`text-9xl md:text-7xl font-bold text-white mb-8 ${orbitron.className}`}
            >
              Quizzling
            </h1>
            <button
              ref={buttonRef}
              onClick={handleStart}
              className="opacity-0 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-full text-lg font-semibold transition-colors duration-300 ${orbitron.className}"
            >
              Start Quiz
            </button>
          </div>
        ) : (
          <div ref={quizRef}>
            <Quiz />
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
