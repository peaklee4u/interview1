import { GoogleGenAI, Type } from "@google/genai";
import { Question, Evaluation, Region } from "../types";
import { EXAMPLE_QUESTIONS } from "../data/exampleQuestions";

// Netlify 등 배포 환경에서 프론트엔드에 환경변수를 노출하려면 
// 보통 VITE_ 또는 REACT_APP_ 접두사가 필요합니다.
const apiKey = 
  process.env.VITE_API_KEY || 
  process.env.REACT_APP_API_KEY || 
  process.env.API_KEY || 
  process.env.apiKey;

// API 키 로드 상태를 콘솔에 출력하여 디버깅을 돕습니다.
if (!apiKey) {
  console.warn("⚠️ API Key를 찾을 수 없습니다. Netlify 환경변수에 'VITE_API_KEY' 또는 'REACT_APP_API_KEY' 이름으로 키를 추가해 주세요.");
} else {
  console.log("✅ API Key가 로드되었습니다. (Length: " + apiKey.length + ")");
}

// Using gemini-3-flash-preview for balanced performance/latency in text/multimodal tasks
const MODEL_NAME = "gemini-3-flash-preview";

export const generateInterviewQuestions = async (
  region: Region,
  fileBase64: string,
  mimeType: string
): Promise<Question[]> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Netlify 환경 변수에서 'VITE_API_KEY'를 설정해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const regionNames: Record<Region, string> = {
    seoul: '서울',
    gyeonggi: '경기',
    gangwon: '강원'
  };
  const regionName = regionNames[region];
  
  // 예시 데이터를 문자열로 변환하여 프롬프트에 포함
  const examplesStr = JSON.stringify(EXAMPLE_QUESTIONS.map(q => ({
    type: q.type,
    content: q.content,
    subQuestions: q.subQuestions
  })), null, 2);

  const systemInstruction = `
    당신은 대한민국 중등교사 임용시험 2차 심층면접 출제위원입니다.
    사용자가 제공한 '${regionName} 교육 기본계획' 문서와 지역 정보를 바탕으로 면접 문항 4개를 출제해야 합니다.
    
    [참고할 문항 스타일 및 주제 예시]
    ${examplesStr}
    
    위 예시 문항들은 정책(교육방향, 지표), 최신 이슈(AI, 기후위기), 학생 생활지도(모둠활동 갈등, 부적응, 다문화, 인권, 스마트폰) 등 다양한 주제를 다루고 있습니다.
    이러한 톤앤매너와 구체적인 상황 제시 방식을 적극 반영하여 문제를 출제하세요.

    출제 규칙:
    1. 총 4문제를 출제합니다. (구상형 2문제, 즉답형 2문제)
    2. 구상형 1번: 반드시 업로드된 파일(교육기본계획)의 핵심 정책, 비전, 지표 등을 인용하여 질문하세요.
    3. 구상형 2번: 에듀테크, AI 디지털 교과서, 미래 교육, 혹은 교육청의 특색 사업과 관련된 심도 있는 질문을 하세요.
    4. 즉답형 1번 & 2번: 
       - 예시와 같이 구체적인 문제 상황(A, B, C 학생의 대화 등)을 제시하고 해결방안을 묻거나,
       - 인권, 다문화, 기후위기, 의사소통, 스마트폰 중독 등 학교 현장의 실제적인 이슈를 교사의 자질/역량과 연결하여 질문하세요.
    5. 어투는 실제 임용시험 문제처럼 정중하고 명확하게 작성하세요. ("~말하시오", "~논하시오")
    6. JSON 형식으로만 출력하세요.
  `;

  const prompt = `
    지역: ${regionName}
    위의 교육 기본계획 문서를 분석하여 다음 구조의 JSON 데이터를 생성해 주세요.
    
    Response Schema:
    Array of objects:
    - id: number (1 to 4)
    - type: string ("gusang" or "jeokdap")
    - title: string (문제 제목, 예: "구상형 1", "즉답형 2")
    - content: string (문제의 주요 상황 설명 및 지문)
    - subQuestions: array of strings (구체적인 지시사항이나 하위 질문들)
  `;

  try {
    const parts: any[] = [
      { text: prompt }
    ];

    if (fileBase64 && mimeType) {
        parts.unshift({
            inlineData: {
                data: fileBase64,
                mimeType: mimeType
            }
        });
    }

    console.log(`Sending request to Gemini (${MODEL_NAME})...`);
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: { parts },
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    id: { type: Type.INTEGER },
                    type: { type: Type.STRING, enum: ["gusang", "jeokdap"] },
                    title: { type: Type.STRING },
                    content: { type: Type.STRING },
                    subQuestions: { 
                        type: Type.ARRAY,
                        items: { type: Type.STRING }
                    }
                },
                required: ["id", "type", "title", "content"]
            }
        }
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response text from AI");
    
    return JSON.parse(text) as Question[];

  } catch (error) {
    console.error("Gemini API Error details:", error);
    throw error;
  }
};

export const evaluateInterviewAnswers = async (
  questions: Question[],
  userAnswers: Record<number, string>,
  region: Region
): Promise<Record<number, Evaluation>> => {
  if (!apiKey) {
    throw new Error("API Key is missing. Netlify 환경 변수에서 'VITE_API_KEY'를 설정해주세요.");
  }

  const ai = new GoogleGenAI({ apiKey });

  const regionNames: Record<Region, string> = {
    seoul: '서울',
    gyeonggi: '경기',
    gangwon: '강원'
  };
  const regionName = regionNames[region];

  const qnaPairs = questions.map(q => {
    return `
    [문제 ${q.id} - ${q.type === 'gusang' ? '구상형' : '즉답형'}]
    내용: ${q.content}
    ${q.subQuestions ? `하위질문: ${q.subQuestions.join(', ')}` : ''}
    
    [지원자 답변]
    ${userAnswers[q.id] || "(답변 없음)"}
    `;
  }).join("\n\n----------------\n\n");

  const systemInstruction = `
    당신은 대한민국 중등교사 임용시험 2차 심층면접 전문 평가관입니다. 
    지원자는 '${regionName}' 지역에 응시한 예비 교사입니다.
    지원자의 답변을 아래의 [4대 핵심 평가 차원]과 [채점 루브릭]에 의거하여 냉철하게 분석하고 점수를 부여하세요.

    [4대 핵심 평가 차원 및 채점 루브릭 (총 10점 만점)]
    
    1. 내용의 적절성 및 전문성 (배점 40% / 4점)
       - 문제 파악의 정확성: 출제 의도를 정확히 파악하고 동문서답하지 않았는가?
       - 학생 중심 교육철학: 행정 편의가 아닌 '학생의 성장'이 중심에 있는가?
       - 구체성 및 실현 가능성: 구체적 프로그램명, 절차, 기대효과가 있는가? (추상적 구호 감점)
       - 교과 전문성: 교과 지식과 교수학습 방법론(PCK)을 녹여냈는가?

    2. 논리성 및 구성력 (배점 30% / 3점)
       - 두괄식 구성: 결론/주장을 먼저 제시하는가?
       - 표지어 사용: "첫째, ~입니다", "그 이유는 ~입니다" 등 연결이 명확한가?
       - 논리적 연계성: 주장과 근거의 인과관계가 타당한가?
       - 시간/분량 관리: 지나치게 짧거나 장황하지 않은가?

    3. 정책 이해도 및 적용력 (배점 20% / 2점)
       - 핵심 정책 용어: '${regionName}' 교육청의 핵심 키워드(예: 경기-하이러닝/공유학교, 서울-희망교실 등)를 적재적소에 사용하는가?
       - 비전 정합성: 교육청이 추구하는 인재상 및 비전과 일치하는가?
       - 최신 트렌드: 에듀테크, 고교학점제 등 교육 이슈 반영 여부

    4. 태도 및 교직 소양 (배점 10% / 1점)
       - 텍스트 분석이므로 답변에 사용된 '어휘'와 '표현'을 통해 평가.
       - "함께", "협력", "지원", "경청" 등 친화적이고 협력적인 어휘를 사용하는가?
       - 교직에 대한 소명 의식과 확신이 느껴지는가?

    [작성 지침]
    1. score: 위 4가지 항목의 배점을 합산하여 0~10점 사이의 정수로 평가하세요.
    2. strengths & improvements: 
       - 가독성을 위해 반드시 불렛포인트(- )를 사용하여 각 항목을 구분하세요.
       - **중요**: 각 불렛포인트 항목 사이에는 반드시 줄바꿈(Enter)을 넣어 시각적으로 분리되게 작성하세요. (뭉쳐서 출력되지 않도록 함)
       - 위 4가지 관점(내용, 논리, 정책, 태도)을 모두 포함하여 상세하게 작성하세요.
    3. modelAnswer: 
       - 실제 면접 현장 대본 형식
       - 서론-본론-결론 구조가 잘 드러나도록 문단을 나누어 작성하세요.
  `;

  const prompt = `
    다음은 4개의 면접 문제와 지원자의 답변입니다.
    각 문제에 대해 다음 항목을 포함한 JSON 객체를 반환하세요.
    
    1. score: 10점 만점 기준 합산 점수 (정수)
    2. strengths: 4대 관점별 상세 강점 (항목별 줄바꿈 필수)
    3. improvements: 4대 관점별 상세 보완점 (항목별 줄바꿈 필수)
    4. modelAnswer: 상세 모범 답변 스크립트 (문단 구분 필수)

    입력 데이터:
    ${qnaPairs}
  `;

  try {
    const response = await ai.models.generateContent({
      model: MODEL_NAME,
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                evaluations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            questionId: { type: Type.INTEGER },
                            score: { type: Type.INTEGER },
                            strengths: { type: Type.STRING },
                            improvements: { type: Type.STRING },
                            modelAnswer: { type: Type.STRING }
                        },
                        required: ["questionId", "score", "strengths", "improvements", "modelAnswer"]
                    }
                }
            }
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Failed to generate evaluation");

    const result = JSON.parse(text);
    
    // Convert array back to Record format
    const evaluationMap: Record<number, Evaluation> = {};
    result.evaluations.forEach((item: any) => {
        evaluationMap[item.questionId] = {
            score: item.score,
            strengths: item.strengths,
            improvements: item.improvements,
            modelAnswer: item.modelAnswer
        };
    });

    return evaluationMap;

  } catch (error) {
    console.error("Evaluation error:", error);
    throw error;
  }
};