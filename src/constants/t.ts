import {
  CanteenQuality,
  CityTier,
  ColleagueRelation,
  EducationLevel,
  JobStability,
  LeaderRelation,
  ShuttleService,
  UniversityType,
  WorkEnvironment,
  WorkExperience,
} from './c';

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
export interface JobInput {
  jobStability: JobStability; // 工作稳定性
  city: CityTier; // 城市等级
  isHometown: boolean;
  leader: LeaderRelation; // 领导关系
  colleague: ColleagueRelation; // 同事关系
  education: EducationLevel; // 学历
  university: UniversityType; // 学校类型
  environment: WorkEnvironment; // 工作环境
  experience: WorkExperience; // 工作年限
  salary: string; // 年薪
  country: string; // 国家代码 CN
  dailyHours: string; // 日总工时（含通勤）
  commuteHoursPerDay: string; // 单程通勤时间（小时，整数）
  slackingHoursPerDay: string; // 每天平均摸鱼时间（小时，整数）
  weeklyDays: string; // 每周工作天数（1~7）
  weeklyWFH: string; // 每周 WFH 天数（0~weeklyDays）
  sickLeave: string; // 带薪病假天数
  publicHolidays: string; // 国家法定节假日（一般默认 11 天）
  companyAnnualLeave: string; // 公司年假（比如默认 5 天）
  shuttle: ShuttleService; // 班车服务
  canteen: CanteenQuality; // 食堂质量
}

// 定义计算结果接口
export interface Result {
  value: number;
  workDaysPerYear: number;
  dailySalary: number;
  assessment: string;
  assessmentColor: string;
}
