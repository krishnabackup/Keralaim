export const extractJSONArray = (text: string) => {
  const match = text.match(/\[[\s\S]*\]/); // match array
  return match ? match[0] : null;
};

export const cleanAiResponse = (response: string) => {
    try {
        const jsonArrayString = extractJSONArray(response);
        if (!jsonArrayString) {
            console.error("No JSON array found in AI response");
            return { error: true };
        }
        const cleanedAI =  cleanAndFixJSON(jsonArrayString);
        const parsed = JSON.parse(cleanedAI);
        return parsed;
    }
    catch (error) {
        console.error("Error parsing AI response", error);
        return { error: true };
    }
}

const cleanAndFixJSON = (text: string) => {
  return text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .replace(/(\w+):/g, '"$1":') // fix keys
    .replace(/'/g, '"') // single → double quotes
    .trim();
};

export const fallbackQuestions = () => {
    return  [
  {
    field: 'age',
    question: 'Are you above 18 years old, my friend?',
    type: 'yes/no'
  },
  {
    field: 'income',
    question: 'Is your annual income less than ₹500,000, my friend?',
    type: 'yes/no'
  },
  {
    field: 'residence',
    question: 'Do you reside in Kerala, my friend?',
    type: 'yes/no'
  },
  {
    field: 'caste',
    question: 'Do you belong to the Scheduled Caste or Scheduled Tribe community, my friend?',
    type: 'yes/no'
  },
  {
    field: 'gender',
    question: 'Do you identify as male, female, transgender, or another gender, my friend?',
    type: 'string',
    values: [ 'male', 'female', 'transgender', 'other' ]
  },
  {
    field: 'occupation',
    question: 'Are you employed or self-employed in an unorganized sector, my friend?',
    type: 'yes/no'
  }
]
}