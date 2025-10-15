import React from "react";
import { TextInput, View } from "react-native";

import Ionicons from "@expo/vector-icons/Ionicons";

const Search = ({
  colors,
  title,
  setTitle,
}: {
  colors: {
    background: string;
    text: string;
    primary: string;
    card: string;
  };
  title: string;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <View
      style={{
        width: "100%",
        padding: 12,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        position: "relative",
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
          flex: 1,
        }}
        placeholderTextColor={colors.text}
        keyboardType="default"
        value={title}
        placeholder="Enter your task"
        onChangeText={(e) => setTitle(e)}
      />
      <Ionicons
        name="search"
        size={24}
        color={colors.primary}
        style={{ position: "absolute", right: 20 }}
      />
    </View>
  );
};

export default Search;
