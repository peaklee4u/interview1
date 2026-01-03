import React from 'react';
import { Region } from '../types';

interface StepRegionProps {
  onSelect: (region: Region) => void;
}

const StepRegion: React.FC<StepRegionProps> = ({ onSelect }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold text-slate-800">응시할 지역을 선택하세요</h2>
        <p className="text-slate-500">선택한 지역의 교육 정책에 맞춘 문제가 출제됩니다.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
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
  );
};

export default StepRegion;