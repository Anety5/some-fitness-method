import type { Express } from "express";
import { z } from "zod";
import { storage } from "./storage";
import { 
  insertHealthConnectSyncSchema,
  insertVitalsExtendedSchema,
  insertSleepSessionSchema,
  insertExerciseSessionSchema,
  insertDailyActivitySchema,
  insertNutritionDataSchema,
  type HealthConnectDataSync,
  type HealthConnectStatus
} from "../shared/health-connect-schema";

// Health Connect data sync validation schema
const healthConnectSyncSchema = z.object({
  dataType: z.enum(['heart_rate', 'sleep', 'exercise', 'nutrition', 'steps']),
  records: z.array(z.any()),
  deviceSource: z.string().optional(),
  syncTimestamp: z.string()
});

export function registerHealthConnectRoutes(app: Express) {
  
  // Health Connect data sync endpoint
  app.post("/api/health-connect/sync", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const validatedData = healthConnectSyncSchema.parse(req.body);
      const { dataType, records, deviceSource } = validatedData;
      const userId = req.user!.id;

      let syncedCount = 0;

      // Process different data types
      switch (dataType) {
        case 'heart_rate':
          syncedCount = await syncHeartRateData(userId, records, deviceSource);
          break;
        case 'sleep':
          syncedCount = await syncSleepData(userId, records, deviceSource);
          break;
        case 'exercise':
          syncedCount = await syncExerciseData(userId, records, deviceSource);
          break;
        case 'nutrition':
          syncedCount = await syncNutritionData(userId, records, deviceSource);
          break;
        case 'steps':
          syncedCount = await syncStepsData(userId, records, deviceSource);
          break;
        default:
          return res.status(400).json({ error: 'Unsupported data type' });
      }

      // Update sync status
      await storage.updateHealthConnectSync(userId, dataType, deviceSource);
      
      res.json({ 
        success: true, 
        synced: syncedCount,
        dataType,
        timestamp: new Date().toISOString()
      });

    } catch (error) {
      console.error('Health Connect sync error:', error);
      res.status(500).json({ error: 'Sync failed' });
    }
  });

  // Get Health Connect sync status
  app.get("/api/health-connect/status", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const status = await storage.getHealthConnectStatus(req.user!.id);
      res.json(status);
    } catch (error) {
      console.error('Error fetching Health Connect status:', error);
      res.status(500).json({ error: 'Failed to fetch status' });
    }
  });

  // Initialize Health Connect permissions
  app.post("/api/health-connect/initialize", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const permissionsSchema = z.object({
      permissions: z.array(z.string())
    });

    try {
      const { permissions } = permissionsSchema.parse(req.body);
      const userId = req.user!.id;

      // Store granted permissions
      await storage.storeHealthConnectPermissions(userId, permissions);

      res.json({
        success: true,
        permissions: permissions,
        message: 'Health Connect initialized successfully'
      });

    } catch (error) {
      console.error('Health Connect initialization error:', error);
      res.status(500).json({ error: 'Initialization failed' });
    }
  });

  // Get health data summary for dashboard
  app.get("/api/health-connect/summary", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    try {
      const userId = req.user!.id;
      const summary = await storage.getHealthDataSummary(userId);
      res.json(summary);
    } catch (error) {
      console.error('Error fetching health summary:', error);
      res.status(500).json({ error: 'Failed to fetch summary' });
    }
  });

  // Export user health data (GDPR compliance)
  app.post("/api/health-connect/export", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const exportSchema = z.object({
      dataTypes: z.array(z.string()),
      dateRange: z.object({
        start: z.string(),
        end: z.string()
      }).optional()
    });

    try {
      const { dataTypes, dateRange } = exportSchema.parse(req.body);
      const userId = req.user!.id;

      // Create export request
      const exportRequest = await storage.createDataExportRequest(userId, dataTypes, dateRange);

      res.json({
        success: true,
        exportId: exportRequest.id,
        message: 'Export request created. You will receive an email when ready.'
      });

    } catch (error) {
      console.error('Data export error:', error);
      res.status(500).json({ error: 'Export request failed' });
    }
  });

  // Delete Health Connect data (GDPR compliance)
  app.delete("/api/health-connect/data", async (req, res) => {
    if (!req.isAuthenticated()) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const deleteSchema = z.object({
      dataTypes: z.array(z.string()),
      confirmDeletion: z.boolean()
    });

    try {
      const { dataTypes, confirmDeletion } = deleteSchema.parse(req.body);
      
      if (!confirmDeletion) {
        return res.status(400).json({ error: 'Deletion not confirmed' });
      }

      const userId = req.user!.id;
      const deletedRecords = await storage.deleteHealthConnectData(userId, dataTypes);

      res.json({
        success: true,
        deletedRecords,
        message: 'Health data deleted successfully'
      });

    } catch (error) {
      console.error('Data deletion error:', error);
      res.status(500).json({ error: 'Deletion failed' });
    }
  });
}

// Helper functions for data processing

async function syncHeartRateData(userId: string, records: any[], deviceSource?: string): Promise<number> {
  const vitalsData = records.map(record => ({
    userId,
    heartRate: record.beatsPerMinute,
    oxygenSaturation: record.oxygenSaturation || null,
    recordedAt: new Date(record.time),
    dataSource: 'health_connect',
    deviceName: deviceSource || record.metadata?.device || 'Unknown Device'
  }));

  await storage.insertVitalsExtended(vitalsData);
  return vitalsData.length;
}

async function syncSleepData(userId: string, records: any[], deviceSource?: string): Promise<number> {
  const sleepSessions = records.map(record => ({
    userId,
    startTime: new Date(record.startTime),
    endTime: new Date(record.endTime),
    durationMinutes: Math.round((new Date(record.endTime).getTime() - new Date(record.startTime).getTime()) / 60000),
    sleepQualityScore: record.qualityScore || null,
    deepSleepMinutes: record.stages?.deepSleep || 0,
    lightSleepMinutes: record.stages?.lightSleep || 0,
    remSleepMinutes: record.stages?.remSleep || 0,
    awakeMinutes: record.stages?.awake || 0,
    dataSource: 'health_connect',
    deviceName: deviceSource || record.metadata?.device || 'Unknown Device'
  }));

  await storage.insertSleepSessions(sleepSessions);
  return sleepSessions.length;
}

async function syncExerciseData(userId: string, records: any[], deviceSource?: string): Promise<number> {
  const exerciseSessions = records.map(record => ({
    userId,
    exerciseType: record.exerciseType,
    startTime: new Date(record.startTime),
    endTime: new Date(record.endTime),
    durationMinutes: Math.round((new Date(record.endTime).getTime() - new Date(record.startTime).getTime()) / 60000),
    caloriesBurned: record.totalEnergyBurned || 0,
    distanceMeters: record.totalDistance || 0,
    steps: record.steps || 0,
    averageHeartRate: record.averageHeartRate || null,
    maxHeartRate: record.maxHeartRate || null,
    dataSource: 'health_connect',
    deviceName: deviceSource || record.metadata?.device || 'Unknown Device'
  }));

  await storage.insertExerciseSessions(exerciseSessions);
  return exerciseSessions.length;
}

async function syncNutritionData(userId: string, records: any[], deviceSource?: string): Promise<number> {
  const nutritionEntries = records.map(record => ({
    userId,
    recordedAt: new Date(record.time),
    mealType: record.mealType || null,
    calories: record.energy || 0,
    protein: record.protein || 0,
    carbohydrates: record.totalCarbohydrate || 0,
    fat: record.totalFat || 0,
    fiber: record.dietaryFiber || 0,
    sugar: record.sugar || 0,
    sodium: record.sodium || 0,
    waterIntake: record.hydration || 0,
    dataSource: 'health_connect',
    deviceName: deviceSource || record.metadata?.device || 'Unknown Device'
  }));

  await storage.insertNutritionData(nutritionEntries);
  return nutritionEntries.length;
}

async function syncStepsData(userId: string, records: any[], deviceSource?: string): Promise<number> {
  const dailyActivities = records.map(record => ({
    userId,
    activityDate: new Date(record.date).toISOString().split('T')[0],
    totalSteps: record.count || 0,
    totalCalories: record.calories || 0,
    totalDistanceMeters: record.distance || 0,
    activeMinutes: record.activeMinutes || 0,
    dataSource: 'health_connect'
  }));

  await storage.insertDailyActivity(dailyActivities);
  return dailyActivities.length;
}
