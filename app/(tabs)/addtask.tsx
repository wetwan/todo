import Entypo from "@expo/vector-icons/Entypo";
import React, { useState } from "react";
import {
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

import { ThemedView } from "@/components/themed-view";
import { useTask } from "@/store/taskStore";
import { SafeAreaView } from "react-native-safe-area-context";

const Addtask = () => {
  const [title, setTitle] = useState("");
  const [isListening, setIsListening] = useState(false);

  const setTask = useTask((task) => task.addTask);
  const Task = useTask((task) => task.todos);

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
    }
  };

  console.log(Task);
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={{
          position: "relative",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
        }}
      >
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
              borderColor: "#a1a1a1",
              width: "90%",
            }}
            placeholderTextColor={"white"}
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
              borderWidth: 1,
              borderColor: "white",
              marginTop: 20,
              paddingHorizontal: 64,
              paddingBlock: 16,
            }}
          >
            <Text className="text-white">Submit</Text>
          </TouchableOpacity>
        </View>
        <Pressable
          style={{
            position: "absolute",
            width: 48,
            shadowRadius: 5,
            shadowColor: "#fef3c6",
            alignItems: "center",
            justifyContent: "center",
            bottom: 20,
            right: 20,
            zIndex: 30,
            height: 48,
            elevation: 12,
            borderRadius: 100,
          }}
          onPress={() => setIsListening((prev) => !prev)}
        >
          {!isListening ? (
            <Entypo name="mic" size={24} color="white" />
          ) : (
            <Entypo name="dots-three-horizontal" size={24} color="black" />
          )}
        </Pressable>
      </ThemedView>
    </SafeAreaView>
  );
};

export default Addtask;
