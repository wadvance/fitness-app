import React, { useMemo } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Platform } from 'react-native';

import { useApp } from '../store/AppContext';
import { useTheme, fontSize } from '../styles/theme';

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
  const { colors } = useTheme();
  const icons: Record<string, string> = {
    Inicio: '🏠',
    Entreno: '💪',
    Dieta: '🥗',
    Perfil: '👤',
  };
  return (
    <View style={tabStyles.iconContainer}>
      <Text style={[tabStyles.icon, focused && { opacity: 1, color: colors.primary }]}>
        {icons[label] || '📋'}
      </Text>
    </View>
  );
}

function MainTabs() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused }) => <TabIcon label={route.name} focused={focused} />,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textLight,
        tabBarStyle: { backgroundColor: colors.white, borderTopWidth: 1, borderTopColor: colors.divider, paddingTop: 4, height: 60 },
        tabBarLabelStyle: { fontSize: fontSize.xs, fontWeight: '600', marginBottom: 4 },
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

const linking = {
  enabled: Platform.OS === 'web',
  prefixes: ['https://wadvance.github.io/fitness-app'],
  config: {
    screens: {
      Onboarding: 'onboarding',
      Main: {
        screens: {
          Inicio: 'inicio',
          Entreno: 'entreno',
          Dieta: 'dieta',
          Perfil: 'perfil',
        },
      },
      ExerciseDetail: 'ejercicio/:id',
      MealDetail: 'receta/:id',
      ShoppingList: 'lista-compras',
    },
  },
};

export default function AppNavigator() {
  const { colors } = useTheme();
  const { state } = useApp();

  const headerOptions = {
    headerShown: true as const,
    headerBackTitle: 'Atrás',
    headerTintColor: colors.primary,
    headerStyle: { backgroundColor: colors.background },
    headerTitleStyle: { color: colors.text, fontWeight: '600' as const },
  };

  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!state.isOnboarded ? (
          <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        ) : (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen
              name="ExerciseDetail"
              component={ExerciseDetailScreen}
              options={{ ...headerOptions, headerTitle: 'Detalle del ejercicio' }}
            />
            <Stack.Screen
              name="MealDetail"
              component={MealDetailScreen}
              options={{ ...headerOptions, headerTitle: 'Detalle de la receta' }}
            />
            <Stack.Screen
              name="ShoppingList"
              component={ShoppingListScreen}
              options={{ ...headerOptions, headerTitle: 'Lista de compras' }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const tabStyles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 22,
    opacity: 0.5,
  },
});
