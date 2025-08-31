import CheckBox from '@src/components/CheckBox';
import Flex from '@src/components/Flex';
import MoreButton from '@src/components/MoreButton';
import Stepper from '@src/components/Stepper';
import {
  CanteenQualityOptions,
  CityTierOptions,
  ColleagueRelationOptions,
  Countries,
  EducationLevelOptions,
  JobStabilityOptions,
  LeaderRelationOptions,
  ShuttleServiceOptions,
  UniversityTypeOptions,
  WorkEnvironmentOptions,
  WorkExperienceOptions,
} from '@src/constants/c';
import {useCaches} from '@src/constants/store';
import {WorthForm} from '@src/constants/t';
import dayjs from 'dayjs';
import {produce} from 'immer';
import React, {useEffect} from 'react';
import {
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

interface MyProps {
  navigation?: RootStacksProp;
}

const WorkthTester: React.FC<MyProps> = props => {
  const {navigation} = props;
  const {
    theme,
    defaultGame,
    setDefaultGame,
    cardSound,
    isKeyboardFeedback,
    setIsKeyboardFeedback,
    autoRevertGame,
    setAutoRevertGame,
    games,
    setPack,
    pack,
    isEagle,
    setIsEagle,
    gameArea,
    setGameArea,
    setGames,
    formData,
    setFormData,
  } = useCaches();

  const height = Platform.select({
    ios: useSafeAreaInsets().top,
    android: StatusBar.currentHeight,
  });

  const frames = useSafeAreaInsets();

  const supportedGames = {
    gj: {
      title: '够级（鹰 🦅）',
      page: 'Gouji',
      message: '6副牌、4副牌',
    },
    bh: {
      title: '保皇（炸弹 💣 ）',
      page: 'Baohuang',
      message: '潍坊保皇、疯狂保皇',
    },
  };

  useEffect(() => {
    if (pack == 4) {
      setIsEagle(false);
    }
    return function () {};
  }, [pack]);

  const updateForm = (key: keyof WorthForm, value: any) => {
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
              <Text style={{fontSize: 14, color: '#333'}}>年薪总包 / K</Text>
              <Stepper
                value={formData.salary}
                onChange={s => updateForm('salary', s)}
              />
            </View>
            <View style={{height: 10}} />
            <View style={styles.settingItem}>
              <Text style={{fontSize: 14, color: '#333'}}>工作国家</Text>
              <MoreButton
                label={`${Countries[formData.countryCode].name} | PPP系数${
                  Countries[formData.countryCode].pppFactor
                }`}
                onPress={() => {}}
              />
            </View>
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={{fontSize: 16, color: '#333', fontWeight: '500'}}>
              工时和假期
            </Text>
            <View style={{height: 12}} />
            <View style={styles.settingItem}>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: '#333'}}>每周工作天数</Text>
                <View style={{height: 5}} />
                <Stepper
                  value={formData.workDaysPerWeek}
                  onChange={s => updateForm('salary', s)}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: '#333'}}>周WFH天数</Text>
                <View style={{height: 5}} />
                <Stepper
                  value={formData.salary}
                  onChange={s => updateForm('salary', s)}
                />
              </View>
            </View>
            <View style={{height: 12}} />
            <View style={styles.settingItem}>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: '#333'}}>年假天数</Text>
                <View style={{height: 5}} />
                <Stepper
                  value={formData.annualLeave}
                  onChange={s => updateForm('salary', s)}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: '#333'}}>法定年假</Text>
                <View style={{height: 5}} />
                <Stepper
                  value={formData.publicHolidays}
                  onChange={s => updateForm('salary', s)}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: '#333'}}>带薪病假</Text>
                <View style={{height: 5}} />
                <Stepper
                  value={formData.paidSickLeave}
                  onChange={s => updateForm('salary', s)}
                />
              </View>
            </View>
            <View style={{height: 12}} />
            <View style={styles.settingItem}>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: '#333'}}>总工时/H</Text>
                <View style={{height: 5}} />
                <Stepper
                  value={formData.workHours}
                  onChange={s => updateForm('salary', s)}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: '#333'}}>通勤/H</Text>
                <View style={{height: 5}} />
                <Stepper
                  value={formData.commuteHours}
                  onChange={s => updateForm('salary', s)}
                />
              </View>
              <View style={{alignItems: 'center'}}>
                <Text style={{fontSize: 14, color: '#333'}}>休息&摸鱼/H</Text>
                <View style={{height: 5}} />
                <Stepper
                  value={formData.restTime}
                  onChange={s => updateForm('salary', s)}
                />
              </View>
            </View>
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>工作环境</Text>
            <View style={{height: 10}} />
            <Tags
              datas={WorkEnvironmentOptions}
              onPress={s => {
                updateForm('jobStability', s.value);
              }}
              current={formData.jobStability}
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
                updateForm('jobStability', s.value);
              }}
              current={formData.jobStability}
            />
            <View style={{height: 10}} />
            <Text style={{color: '#333', fontSize: 14}}>学校类型</Text>
            <View style={{height: 10}} />
            <Tags
              datas={UniversityTypeOptions}
              onPress={s => {
                updateForm('jobStability', s.value);
              }}
              current={formData.jobStability}
            />
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>领导/老板</Text>
            <View style={{height: 10}} />
            <Tags
              datas={LeaderRelationOptions}
              onPress={s => {
                updateForm('leadership', s.value);
              }}
              current={formData.leadership}
            />
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>所在城市（按生活成本选择）</Text>
            <View style={{height: 10}} />
            <Tags
              datas={CityTierOptions}
              onPress={s => {
                updateForm('cityFactor', s.value);
              }}
              current={formData.cityFactor}
            />
            <View style={{height: 10}} />
            <Flex justify={'space-between'} horizontal>
              <Text style={{color: '#333', fontSize: 14}}>是否在家乡</Text>
              <Switch
                value={isKeyboardFeedback}
                onValueChange={value => {
                  setIsKeyboardFeedback(value);
                }}
                trackColor={{false: '#ccc', true: theme}}
                thumbColor={cardSound ? '#fff' : '#f4f3f4'}
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
                updateForm('cityFactor', s.value);
              }}
              current={formData.cityFactor}
            />
          </View>
          <View style={{height: 12}} />
          <View style={styles.card}>
            <Text style={styles.groupTitle}>同事环境</Text>
            <View style={{height: 10}} />
            <Tags
              datas={ColleagueRelationOptions}
              onPress={s => {
                updateForm('degreeType', s.value);
              }}
              current={formData.degreeType}
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
                updateForm('degreeType', s.value);
              }}
              current={formData.degreeType}
            />
            <View style={{height: 10}} />
            <Text style={{color: '#333', fontSize: 14}}>食堂情况</Text>
            <View style={{height: 5}} />
            <Tags
              datas={CanteenQualityOptions}
              onPress={s => {
                updateForm('degreeType', s.value);
              }}
              current={formData.degreeType}
            />
          </View>
        </View>
        <View style={{height: 16}} />
        <TouchableOpacity
          activeOpacity={0.8}
          style={[
            styles.startButton,
            {backgroundColor: theme, marginBottom: 16},
          ]}
          onPress={() => {
            navigation.navigate(supportedGames[defaultGame].page);
          }}>
          <Text style={{color: '#fff', fontSize: 16}}>
            查看我的工作性价比报告
          </Text>
        </TouchableOpacity>
      </ScrollView>
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
