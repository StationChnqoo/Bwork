import {useCaches} from '@src/constants/store';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

interface MyProps {
  datas: any[];
  onPress: (item: any) => void;
  current: any;
}

const Tags: React.FC<MyProps> = props => {
  const {datas, current, onPress} = props;
  const {theme} = useCaches();
  return (
    <View style={styles.tags}>
      {datas.map((it, i) => {
        const checked = it.value == current;
        return (
          <TouchableOpacity
            activeOpacity={0.8}
            key={i}
            style={[styles.tag, checked && {borderColor: theme}]}
            onPress={() => {
              onPress(it);
            }}>
            <Text style={[styles.label, checked && {color: theme}]}>
              {it.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tags: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  tag: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#999',
  },
  label: {
    fontSize: 14,
    color: '#666',
  },
});
export default Tags;
