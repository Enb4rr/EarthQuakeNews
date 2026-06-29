import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import DebugScreen from '../screens/DebugScreen';
import { TouchableOpacity, Text } from 'react-native';
import { auth } from '../firebaseConfig';

// Define tab navigator
const Tab = createBottomTabNavigator();

export default function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={({navigation}) => ({
          headerRight: () => (
            <TouchableOpacity onPress={() => {auth.signOut(); navigation.reset({index: 0, routes: [{ name: 'Login' }]}); }}>
              <Text>Log Out</Text>
            </TouchableOpacity>
          ),
        })}
      />
      <Tab.Screen name="Debug" component={DebugScreen} />
    </Tab.Navigator>
  );
}