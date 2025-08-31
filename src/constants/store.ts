import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';
import {Game, JobInput, KeyValue} from './t';
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

const mmkv = new MMKV();
const mmkvStorage: StateStorage = {
  setItem: (key, value) => mmkv.set(key, value),
  getItem: key => mmkv.getString(key) || null,
  removeItem: key => mmkv.delete(key),
};

interface States {
  bears: number;
  increase: (by: number) => void;
  theme: string;
  setTheme: (theme: string) => void;
  defaultGame: string;
  setDefaultGame: (game: string) => void;
  cardSound: boolean;
  setCardCound: (cardSoud: boolean) => void;
  isKeyboardFeedback: boolean;
  setIsKeyboardFeedback: (isKeyboardFeedback: boolean) => void;
  games: Game[];
  setGames: (games: Game[]) => void;
  freeUsed: KeyValue;
  setFreeUsed: (freeUsed: KeyValue) => void;
  autoRevertGame: boolean;
  setAutoRevertGame: (autoRevertGame: boolean) => void;
  pack: number;
  setPack: (pack: number) => void;
  isEagle: boolean; // 是否带鹰
  setIsEagle: (isEagle: boolean) => void;
  gameArea: string; // 'wf' | 'fk'; // 潍坊 | 疯狂
  setGameArea: (gameArea: 'wf' | 'fk') => void;
  formData: JobInput;
  setFormData: (formData: JobInput) => void;
}

const initialState = {
  bears: 0,
  theme: '#987123',
  defaultGame: 'bh',
  cardSound: true,
  isKeyboardFeedback: true,
  games: [],
  freeUsed: {key: '2025-07-26', value: 0},
  autoRevertGame: true,
  pack: 4,
  isEagle: true, // 默认带鹰
  gameArea: 'wf', // 默认潍坊
  formData: {
    jobStability: JobStability.Private, // 默认私企
    city: CityTier.FirstTier, // 默认一线城市
    isHometown: false, // 默认不在家乡
    leader: LeaderRelation.Neutral, // 默认中规中矩
    colleague: ColleagueRelation.Harmonious, // 默认和和睦睦
    education: EducationLevel.Bachelor, // 默认本科
    university: UniversityType.Others, // 默认双非/其他
    environment: WorkEnvironment.Normal, // 默认普通环境
    experience: WorkExperience.OneToThree, // 默认 1~3 年
    salary: '200', // 默认年薪 20w
    country: 'CN', // 中国
    dailyHours: '9', // 日总工时（含通勤）
    commuteHoursPerDay: '1', // 单程通勤 1 小时
    slackingHoursPerDay: '1', // 每天摸鱼 1 小时
    leaveDays: '16', // 总休假 = 法定节假日 + 公司年假
    weeklyDays: '5', // 每周工作天数 5
    weeklyWFH: '0', // 每周居家 0 天
    sickLeave: '3', // 带薪病假 3 天
    publicHolidays: '11', // 国家法定节假日 11 天
    companyAnnualLeave: '5', // 公司年假 5 天
    shuttle: ShuttleService.Unreachable, // 默认无班车
    canteen: CanteenQuality.Average, // 默认食堂一般
  },
};

const useCaches = create<States>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        increase: by => set(state => ({bears: state.bears + by})),
        setTheme: theme => set({theme}),
        setDefaultGame: defaultGame => set({defaultGame}),
        setCardCound: cardSound => set({cardSound}),
        setIsKeyboardFeedback: isKeyboardFeedback => set({isKeyboardFeedback}),
        setGames: games => set({games}),
        setFreeUsed: freeUsed => set({freeUsed}),
        setAutoRevertGame: autoRevertGame => set({autoRevertGame}),
        setPack: pack => set({pack}),
        setIsEagle: isEagle => set({isEagle}),
        setGameArea: gameArea => set({gameArea}),
        setFormData: formData => set({formData}),
      }),
      {
        storage: createJSONStorage(() => mmkvStorage),
        name: 'useCaches.ts',
        /** 白名单 */
        partialize: state => ({
          bears: state.bears,
          theme: state.theme,
          defaultGame: state.defaultGame,
          cardSound: state.cardSound,
          isKeyboardFeedback: state.isKeyboardFeedback,
          games: state.games,
          freeUsed: state.freeUsed,
          pack: state.pack,
          isEagle: state.isEagle,
          autoRevertGame: state.autoRevertGame,
          gameArea: state.gameArea,
        }),
      },
    ),
  ),
);

export {useCaches};
