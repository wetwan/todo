import Entypo from "@expo/vector-icons/Entypo";
import React, { useEffect, useRef, useState } from "react"

import axios from 'axios';
import {
  Animated,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { getThemeColors } from "@/hooks/theme";
import { useTask } from "@/store/taskStore";
import { useTheme } from "@/store/themestore";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

const Addtask = () => {
  const [title, setTitle] = useState("");
  const [isListening, setIsListening] = useState(false);

  const setTask = useTask((task) => task.addTask);
  const theme = useTheme((task) => task.theme);
  const colors = getThemeColors(theme);
  const router = useRouter();

  const handleTaskSubmit = async () => {
    const id = uuidv4();
    const Task = {
      title: title.trim(),
      id: id,
      date: new Date(),
    };

    if (Task.title) {
      setTask(Task);
      setTitle("");
      router.push("/");
    }
  };

  const bounceAnim = useRef(new Animated.Value(1)).current;

  // 2. Define the animation logic
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2, // Scale up
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1, // Scale back down
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, [bounceAnim]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          position: "relative",
          alignItems: "center",
          // justifyContent: "center",
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.primary, marginBlock: 100, fontSize: 30 }}>
          {" "}
          Add your task{" "}
        </Text>
        <View
          style={{
            width: "80%",
            padding: 12,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <TextInput
            style={{
              outlineWidth: 0,
              borderWidth: 1,
              borderColor: colors.primary,
              color: colors.primary,
              paddingHorizontal: 15,
              padding: 20,
              width: "90%",
            }}
            placeholderTextColor={colors.text}
            keyboardType="default"
            value={title}
            placeholder="Enter your task"
            onChangeText={(e) => setTitle(e)}
          />

          <TouchableOpacity
            onPress={handleTaskSubmit}
            activeOpacity={40}
            // ="border border-white mt-10 px-16 py-4"
            style={{
              justifyContent: "center",
              alignItems: "center",
              marginBlock: 20,
              borderWidth: 1,
              width: "60%",
              marginHorizontal: "auto",
              paddingBlock: 20,
              borderColor: colors.primary,
              backgroundColor: colors.text,
            }}
          >
            <Text style={{ color: colors.primary }}>Submit</Text>
          </TouchableOpacity>
        </View>
        <Pressable
          style={{
            position: "absolute",
            width: 60,
            shadowRadius: 10,
            shadowColor: "#fef3c6",
            alignItems: "center",
            justifyContent: "center",
            bottom: 20,
            right: 20,
            zIndex: 30,
            height: 60,
            elevation: 1,
            borderRadius: 100,
            backgroundColor: colors.text
          }}
          onPress={() => setIsListening((prev) => !prev)}
        >
          {!isListening ? (
            <Entypo name="mic" size={24} color={'gray'} />
          ) : (
            <Animated.View style={{ transform: [{ scale: bounceAnim }] }}>
              <Entypo
                name="dots-three-horizontal"
                size={24}
                color={colors.primary}
              />
            </Animated.View>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Addtask;
