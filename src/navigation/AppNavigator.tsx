import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import { useApp } from '../store/AppContext';
import { colors, fontSize } from '../styles/theme';

import OnboardingScreen from '../screens/OnboardingScreen';
import HomeScreen from '../screens/HomeScreen';
import TrainingScreen from '../screens/TrainingScreen';
import ExerciseDetailScreen from '../screens/ExerciseDetailScreen';
import DietScreen from '../screens/DietScreen';
import MealDetailScreen from '../screens/MealDetailScreen';
import ShoppingListScreen from '../screens/ShoppingListScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Inicio: '🏠',
    Entreno: '💪',
    Dieta: '🥗',
    Perfil: '👤',
  };
  return (
    <View style={tabStyles.iconContainer}>
      <Text style={[tabStyles.icon, focused && tabStyles.iconFocused]}>
        {icons[label] || '📋'}
      </Text>
    </View>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: tabStyles.tabBar,
        tabBarLabelStyle: tabStyles.tabLabel,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Inicio" component={HomeScreen} />
      <Tab.Screen name="Entreno" component={TrainingScreen} />
      <Tab.Screen name="Dieta" component={DietScreen} />
      <Tab.Screen name="Perfil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { state } = useApp();

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!state.isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="ExerciseDetail"
              component={ExerciseDetailScreen}
              options={{
                headerShown: true,
                headerTitle: 'Detalle del ejercicio',
                headerBackTitle: 'Atrás',
                headerTintColor: colors.primary,
                headerStyle: { backgroundColor: colors.background },
                headerTitleStyle: { color: colors.text, fontWeight: '600' },
              }}
            />
            <Stack.Screen
              name="MealDetail"
              component={MealDetailScreen}
              options={{
                headerShown: true,
                headerTitle: 'Detalle de la receta',
                headerBackTitle: 'Atrás',
                headerTintColor: colors.primary,
                headerStyle: { backgroundColor: colors.background },
                headerTitleStyle: { color: colors.text, fontWeight: '600' },
              }}
            />
            <Stack.Screen
              name="ShoppingList"
              component={ShoppingListScreen}
              options={{
                headerShown: true,
                headerTitle: 'Lista de compras',
                headerBackTitle: 'Atrás',
                headerTintColor: colors.primary,
                headerStyle: { backgroundColor: colors.background },
                headerTitleStyle: { color: colors.text, fontWeight: '600' },
              }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
    paddingTop: 4,
    height: 60,
  },
  tabLabel: {
    fontSize: fontSize.xs,
    fontWeight: '600',
    marginBottom: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
  iconFocused: {
    opacity: 1,
  },
});
