export const MENU_OPTIONS = [
  { name: '집밥', price: 10000 },
  { name: '점심특선', price: 10000 },
  { name: '삼겹살', price: 15000 },
  { name: '목살', price: 15000 },
  { name: '항정살', price: 16000 },
  { name: '갈매기살', price: 16000 },
  { name: '가브리살', price: 17000 },
] as const;

export const HALL_1_TABLES = [
  { number: 1, capacity: 4 },
  { number: 2, capacity: 4 },
  { number: 3, capacity: 4 },
  { number: 4, capacity: 4 },
  { number: 5, capacity: 6 },
  { number: 6, capacity: 6 },
];

export const HALL_2_TABLES = [
  { number: 7, capacity: 6 },
  { number: 8, capacity: 6 },
  { number: 9, capacity: 6 },
  { number: 10, capacity: 4 },
  { number: 11, capacity: 4 },
  { number: 12, capacity: 4 },
  { number: 13, capacity: 4 },
  { number: 14, capacity: 6 },
  { number: 15, capacity: 6 },
];

export const DRINKS = ['맥주', '소주', '콜라', '사이다', '막걸리'] as const;
