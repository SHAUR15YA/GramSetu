import React, { useState } from "react";
import {
  GraduationCap,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  HelpCircle,
  Clock,
  Play,
  Lightbulb,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import Markdown from "react-markdown";
import { LanguageCode, VocationalCourse } from "../types";
import { VOCATIONAL_COURSES } from "../data/mockData";
import { getTranslation } from "../data/translations";
import { AudioReaderButton } from "./AudioReaderButton";

interface EducationTabProps {
  currentLang: LanguageCode;
}

export const EducationTab: React.FC<EducationTabProps> = ({ currentLang }) => {
  // AI Tutor State
  const [topic, setTopic] = useState("Solar Electricity & Batteries");
  const [gradeLevel, setGradeLevel] = useState("Community & Farmers");
  const [question, setQuestion] = useState("How does a solar panel generate power, and how do I prevent the battery from dying early?");
  const [isTeaching, setIsTeaching] = useState(false);
  const [lessonResult, setLessonResult] = useState<string | null>(null);
  const [lessonError, setLessonError] = useState<string | null>(null);

  // Selected Vocational Course for details modal
  const [activeCourse, setActiveCourse] = useState<VocationalCourse | null>(null);

  // Interactive Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const sampleTopics = [
    {
      title: "Software Engineering Career Roadmap",
      question: "Suggest free courses and a roadmap to become a software engineer."
    },
    {
      title: "Solar Power & Batteries",
      question: "How does sunlight turn into electricity, and how do I protect my solar battery during cloudy days?"
    },
    {
      title: "Science of Groundwater Recharge",
      question: "Why do village borewells dry up in summer, and how do check-dams recharge underground aquifers?"
    },
    {
      title: "Crop Profit & Loan Interest Math",
      question: "How do I calculate simple interest on a Kisan Credit Card (KCC) loan vs a local moneylender?"
    },
    {
      title: "Plant Nutrition (N-P-K)",
      question: "What do Nitrogen, Phosphorus, and Potassium do for plants, explained like human food?"
    }
  ];

  const quizQuestions = [
    {
      q: "When is the most water-efficient time to irrigate crops in hot weather?",
      options: [
        "At 12:00 PM noon when sunlight is strongest",
        "Early morning or late evening/night to minimize evaporation",
        "Whenever the irrigation pump is hot",
        "Only when it is raining"
      ],
      correct: 1,
      explanation: "Night and early dawn irrigation saves up to 40% of water from immediate evaporation."
    },
    {
      q: "If someone calls asking for your 4-digit UPI PIN or OTP to credit subsidy money into your bank:",
      options: [
        "Tell them immediately so money arrives faster",
        "Never share PIN or OTP; you NEVER need to enter a PIN to receive money",
        "Share it if they say they are from the Panchayat",
        "Write it on the back of your passbook"
      ],
      correct: 1,
      explanation: "UPI PIN is only required to send money or deduct from your account, never to receive funds."
    },
    {
      q: "What should you do first if a person is bitten by a snake in the fields?",
      options: [
        "Cut the bite mark with a razor blade",
        "Tie a very tight metal wire to stop blood flow completely",
        "Keep the patient calm and limb immobilized with a stick/splint, then rush to the PHC",
        "Give them hot tea and ask them to run"
      ],
      correct: 2,
      explanation: "Immobilization slows venom spread. Cutting, burning, or tourniquets cause severe gangrene and death."
    }
  ];

  const handleAskTutor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsTeaching(true);
    setLessonError(null);
    setLessonResult(null);

    try {
      const response = await fetch("/api/ai/edu-tutor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          gradeLevel,
          question,
          language: currentLang,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reach rural village tutor");
      }

      const data = await response.json();
      setLessonResult(data.result);
    } catch (err: any) {
      console.error(err);
      setLessonError("Could not reach AI tutor service. Using offline rural lesson curriculum.");
    } finally {
      setIsTeaching(false);
    }
  };

  const handleQuizOption = (qIdx: number, optIdx: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qIdx]: optIdx }));
  };

  const getQuizScore = () => {
    let score = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correct) score++;
    });
    return score;
  };

  return (
    <div id="education-tab-content" className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-700/80 text-blue-100 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Shiksha Setu • Rural Education & Vocational Academy</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold font-['Outfit']">
            AI Village Tutor & Vocational Micro-Skills
          </h2>
          <p className="text-xs sm:text-sm text-blue-100 max-w-2xl mt-1">
            Understand any school subject or modern vocational trade explained through village analogies, practical lessons, and audio narration.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <AudioReaderButton
            textToRead="Welcome to Shiksha Setu Village Academy. Ask any question to your AI Community Tutor or enroll in vocational courses like solar pump maintenance, drip irrigation, and cyber-safe digital banking."
            lang={currentLang}
            label="Audio Overview"
          />
        </div>
      </div>

      {/* Grid: AI Community Tutor (7 Cols) + Vocational Modules & Quiz (5 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: AI Tutor */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-stone-200/90 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-3">
            <h3 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-blue-600" />
              <span>AI Community Mentor & Rural Tutor</span>
            </h3>
            <p className="text-xs text-stone-500">
              Ask any question: science, math, farming techniques, or village economics
            </p>
          </div>

          {/* Quick Select Topic Chips */}
          <div>
            <span className="text-xs font-semibold text-stone-600 block mb-2">
              Explore Popular Community Questions:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sampleTopics.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setTopic(item.title);
                    setQuestion(item.question);
                  }}
                  className={`p-2.5 rounded-xl text-left border transition-all text-xs ${
                    question === item.question
                      ? "border-blue-600 bg-blue-50 text-blue-900 font-semibold ring-1 ring-blue-500"
                      : "border-stone-200 hover:border-stone-300 bg-stone-50/70 text-stone-700"
                  }`}
                >
                  <div className="font-semibold text-stone-800">{item.title}</div>
                  <div className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">{item.question}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Question Form */}
          <form onSubmit={handleAskTutor} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Subject or Trade
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g. Solar Energy, Soil Science, Accounting"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-700 block mb-1">
                  Target Learner Level
                </label>
                <select
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Primary School (Ages 6-11)">Primary School (Simple Words & Stories)</option>
                  <option value="Middle & High School (Ages 12-17)">High School (Conceptual & Practical)</option>
                  <option value="Community & Farmers">Adult / Farmer (Everyday Village Analogies)</option>
                  <option value="Vocational Trainee">Vocational Trainee (Step-by-step Technical)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-stone-700 block mb-1">
                What concept or question do you want explained?
              </label>
              <textarea
                rows={3}
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask anything, e.g. How does drip irrigation save 50% water while increasing yield?"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 bg-stone-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {lessonError && (
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
                {lessonError}
              </div>
            )}

            <button
              type="submit"
              disabled={isTeaching}
              className="w-full bg-blue-700 hover:bg-blue-600 disabled:bg-stone-300 text-white font-semibold py-3 px-4 rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-xs"
            >
              {isTeaching ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-amber-300" />
                  <span>Preparing Village Lesson with AI...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>Teach Me This Concept</span>
                </>
              )}
            </button>
          </form>

          {/* Lesson Result Output */}
          {lessonResult && (
            <div
              id="tutor-lesson-result"
              className="mt-4 p-4 sm:p-5 rounded-2xl bg-stone-50 border border-blue-300 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  AI Rural Tutor Lesson & Everyday Analogies
                </span>
                <AudioReaderButton
                  id="lesson-audio-btn"
                  textToRead={lessonResult}
                  lang={currentLang}
                />
              </div>

              <div className="prose prose-sm max-w-none text-xs sm:text-sm text-stone-800 leading-relaxed">
                <div className="markdown-body">
                  <Markdown>{lessonResult}</Markdown>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Vocational Courses & Interactive Quiz */}
        <div className="lg:col-span-5 space-y-6">
          {/* Vocational Micro-Courses */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600" />
                <span>Rural Vocational Skills</span>
              </h3>
              <span className="text-[10px] font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                Free Panchayat Certification
              </span>
            </div>

            <div className="space-y-2.5">
              {VOCATIONAL_COURSES.map((course) => (
                <div
                  key={course.id}
                  className="p-3 rounded-xl bg-stone-50 hover:bg-stone-100/90 border border-stone-200/70 transition-colors flex flex-col justify-between cursor-pointer"
                  onClick={() => setActiveCourse(course)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {course.category}
                      </span>
                      <h4 className="text-xs sm:text-sm font-bold text-stone-900 mt-1">
                        {course.title}
                      </h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-stone-400 shrink-0 mt-1" />
                  </div>

                  <div className="mt-2 text-[11px] text-stone-500 flex items-center justify-between border-t border-stone-200/60 pt-2">
                    <span>⏳ {course.duration}</span>
                    <span>{course.modulesCount} Modules</span>
                    <span className="font-semibold text-emerald-700">{course.difficulty}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Knowledge Quiz */}
          <div className="bg-white rounded-2xl p-5 border border-stone-200/90 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div>
                <h3 className="text-sm sm:text-base font-bold text-stone-900 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Village Smart Skills Quiz</span>
                </h3>
                <p className="text-xs text-stone-500">Test your knowledge on farming, health, and cyber safety</p>
              </div>
              {quizSubmitted && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Score: {getQuizScore()}/{quizQuestions.length}
                </span>
              )}
            </div>

            <div className="space-y-4 text-xs">
              {quizQuestions.map((item, qIdx) => (
                <div key={qIdx} className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                  <p className="font-semibold text-stone-800">
                    {qIdx + 1}. {item.q}
                  </p>
                  <div className="space-y-1.5">
                    {item.options.map((opt, optIdx) => {
                      const isSelected = quizAnswers[qIdx] === optIdx;
                      const isCorrect = item.correct === optIdx;

                      let btnStyle = "border-stone-200 bg-white text-stone-700";
                      if (quizSubmitted) {
                        if (isCorrect) btnStyle = "border-emerald-500 bg-emerald-50 text-emerald-900 font-semibold";
                        else if (isSelected && !isCorrect) btnStyle = "border-rose-400 bg-rose-50 text-rose-900";
                      } else if (isSelected) {
                        btnStyle = "border-blue-600 bg-blue-50 text-blue-900 font-medium";
                      }

                      return (
                        <button
                          key={optIdx}
                          type="button"
                          onClick={() => handleQuizOption(qIdx, optIdx)}
                          className={`w-full text-left p-2 rounded-lg border text-[11px] transition-colors flex items-center justify-between ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {quizSubmitted && isCorrect && (
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && (
                    <p className="text-[10px] text-stone-500 italic mt-1">
                      💡 {item.explanation}
                    </p>
                  )}
                </div>
              ))}

              {!quizSubmitted ? (
                <button
                  type="button"
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                  className="w-full py-2 bg-emerald-700 hover:bg-emerald-600 disabled:bg-stone-300 text-white rounded-xl text-xs font-semibold transition-colors"
                >
                  Submit Quiz Answers
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setQuizAnswers({});
                    setQuizSubmitted(false);
                  }}
                  className="w-full py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-semibold transition-colors"
                >
                  Retake Quiz
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Detail Modal */}
      {activeCourse && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                  {activeCourse.category}
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-900 mt-1">
                  {activeCourse.title}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveCourse(null)}
                className="text-stone-400 hover:text-stone-800 p-1"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {activeCourse.description}
            </p>

            <div>
              <h5 className="text-xs font-bold text-stone-800 mb-2">Practical Village Skills You'll Learn:</h5>
              <div className="grid grid-cols-2 gap-2">
                {activeCourse.keySkills.map((skill, i) => (
                  <div key={i} className="p-2 rounded-lg bg-stone-50 border border-stone-200 text-[11px] text-stone-700 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 text-xs text-stone-500 flex items-center justify-between">
              <span>Instructor: {activeCourse.instructor}</span>
              <span className="font-semibold text-blue-700">{activeCourse.duration}</span>
            </div>

            <button
              type="button"
              onClick={() => {
                alert(`Enrolled in "${activeCourse.title}"! Course materials and audio modules will be available at your Panchayat Community Computer Centre.`);
                setActiveCourse(null);
              }}
              className="w-full bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-xl text-xs shadow-xs"
            >
              Enroll for Free (Panchayat Certificate)
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
