import React from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

const Search = () => {
  return (
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
        activeOpacity={40}
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
  );
};

export default Search;
