export const extractJSON = (text: string): string | null => {
  const objectMatch = text.match(/\{[\s\S]*\}/);
  const arrayMatch = text.match(/\[[\s\S]*\]/);
  return objectMatch ? objectMatch[0] : arrayMatch ? arrayMatch[0] : null;
};

export const cleanAiResponse = (response: string) => {
  try {
    const cleaned = response
      .replace(/```json/gi, "")
      .replace(/```/g, "")
      .trim();

    const jsonString = extractJSON(cleaned);

    if (!jsonString) {
      console.error("No JSON found in AI response");
      return { error: true };
    }

    return JSON.parse(jsonString);
  } catch (error) {
    console.error("Error parsing AI response", error);
    return { error: true };
  }
};

export const fallbackQuestions = () => {
  return [
    {
      field: "house_type",
      question: "Does your household own a pucca house?",
      type: "yes/no",
    },
    {
      field: "income",
      question: "Is your annual income less than ₹500,000?",
      type: "yes/no",
    },
    {
      field: "residence",
      question: "Do you reside in Kerala?",
      type: "yes/no",
    },
    {
      field: "caste",
      question: "Do you belong to the Scheduled Caste or Scheduled Tribe community?",
      type: "yes/no",
    },
    {
      field: "marital_status",
      question: "Are you a married person?",
      type: "yes/no",
    },
    {
      field: "occupation",
      question: "Are you employed or self-employed in an unorganized sector?",
      type: "yes/no",
    },
  ];
};

export const parseAiQuestion = (
  raw : string
) => {
  try {
    const match = raw.match(/\[\sS]*\]/)

    if(!match) return null

    const parsed = JSON.parse(match[0]);

    return parsed
  }
  catch(error){
    return null;
  }
}

export const parseComplaintAI =
(raw: string) => {

  try {

    const match =
      raw.match(/\{[\s\S]*\}/);

    if (!match) return null;

    return JSON.parse(match[0]);

  } catch {

    return null;
  }
};