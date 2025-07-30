import { db } from "./db";
import { recipes } from "../shared/schema";
import { eq } from "drizzle-orm";

const recipeDifficulties = [
  // Breakfast - generally easy
  { title: "Hawaiian Fish Tacos", difficulty: "medium" },
  { title: "Tropical Poke Bowl", difficulty: "easy" },
  { title: "Island Quinoa Bowl", difficulty: "easy" },
  { title: "Vegetarian Lettuce Wraps", difficulty: "easy" },
  { title: "Kale and Chickpea Power Salad", difficulty: "easy" },
  { title: "Mediterranean Lentil Salad", difficulty: "easy" },
  { title: "Coconut Shrimp Sandwich", difficulty: "medium" },
  { title: "Power-Packed Green Smoothie", difficulty: "easy" },
  { title: "Blueberry Walnut Overnight Oats", difficulty: "easy" },
  { title: "Avocado Toast with Hemp Seeds", difficulty: "easy" },
  { title: "Breakfast Burrito", difficulty: "easy" },
  { title: "Tofu Scramble", difficulty: "easy" },
  { title: "Açaí Bowl", difficulty: "easy" },
  
  // Lunch - mixed difficulties
  { title: "Mediterranean Quinoa Bowl", difficulty: "easy" },
  { title: "Asian-Inspired Buddha Bowl", difficulty: "medium" },
  { title: "Lentil Power Salad", difficulty: "easy" },
  { title: "Grilled Mahi-Mahi Salad", difficulty: "medium" },
  { title: "Coconut Rice Bowl with Tofu", difficulty: "medium" },
  { title: "Island Chicken Lettuce Cups", difficulty: "medium" },
  { title: "Sweet Potato and Black Bean Bowl", difficulty: "easy" },
  { title: "Seared Ahi Tuna Salad", difficulty: "hard" },
  { title: "Advanced Poke Bowl", difficulty: "medium" },
  { title: "Asian Lettuce Wraps", difficulty: "easy" },
  { title: "Enhanced Quinoa Kale Salad", difficulty: "easy" },
  
  // Dinner - typically medium to hard
  { title: "Baked Salmon with Sweet Potato", difficulty: "medium" },
  { title: "Chickpea Curry with Brown Rice", difficulty: "medium" },
  { title: "Turkey and Vegetable Stir-Fry", difficulty: "medium" },
  { title: "Coconut Curry Salmon", difficulty: "hard" },
  { title: "Herb-Crusted Mahi-Mahi", difficulty: "hard" },
  { title: "Teriyaki Chicken with Brown Rice", difficulty: "medium" },
  { title: "Mediterranean Stuffed Portobello", difficulty: "medium" },
  { title: "Island-Style Fish Curry", difficulty: "hard" },
  { title: "Stuffed Bell Peppers", difficulty: "medium" },
  { title: "Stuffed Portobello Mushrooms", difficulty: "medium" },
  
  // Snacks - generally easy
  { title: "Energy-Boosting Protein Balls", difficulty: "easy" },
  { title: "Apple Slices with Almond Butter", difficulty: "easy" },
  { title: "Veggie Hummus Wrap", difficulty: "easy" },
  
  // Smoothies - easy
  { title: "Tropical Mango Smoothie", difficulty: "easy" },
  { title: "Chocolate Peanut Butter Smoothie", difficulty: "easy" }
];

export async function updateRecipeDifficulties() {
  try {
    console.log("Updating recipe difficulties...");
    
    for (const recipe of recipeDifficulties) {
      const result = await db
        .update(recipes)
        .set({ difficulty: recipe.difficulty })
        .where(eq(recipes.title, recipe.title));
      
      console.log(`Updated ${recipe.title} to ${recipe.difficulty} difficulty`);
    }
    
    console.log("Recipe difficulty updates completed successfully!");
  } catch (error) {
    console.error("Error updating recipe difficulties:", error);
  }
}

// Run the function
updateRecipeDifficulties().then(() => process.exit(0));