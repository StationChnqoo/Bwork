import {create} from 'zustand';
import {createJSONStorage, devtools, persist} from 'zustand/middleware';

import {MMKV} from 'react-native-mmkv';
import {StateStorage} from 'zustand/middleware';
import {Game, KeyValue, WorthForm} from './t';

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
  formData: WorthForm;
  setFormData: (formData: WorthForm) => void;
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
    salary: '0',
    countryCode: 'CN',
    workDaysPerWeek: '5',
    wfhDaysPerWeek: '0',
    annualLeave: '5',
    paidSickLeave: '3',
    publicHolidays: '13',
    workHours: '10',
    commuteHours: '2',
    restTime: '2',
    cityFactor: '1.0',
    workEnvironment: '1.0',
    leadership: '1.0',
    teamwork: '1.0',
    homeTown: 'no',
    degreeType: 'bachelor',
    schoolType: 'firstTier',
    bachelorType: 'firstTier',
    workYears: '0',
    shuttle: '1.0',
    canteen: '1.0',
    jobStability: 'private', // 新增：工作稳定度/类型
    education: '1.0',
    hasShuttle: false, // 确保这是一个明确的布尔值
    hasCanteen: false, // 确保这是一个明确的布尔值
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
