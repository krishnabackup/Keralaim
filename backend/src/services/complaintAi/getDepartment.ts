
export const getDepartment = (
  category: string
) => {
     const categories = {

    "Road Damage":
      "PWD Department",

    "Garbage":
      "Municipality",

    "Street Light":
      "Electricity Board",

    "Water Leakage":
      "Water Authority"
  };

type Category = keyof typeof categories;
  return categories[category as Category] || "General";
};