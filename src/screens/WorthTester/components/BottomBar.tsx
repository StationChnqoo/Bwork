import Flex from '@src/components/Flex';
import {useCaches} from '@src/constants/store';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface MyProps {
  score: number;
  dailySalary: number;
  onPress: () => void;
}

const BottomBar: React.FC<MyProps> = props => {
  const {score, onPress, dailySalary} = props;
  const {theme} = useCaches();
  return (
    <View style={styles.views}>
      <Flex horizontal justify={'space-between'}>
        <Flex horizontal>
          <Flex align={'flex-start'}>
            <Text style={{color: theme, fontSize: 20}}>{score.toFixed(3)}</Text>
            <View style={{height: 4}} />
            <Text style={{color: '#999', fontSize: 12}}>工作性价比</Text>
          </Flex>
          <View style={{width: 10}} />
          <Flex align={'flex-start'}>
            <Text style={{color: theme, fontSize: 20}}>
              {dailySalary.toFixed(2)}
            </Text>
            <View style={{height: 4}} />
            <Text style={{color: '#999', fontSize: 12}}>日薪估算</Text>
          </Flex>
        </Flex>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: theme}]}
          activeOpacity={0.8}
          onPress={onPress}>
          <Text style={{color: '#fff'}}>查看报告</Text>
        </TouchableOpacity>
      </Flex>
    </View>
  );
};

const styles = StyleSheet.create({
  views: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'white',
  },
  button: {
    height: 36,
    paddingHorizontal: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});

export default BottomBar;
