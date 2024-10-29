// utils/search.ts

// 초성 정의
const CHOSUNG_LIST = [
  'ㄱ',
  'ㄲ',
  'ㄴ',
  'ㄷ',
  'ㄸ',
  'ㄹ',
  'ㅁ',
  'ㅂ',
  'ㅃ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅉ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

// 중성 정의
const JUNGSUNG_LIST = [
  'ㅏ',
  'ㅐ',
  'ㅑ',
  'ㅒ',
  'ㅓ',
  'ㅔ',
  'ㅕ',
  'ㅖ',
  'ㅗ',
  'ㅘ',
  'ㅙ',
  'ㅚ',
  'ㅛ',
  'ㅜ',
  'ㅝ',
  'ㅞ',
  'ㅟ',
  'ㅠ',
  'ㅡ',
  'ㅢ',
  'ㅣ',
];

// 종성 정의
const JONGSUNG_LIST = [
  '',
  'ㄱ',
  'ㄲ',
  'ㄳ',
  'ㄴ',
  'ㄵ',
  'ㄶ',
  'ㄷ',
  'ㄹ',
  'ㄺ',
  'ㄻ',
  'ㄼ',
  'ㄽ',
  'ㄾ',
  'ㄿ',
  'ㅀ',
  'ㅁ',
  'ㅂ',
  'ㅄ',
  'ㅅ',
  'ㅆ',
  'ㅇ',
  'ㅈ',
  'ㅊ',
  'ㅋ',
  'ㅌ',
  'ㅍ',
  'ㅎ',
];

// 텍스트 정규화 함수: 띄어쓰기 제거 및 소문자 변환
const normalizeText = (text: string): string => {
  return text.replace(/\s+/g, '').toLowerCase();
};

// 단일 문자를 초성/중성/종성으로 분해
export const decomposeHangul = (char: string): string[] => {
  const charCode = char.charCodeAt(0);

  // 한글 음절이 아닌 경우
  if (charCode < 0xac00 || charCode > 0xd7a3) {
    return [char];
  }

  // 한글 음절인 경우
  const offset = charCode - 0xac00;
  const jong = offset % 28;
  const jung = ((offset - jong) / 28) % 21;
  const cho = ((offset - jong) / 28 - jung) / 21;

  return [CHOSUNG_LIST[cho], JUNGSUNG_LIST[jung], JONGSUNG_LIST[jong]].filter(
    Boolean
  ); // 종성이 없는 경우 제거
};

// 문자열을 자모음으로 분해
export const decompose = (text: string): string => {
  return Array.from(text)
    .map((char) => decomposeHangul(char).join(''))
    .join('');
};

// 초성만 추출
export const getChosung = (text: string): string => {
  return Array.from(text)
    .map((char) => {
      const charCode = char.charCodeAt(0);
      if (charCode >= 0xac00 && charCode <= 0xd7a3) {
        const cho = Math.floor((charCode - 0xac00) / 28 / 21);
        return CHOSUNG_LIST[cho];
      }
      return char;
    })
    .join('');
};

// 검색어가 초성인지 확인
export const isChosung = (char: string): boolean => {
  return CHOSUNG_LIST.includes(char);
};

// 향상된 검색 함수
export const matchKoreanText = (text: string, search: string): boolean => {
  // 검색어가 비어있으면 true 반환
  if (!search) return true;

  // 텍스트 정규화 (띄어쓰기 제거 및 소문자 변환)
  const normalizedText = normalizeText(text);
  const normalizedSearch = normalizeText(search);

  // 일반 텍스트 검색
  if (normalizedText.includes(normalizedSearch)) return true;

  // 초성 검색
  const textChosung = getChosung(normalizedText);
  const searchChosung = getChosung(normalizedSearch);
  if (textChosung.includes(searchChosung)) return true;

  // 자모 분해 검색
  const decomposedText = decompose(normalizedText);
  const decomposedSearch = decompose(normalizedSearch);
  return decomposedText.includes(decomposedSearch);
};
