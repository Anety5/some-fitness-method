import { db } from "./db";
import { recipes } from "../shared/schema";

const moreRecipes = [
  // BREAKFAST RECIPES
  {
    title: "Breakfast Burrito",
    description: "Protein-packed burrito with tofu scramble and fresh vegetables",
    category: "breakfast",
    prepTime: 15,
    calories: 420,
    protein: 18,
    fiber: 12,
    ingredients: [
      "1 whole wheat tortilla",
      "1/2 cup firm tofu, crumbled",
      "1/4 cup black beans",
      "1/2 avocado, sliced",
      "1/4 cup bell peppers, diced",
      "2 tbsp onions, diced",
      "2 tbsp salsa",
      "1 tsp turmeric",
      "1 tsp cumin",
      "1 tbsp olive oil",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Heat olive oil in pan and sauté onions and peppers",
      "Add crumbled tofu with turmeric, cumin, salt, and pepper",
      "Cook tofu scramble for 5-7 minutes until heated through",
      "Warm tortilla in microwave or dry pan",
      "Layer tofu scramble, black beans, and avocado on tortilla",
      "Top with salsa and roll tightly",
      "Serve immediately while warm"
    ]
  },
  {
    title: "Tofu Scramble",
    description: "Vegan protein-rich breakfast with turmeric and vegetables",
    category: "breakfast",
    prepTime: 12,
    calories: 240,
    protein: 16,
    fiber: 4,
    ingredients: [
      "8 oz firm tofu, crumbled",
      "1 cup fresh spinach",
      "1/2 cup cherry tomatoes, halved",
      "1/4 cup onion, diced",
      "2 tbsp nutritional yeast",
      "1 tsp turmeric",
      "1/2 tsp cumin",
      "1 tbsp olive oil",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Heat olive oil in large pan over medium heat",
      "Sauté onions until translucent, about 3 minutes",
      "Add crumbled tofu, turmeric, and cumin",
      "Cook for 5 minutes, stirring frequently",
      "Add spinach and cherry tomatoes",
      "Cook until spinach wilts and tomatoes soften",
      "Stir in nutritional yeast and season with salt and pepper"
    ]
  },
  {
    title: "Açaí Bowl",
    description: "Antioxidant-rich bowl with tropical fruits and superfoods",
    category: "breakfast",
    prepTime: 10,
    calories: 320,
    protein: 8,
    fiber: 12,
    ingredients: [
      "1 frozen açaí packet (100g)",
      "1/2 banana, sliced",
      "1/2 cup mixed berries",
      "1/4 cup almond milk",
      "2 tbsp granola",
      "1 tbsp chia seeds",
      "2 tbsp coconut flakes",
      "1 tbsp almond butter",
      "Fresh strawberries for topping"
    ],
    instructions: [
      "Blend frozen açaí packet with half the banana and almond milk",
      "Blend until smooth and thick like soft-serve ice cream",
      "Pour into bowl",
      "Arrange remaining banana slices and berries on top",
      "Sprinkle with granola, chia seeds, and coconut flakes",
      "Drizzle with almond butter",
      "Serve immediately"
    ]
  },

  // ADDITIONAL LUNCH RECIPES
  {
    title: "Advanced Poke Bowl",
    description: "Traditional Hawaiian bowl with fresh fish and island vegetables",
    category: "lunch",
    prepTime: 20,
    calories: 450,
    protein: 35,
    fiber: 8,
    ingredients: [
      "6 oz sushi-grade ahi tuna, cubed",
      "1 cup brown rice, cooked",
      "1/2 cup cucumber, diced",
      "1/2 cup shredded carrot",
      "1/2 avocado, sliced",
      "1/4 cup edamame",
      "2 tbsp wakame seaweed",
      "3 tbsp tamari",
      "1 tbsp sesame oil",
      "1 tsp rice vinegar",
      "1 tbsp sesame seeds"
    ],
    instructions: [
      "Marinate cubed tuna in 2 tbsp tamari and sesame oil for 10 minutes",
      "Prepare brown rice according to package instructions",
      "Arrange rice in bowl as base",
      "Top with marinated tuna in one section",
      "Add cucumber, carrot, avocado, and edamame in separate sections",
      "Garnish with wakame seaweed",
      "Drizzle with remaining tamari mixed with rice vinegar",
      "Sprinkle sesame seeds before serving"
    ]
  },
  {
    title: "Asian Lettuce Wraps",
    description: "Light and fresh wraps with seasoned protein and crisp vegetables",
    category: "lunch",
    prepTime: 18,
    calories: 280,
    protein: 22,
    fiber: 6,
    ingredients: [
      "8 romaine or butter lettuce leaves",
      "6 oz chicken breast or firm tofu, diced",
      "1/2 cup shredded carrot",
      "1/2 cup shredded cabbage",
      "2 scallions, sliced",
      "2 tbsp peanut butter",
      "2 tbsp lime juice",
      "1 tbsp tamari",
      "1 tsp fresh ginger, grated",
      "1 tsp sesame oil"
    ],
    instructions: [
      "Cook diced chicken or tofu in sesame oil until done",
      "Mix peanut butter, lime juice, tamari, and ginger for sauce",
      "Combine cooked protein with carrots and cabbage",
      "Toss with half the peanut-lime sauce",
      "Wash and dry lettuce leaves thoroughly",
      "Fill each leaf with protein mixture",
      "Top with scallions and drizzle with remaining sauce",
      "Serve immediately"
    ]
  },
  {
    title: "Enhanced Quinoa Kale Salad",
    description: "Protein-rich salad with massaged kale and chickpeas",
    category: "lunch",
    prepTime: 15,
    calories: 380,
    protein: 18,
    fiber: 14,
    ingredients: [
      "1 cup cooked quinoa, cooled",
      "4 cups kale, stems removed and chopped",
      "1 cup chickpeas, roasted",
      "1/2 cup cucumber, diced",
      "1/2 cup cherry tomatoes, halved",
      "3 tbsp tahini",
      "3 tbsp lemon juice",
      "2 tbsp olive oil",
      "1 garlic clove, minced",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Massage chopped kale with 1 tbsp olive oil and pinch of salt",
      "Let kale sit for 5 minutes to soften",
      "Roast chickpeas with spices if not pre-roasted",
      "Make dressing with tahini, lemon juice, remaining olive oil, and garlic",
      "Combine massaged kale with quinoa",
      "Add cucumber, tomatoes, and chickpeas",
      "Toss with tahini dressing",
      "Season with salt and pepper to taste"
    ]
  },

  // DINNER RECIPES
  {
    title: "Stuffed Bell Peppers",
    description: "Colorful peppers filled with quinoa and vegetable mixture",
    category: "dinner",
    prepTime: 40,
    calories: 350,
    protein: 12,
    fiber: 10,
    ingredients: [
      "4 large bell peppers, tops cut and seeds removed",
      "1 cup cooked quinoa",
      "1/2 cup onions, diced",
      "1/2 cup zucchini, diced",
      "1 cup fresh spinach, chopped",
      "2 garlic cloves, minced",
      "2 tbsp nutritional yeast",
      "1 tbsp olive oil",
      "1 tsp dried herbs (oregano, basil)",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Preheat oven to 375°F",
      "Sauté onions, zucchini, and garlic in olive oil",
      "Add spinach and cook until wilted",
      "Mix cooked vegetables with quinoa and nutritional yeast",
      "Season with herbs, salt, and pepper",
      "Stuff bell peppers with quinoa mixture",
      "Place in baking dish with 1/4 cup water",
      "Cover and bake 25-30 minutes until peppers are tender"
    ]
  },
  {
    title: "Stuffed Portobello Mushrooms",
    description: "Large mushroom caps filled with savory quinoa stuffing",
    category: "dinner",
    prepTime: 35,
    calories: 280,
    protein: 12,
    fiber: 8,
    ingredients: [
      "4 large portobello mushroom caps",
      "1 cup cooked brown rice",
      "1/2 cup onions, diced",
      "1/2 cup zucchini, diced",
      "1 cup spinach, chopped",
      "2 garlic cloves, minced",
      "2 tbsp olive oil",
      "2 tbsp balsamic vinegar",
      "1 tsp dried thyme",
      "Salt and pepper to taste"
    ],
    instructions: [
      "Remove mushroom stems and scrape out gills",
      "Brush caps with 1 tbsp olive oil and balsamic vinegar",
      "Sauté onions, zucchini, and garlic in remaining oil",
      "Add spinach and cook until wilted",
      "Mix vegetables with brown rice and thyme",
      "Season stuffing with salt and pepper",
      "Fill mushroom caps with rice mixture",
      "Bake at 375°F for 20-25 minutes until tender"
    ]
  }
];

export async function addBreakfastAndMore() {
  try {
    console.log("Adding breakfast and additional recipes...");
    
    for (const recipe of moreRecipes) {
      await db.insert(recipes).values(recipe);
      console.log(`Added recipe: ${recipe.title}`);
    }
    
    console.log("Additional breakfast and recipe seeding completed successfully!");
  } catch (error) {
    console.error("Error adding recipes:", error);
  }
}

// Run the function
addBreakfastAndMore().then(() => process.exit(0));