import React, { useState, useEffect, useRef } from 'react';
import { Question } from '../types';

interface StepInterviewProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onNext: (answer: string) => void;
}

// Helper for type safety with Web Speech API
declare global {
  interface Window {
    webkitSpeechRecognition: any;
    SpeechRecognition: any;
  }
}

const StepInterview: React.FC<StepInterviewProps> = ({ question, questionIndex, totalQuestions, onNext }) => {
  const [answer, setAnswer] = useState('');
  const [timeLeft, setTimeLeft] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  
  // Reset state when question changes
  useEffect(() => {
    setAnswer('');
    setTimeLeft(600); // 10 minutes default
    setIsListening(false);
    if (recognitionRef.current) {
        recognitionRef.current.stop();
    }
  }, [question.id]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'ko-KR';

            recognition.onresult = (event: any) => {
                let interimTranscript = '';
                let finalTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    } else {
                        interimTranscript += event.results[i][0].transcript;
                    }
                }
                
                // Append final results to the current answer
                if (finalTranscript) {
                    setAnswer(prev => prev + (prev && !prev.endsWith(' ') ? ' ' : '') + finalTranscript);
                }
            };

            recognition.onerror = (event: any) => {
                console.error('Speech recognition error', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                // If we didn't manually stop it (e.g. silence), but state is still true, restart?
                // For this UI, simple toggle is better. If it stops, set state to false.
                if (isListening) {
                     // Optionally restart here if you want "always on", but standard behavior is better.
                     setIsListening(false);
                }
            };

            recognitionRef.current = recognition;
        }
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
        alert("이 브라우저는 음성 인식을 지원하지 않습니다. Chrome 브라우저를 사용해주세요.");
        return;
    }

    if (isListening) {
        recognitionRef.current.stop();
        setIsListening(false);
    } else {
        recognitionRef.current.start();
        setIsListening(true);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const isLastQuestion = questionIndex === totalQuestions - 1;

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4 border-slate-200">
        <div className="flex items-center space-x-3">
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${question.type === 'gusang' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
            {question.type === 'gusang' ? '구상형' : '즉답형'}
          </span>
          <span className="text-slate-500 text-sm font-medium">
            문제 {questionIndex + 1} / {totalQuestions}
          </span>
        </div>
        <div className="flex items-center text-slate-500 font-mono text-sm">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
          {formatTime(timeLeft)}
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6">
        <h3 className="text-xl font-bold text-slate-900 leading-relaxed">
          {question.content}
        </h3>
        
        {question.subQuestions && question.subQuestions.length > 0 && (
          <div className="bg-slate-50 p-6 rounded-lg border border-slate-100">
            <ul className="space-y-3">
              {question.subQuestions.map((sub, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="inline-flex items-center justify-center w-5 h-5 mr-3 text-xs font-bold text-slate-500 bg-slate-200 rounded-full flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-slate-700">{sub}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Answer Area */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">나의 답변</label>
            <button 
                onClick={toggleListening}
                className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all ${isListening ? 'bg-red-100 text-red-600 ring-2 ring-red-400 animate-pulse' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
            >
                {isListening ? (
                    <>
                        <span className="w-2 h-2 bg-red-600 rounded-full mr-2 animate-ping"></span>
                        음성 인식 중... (클릭하여 중지)
                    </>
                ) : (
                    <>
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                        마이크로 답변 입력하기
                    </>
                )}
            </button>
        </div>
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="답변을 입력하세요. 마이크 버튼을 누르면 음성으로 입력할 수 있습니다."
          className="w-full h-64 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none shadow-sm transition-all"
        />
      </div>

      {/* Actions */}
      <div className="flex justify-end pt-4">
        <button
          onClick={() => onNext(answer)}
          disabled={!answer.trim()}
          className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl active:transform active:scale-95"
        >
          {isLastQuestion ? '제출 및 평가받기' : '다음 문제'}
        </button>
      </div>
    </div>
  );
};

export default StepInterview;