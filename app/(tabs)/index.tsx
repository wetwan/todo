import { getThemeColors } from "@/hooks/theme";
import { useTask } from "@/store/taskStore";
import { useTheme } from "@/store/themestore";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
import Fontisto from "@expo/vector-icons/Fontisto";
import React from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Index = () => {
  const Task = useTask((task) => task.todos);

  const toggleTheme = useTheme((task) => task.toggleTheme);
  const theme = useTheme((task) => task.theme);

  const clearTask = useTask((d) => d.clearTodos);

  const toggleTodo = useTask((s) => s.toggleTodo);

  const sortedTasks = Task.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const completedTasks = sortedTasks.sort(
    (a, b) => Number(a.completed) - Number(b.completed)
  );

  const colors = getThemeColors(theme);

  const deleteTask = useTask((task) => task.removeTask);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            padding: 10,
            marginTop: 10,
          }}
        >
          <Text style={{ color: colors.primary, fontSize: 25 }}>Welcome</Text>
          <Pressable
            onPress={() => {
              toggleTheme();
            }}
          >
            {theme === "dark" ? (
              <Entypo
                name="light-up"
                size={24}
                color={theme === "dark" ? "white" : "black"}
              />
            ) : (
              <Entypo
                name="moon"
                size={24}
                color={theme === "light" ? "black" : "white"}
              />
            )}
          </Pressable>
        </View>

        <FlatList
          contentContainerStyle={{ padding: 20, flex: 1 }}
          data={completedTasks}
          keyExtractor={(item) => item.id}
          renderItem={({ item: task }) => (
            <Pressable
              style={{
                padding: 10,
                borderWidth: 1,
                borderColor: colors.primary,
                marginTop: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Pressable onPress={() => toggleTodo(task.id)}>
                {!task.completed ? (
                  <Fontisto
                    name="checkbox-passive"
                    size={24}
                    color={!task.completed ? colors.primary : colors.text}
                  />
                ) : (
                  <Fontisto
                    name="checkbox-active"
                    size={24}
                    color={!task.completed ? colors.primary : colors.text}
                  />
                )}
              </Pressable>

              <Text
                style={{
                  color: !task.completed ? colors.text : colors.text,
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
              <Text style={{ color: colors.text, alignSelf: "center" }}>
                {" "}
                No task yet
              </Text>
            </View>
          )}
        />

        {Task.length > 0 && (
          <Text
            style={{
              color: colors.text,
              textAlign: "center",
              paddingBlock: 20,
              fontWeight: "600",
            }}
          >
            You have {Task.length} task on your list and{" "}
            {Task.filter((d) => d.completed).length} completed task
          </Text>
        )}
        {Task.length > 0 && (
          <Pressable
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
            onPress={clearTask}
          >
            <Text style={{ color: colors.primary }}> Clear tasks</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

export default Index;
