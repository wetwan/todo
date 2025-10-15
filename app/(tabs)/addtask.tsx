import { getThemeColors } from "@/hooks/theme";
import { useTask } from "@/store/taskStore";
import { useTheme } from "@/store/themestore";
import Entypo from "@expo/vector-icons/Entypo";
import {
  AudioModule,
  RecordingPresets,
  setAudioModeAsync,
  useAudioRecorder,
  useAudioRecorderState,
} from "expo-audio";
import { useKeepAwake } from "expo-keep-awake";
import { useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import "react-native-get-random-values";
import { SafeAreaView } from "react-native-safe-area-context";
import { v4 as uuidv4 } from "uuid";

const Addtask = () => {
  useKeepAwake();

  // useState
  const [title, setTitle] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [uiError, setUiError] = useState<null | string>(null);

  // recording sound apis
  const audioRecorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);
  const recorderState = useAudioRecorderState(audioRecorder);

  const isRecording = recorderState.isRecording;

  // task from task store
  const setTask = useTask((task) => task.addTask);

  // theme controllers
  const theme = useTheme((task) => task.theme);
  const colors = getThemeColors(theme);
  const router = useRouter();

  // const ASSEMBLY_API_KEY = EXPO_PUBLIC_OPENAI_API_KEY;

  const ASSEMBLY_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

  // submit task

  const handleTaskSubmit = async () => {
    setUiError(null);
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
    } else {
      setUiError("Task title cannot be empty.");
    }
  };

  // Start recording
  const record = async () => {
    setUiError(null);

    try {
      await audioRecorder.prepareToRecordAsync();
      audioRecorder.record();
      setTitle("");
    } catch (error) {
      setUiError("Failed to start recording. Check permissions.");
      console.error("Failed to start recording", error);
    }
  };

  // Stop recording and send to Whisper
  const stopRecording = async () => {
    if (!isRecording) return;
    try {
      await audioRecorder.stop(); // <-- stops recording
      const uri = audioRecorder.uri;
      if (uri) {
        await transcribeAudio(uri);
      } else {
        setUiError("Could not retrieve recording URI.");
      }
    } catch (err) {
      setUiError("Failed to stop recording. See console for details.");
      console.error("Failed to stop recording", err);
    }
  };

  // Send audio file to AssemblyAI API

  const transcribeAudio = async (uri: string) => {
    setIsTranscribing(true);
    setUiError(null);
    setTitle("");

    if (ASSEMBLY_API_KEY === "YOUR_ASSEMBLYAI_API_KEY") {
      setUiError(
        "AssemblyAI API Key is missing. Transcription cannot proceed."
      );
      setIsTranscribing(false);
      return;
    }

    try {
      // --- 1. Read and upload the audio file ---
      const fileResponse = await fetch(uri);
      const blob = await fileResponse.blob();

      const uploadRes = await fetch("https://api.assemblyai.com/v2/upload", {
        method: "POST",
        headers: { authorization: ASSEMBLY_API_KEY as string },
        body: blob,
      });

      if (!uploadRes.ok)
        throw new Error(
          `Failed to upload audio to AssemblyAI: ${uploadRes.statusText}`
        );
      const uploadData = await uploadRes.json();
      const audioUrl = uploadData.upload_url;

      // --- 2. Request transcription ---
      const transcribeRes = await fetch(
        "https://api.assemblyai.com/v2/transcript",
        {
          method: "POST",
          headers: {
            authorization: ASSEMBLY_API_KEY as string,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            audio_url: audioUrl,
            // Adding basic features for better quality output
            punctuate: true,
            format_text: true,
          }),
        }
      );

      const transcribeData = await transcribeRes.json();
      const transcriptId = transcribeData.id;

      // --- 3. Poll until complete ---
      let completed = false;
      let text = "";

      while (!completed) {
        await new Promise((resolve) => setTimeout(resolve, 3000)); // wait 3 seconds between polls

        const pollRes = await fetch(
          `https://api.assemblyai.com/v2/transcript/${transcriptId}`,
          {
            headers: { authorization: ASSEMBLY_API_KEY as string },
          }
        );

        const pollData = await pollRes.json();

        if (pollData.status === "completed") {
          completed = true;
          text = pollData.text;
        } else if (pollData.status === "error") {
          throw new Error(pollData.error || "Transcription failed");
        }
      }

      setTitle(text.trim());
      setUiError("✅ Transcription complete. Review and save your task.");
    } catch (error: any) {
      console.error("AssemblyAI Transcription error:", error);

      setUiError(
        `❌ Transcription Error: ${
          error.message || "An unknown error occurred."
        }`
      );
    } finally {
      setIsTranscribing(false);
    }
  };

  // Ask for permissions
  useEffect(() => {
    (async () => {
      try {
        // Request microphone permissions
        const { granted } =
          await AudioModule.requestRecordingPermissionsAsync();
        if (!granted) {
          Alert.alert("Permission to access microphone was denied.");
          return;
        }

        // Set global audio mode
        await setAudioModeAsync({
          allowsRecording: true, // enables recording on all platforms
          playsInSilentMode: true, // allows audio playback in silent mode
        });
      } catch (e) {
        console.error("Audio setup failed:", e);
      }
    })();
  }, []);

  const bounceAnim = useRef(new Animated.Value(1)).current;

  // 2. Define the animation logic
  useEffect(() => {
    // Only start the loop once
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ])
    );

    if (isRecording) {
      loop.start();
    } else {
      loop.stop();
      bounceAnim.setValue(1); // Reset scale when stopped
    }

    return () => loop.stop();
  }, [bounceAnim, isRecording]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          position: "relative",
          alignItems: "center",
          flex: 1,
          backgroundColor: colors.background,
        }}
      >
        <Text style={{ color: colors.primary, marginBlock: 100, fontSize: 30 }}>
          {" "}
          Add your task{" "}
        </Text>

        {/* errors form the oprations */}
        <View style={{ minHeight: 40, marginBottom: 20, alignItems: "center" }}>
          {uiError && (
            <Text
              style={{
                fontSize: 14,
                color: "#D32F2F",
                textAlign: "center",
                padding: 8,
                borderRadius: 5,
                fontWeight: "500",
              }}
            >
              🚨 {uiError}
            </Text>
          )}

          {/* isTranscribing */}

          {isTranscribing && (
            <View
              style={{ flexDirection: "row", alignItems: "center", padding: 8 }}
            >
              <ActivityIndicator size="small" color={colors.primary} />
              <Text
                style={[
                  { marginLeft: 10, fontSize: 16 },
                  { color: colors.text },
                ]}
              >
                Transcribing...
              </Text>
            </View>
          )}
        </View>

        {/* input for task  */}

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

        {/* voive button  */}

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
            backgroundColor: colors.text,
          }}
          onPress={isRecording ? stopRecording : record}
          disabled={isTranscribing}
        >
          {!isRecording ? (
            <Entypo name="mic" size={24} color={"gray"} />
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
