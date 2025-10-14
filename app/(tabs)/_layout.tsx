import { HapticTab } from "@/components/haptic-tab";
import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";
import Entypo from "@expo/vector-icons/Entypo";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarButton: HapticTab,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "view Task",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="home" color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addtask"
        options={{
          title: "Add task",
          tabBarIcon: ({ color }) => (
            <Entypo size={28} name="plus" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
