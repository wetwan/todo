import { ThemedView } from "@/components/themed-view";
import { useTask } from "@/store/taskStore";
import AntDesign from "@expo/vector-icons/AntDesign";
import Fontisto from "@expo/vector-icons/Fontisto";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const Task = useTask((task) => task.todos);
  const toggleTodo = useTask((s) => s.toggleTodo);

  const sortedTasks = Task.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const completedTasks = Task.sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );

  const deleteTask = useTask((task) => task.removeTask);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{ padding: 20, flex: 1 }}
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item: task }) => (
            <Pressable
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: "#fff",
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Pressable onPress={() => toggleTodo(task.id)}>
                {!task.completed ? (
                  <Fontisto name="checkbox-passive" size={24} color="white" />
                ) : (
                  <Fontisto name="checkbox-active" size={24} color="white" />
                )}
              </Pressable>

              <Text
                style={{
                  color: task.completed ? "gray" : "#fff",
                  width: "70%",
                  textDecorationLine: task.completed ? "line-through" : "none",
                }}
              >
                {task.title}
              </Text>
              <Pressable onPress={() => deleteTask(task.id)}>
                <AntDesign name="delete" size={24} color="red" />
              </Pressable>
            </Pressable>
          )}
          ListEmptyComponent={() => (
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: "#fff", alignSelf: "center" }}>
                {" "}
                No task yet
              </Text>
            </View>
          )}
        />
      </ThemedView>
      <Text>Index</Text>
    </SafeAreaView>
  );
};

export default Index;
