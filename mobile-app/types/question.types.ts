export type QuestionType = "yesno" | "select" | "number" | "text";

export interface SmartQuestion {
  id: number;
  type: QuestionType;
  text: string;
  options?: string[];       // for select type
  placeholder?: string;     // for number / text types
  suffix?: string;          // for number type (e.g. "₹ per year")
  required?: boolean;
}

export type AnswerValue = string | number | null;

export interface QuestionAnswer {
  questionId: number;
  value: AnswerValue;
}