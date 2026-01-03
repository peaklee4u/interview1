import React from 'react';
import { Question, Evaluation } from '../types';

interface StepFeedbackProps {
  questions: Question[];
  userAnswers: Record<number, string>;
  evaluations: Record<number, Evaluation>;
  onRestart: () => void;
}

const StepFeedback: React.FC<StepFeedbackProps> = ({ questions, userAnswers, evaluations, onRestart }) => {
  return (
    <div className="w-full max-w-5xl mx-auto space-y-10 animate-fade-in pb-20">
      <div className="text-center space-y-4 pt-8">
        <h2 className="text-3xl font-bold text-slate-900">면접 피드백 리포트</h2>
        <div className="flex flex-wrap justify-center gap-2 text-sm text-slate-500 max-w-2xl mx-auto">
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">내용/전문성(40%)</span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">논리/구성(30%)</span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">정책/이해(20%)</span>
          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full border border-blue-100">태도/인성(10%)</span>
        </div>
        <p className="text-slate-500 mt-2">AI가 위 4가지 핵심 차원을 기준으로 10점 만점으로 평가한 상세 분석 결과입니다.</p>
      </div>

      <div className="space-y-8">
        {questions.map((question, index) => {
          const evaluation = evaluations[question.id];
          const answer = userAnswers[question.id];

          if (!evaluation) return null;

          // Color coding for numeric score (0-10)
          let scoreColor = 'text-red-600 bg-red-50 border-red-200';
          if (evaluation.score >= 9) {
            scoreColor = 'text-green-600 bg-green-50 border-green-200';
          } else if (evaluation.score >= 7) {
            scoreColor = 'text-blue-600 bg-blue-50 border-blue-200';
          } else if (evaluation.score >= 5) {
            scoreColor = 'text-yellow-600 bg-yellow-50 border-yellow-200';
          }

          return (
            <div key={question.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Question Header */}
              <div className="bg-slate-50 p-6 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wider">
                    {question.type === 'gusang' ? '구상형' : '즉답형'} 문제 {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 font-medium">10점 만점</span>
                    <span className={`px-4 py-1 rounded-full text-lg font-bold border ${scoreColor}`}>
                      {evaluation.score}점
                    </span>
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800">{question.content}</h3>
              </div>

              <div className="p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Answer Column */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase">나의 답변</h4>
                  <div className="bg-slate-50 p-5 rounded-xl text-slate-700 leading-relaxed whitespace-pre-wrap border border-slate-100 min-h-[150px]">
                    {answer || "(답변 없음)"}
                  </div>
                  
                  <h4 className="text-sm font-bold text-slate-400 uppercase mt-6">
                    모범 답안 예시 
                    <span className="ml-2 text-xs font-normal text-slate-400 normal-case">
                      ({question.type === 'gusang' ? '3~4분' : '2~3분'} 분량)
                    </span>
                  </h4>
                   <div className="bg-blue-50 p-5 rounded-xl text-slate-700 leading-loose whitespace-pre-wrap border border-blue-100 max-h-[500px] overflow-y-auto custom-scrollbar">
                    {evaluation.modelAnswer}
                  </div>
                </div>

                {/* Feedback Column */}
                <div className="space-y-6">
                  <div>
                    <h4 className="flex items-center text-sm font-bold text-green-600 uppercase mb-3">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                      강점 분석
                    </h4>
                    <p className="text-slate-700 leading-loose bg-white whitespace-pre-wrap">{evaluation.strengths}</p>
                  </div>
                  
                  <div className="h-px bg-slate-100 w-full"></div>

                  <div>
                    <h4 className="flex items-center text-sm font-bold text-orange-500 uppercase mb-3">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>
                      보완점 및 제언
                    </h4>
                    <p className="text-slate-700 leading-loose whitespace-pre-wrap">{evaluation.improvements}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center pt-8">
        <button
          onClick={onRestart}
          className="px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg"
        >
          새로운 면접 시작하기
        </button>
      </div>
    </div>
  );
};

export default StepFeedback;