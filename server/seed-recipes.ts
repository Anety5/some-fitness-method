import { db } from "./db";
import { recipes } from "../shared/schema";

const recipeData = [
  // ISLAND-INSPIRED RECIPES
  {
    title: "Hawaiian Fish Tacos",
    description: "Fresh mahi-mahi with tropical slaw and avocado crema",
    category: "lunch",
    prepTime: 25,
    calories: 380,
    protein: 28,
    fiber: 8,
    ingredients: [
      "6 oz mahi-mahi fillet",
      "2 corn tortillas",
      "1/4 red cabbage, shredded",
      "1/4 cup pineapple, diced",
      "1/2 avocado",
      "2 tbsp lime juice",
      "1 tbsp cilantro, chopped",
      "1 tsp cumin",
      "1 tbsp olive oil",
      "Sea salt and pepper"
    ],
    instructions: [
      "Season fish with cumin, salt, and pepper",
      "Pan-sear fish in olive oil for 4 minutes per side",
      "Mash avocado with lime juice for crema",
      "Mix cabbage with pineapple and cilantro",
      "Warm tortillas",
      "Assemble tacos with fish, slaw, and avocado crema",
      "Serve immediately with lime wedges"
    ]
  },
  {
    title: "Tropical Poke Bowl",
    description: "Fresh ahi tuna with brown rice and island vegetables",
    category: "lunch",
    prepTime: 20,
    calories: 420,
    protein: 32,
    fiber: 6,
    ingredients: [
      "6 oz sushi-grade ahi tuna",
      "1 cup cooked brown rice",
      "1/4 cup edamame",
      "1/4 cup cucumber, diced",
      "1/4 cup mango, diced",
      "2 tbsp tamari",
      "1 tbsp sesame oil",
      "1 tsp rice vinegar",
      "1 tbsp sesame seeds",
      "1 avocado, sliced"
    ],
    instructions: [
      "Cube tuna into bite-sized pieces",
      "Marinate tuna in tamari, sesame oil, and vinegar for 10 minutes",
      "Prepare vegetables and mango",
      "Arrange brown rice in bowl",
      "Top with marinated tuna",
      "Add vegetables, mango, and avocado",
      "Sprinkle with sesame seeds before serving"
    ]
  },
  {
    title: "Island Quinoa Bowl",
    description: "Protein-rich quinoa with tropical fruits and coconut",
    category: "lunch",
    prepTime: 25,
    calories: 390,
    protein: 14,
    fiber: 8,
    ingredients: [
      "1 cup cooked quinoa",
      "1/4 cup black beans",
      "1/4 cup roasted sweet potato",
      "1/4 cup papaya, diced",
      "2 tbsp coconut flakes",
      "2 tbsp macadamia nuts",
      "1 tbsp lime juice",
      "1 tbsp coconut oil",
      "1 tsp honey",
      "1/4 cup cilantro"
    ],
    instructions: [
      "Cook quinoa and roast sweet potato at 400°F for 20 minutes",
      "Make dressing with lime juice, coconut oil, and honey",
      "Combine quinoa with beans and sweet potato",
      "Top with papaya and cilantro",
      "Drizzle with dressing",
      "Garnish with coconut flakes and macadamia nuts"
    ]
  },
  {
    title: "Vegetarian Lettuce Wraps",
    description: "Fresh lettuce cups filled with seasoned vegetables and nuts",
    category: "lunch",
    prepTime: 15,
    calories: 220,
    protein: 8,
    fiber: 6,
    ingredients: [
      "8 butter lettuce leaves",
      "1/2 cup mushrooms, diced",
      "1/4 cup water chestnuts",
      "1/4 cup carrots, diced",
      "2 tbsp cashews, chopped",
      "2 tbsp tamari",
      "1 tsp sesame oil",
      "1 tsp fresh ginger",
      "2 green onions, sliced",
      "1 tbsp cilantro"
    ],
    instructions: [
      "Sauté mushrooms, carrots, and water chestnuts",
      "Add ginger and cook 1 minute",
      "Season with tamari and sesame oil",
      "Remove from heat and add cashews",
      "Wash and dry lettuce leaves",
      "Fill leaves with vegetable mixture",
      "Garnish with green onions and cilantro"
    ]
  },
  {
    title: "Kale and Chickpea Power Salad",
    description: "Massaged kale with protein-rich chickpeas and tahini dressing",
    category: "lunch",
    prepTime: 15,
    calories: 340,
    protein: 16,
    fiber: 12,
    ingredients: [
      "4 cups kale, stems removed",
      "1 cup chickpeas, cooked",
      "1/4 cup pumpkin seeds",
      "1/4 cup dried cranberries",
      "3 tbsp tahini",
      "2 tbsp lemon juice",
      "1 tbsp olive oil",
      "1 tsp maple syrup",
      "1 garlic clove, minced",
      "Sea salt to taste"
    ],
    instructions: [
      "Massage kale with a pinch of salt until softened",
      "Make dressing with tahini, lemon juice, olive oil, maple syrup, and garlic",
      "Add chickpeas to massaged kale",
      "Toss with tahini dressing",
      "Top with pumpkin seeds and cranberries",
      "Let sit 10 minutes before serving"
    ]
  },
  {
    title: "Mediterranean Lentil Salad",
    description: "Protein-packed lentils with fresh herbs and vegetables",
    category: "lunch",
    prepTime: 20,
    calories: 320,
    protein: 18,
    fiber: 15,
    ingredients: [
      "1 cup cooked green lentils",
      "1/4 cup red onion, diced",
      "1/2 cup cherry tomatoes",
      "1/4 cup cucumber, diced",
      "1/4 cup kalamata olives",
      "2 tbsp fresh parsley",
      "2 tbsp fresh mint",
      "3 tbsp olive oil",
      "2 tbsp red wine vinegar",
      "1 tsp oregano"
    ],
    instructions: [
      "Cook lentils and let cool",
      "Dice vegetables and herbs",
      "Make vinaigrette with olive oil, vinegar, and oregano",
      "Combine lentils with vegetables",
      "Add herbs and olives",
      "Toss with vinaigrette",
      "Chill for 30 minutes before serving"
    ]
  },
  {
    title: "Coconut Shrimp Sandwich",
    description: "Grilled shrimp with coconut slaw on whole grain bread",
    category: "lunch",
    prepTime: 20,
    calories: 350,
    protein: 24,
    fiber: 6,
    ingredients: [
      "6 oz large shrimp, peeled",
      "2 slices whole grain bread",
      "1/4 cup cabbage, shredded",
      "2 tbsp coconut flakes",
      "1 tbsp mayo (avocado oil)",
      "1 tbsp lime juice",
      "1 tsp curry powder",
      "1/4 avocado, sliced",
      "2 lettuce leaves",
      "Salt and pepper"
    ],
    instructions: [
      "Season shrimp with curry powder, salt, and pepper",
      "Grill shrimp for 2-3 minutes per side",
      "Mix cabbage with coconut flakes, mayo, and lime juice",
      "Toast bread lightly",
      "Layer lettuce, avocado, and shrimp on bread",
      "Top with coconut slaw",
      "Serve immediately"
    ]
  },

  // BREAKFAST RECIPES
  {
    title: "Power-Packed Green Smoothie",
    description: "Energizing blend of spinach, fruits, and superfoods for morning vitality",
    category: "breakfast",
    prepTime: 5,
    calories: 280,
    protein: 8,
    fiber: 12,
    ingredients: [
      "1 cup fresh spinach",
      "1/2 banana",
      "1/2 cup frozen mango",
      "1 tbsp chia seeds",
      "1 cup coconut water",
      "1 tsp spirulina powder",
      "1 tbsp almond butter",
      "Ice as needed"
    ],
    instructions: [
      "Add coconut water to blender first",
      "Add spinach, banana, and mango",
      "Add chia seeds, spirulina, and almond butter",
      "Blend until smooth",
      "Add ice for desired consistency",
      "Serve immediately"
    ]
  },
  {
    title: "Blueberry Walnut Overnight Oats",
    description: "Brain-boosting oats prepared the night before for easy morning nutrition",
    category: "breakfast",
    prepTime: 10,
    calories: 320,
    protein: 12,
    fiber: 8,
    ingredients: [
      "1/2 cup rolled oats",
      "1/2 cup almond milk",
      "1 tbsp chia seeds",
      "1/4 cup fresh blueberries",
      "2 tbsp chopped walnuts",
      "1 tbsp almond butter",
      "1 tsp vanilla extract",
      "1 tbsp maple syrup"
    ],
    instructions: [
      "Mix oats, almond milk, and chia seeds in jar",
      "Add vanilla and maple syrup",
      "Stir well and refrigerate overnight",
      "In morning, top with blueberries and walnuts",
      "Add almond butter on top",
      "Serve chilled"
    ]
  },
  {
    title: "Avocado Toast with Hemp Seeds",
    description: "Nutrient-dense toast with healthy fats and complete protein",
    category: "breakfast",
    prepTime: 8,
    calories: 290,
    protein: 10,
    fiber: 12,
    ingredients: [
      "2 slices ezekiel bread",
      "1 ripe avocado",
      "1 tbsp hemp seeds",
      "1 tbsp lemon juice",
      "1/4 tsp red pepper flakes",
      "Sea salt to taste",
      "2 cherry tomatoes, sliced",
      "1 tsp olive oil"
    ],
    instructions: [
      "Toast bread slices until golden",
      "Mash avocado with lemon juice and salt",
      "Spread avocado mixture on toast",
      "Top with sliced tomatoes",
      "Sprinkle hemp seeds and red pepper flakes",
      "Drizzle with olive oil before serving"
    ]
  },

  // LUNCH RECIPES
  {
    title: "Mediterranean Quinoa Bowl",
    description: "Complete protein bowl with Mediterranean flavors and vegetables",
    category: "lunch",
    prepTime: 25,
    calories: 420,
    protein: 16,
    fiber: 8,
    ingredients: [
      "1 cup cooked quinoa",
      "1/4 cup chickpeas",
      "1/4 cup cucumber, diced",
      "1/4 cup cherry tomatoes",
      "2 tbsp kalamata olives",
      "2 tbsp feta cheese",
      "2 tbsp tahini",
      "1 tbsp lemon juice",
      "2 tbsp olive oil",
      "1 cup mixed greens"
    ],
    instructions: [
      "Cook quinoa according to package directions",
      "Prepare vegetables and set aside",
      "Make dressing with tahini, lemon juice, and olive oil",
      "Layer greens in bowl",
      "Add quinoa and vegetables",
      "Top with feta and olives",
      "Drizzle with tahini dressing"
    ]
  },
  {
    title: "Asian-Inspired Buddha Bowl",
    description: "Colorful bowl with plant-based protein and healing spices",
    category: "lunch",
    prepTime: 30,
    calories: 380,
    protein: 14,
    fiber: 10,
    ingredients: [
      "1 cup brown rice",
      "1/2 cup edamame",
      "1/4 cup shredded purple cabbage",
      "1 carrot, julienned",
      "1/4 cup snap peas",
      "2 tbsp sesame seeds",
      "2 tbsp almond butter",
      "1 tbsp tamari",
      "1 tsp sesame oil",
      "1 tsp fresh ginger, grated"
    ],
    instructions: [
      "Cook brown rice and set aside",
      "Steam edamame and snap peas lightly",
      "Prepare vegetables and arrange in bowl",
      "Make dressing with almond butter, tamari, sesame oil, and ginger",
      "Add rice to bowl with vegetables",
      "Drizzle with dressing",
      "Sprinkle sesame seeds on top"
    ]
  },
  {
    title: "Lentil Power Salad",
    description: "Protein-rich lentils with fresh vegetables and herbs",
    category: "lunch",
    prepTime: 20,
    calories: 340,
    protein: 18,
    fiber: 16,
    ingredients: [
      "1 cup cooked green lentils",
      "2 cups arugula",
      "1/4 cup red onion, diced",
      "1/2 cup cherry tomatoes",
      "1/4 cup fresh parsley",
      "2 tbsp pumpkin seeds",
      "3 tbsp olive oil",
      "2 tbsp balsamic vinegar",
      "1 tsp Dijon mustard",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Cook lentils and let cool",
      "Prepare vegetables and herbs",
      "Make vinaigrette with olive oil, vinegar, and mustard",
      "Combine lentils with vegetables",
      "Toss with vinaigrette",
      "Top with pumpkin seeds",
      "Season with salt and pepper"
    ]
  },

  // DINNER RECIPES
  {
    title: "Baked Salmon with Sweet Potato",
    description: "Omega-3 rich salmon with roasted sweet potato and vegetables",
    category: "dinner",
    prepTime: 35,
    calories: 450,
    protein: 32,
    fiber: 8,
    ingredients: [
      "6 oz salmon fillet",
      "1 medium sweet potato",
      "1 cup broccoli florets",
      "2 tbsp olive oil",
      "1 lemon, sliced",
      "2 garlic cloves, minced",
      "1 tsp dried herbs",
      "Salt and pepper to taste",
      "1 tbsp fresh dill"
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Cut sweet potato into cubes",
      "Toss vegetables with olive oil and garlic",
      "Place on baking sheet and roast 20 minutes",
      "Season salmon with herbs, salt, and pepper",
      "Add salmon to sheet, top with lemon slices",
      "Bake additional 12-15 minutes",
      "Garnish with fresh dill"
    ]
  },
  {
    title: "Chickpea Curry with Brown Rice",
    description: "Warming curry packed with plant protein and anti-inflammatory spices",
    category: "dinner",
    prepTime: 30,
    calories: 390,
    protein: 15,
    fiber: 12,
    ingredients: [
      "1 can chickpeas, drained",
      "1 cup brown rice",
      "1 can coconut milk",
      "1 onion, diced",
      "3 garlic cloves, minced",
      "1 tbsp curry powder",
      "1 tsp turmeric",
      "1 tsp ginger, fresh",
      "1 can diced tomatoes",
      "2 cups spinach"
    ],
    instructions: [
      "Cook brown rice according to package",
      "Sauté onion and garlic until soft",
      "Add spices and cook 1 minute",
      "Add tomatoes and coconut milk",
      "Add chickpeas and simmer 15 minutes",
      "Stir in spinach until wilted",
      "Season with salt and pepper",
      "Serve over brown rice"
    ]
  },
  {
    title: "Turkey and Vegetable Stir-Fry",
    description: "Lean protein with colorful vegetables in savory sauce",
    category: "dinner",
    prepTime: 20,
    calories: 320,
    protein: 28,
    fiber: 6,
    ingredients: [
      "6 oz ground turkey",
      "1 bell pepper, sliced",
      "1 zucchini, sliced",
      "1 cup snap peas",
      "2 tbsp coconut oil",
      "2 tbsp tamari",
      "1 tbsp rice vinegar",
      "1 tsp sesame oil",
      "2 garlic cloves, minced",
      "1 tsp fresh ginger"
    ],
    instructions: [
      "Heat coconut oil in large pan",
      "Cook turkey until browned",
      "Add garlic and ginger, cook 1 minute",
      "Add vegetables and stir-fry 5-7 minutes",
      "Mix tamari, vinegar, and sesame oil",
      "Add sauce to pan and toss",
      "Cook 2 more minutes",
      "Serve immediately"
    ]
  },

  // SNACK RECIPES
  {
    title: "Energy-Boosting Protein Balls",
    description: "No-bake energy balls with dates, nuts, and superfoods",
    category: "snack",
    prepTime: 15,
    calories: 120,
    protein: 4,
    fiber: 3,
    ingredients: [
      "1 cup pitted dates",
      "1/2 cup almonds",
      "1/4 cup cashews",
      "2 tbsp chia seeds",
      "1 tbsp coconut oil",
      "1 tsp vanilla extract",
      "1 tbsp cacao powder",
      "Coconut flakes for rolling"
    ],
    instructions: [
      "Process dates in food processor until paste forms",
      "Add nuts and process until chopped",
      "Add chia seeds, coconut oil, vanilla, and cacao",
      "Process until mixture holds together",
      "Roll into 12 balls",
      "Roll in coconut flakes if desired",
      "Refrigerate 30 minutes before serving"
    ]
  },
  {
    title: "Apple Slices with Almond Butter",
    description: "Simple, satisfying snack with fiber and healthy fats",
    category: "snack",
    prepTime: 3,
    calories: 180,
    protein: 6,
    fiber: 5,
    ingredients: [
      "1 medium apple",
      "2 tbsp almond butter",
      "1 tsp cinnamon",
      "1 tbsp hemp seeds",
      "Pinch of sea salt"
    ],
    instructions: [
      "Wash and slice apple into wedges",
      "Mix almond butter with cinnamon",
      "Arrange apple slices on plate",
      "Serve with almond butter for dipping",
      "Sprinkle hemp seeds and salt on top"
    ]
  },
  {
    title: "Veggie Hummus Wrap",
    description: "Fresh vegetables wrapped with protein-rich hummus",
    category: "snack",
    prepTime: 10,
    calories: 200,
    protein: 8,
    fiber: 8,
    ingredients: [
      "1 large collard green leaf",
      "3 tbsp hummus",
      "1/4 cucumber, julienned",
      "1/4 carrot, julienned",
      "1/4 bell pepper, sliced",
      "2 tbsp sprouts",
      "1 tbsp sunflower seeds"
    ],
    instructions: [
      "Remove thick stem from collard leaf",
      "Spread hummus on leaf",
      "Add vegetables in center",
      "Sprinkle with sprouts and seeds",
      "Roll tightly from bottom",
      "Slice in half to serve"
    ]
  },

  // SMOOTHIE RECIPES
  {
    title: "Tropical Mango Smoothie",
    description: "Refreshing tropical blend with digestive enzymes",
    category: "smoothie",
    prepTime: 5,
    calories: 220,
    protein: 6,
    fiber: 5,
    ingredients: [
      "1 cup frozen mango",
      "1/2 banana",
      "1/2 cup coconut milk",
      "1 tbsp lime juice",
      "1 tbsp coconut flakes",
      "1 tsp fresh ginger",
      "1/2 cup ice"
    ],
    instructions: [
      "Add coconut milk to blender",
      "Add mango, banana, and ginger",
      "Add lime juice and coconut flakes",
      "Blend until smooth",
      "Add ice if needed for consistency",
      "Serve immediately"
    ]
  },
  {
    title: "Chocolate Peanut Butter Smoothie",
    description: "Indulgent yet healthy smoothie with plant protein",
    category: "smoothie",
    prepTime: 5,
    calories: 310,
    protein: 12,
    fiber: 8,
    ingredients: [
      "1 banana",
      "2 tbsp natural peanut butter",
      "1 tbsp cacao powder",
      "1 cup almond milk",
      "1 tbsp ground flaxseed",
      "1 tsp vanilla extract",
      "1 cup ice",
      "1 tsp maple syrup"
    ],
    instructions: [
      "Add almond milk to blender",
      "Add banana and peanut butter",
      "Add cacao powder and flaxseed",
      "Add vanilla and maple syrup",
      "Blend until creamy",
      "Add ice and blend again",
      "Serve immediately"
    ]
  }
];

export async function seedRecipes() {
  try {
    console.log("Seeding recipes...");
    
    for (const recipe of recipeData) {
      await db.insert(recipes).values(recipe);
      console.log(`Added recipe: ${recipe.title}`);
    }
    
    console.log("Recipe seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding recipes:", error);
  }
}

// Run the seeding function
seedRecipes().then(() => process.exit(0));