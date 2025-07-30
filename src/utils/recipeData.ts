// Recipe Library with Premium Gating
export interface Recipe {
  id: string;
  title: string;
  category: 'Breakfast' | 'Lunch' | 'Dinner' | 'Snacks' | 'Smoothies' | 'Desserts';
  dietary: string[];
  ingredients: string[];
  instructions: string;
  prepTime: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  nutrition: {
    calories: number;
    protein: string;
    carbs: string;
    fat: string;
    fiber: string;
  };
  premium: boolean;
  description?: string;
}

export const recipes: Recipe[] = [
  // FREE BREAKFAST RECIPES
  {
    id: 'breakfast_1',
    title: "Berry Quinoa Bowl",
    category: "Breakfast",
    dietary: ["vegan", "gluten-free"],
    ingredients: [
      "1 cup cooked quinoa",
      "1/2 cup mixed berries",
      "2 tbsp almond butter",
      "1 tbsp chia seeds",
      "1 tsp maple syrup",
      "1/4 cup almond milk"
    ],
    instructions: "Mix cooked quinoa with almond milk. Top with berries, almond butter, chia seeds, and drizzle with maple syrup. Serve immediately.",
    prepTime: "10 minutes",
    difficulty: "Easy",
    nutrition: {
      calories: 420,
      protein: "12g",
      carbs: "58g",
      fat: "16g",
      fiber: "8g"
    },
    premium: false,
    description: "Nutrient-dense quinoa bowl packed with antioxidants and plant protein"
  },
  {
    id: 'breakfast_2',
    title: "Overnight Oats with Banana",
    category: "Breakfast",
    dietary: ["vegetarian", "nut-free"],
    ingredients: [
      "1/2 cup rolled oats",
      "1/2 cup milk of choice",
      "1 mashed banana",
      "1 tbsp honey",
      "1/2 tsp vanilla extract",
      "Pinch of cinnamon"
    ],
    instructions: "Combine all ingredients in a jar. Refrigerate overnight. Enjoy cold or warm in the morning.",
    prepTime: "5 minutes",
    difficulty: "Easy",
    nutrition: {
      calories: 350,
      protein: "10g",
      carbs: "65g",
      fat: "6g",
      fiber: "7g"
    },
    premium: false,
    description: "Simple make-ahead breakfast with natural sweetness from banana"
  },
  
  // PREMIUM BREAKFAST RECIPES
  {
    id: 'breakfast_premium_1',
    title: "Acai Power Bowl with Superfood Toppings",
    category: "Breakfast",
    dietary: ["vegan", "gluten-free"],
    ingredients: [
      "1 frozen acai packet",
      "1/2 frozen banana",
      "1/4 cup coconut milk",
      "2 tbsp goji berries",
      "1 tbsp cacao nibs",
      "1 tbsp hemp hearts",
      "1 tbsp coconut flakes",
      "Fresh berries for topping"
    ],
    instructions: "Blend acai, banana, and coconut milk until thick. Pour into bowl and arrange toppings artfully. Rich in antioxidants and omega-3s.",
    prepTime: "8 minutes",
    difficulty: "Medium",
    nutrition: {
      calories: 380,
      protein: "8g",
      carbs: "45g",
      fat: "20g",
      fiber: "12g"
    },
    premium: true,
    description: "Instagram-worthy superfood bowl with premium antioxidant ingredients"
  },
  {
    id: 'breakfast_premium_2',
    title: "Matcha Chia Pudding Parfait",
    category: "Breakfast",
    dietary: ["vegan", "keto-friendly"],
    ingredients: [
      "3 tbsp chia seeds",
      "1 cup coconut milk",
      "1 tsp matcha powder",
      "2 tbsp monk fruit sweetener",
      "1/4 cup coconut yogurt",
      "Sliced almonds",
      "Fresh mint leaves"
    ],
    instructions: "Whisk chia seeds with coconut milk and matcha. Refrigerate 4 hours. Layer with coconut yogurt and almonds. Garnish with mint.",
    prepTime: "15 minutes",
    difficulty: "Medium",
    nutrition: {
      calories: 290,
      protein: "6g",
      carbs: "12g",
      fat: "26g",
      fiber: "15g"
    },
    premium: true,
    description: "Zen-inspired breakfast with metabolism-boosting matcha and omega-3s"
  },
  {
    id: 'breakfast_premium_3',
    title: "Spanish Tortilla",
    category: "Breakfast",
    dietary: ["gluten-free", "vegetarian"],
    ingredients: [
      "3 eggs",
      "2 small potatoes, thinly sliced",
      "1/2 small bell pepper, diced",
      "1 tbsp olive oil",
      "Salt & pepper",
      "Optional: grated cheese or tomato sauce"
    ],
    instructions: "Boil potatoes for 3 minutes and drain. Sauté peppers in olive oil for 2–3 minutes. Whisk eggs with salt and pepper, add cooked potatoes. Pour into pan and cook until set. Cover or broil to finish. Serve warm with optional cheese or tomato topping.",
    prepTime: "20 minutes",
    difficulty: "Medium",
    nutrition: {
      calories: 350,
      protein: "18g",
      carbs: "28g",
      fat: "20g",
      fiber: "4g"
    },
    premium: true,
    description: "Traditional Spanish egg dish with potatoes and peppers, perfect for breakfast or brunch"
  },

  // FREE LUNCH RECIPES
  {
    id: 'lunch_1',
    title: "Mediterranean Chickpea Salad",
    category: "Lunch",
    dietary: ["vegetarian", "nut-free"],
    ingredients: [
      "1 can chickpeas, drained",
      "1 cucumber, diced",
      "1 cup cherry tomatoes",
      "1/4 red onion, sliced",
      "1/4 cup feta cheese",
      "2 tbsp olive oil",
      "1 tbsp lemon juice",
      "Fresh herbs (parsley, mint)"
    ],
    instructions: "Combine chickpeas, vegetables, and feta. Whisk olive oil with lemon juice and herbs. Toss salad with dressing.",
    prepTime: "15 minutes",
    difficulty: "Easy",
    nutrition: {
      calories: 380,
      protein: "16g",
      carbs: "45g",
      fat: "14g",
      fiber: "12g"
    },
    premium: false,
    description: "Fresh Mediterranean flavors with protein-rich chickpeas"
  },

  // PREMIUM LUNCH RECIPES
  {
    id: 'lunch_premium_1',
    title: "Spicy Chickpea Lettuce Wraps",
    category: "Lunch",
    dietary: ["vegetarian", "nut-free"],
    ingredients: [
      "1 can chickpeas, mashed",
      "2 tbsp tahini",
      "1 tsp harissa paste",
      "1 bell pepper, diced",
      "1/4 cup red onion",
      "Butter lettuce leaves",
      "Microgreens",
      "Pomegranate seeds"
    ],
    instructions: "Mash chickpeas with tahini and harissa. Mix in vegetables. Serve in lettuce cups topped with microgreens and pomegranate.",
    prepTime: "20 minutes",
    difficulty: "Medium",
    nutrition: {
      calories: 320,
      protein: "14g",
      carbs: "38g",
      fat: "12g",
      fiber: "11g"
    },
    premium: true,
    description: "Vibrant lettuce wraps with Middle Eastern spices and superfood garnishes"
  },
  {
    id: 'lunch_premium_2',
    title: "Rainbow Buddha Bowl with Tahini Dressing",
    category: "Lunch",
    dietary: ["vegan", "gluten-free"],
    ingredients: [
      "1 cup quinoa",
      "1 roasted sweet potato",
      "1/2 cup purple cabbage",
      "1 cup kale, massaged",
      "1/4 cup edamame",
      "2 tbsp tahini",
      "1 tbsp lemon juice",
      "1 tsp maple syrup",
      "Hemp seeds"
    ],
    instructions: "Arrange all vegetables and quinoa in a bowl. Whisk tahini with lemon juice and maple syrup. Drizzle over bowl and sprinkle hemp seeds.",
    prepTime: "25 minutes",
    difficulty: "Medium",
    nutrition: {
      calories: 480,
      protein: "18g",
      carbs: "62g",
      fat: "18g",
      fiber: "14g"
    },
    premium: true,
    description: "Nutrient-dense rainbow bowl with complete amino acid profile"
  },
  {
    id: 'lunch_premium_3',
    title: "Bacon & Egg Muffin",
    category: "Lunch",
    dietary: ["gluten-free option", "dairy-free option"],
    ingredients: [
      "1 English muffin (or gluten-free version)",
      "1 egg",
      "1-2 slices bacon (or turkey bacon)",
      "Butter or oil for cooking",
      "Salt & pepper"
    ],
    instructions: "Toast muffin. Cook bacon until crispy. Fry or scramble the egg. Assemble sandwich: bottom muffin, egg, bacon, top muffin. Season and serve warm.",
    prepTime: "15 minutes",
    difficulty: "Easy",
    nutrition: {
      calories: 400,
      protein: "20g",
      carbs: "28g",
      fat: "24g",
      fiber: "2g"
    },
    premium: true,
    description: "Classic breakfast sandwich perfect for lunch with crispy bacon and fresh egg"
  },

  // FREE DINNER RECIPES
  {
    id: 'dinner_1',
    title: "Lemon Herb Baked Salmon",
    category: "Dinner",
    dietary: ["gluten-free", "nut-free"],
    ingredients: [
      "4 oz salmon fillet",
      "1 lemon, sliced",
      "2 tbsp olive oil",
      "Fresh dill",
      "Salt and pepper",
      "2 cups roasted vegetables"
    ],
    instructions: "Season salmon with herbs, salt, and pepper. Bake at 400°F for 12-15 minutes with lemon slices. Serve with roasted vegetables.",
    prepTime: "20 minutes",
    difficulty: "Easy",
    nutrition: {
      calories: 420,
      protein: "35g",
      carbs: "15g",
      fat: "26g",
      fiber: "5g"
    },
    premium: false,
    description: "Heart-healthy salmon with omega-3 fatty acids and fresh herbs"
  },

  // PREMIUM DINNER RECIPES
  {
    id: 'dinner_premium_1',
    title: "Miso-Glazed Black Cod with Shiitake",
    category: "Dinner",
    dietary: ["gluten-free", "dairy-free"],
    ingredients: [
      "4 oz black cod fillet",
      "2 tbsp white miso paste",
      "1 tbsp mirin",
      "1 tsp sesame oil",
      "4 oz shiitake mushrooms",
      "Baby bok choy",
      "Microgreens",
      "Black sesame seeds"
    ],
    instructions: "Marinate cod in miso, mirin, and sesame oil for 30 minutes. Broil 8 minutes. Sauté shiitakes and bok choy. Garnish with microgreens and sesame seeds.",
    prepTime: "45 minutes",
    difficulty: "Hard",
    nutrition: {
      calories: 350,
      protein: "32g",
      carbs: "12g",
      fat: "20g",
      fiber: "4g"
    },
    premium: true,
    description: "Restaurant-quality Japanese-inspired fish with umami-rich miso glaze"
  },
  {
    id: 'dinner_premium_2',
    title: "Truffle Mushroom Risotto",
    category: "Dinner",
    dietary: ["vegetarian", "nut-free"],
    ingredients: [
      "1 cup Arborio rice",
      "4 cups warm vegetable broth",
      "1/2 cup white wine",
      "Mixed wild mushrooms",
      "2 tbsp truffle oil",
      "1/4 cup Parmesan cheese",
      "Fresh thyme",
      "Truffle shavings"
    ],
    instructions: "Sauté mushrooms. Toast rice, add wine, then gradually add warm broth stirring constantly. Finish with truffle oil, Parmesan, and fresh herbs.",
    prepTime: "40 minutes",
    difficulty: "Hard",
    nutrition: {
      calories: 480,
      protein: "12g",
      carbs: "72g",
      fat: "16g",
      fiber: "3g"
    },
    premium: true,
    description: "Luxurious Italian risotto with earthy mushrooms and aromatic truffle"
  },
  {
    id: 'dinner_premium_3',
    title: "French-Inspired Beef & Mash",
    category: "Dinner",
    dietary: ["gluten-free", "dairy-free option"],
    ingredients: [
      "2 boneless beef short ribs or flat-iron steaks (or 1lb chuck roast)",
      "1 tbsp olive oil",
      "Salt & pepper",
      "1 tsp garlic powder",
      "1 tbsp balsamic vinegar (optional)",
      "2 medium potatoes, peeled and cubed",
      "1 tbsp butter (or olive oil)",
      "1/4 cup milk or oat milk",
      "1 cup sliced mushrooms",
      "1/2 cup shredded carrots",
      "1 clove garlic, minced",
      "1/2 cup red wine or grape juice",
      "1/2 cup beef broth",
      "1 tsp Dijon mustard",
      "1 tsp cornstarch + 1 tbsp water",
      "Chopped parsley or crispy onions (optional)"
    ],
    instructions: "Boil potatoes in salted water (~15 min) until tender. Season and sear beef until browned (2–3 min/side), then braise with splash of balsamic (5–10 min). Simmer wine, broth, and mustard for sauce. Add cornstarch slurry to thicken. Season. Sauté mushrooms and carrots with garlic until golden (~5–7 min). Mash cooked potatoes with butter and milk. Season to taste. Assemble plate: mash base, beef on top, veggies on side. Drizzle with sauce and garnish.",
    prepTime: "30 minutes",
    difficulty: "Medium",
    nutrition: {
      calories: 650,
      protein: "42g",
      carbs: "38g",
      fat: "32g",
      fiber: "6g"
    },
    premium: true,
    description: "Restaurant-quality French-inspired beef with creamy mashed potatoes and rich red wine sauce"
  },

  // FREE SNACKS
  {
    id: 'snack_1',
    title: "Apple Slices with Almond Butter",
    category: "Snacks",
    dietary: ["vegan", "gluten-free"],
    ingredients: [
      "1 large apple, sliced",
      "2 tbsp almond butter",
      "1 tsp cinnamon",
      "1 tbsp chopped walnuts"
    ],
    instructions: "Slice apple and arrange on plate. Serve with almond butter for dipping. Sprinkle with cinnamon and walnuts.",
    prepTime: "5 minutes",
    difficulty: "Easy",
    nutrition: {
      calories: 280,
      protein: "8g",
      carbs: "32g",
      fat: "16g",
      fiber: "8g"
    },
    premium: false,
    description: "Simple, satisfying snack with healthy fats and fiber"
  },

  // PREMIUM SNACKS
  {
    id: 'snack_premium_1',
    title: "Goji Berry Energy Balls",
    category: "Snacks",
    dietary: ["vegan", "gluten-free"],
    ingredients: [
      "1 cup Medjool dates, pitted",
      "1/2 cup raw almonds",
      "2 tbsp goji berries",
      "1 tbsp cacao powder",
      "1 tsp vanilla extract",
      "Pinch of sea salt",
      "Coconut flakes for rolling"
    ],
    instructions: "Process dates and almonds in food processor. Add goji berries, cacao, vanilla, and salt. Form into balls and roll in coconut flakes. Chill 30 minutes.",
    prepTime: "20 minutes",
    difficulty: "Medium",
    nutrition: {
      calories: 150,
      protein: "4g",
      carbs: "22g",
      fat: "6g",
      fiber: "4g"
    },
    premium: true,
    description: "Antioxidant-rich energy balls with superfood goji berries"
  },

  // FREE SMOOTHIES
  {
    id: 'smoothie_1',
    title: "Green Goddess Smoothie",
    category: "Smoothies",
    dietary: ["vegan", "nut-free"],
    ingredients: [
      "1 cup spinach",
      "1/2 banana",
      "1/2 avocado",
      "1 cup coconut water",
      "1 tbsp lime juice",
      "1 tsp fresh ginger"
    ],
    instructions: "Blend all ingredients until smooth and creamy. Add ice if desired. Serve immediately.",
    prepTime: "5 minutes",
    difficulty: "Easy",
    nutrition: {
      calories: 220,
      protein: "4g",
      carbs: "28g",
      fat: "12g",
      fiber: "8g"
    },
    premium: false,
    description: "Nutrient-packed green smoothie with healthy fats from avocado"
  },

  // PREMIUM SMOOTHIES
  {
    id: 'smoothie_premium_1',
    title: "Adaptogenic Chocolate Smoothie",
    category: "Smoothies",
    dietary: ["vegan", "keto-friendly"],
    ingredients: [
      "1 cup cashew milk",
      "1/2 avocado",
      "2 tbsp cacao powder",
      "1 tsp ashwagandha powder",
      "1 tsp maca powder",
      "1 tbsp almond butter",
      "1 tsp monk fruit sweetener",
      "Ice cubes"
    ],
    instructions: "Blend all ingredients until creamy and smooth. The adaptogens help with stress management while providing rich chocolate flavor.",
    prepTime: "8 minutes",
    difficulty: "Medium",
    nutrition: {
      calories: 320,
      protein: "8g",
      carbs: "16g",
      fat: "28g",
      fiber: "10g"
    },
    premium: true,
    description: "Stress-supporting smoothie with adaptogens and rich chocolate flavor"
  },

  // PREMIUM DESSERTS
  {
    id: 'dessert_premium_1',
    title: "Mug Chocolate Chip Cookie",
    category: "Desserts",
    dietary: ["vegetarian", "gluten-free option"],
    ingredients: [
      "2 tbsp butter or vegan butter",
      "2 tbsp sugar (brown or coconut)",
      "1 egg or flax egg",
      "1/4 tsp vanilla extract",
      "4 tbsp flour (regular or gluten-free)",
      "Pinch of salt",
      "2 tbsp chocolate chips"
    ],
    instructions: "Melt butter in mug (~20 sec in microwave). Mix in sugar, egg, and vanilla. Add flour, salt, chocolate chips; stir gently. Microwave 45–60 seconds until cooked. Let cool slightly and enjoy.",
    prepTime: "5 minutes",
    difficulty: "Easy",
    nutrition: {
      calories: 300,
      protein: "6g",
      carbs: "36g",
      fat: "15g",
      fiber: "2g"
    },
    premium: true,
    description: "Quick single-serving cookie made in the microwave for instant satisfaction"
  },
  {
    id: 'dessert_premium_2',
    title: "Chocolate Date Truffles",
    category: "Desserts",
    dietary: ["vegan", "gluten-free", "no-bake"],
    ingredients: [
      "1 cup Medjool dates (pitted, ~10 dates)",
      "1/2 cup almond butter or peanut butter",
      "1/4 cup unsweetened cocoa powder",
      "1 tsp vanilla extract",
      "Pinch of sea salt",
      "Optional: 1–2 tsp espresso powder",
      "Optional: 1 tsp orange zest",
      "Optional: extra cocoa or coconut for coating"
    ],
    instructions: "If dates are dry, soak in warm water for 10 minutes, then drain. Add dates, nut butter, cocoa powder, vanilla, and salt to food processor. Blend until smooth and dough-like. Scoop 1 Tbsp portions and roll into balls. Optional: roll in cocoa powder or coconut. Chill for 15–30 minutes to set.",
    prepTime: "20 minutes",
    difficulty: "Easy",
    nutrition: {
      calories: 85,
      protein: "2g",
      carbs: "12g",
      fat: "4g",
      fiber: "3g"
    },
    premium: true,
    description: "No-bake vegan energy balls made with Medjool dates and cocoa"
  },
  {
    id: 'dessert_premium_3',
    title: "Macadamia Nut Chocolate Chip Cookies",
    category: "Desserts",
    dietary: ["vegetarian"],
    ingredients: [
      "1 1/4 cups all-purpose flour",
      "1/2 tsp baking soda",
      "3/4 tsp salt",
      "1/2 cup unsalted butter, softened",
      "1/3 cup light brown sugar",
      "2 Tbsp granulated sugar",
      "1 large egg",
      "1 1/2 tsp vanilla extract",
      "3/4 cup chopped macadamia nuts",
      "3/4 cup dark chocolate chips"
    ],
    instructions: "Preheat oven to 375°F and line baking sheet with parchment. Whisk flour, baking soda, and salt. Cream butter and sugars until fluffy. Beat in egg and vanilla. Add dry ingredients until just combined. Fold in nuts and chocolate chips. Scoop onto baking sheet. Bake 10–12 minutes until edges are golden.",
    prepTime: "25 minutes",
    difficulty: "Medium",
    nutrition: {
      calories: 220,
      protein: "3g",
      carbs: "26g",
      fat: "12g",
      fiber: "2g"
    },
    premium: true,
    description: "Classic homemade cookies with premium macadamia nuts and dark chocolate"
  }
];

// Helper functions
export const getFreeRecipes = (): Recipe[] => {
  return recipes.filter(recipe => !recipe.premium);
};

export const getPremiumRecipes = (): Recipe[] => {
  return recipes.filter(recipe => recipe.premium);
};

export const getRecipesByCategory = (category: string, isPremium: boolean = false): Recipe[] => {
  return recipes.filter(recipe => 
    recipe.category === category && (isPremium || !recipe.premium)
  );
};

export const getAvailableRecipes = (isPremium: boolean): Recipe[] => {
  if (isPremium) {
    return recipes;
  }
  return getFreeRecipes();
};