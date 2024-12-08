export const formatDate = (date: Date) => {
  return {
    fullDate: `${date.getFullYear()}년 ${
      date.getMonth() + 1
    }월 ${date.getDate()}일`,
    dayOfWeek: ['일', '월', '화', '수', '목', '금', '토'][date.getDay()],
    time: formatTime(date),
  };
};

export const formatTime = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? '오후' : '오전';
  const displayHours = hours % 12 || 12;
  return `${ampm} ${displayHours}:${minutes.toString().padStart(2, '0')}`;
};

export const getFormattedDateTime = (date: Date) => {
  const { fullDate, dayOfWeek } = formatDate(date);
  return `${fullDate} (${dayOfWeek})`;
};
