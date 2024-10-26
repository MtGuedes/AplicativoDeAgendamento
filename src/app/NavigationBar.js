import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';

const NavigationBar = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.navbar}>
      <TouchableOpacity onPress={() => navigation.navigate('user/id')}>
        <Icon name="arrow-up-circle" size={75} color="#FF69B4" />
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('busca')}> 
        <Icon name="search" size={75} color="black" />
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 120,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    paddingHorizontal: 1,
  },
};

export default NavigationBar;
