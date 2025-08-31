import Flex from '@src/components/Flex';
import MoreButton from '@src/components/MoreButton';
import Stepper from '@src/components/Stepper';
import {
  calculateJobValue,
  CanteenQualityOptions,
  CityTierOptions,
  ColleagueRelationOptions,
  Countries,
  EducationLevelOptions,
  JobStabilityOptions,
  LeaderRelationOptions,
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

  const score = useMemo(() => {
    return calculateJobValue(formData);
  }, [formData]);

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

  const calculateDailySalary = useCallback(() => {
    if (!formData.salary) return 0;
    const workingDays = calculateWorkingDays();

    // 应用PPP转换因子标准化薪资
    // 如果选择了非中国地区，使用选定国家的PPP；否则使用中国默认值4.19
    const isNonChina = formData.country !== 'CN';
    const pppFactor = isNonChina
      ? Countries[formData.country].pppFactor || 4.19
      : 4.19;
    const standardizedSalary = Number(formData.salary) * (4.19 / pppFactor);
    return standardizedSalary / workingDays; // 除 0 不管, Infinity(爽到爆炸)!
  }, [formData.salary, formData.country, calculateWorkingDays]);

  // 新增：获取显示用的日薪（转回原始货币）
  const getDisplaySalary = useCallback(() => {
    const dailySalaryInCNY = calculateDailySalary();
    const isNonChina = formData.country !== 'CN';
    if (isNonChina) {
      // 非中国地区，转回本地货币
      const pppFactor = Countries[formData.country].pppFactor || 4.19;
      return ((dailySalaryInCNY * pppFactor) / 4.19).toFixed(2);
    } else {
      return dailySalaryInCNY.toFixed(2);
    }
  }, [calculateDailySalary, formData.country]);

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
            <Text style={styles.groupTitle}>领导/老板</Text>
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
            <Text style={styles.groupTitle}>同事环境</Text>
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
        score={0}
        dailySalary={calculateDailySalary()}
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
