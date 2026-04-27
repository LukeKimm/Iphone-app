import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import GeneratorScreen from './src/screens/GeneratorScreen';
import MovementsScreen from './src/screens/MovementsScreen';
import CustomWodScreen from './src/screens/CustomWodScreen';

const Tab = createBottomTabNavigator();

function TabIcon({ emoji, label, focused }: { emoji: string; label: string; focused: boolean }) {
  return (
    <View style={{ alignItems: 'center', justifyContent: 'center', width: 70 }}>
      <Text style={{ fontSize: 22 }}>{emoji}</Text>
      <Text
        numberOfLines={1}
        style={{
          fontSize: 10,
          color: focused ? '#FF6B35' : '#555',
          marginTop: 3,
          fontWeight: focused ? '700' : '400',
        }}
      >
        {label}
      </Text>
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" />
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: '#1A1A1A',
            borderTopColor: '#2A2A2A',
            height: 72,
            paddingBottom: 8,
            paddingTop: 6,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Generator"
          component={GeneratorScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="🎲" label="WOD생성" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Custom"
          component={CustomWodScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="✏️" label="커스텀" focused={focused} />,
          }}
        />
        <Tab.Screen
          name="Movements"
          component={MovementsScreen}
          options={{
            tabBarIcon: ({ focused }) => <TabIcon emoji="📋" label="동작목록" focused={focused} />,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
