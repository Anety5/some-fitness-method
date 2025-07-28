import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

export async function generateWellnessResponse(
  userMessage: string,
  userContext: {
    latestVitals?: { heartRate?: number; oxygenSaturation?: number };
    recentMood?: number;
    recentSleep?: number;
    recentActivities?: string[];
    timeOfDay: "morning" | "afternoon" | "evening";
  }
): Promise<string> {
  if (!openai) {
    return generateFallbackWellnessResponse(userMessage, userContext);
  }

  const contextualPrompt = `You are Wellness, a caring and knowledgeable AI wellness coach. Your personality is warm, encouraging, and supportive. You provide personalized health insights based on user data.

Current context:
- Time of day: ${userContext.timeOfDay}
- Recent vitals: ${userContext.latestVitals?.heartRate ? `Heart rate: ${userContext.latestVitals.heartRate} BPM` : 'No recent vitals'}
- Recent mood: ${userContext.recentMood ? `${userContext.recentMood}/10` : 'No recent mood data'}
- Recent sleep: ${userContext.recentSleep ? `${userContext.recentSleep}/10 quality` : 'No recent sleep data'}
- Recent activities: ${userContext.recentActivities?.join(', ') || 'No recent activities'}

User message: "${userMessage}"

Respond as Wellness with:
1. Acknowledge their message warmly
2. Provide relevant wellness insights based on their data
3. Offer specific, actionable recommendations
4. Keep responses conversational and encouraging
5. If they ask about their data, interpret it in a helpful way
6. Suggest activities, breathing exercises, or lifestyle tips when appropriate

Keep responses to 2-3 sentences for casual conversation, longer for detailed questions.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: contextualPrompt
        },
        {
          role: "user", 
          content: userMessage
        }
      ],
      max_tokens: 200,
      temperature: 0.7
    });

    return response.choices[0].message.content || "I'm here to help with your wellness journey! How can I assist you today?";
  } catch (error) {
    console.error("OpenAI API error:", error);
    return generateFallbackWellnessResponse(userMessage, userContext);
  }
}

function generateFallbackWellnessResponse(
  userMessage: string,
  userContext: {
    latestVitals?: { heartRate?: number; oxygenSaturation?: number };
    recentMood?: number;
    recentSleep?: number;
    recentActivities?: string[];
    timeOfDay: "morning" | "afternoon" | "evening";
  }
): string {
  const message = userMessage.toLowerCase();
  
  // Muscle building and strength questions
  if (message.includes('muscle') || message.includes('strength') || message.includes('gain')) {
    return "Building muscle requires consistent strength training and proper nutrition! Try our strength training exercises in the Move section - start with wall sits and planks. Focus on protein-rich meals from our nutrition section, and ensure you're getting 7-8 hours of quality sleep for muscle recovery.";
  }
  
  // Sleep-related questions
  if (message.includes('sleep') || message.includes('tired') || message.includes('rest')) {
    const sleepQuality = userContext.recentSleep;
    if (sleepQuality && sleepQuality < 6) {
      return "I notice your recent sleep quality could improve. Try our sleep preparation techniques - progressive muscle relaxation and guided breathing exercises work wonders. Consider limiting screen time before bed and creating a calming bedtime routine.";
    }
    return "Quality sleep is essential for wellness! Visit our Sleep section for guided relaxation techniques, breathing exercises, and calming sounds. Aim for 7-9 hours nightly and try our progressive muscle relaxation before bed.";
  }
  
  // Stress and anxiety
  if (message.includes('stress') || message.includes('anxious') || message.includes('overwhelmed')) {
    return "When feeling stressed, breathing exercises are incredibly effective. Try our 4-7-8 breathing technique in the Oxygen section, or listen to our mindfulness meditation. Even 5 minutes of deep breathing can help reset your nervous system.";
  }
  
  // Energy and motivation
  if (message.includes('energy') || message.includes('motivation') || message.includes('tired')) {
    const mood = userContext.recentMood;
    if (mood && mood < 6) {
      return "Low energy often connects to mood and activity. Try gentle movement from our Morning Routine - even 5 minutes can boost energy naturally. Consider hydration, healthy snacks from our nutrition section, and brief outdoor time if possible.";
    }
    return "For natural energy, try our gentle morning exercises or a quick breathing session. Physical movement, even light stretching, can significantly boost energy levels. Stay hydrated and consider protein-rich snacks!";
  }
  
  // Exercise and movement
  if (message.includes('exercise') || message.includes('workout') || message.includes('movement')) {
    return "Movement is medicine! Start with our gentle morning routine - 6 simple exercises perfect for daily wellness. For more intensity, try our strength training section with guided timers. Remember, consistency matters more than intensity.";
  }
  
  // General wellness or greeting
  if (message.includes('hello') || message.includes('hi') || message.includes('how') || message.length < 20) {
    const timeGreeting = userContext.timeOfDay === 'morning' ? 'Good morning!' : 
                        userContext.timeOfDay === 'afternoon' ? 'Good afternoon!' : 'Good evening!';
    
    return `${timeGreeting} I'm here to support your wellness journey. You can ask me about building muscle, improving sleep, managing stress, boosting energy, or finding the right exercises. What would you like to focus on today?`;
  }
  
  // Default helpful response
  return "I'm here to help with your wellness journey! I can guide you through exercises, breathing techniques, sleep preparation, and nutrition advice. Try asking about building muscle, improving sleep, managing stress, or boosting energy - I have specific recommendations for each!";
}

export async function generateWellnessGreeting(
  timeOfDay: "morning" | "afternoon" | "evening",
  userContext: {
    latestVitals?: { heartRate?: number; oxygenSaturation?: number };
    recentMood?: number;
    recentSleep?: number;
    completedActivities?: number;
  }
): Promise<string> {
  if (!openai) {
    return getDefaultGreeting(timeOfDay);
  }

  const greetingPrompt = `Generate a personalized wellness greeting for the ${timeOfDay}. 

User data:
- Heart rate: ${userContext.latestVitals?.heartRate || 'unknown'} BPM
- Oxygen saturation: ${userContext.latestVitals?.oxygenSaturation || 'unknown'}%
- Recent mood: ${userContext.recentMood || 'unknown'}/10
- Sleep quality: ${userContext.recentSleep || 'unknown'}/10
- Activities completed today: ${userContext.completedActivities || 0}

Create a warm, encouraging greeting that:
1. Uses appropriate time-based greeting
2. Comments positively on their health data when available
3. Suggests one simple wellness action for this time of day
4. Keeps it brief and motivating (1-2 sentences)

Be conversational and caring, like a supportive friend.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [{ role: "user", content: greetingPrompt }],
      max_tokens: 100,
      temperature: 0.8
    });

    return response.choices[0].message.content || getDefaultGreeting(timeOfDay);
  } catch (error) {
    console.error("OpenAI API error:", error);
    return getDefaultGreeting(timeOfDay);
  }
}

function getDefaultGreeting(timeOfDay: "morning" | "afternoon" | "evening"): string {
  const greetings = {
    morning: "Good morning! Ready to start your wellness journey today? Let's begin with some deep breaths.",
    afternoon: "Good afternoon! How are you feeling today? Remember to stay hydrated and take a moment to check in with yourself.",
    evening: "Good evening! Time to wind down and reflect on your day. How did your wellness activities go?"
  };
  
  return greetings[timeOfDay];
}