import { Question } from '../types';

export const EXAMPLE_QUESTIONS: Question[] = [
  // --- 구상형 (Gu-sang) ---
  {
    id: 1,
    type: 'gusang',
    title: '경기교육 기본계획 정책',
    content: '경기도 2025 경기교육 기본계획의 4대 정책을 이야기하고, 이 중에서 자신이 가장 중요하다고 생각하는 한 가지를 선택하여 그렇게 생각한 이유를 설명하시오.',
    subQuestions: []
  },
  {
    id: 2,
    type: 'gusang',
    title: '인공지능과 교육 변화',
    content: '최근 Chat GPT 등을 비롯한 인공지능이 사회 전반에 영향을 미치고 있습니다. 다음 내용을 포함하여 답변하시오.',
    subQuestions: [
      '인공지능과 관련된 교육에 어떤 변화가 있을지',
      '교육에서 인공지능을 어떻게 활용할 수 있을지 논하시오'
    ]
  },
  {
    id: 3,
    type: 'gusang',
    title: '서울교육방향과 학생상',
    content: "2025년 서울교육방향은 ‘미래를 여는 협력교육’입니다. 이와 관련하여 다음 질문에 답하시오.",
    subQuestions: [
      '서울시교육청에서 기대하는 학생상 제시',
      '이러한 학생상을 실현할 수 있는 방안을 학생/교사/학교 차원에서 각각 설명'
    ]
  },
  {
    id: 4,
    type: 'gusang',
    title: '서울시 교육지표 실현',
    content: '서울시 교육지표 3가지가 무엇인지 설명하고, 이 중에서 자신이 교사가 되었을 때, 각 지표를 높게 실현하기 위하여 할 수 있는 일을 하나씩 이야기해보세요.',
    subQuestions: []
  },

  // --- 즉답형 (Jeok-dap) ---
  {
    id: 5,
    type: 'jeokdap',
    title: '모둠활동 갈등 지도',
    content: '각 학생의 의견을 고려하여 모둠활동 증진방안을 말하시오.\n\n<학생 의견>\nA학생: 지들 하고 싶은 말만 하고 다른 사람 말을 안들어요\nB학생: 개념을 1도 모르겠어서 모둠활동이 너무 어려워요.\nC학생: 공부 못하는 얘들이 버스타서 모둠활동 하기 싫어요.',
    subQuestions: []
  },
  {
    id: 6,
    type: 'jeokdap',
    title: '경청하는 교사',
    content: '학생들은 학생의 말을 잘 들어주는 교사가 좋다고 대부분 응답했다. 이를 반영한 구체적인 방안을 담임교사, 교과교사 측면에서 각각 말하시오.',
    subQuestions: []
  },
  {
    id: 7,
    type: 'jeokdap',
    title: '인권 친화적 학급운영',
    content: '최근 학생 및 교사의 인권과 관련한 여러 사회문제가 발생하고 있습니다. 인권 측면에서 학급운영을 어떻게 할 수 있을지 말하시오.',
    subQuestions: []
  },
  {
    id: 8,
    type: 'jeokdap',
    title: '다문화/다양성 학생 지도',
    content: '다문화 가족, 한부모 가족 등 다양한 학생이 있는 학급을 담당하게 되었다. 이때 교사에게 필요한 자질이 무엇인지 말하고 그 자질을 기르기 위해 어떻게 노력할 것인지 설명하시오.',
    subQuestions: []
  },
  {
    id: 9,
    type: 'jeokdap',
    title: '부적응 학생 지도',
    content: '가정환경이 좋지 않은 학생이 학교 생활에 부적응하고 있는 상황이다. 담임교사로서 어떻게 지도해야 할 것인지 3가지를 이야기하시오.',
    subQuestions: []
  },
  {
    id: 10,
    type: 'jeokdap',
    title: '교사 역량 개발',
    content: '교육실습을 바탕으로 교사에게 필요한 역량 2가지와 이를 신장할 수 있는 방안을 말하시오.',
    subQuestions: []
  },
  {
    id: 11,
    type: 'jeokdap',
    title: '기후위기 교육',
    content: '최근 에너지 및 기후위기가 중요한 사회문제로 대두되고 있다. 이와 관련하여 학생을 지도하는 방안에 대해 말하시오.',
    subQuestions: []
  },
  {
    id: 12,
    type: 'jeokdap',
    title: '의사소통 역량',
    content: '학급 운영에 있어 의사소통은 매우 중요하다. 교사와 동료교사, 교사와 학생, 교사와 학부모 사이에 의사소통과 관련하여 교사로서 가져야 할 역량(자질)에 대해 말하시오.',
    subQuestions: []
  },
  {
    id: 13,
    type: 'jeokdap',
    title: '스마트폰 지도',
    content: '스마트폰의 사용이 학습이나 생활에 많은 영향을 미치고 있습니다. 스마트폰 사용과 관련하여 학생지도 방안을 말하시오.',
    subQuestions: []
  }
];