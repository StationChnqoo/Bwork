export interface BaohuangPlayer {
  id: number;
  name: string;
  cards: string[]; // 进贡 吃贡 手牌
  currentCardIndex: number; // 当前出牌的索引 --> cards[currentCardIndex]
}

export interface GoujiPlayer {
  id: number;
  name: string;
  cards: string;
  error?: number;
  currentCardIndex: number; // 当前出牌的索引 --> cards[currentCardIndex]
}

export interface Game {
  id: string;
  time: number;
  from: string;
  players: GoujiPlayer[] | BaohuangPlayer[];
}

export interface KeyValue {
  key: string;
  value: string | number;
}

// 定义表单数据接口
export interface WorthForm {
  salary: string;
  countryCode: string;
  workDaysPerWeek: string;
  wfhDaysPerWeek: string;
  annualLeave: string;
  paidSickLeave: string;
  publicHolidays: string;
  workHours: string;
  commuteHours: string;
  restTime: string;
  cityFactor: string;
  workEnvironment: string;
  leadership: string;
  teamwork: string;
  homeTown: string;
  degreeType: string;
  schoolType: string;
  bachelorType: string;
  workYears: string;
  shuttle: string;
  canteen: string;
  jobStability: string;
  education: string;
  hasShuttle: boolean;
  hasCanteen: boolean;
}

// 定义计算结果接口
export interface Result {
  value: number;
  workDaysPerYear: number;
  dailySalary: number;
  assessment: string;
  assessmentColor: string;
}
