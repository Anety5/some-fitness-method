import { pgTable, text, serial, integer, boolean, timestamp, decimal, jsonb, unique, real, bigint } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const vitals = pgTable("vitals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  heartRate: integer("heart_rate"),
  oxygenSaturation: integer("oxygen_saturation"),
  recordedAt: timestamp("recorded_at").defaultNow(),
  source: text("source").default("manual"), // manual, health_connect, camera, device
  deviceInfo: text("device_info"), // e.g., "Samsung Galaxy Watch", "Fitbit Charge 5"
  externalId: text("external_id"), // Health Connect record ID for deduplication
});

export const moodLogs = pgTable("mood_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  mood: integer("mood").notNull(), // 1-10 scale
  notes: text("notes"),
  loggedAt: timestamp("logged_at").defaultNow(),
});

export const sleepLogs = pgTable("sleep_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  quality: decimal("quality", { precision: 3, scale: 1 }).notNull(), // 0-10 scale
  duration: integer("duration"), // minutes
  bedtime: timestamp("bedtime"),
  wakeTime: timestamp("wake_time"),
  loggedAt: timestamp("logged_at").defaultNow(),
});

export const recipes = pgTable("recipes", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // breakfast, lunch, dinner, snack, smoothie, post-workout
  difficulty: text("difficulty").default("easy"), // easy, medium, hard
  dietary: text("dietary"), // vegetarian, vegan, pescatarian, gluten-free, dairy-free, etc.
  prepTime: integer("prep_time").notNull(), // minutes
  calories: integer("calories").notNull(),
  protein: integer("protein").notNull(), // grams
  fiber: integer("fiber").notNull(), // grams
  ingredients: text("ingredients").array().notNull(),
  instructions: text("instructions").array().notNull(),
  imageUrl: text("image_url"),
  premium: boolean("premium").default(false),
});

export const activities = pgTable("activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // exercise, meditation, breathing, stretching
  difficulty: text("difficulty").notNull(), // easy, medium, hard
  duration: integer("duration").notNull(), // minutes
  caloriesBurned: integer("calories_burned"),
  instructions: text("instructions").array(),
  imageUrl: text("image_url"),
});

export const scheduledActivities = pgTable("scheduled_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activityId: integer("activity_id").notNull(),
  scheduledTime: timestamp("scheduled_time").notNull(),
  completed: boolean("completed").default(false),
  completedAt: timestamp("completed_at"),
  status: text("status").default("scheduled"), // scheduled, completed, skipped
  autoLogged: boolean("auto_logged").default(false), // true if automatically logged
  activityType: text("activity_type"), // "audio", "breathing", "exercise", "nutrition", "manual"
  sessionData: jsonb("session_data"), // metadata about the session (duration, audio track, etc.)
});

export const progressLogs = pgTable("progress_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  week: text("week").notNull(), // ISO week format
  activitiesCompleted: integer("activities_completed").default(0),
  averageMood: decimal("average_mood", { precision: 3, scale: 1 }),
  averageSleep: decimal("average_sleep", { precision: 3, scale: 1 }),
  totalCaloriesBurned: integer("total_calories_burned").default(0),
});

export const chatMessages = pgTable("chat_messages", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  message: text("message").notNull(),
  isFromUser: boolean("is_from_user").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  messageType: text("message_type").default("general"), // general, greeting, reminder, insight
});

export const audioResources = pgTable("audio_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  category: text("category").notNull(), // meditation, breathing, music, nature
  duration: integer("duration"), // seconds
  fileUrl: text("file_url").notNull(),
  tags: text("tags").array(),
  isPremium: boolean("is_premium").default(false),
  price: decimal("price", { precision: 4, scale: 2 }).default("0.00"),
  sampleUrl: text("sample_url"), // For premium tracks, this is the free sample
});

export const userFavorites = pgTable("user_favorites", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  itemType: text("item_type").notNull(), // 'recipe' or 'activity'
  itemId: integer("item_id").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (table) => ({
  userItemUnique: unique().on(table.userId, table.itemType, table.itemId),
}));

export const dailyWellnessLogs = pgTable("daily_wellness_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  date: text("date").notNull(), // YYYY-MM-DD format
  sleepQuality: integer("sleep_quality").notNull(), // 1-10 scale
  sleepHours: decimal("sleep_hours", { precision: 3, scale: 1 }).notNull(), // Hours slept
  energyLevel: integer("energy_level").notNull(), // 1-10 scale
  emotionalState: integer("emotional_state").notNull(), // 1-10 scale
  stressLevel: integer("stress_level").notNull(), // 1-10 scale
  physicalWellbeing: integer("physical_wellbeing").notNull(), // 1-10 scale
  notes: text("notes"),
  loggedAt: timestamp("logged_at").defaultNow(),
}, (table) => ({
  userDateUnique: unique().on(table.userId, table.date),
}));

export const feedbackSubmissions = pgTable("feedback_submissions", {
  id: serial("id").primaryKey(),
  overallRating: integer("overall_rating").notNull(), // 1-5 stars
  liked: text("liked"),
  disliked: text("disliked"),
  legibility: text("legibility"),
  mobile: text("mobile"),
  suggestions: text("suggestions"),
  userAgent: text("user_agent"), // Browser/device info
  submittedAt: timestamp("submitted_at").defaultNow(),
});

export const hikeSessions = pgTable("hike_sessions", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(), // Changed to text to support "abc123" format
  title: text("title"), // Made optional as your model doesn't require it
  activityType: text("activity_type").notNull(), // Renamed from 'type' to match your model
  startTime: text("start_time").notNull(), // Changed to text for ISO timestamp format like "2025-07-18T08:30:00Z"
  endTime: text("end_time"), // Changed to text for ISO timestamp format
  distanceKm: real("distance_km"), // Changed to real for decimal values like 5.6
  totalDuration: integer("total_duration"), // minutes (keeping this for internal use)
  elevationGain: decimal("elevation_gain", { precision: 8, scale: 2 }), // meters
  elevationLoss: decimal("elevation_loss", { precision: 8, scale: 2 }), // meters
  averagePace: decimal("average_pace", { precision: 5, scale: 2 }), // minutes per kilometer
  maxSpeed: decimal("max_speed", { precision: 5, scale: 2 }), // km/h
  calories: integer("calories"), // Renamed from caloriesBurned to match your model
  location: text("location"), // Added location field like "Runyon Canyon"
  notes: text("notes"),
  status: text("status").default("active"), // "active", "paused", "completed", "cancelled"
  weatherConditions: text("weather_conditions"),
  difficulty: text("difficulty"), // "easy", "moderate", "hard", "extreme"
  createdAt: timestamp("created_at").defaultNow(),
});

export const hikeTrackingPoints = pgTable("hike_tracking_points", {
  id: serial("id").primaryKey(),
  hikeSessionId: integer("hike_session_id").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(), // Fixed to match database
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(), // Fixed to match database
  altitude: decimal("altitude", { precision: 8, scale: 2 }), // meters above sea level
  accuracy: decimal("accuracy", { precision: 6, scale: 2 }), // GPS accuracy in meters
  speed: decimal("speed", { precision: 5, scale: 2 }), // km/h
  bearing: decimal("bearing", { precision: 5, scale: 2 }), // degrees (0-360)
  timestamp: timestamp("timestamp").notNull(), // Fixed to match database timestamp type
  heartRate: integer("heart_rate"), // BPM if available from wearable
  stepCount: integer("step_count"), // cumulative steps if available
});

export const hikeWaypoints = pgTable("hike_waypoints", {
  id: serial("id").primaryKey(),
  hikeSessionId: integer("hike_session_id").notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 7 }).notNull(), // Fixed to match database
  longitude: decimal("longitude", { precision: 10, scale: 7 }).notNull(), // Fixed to match database
  name: text("name").notNull(), // e.g., "Summit", "Rest Stop", "Photo Point"
  description: text("description"),
  photo: text("photo"), // base64 encoded image or file path
  timestamp: timestamp("timestamp"), // Fixed to match database timestamp type
});

// General Activity Logs for strength training and other activities
export const activityLogs = pgTable("activity_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  activityType: text("activity_type").notNull(), // 'strength', 'hiking', 'cardio', etc.
  activityName: text("activity_name").notNull(), // 'Wall Sit', 'Push-ups', 'Trail Hike'
  date: text("date").notNull(), // YYYY-MM-DD format
  setsCompleted: integer("sets_completed"), // Number of sets for strength training
  repsOrDuration: text("reps_or_duration"), // JSON array: [12,12,10] or [45,40,35] for seconds
  distanceKm: real("distance_km"), // For cardio/hiking activities
  timeMinutes: integer("time_minutes"), // Total time in minutes
  notes: text("notes"),
  loggedAt: timestamp("logged_at").defaultNow(),
});

// Wellness Goals based on S.O.M.E method tracking
export const wellnessGoals = pgTable("wellness_goals", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  category: text("category").notNull(), // 'sleep', 'oxygen', 'move', 'eat'
  title: text("title").notNull(),
  description: text("description"),
  targetValue: real("target_value").notNull(),
  currentValue: real("current_value").notNull().default(0),
  unit: text("unit").notNull(), // 'hours', 'minutes', 'steps', 'servings', etc.
  priority: text("priority").notNull().default('medium'), // 'low', 'medium', 'high'
  targetDate: timestamp("target_date"),
  isCompleted: boolean("is_completed").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const insertVitalSchema = createInsertSchema(vitals).omit({
  id: true,
  recordedAt: true,
}).extend({
  source: z.string().optional(),
  deviceInfo: z.string().optional(), 
  externalId: z.string().optional(),
});

export const insertMoodLogSchema = createInsertSchema(moodLogs).omit({
  id: true,
  loggedAt: true,
}).extend({
  mood: z.number().min(1).max(10),
});

export const insertSleepLogSchema = createInsertSchema(sleepLogs).omit({
  id: true,
  loggedAt: true,
}).extend({
  quality: z.number().min(0).max(10),
});

export const insertRecipeSchema = createInsertSchema(recipes).omit({
  id: true,
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
});

export const insertScheduledActivitySchema = createInsertSchema(scheduledActivities).omit({
  id: true,
  completedAt: true,
});

export const insertProgressLogSchema = createInsertSchema(progressLogs).omit({
  id: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  timestamp: true,
});

export const insertDailyWellnessLogSchema = createInsertSchema(dailyWellnessLogs).omit({
  id: true,
  loggedAt: true,
}).extend({
  sleepQuality: z.number().min(1).max(10),
  energyLevel: z.number().min(1).max(10),
  emotionalState: z.number().min(1).max(10),
  stressLevel: z.number().min(1).max(10),
  physicalWellbeing: z.number().min(1).max(10),
  sleepHours: z.number().min(0).max(24),
});

export const insertFeedbackSchema = createInsertSchema(feedbackSubmissions).omit({
  id: true,
  submittedAt: true,
}).extend({
  overallRating: z.number().min(1).max(5),
});

export const insertHikeSessionSchema = createInsertSchema(hikeSessions).omit({
  id: true,
  createdAt: true,
}).extend({
  activityType: z.enum(["hike", "walk", "run", "bike"]), // Updated to match new field name
  status: z.enum(["active", "paused", "completed", "cancelled"]).optional(),
  difficulty: z.enum(["easy", "moderate", "hard", "extreme"]).optional(),
});

export const insertHikeTrackingPointSchema = createInsertSchema(hikeTrackingPoints).omit({
  id: true,
}).extend({
  lat: z.number().min(-90).max(90), // Updated to match new field name
  lng: z.number().min(-180).max(180), // Updated to match new field name
  timestamp: z.number(), // Unix timestamp validation
});

export const insertHikeWaypointSchema = createInsertSchema(hikeWaypoints).omit({
  id: true,
  timestamp: true,
}).extend({
  lat: z.number().min(-90).max(90), // Updated to match new field name
  lng: z.number().min(-180).max(180), // Updated to match new field name
});

export const insertActivityLogSchema = createInsertSchema(activityLogs).omit({
  id: true,
  loggedAt: true,
});

export const insertWellnessGoalSchema = createInsertSchema(wellnessGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAudioResourceSchema = createInsertSchema(audioResources).omit({
  id: true,
});

export const insertUserFavoriteSchema = createInsertSchema(userFavorites).omit({
  id: true,
  createdAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Vital = typeof vitals.$inferSelect;
export type InsertVital = z.infer<typeof insertVitalSchema>;

export type MoodLog = typeof moodLogs.$inferSelect;
export type InsertMoodLog = z.infer<typeof insertMoodLogSchema>;

export type SleepLog = typeof sleepLogs.$inferSelect;
export type InsertSleepLog = z.infer<typeof insertSleepLogSchema>;

export type Recipe = typeof recipes.$inferSelect;
export type InsertRecipe = z.infer<typeof insertRecipeSchema>;

export type Activity = typeof activities.$inferSelect;
export type InsertActivity = z.infer<typeof insertActivitySchema>;

export type ScheduledActivity = typeof scheduledActivities.$inferSelect;
export type InsertScheduledActivity = z.infer<typeof insertScheduledActivitySchema>;

export type ProgressLog = typeof progressLogs.$inferSelect;
export type InsertProgressLog = z.infer<typeof insertProgressLogSchema>;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;

export type AudioResource = typeof audioResources.$inferSelect;
export type InsertAudioResource = z.infer<typeof insertAudioResourceSchema>;

export type UserFavorite = typeof userFavorites.$inferSelect;
export type InsertUserFavorite = z.infer<typeof insertUserFavoriteSchema>;

export type DailyWellnessLog = typeof dailyWellnessLogs.$inferSelect;
export type InsertDailyWellnessLog = z.infer<typeof insertDailyWellnessLogSchema>;

export type FeedbackSubmission = typeof feedbackSubmissions.$inferSelect;
export type InsertFeedbackSubmission = z.infer<typeof insertFeedbackSchema>;

export type HikeSession = typeof hikeSessions.$inferSelect;
export type InsertHikeSession = z.infer<typeof insertHikeSessionSchema>;

export type HikeTrackingPoint = typeof hikeTrackingPoints.$inferSelect;
export type InsertHikeTrackingPoint = z.infer<typeof insertHikeTrackingPointSchema>;

export type HikeWaypoint = typeof hikeWaypoints.$inferSelect;
export type InsertHikeWaypoint = z.infer<typeof insertHikeWaypointSchema>;

export type ActivityLog = typeof activityLogs.$inferSelect;
export type InsertActivityLog = z.infer<typeof insertActivityLogSchema>;

export type WellnessGoal = typeof wellnessGoals.$inferSelect;
export type InsertWellnessGoal = z.infer<typeof insertWellnessGoalSchema>;
