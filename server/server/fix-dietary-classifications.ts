import { db } from "./db";
import { recipes } from "../shared/schema";
import { eq } from "drizzle-orm";

const dietaryUpdates = [
  // Fish dishes should be regular (not pescatarian since we're removing that category)
  { title: "Hawaiian Fish Tacos", dietary: "regular" },
  { title: "Tropical Poke Bowl", dietary: "regular" },
  { title: "Coconut Curry Salmon", dietary: "regular" },
  { title: "Herb-Crusted Mahi-Mahi", dietary: "regular" },
  { title: "Grilled Salmon with Mango Salsa", dietary: "regular" },
  { title: "Fish and Sweet Potato Curry", dietary: "regular" },
  { title: "Ahi Tuna Steaks with Wasabi", dietary: "regular" },
  
  // Chicken dishes
  { title: "Coconut Chicken Curry", dietary: "regular" },
  { title: "Grilled Chicken with Herbs", dietary: "regular" },
  { title: "Chicken and Vegetable Stir-Fry", dietary: "regular" },
  
  // Vegan dishes (plant-based only)
  { title: "Island Quinoa Bowl", dietary: "vegan" },
  { title: "Tropical Green Smoothie", dietary: "vegan" },
  { title: "Coconut Chia Pudding", dietary: "vegan" },
  { title: "Kale and Chickpea Power Salad", dietary: "vegan" },
  { title: "Sweet Potato Black Bean Bowl", dietary: "vegan" },
  { title: "Quinoa Stuffed Bell Peppers", dietary: "vegan" },
  { title: "Mediterranean Stuffed Portobello", dietary: "vegan" },
  { title: "Roasted Vegetable Buddha Bowl", dietary: "vegan" },
  { title: "Spiced Lentil and Vegetable Curry", dietary: "vegan" },
  { title: "Energy Bites with Dates and Nuts", dietary: "vegan" },
  { title: "Antioxidant Berry Smoothie", dietary: "vegan" },
  { title: "Green Detox Smoothie", dietary: "vegan" },
  
  // Vegetarian dishes (includes dairy/eggs)
  { title: "Greek Yogurt Parfait", dietary: "vegetarian" },
  { title: "Avocado Toast with Eggs", dietary: "vegetarian" },
  { title: "Whole Grain Pancakes", dietary: "vegetarian" },
  
  // Regular dishes (meat/poultry)
  { title: "Immune-Boosting Bone Broth", dietary: "regular" },
  { title: "Turkey and Vegetable Lettuce Wraps", dietary: "regular" },
];

export async function fixDietaryClassifications() {
  console.log("Fixing dietary classifications...");
  
  for (const update of dietaryUpdates) {
    try {
      await db
        .update(recipes)
        .set({ dietary: update.dietary })
        .where(eq(recipes.title, update.title));
      
      console.log(`Updated "${update.title}" to ${update.dietary}`);
    } catch (error) {
      console.error(`Failed to update "${update.title}":`, error);
    }
  }
  
  console.log("Dietary classifications updated successfully!");
}

// Run the fix if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  fixDietaryClassifications().catch(console.error);
}