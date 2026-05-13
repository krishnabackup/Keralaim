import { View, Text, TouchableOpacity, TextInput } from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar } from "@/components/AppBar";
import { Question } from "@/types/global.types";
import { useQuestions } from "@/hooks/useQuestions";
import { updateProfile } from "@/services/authService";
import { useRouter } from "expo-router";

const sampleQuestions: Question[] = [
  {
    field : "religion",
    question : "What is your religion ?",
    type : "select",
    value : ["Hindu","Muslim","Christian","Sikh","Buddhist","Jain","Other"]
  },
  {
    field : "category",
    question: "Which category you belongs to ?",
    type: "select",
    value : ["EWS", "OBC", "SC", "ST", "General","SEBC"]
  },{
    field : "occupation",
    question: "What is your occupation ?",
    type: "select",
    value : ["UNEMPLOYED","DAILY_WAGE_WORKER","FARMER","GOVT_EMPLOYEE","PRIVATE_EMPLOYEE","SELF_EMPLOYED","BUSINESS_OWNER","STUDENT","RETIRED","TEACHER","FISHERMAN","LABOUR","OTHER"]
  },
  {
    field : "income",
    question: "What is your monthly income ?",
    type: "number"
  },
  {
    field : "gender",
    question : "What is your gender ?",
    type : "select",
    value : ["Male","Female","Transgender"]
  },
  {
    field : "region",
    question : "Which region do you belong to ?",
    type : "select",
    value : ["URBAN","RURAL","HILL_AREA", "COASTAL_AREA", "TRIBAL_AREA"]
  },
  {
    field : "disability",
    question : "Do you have any disability ?",
    type : "yes/no"
  }
];
export default function QuestionnaireScreen() {
const [currentIndex, setCurrentIndex] = useState(0);
const [answers, setAnswers] = useState<any>({});
const insets = useSafeAreaInsets();
const router = useRouter();


const currentQuestion = sampleQuestions[currentIndex];

const progress = sampleQuestions.length
  ? ((currentIndex + 1) / sampleQuestions.length) * 100
  : 0;
const handleAnswer = (value: string) => {
    setAnswers((prev: any) => ({
      ...prev,
      [currentQuestion.field]: value
    }));
  };

  const handleNextandSubmit = async () => {
            if (currentIndex < sampleQuestions.length - 1) {
              setCurrentIndex((prev) => prev + 1);
            } else {
                const res = await updateProfile(answers);
                if(res?.success){
                  router.replace("/(tabs)/(home)/dashboard");
                }
                else{
                    console.log("Error in updating profile");
                }
            }
          }
  if (!currentQuestion) {
    return (
      <View style={{ paddingBottom: insets.bottom, paddingTop: insets.top }}>
        <AppBar />
        <Text className="px-4">Loading...</Text>
      </View>
    );
  }

  return (
    <View style={{paddingBottom : insets.bottom , paddingTop : insets.top}}>
      <AppBar/>
      <View className="w-full h-2 bg-gray-200 rounded-full mb-6">
        <View
          className="h-2 bg-blue-500 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </View>
  <View className="flex px-4">
    <View className="bg-blue-200 p-4 rounded-lg">
      {/* Progress Text */}
        <Text className="text-right text-gray-500 mb-4">
        {currentIndex + 1} / {sampleQuestions.length}
      </Text>

      {/* Question Card */}

        <Text className="text-lg font-semibold mb-4">
          Q ) {currentQuestion.question}
        </Text>

        {currentQuestion.type === "number" ||
 currentQuestion.type === "string" ? (

  <TextInput
    className="border border-gray-300 rounded-xl p-3 bg-white"
    keyboardType={
      currentQuestion.type === "number" ? "numeric" : "default"
    }
    onChangeText={handleAnswer}
    value={answers[currentQuestion.field] || ""}
  />

) : currentQuestion.type === "select" ? (

  <View className="flex-row flex-wrap gap-2">
    {currentQuestion.value?.map((opt) => (
      <TouchableOpacity
        key={opt}
        onPress={() => handleAnswer(opt)}
        className={`px-4 py-2 rounded-full ${
          answers[currentQuestion.field] === opt
            ? "bg-blue-500"
            : "bg-gray-300"
        }`}
      >
        <Text
          className={`${
            answers[currentQuestion.field] === opt
              ? "text-white"
              : "text-black"
          }`}
        >
          {opt}
        </Text>
      </TouchableOpacity>
    ))}
  </View>

) : currentQuestion.type === "yes/no" ? (

  <View className="flex-row items-center gap-4">
    
    <TouchableOpacity
      onPress={() => handleAnswer("yes")}
      className="flex-row items-center"
    >
      <View className="w-5 h-5 border-2 border-gray-500 rounded-full items-center justify-center">
        {answers[currentQuestion.field] === "yes" && (
          <View className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
        )}
      </View>
      <Text className="ml-2">Yes</Text>
    </TouchableOpacity>

    <TouchableOpacity
      onPress={() => handleAnswer("no")}
      className="flex-row items-center"
    >
      <View className="w-5 h-5 border-2 border-gray-500 rounded-full items-center justify-center">
        {answers[currentQuestion.field] === "no" && (
          <View className="w-2.5 h-2.5 bg-blue-500 rounded-full" />
        )}
      </View>
      <Text className="ml-2">No</Text>
    </TouchableOpacity>

  </View>

) : null}
      </View>

      <View className="flex-row justify-between mt-6">

        <TouchableOpacity
          disabled={currentIndex === 0}
          onPress={() => setCurrentIndex((prev) => prev - 1)}
          className={`px-5 py-3 rounded-xl ${
            currentIndex === 0 ? "bg-gray-300" : "bg-gray-500"
          }`}
        >
          <Text className="text-white">Previous</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleNextandSubmit()}
          className="bg-blue-500 px-5 py-3 rounded-xl"
        >
          <Text className="text-white">
            {currentIndex === sampleQuestions.length - 1
              ? "Submit"
              : "Next"}
          </Text>
        </TouchableOpacity>
      </View>
      </View>
    </View>
  );
}