import { db } from "./db";
import { recipes } from "../shared/schema";

const additionalRecipes = [
  // MORE LUNCH RECIPES
  {
    title: "Grilled Mahi-Mahi Salad",
    description: "Flaky grilled fish over mixed greens with mango vinaigrette",
    category: "lunch",
    prepTime: 20,
    calories: 360,
    protein: 30,
    fiber: 6,
    ingredients: [
      "6 oz mahi-mahi fillet",
      "4 cups mixed greens",
      "1/2 cup diced mango",
      "1/4 cup red bell pepper",
      "1/4 cup cucumber, sliced",
      "2 tbsp macadamia nuts",
      "3 tbsp olive oil",
      "2 tbsp lime juice",
      "1 tsp honey",
      "Salt and pepper"
    ],
    instructions: [
      "Season mahi-mahi with salt and pepper",
      "Grill fish for 4-5 minutes per side",
      "Make vinaigrette with olive oil, lime juice, and honey",
      "Toss greens with vinaigrette",
      "Top salad with grilled fish",
      "Add mango, bell pepper, and cucumber",
      "Garnish with macadamia nuts"
    ]
  },
  {
    title: "Coconut Rice Bowl with Tofu",
    description: "Jasmine rice cooked in coconut milk with marinated tofu",
    category: "lunch",
    prepTime: 25,
    calories: 410,
    protein: 16,
    fiber: 4,
    ingredients: [
      "1 cup jasmine rice",
      "1/2 cup coconut milk",
      "6 oz firm tofu, cubed",
      "1/4 cup snap peas",
      "1/4 cup red cabbage",
      "2 tbsp tamari",
      "1 tbsp sesame oil",
      "1 tbsp rice vinegar",
      "1 tsp fresh ginger",
      "2 green onions, sliced"
    ],
    instructions: [
      "Cook rice with half coconut milk and water",
      "Marinate tofu in tamari, sesame oil, and vinegar",
      "Pan-fry tofu until golden",
      "Steam snap peas briefly",
      "Serve rice topped with tofu and vegetables",
      "Drizzle with remaining marinade",
      "Garnish with green onions"
    ]
  },
  {
    title: "Island Chicken Lettuce Cups",
    description: "Tropical spiced chicken served in crisp lettuce cups",
    category: "lunch",
    prepTime: 20,
    calories: 280,
    protein: 26,
    fiber: 4,
    ingredients: [
      "6 oz chicken breast, diced",
      "8 butter lettuce leaves",
      "1/4 cup pineapple, diced",
      "1/4 cup red onion, minced",
      "2 tbsp cilantro, chopped",
      "1 tbsp coconut oil",
      "1 tsp curry powder",
      "1/2 tsp paprika",
      "2 tbsp lime juice",
      "Salt to taste"
    ],
    instructions: [
      "Season chicken with curry powder and paprika",
      "Cook chicken in coconut oil until done",
      "Mix cooked chicken with pineapple and onion",
      "Add lime juice and cilantro",
      "Season with salt",
      "Serve in lettuce cups",
      "Garnish with extra cilantro"
    ]
  },
  {
    title: "Sweet Potato and Black Bean Bowl",
    description: "Roasted sweet potato with seasoned black beans and avocado",
    category: "lunch",
    prepTime: 30,
    calories: 380,
    protein: 14,
    fiber: 16,
    ingredients: [
      "1 large sweet potato, cubed",
      "1 cup black beans, cooked",
      "1/2 avocado, sliced",
      "1/4 cup corn kernels",
      "2 tbsp pumpkin seeds",
      "2 tbsp olive oil",
      "1 tsp cumin",
      "1/2 tsp smoked paprika",
      "2 tbsp lime juice",
      "Salt and pepper"
    ],
    instructions: [
      "Toss sweet potato with olive oil, cumin, and paprika",
      "Roast at 425°F for 25 minutes",
      "Season black beans with salt and pepper",
      "Arrange sweet potato and beans in bowl",
      "Top with avocado and corn",
      "Drizzle with lime juice",
      "Sprinkle pumpkin seeds on top"
    ]
  },
  {
    title: "Seared Ahi Tuna Salad",
    description: "Sesame-crusted tuna over Asian greens with ginger dressing",
    category: "lunch",
    prepTime: 15,
    calories: 340,
    protein: 32,
    fiber: 4,
    ingredients: [
      "6 oz ahi tuna steak",
      "2 tbsp sesame seeds",
      "4 cups mixed Asian greens",
      "1/4 cup edamame",
      "1/4 cup shredded carrots",
      "2 tbsp olive oil",
      "1 tbsp rice vinegar",
      "1 tsp fresh ginger, grated",
      "1 tsp tamari",
      "1/2 tsp sesame oil"
    ],
    instructions: [
      "Coat tuna with sesame seeds",
      "Sear tuna 1-2 minutes per side for rare",
      "Let rest, then slice thin",
      "Make dressing with olive oil, vinegar, ginger, tamari, and sesame oil",
      "Toss greens with dressing",
      "Top with sliced tuna",
      "Add edamame and carrots"
    ]
  },

  // MORE DINNER RECIPES
  {
    title: "Coconut Curry Salmon",
    description: "Pan-seared salmon in creamy coconut curry sauce",
    category: "dinner",
    prepTime: 25,
    calories: 480,
    protein: 35,
    fiber: 6,
    ingredients: [
      "6 oz salmon fillet",
      "1/2 can coconut milk",
      "1 cup jasmine rice",
      "1/2 cup snap peas",
      "1/4 cup red bell pepper",
      "2 tbsp red curry paste",
      "1 tbsp fish sauce",
      "1 tbsp lime juice",
      "1 tsp fresh ginger",
      "2 tbsp cilantro"
    ],
    instructions: [
      "Cook jasmine rice according to package",
      "Season and sear salmon until cooked through",
      "Remove salmon and set aside",
      "Sauté ginger in same pan",
      "Add curry paste and cook 1 minute",
      "Add coconut milk and simmer",
      "Add vegetables and cook until tender",
      "Return salmon to pan, garnish with cilantro"
    ]
  },
  {
    title: "Herb-Crusted Mahi-Mahi",
    description: "Fresh fish with herb crust and roasted vegetables",
    category: "dinner",
    prepTime: 30,
    calories: 420,
    protein: 34,
    fiber: 8,
    ingredients: [
      "6 oz mahi-mahi fillet",
      "1/4 cup panko breadcrumbs",
      "2 tbsp fresh herbs (parsley, dill)",
      "1 zucchini, sliced",
      "1 cup cherry tomatoes",
      "1/4 cup red onion, sliced",
      "3 tbsp olive oil",
      "2 tbsp lemon juice",
      "2 garlic cloves, minced",
      "Salt and pepper"
    ],
    instructions: [
      "Preheat oven to 400°F",
      "Mix panko with herbs and 1 tbsp olive oil",
      "Season fish and top with herb mixture",
      "Toss vegetables with remaining oil and garlic",
      "Place fish and vegetables on baking sheet",
      "Bake 15-18 minutes until fish flakes",
      "Finish with lemon juice"
    ]
  },
  {
    title: "Teriyaki Chicken with Brown Rice",
    description: "Grilled chicken glazed with homemade teriyaki sauce",
    category: "dinner",
    prepTime: 35,
    calories: 450,
    protein: 32,
    fiber: 4,
    ingredients: [
      "6 oz chicken breast",
      "1 cup brown rice",
      "1 cup broccoli florets",
      "1/4 cup tamari",
      "2 tbsp rice vinegar",
      "1 tbsp honey",
      "1 tsp fresh ginger",
      "1 garlic clove, minced",
      "1 tbsp sesame seeds",
      "1 tsp sesame oil"
    ],
    instructions: [
      "Cook brown rice according to package",
      "Make teriyaki sauce with tamari, vinegar, honey, ginger, and garlic",
      "Marinate chicken in half the sauce for 15 minutes",
      "Grill chicken until cooked through",
      "Steam broccoli until tender",
      "Brush chicken with remaining sauce",
      "Serve over rice with broccoli, garnish with sesame seeds"
    ]
  },
  {
    title: "Mediterranean Stuffed Portobello",
    description: "Large mushroom caps stuffed with quinoa and vegetables",
    category: "dinner",
    prepTime: 35,
    calories: 320,
    protein: 14,
    fiber: 10,
    ingredients: [
      "2 large portobello mushroom caps",
      "1/2 cup cooked quinoa",
      "1/4 cup sun-dried tomatoes",
      "1/4 cup artichoke hearts",
      "2 tbsp pine nuts",
      "2 tbsp feta cheese",
      "2 tbsp olive oil",
      "1 tbsp balsamic vinegar",
      "2 garlic cloves, minced",
      "Fresh basil leaves"
    ],
    instructions: [
      "Remove mushroom stems and scrape out gills",
      "Brush caps with olive oil and balsamic",
      "Mix quinoa with tomatoes, artichokes, and pine nuts",
      "Add garlic and half the feta",
      "Stuff mushroom caps with quinoa mixture",
      "Top with remaining feta",
      "Bake at 375°F for 20 minutes",
      "Garnish with fresh basil"
    ]
  },
  {
    title: "Island-Style Fish Curry",
    description: "White fish simmered in aromatic coconut curry",
    category: "dinner",
    prepTime: 30,
    calories: 390,
    protein: 28,
    fiber: 6,
    ingredients: [
      "6 oz white fish (cod or halibut)",
      "1 can coconut milk",
      "1 cup jasmine rice",
      "1/2 cup green beans",
      "1/4 cup red bell pepper",
      "1 tbsp curry powder",
      "1 tsp turmeric",
      "1 onion, sliced",
      "2 garlic cloves",
      "1 inch fresh ginger"
    ],
    instructions: [
      "Cook jasmine rice",
      "Sauté onion, garlic, and ginger",
      "Add curry powder and turmeric, cook 1 minute",
      "Add coconut milk and simmer",
      "Add vegetables and cook 5 minutes",
      "Gently add fish and simmer until cooked",
      "Season with salt and serve over rice"
    ]
  }
];

export async function addMoreRecipes() {
  try {
    console.log("Adding more lunch and dinner recipes...");
    
    for (const recipe of additionalRecipes) {
      await db.insert(recipes).values(recipe);
      console.log(`Added recipe: ${recipe.title}`);
    }
    
    console.log("Additional recipe seeding completed successfully!");
  } catch (error) {
    console.error("Error adding recipes:", error);
  }
}

// Run the function
addMoreRecipes().then(() => process.exit(0));