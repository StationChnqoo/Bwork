import Flex from '@src/components/Flex';
import ToolBar from '@src/components/ToolBar';
import {calculateJobValue} from '@src/constants/c';
import {useCaches} from '@src/constants/store';
import React, {useMemo} from 'react';
import {
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {RootStacksProp} from '../Screens';

interface MyProps {
  navigation?: RootStacksProp;
}

const WorthReport: React.FC<MyProps> = props => {
  const height = Platform.select({
    ios: useSafeAreaInsets().top,
    android: StatusBar.currentHeight,
  });

  const {games, theme, freeUsed, formData} = useCaches();
  const {navigation} = props;
  const state = useCaches();
  const score = useMemo(() => {
    return calculateJobValue(formData);
  }, [formData]);

  return (
    <View style={{flex: 1}}>
      <View style={{height, backgroundColor: 'white'}} />
      <ToolBar
        onBackPress={() => {
          navigation.goBack();
        }}
        title={'报告'}
      />
      <ScrollView style={{paddingHorizontal: 12}}>
        <View style={styles.card}>
          <Flex>
            <Text>{score}</Text>
          </Flex>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    backgroundColor: 'white',
  },
  item: {
    marginVertical: 5,
  },
});

export default WorthReport;
