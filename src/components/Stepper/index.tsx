import React from 'react';
import {StyleSheet, Text, TextInput, TouchableOpacity} from 'react-native';
import Flex from '../Flex';

interface MyProps {
  value: string;
  onChange: (n: string) => void;
}

const Stepper: React.FC<MyProps> = props => {
  const {value, onChange} = props;
  return (
    <Flex horizontal style={{gap: 2}}>
      <TouchableOpacity
        style={styles.views}
        activeOpacity={0.8}
        hitSlop={{top: 4, right: 4, bottom: 4, left: 4}}
        onPress={() => {
          onChange(`${Number(value) - 1}`);
        }}>
        <Text style={{color: '#666', fontSize: 16}}>-</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        value={`${value}`}
        keyboardType={'numeric'}
        onChangeText={s => {
          onChange(s);
        }}
        underlineColorAndroid={'transparent'}
      />

      <TouchableOpacity
        style={styles.views}
        activeOpacity={0.8}
        onPress={() => {
          onChange(`${Number(value) + 1}`);
        }}>
        <Text style={{color: '#666', fontSize: 16}}>+</Text>
      </TouchableOpacity>
    </Flex>
  );
};

const styles = StyleSheet.create({
  views: {
    borderWidth: 1,
    borderRadius: 4,
    height: 20,
    width: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#999',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    height: 20,
    width: 40,
    margin: 0,
    padding: 0,
    fontSize: 14,
    textAlign: 'center',
    borderColor: '#999',
  },
});

export default Stepper;
