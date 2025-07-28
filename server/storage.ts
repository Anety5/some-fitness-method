import type { User, InsertUser, Vital, InsertVital, MoodLog, InsertMoodLog, SleepLog, InsertSleepLog, Recipe, InsertRecipe, Activity, InsertActivity, ScheduledActivity, InsertScheduledActivity, ProgressLog, InsertProgressLog, ChatMessage, InsertChatMessage, AudioResource, InsertAudioResource, UserFavorite, InsertUserFavorite, DailyWellnessLog, InsertDailyWellnessLog, FeedbackSubmission, InsertFeedbackSubmission, HikeSession, InsertHikeSession, HikeTrackingPoint, InsertHikeTrackingPoint, HikeWaypoint, InsertHikeWaypoint, ActivityLog, InsertActivityLog, WellnessGoal, InsertWellnessGoal } from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Vitals
  getVitals(userId: number, limit?: number): Promise<Vital[]>;
  createVital(vital: InsertVital): Promise<Vital>;
  getLatestVital(userId: number): Promise<Vital | undefined>;

  // Mood
  getMoodLogs(userId: number, limit?: number): Promise<MoodLog[]>;
  createMoodLog(moodLog: InsertMoodLog): Promise<MoodLog>;
  getAverageMood(userId: number, days: number): Promise<number>;

  // Sleep
  getSleepLogs(userId: number, limit?: number): Promise<SleepLog[]>;
  createSleepLog(sleepLog: InsertSleepLog): Promise<SleepLog>;
  getAverageSleep(userId: number, days: number): Promise<number>;

  // Recipes
  getAllRecipes(): Promise<Recipe[]>;
  getRecipesByCategory(category: string): Promise<Recipe[]>;
  createRecipe(recipe: InsertRecipe): Promise<Recipe>;

  // Activities
  getAllActivities(): Promise<Activity[]>;
  getActivitiesByCategory(category: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;

  // Scheduled Activities
  getScheduledActivities(userId: number, date?: Date): Promise<ScheduledActivity[]>;
  createScheduledActivity(scheduledActivity: InsertScheduledActivity): Promise<ScheduledActivity>;
  updateScheduledActivity(id: number, updates: Partial<ScheduledActivity>): Promise<ScheduledActivity | undefined>;

  // Progress
  getProgressLogs(userId: number): Promise<ProgressLog[]>;
  createProgressLog(progressLog: InsertProgressLog): Promise<ProgressLog>;

  // Chat Messages
  getChatMessages(userId: number, limit?: number): Promise<ChatMessage[]>;
  createChatMessage(chatMessage: InsertChatMessage): Promise<ChatMessage>;

  // Audio Resources
  getAllAudioResources(): Promise<AudioResource[]>;
  getAudioResourcesByCategory(category: string): Promise<AudioResource[]>;
  createAudioResource(audioResource: InsertAudioResource): Promise<AudioResource>;
  updateAudioResource(id: number, updates: Partial<AudioResource>): Promise<AudioResource | undefined>;

  // User Favorites
  getUserFavorites(userId: number, itemType?: string): Promise<UserFavorite[]>;
  addFavorite(favorite: InsertUserFavorite): Promise<UserFavorite>;
  removeFavorite(userId: number, itemType: string, itemId: number): Promise<boolean>;
  isFavorite(userId: number, itemType: string, itemId: number): Promise<boolean>;

  // Daily Wellness Logs
  getDailyWellnessLogs(userId: number, limit?: number): Promise<DailyWellnessLog[]>;
  createDailyWellnessLog(log: InsertDailyWellnessLog): Promise<DailyWellnessLog>;
  getDailyWellnessLogByDate(userId: number, date: string): Promise<DailyWellnessLog | undefined>;
  updateDailyWellnessLog(userId: number, date: string, updates: Partial<InsertDailyWellnessLog>): Promise<DailyWellnessLog | undefined>;

  // Feedback Submissions
  getAllFeedback(): Promise<FeedbackSubmission[]>;
  createFeedbackSubmission(feedback: InsertFeedbackSubmission): Promise<FeedbackSubmission>;

  // Hiking/Walking Sessions
  getHikeSessions(userId: number, limit?: number): Promise<HikeSession[]>;
  createHikeSession(session: InsertHikeSession): Promise<HikeSession>;
  updateHikeSession(id: number, updates: Partial<HikeSession>): Promise<HikeSession | undefined>;
  getHikeSession(id: number): Promise<HikeSession | undefined>;

  // Hike Tracking Points
  getHikeTrackingPoints(hikeSessionId: number): Promise<HikeTrackingPoint[]>;
  createHikeTrackingPoint(point: InsertHikeTrackingPoint): Promise<HikeTrackingPoint>;
  
  // Hike Waypoints
  getHikeWaypoints(hikeSessionId: number): Promise<HikeWaypoint[]>;
  createHikeWaypoint(waypoint: InsertHikeWaypoint): Promise<HikeWaypoint>;

  // Activity Logs
  createActivityLog(log: InsertActivityLog): Promise<ActivityLog>;
  getActivityLogs(userId: number, limit?: number): Promise<ActivityLog[]>;
  getActivityLogsByType(userId: number, activityType: string, limit?: number): Promise<ActivityLog[]>;

  // Wellness Goals
  getWellnessGoals(userId: number): Promise<WellnessGoal[]>;
  createWellnessGoal(goal: InsertWellnessGoal): Promise<WellnessGoal>;
  updateWellnessGoal(id: number, updates: Partial<WellnessGoal>): Promise<WellnessGoal | undefined>;
  deleteWellnessGoal(id: number): Promise<boolean>;
  getWellnessGoal(id: number): Promise<WellnessGoal | undefined>;
}

import { db } from "./db";
import { eq, desc, gte, lte, and } from "drizzle-orm";
import { 
  users, vitals, moodLogs, sleepLogs, recipes, activities, 
  scheduledActivities, progressLogs, chatMessages, audioResources, userFavorites, dailyWellnessLogs, feedbackSubmissions, hikeSessions, hikeTrackingPoints, hikeWaypoints, activityLogs, wellnessGoals 
} from "@shared/schema";

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getVitals(userId: number, limit = 10): Promise<Vital[]> {
    const userVitals = await db
      .select()
      .from(vitals)
      .where(eq(vitals.userId, userId))
      .orderBy(desc(vitals.recordedAt))
      .limit(limit);
    return userVitals;
  }

  async createVital(insertVital: InsertVital): Promise<Vital> {
    const [vital] = await db
      .insert(vitals)
      .values(insertVital)
      .returning();
    return vital;
  }

  async getLatestVital(userId: number): Promise<Vital | undefined> {
    const [vital] = await db
      .select()
      .from(vitals)
      .where(eq(vitals.userId, userId))
      .orderBy(desc(vitals.recordedAt))
      .limit(1);
    return vital || undefined;
  }

  async getMoodLogs(userId: number, limit = 10): Promise<MoodLog[]> {
    const logs = await db
      .select()
      .from(moodLogs)
      .where(eq(moodLogs.userId, userId))
      .orderBy(desc(moodLogs.loggedAt))
      .limit(limit);
    return logs;
  }

  async createMoodLog(insertMoodLog: InsertMoodLog): Promise<MoodLog> {
    const [log] = await db
      .insert(moodLogs)
      .values(insertMoodLog)
      .returning();
    return log;
  }

  async getAverageMood(userId: number, days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const logs = await db
      .select()
      .from(moodLogs)
      .where(and(
        eq(moodLogs.userId, userId),
        gte(moodLogs.loggedAt, cutoffDate)
      ));

    if (logs.length === 0) return 0;
    return logs.reduce((sum: number, log: any) => sum + log.mood, 0) / logs.length;
  }

  async getSleepLogs(userId: number, limit = 10): Promise<SleepLog[]> {
    const logs = await db
      .select()
      .from(sleepLogs)
      .where(eq(sleepLogs.userId, userId))
      .orderBy(desc(sleepLogs.loggedAt))
      .limit(limit);
    return logs;
  }

  async createSleepLog(insertSleepLog: InsertSleepLog): Promise<SleepLog> {
    const [log] = await db
      .insert(sleepLogs)
      .values({
        ...insertSleepLog,
        quality: insertSleepLog.quality.toString()
      })
      .returning();
    return log;
  }

  async getAverageSleep(userId: number, days: number): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    const logs = await db
      .select()
      .from(sleepLogs)
      .where(and(
        eq(sleepLogs.userId, userId),
        gte(sleepLogs.loggedAt, cutoffDate)
      ));

    if (logs.length === 0) return 0;
    return logs.reduce((sum: number, log: any) => sum + parseFloat(log.quality || "0"), 0) / logs.length;
  }

  async getAllRecipes(): Promise<Recipe[]> {
    return await db.select().from(recipes);
  }

  async getRecipesByCategory(category: string): Promise<Recipe[]> {
    return await db.select().from(recipes).where(eq(recipes.category, category));
  }

  async createRecipe(insertRecipe: InsertRecipe): Promise<Recipe> {
    const [recipe] = await db
      .insert(recipes)
      .values(insertRecipe)
      .returning();
    return recipe;
  }

  async getAllActivities(): Promise<Activity[]> {
    return await db.select().from(activities);
  }

  async getActivitiesByCategory(category: string): Promise<Activity[]> {
    return await db.select().from(activities).where(eq(activities.category, category));
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async getScheduledActivities(userId: number, date?: Date): Promise<ScheduledActivity[]> {
    let baseQuery = db
      .select()
      .from(scheduledActivities)
      .where(eq(scheduledActivities.userId, userId));

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      baseQuery = db
        .select()
        .from(scheduledActivities)
        .where(
          and(
            eq(scheduledActivities.userId, userId),
            gte(scheduledActivities.scheduledTime, startOfDay),
            lte(scheduledActivities.scheduledTime, endOfDay)
          )
        );
    }

    return await baseQuery.orderBy(scheduledActivities.scheduledTime);
  }

  async createScheduledActivity(insertScheduledActivity: InsertScheduledActivity): Promise<ScheduledActivity> {
    const [activity] = await db
      .insert(scheduledActivities)
      .values(insertScheduledActivity)
      .returning();
    return activity;
  }

  async updateScheduledActivity(id: number, updates: Partial<ScheduledActivity>): Promise<ScheduledActivity | undefined> {
    const [activity] = await db
      .update(scheduledActivities)
      .set(updates)
      .where(eq(scheduledActivities.id, id))
      .returning();
    return activity || undefined;
  }

  async getProgressLogs(userId: number): Promise<ProgressLog[]> {
    return await db
      .select()
      .from(progressLogs)
      .where(eq(progressLogs.userId, userId))
      .orderBy(desc(progressLogs.week));
  }

  async createProgressLog(insertProgressLog: InsertProgressLog): Promise<ProgressLog> {
    const [log] = await db
      .insert(progressLogs)
      .values(insertProgressLog)
      .returning();
    return log;
  }

  async getChatMessages(userId: number, limit = 50): Promise<ChatMessage[]> {
    return await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(desc(chatMessages.timestamp))
      .limit(limit);
  }

  async createChatMessage(insertChatMessage: InsertChatMessage): Promise<ChatMessage> {
    const [message] = await db
      .insert(chatMessages)
      .values(insertChatMessage)
      .returning();
    return message;
  }

  async getAllAudioResources(): Promise<AudioResource[]> {
    return await db.select().from(audioResources);
  }

  async getAudioResourcesByCategory(category: string): Promise<AudioResource[]> {
    return await db.select().from(audioResources).where(eq(audioResources.category, category));
  }

  async createAudioResource(insertAudioResource: InsertAudioResource): Promise<AudioResource> {
    const [resource] = await db
      .insert(audioResources)
      .values(insertAudioResource)
      .returning();
    return resource;
  }

  async updateAudioResource(id: number, updates: Partial<AudioResource>): Promise<AudioResource | undefined> {
    const [updated] = await db
      .update(audioResources)
      .set(updates)
      .where(eq(audioResources.id, id))
      .returning();
    return updated;
  }

  async getUserFavorites(userId: number, itemType?: string): Promise<UserFavorite[]> {
    if (itemType) {
      return await db.select().from(userFavorites)
        .where(and(
          eq(userFavorites.userId, userId),
          eq(userFavorites.itemType, itemType)
        ))
        .orderBy(desc(userFavorites.createdAt));
    } else {
      return await db.select().from(userFavorites)
        .where(eq(userFavorites.userId, userId))
        .orderBy(desc(userFavorites.createdAt));
    }
  }

  async addFavorite(insertFavorite: InsertUserFavorite): Promise<UserFavorite> {
    try {
      const [favorite] = await db.insert(userFavorites).values(insertFavorite).returning();
      return favorite;
    } catch (error) {
      // If already exists, return existing
      const existing = await db.select().from(userFavorites)
        .where(and(
          eq(userFavorites.userId, insertFavorite.userId),
          eq(userFavorites.itemType, insertFavorite.itemType),
          eq(userFavorites.itemId, insertFavorite.itemId)
        )).limit(1);
      
      if (existing.length > 0) {
        return existing[0];
      }
      throw error;
    }
  }

  async removeFavorite(userId: number, itemType: string, itemId: number): Promise<boolean> {
    const result = await db.delete(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.itemType, itemType),
        eq(userFavorites.itemId, itemId)
      ));
    
    return result.rowCount !== null && result.rowCount > 0;
  }

  async isFavorite(userId: number, itemType: string, itemId: number): Promise<boolean> {
    const result = await db.select().from(userFavorites)
      .where(and(
        eq(userFavorites.userId, userId),
        eq(userFavorites.itemType, itemType),
        eq(userFavorites.itemId, itemId)
      )).limit(1);
    
    return result.length > 0;
  }

  async getDailyWellnessLogs(userId: number, limit = 30): Promise<DailyWellnessLog[]> {
    const logs = await db
      .select()
      .from(dailyWellnessLogs)
      .where(eq(dailyWellnessLogs.userId, userId))
      .orderBy(desc(dailyWellnessLogs.date))
      .limit(limit);
    return logs;
  }

  async createDailyWellnessLog(insertLog: InsertDailyWellnessLog): Promise<DailyWellnessLog> {
    const [log] = await db
      .insert(dailyWellnessLogs)
      .values({
        ...insertLog,
        sleepHours: insertLog.sleepHours.toString()
      })
      .returning();
    return log;
  }

  async getDailyWellnessLogByDate(userId: number, date: string): Promise<DailyWellnessLog | undefined> {
    const [log] = await db
      .select()
      .from(dailyWellnessLogs)
      .where(and(
        eq(dailyWellnessLogs.userId, userId),
        eq(dailyWellnessLogs.date, date)
      ));
    return log || undefined;
  }

  async updateDailyWellnessLog(userId: number, date: string, updates: Partial<InsertDailyWellnessLog>): Promise<DailyWellnessLog | undefined> {
    const updateData: any = { ...updates };
    if (updates.sleepHours !== undefined) {
      updateData.sleepHours = updates.sleepHours.toString();
    }
    
    const [log] = await db
      .update(dailyWellnessLogs)
      .set(updateData)
      .where(and(
        eq(dailyWellnessLogs.userId, userId),
        eq(dailyWellnessLogs.date, date)
      ))
      .returning();
    return log || undefined;
  }

  async getAllFeedback(): Promise<FeedbackSubmission[]> {
    return await db
      .select()
      .from(feedbackSubmissions)
      .orderBy(desc(feedbackSubmissions.submittedAt));
  }

  async createFeedbackSubmission(feedback: InsertFeedbackSubmission): Promise<FeedbackSubmission> {
    const [submission] = await db
      .insert(feedbackSubmissions)
      .values(feedback)
      .returning();
    return submission;
  }

  // Hiking/Walking Sessions
  async getHikeSessions(userId: number, limit = 50): Promise<HikeSession[]> {
    return await db
      .select()
      .from(hikeSessions)
      .where(eq(hikeSessions.userId, userId.toString()))
      .orderBy(desc(hikeSessions.createdAt))
      .limit(limit);
  }

  async createHikeSession(session: InsertHikeSession): Promise<HikeSession> {
    const [newSession] = await db
      .insert(hikeSessions)
      .values({
        ...session,
        userId: session.userId.toString(), // Ensure userId is string
        startTime: session.startTime || new Date().toISOString(),
        calories: session.calories || 0
      })
      .returning();
    return newSession;
  }

  async updateHikeSession(id: number, updates: Partial<HikeSession>): Promise<HikeSession | undefined> {
    const [updated] = await db
      .update(hikeSessions)
      .set(updates)
      .where(eq(hikeSessions.id, id))
      .returning();
    return updated;
  }

  async getHikeSession(id: number): Promise<HikeSession | undefined> {
    const [session] = await db
      .select()
      .from(hikeSessions)
      .where(eq(hikeSessions.id, id));
    return session;
  }

  // Hike Tracking Points
  async getHikeTrackingPoints(hikeSessionId: number): Promise<HikeTrackingPoint[]> {
    return await db
      .select()
      .from(hikeTrackingPoints)
      .where(eq(hikeTrackingPoints.hikeSessionId, hikeSessionId))
      .orderBy(hikeTrackingPoints.timestamp);
  }

  // Activity Logs for Strength Training
  async createActivityLog(log: InsertActivityLog): Promise<ActivityLog> {
    const [newLog] = await db
      .insert(activityLogs)
      .values(log)
      .returning();
    return newLog;
  }

  async getActivityLogs(userId: number, limit = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, userId))
      .orderBy(desc(activityLogs.loggedAt))
      .limit(limit);
  }

  async getActivityLogsByType(userId: number, activityType: string, limit = 50): Promise<ActivityLog[]> {
    return await db
      .select()
      .from(activityLogs)
      .where(and(
        eq(activityLogs.userId, userId),
        eq(activityLogs.activityType, activityType)
      ))
      .orderBy(desc(activityLogs.loggedAt))
      .limit(limit);
  }

  async createHikeTrackingPoint(point: InsertHikeTrackingPoint): Promise<HikeTrackingPoint> {
    const { lat, lng, timestamp, ...rest } = point;
    const [newPoint] = await db
      .insert(hikeTrackingPoints)
      .values({
        ...rest,
        latitude: lat.toString(),
        longitude: lng.toString(),
        timestamp: timestamp ? new Date(timestamp) : new Date()
      })
      .returning();
    return newPoint;
  }

  // Hike Waypoints
  async getHikeWaypoints(hikeSessionId: number): Promise<HikeWaypoint[]> {
    return await db
      .select()
      .from(hikeWaypoints)
      .where(eq(hikeWaypoints.hikeSessionId, hikeSessionId))
      .orderBy(hikeWaypoints.timestamp);
  }

  async createHikeWaypoint(waypoint: InsertHikeWaypoint): Promise<HikeWaypoint> {
    const { lat, lng, ...rest } = waypoint;
    const [newWaypoint] = await db
      .insert(hikeWaypoints)
      .values({
        ...rest,
        latitude: lat.toString(),
        longitude: lng.toString()
      })
      .returning();
    return newWaypoint;
  }

  // Wellness Goals
  async getWellnessGoals(userId: number): Promise<WellnessGoal[]> {
    return await db
      .select()
      .from(wellnessGoals)
      .where(eq(wellnessGoals.userId, userId))
      .orderBy(desc(wellnessGoals.createdAt));
  }

  async createWellnessGoal(insertGoal: InsertWellnessGoal): Promise<WellnessGoal> {
    const [goal] = await db
      .insert(wellnessGoals)
      .values(insertGoal)
      .returning();
    return goal;
  }

  async updateWellnessGoal(id: number, updates: Partial<WellnessGoal>): Promise<WellnessGoal | undefined> {
    const [updatedGoal] = await db
      .update(wellnessGoals)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(wellnessGoals.id, id))
      .returning();
    return updatedGoal || undefined;
  }

  async deleteWellnessGoal(id: number): Promise<boolean> {
    const result = await db
      .delete(wellnessGoals)
      .where(eq(wellnessGoals.id, id));
    return result.rowCount! > 0;
  }

  async getWellnessGoal(id: number): Promise<WellnessGoal | undefined> {
    const [goal] = await db
      .select()
      .from(wellnessGoals)
      .where(eq(wellnessGoals.id, id));
    return goal || undefined;
  }
}

export const storage = new DatabaseStorage();