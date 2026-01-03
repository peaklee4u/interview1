import React, { useState, useCallback } from 'react';
import { AppState, Region, Question, Evaluation } from './types';
import StepRegion from './components/StepRegion';
import StepUpload from './components/StepUpload';
import StepInterview from './components/StepInterview';
import StepFeedback from './components/StepFeedback';
import { generateInterviewQuestions, evaluateInterviewAnswers } from './services/geminiService';

const initialState: AppState = {
  step: 'region',
  region: null,
  fileData: null,
  fileMimeType: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  evaluations: {},
  error: null,
};

const regionLabels: Record<Region, string> = {
  seoul: '서울',
  gyeonggi: '경기',
  gangwon: '강원'
};

const App: React.FC = () => {
  const [state, setState] = useState<AppState>(initialState);

  const handleRegionSelect = (region: Region) => {
    setState((prev) => ({ ...prev, region, step: 'upload' }));
  };

  const handleFileUpload = async (fileBase64: string, mimeType: string) => {
    setState((prev) => ({ ...prev, fileData: fileBase64, fileMimeType: mimeType, step: 'generating', error: null }));
    
    try {
      if (!state.region) throw new Error("지역이 선택되지 않았습니다.");
      const questions = await generateInterviewQuestions(state.region, fileBase64, mimeType);
      
      setState((prev) => ({
        ...prev,
        questions,
        step: 'interview',
        currentQuestionIndex: 0
      }));
    } catch (error: any) {
      console.error("Detailed Error in App.tsx:", error);
      // 에러 객체에서 구체적인 메시지 추출
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";
      
      // 사용자에게 구체적인 원인을 보여줌 (API Key 문제 등)
      setState((prev) => ({ 
        ...prev, 
        step: 'upload', 
        error: `문제 생성 실패: ${errorMessage}` 
      }));
    }
  };

  const handleAnswerSubmit = async (answer: string) => {
    const { currentQuestionIndex, questions, userAnswers, region } = state;
    
    // Save answer
    const currentQuestionId = questions[currentQuestionIndex].id;
    const nextAnswers = { ...userAnswers, [currentQuestionId]: answer };
    
    // Check if it's the last question
    if (currentQuestionIndex >= questions.length - 1) {
      setState((prev) => ({ ...prev, userAnswers: nextAnswers, step: 'evaluating', error: null }));
      
      try {
        if (!region) throw new Error("Region is missing");
        const evaluations = await evaluateInterviewAnswers(questions, nextAnswers, region);
        setState((prev) => ({ ...prev, evaluations, step: 'feedback' }));
      } catch (error: any) {
        console.error("Evaluation Error:", error);
        const errorMessage = error instanceof Error ? error.message : "평가 중 알 수 없는 오류가 발생했습니다.";
        setState((prev) => ({ 
            ...prev, 
            step: 'interview', 
            error: `평가 실패: ${errorMessage}` 
        }));
      }
      
    } else {
      // Go to next question
      setState((prev) => ({
        ...prev,
        userAnswers: nextAnswers,
        currentQuestionIndex: prev.currentQuestionIndex + 1
      }));
    }
  };

  const handleRestart = () => {
    setState(initialState);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {/* Navbar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <h1 className="text-xl font-bold text-slate-800">중등 임용 면접 AI</h1>
          </div>
          <div className="text-sm text-slate-500">
            {state.step !== 'region' && state.region && (
                <span className="bg-slate-100 px-3 py-1 rounded-full font-medium">
                    {regionLabels[state.region]}
                </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        {state.step === 'region' && <StepRegion onSelect={handleRegionSelect} />}
        
        {state.step === 'upload' && state.region && (
          <StepUpload region={state.region} onUpload={handleFileUpload} isLoading={false} />
        )}

        {state.step === 'generating' && (
           <div className="flex flex-col items-center justify-center space-y-4 h-full my-auto">
             <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
             <p className="text-lg text-slate-600 font-medium animate-pulse">
               AI가 교육 기본계획을 분석하여 문제를 출제중입니다...
             </p>
             <p className="text-sm text-slate-400">PDF 분석에는 약 10~20초가 소요될 수 있습니다.</p>
           </div>
        )}

        {state.step === 'interview' && state.questions.length > 0 && (
          <StepInterview 
            question={state.questions[state.currentQuestionIndex]}
            questionIndex={state.currentQuestionIndex}
            totalQuestions={state.questions.length}
            onNext={handleAnswerSubmit}
          />
        )}

        {state.step === 'evaluating' && (
            <div className="flex flex-col items-center justify-center space-y-4 h-full my-auto">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-lg text-slate-600 font-medium animate-pulse">
              답변을 분석하고 채점하는 중입니다...
            </p>
          </div>
        )}

        {state.step === 'feedback' && (
          <StepFeedback 
            questions={state.questions} 
            userAnswers={state.userAnswers} 
            evaluations={state.evaluations}
            onRestart={handleRestart}
          />
        )}
        
        {state.error && (
            <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded shadow-2xl z-50 max-w-lg" role="alert">
                <strong className="font-bold block mb-1">오류가 발생했습니다:</strong>
                <span className="block sm:inline break-words text-sm">{state.error}</span>
                <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setState(prev => ({...prev, error: null}))}>
                    <svg className="fill-current h-6 w-6 text-red-500 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
                </span>
            </div>
        )}
      </main>
      
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
            <p className="text-sm">© 2024 Teacher Interview AI. Powered by Google Gemini.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;