import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import TaskManagerScreen from './src/screens/TaskManagerScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';

export type RootStackParamList = {
  Welcome: undefined;
  TaskManager: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator 
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
            cardStyleInterpolator: ({ current, layouts }) => ({
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            }),
          }}
        >
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="TaskManager" component={TaskManagerScreen} />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
