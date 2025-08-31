import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';
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
import {Game, JobInput, KeyValue} from './t';

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
  isKeyboardFeedback: boolean;
  setIsKeyboardFeedback: (isKeyboardFeedback: boolean) => void;
  games: Game[];
  setGames: (games: Game[]) => void;
  freeUsed: KeyValue;
  setFreeUsed: (freeUsed: KeyValue) => void;
  pack: number;
  setPack: (pack: number) => void;
  formData: JobInput;
  setFormData: (formData: JobInput) => void;
}

const initialState = {
  bears: 0,
  theme: '#987123',
  isKeyboardFeedback: true,
  games: [],
  freeUsed: {key: '2025-07-26', value: 0},
  pack: 4,
  formData: {
    jobStability: JobStability.Private, // 默认私企
    city: CityTier.FirstTier, // 默认一线城市
    isHometown: false, // 默认不在家乡
    leader: LeaderRelation.Neutral, // 默认中规中矩
    colleague: ColleagueRelation.Harmonious, // 默认和和睦睦
    education: EducationLevel.Bachelor, // 默认本科
    university: UniversityType._23, // 默认双非/其他
    environment: WorkEnvironment.Normal, // 默认普通环境
    experience: WorkExperience.ThreeTo5, // 默认 1~3 年
    salary: '36000', // 默认年薪 20w
    country: 'CN', // 中国
    dailyHours: '9', // 日总工时（含通勤）
    commuteHoursPerDay: '1', // 单程通勤 1 小时
    slackingHoursPerDay: '1', // 每天摸鱼 1 小时
    weeklyDays: '5', // 每周工作天数 5
    weeklyWFH: '0', // 每周居家 0 天
    sickLeave: '0', // 带薪病假 3 天
    publicHolidays: '13', // 国家法定节假日 11 天
    companyAnnualLeave: '5', // 公司年假 5 天
    shuttle: ShuttleService.Unreachable, // 默认无班车
    canteen: CanteenQuality.Terrible, // 默认食堂一般
  },
};

const useCaches = create<States>()(
  devtools(
    persist(
      set => ({
        ...initialState,
        increase: by => set(state => ({bears: state.bears + by})),
        setTheme: theme => set({theme}),
        setIsKeyboardFeedback: isKeyboardFeedback => set({isKeyboardFeedback}),
        setGames: games => set({games}),
        setFreeUsed: freeUsed => set({freeUsed}),
        setPack: pack => set({pack}),
        setFormData: formData => set({formData}),
      }),
      {
        storage: createJSONStorage(() => mmkvStorage),
        name: 'useCaches.ts',
        /** 白名单 */
        partialize: state => ({
          bears: state.bears,
          theme: state.theme,
          isKeyboardFeedback: state.isKeyboardFeedback,
          games: state.games,
          freeUsed: state.freeUsed,
          pack: state.pack,
        }),
      },
    ),
  ),
);

export {useCaches};
