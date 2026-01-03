import React from 'react';
import { Region } from '../types';

interface StepRegionProps {
  onSelect: (region: Region) => void;
}

const StepRegion: React.FC<StepRegionProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-12 animate-fade-in py-10">
      <div className="text-center space-y-6 max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          중등교사 임용시험<br/>
          <span className="text-blue-600">모의 면접</span>
        </h1>
        <p className="text-lg text-slate-600">
          AI 면접관이 교육 기본계획을 분석하여<br className="hidden md:block"/>
          실제 시험과 유사한 경험을 제공합니다.
        </p>
      </div>

      <div className="w-full max-w-4xl border-t border-slate-200"></div>

      <div className="text-center space-y-4 w-full">
        <h2 className="text-xl font-bold text-slate-700">응시할 지역을 선택하세요</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mx-auto px-4">
          <button
            onClick={() => onSelect('seoul')}
            className="group relative p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">서울</h3>
            <p className="text-slate-500 group-hover:text-blue-600 transition-colors">서울특별시 교육청</p>
          </button>

          <button
            onClick={() => onSelect('gyeonggi')}
            className="group relative p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">경기</h3>
            <p className="text-slate-500 group-hover:text-blue-600 transition-colors">경기도 교육청</p>
          </button>

          <button
            onClick={() => onSelect('gangwon')}
            className="group relative p-8 bg-white border-2 border-slate-200 rounded-2xl hover:border-blue-500 hover:shadow-xl transition-all duration-300 text-left"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2C9.81 13.75 7 10 7 10l-6 8h22L14 6z"/></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-2">강원</h3>
            <p className="text-slate-500 group-hover:text-blue-600 transition-colors">강원특별자치도 교육청</p>
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepRegion;