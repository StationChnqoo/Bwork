/**
 * 3A 4K 5Q 6A 7K 8Q 9A J2 拼接数量
 * @param input
 * @returns
 */
export const parseCard3Groups = (input: string): string => {
  const tokens = input.trim().toUpperCase().split('#');
  let result = '';
  for (const token of tokens) {
    if (token.length >= 2) {
      const card = token.slice(-1); // 最后一位是牌名
      const countStr = token.slice(0, -1); // 前面是数量
      const count = parseInt(countStr, 10);

      if (!isNaN(count) && /^[A-Z0-9]$/.test(card)) {
        result += card.repeat(count);
        continue;
      }
    } else if (token.length === 1 && /^[A-Z0-9]$/.test(token)) {
      // 单个字符，默认数量为 1
      result += token;
      continue;
    }
    // fallback：原样添加
    result += token;
  }
  return result;
};

/**
 * 34567890JQK2A 牌面剩余
 * @param playedCards
 * @returns
 */
export const calcRemainingRanks = (playedCards: string) => {
  const allRanks = '34567890JQKA2'.split('');
  const groups = playedCards.toUpperCase().trim().split('#');
  const used = new Set<string>();
  for (const group of groups) {
    const card = group.slice(-1); // 每组最后一个字符为牌名
    if (allRanks.includes(card)) {
      used.add(card);
    }
  }
  // return allRanks.filter(rank => !used.has(rank)).join('');
  return allRanks.map(rank => (used.has(rank) ? ' ' : rank)).join('');
};

/**
 *
 * @returns
 */
export const buildRandomHexColor = () => {
  return `#${Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0')}`;
};

export enum JobStability {
  Government = 'government',
  State = 'state',
  Foreign = 'foreign',
  Private = 'private',
  Dispatch = 'dispatch',
  Freelance = 'freelance',
}

// 工作稳定程度
export const JobStabilityOptions = [
  {label: '政府、事业编', value: JobStability.Government, multiplier: 0.8},
  {label: '国企、大型企业', value: JobStability.State, multiplier: 0.9},
  {label: '外企', value: JobStability.Foreign, multiplier: 0.95},
  {label: '私企', value: JobStability.Private, multiplier: 1.0},
  {label: '劳务派遣/OD', value: JobStability.Dispatch, multiplier: 1.1},
  {label: '自由职业', value: JobStability.Freelance, multiplier: 1.1},
];

enum CityTier {
  FirstTier,
  NewFirstTier,
  SecondTier,
  ThirdTier,
  FourthTier,
  County,
  Township,
}

// 有和代码出入
export const CityTierOptions = [
  {label: '一线', value: CityTier.FirstTier, multiplier: 0.8},
  {label: '新一线', value: CityTier.NewFirstTier, multiplier: 0.9},
  {label: '二线城市', value: CityTier.SecondTier, multiplier: 1.0},
  {label: '三线', value: CityTier.ThirdTier, multiplier: 1.05},
  {label: '四线', value: CityTier.FourthTier, multiplier: 1.1},
  {label: '县城', value: CityTier.County, multiplier: 1.15},
  {label: '乡镇', value: CityTier.Township, multiplier: 1.2},
];

export enum LeaderRelation {
  Unhappy = 'unhappy', // 对我不爽
  Strict = 'strict', // 管理严格
  Neutral = 'neutral', // 中规中矩
  Kind = 'kind', // 善解人意
  DirectLine = 'direct_line', // 我是嫡系
}

export const LeaderRelationOptions = [
  {label: '对我不爽', value: LeaderRelation.Unhappy, multiplier: 1.2}, // 风险大，价值低
  {label: '管理严格', value: LeaderRelation.Strict, multiplier: 1.1}, // 压力较大
  {label: '中规中矩', value: LeaderRelation.Neutral, multiplier: 1.0}, // 基准
  {label: '善解人意', value: LeaderRelation.Kind, multiplier: 0.9}, // 稳定，价值高
  {label: '我是嫡系', value: LeaderRelation.DirectLine, multiplier: 0.8}, // 非常稳定，价值最高
];

export enum ColleagueRelation {
  Toxic = 'toxic', // 都是傻逼
  Stranger = 'stranger', // 萍水相逢
  Harmonious = 'harmonious', // 和和睦睦
  Close = 'close', // 私交甚好
}

export enum ShuttleService {
  Unreachable = 'unreachable', // 无法抵达
  Inconvenient = 'inconvenient', // 班车不便
  Convenient = 'convenient', // 便利班车
  Direct = 'direct', // 班车直达
}

export const ShuttleServiceOptions = [
  {label: '无法抵达', value: ShuttleService.Unreachable, multiplier: 1.2}, // 不方便，加分低
  {label: '班车不便', value: ShuttleService.Inconvenient, multiplier: 1.1},
  {label: '便利班车', value: ShuttleService.Convenient, multiplier: 0.95},
  {label: '班车直达', value: ShuttleService.Direct, multiplier: 0.9}, // 最便利，加分高
];

export enum CanteenQuality {
  Terrible = 'terrible', // 很难吃
  Average = 'average', // 食堂一般
  Good = 'good', // 食堂不错
  Excellent = 'excellent', // 食堂超赞
}

export const CanteenQualityOptions = [
  {label: '很难吃', value: CanteenQuality.Terrible, multiplier: 1.2}, // 食堂差，减分
  {label: '食堂一般', value: CanteenQuality.Average, multiplier: 1.1},
  {label: '食堂不错', value: CanteenQuality.Good, multiplier: 0.95},
  {label: '食堂超赞', value: CanteenQuality.Excellent, multiplier: 0.9}, // 食堂好，加分
];

export const ColleagueRelationOptions = [
  {label: '都是傻逼', value: ColleagueRelation.Toxic, multiplier: 1.2}, // 环境差，风险高
  {label: '萍水相逢', value: ColleagueRelation.Stranger, multiplier: 1.05}, // 没关系，中性偏高
  {label: '和和睦睦', value: ColleagueRelation.Harmonious, multiplier: 1.0}, // 基准
  {label: '私交甚好', value: ColleagueRelation.Close, multiplier: 0.9}, // 稳定加分
];

export enum EducationLevel {
  DiplomaOrBelow = 'diplomaOrBelow', // 专科及以下
  Bachelor = 'bachelor', // 本科
  Master = 'master', // 硕士
  Doctor = 'doctor', // 博士
}

export const EducationLevelOptions = [
  {label: '专科及以下', value: EducationLevel.DiplomaOrBelow, multiplier: 1.1}, // 学历低，加分低
  {label: '本科', value: EducationLevel.Bachelor, multiplier: 1.0}, // 本科基准
  {label: '硕士', value: EducationLevel.Master, multiplier: 0.9}, // 高学历，加分高
  {label: '博士', value: EducationLevel.Doctor, multiplier: 0.85}, // 最高学历，加分最高
];

export enum UniversityType {
  DoubleFirstClass = 'doubleFirstClass', // 985/211
  FirstTier = 'firstTier', // 一本
  SecondTier = 'secondTier', // 二本/三本
  Others = 'others', // 双非或其他
}

export const UniversityTypeOptions = [
  {label: '985/211', value: UniversityType.DoubleFirstClass, multiplier: 0.85},
  {label: '一本', value: UniversityType.FirstTier, multiplier: 0.9},
  {label: '二本/三本', value: UniversityType.SecondTier, multiplier: 1.0},
  {label: '双非/其他', value: UniversityType.Others, multiplier: 1.1},
];

export enum WorkEnvironment {
  RemoteFactoryOutdoor = 'remoteFactoryOutdoor', // 偏僻的工厂/工地/户外
  FactoryOutdoor = 'factoryOutdoor',             // 工厂/工地/户外
  Normal = 'normal',                             // 普通环境
  CBD = 'cbd',                                   // CBD
}

export const WorkEnvironmentOptions = [
  { label: '偏僻的工厂/工地/户外', value: WorkEnvironment.RemoteFactoryOutdoor, multiplier: 1.2 },
  { label: '工厂/工地/户外', value: WorkEnvironment.FactoryOutdoor, multiplier: 1.1 },
  { label: '普通环境', value: WorkEnvironment.Normal, multiplier: 1.0 },
  { label: 'CBD', value: WorkEnvironment.CBD, multiplier: 0.9 },
];

export enum WorkExperience {
  LessThan1 = '<1',      // 不满1年
  OneToThree = '1-3',    // 1~3年
  ThreeToFive = '3-5',   // 3~5年
  FiveToTen = '5-10',    // 5~10年
  MoreThanTen = '10+',   // 10年以上
}

export const WorkExperienceOptions = [
  { label: '应届生', value: WorkExperience.LessThan1, multiplier: 1.2 },
  { label: '1~3年', value: WorkExperience.OneToThree, multiplier: 1.1 },
  { label: '3~5年', value: WorkExperience.ThreeToFive, multiplier: 1.0 },
  { label: '5~10年', value: WorkExperience.FiveToTen, multiplier: 0.9 },
  { label: '10年以上', value: WorkExperience.MoreThanTen, multiplier: 0.8 },
];

/**
 * Hex -> rgba
 * @param hex
 * @param alpha
 * @returns
 */
export const hexToRgba = (hex: string, alpha = 1) => {
  // 去除 # 号
  hex = hex.replace('#', '');
  // 解析 R, G, B
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export interface CountryInfo {
  name: string; // 国家中文名
  pppFactor: number; // PPP 转换因子
  currencySymbol: string; // 货币符号
}

export const Countries: Record<string, CountryInfo> = {
  AF: {name: '阿富汗', pppFactor: 18.71, currencySymbol: '؋'},
  AO: {name: '安哥拉', pppFactor: 167.66, currencySymbol: 'Kz'},
  AL: {name: '阿尔巴尼亚', pppFactor: 41.01, currencySymbol: 'L'},
  AR: {name: '阿根廷', pppFactor: 28.67, currencySymbol: '$'},
  AM: {name: '亚美尼亚', pppFactor: 157.09, currencySymbol: '֏'},
  AG: {name: '安提瓜和巴布达', pppFactor: 2.06, currencySymbol: '$'},
  AU: {name: '澳大利亚', pppFactor: 1.47, currencySymbol: 'A$'},
  AT: {name: '奥地利', pppFactor: 0.76, currencySymbol: '€'},
  AZ: {name: '阿塞拜疆', pppFactor: 0.5, currencySymbol: '₼'},
  BI: {name: '布隆迪', pppFactor: 680.41, currencySymbol: 'FBu'},
  BE: {name: '比利时', pppFactor: 0.75, currencySymbol: '€'},
  BJ: {name: '贝宁', pppFactor: 211.97, currencySymbol: 'CFA'},
  BF: {name: '布基纳法索', pppFactor: 209.84, currencySymbol: 'CFA'},
  BD: {name: '孟加拉国', pppFactor: 32.81, currencySymbol: '৳'},
  BG: {name: '保加利亚', pppFactor: 0.7, currencySymbol: 'лв'},
  BH: {name: '巴林', pppFactor: 0.18, currencySymbol: '.د.ب'},
  BS: {name: '巴哈马', pppFactor: 0.88, currencySymbol: 'B$'},
  BA: {name: '波斯尼亚和黑塞哥维那', pppFactor: 0.66, currencySymbol: 'KM'},
  BY: {name: '白俄罗斯', pppFactor: 0.77, currencySymbol: 'Br'},
  BZ: {name: '伯利兹', pppFactor: 1.37, currencySymbol: 'BZ$'},
  BO: {name: '玻利维亚', pppFactor: 2.6, currencySymbol: 'Bs'},
  BR: {name: '巴西', pppFactor: 2.36, currencySymbol: 'R$'},
  BB: {name: '巴巴多斯', pppFactor: 2.24, currencySymbol: 'Bds$'},
  BN: {name: '文莱达鲁萨兰国', pppFactor: 0.58, currencySymbol: 'B$'},
  BT: {name: '不丹', pppFactor: 20.11, currencySymbol: 'Nu.'},
  BW: {name: '博茨瓦纳', pppFactor: 4.54, currencySymbol: 'P'},
  CF: {name: '中非共和国', pppFactor: 280.19, currencySymbol: 'FCFA'},
  CA: {name: '加拿大', pppFactor: 1.21, currencySymbol: 'C$'},
  CH: {name: '瑞士', pppFactor: 1.14, currencySymbol: 'CHF'},
  CL: {name: '智利', pppFactor: 418.43, currencySymbol: 'CLP$'},
  CN: {name: '中国', pppFactor: 4.19, currencySymbol: '¥'},
  CI: {name: '科特迪瓦', pppFactor: 245.25, currencySymbol: 'CFA'},
  CM: {name: '喀麦隆', pppFactor: 228.75, currencySymbol: 'FCFA'},
  CD: {name: '刚果（金）', pppFactor: 911.27, currencySymbol: 'FC'},
  CG: {name: '刚果（布）', pppFactor: 312.04, currencySymbol: 'FCFA'},
  CO: {name: '哥伦比亚', pppFactor: 1352.79, currencySymbol: 'Col$'},
  CR: {name: '哥斯达黎加', pppFactor: 335.86, currencySymbol: '₡'},
  CY: {name: '塞浦路斯', pppFactor: 0.61, currencySymbol: '€'},
  CZ: {name: '捷克共和国', pppFactor: 12.66, currencySymbol: 'Kč'},
  DE: {name: '德国', pppFactor: 0.75, currencySymbol: '€'},
  DK: {name: '丹麦', pppFactor: 6.6, currencySymbol: 'kr'},
  DO: {name: '多米尼加共和国', pppFactor: 22.9, currencySymbol: 'RD$'},
  DZ: {name: '阿尔及利亚', pppFactor: 37.24, currencySymbol: 'د.ج'},
  EC: {name: '厄瓜多尔', pppFactor: 0.51, currencySymbol: '$'},
  EG: {name: '阿拉伯埃及共和国', pppFactor: 4.51, currencySymbol: 'E£'},
  ES: {name: '西班牙', pppFactor: 0.62, currencySymbol: '€'},
  EE: {name: '爱沙尼亚', pppFactor: 0.53, currencySymbol: '€'},
  ET: {name: '埃塞俄比亚', pppFactor: 12.11, currencySymbol: 'Br'},
  FI: {name: '芬兰', pppFactor: 0.84, currencySymbol: '€'},
  FJ: {name: '斐济', pppFactor: 0.91, currencySymbol: 'FJ$'},
  FR: {name: '法国', pppFactor: 0.73, currencySymbol: '€'},
  GB: {name: '英国', pppFactor: 0.7, currencySymbol: '£'},
  GE: {name: '格鲁吉亚', pppFactor: 0.9, currencySymbol: '₾'},
  GH: {name: '加纳', pppFactor: 2.33, currencySymbol: '₵'},
  GR: {name: '希腊', pppFactor: 0.54, currencySymbol: '€'},
  HK: {name: '香港特别行政区', pppFactor: 6.07, currencySymbol: 'HK$'},
  HU: {name: '匈牙利', pppFactor: 148.01, currencySymbol: 'Ft'},
  ID: {name: '印度尼西亚', pppFactor: 4673.65, currencySymbol: 'Rp'},
  IN: {name: '印度', pppFactor: 21.99, currencySymbol: '₹'},
  IE: {name: '爱尔兰', pppFactor: 0.78, currencySymbol: '€'},
  IR: {name: '伊朗伊斯兰共和国', pppFactor: 30007.63, currencySymbol: '﷼'},
  IQ: {name: '伊拉克', pppFactor: 507.58, currencySymbol: 'ع.د'},
  IS: {name: '冰岛', pppFactor: 145.34, currencySymbol: 'kr'},
  IL: {name: '以色列', pppFactor: 3.59, currencySymbol: '₪'},
  IT: {name: '意大利', pppFactor: 0.66, currencySymbol: '€'},
  JP: {name: '日本', pppFactor: 102.84, currencySymbol: '¥'},
  KE: {name: '肯尼亚', pppFactor: 43.95, currencySymbol: 'KSh'},
  KR: {name: '大韩民国', pppFactor: 861.82, currencySymbol: '₩'},
  LB: {name: '黎巴嫩', pppFactor: 1414.91, currencySymbol: 'L£'},
  LK: {name: '斯里兰卡', pppFactor: 51.65, currencySymbol: 'Rs'},
  LT: {name: '立陶宛', pppFactor: 0.45, currencySymbol: '€'},
  LU: {name: '卢森堡', pppFactor: 0.86, currencySymbol: '€'},
  LV: {name: '拉脱维亚', pppFactor: 0.48, currencySymbol: '€'},
  MO: {name: '中国澳门特别行政区', pppFactor: 5.18, currencySymbol: 'MOP$'},
  MA: {name: '摩洛哥', pppFactor: 3.92, currencySymbol: 'د.م.'},
  MX: {name: '墨西哥', pppFactor: 9.52, currencySymbol: 'Mex$'},
  MY: {name: '马来西亚', pppFactor: 1.57, currencySymbol: 'RM'},
  NG: {name: '尼日利亚', pppFactor: 144.27, currencySymbol: '₦'},
  NL: {name: '荷兰', pppFactor: 0.77, currencySymbol: '€'},
  NO: {name: '挪威', pppFactor: 10.03, currencySymbol: 'kr'},
  NP: {name: '尼泊尔', pppFactor: 33.52, currencySymbol: 'रू'},
  NZ: {name: '新西兰', pppFactor: 1.45, currencySymbol: 'NZ$'},
  PK: {name: '巴基斯坦', pppFactor: 38.74, currencySymbol: '₨'},
  PA: {name: '巴拿马', pppFactor: 0.46, currencySymbol: 'B/.'},
  PE: {name: '秘鲁', pppFactor: 1.8, currencySymbol: 'S/.'},
  PH: {name: '菲律宾', pppFactor: 19.51, currencySymbol: '₱'},
  PL: {name: '波兰', pppFactor: 1.78, currencySymbol: 'zł'},
  PT: {name: '葡萄牙', pppFactor: 0.57, currencySymbol: '€'},
  QA: {name: '卡塔尔', pppFactor: 2.06, currencySymbol: 'ر.ق'},
  RO: {name: '罗马尼亚', pppFactor: 1.71, currencySymbol: 'lei'},
  RU: {name: '俄罗斯联邦', pppFactor: 25.88, currencySymbol: '₽'},
  SA: {name: '沙特阿拉伯', pppFactor: 1.61, currencySymbol: 'ر.س'},
  SG: {name: '新加坡', pppFactor: 0.84, currencySymbol: 'S$'},
  SK: {name: '斯洛伐克共和国', pppFactor: 0.53, currencySymbol: '€'},
  SI: {name: '斯洛文尼亚', pppFactor: 0.56, currencySymbol: '€'},
  SE: {name: '瑞典', pppFactor: 8.77, currencySymbol: 'kr'},
  TH: {name: '泰国', pppFactor: 12.34, currencySymbol: '฿'},
  TR: {name: '土耳其', pppFactor: 2.13, currencySymbol: '₺'},
  TW: {name: '台湾', pppFactor: 13.85, currencySymbol: 'NT$'},
  UA: {name: '乌克兰', pppFactor: 7.69, currencySymbol: '₴'},
  US: {name: '美国', pppFactor: 1.0, currencySymbol: '$'},
  UY: {name: '乌拉圭', pppFactor: 28.45, currencySymbol: '$U'},
  VN: {name: '越南', pppFactor: 7473.67, currencySymbol: '₫'},
  ZA: {name: '南非', pppFactor: 6.93, currencySymbol: 'R'},
  ZW: {name: '津巴布韦', pppFactor: 24.98, currencySymbol: 'Z$'},
};
