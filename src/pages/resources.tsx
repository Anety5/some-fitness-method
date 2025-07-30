import { useState } from "react";

import BotanicalDecorations from "@/components/botanical-decorations";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ExternalLink, BookOpen, Brain, Heart, Moon, Activity, Wind, Apple, Dumbbell, ArrowLeft, ChevronDown, ChevronRight, ShoppingBag, Star, Info } from "lucide-react";
import { Link } from "wouter";

import AboutSOME from "@/components/AboutSOME";

export default function Resources() {
  const [activeTab, setActiveTab] = useState("about");
  const [activeResearchTab, setActiveResearchTab] = useState("sleep");
  const [expandedImage, setExpandedImage] = useState<string | null>(null);
  const [openResearchSections, setOpenResearchSections] = useState<Record<string, boolean>>({
    sleep: false,
    meditation: false,
    breathing: false,
    exercise: false,
    nutrition: false
  });

  const toggleResearchSection = (section: string) => {
    setOpenResearchSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Categorized research studies
  const researchCategories = {
    sleep: [
      {
        title: "Resetting the late timing of 'night owls' has a positive impact on mental health and performance",
        journal: "Sleep Medicine",
        year: "2019",
        url: "https://pubmed.ncbi.nlm.nih.gov/31202686/",
        summary: "Evidence-based study demonstrating how simple lifestyle changes (light exposure, meal timing, exercise) can shift circadian rhythms by 2 hours and significantly improve depression, stress, and cognitive performance"
      },
      {
        title: "Acoustic Enhancement of Sleep Slow Oscillations and Memory in Older Adults",
        journal: "Frontiers in Human Neuroscience",
        year: "2017",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC5340797/",
        summary: "Pink noise enhances deep sleep and memory consolidation in older adults"
      },
      {
        title: "Progressive Muscle Relaxation Increases Slow-Wave Sleep",
        journal: "PMC Sleep Research",
        year: "2022",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9786620/",
        summary: "Progressive muscle relaxation increases slow-wave sleep duration by 125% compared to control groups"
      },
      {
        title: "Effects of Mindfulness on Healthcare Workers Sleep and Anxiety",
        journal: "PMC Occupational Health",
        year: "2024",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC11091277/",
        summary: "Mindfulness-based interventions significantly reduce sleep impairment and anxiety in healthcare workers"
      },
      {
        title: "Progressive Muscle Relaxation Effects on Fatigue and Sleep Quality",
        journal: "PMC Multiple Sclerosis",
        year: "2012",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3469207/",
        summary: "PMR exercises effectively reduce fatigue and improve sleep quality in chronic conditions"
      }
    ],
    meditation: [
      {
        title: "Mindfulness-Based Stress Reduction: A Non-Pharmacological Approach",
        journal: "PMC Chronic Illness",
        year: "2012",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3336928/",
        summary: "MBSR therapy effectively treats depression, anxiety, chronic pain, and improves immune function"
      },
      {
        title: "Meditation Programs for Psychological Stress and Well-being",
        journal: "JAMA Internal Medicine",
        year: "2014",
        url: "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC4142584/",
        summary: "Meditation programs improve anxiety, depression, and sleep quality with measurable brain changes"
      }
    ],
    breathing: [
      {
        title: "Progressive Muscle Relaxation for Psychological and Physiological States",
        journal: "PMC Complementary Medicine",
        year: "2021",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC8272667/",
        summary: "PMR with deep breathing effectively promotes relaxation and reduces physiological stress markers"
      },
      {
        title: "Breathwork Interventions for Adults with Clinically Diagnosed Anxiety Disorders: A Scoping Review",
        journal: "PMC Brain Sciences",
        year: "2023",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC9954474/",
        summary: "Comprehensive scoping review of 16 studies showing 75% of breathing interventions significantly reduced stress and anxiety with sustained benefits over time"
      },
      {
        title: "Mayo Clinic - 10 Breath Practice for Immediate Stress Relief",
        journal: "Mayo Clinic",
        year: "2024",
        url: "https://www.mayoclinic.org/healthy-lifestyle/stress-management/in-depth/relaxation-technique/art-20045368",
        summary: "Quick 10-breath technique for immediate stress reduction and mental clarity"
      }
    ],
    exercise: [
      {
        title: "Current Concepts in Muscle Stretching for Exercise and Rehabilitation",
        journal: "PMC Sports Health",
        year: "2012",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3273886/",
        summary: "APTA-endorsed research showing daily stretching improves flexibility, reduces pain, and supports injury prevention through proper technique and timing"
      },
      {
        title: "Interventions for the Management of Acute and Chronic Low Back Pain: Revision 2021",
        journal: "JOSPT Clinical Practice Guidelines",
        year: "2021", 
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10508241/",
        summary: "JOSPT guidelines recommend active treatments including stretching, yoga, and strengthening for chronic pain management with proven effectiveness"
      }
    ],
    nutrition: [
      {
        title: "Does Food Intake Mediate the Association Between Mindful Eating and Change in Depressive Symptoms?",
        journal: "PMC Nutrition Research",
        year: "2023",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC10200545/",
        summary: "Mindful eating practices improve diet quality, reduce emotional eating, and significantly reduce depressive symptoms through better eating regulation"
      },
      {
        title: "Mediterranean Diet and its Benefits on Health and Mental Health: A Literature Review",
        journal: "PMC Nutrients",
        year: "2020",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC7536728/",
        summary: "Mediterranean diet patterns significantly reduce depression and anxiety while improving cognitive function through anti-inflammatory nutrients and polyphenols"
      }
    ]
  };



  const affiliateProducts = [
    {
      id: 1,
      name: "Fitbit Sense 2 Advanced Health & Fitness Smartwatch with Tools to Manage Stress and Sleep",
      category: "Fitness Tracker",
      price: "$234.51",
      rating: 4.2,
      image: "https://m.media-amazon.com/images/I/51GeUyZUB9L._AC_SL500_.jpg",
      description: "Advanced health and fitness smartwatch with tools to manage stress and sleep, ECG app, SpO2, 24/7 heart rate and GPS. Shadow Grey/Graphite with both S & L bands included. Perfect for comprehensive S.O.M.E method tracking with 4K+ monthly sales.",
      features: ["Stress Management", "ECG App", "SpO2 Monitoring", "24/7 Heart Rate", "Built-in GPS", "Sleep Tools"],
      amazonUrl: "https://amazon.com/dp/B0B4N2T7GL?tag=somefitness-20"
    },
    {
      id: 2,
      name: "Gaiam Print Yoga Mat - Non Slip Exercise & Fitness Mat",
      category: "Yoga & Meditation",
      price: "$14.43",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/715di42jxvL._AC_SX425_.jpg",
      description: "Non-slip printed yoga mat perfect for yoga, Pilates, and floor exercises. Amazon's Choice with 42% savings off list price.",
      features: ["Non-Slip Surface", "Multiple Print Designs", "Lightweight", "Easy to Clean", "All Exercise Types"],
      amazonUrl: "https://amazon.com/dp/B01MY5MZSQ?tag=somefitness-20"
    },
    {
      id: 3,
      name: "Amazon Basics 1/2 Inch Extra Thick Exercise Yoga Mat",
      category: "Yoga & Meditation", 
      price: "$21.98",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/71U3oP3IqsL._AC_SX679_.jpg",
      description: "Extra thick exercise yoga mat with carrying strap and cushioned support. Amazon's Choice with over 104,000 reviews. Perfect for fitness and gym workouts.",
      features: ["1/2 Inch Thick", "Textured Foam", "Carrying Strap", "74x24 Inches", "Shock Absorption"],
      amazonUrl: "https://amazon.com/dp/B01LP0UX9G?tag=somefitness-20"
    },
    {
      id: 4,
      name: "Suoman 4-Pack Screen Protector Case for Fitbit Sense 2/Versa 4",
      category: "Smartwatch Accessories",
      price: "$9.99",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/71FsjTJaI6L._AC_SX679_.jpg",
      description: "Complete protection kit with 4 TPU bumper cases for Fitbit Sense 2/Versa 4. Amazon's Choice with full-around screen protection and multiple color options.",
      features: ["4-Pack Value", "TPU Screen Protection", "Multiple Colors", "Easy Installation", "Precise Cutouts"],
      amazonUrl: "https://amazon.com/dp/B0B4JMWPCF?tag=somefitness-20"
    },
    {
      id: 5,
      name: "Fitbit Inspire 3 Health & Fitness Tracker",
      category: "Fitness Trackers",
      price: "$79.95",
      rating: 4.3,
      image: "https://m.media-amazon.com/images/I/61p11x8jDaL._AC_SL1500_.jpg",
      description: "Affordable fitness tracker with stress management, workout intensity tracking, and 10-day battery life. Perfect entry-level S.O.M.E method companion.",
      features: ["10-Day Battery", "Stress Management", "Workout Intensity", "Sleep Score", "24/7 Heart Rate", "Water Resistant"],
      amazonUrl: "https://amazon.com/dp/B0B5F9SZW7?tag=somefitness-20"
    },
    {
      id: 6,
      name: "Saucony Women's Excursion Tr16 Trail Running Sneaker",
      category: "Athletic Footwear",
      price: "$52.46",
      rating: 4.3,
      image: "https://m.media-amazon.com/images/I/71Jq437MuqL._AC_SX395_.jpg",
      description: "Women's trail running sneakers with VERSARUN cushioning and grippy carbon-rubber lugs. Perfect for outdoor activities and Move component of S.O.M.E method.",
      features: ["VERSARUN Cushioning", "Carbon-Rubber Lugs", "Trail Protection", "Multiple Colors", "Balanced Comfort", "Grippy Traction"],
      amazonUrl: "https://amazon.com/dp/B09L9DMYDW?tag=somefitness-20"
    },

    {
      id: 8,
      name: "Saucony Men's Excursion Tr14 Trail Running Shoe",
      category: "Athletic Footwear",
      price: "$59.95",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/81H4NTGc3sL._AC_SX395_.jpg",
      description: "Men's trail running shoes with VERSARUN cushioning and carbon rubber outsole. Features trail-specific mesh with supportive overlays for all-terrain performance.",
      features: ["VERSARUN Cushioning", "Carbon Rubber Outsole", "Trail-Specific Mesh", "Supportive Overlays", "Multiple Colors", "Rock-Solid Footing"],
      amazonUrl: "https://amazon.com/dp/B08CGP96YH?tag=somefitness-20"
    },
    {
      id: 9,
      name: "New Balance Men's 410 V8 Trail Running Shoe",
      category: "Athletic Footwear",
      price: "$54.99",
      rating: 4.3,
      image: "https://m.media-amazon.com/images/I/51p3i4VgDdL._AC_SY500_.jpg",
      description: "#1 Best Seller in Men's Trail Running. Features AT Tread outsole, BIO Foam midsole, and synthetic upper for versatile on/off-road performance.",
      features: ["AT Tread Outsole", "BIO Foam Midsole", "Synthetic Upper", "Durable Overlays", "Versatile Traction", "#1 Best Seller"],
      amazonUrl: "https://amazon.com/dp/B0BJ7JWSS9?tag=somefitness-20"
    },
    {
      id: 57,
      name: "OluKai Men's Sneakers - Premium Hawaiian Athletic Shoes",
      category: "Athletic Footwear",
      price: "$120.00",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/71QJ0sYKvyL._AC_SL1500_.jpg",
      description: "Premium Hawaiian athletic sneakers from OluKai with superior comfort and island-inspired design. Breathable construction with supportive footbed for all-day wear. Perfect for fitness activities, walking, and casual wear. Made with Hawaiian craftsmanship and attention to detail.",
      features: ["Hawaiian Craftsmanship", "Athletic Design", "Breathable Construction", "Supportive Footbed", "All-Day Comfort", "Premium Quality"],
      amazonUrl: "https://amzn.to/4578aNs"
    },
    {
      id: 10,
      name: "Willit Women's UPF 50+ Sun Protection Hoodie",
      category: "Outdoor Apparel",
      price: "$19.99",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/616FtKM05hL._AC_SY445_.jpg",
      description: "Lightweight sun protection hoodie perfect for outdoor activities. Features UPF 50+ UV protection, moisture-wicking fabric, and eco-friendly recycled materials.",
      features: ["UPF 50+ Protection", "Moisture-Wicking", "Recycled Materials", "Thumb Holes", "Flat Lock Seams", "Machine Washable"],
      amazonUrl: "https://amazon.com/dp/B07TKDGHJ8?tag=somefitness-20"
    },
    {
      id: 11,
      name: "NORTHYARD Men's Athletic Running Shorts",
      category: "Athletic Apparel",
      price: "$24.99",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/61MTvyrS5WL._AC_SY500_.jpg",
      description: "#1 Best Seller in Men's Running Shorts. Quick-dry lightweight shorts with UPF 50+ protection, 3 zipper pockets, and 4-way stretch fabric for ultimate mobility.",
      features: ["#1 Best Seller", "Quick-Dry Fabric", "UPF 50+ Protection", "3 Zipper Pockets", "4-Way Stretch", "Multiple Lengths"],
      amazonUrl: "https://amazon.com/dp/B09P3RHNSY?tag=somefitness-20"
    },
    {
      id: 12,
      name: "G Gradual Men's Running Shorts with Zipper Pockets",
      category: "Athletic Apparel",
      price: "$14.99",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/91Pj7slKkCL._AC_SX425_.jpg",
      description: "Budget-friendly 5-inch running shorts with deep zipper pockets. Features quick-dry fabric, elastic waistband with drawcord, and split-leg design for enhanced mobility.",
      features: ["Quick-Dry Fabric", "2 Zipper Pockets", "Elastic Waistband", "Split-Leg Design", "Multiple Colors", "25% Off Sale"],
      amazonUrl: "https://amazon.com/dp/B09PYQS6MH?tag=somefitness-20"
    },
    {
      id: 13,
      name: "THE GYM PEOPLE Women's High Waist Workout Shorts",
      category: "Athletic Apparel",
      price: "$16.99",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/51fHtX-w-sL._AC_SX385_.jpg",
      description: "High-waisted women's workout shorts with tummy control design. Features dolphin split design, moisture-wicking fabric, and deep side pockets for phone storage.",
      features: ["Tummy Control", "High-Waisted", "2 Side Pockets", "Dolphin Split", "30K+ Reviews", "26% Off Sale"],
      amazonUrl: "https://amazon.com/dp/B07QN3K2XN?tag=somefitness-20"
    },
    {
      id: 14,
      name: "OPTP The Original Stretch Out Strap with Exercise Book",
      category: "Exercise Equipment",
      price: "$15.95",
      rating: 4.7,
      image: "https://m.media-amazon.com/images/I/719dg2bMHvL._AC_SX425_.jpg",
      description: "Original stretch out strap for flexibility and mobility exercises. Perfect for physical therapy, yoga stretching, and knee therapy. Made in USA with exercise book included.",
      features: ["Made in USA", "Exercise Book Included", "Physical Therapy Use", "Amazon's Choice", "26K+ Reviews", "11% Off"],
      amazonUrl: "https://amazon.com/dp/B00065X222?tag=somefitness-20"
    },
    {
      id: 15,
      name: "Oura Ring Gen 4 - Advanced Health & Sleep Tracking Wearable",
      category: "Fitness Tracker",
      price: "$349.00",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/61Sz7FP9s5L._AC_SL1500_.jpg",
      description: "Revolutionary smart ring with advanced health tracking, sleep analysis, heart rate monitoring, and recovery insights. Premium wearable technology for comprehensive wellness tracking. FSA/HSA eligible.",
      features: ["Sleep Analysis", "Heart Rate Tracking", "Recovery Insights", "FSA/HSA Eligible", "Premium Technology", "Discreet Design"],
      amazonUrl: "https://amazon.com/dp/B0D9WT1S2T?tag=somefitness-20"
    },
    {
      id: 16,
      name: "Samsung Galaxy Fit 3 - Health Connect Compatible Fitness Tracker",
      category: "Fitness Tracker",
      price: "$51.72",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/61uy7aJ5GhL._AC_SL1500_.jpg",
      description: "Budget-friendly fitness tracker with Health Connect integration via Samsung Health. Features 1.6\" AMOLED display, 14-day battery life, 100+ workout modes, and comprehensive sleep tracking. Perfect Android compatibility with international model.",
      features: ["1.6\" AMOLED Display", "14-Day Battery", "100+ Workout Modes", "Health Connect Compatible", "Sleep Tracking", "Android Integration"],
      amazonUrl: "https://amazon.com/dp/B0CW3VWC3X?tag=somefitness-20"
    },
    {
      id: 17,
      name: "Garmin Forerunner 265 - Premium Running Smartwatch",
      category: "Fitness Tracker",
      price: "$439.00",
      rating: 4.7,
      image: "https://m.media-amazon.com/images/I/71W+S88m5JL._AC_SL500_.jpg",
      description: "Premium running smartwatch with colorful AMOLED display, training metrics, and recovery insights. Black and Powder Gray design with advanced GPS and performance analytics for serious athletes. Amazon's Choice with 1K+ monthly sales.",
      features: ["Colorful AMOLED Display", "Training Metrics", "Recovery Insights", "Advanced GPS", "Amazon's Choice", "1K+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B0BS1T9J4Y?tag=somefitness-20"
    },
    {
      id: 18,
      name: "Google Pixel Watch 2 - Native Health Connect Integration",
      category: "Fitness Tracker",
      price: "$229.00",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/61E0OpkdwDL._AC_SL1500_.jpg",
      description: "Google's flagship smartwatch with native Health Connect integration and Fitbit features. Best-in-class Google ecosystem integration with comprehensive health tracking and seamless Android compatibility. Premium Google technology.",
      features: ["Native Health Connect", "Fitbit Integration", "Google Ecosystem", "Comprehensive Tracking", "Android Optimized", "Premium Google Tech"],
      amazonUrl: "https://amazon.com/dp/B0CCQ6SWQN?tag=somefitness-20"
    },
    {
      id: 19,
      name: "Amazon Basics Cast Iron Kettlebell - 25 Pounds",
      category: "Exercise Equipment",
      price: "$29.99",
      rating: 4.8,
      image: "https://m.media-amazon.com/images/I/71BU2P5yYzL._AC_SL1500_.jpg",
      description: "Amazon's Choice cast iron kettlebell with high-quality construction for strength training and full-body workouts. Perfect for home gyms and S.O.M.E method Move exercises. 3K+ monthly sales.",
      features: ["Amazon's Choice", "Cast Iron Construction", "Strength Training", "Full-Body Workouts", "Home Gym Essential", "3K+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B0731DWW5K?tag=somefitness-20"
    },
    {
      id: 20,
      name: "ASICS Women's Gel-Venture 10 Trail Running Shoes",
      category: "Athletic Footwear",
      price: "$64.95",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/71kUbHPy1uL._AC_SL1500_.jpg",
      description: "Amazon's Choice trail running shoes with GEL technology for superior impact absorption. Mesh upper for breathability, trail-specific outsole for grip. Perfect for S.O.M.E method Move activities. 100+ monthly sales.",
      features: ["Amazon's Choice", "GEL Technology", "Trail-Specific Outsole", "Mesh Upper", "AMPLIFOAM Cushioning", "100+ Monthly Sales"],
      amazonUrl: "https://amzn.to/458wHC2"
    },
    {
      id: 21,
      name: "Garmin vívoactive 5 Fitness Smartwatch with AMOLED Display",
      category: "Fitness Tracker",
      price: "$226.00",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/71vVOX8vL5L._AC_SL1500_.jpg",
      description: "Premium Garmin fitness smartwatch with bright AMOLED display and comprehensive health tracking. 30+ built-in sports apps, wheelchair mode, and GPS functionality. Health Connect compatibility expected mid-2025.",
      features: ["AMOLED Display", "30+ Sports Apps", "GPS Tracking", "Health Monitoring", "Wheelchair Compatible", "Premium Garmin Quality"],
      amazonUrl: "https://amzn.to/3H41WGg"
    },
    {
      id: 22,
      name: "Women's 5-Piece Workout Clothes Set - Athletic Exercise Outfits",
      category: "Athletic Apparel",
      price: "$41.99",
      rating: 4.2,
      image: "https://m.media-amazon.com/images/I/71O9IkEVH-L._AC_SL1500_.jpg",
      description: "Complete 5-piece athletic wear set including sports bra, t-shirt, shorts, leggings, and jacket. Soft, stretchy fabric (90% polyester, 10% spandex) for comfort during S.O.M.E method Move activities. 50+ monthly sales with 11% savings.",
      features: ["5-Piece Complete Set", "Soft & Stretchy Fabric", "Breathable Material", "Multi-Activity Use", "11% Savings", "50+ Monthly Sales"],
      amazonUrl: "https://amzn.to/3H516sQ"
    },
    {
      id: 23,
      name: "Superfeet All-Purpose Women's High Impact Support Insoles (Berry)",
      category: "Foot Health",
      price: "$59.95",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/81vA+6++MuL._AC_SL1500_.jpg",
      description: "Professional-grade orthotic arch support insoles for women's running shoes. Trim-to-fit design with high-impact foam forefoot and moisture-wicking top cover. Reduces stress on feet, ankles, knees, and back. 1K+ monthly sales.",
      features: ["Professional Grade", "Trim-to-Fit", "Orthotic Arch Support", "High-Impact Foam", "Moisture-Wicking", "1K+ Monthly Sales"],
      amazonUrl: "https://amzn.to/46vAg7M"
    },
    {
      id: 24,
      name: "Superfeet All-Purpose High Impact Support Insoles (Orange) - Unisex",
      category: "Foot Health",
      price: "$59.95",
      rating: 4.3,
      image: "https://m.media-amazon.com/images/I/81SgIDXQCKL._AC_SL1500_.jpg",
      description: "Professional-grade unisex orthotic arch support insoles for all-purpose and high-impact activities. Sculpted heel cup with stabilizer cap for long-lasting support. Made in USA. 700+ monthly sales.",
      features: ["Made in USA", "Unisex Design", "Sculpted Heel Cup", "Stabilizer Cap", "24/7 Use", "700+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B001FQJ2HU?tag=somefitness-20"
    },
    {
      id: 25,
      name: "Darn Tough Women's Run No Show Tab Ultra-Lightweight Running Socks",
      category: "Athletic Socks",
      price: "$18.95",
      rating: 4.8,
      image: "https://m.media-amazon.com/images/I/81N5REor4cL._AC_SL1500_.jpg",
      description: "Premium merino wool running socks made in Vermont with lifetime guarantee. 49% merino wool, 47% nylon, 4% lycra spandex for moisture-wicking and durability. True seamless technology for ultra-smooth feel. 100+ monthly sales.",
      features: ["Lifetime Guarantee", "Made in Vermont", "Merino Wool Blend", "True Seamless Tech", "Moisture-Wicking", "100+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B09LSL42WC?tag=somefitness-20"
    },
    {
      id: 26,
      name: "Darn Tough Vermont Women's Treeline Micro Crew Cushion Hiking Socks",
      category: "Athletic Socks",
      price: "$25.95",
      rating: 4.8,
      image: "https://m.media-amazon.com/images/I/91gOpiNFHyL._AC_SL1500_.jpg",
      description: "Premium midweight hiking socks with cushion made in Vermont. 63% merino wool, 35% nylon, 2% lycra spandex for all-weather performance. Micro crew height perfect for hiking boots. Lifetime guarantee. 50+ monthly sales.",
      features: ["Midweight Cushion", "Made in Vermont", "63% Merino Wool", "Micro Crew Height", "All-Weather Performance", "50+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B08MWXFPR5?tag=somefitness-20"
    },
    {
      id: 27,
      name: "Darn Tough Vermont Women's Mother Clucker Crew Lightweight with Cushion",
      category: "Athletic Socks",
      price: "$24.95",
      rating: 4.8,
      image: "https://m.media-amazon.com/images/I/81M8cuowNWL._AC_SL1500_.jpg",
      description: "Lightweight crew socks with whimsical design made in Vermont. 52% nylon, 45% merino wool, 3% lycra spandex for moisture-wicking comfort. True seamless toe technology. Perfect for casual wear. 50+ monthly sales.",
      features: ["Lightweight Cushion", "Made in Vermont", "Whimsical Design", "True Seamless Toe", "Moisture-Wicking", "50+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B0CRSXB79K?tag=somefitness-20"
    },
    {
      id: 28,
      name: "Darn Tough Hiker Midweight Micro Crew Sock with Cushion - Men's Hiking Socks",
      category: "Athletic Socks",
      price: "$25.95",
      rating: 4.8,
      image: "https://m.media-amazon.com/images/I/91wUzfnQw4S._AC_SL1500_.jpg",
      description: "Premium men's hiking socks made in Vermont with midweight cushion. 61% merino wool, 36% nylon, 3% lycra spandex for all-weather performance. Micro crew height perfect for hiking boots. Lifetime guarantee. 200+ monthly sales.",
      features: ["Midweight Cushion", "Made in Vermont", "61% Merino Wool", "Micro Crew Height", "All-Weather Performance", "200+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B001RJC56U?tag=somefitness-20"
    },
    {
      id: 29,
      name: "THE NORTH FACE Men's Waterproof Antora Rain Hoodie Jacket - PFAS Free",
      category: "Outdoor Apparel",
      price: "$120.00",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/61RLR+bl1nL._AC_SL1500_.jpg",
      description: "Premium waterproof rain jacket with DryVent 2L tech shell and non-PFC DWR finish. 100% recycled polyester ripstop construction. Seam-sealed, windproof, and breathable with adjustable 3-piece hood. PFAS-free sustainability.",
      features: ["DryVent 2L Tech Shell", "PFAS-Free", "100% Recycled Polyester", "Seam-Sealed Waterproof", "Adjustable Hood", "Windproof & Breathable"],
      amazonUrl: "https://amazon.com/dp/B0CNC5JXJD?tag=somefitness-20"
    },
    {
      id: 30,
      name: "NEALFIT Ankle Weights for Men Women Kids - Adjustable Leg Arm Wrist Weights",
      category: "Fitness Equipment",
      price: "$11.99-$20.99",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/71aSL5sk6fL._AC_SL1500_.jpg",
      description: "Versatile ankle/wrist weights made of soft mercerized cotton with moisture-absorbing interior. Adjustable strap closure for secure fit. Multiple weight options: 0.5-5 lbs per pair. Filled with high-quality iron sand. Reinforced stitching prevents leakage.",
      features: ["Adjustable Strap", "Multiple Weight Options", "Moisture-Absorbing", "High-Quality Iron Sand", "Reinforced Stitching", "Unisex Design"],
      amazonUrl: "https://amazon.com/dp/B099Z4F6JW?tag=somefitness-20"
    },
    {
      id: 31,
      name: "Amazon Basics Anti-Burst Exercise Ball with Pump - 23-26\" Diameter",
      category: "Fitness Equipment",
      price: "$21.84",
      rating: 4.9,
      image: "https://m.media-amazon.com/images/I/71bGq10q-6L._AC_SL1500_.jpg",
      description: "Versatile exercise ball for yoga, core strengthening, and low-impact exercises. Anti-burst construction with 600 lbs weight capacity. Non-slip textured surface for secure grip. Includes air pump. 23-26 inch diameter. Available in aqua and black colors.",
      features: ["Anti-Burst Construction", "600 LB Weight Capacity", "Non-Slip Textured Surface", "Includes Air Pump", "23-26\" Diameter", "Yoga & Core Training"],
      amazonUrl: "https://amazon.com/dp/B0DN5WQT68?tag=somefitness-20"
    },
    {
      id: 32,
      name: "QuickFit 3 Pack Exercise Poster Set - Dumbbell Workouts + Bodyweight + Stretching Charts",
      category: "Educational Materials",
      price: "$17.97",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/914SDcHxK9L._AC_SL1500_.jpg",
      description: "3-poster laminated workout chart set including dumbbell workouts, bodyweight exercises, and stretching routines. Made in USA with 3 MIL lamination for durability. 18\" x 24\" size. Amazon's Choice with 300+ monthly sales. Perfect for home gyms.",
      features: ["Made in USA", "3 MIL Lamination", "18\" x 24\" Size", "Tear Resistant", "Amazon's Choice", "300+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B0854L4YLF?tag=somefitness-20"
    },
    {
      id: 33,
      name: "Amazon Basics High Density Foam Roller for Exercise and Recovery",
      category: "Recovery Equipment",
      price: "$22.41",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/71RsfRgJK-L._AC_SL1500_.jpg",
      description: "#1 Best Seller in Foam Rollers with 114,866 reviews. High-density foam construction for deep tissue massage and muscle recovery. Perfect for physical therapy, post-workout recovery, and myofascial release. 2K+ monthly sales.",
      features: ["#1 Best Seller", "High Density Foam", "Deep Tissue Massage", "Muscle Recovery", "Physical Therapy", "2K+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B072J37MQJ?tag=somefitness-20"
    },
    {
      id: 34,
      name: "PhysFlex Compression Socks for Plantar Fasciitis & Achilles Tendonitis Relief",
      category: "Health Support",
      price: "$9.97",
      rating: 4.3,
      image: "https://m.media-amazon.com/images/I/81O9AJ5f8XL._AC_SL1500_.jpg",
      description: "Amazon's Choice compression ankle sleeves for plantar fasciitis, achilles tendonitis, heel spurs, and foot swelling relief. FSA/HSA eligible. 1 pair of arch support braces for everyday use. 10,835 customer reviews with sustainability features.",
      features: ["Amazon's Choice", "FSA/HSA Eligible", "Plantar Fasciitis Relief", "Achilles Support", "Heel Spurs", "Everyday Use"],
      amazonUrl: "https://amazon.com/dp/B09VMPDNZC?tag=somefitness-20"
    },

    {
      id: 36,
      name: "Sleeve Stars Ankle Brace for Women & Men - Compression Sleeve for Sprained Ankle & Plantar Fasciitis",
      category: "Health Support",
      price: "$18.95",
      rating: 4.2,
      image: "https://m.media-amazon.com/images/I/812wDQi+HwL._AC_SL1500_.jpg",
      description: "Customizable ankle support with removable strap for sprained ankle, plantar fasciitis relief, and injury prevention. OEKO-TEX STANDARD 100 certified with safer chemicals. 36,100+ reviews. Single brace with size S: 9\"-10\" ankle circumference.",
      features: ["OEKO-TEX Certified", "Removable Strap", "Customizable Support", "36,100+ Reviews", "Sprained Ankle Relief", "Plantar Fasciitis"],
      amazonUrl: "https://amazon.com/dp/B0F1N9KWBW?tag=somefitness-20"
    },
    {
      id: 37,
      name: "Loocio Tangle-Free Jump Rope with Ball Bearings - Adjustable Steel Cable for Fitness & Exercise",
      category: "Cardio Equipment",
      price: "$13.99",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/71GRNNpT8JL._AC_SL1500_.jpg",
      description: "Amazon's Choice jump rope with steel cable and ball bearings for tangle-free jumping. Ergonomic foam handles with non-slip grip. Adjustable length for all ages. Carbonfree Certified with 600+ monthly sales. 4.4/5 stars with 20,918 reviews.",
      features: ["Amazon's Choice", "Ball Bearings", "Tangle-Free", "Adjustable Length", "Carbonfree Certified", "600+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B09PH1TF3D?tag=somefitness-20"
    },
    {
      id: 38,
      name: "KastKing Skidaway Polarized Sport Sunglasses for Men and Women - UV Protection for Outdoor Activities",
      category: "Outdoor Gear",
      price: "$24.29",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/61ELUDIcocL._AC_SL1500_.jpg",
      description: "Premium polarized sport sunglasses ideal for driving, fishing, cycling, and running. UV protection with 19% limited time savings. 4.4/5 stars with 9,509 reviews. 400+ monthly sales. Perfect for outdoor fitness activities and sports.",
      features: ["Polarized Lenses", "UV Protection", "Sport Design", "Multi-Activity", "400+ Monthly Sales", "Limited Time Deal"],
      amazonUrl: "https://amazon.com/dp/B07DPJJK8F?tag=somefitness-20"
    },


    {
      id: 45,
      name: "Hook'Ya Hawaii Reef Compliant Mineral Sunscreen SPF 50 - Travel Size 2-Pack",
      category: "Personal Care",
      price: "$28.47",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/81Z+FID10TL._AC_SL1500_.jpg",
      description: "Premium reef-safe mineral sunscreen by Hook'Ya. 2-pack of 3oz travel bottles (6oz total). SPF 50 with 80-minute water resistance. Octinoxate & Oxybenzone free, non-nano formula. Perfect for extreme outdoor activities, fishing, and GPS tracking. Made in USA.",
      features: ["Hook'Ya Brand", "Reef Safe", "SPF 50", "80-Min Water Resistant", "Travel Size", "Made in USA"],
      amazonUrl: "https://amazon.com/dp/B0B88X2FK4?tag=somefitness-20"
    },

    // === DOG HIKING & OUTDOOR GEAR ===
    {
      id: 46,
      name: "ZAKAPAWS Silicone Dog Travel Bowl - 2 Pack Collapsible Pet Feeding Bowls",
      category: "Dog Outdoor Gear",
      price: "$12.99",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/61b+oZdBDSL._AC_SY355_.jpg",
      description: "Food-grade silicone travel bowls, BPA-free and eco-friendly. Folds flat to 0.6-inch thickness, expands to 28 fl oz capacity. Includes carabiner clips for backpack attachment. Two-handle design for balanced carrying. Perfect for hiking, GPS tracking, and outdoor adventures.",
      features: ["Food-Grade Silicone", "28 FL OZ Capacity", "Carabiner Clips", "Two-Handle Design", "7% Savings", "50+ Monthly Sales"],
      amazonUrl: "https://amazon.com/dp/B0B93TTT1X?tag=somefitness-20"
    },
    {
      id: 47,
      name: "Kurgo Tru-Fit Enhanced Strength Dog Harness - Crash Tested Car Safety Harness",
      category: "Dog Outdoor Gear",
      price: "$26.99",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/71uaj0SZsdL._AC_SX679_.jpg",
      description: "Crash tested car safety harness with enhanced strength design. No-pull harness includes pet safety seat belt for secure vehicle travel to hiking destinations. Professional grade construction for medium to large dogs. Essential for safe transport to GPS tracking adventures.",
      features: ["Crash Tested", "Enhanced Strength", "No-Pull Design", "Safety Seat Belt", "Professional Grade", "Medium-Large Dogs"],
      amazonUrl: "https://amazon.com/dp/B009CE8106?tag=somefitness-20"
    },
    {
      id: 48,
      name: "MYJAQI Back Seat Extender for Dogs - Waterproof Car Seat Cover with Hard Bottom",
      category: "Dog Outdoor Gear",
      price: "$89.99",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/81o2PkkMY-L._AC_SY355_.jpg",
      description: "2025 upgraded waterproof dog car seat cover with hard bottom platform. Anti-scratch protection, holds 400lbs capacity. OEKO-TEX STANDARD 100 certified safer materials. Amazon's Choice for secure vehicle travel to hiking destinations and GPS tracking adventures.",
      features: ["400 LB Capacity", "Hard Bottom", "Waterproof", "Anti-Scratch", "Amazon's Choice", "OEKO-TEX Certified"],
      amazonUrl: "https://amazon.com/dp/B0D9Y6X8K8?tag=somefitness-20"
    },
    {
      id: 49,
      name: "Rhino Wax Dog Paw Protector - Moisturizes, Heals, and Restores Elasticity",
      category: "Dog Outdoor Gear",
      price: "$16.95",
      rating: 4.7,
      image: "https://m.media-amazon.com/images/I/71RQN5V+HfL._AC_SL1500_.jpg",
      description: "Lick-safe paw balm that moisturizes, heals, and restores paw pad elasticity. Perfect for protecting paws during hiking and rough terrain GPS tracking adventures. Subscribe & Save option with up to 10% savings. Professional veterinary-grade formula for outdoor activity protection.",
      features: ["Lick-Safe Formula", "Moisturizes & Heals", "Restores Elasticity", "Subscribe & Save", "Veterinary-Grade", "Outdoor Protection"],
      amazonUrl: "https://amazon.com/dp/B0CST721R1?tag=somefitness-20"
    },
    {
      id: 50,
      name: "FIDA Durable Slip Lead - 6 FT x 1/2\" Heavy Duty Loop Leash with Reflective Threading",
      category: "Dog Outdoor Gear",
      price: "$13.99",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/81BWZkKUkzL._AC_SX425_.jpg",
      description: "Professional slip lead training leash with highly reflective threading for safety. 6ft x 1/2\" heavy duty rope for large and medium dogs. No-pull design perfect for hiking and GPS tracking adventures. Amazon's Choice with 22% savings. 1K+ monthly sales.",
      features: ["Amazon's Choice", "Highly Reflective", "No-Pull Design", "6 FT Length", "22% Savings", "12,965 Reviews"],
      amazonUrl: "https://amazon.com/dp/B08Y1SDD54?tag=somefitness-20"
    },
    {
      id: 51,
      name: "ARCA PET Dog First Aid Kit - 35-Piece Emergency Kit for Hiking & Outdoor Adventures",
      category: "Dog Outdoor Gear",
      price: "$19.95",
      rating: 4.8,
      image: "https://m.media-amazon.com/images/I/81YQs25G6VL._AC_SX425_.jpg",
      description: "Water-resistant, high-visibility reflective emergency pouch with 35 essential pieces. Includes antiseptic, tweezers, scissors, gloves, and first aid guide. Amazon's Choice with 700+ monthly sales. Compact and lightweight for hiking, camping, and GPS tracking adventures.",
      features: ["35-Piece Kit", "Water Resistant", "High Visibility", "Amazon's Choice", "700+ Monthly Sales", "Emergency Essentials"],
      amazonUrl: "https://amazon.com/dp/B097PLDD92?tag=somefitness-20"
    },
    {
      id: 52,
      name: "Kuoser Dog Cooling Vest Harness - Large Dog Cooler Jacket with Adjustable Buckle",
      category: "Dog Outdoor Gear",
      price: "$35.99",
      rating: 4.3,
      image: "https://m.media-amazon.com/images/I/714z7nQLXYL._AC_SY355_.jpg",
      description: "Professional cooling vest harness designed for large dogs during outdoor activities. Adjustable buckle system with temperature regulation technology. Perfect for hot weather hiking, beach visits, and extended GPS tracking adventures. Green color for high visibility.",
      features: ["Cooling Technology", "Adjustable Buckle", "Large Dog Design", "High Visibility", "Temperature Regulation", "Outdoor Activities"],
      amazonUrl: "https://amazon.com/dp/B0DP2M71HP?tag=somefitness-20"
    },
    {
      id: 54,
      name: "ECCOSOPHY Microfiber Beach Towel - Sand Free Quick Dry Lightweight Super Absorbent",
      category: "Travel & Outdoor",
      price: "$31.39",
      rating: 4.6,
      image: "https://m.media-amazon.com/images/I/A1j-lS3ao4L._AC_SX522_.jpg",
      description: "Premium microfiber beach towel perfect for pool, travel, cruise, and camping. Quick-dry technology, lightweight design, super absorbent material. Sand-free surface makes it ideal for beach activities and outdoor adventures. Oversized 71x35 inches for maximum coverage and comfort.",
      features: ["Quick Dry", "Sand Free", "Super Absorbent", "Lightweight", "Oversized 71x35in", "Travel Perfect"],
      amazonUrl: "https://amazon.com/dp/B07P9SK8C9?tag=somefitness-20"
    },
    {
      id: 55,
      name: "Pure Hawaiian Spirulina 500mg Tablets - 400 Count by Nutrex Hawaii",
      category: "Hawaii Specialties",
      price: "$30.99",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/61K7TcMGZML._AC_SX679_.jpg",
      description: "Pure Hawaiian Spirulina tablets from Nutrex Hawaii - premium superfood supplement grown in pristine Hawaiian waters. Rich in protein, vitamins, minerals, and antioxidants. Perfect for supporting energy, immune function, and overall wellness as part of the S.O.M.E method nutrition approach.",
      features: ["Pure Hawaiian", "500mg Tablets", "400 Count", "Rich in Protein", "Antioxidants", "Energy Support"],
      amazonUrl: "https://amzn.to/4oeoNjo"
    },
    {
      id: 56,
      name: "Kona Sea Salt Hawaii Magnesium - Pure Hawaiian Trace Minerals (2 oz)",
      category: "Hawaii Specialties",
      price: "$16.95",
      rating: 4.3,
      image: "https://m.media-amazon.com/images/I/61H8+wGi2AL._AC_SX679_.jpg",
      description: "Premium Kona Sea Salt Hawaii Magnesium - pure trace minerals extracted from pristine Hawaiian waters. Natural source of bioavailable magnesium and essential minerals. Supports muscle function, sleep quality, and overall wellness. Perfect for supplementing the S.O.M.E method approach to optimal health.",
      features: ["Pure Hawaiian", "Trace Minerals", "2 oz Bottle", "Bioavailable", "Muscle Support", "Sleep Quality"],
      amazonUrl: "https://amazon.com/dp/B0959SD3PB?tag=somefitness-20"
    },

    {
      id: 60,
      name: "Biotin 10,000mcg Hair Growth Vitamins - High Potency Biotin Supplements",
      category: "Nutrition Supplements",
      price: "$16.95",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/71dK2vQhL4L._AC_SL1500_.jpg",
      description: "High-potency biotin supplements for hair, skin, and nail health. 10,000mcg per capsule with 365 capsules per bottle for full year supply. Supports keratin production and overall wellness as part of the S.O.M.E method nutrition approach. Third-party tested for purity.",
      features: ["10,000mcg High Potency", "365 Capsules", "Hair Growth Support", "Skin & Nail Health", "Third-Party Tested", "Year Supply"],
      amazonUrl: "https://amzn.to/473HrUF"
    },
    {
      id: 61,
      name: "Women's Athletic Sneakers - Premium Comfort & Style",
      category: "Athletic Footwear",
      price: "$75.00",
      rating: 4.4,
      image: "https://m.media-amazon.com/images/I/71QJ0sYKvyL._AC_SL1500_.jpg",
      description: "Premium women's athletic sneakers designed for comfort and performance. Features breathable mesh upper, cushioned midsole, and durable rubber outsole. Perfect for fitness activities, walking, running, and casual wear. Available in multiple colors and sizes.",
      features: ["Breathable Mesh Upper", "Cushioned Midsole", "Durable Rubber Outsole", "Multiple Colors", "All-Day Comfort", "Versatile Design"],
      amazonUrl: "https://amzn.to/4md6pp5"
    },
    {
      id: 62,
      name: "Meditation Breathing Accessory - Mindfulness & Breath Training Tool",
      category: "Exercise Equipment",
      price: "$19.99",
      rating: 4.5,
      image: "https://m.media-amazon.com/images/I/71QJ0sYKvyL._AC_SL1500_.jpg",
      description: "Essential meditation breathing accessory designed to enhance mindfulness practice and breath training. Perfect for guided breathing exercises, meditation sessions, and stress relief. Supports proper breathing technique development and helps maintain focus during mindfulness practice. Ideal for beginners and experienced practitioners.",
      features: ["Breath Training Support", "Mindfulness Enhancement", "Stress Relief", "Beginner Friendly", "Portable Design", "Meditation Practice"],
      amazonUrl: "https://amzn.to/44NyzBg"
    }
  ];

  // Reorganized categories as requested by user
  const affiliateProductsByCategory = {
    "Foot Care": affiliateProducts.filter(p => 
      ["Foot Health", "Athletic Socks", "Athletic Footwear"].includes(p.category)
    ),
    "Equipment": affiliateProducts.filter(p => 
      ["Exercise Equipment", "Yoga & Meditation"].includes(p.category) ||
      p.name.includes("Stretch Out Strap") || p.name.includes("Exercise Ball") || 
      p.name.includes("Kettlebell") || p.name.includes("Yoga Mat")
    ),
    "Apparel": affiliateProducts.filter(p => 
      ["Athletic Apparel", "Outdoor Apparel"].includes(p.category) ||
      p.name.includes("Sun Protection Hoodie") || p.name.includes("Shorts") || 
      p.name.includes("Workout Clothes")
    ),
    "Sun Protection": affiliateProducts.filter(p => 
      ["Personal Care", "Hawaii Sunscreen"].includes(p.category) ||
      p.name.includes("Sunscreen") || p.name.includes("SPF")
    ),
    "Hawaiian Products": affiliateProducts.filter(p => 
      ["Hawaiian Products", "Hawaii Specialties"].includes(p.category) ||
      (p.name.includes("Hawaiian") && !p.name.includes("OluKai")) || p.name.includes("Kona") || p.name.includes("Magnesium")
    ),
    "Fitness Trackers": affiliateProducts.filter(p => 
      ["Fitness Tracker", "Smartwatch Accessories"].includes(p.category)
    ),
    "Dog Outdoor Gear": affiliateProducts.filter(p => 
      p.category === "Dog Outdoor Gear"
    )
  };



  return (
    <div className="relative min-h-screen bg-cover bg-center bg-no-repeat"
         style={{ 
           backgroundImage: `url('/images/tropical-day-coast.png')`,
           backgroundSize: 'cover',
           backgroundPosition: 'center center',
           imageRendering: 'auto'
         }}>
      {/* Clear overlay for contrast without blur */}
      <div className="absolute inset-0 bg-white/30"></div>
      <div className="relative min-h-screen">
      <BotanicalDecorations variant="page" elements={['fern', 'palm']} />
      
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="page-header">
            <div className="flex items-center gap-4 mb-4">
              <Link href="/">
                <Button className="bg-white/90 hover:bg-white text-gray-900 border border-gray-300 shadow-md font-semibold">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Wellness Resources</h1>
            <p className="text-lg text-gray-700">
              Evidence-based research, guides, and educational content for your wellness journey
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3 bg-white/90 border border-gray-300 h-14 p-1 gap-1">
              <TabsTrigger value="about" className="flex flex-col items-center justify-center gap-1 text-gray-900 font-semibold data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 px-2 py-2 text-xs">
                <Info className="w-4 h-4" />
                <span>About</span>
              </TabsTrigger>
              <TabsTrigger value="research" className="flex flex-col items-center justify-center gap-1 text-gray-900 font-semibold data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 px-2 py-2 text-xs">
                <BookOpen className="w-4 h-4" />
                <span>Research</span>
              </TabsTrigger>
              <TabsTrigger value="gear" className="flex flex-col items-center justify-center gap-1 text-gray-900 font-semibold data-[state=active]:bg-blue-100 data-[state=active]:text-blue-900 px-2 py-2 text-xs">
                <ShoppingBag className="w-4 h-4" />
                <span>Gear</span>
              </TabsTrigger>
            </TabsList>

            {/* About S.O.M.E. Tab */}
            <TabsContent value="about" className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-8 border border-gray-300 shadow-md">
                <AboutSOME />
              </div>
            </TabsContent>

            {/* Research Studies Tab */}
            <TabsContent value="research" className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-300 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Evidence-based Research</h3>
                <p className="text-gray-700 text-sm">
                  Peer-reviewed studies organized by wellness category. Click any section to explore the research.
                </p>
              </div>

              {/* Collapsible Research Sections */}
              <div className="space-y-3">
                {Object.entries(researchCategories).map(([category, studies]) => {
                  const categoryConfig = {
                    sleep: { icon: Moon, title: "Sleep", color: "bg-blue-50 border-blue-200" },
                    meditation: { icon: Brain, title: "Meditation", color: "bg-purple-50 border-purple-200" },
                    breathing: { icon: Wind, title: "Breathing", color: "bg-cyan-50 border-cyan-200" },
                    exercise: { icon: Dumbbell, title: "Exercise", color: "bg-green-50 border-green-200" },
                    nutrition: { icon: Apple, title: "Nutrition", color: "bg-orange-50 border-orange-200" }
                  };
                  
                  const config = categoryConfig[category as keyof typeof categoryConfig];
                  const IconComponent = config.icon;
                  
                  return (
                    <Collapsible
                      key={category}
                      open={openResearchSections[category]}
                      onOpenChange={() => toggleResearchSection(category)}
                    >
                      <CollapsibleTrigger asChild>
                        <Card className={`p-4 cursor-pointer hover:shadow-md transition-all duration-200 ${config.color} border-2`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-white/60 rounded-lg">
                                <IconComponent className="w-5 h-5 text-gray-700" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-800">{config.title}</h4>
                                <p className="text-sm text-gray-600">{studies.length} peer-reviewed studies</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-500">
                                {openResearchSections[category] ? 'Close' : 'View Research'}
                              </span>
                              {openResearchSections[category] ? (
                                <ChevronDown className="w-4 h-4 text-gray-600" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                              )}
                            </div>
                          </div>
                        </Card>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent className="mt-2">
                        <div className="grid gap-3 pl-4">
                          {studies.map((study, index) => (
                            <Card key={index} className="p-4 hover:shadow-md transition-shadow bg-white/95 backdrop-blur-sm border border-gray-200">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h5 className="font-medium text-gray-800 mb-1">{study.title}</h5>
                                  <p className="text-sm text-gray-600 mb-2">{study.summary}</p>
                                  <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span>{study.journal}</span>
                                    <span>{study.year}</span>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(study.url, '_blank')}
                                  className="ml-3 bg-white hover:bg-gray-50"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                </Button>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  );
                })}
              </div>
            </TabsContent>



            {/* Recommended Gear Tab */}
            <TabsContent value="gear" className="space-y-6">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 mb-6 border border-gray-300 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Recommended Wellness Gear</h3>
                <p className="text-gray-700 text-sm mb-4">
                  Curated fitness equipment and wellness tools to enhance your S.O.M.E method journey. 
                  Each product is carefully selected to complement our approach to Sleep, Oxygen, Move, and Eat.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-amber-800 text-sm mb-2">
                    <strong>Required FTC Disclosure:</strong> We earn commissions for purchases made through links on this page.
                  </p>
                  <p className="text-amber-800 text-xs">
                    <strong>Amazon Associate Statement:</strong> As an Amazon Associate I earn from qualifying purchases. 
                    S.O.M.E fitness method is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com.
                  </p>
                </div>
              </div>

              {/* Category Sections */}
              {Object.entries(affiliateProductsByCategory).map(([categoryName, products]) => (
                <div key={categoryName} className="mb-8">
                  <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                    {categoryName} ({products.length} items)
                  </h4>
                  
                  <div className="space-y-3">
                    {products.map((product) => (
                  <Card key={product.id} className="p-4 hover:shadow-lg transition-all duration-300 bg-white/95 backdrop-blur-sm border border-gray-200">
                    <div className="flex gap-4">
                      {/* Smaller Image on Left */}
                      <div className="w-20 h-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 cursor-pointer relative"
                           onClick={() => setExpandedImage(expandedImage === product.image ? null : product.image)}>
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                        {expandedImage === product.image && (
                          <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
                               onClick={() => setExpandedImage(null)}>
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                        )}
                      </div>
                      
                      {/* Content and Links on Right */}
                      <div className="flex-1 space-y-2">
                        <h4 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-tight">{product.name}</h4>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-green-600">{product.price}</span>
                          {product.rating && (
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-gray-600">{product.rating}</span>
                            </div>
                          )}
                        </div>
                        <Button
                          onClick={() => window.open(product.amazonUrl, '_blank')}
                          className="w-full bg-slate-700 hover:bg-slate-800 text-white text-sm py-3 font-medium border border-slate-600"
                        >
                          <ShoppingBag className="w-4 h-4 mr-2" />
                          View on Amazon
                        </Button>
                      </div>
                    </div>
                  </Card>
                    ))}
                  </div>
                </div>
              ))}

              {/* Additional Benefits Section */}
              <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Heart className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Why These Products Support Your S.O.M.E Journey</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-sm text-green-800">
                      <div>
                        <h4 className="font-medium mb-2">🛌 Sleep Enhancement</h4>
                        <p>Sound machines and meditation tools create optimal sleep environments for better rest and recovery.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🫁 Oxygen & Breathing</h4>
                        <p>Meditation cushions and fitness trackers support proper breathing techniques and stress management.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🏃 Movement & Exercise</h4>  
                        <p>Resistance bands, yoga mats, and fitness trackers enable effective home workouts and activity tracking.</p>
                      </div>
                      <div>
                        <h4 className="font-medium mb-2">🥗 Eating & Hydration</h4>
                        <p>Smart water bottles help maintain proper hydration to support your nutrition and wellness goals.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

          </Tabs>
        </div>
      </section>
      </div>
    </div>
  );
}