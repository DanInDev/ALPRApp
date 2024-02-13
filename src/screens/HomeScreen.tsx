import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';

type HomeScreenProps = {
  navigation: StackNavigationProp<any, 'Home'>;
};

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home Screen</Text>
      <Button
        title="Go to Scanner Screen"
        onPress={() => navigation.navigate('ScannerScreen')}
      />
    </View>
  );
};

export default HomeScreen;
