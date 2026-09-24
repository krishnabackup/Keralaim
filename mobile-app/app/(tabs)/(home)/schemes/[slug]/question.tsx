import { useState, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import QuestionCard from "../../../../../components/question/questionCard";
import { SmartQuestion, AnswerValue } from "../../../../../types/question.types"
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AppBar } from "@/components/AppBar";

// ── Mock data (replace with your API call) ──────────────────────────────────
const MOCK_QUESTIONS: SmartQuestion[] = [
  {
    id: 1,
    type: "yesno",
    text: "Are you currently enrolled or seeking admission in a recognized ITI, Polytechnic, or college?",
    required: true,
  },
  {
    id: 2,
    type: "select",
    text: "Which category do you belong to?",
    options: ["General", "OBC", "SC / ST", "EWS", "Differently abled"],
    required: true,
  },
  {
    id: 3,
    type: "number",
    text: "What is your annual family income?",
    placeholder: "Enter amount",
    suffix: "₹ per year",
    required: true,
  },
  {
    id: 4,
    type: "yesno",
    text: "Is your institution affiliated with a Central or State education board?",
    required: false,
  },
  {
    id: 5,
    type: "text",
    text: "What course or skill program are you planning to pursue?",
    placeholder: "e.g. Electrical technician, welding, nursing...",
    required: false,
  },
];
// ────────────────────────────────────────────────────────────────────────────

export default function SmartQuestionsScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const scrollRef = useRef<ScrollView>(null);

  const [questions] = useState<SmartQuestion[]>(MOCK_QUESTIONS);
  const [answers, setAnswers] = useState<Record<number, AnswerValue>>({});
  const [submitting, setSubmitting] = useState(false);

  const answeredCount = Object.keys(answers).length;
  const totalCount = questions.length;
  const progressPct = Math.round((answeredCount / totalCount) * 100);

  function handleAnswer(id: number, value: AnswerValue) {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  }

  function handleSkip() {
    const firstUnanswered = questions.find((q) => answers[q.id] === undefined);
    if (firstUnanswered) {
      setAnswers((prev) => ({ ...prev, [firstUnanswered.id]: null }));
    }
  }

  async function handleSubmit() {
    const unansweredRequired = questions.find(
      (q) => q.required && answers[q.id] === undefined
    );

    if (unansweredRequired) {
      Alert.alert(
        "Required question",
        "Please answer all required questions before checking eligibility."
      );
      return;
    }

    setSubmitting(true);
    try {
      // TODO: replace with your actual API call
      // await submitEligibilityAnswers(slug, answers);
      await new Promise((r) => setTimeout(r, 1200)); // mock delay

      router.push(`/(tabs)/(home)/schemes/${slug}/result`);
    } catch (err) {
      Alert.alert("Error", "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <View
      className="flex-1 bg-gray-100"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom + 60 }}>
        <AppBar/>
        {/* Scheme pill */}
        <View className="mx-4 mt-4 bg-blue-600 rounded-2xl px-4 py-3">
          <Text className="text-xs text-blue-200 uppercase tracking-widest mb-1">
            Checking eligibility for
          </Text>
          <Text className="text-sm font-semibold text-white leading-5">
            {slug
              ? slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
              : "Scheme"}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="flex-row items-center mx-4 mt-3 gap-3">
          <View className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <View
              className="h-full bg-sky-400 rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </View>
          <Text className="text-xs text-slate-500 w-10 text-right">
            {answeredCount} / {totalCount}
          </Text>
        </View>

        {/* Questions list */}
        <ScrollView
          ref={scrollRef}
          className="flex-1 mt-3 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 10 }}
          keyboardShouldPersistTaps="handled"
        >
          {questions.map((q, i) => {
            const isAnswered = answers[q.id] !== undefined;
            const isActive =
              !isAnswered && Object.keys(answers).length === i;

            return (
              <QuestionCard
                key={q.id}
                question={q}
                index={i}
                answer={answers[q.id] ?? null}
                isActive={isActive}
                isAnswered={isAnswered}
                onAnswer={handleAnswer}
              />
            );
          })}
        </ScrollView>

        <View className="bg-white border-t border-slate-100 px-4 py-3 flex-row gap-3">
          <TouchableOpacity
            onPress={handleSkip}
            className="flex-1 py-3 rounded-xl border border-slate-200 items-center"
            activeOpacity={0.8}
          >
            <Text className="text-sm font-semibold text-slate-500">Skip</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            className="flex-[2.2] py-3 rounded-xl bg-sky-400 items-center justify-center flex-row gap-2"
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text className="text-sm font-semibold text-white">
                Check eligibility →
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}
