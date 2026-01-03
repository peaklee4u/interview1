import React, { useState } from 'react';
import { Region } from '../types';

interface StepUploadProps {
  region: Region;
  onUpload: (fileBase64: string, mimeType: string) => void;
  isLoading: boolean;
}

const StepUpload: React.FC<StepUploadProps> = ({ region, onUpload, isLoading }) => {
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type (PDF or Text)
    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      setError('PDF 또는 TXT 파일만 업로드 가능합니다.');
      return;
    }
    
    if (file.size > 4 * 1024 * 1024) { // 4MB limit for demo safety
        setError('파일 크기는 4MB 이하여야 합니다.');
        return;
    }

    setError(null);

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Extract base64 part
      const base64Data = result.split(',')[1];
      onUpload(base64Data, file.type);
    };
    reader.onerror = () => {
      setError('파일을 읽는 중 오류가 발생했습니다.');
    };
    reader.readAsDataURL(file);
  };

  const regionNames: Record<Region, string> = {
    seoul: '서울',
    gyeonggi: '경기',
    gangwon: '강원'
  };
  const regionName = regionNames[region];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in w-full max-w-2xl mx-auto">
      <div className="text-center space-y-3">
        <h2 className="text-3xl font-bold text-slate-800">{regionName} 교육 기본계획 업로드</h2>
        <p className="text-slate-500 leading-relaxed">
          AI가 해당 문서를 분석하여 맞춤형 구상형 문제를 출제합니다.<br/>
          <span className="text-sm text-slate-400">(PDF 또는 TXT 파일, 최대 4MB)</span>
        </p>
      </div>

      <div className="w-full">
        <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-300 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 transition-all">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg className="w-12 h-12 mb-4 text-slate-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
            </svg>
            <p className="mb-2 text-sm text-slate-500"><span className="font-semibold">클릭하여 업로드</span> 하거나 파일을 드래그하세요</p>
            <p className="text-xs text-slate-500">PDF, TXT</p>
          </div>
          <input type="file" className="hidden" accept=".pdf,.txt" onChange={handleFileChange} disabled={isLoading} />
        </label>
      </div>

      {error && (
        <div className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg">
          {error}
        </div>
      )}

      {isLoading && (
        <div className="flex flex-col items-center space-y-3">
            <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-600 font-medium">문제를 출제하고 있습니다... (약 10-20초 소요)</p>
        </div>
      )}
    </div>
  );
};

export default StepUpload;