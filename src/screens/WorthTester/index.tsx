import Flex from '@src/components/Flex';
import MoreButton from '@src/components/MoreButton';
import Stepper from '@src/components/Stepper';
import {
  calcEducationFactor,
  CanteenQuality,
  CanteenQualityOptions,
  CityTierOptions,
  ColleagueRelationOptions,
  Countries,
  EducationLevelOptions,
  getMultiplierInOptions,
  JobStability,
  JobStabilityOptions,
  LeaderRelationOptions,
  ShuttleService,
  ShuttleServiceOptions,
  Tips,
  UniversityTypeOptions,
  WorkEnvironmentOptions,
  WorkExperienceOptions,
} from '@src/constants/c';
import {useCaches} from '@src/constants/store';
import {JobInput} from '@src/constants/t';
import dayjs from 'dayjs';
import {produce} from 'immer';
import React, {useCallback, useEffect, useMemo} from 'react';
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksProp} from '../Screens';
import Tags from './components/Tags';
import BottomBar from './components/BottomBar';

interface MyProps {
  navigation?: RootStacksProp;
}

const WorkthTester: React.FC<MyProps> = props => {
  const {navigation} = props;
  const {theme, games, pack, setIsEagle, setGames, formData, setFormData} =
    useCaches();

  const height = Platform.select({
    ios: useSafeAreaInsets().top,
    android: StatusBar.currentHeight,
  });

  useEffect(() => {
    if (pack == 4) {
      setIsEagle(false);
    }
    return function () {};
  }, [pack]);

  const updateForm = (key: keyof JobInput, value: any) => {
    console.log('formData: ', formData);
    setFormData(
      produce(formData, draft => {
        // @ts-ignore
        draft[key] = value;
      }),
    );
  };

  useEffect(() => {
    const now = dayjs();
    const oneMonthAgo = now.subtract(1, 'month');
    const recentMonthGames = games.filter(game =>
      dayjs(game.time).isAfter(oneMonthAgo),
    );
    setGames([...recentMonthGames]);
    return function () {};
  }, []);

  const alert = (title: string, message: string) => {
    Alert.alert(title, message, [{text: '好的', onPress: () => {}}]);
  };

  const calculateWorkingDays = useCallback(() => {
    const weeksPerYear = 52;
    const totalWorkDays = weeksPerYear * Number(formData.weeklyDays); // 确保转换为数字
    const totalLeaves =
      Number(formData.companyAnnualLeave) +
      Number(formData.publicHolidays) +
      Number(formData.sickLeave) * 0.6; // 带薪病假按70%权重计算
    return Math.max(totalWorkDays - totalLeaves, 0);
  }, [
    formData.weeklyDays,
    formData.companyAnnualLeave,
    formData.publicHolidays,
    formData.sickLeave,
  ]);

  const calculateDailySalary = useMemo(() => {
    if (!formData.salary) return 0;
    const workingDays = calculateWorkingDays();

    // 应用PPP转换因子标准化薪资
    // 如果选择了非中国地区，使用选定国家的PPP；否则使用中国默认值4.19
    const isNonChina = formData.country !== 'CN';
    const pppFactor = isNonChina
      ? Countries[formData.country].pppFactor || 4.19
      : 4.19;
    const standardizedSalary = Number(formData.salary) * (4.19 / pppFactor);
    return standardizedSalary / workingDays;
  }, [formData]);

  const score = useMemo(() => {
    if (!formData.salary) return 0;
    const dailySalary = calculateDailySalary;
    const workHours = Number(formData.dailyHours);
    const commuteHours = Number(formData.commuteHoursPerDay);
    const restTime = Number(formData.slackingHoursPerDay);

    // 确保正确转换为数字，使用parseFloat可以更可靠地处理字符串转数字
    const workDaysPerWeek = parseFloat(formData.weeklyDays) || 5;

    // 允许wfhDaysPerWeek为空字符串，计算时才处理为0
    const wfhInput = formData.weeklyWFH.trim();
    const wfhDaysPerWeek =
      wfhInput === ''
        ? 0
        : Math.min(parseFloat(wfhInput) || 0, workDaysPerWeek);

    // 确保有办公室工作天数时才计算比例，否则设为0
    const officeDaysRatio =
      workDaysPerWeek > 0
        ? (workDaysPerWeek - wfhDaysPerWeek) / workDaysPerWeek
        : 0;

    // 班车系数只在勾选时使用，否则为1.0
    const shuttleFactor = getMultiplierInOptions(
      ShuttleServiceOptions,
      formData.shuttle,
    );
    const effectiveCommuteHours =
      commuteHours * officeDaysRatio * shuttleFactor;

    // 食堂系数只在勾选时使用，否则为1.0
    const canteenFactor = getMultiplierInOptions(
      CanteenQualityOptions,
      formData.canteen,
    );

    // 工作环境因素，包含食堂和家乡因素
    const environmentFactor =
      getMultiplierInOptions(WorkEnvironmentOptions, formData.environment) *
      getMultiplierInOptions(LeaderRelationOptions, formData.leader) *
      getMultiplierInOptions(ColleagueRelationOptions, formData.colleague) *
      getMultiplierInOptions(CityTierOptions, `${formData.city}`) *
      canteenFactor;

    // 根据工作年限计算经验薪资倍数
    const workYears = Number(formData.experience);
    let experienceSalaryMultiplier = 1.0;

    if (workYears === 0) {
      // 应届生：直接根据工作类型设定初始调整系数，反映稳定性/风险价值
      // 注意：这些系数在分母中，系数越小，最终价值越高
      if (formData.jobStability === JobStability.Government) {
        experienceSalaryMultiplier = 0.8; // 体制内稳定性高，价值相对高
      } else if (formData.jobStability === JobStability.State) {
        experienceSalaryMultiplier = 0.9; // 央/国企较稳定，价值相对高
      } else if (formData.jobStability === JobStability.Foreign) {
        experienceSalaryMultiplier = 0.95; // 外企，较为稳定
      } else if (formData.jobStability === JobStability.Private) {
        experienceSalaryMultiplier = 1.0; // 私企作为基准
      } else if (formData.jobStability === JobStability.Dispatch) {
        experienceSalaryMultiplier = 1.1; // 派遣社员风险高，价值相对低
      } else if (formData.jobStability === JobStability.Freelance) {
        experienceSalaryMultiplier = 1.1; // 自由职业风险高，价值相对低
      }
    } else {
      // 非应届生：使用基于增长预期的模型
      // 基准薪资增长曲线（适用于私企）
      let baseSalaryMultiplier = 1.0;
      baseSalaryMultiplier = getMultiplierInOptions(
        WorkExperienceOptions,
        formData.experience,
      );

      // 工作单位类型对涨薪幅度的影响系数
      let salaryGrowthFactor = 1.0; // 私企基准
      if (formData.jobStability === JobStability.Foreign) {
        salaryGrowthFactor = 0.8; // 外企涨薪幅度为私企的80%
      } else if (formData.jobStability === JobStability.State) {
        salaryGrowthFactor = 0.4; // 央/国企涨薪幅度为私企的40%
      } else if (formData.jobStability === JobStability.Government) {
        salaryGrowthFactor = 0.2; // 体制内涨薪幅度为私企的20%
      } else if (formData.jobStability === JobStability.Dispatch) {
        salaryGrowthFactor = 1.2; // 派遣社员涨薪幅度为私企的120%（体现不稳定性）
      } else if (formData.jobStability === JobStability.Freelance) {
        salaryGrowthFactor = 1.2; // 自由职业涨薪幅度为私企的120%（体现不稳定性）
      }

      // 根据公式: 1 + (对应幅度-1) * 工作单位系数，计算最终薪资倍数
      experienceSalaryMultiplier =
        1 + (baseSalaryMultiplier - 1) * salaryGrowthFactor;
    }

    // 薪资满意度应该受到经验薪资倍数的影响
    // 相同薪资，对于高经验者来说价值更低，对应的计算公式需要考虑经验倍数
    let education = calcEducationFactor(
      formData.education,
      formData.university,
    );

    return (
      (dailySalary * environmentFactor) /
      (35 *
        (workHours + effectiveCommuteHours - 0.5 * restTime) *
        Number(education) *
        experienceSalaryMultiplier)
    );
  }, [formData]);

  return (
    <View style={styles.container}>
      <View style={{backgroundColor: '#fff', height}} />
      <ScrollView>
        <View style={{flex: 1, paddingHorizontal: 12}}>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>基本信息</Text>
            <View style={{height: 12}} />
            <View style={styles.settingItem}>
              <Text style={{fontSize: 14, color: '#333'}}>年薪总包</Text>
              <Stepper
                value={formData.salary}
                onChange={s => updateForm('salary', s)}
                length={6}
              />
            </View>
            <View style={{height: 10}} />
            <View style={styles.settingItem}>
              <Text style={{fontSize: 14, color: '#333'}}>工作国家</Text>
              <Text
                style={{
                  fontSize: 14,
                  color: theme,
                  textDecorationLine: 'underline',
                }}>{`${Countries[formData.country].name} -> PPP系数${
                Countries[formData.country].pppFactor
              }`}</Text>
              <MoreButton label={''} onPress={() => {}} />
            </View>
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>学历</Text>
            <View style={{height: 10}} />
            <Text style={{color: '#333', fontSize: 14}}>学位类型</Text>
            <View style={{height: 10}} />
            <Tags
              datas={EducationLevelOptions}
              onPress={s => {
                updateForm('education', s.value);
              }}
              current={formData.education}
            />
            <View style={{height: 10}} />
            <Text style={{color: '#333', fontSize: 14}}>学校类型</Text>
            <View style={{height: 10}} />
            <Tags
              datas={UniversityTypeOptions}
              onPress={s => {
                updateForm('university', s.value);
              }}
              current={formData.university}
            />
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>工作年限</Text>
            <View style={{height: 10}} />
            <Tags
              datas={WorkExperienceOptions}
              onPress={s => {
                updateForm('experience', s.value);
              }}
              current={formData.experience}
            />
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>所在城市（按生活成本选择）</Text>
            <View style={{height: 10}} />
            <Tags
              datas={CityTierOptions}
              onPress={s => {
                updateForm('city', s.value);
              }}
              current={formData.city}
            />
            <View style={{height: 10}} />
            <Flex justify={'space-between'} horizontal>
              <Text style={{color: '#333', fontSize: 14}}>是否在家乡</Text>
              <Switch
                value={formData.isHometown}
                onValueChange={value => {
                  updateForm('isHometown', !formData.isHometown);
                }}
                trackColor={{false: '#ccc', true: theme}}
                thumbColor={formData.isHometown ? '#fff' : '#f4f3f4'}
              />
            </Flex>
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={{fontSize: 16, color: '#333', fontWeight: '500'}}>
              工时和假期
            </Text>
            <View style={{height: 12}} />
            <View style={styles.settingItem}>
              <Text style={{fontSize: 14, color: '#333'}}>每周工作天数</Text>
              <Stepper
                value={formData.weeklyDays}
                onChange={s => updateForm('weeklyDays', s)}
              />
            </View>
            <View style={{height: 5}} />
            <View style={styles.settingItem}>
              <Flex horizontal>
                <Text style={{fontSize: 14, color: '#333'}}>周WFH天数</Text>
                <View style={{width: 4}} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    alert('周WFH天数', Tips.WFH);
                  }}>
                  <Image
                    source={require('@src/assets/images/common/form_help.png')}
                    style={{height: 16, width: 16, tintColor: theme}}
                  />
                </TouchableOpacity>
              </Flex>
              <View style={{height: 5}} />
              <Stepper
                value={formData.weeklyWFH}
                onChange={s => updateForm('weeklyWFH', s)}
              />
            </View>
            <View style={{height: 12}} />
            <View style={styles.settingItem}>
              <Text style={{fontSize: 14, color: '#333'}}>年假天数</Text>
              <Stepper
                value={formData.companyAnnualLeave}
                onChange={s => updateForm('companyAnnualLeave', s)}
              />
            </View>
            <View style={{height: 5}} />
            <View style={styles.settingItem}>
              <Text style={{fontSize: 14, color: '#333'}}>法定年假</Text>
              <Stepper
                value={formData.publicHolidays}
                onChange={s => updateForm('publicHolidays', s)}
              />
            </View>
            <View style={{height: 5}} />
            <View style={styles.settingItem}>
              <Text style={{fontSize: 14, color: '#333'}}>带薪病假</Text>
              <Stepper
                value={formData.sickLeave}
                onChange={s => updateForm('sickLeave', s)}
              />
            </View>
            <View style={{height: 12}} />
            <View style={styles.settingItem}>
              <Flex horizontal>
                <Text style={{fontSize: 14, color: '#333'}}>总工时/小时</Text>
                <View style={{width: 4}} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    alert('总工时', Tips.HoursOfDay);
                  }}>
                  <Image
                    source={require('@src/assets/images/common/form_help.png')}
                    style={{height: 16, width: 16, tintColor: theme}}
                  />
                </TouchableOpacity>
              </Flex>
              <Stepper
                value={formData.dailyHours}
                onChange={s => updateForm('dailyHours', s)}
              />
            </View>
            <View style={{height: 5}} />
            <View style={styles.settingItem}>
              <Flex horizontal>
                <Text style={{fontSize: 14, color: '#333'}}>通勤/小时</Text>
                <View style={{width: 4}} />
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={() => {
                    alert('通勤', Tips.BusOfDay);
                  }}>
                  <Image
                    source={require('@src/assets/images/common/form_help.png')}
                    style={{height: 16, width: 16, tintColor: theme}}
                  />
                </TouchableOpacity>
              </Flex>
              <View style={{height: 5}} />
              <Stepper
                value={formData.commuteHoursPerDay}
                onChange={s => updateForm('commuteHoursPerDay', s)}
              />
            </View>
            <View style={{height: 5}} />
            <View style={styles.settingItem}>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: '#333'}}>
                  休息 & 摸鱼/小时
                </Text>
              </View>
              <Stepper
                value={formData.slackingHoursPerDay}
                onChange={s => updateForm('slackingHoursPerDay', s)}
              />
            </View>
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>工作环境</Text>
            <View style={{height: 10}} />
            <Tags
              datas={WorkEnvironmentOptions}
              onPress={s => {
                updateForm('environment', s.value);
              }}
              current={formData.environment}
            />
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>职业稳定程度</Text>
            <View style={{height: 10}} />
            <Tags
              datas={JobStabilityOptions}
              onPress={s => {
                updateForm('jobStability', s.value);
              }}
              current={formData.jobStability}
            />
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>老板上级</Text>
            <View style={{height: 10}} />
            <Tags
              datas={LeaderRelationOptions}
              onPress={s => {
                updateForm('leader', s.value);
              }}
              current={formData.leader}
            />
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>同事关系</Text>
            <View style={{height: 10}} />
            <Tags
              datas={ColleagueRelationOptions}
              onPress={s => {
                updateForm('colleague', s.value);
              }}
              current={formData.colleague}
            />
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>加分项</Text>
            <View style={{height: 10}} />
            <Text style={{color: '#333', fontSize: 14}}>班车情况</Text>
            <View style={{height: 5}} />
            <Tags
              datas={ShuttleServiceOptions}
              onPress={s => {
                updateForm('shuttle', s.value);
              }}
              current={formData.shuttle}
            />
            <View style={{height: 10}} />
            <Text style={{color: '#333', fontSize: 14}}>食堂情况</Text>
            <View style={{height: 5}} />
            <Tags
              datas={CanteenQualityOptions}
              onPress={s => {
                updateForm('canteen', s.value);
              }}
              current={formData.canteen}
            />
          </View>
        </View>
        <View style={{height: 16}} />
      </ScrollView>
      <BottomBar
        score={score}
        dailySalary={calculateDailySalary}
        onPress={() => {
          navigation.navigate('WorthReport');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  groupTitle: {color: '#333', fontSize: 16, fontWeight: '500'},
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  themeTag: {
    borderRadius: 5,
    borderWidth: 1,
    height: 24,
    paddingHorizontal: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  startButton: {
    // borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 12,
  },
});

export default WorkthTester;
