// 날짜를 한국어 형식으로 포맷하는 함수
export const formatDateTime = (date: Date | string) => {
  const d = new Date(date);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(d);
};
