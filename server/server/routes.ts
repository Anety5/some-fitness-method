import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { generateWellnessResponse, generateWellnessGreeting } from "./openai";
import { z } from "zod";
import bcrypt from "bcrypt";
import { 
  insertVitalSchema, insertMoodLogSchema, insertSleepLogSchema, 
  insertScheduledActivitySchema, insertChatMessageSchema, insertAudioResourceSchema,
  insertUserFavoriteSchema, insertDailyWellnessLogSchema, insertFeedbackSchema,
  insertHikeSessionSchema, insertHikeTrackingPointSchema, insertHikeWaypointSchema,
  insertUserSchema, insertWellnessGoalSchema
} from "@shared/schema";

// Initialize Stripe (only if keys are provided)
const stripe = process.env.STRIPE_SECRET_KEY ? new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
}) : null;

export async function registerRoutes(app: Express): Promise<Server> {
  
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const { username, password, firstName, lastName } = req.body;
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.json({ success: false, message: "Username already exists" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const userData = insertUserSchema.parse({
        username,
        password: hashedPassword,
        firstName,
        lastName
      });
      
      const user = await storage.createUser(userData);
      
      // Remove password from response
      const { password: _, ...userResponse } = user;
      
      res.json({ 
        success: true, 
        user: userResponse,
        message: "Account created successfully"
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.json({ success: false, message: "Failed to create account" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.json({ success: false, message: "Invalid username or password" });
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        return res.json({ success: false, message: "Invalid username or password" });
      }

      // Remove password from response
      const { password: _, ...userResponse } = user;
      
      res.json({ 
        success: true, 
        user: userResponse,
        message: "Login successful"
      });
    } catch (error) {
      console.error("Login error:", error);
      res.json({ success: false, message: "Failed to log in" });
    }
  });
  // Vitals endpoints
  app.get("/api/vitals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const vitals = await storage.getVitals(userId);
      res.json(vitals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch vitals" });
    }
  });

  app.post("/api/vitals", async (req, res) => {
    try {
      const validatedData = insertVitalSchema.parse(req.body);
      const vital = await storage.createVital(validatedData);
      res.json(vital);
    } catch (error) {
      res.status(400).json({ message: "Invalid vital data" });
    }
  });

  app.get("/api/vitals/:userId/latest", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const vital = await storage.getLatestVital(userId);
      res.json(vital);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch latest vital" });
    }
  });

  // Health Connect sync endpoints
  app.post("/api/health-connect/sync", async (req, res) => {
    try {
      const { userId, vitals: vitalsData, steps, sleepData } = req.body;
      
      // Validate required fields
      if (!userId) {
        return res.status(400).json({ message: "User ID required" });
      }

      const results: {
        vitals: any[];
        steps: any[];
        sleep: any[];
      } = {
        vitals: [],
        steps: [],
        sleep: []
      };

      // Sync vitals data (heart rate, oxygen saturation)
      if (vitalsData && Array.isArray(vitalsData)) {
        for (const vital of vitalsData) {
          try {
            const vitalRecord = await storage.createVital({
              userId,
              heartRate: vital.heartRate || null,
              oxygenSaturation: vital.oxygenSaturation || null,
              source: "health_connect",
              deviceInfo: vital.deviceInfo || null,
              externalId: vital.externalId || null
            });
            results.vitals.push(vitalRecord);
          } catch (error) {
            console.error("Failed to sync vital:", error);
          }
        }
      }

      // Sync sleep data
      if (sleepData && Array.isArray(sleepData)) {
        for (const sleep of sleepData) {
          try {
            const sleepRecord = await storage.createSleepLog({
              userId,
              quality: sleep.quality || 7,
              duration: sleep.duration || null,
              bedtime: sleep.bedtime ? new Date(sleep.bedtime) : null,
              wakeTime: sleep.wakeTime ? new Date(sleep.wakeTime) : null
            });
            results.sleep.push(sleepRecord);
          } catch (error) {
            console.error("Failed to sync sleep:", error);
          }
        }
      }

      res.json({
        message: "Health Connect data synced successfully",
        synced: results
      });
    } catch (error) {
      console.error("Health Connect sync error:", error);
      res.status(500).json({ message: "Failed to sync Health Connect data" });
    }
  });

  // Health Connect registration endpoint for Android app
  app.post("/api/health-connect/register", async (req, res) => {
    try {
      const { userId, deviceId, permissions } = req.body;
      
      if (!userId || !deviceId) {
        return res.status(400).json({ message: "User ID and device ID required" });
      }

      // Store device registration info (you might want to create a devices table)
      res.json({
        message: "Device registered successfully",
        syncToken: `hc_${userId}_${deviceId}_${Date.now()}`,
        apiEndpoint: `${req.protocol}://${req.get('host')}/api/health-connect/sync`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to register device" });
    }
  });

  // Mood endpoints
  app.get("/api/mood/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const moods = await storage.getMoodLogs(userId);
      res.json(moods);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood logs" });
    }
  });

  app.post("/api/mood", async (req, res) => {
    try {
      const validatedData = insertMoodLogSchema.parse(req.body);
      const moodLog = await storage.createMoodLog(validatedData);
      res.json(moodLog);
    } catch (error) {
      res.status(400).json({ message: "Invalid mood data" });
    }
  });

  app.get("/api/mood/:userId/average/:days", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const days = parseInt(req.params.days);
      const average = await storage.getAverageMood(userId, days);
      res.json({ average });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate average mood" });
    }
  });

  // Sleep endpoints
  app.get("/api/sleep/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const sleepLogs = await storage.getSleepLogs(userId);
      res.json(sleepLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch sleep logs" });
    }
  });

  app.post("/api/sleep", async (req, res) => {
    try {
      const validatedData = insertSleepLogSchema.parse(req.body);
      const sleepLog = await storage.createSleepLog(validatedData);
      res.json(sleepLog);
    } catch (error) {
      res.status(400).json({ message: "Invalid sleep data" });
    }
  });

  app.get("/api/sleep/:userId/average/:days", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const days = parseInt(req.params.days);
      const average = await storage.getAverageSleep(userId, days);
      res.json({ average });
    } catch (error) {
      res.status(500).json({ message: "Failed to calculate average sleep" });
    }
  });

  // Daily wellness log endpoints
  app.get("/api/wellness/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { limit } = req.query;
      const logs = await storage.getDailyWellnessLogs(userId, limit ? parseInt(limit as string) : undefined);
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wellness logs" });
    }
  });

  app.post("/api/wellness", async (req, res) => {
    try {
      const validatedData = insertDailyWellnessLogSchema.parse(req.body);
      const log = await storage.createDailyWellnessLog(validatedData);
      res.json(log);
    } catch (error) {
      res.status(400).json({ message: "Invalid wellness data" });
    }
  });

  app.get("/api/wellness/:userId/:date", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const date = req.params.date;
      const log = await storage.getDailyWellnessLogByDate(userId, date);
      res.json(log);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch wellness log" });
    }
  });

  app.put("/api/wellness/:userId/:date", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const date = req.params.date;
      const log = await storage.updateDailyWellnessLog(userId, date, req.body);
      if (!log) {
        return res.status(404).json({ message: "Wellness log not found" });
      }
      res.json(log);
    } catch (error) {
      res.status(500).json({ message: "Failed to update wellness log" });
    }
  });

  // Recipe endpoints
  app.get("/api/recipes", async (req, res) => {
    try {
      const { category } = req.query;
      const recipes = category 
        ? await storage.getRecipesByCategory(category as string)
        : await storage.getAllRecipes();
      res.json(recipes);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch recipes" });
    }
  });

  // Activity endpoints
  app.get("/api/activities", async (req, res) => {
    try {
      const { category } = req.query;
      const activities = category 
        ? await storage.getActivitiesByCategory(category as string)
        : await storage.getAllActivities();
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch activities" });
    }
  });

  // Scheduled activities endpoints
  app.get("/api/schedule/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { date } = req.query;
      const activities = await storage.getScheduledActivities(
        userId, 
        date ? new Date(date as string) : undefined
      );
      res.json(activities);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch scheduled activities" });
    }
  });

  app.post("/api/schedule", async (req, res) => {
    try {
      console.log("Received schedule data:", req.body);
      
      // Convert scheduledTime string to Date object if needed
      const requestData = {
        ...req.body,
        scheduledTime: typeof req.body.scheduledTime === 'string' 
          ? new Date(req.body.scheduledTime) 
          : req.body.scheduledTime
      };
      
      const validatedData = insertScheduledActivitySchema.parse(requestData);
      console.log("Validated data:", validatedData);
      const scheduledActivity = await storage.createScheduledActivity(validatedData);
      res.json(scheduledActivity);
    } catch (error) {
      console.error("Schedule validation error:", error);
      if (error instanceof Error) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(400).json({ message: "Invalid scheduled activity data" });
      }
    }
  });

  app.patch("/api/schedule/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedActivity = await storage.updateScheduledActivity(id, req.body);
      if (!updatedActivity) {
        return res.status(404).json({ message: "Scheduled activity not found" });
      }
      res.json(updatedActivity);
    } catch (error) {
      res.status(400).json({ message: "Failed to update scheduled activity" });
    }
  });

  // Progress endpoints
  app.get("/api/progress/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const progressLogs = await storage.getProgressLogs(userId);
      res.json(progressLogs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch progress logs" });
    }
  });

  // Chat endpoints
  app.get("/api/chat/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const messages = await storage.getChatMessages(userId);
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat", async (req, res) => {
    try {
      const validatedData = insertChatMessageSchema.parse(req.body);
      
      // Save user message
      const userMessage = await storage.createChatMessage(validatedData);
      
      // Generate AI response if it's from user
      if (validatedData.isFromUser) {
        // Get user context for AI response
        const latestVital = await storage.getLatestVital(validatedData.userId);
        const recentMoods = await storage.getMoodLogs(validatedData.userId, 1);
        const recentSleep = await storage.getSleepLogs(validatedData.userId, 1);
        const todayActivities = await storage.getScheduledActivities(validatedData.userId, new Date());
        
        const timeOfDay = getTimeOfDay();
        const userContext = {
          latestVitals: latestVital ? { 
            heartRate: latestVital.heartRate || undefined, 
            oxygenSaturation: latestVital.oxygenSaturation || undefined 
          } : undefined,
          recentMood: recentMoods[0]?.mood,
          recentSleep: recentSleep[0] ? parseFloat(recentSleep[0].quality || "0") : undefined,
          recentActivities: todayActivities.filter(a => a.completed).map(() => "activity"),
          timeOfDay
        };

        const aiResponse = await generateWellnessResponse(validatedData.message, userContext);
        
        // Save AI response
        const aiMessage = await storage.createChatMessage({
          userId: validatedData.userId,
          message: aiResponse,
          isFromUser: false,
          messageType: "general"
        });

        res.json({ userMessage, aiMessage });
      } else {
        res.json({ userMessage });
      }
    } catch (error) {
      console.error("Chat error:", error);
      res.status(400).json({ message: "Failed to process chat message" });
    }
  });

  app.post("/api/chat/greeting/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      
      // Get user context
      const latestVital = await storage.getLatestVital(userId);
      const recentMoods = await storage.getMoodLogs(userId, 1);
      const recentSleep = await storage.getSleepLogs(userId, 1);
      const todayActivities = await storage.getScheduledActivities(userId, new Date());
      
      const timeOfDay = getTimeOfDay();
      const userContext = {
        latestVitals: latestVital ? { 
          heartRate: latestVital.heartRate || undefined, 
          oxygenSaturation: latestVital.oxygenSaturation || undefined 
        } : undefined,
        recentMood: recentMoods[0]?.mood,
        recentSleep: recentSleep[0] ? parseFloat(recentSleep[0].quality || "0") : undefined,
        completedActivities: todayActivities.filter(a => a.completed).length
      };

      const greeting = await generateWellnessGreeting(timeOfDay, userContext);
      
      // Save greeting as AI message
      const greetingMessage = await storage.createChatMessage({
        userId,
        message: greeting,
        isFromUser: false,
        messageType: "greeting"
      });

      res.json(greetingMessage);
    } catch (error) {
      console.error("Greeting error:", error);
      res.status(500).json({ message: "Failed to generate greeting" });
    }
  });

  // Audio resources endpoints
  app.get("/api/audio", async (req, res) => {
    try {
      const { category } = req.query;
      const audioResources = category 
        ? await storage.getAudioResourcesByCategory(category as string)
        : await storage.getAllAudioResources();
      res.json(audioResources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch audio resources" });
    }
  });



  app.post("/api/audio", async (req, res) => {
    try {
      const validatedData = insertAudioResourceSchema.parse(req.body);
      const audioResource = await storage.createAudioResource(validatedData);
      res.status(201).json(audioResource);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid audio resource data", details: error.errors });
      }
      console.error("Error creating audio resource:", error);
      res.status(500).json({ error: "Failed to create audio resource" });
    }
  });

  app.put("/api/audio/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedAudio = await storage.updateAudioResource(id, updates);
      if (!updatedAudio) {
        return res.status(404).json({ message: "Audio resource not found" });
      }
      res.json(updatedAudio);
    } catch (error) {
      res.status(400).json({ message: "Failed to update audio resource" });
    }
  });

  // User Favorites
  app.get("/api/favorites/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const itemType = req.query.type as string;
      const favorites = await storage.getUserFavorites(userId, itemType);
      res.json(favorites);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      res.status(500).json({ error: "Failed to fetch favorites" });
    }
  });

  app.post("/api/favorites", async (req, res) => {
    try {
      const validatedData = insertUserFavoriteSchema.parse(req.body);
      const favorite = await storage.addFavorite(validatedData);
      res.json(favorite);
    } catch (error) {
      console.error("Error adding favorite:", error);
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  app.delete("/api/favorites/:userId/:itemType/:itemId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { itemType } = req.params;
      const itemId = parseInt(req.params.itemId);
      
      const success = await storage.removeFavorite(userId, itemType, itemId);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Favorite not found" });
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  app.get("/api/favorites/:userId/:itemType/:itemId/check", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const { itemType } = req.params;
      const itemId = parseInt(req.params.itemId);
      
      // Validate parameters
      if (isNaN(userId) || isNaN(itemId)) {
        return res.status(400).json({ error: "Invalid user ID or item ID" });
      }
      
      const isFavorite = await storage.isFavorite(userId, itemType, itemId);
      res.json({ isFavorite });
    } catch (error) {
      console.error("Error checking favorite:", error);
      res.status(500).json({ error: "Failed to check favorite" });
    }
  });

  // Feedback endpoints
  app.get("/api/feedback", async (req, res) => {
    try {
      const feedback = await storage.getAllFeedback();
      res.json(feedback);
    } catch (error) {
      console.error("Error fetching feedback:", error);
      res.status(500).json({ message: "Failed to fetch feedback" });
    }
  });

  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse({
        ...req.body,
        userAgent: req.get('User-Agent') || 'Unknown'
      });
      const feedback = await storage.createFeedbackSubmission(validatedData);
      res.json(feedback);
    } catch (error) {
      console.error("Error creating feedback:", error);
      res.status(400).json({ message: "Invalid feedback data" });
    }
  });

  // Hiking/Walking Session endpoints
  app.get("/api/hikes/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const sessions = await storage.getHikeSessions(userId, limit);
      res.json(sessions);
    } catch (error) {
      console.error("Error fetching hike sessions:", error);
      res.status(500).json({ message: "Failed to fetch hike sessions" });
    }
  });

  app.post("/api/hikes", async (req, res) => {
    try {
      const validatedData = insertHikeSessionSchema.parse(req.body);
      const session = await storage.createHikeSession(validatedData);
      res.json(session);
    } catch (error) {
      console.error("Error creating hike session:", error);
      res.status(400).json({ message: "Invalid hike session data" });
    }
  });

  app.get("/api/hikes/:hikeId/details", async (req, res) => {
    try {
      const hikeId = parseInt(req.params.hikeId);
      
      // Get basic session data
      const session = await storage.getHikeSession(hikeId);
      if (!session) {
        return res.status(404).json({ message: "Hike session not found" });
      }
      
      // Get tracking points for route and elevation data
      const trackingPoints = await storage.getHikeTrackingPoints(hikeId);
      
      // Transform tracking points into route and elevation arrays
      const route = trackingPoints.map(point => [parseFloat(point.latitude), parseFloat(point.longitude)]);
      const elevation = trackingPoints
        .filter(point => point.altitude !== null && point.altitude !== undefined)
        .map(point => parseFloat(point.altitude || "0"));
      
      // Combine session data with route/elevation arrays
      const detailedSession = {
        ...session,
        route,
        elevation,
        trackingPointsCount: trackingPoints.length
      };
      
      res.json(detailedSession);
    } catch (error) {
      console.error("Error fetching detailed hike session:", error);
      res.status(500).json({ message: "Failed to fetch hike session details" });
    }
  });

  app.put("/api/hikes/:hikeId", async (req, res) => {
    try {
      const hikeId = parseInt(req.params.hikeId);
      const updates = req.body;
      const session = await storage.updateHikeSession(hikeId, updates);
      if (!session) {
        return res.status(404).json({ message: "Hike session not found" });
      }
      res.json(session);
    } catch (error) {
      console.error("Error updating hike session:", error);
      res.status(400).json({ message: "Failed to update hike session" });
    }
  });

  // Tracking points endpoints
  app.get("/api/hikes/:hikeId/tracking", async (req, res) => {
    try {
      const hikeId = parseInt(req.params.hikeId);
      const points = await storage.getHikeTrackingPoints(hikeId);
      res.json(points);
    } catch (error) {
      console.error("Error fetching tracking points:", error);
      res.status(500).json({ message: "Failed to fetch tracking points" });
    }
  });

  app.post("/api/hikes/:hikeId/tracking", async (req, res) => {
    try {
      const hikeSessionId = parseInt(req.params.hikeId);
      const validatedData = insertHikeTrackingPointSchema.parse({
        ...req.body,
        hikeSessionId
      });
      const point = await storage.createHikeTrackingPoint(validatedData);
      res.json(point);
    } catch (error) {
      console.error("Error creating tracking point:", error);
      res.status(400).json({ message: "Invalid tracking point data" });
    }
  });

  // Waypoints endpoints
  app.get("/api/hikes/:hikeId/waypoints", async (req, res) => {
    try {
      const hikeId = parseInt(req.params.hikeId);
      const waypoints = await storage.getHikeWaypoints(hikeId);
      res.json(waypoints);
    } catch (error) {
      console.error("Error fetching waypoints:", error);
      res.status(500).json({ message: "Failed to fetch waypoints" });
    }
  });

  app.post("/api/hikes/:hikeId/waypoints", async (req, res) => {
    try {
      const hikeSessionId = parseInt(req.params.hikeId);
      const validatedData = insertHikeWaypointSchema.parse({
        ...req.body,
        hikeSessionId
      });
      const waypoint = await storage.createHikeWaypoint(validatedData);
      res.json(waypoint);
    } catch (error) {
      console.error("Error creating waypoint:", error);
      res.status(400).json({ message: "Invalid waypoint data" });
    }
  });

  // Activity Logs Routes for Strength Training
  app.get("/api/activity-logs/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const limit = parseInt(req.query.limit as string) || 50;
      const activityLogs = await storage.getActivityLogs(userId, limit);
      res.json(activityLogs);
    } catch (error) {
      console.error("Error fetching activity logs:", error);
      res.status(500).json({ message: "Failed to fetch activity logs" });
    }
  });

  app.post("/api/activity-logs", async (req, res) => {
    try {
      const logData = req.body;
      const newLog = await storage.createActivityLog(logData);
      res.status(201).json(newLog);
    } catch (error) {
      console.error("Error creating activity log:", error);
      res.status(400).json({ message: "Invalid activity log data" });
    }
  });

  // Wellness Goals Routes
  app.get("/api/goals/:userId", async (req, res) => {
    try {
      const userId = parseInt(req.params.userId);
      const goals = await storage.getWellnessGoals(userId);
      res.json(goals);
    } catch (error) {
      console.error("Error fetching wellness goals:", error);
      res.status(500).json({ message: "Failed to fetch wellness goals" });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const validatedData = insertWellnessGoalSchema.parse(req.body);
      const goal = await storage.createWellnessGoal(validatedData);
      res.status(201).json(goal);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid goal data", details: error.errors });
      }
      console.error("Error creating wellness goal:", error);
      res.status(500).json({ error: "Failed to create wellness goal" });
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedGoal = await storage.updateWellnessGoal(id, updates);
      if (!updatedGoal) {
        return res.status(404).json({ message: "Wellness goal not found" });
      }
      res.json(updatedGoal);
    } catch (error) {
      console.error("Error updating wellness goal:", error);
      res.status(400).json({ message: "Failed to update wellness goal" });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const success = await storage.deleteWellnessGoal(id);
      if (success) {
        res.json({ success: true });
      } else {
        res.status(404).json({ error: "Wellness goal not found" });
      }
    } catch (error) {
      console.error("Error deleting wellness goal:", error);
      res.status(500).json({ error: "Failed to delete wellness goal" });
    }
  });

  app.get("/api/goals/single/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const goal = await storage.getWellnessGoal(id);
      if (!goal) {
        return res.status(404).json({ message: "Wellness goal not found" });
      }
      res.json(goal);
    } catch (error) {
      console.error("Error fetching wellness goal:", error);
      res.status(500).json({ message: "Failed to fetch wellness goal" });
    }
  });

  // Stripe Premium Subscription Routes
  app.post("/api/create-payment-intent", async (req, res) => {
    if (!stripe) {
      return res.status(400).json({ error: "Stripe not configured" });
    }
    
    try {
      const { amount } = req.body;
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
      });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ 
        error: "Error creating payment intent: " + error.message 
      });
    }
  });

  app.post('/api/create-subscription', async (req, res) => {
    if (!stripe) {
      return res.status(400).json({ error: "Stripe not configured" });
    }

    try {
      const { email, name, priceId } = req.body;
      
      // Create customer
      const customer = await stripe.customers.create({
        email: email,
        name: name,
      });

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        payment_behavior: 'default_incomplete',
        expand: ['latest_invoice.payment_intent'],
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      res.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
        customerId: customer.id
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  app.post('/api/cancel-subscription', async (req, res) => {
    if (!stripe) {
      return res.status(400).json({ error: "Stripe not configured" });
    }

    try {
      const { subscriptionId } = req.body;
      
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });

      res.json({ 
        success: true, 
        cancelAt: subscription.cancel_at 
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

function getTimeOfDay(): "morning" | "afternoon" | "evening" {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 18) return "afternoon";
  return "evening";
}
