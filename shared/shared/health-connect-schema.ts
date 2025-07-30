import { pgTable, text, integer, timestamp, decimal, date, uuid, boolean } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

// Health Connect sync tracking
export const healthConnectSync = pgTable('health_connect_sync', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  dataType: text('data_type').notNull(), // 'sleep', 'heart_rate', 'steps', etc.
  lastSyncTime: timestamp('last_sync_time').defaultNow(),
  syncStatus: text('sync_status').default('active'),
  deviceSource: text('device_source'),
  createdAt: timestamp('created_at').defaultNow(),
});

// Extended vitals with source tracking
export const vitalsExtended = pgTable('vitals_extended', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  heartRate: integer('heart_rate'),
  oxygenSaturation: integer('oxygen_saturation'),
  bloodPressureSystolic: integer('blood_pressure_systolic'),
  bloodPressureDiastolic: integer('blood_pressure_diastolic'),
  dataSource: text('data_source').notNull(), // 'health_connect', 'manual', 'camera'
  deviceName: text('device_name'),
  recordedAt: timestamp('recorded_at').notNull(),
  syncedAt: timestamp('synced_at').defaultNow(),
});

// Sleep sessions from Health Connect
export const sleepSessions = pgTable('sleep_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  durationMinutes: integer('duration_minutes'),
  sleepQualityScore: decimal('sleep_quality_score', { precision: 3, scale: 2 }), // 0.00 to 5.00
  deepSleepMinutes: integer('deep_sleep_minutes'),
  lightSleepMinutes: integer('light_sleep_minutes'),
  remSleepMinutes: integer('rem_sleep_minutes'),
  awakeMinutes: integer('awake_minutes'),
  dataSource: text('data_source').default('health_connect'),
  deviceName: text('device_name'),
  syncedAt: timestamp('synced_at').defaultNow(),
});

// Exercise sessions from Health Connect
export const exerciseSessions = pgTable('exercise_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  exerciseType: text('exercise_type').notNull(), // 'walking', 'running', 'cycling', etc.
  startTime: timestamp('start_time').notNull(),
  endTime: timestamp('end_time').notNull(),
  durationMinutes: integer('duration_minutes'),
  caloriesBurned: integer('calories_burned'),
  distanceMeters: decimal('distance_meters', { precision: 10, scale: 2 }),
  steps: integer('steps'),
  averageHeartRate: integer('average_heart_rate'),
  maxHeartRate: integer('max_heart_rate'),
  dataSource: text('data_source').default('health_connect'),
  deviceName: text('device_name'),
  syncedAt: timestamp('synced_at').defaultNow(),
});

// Daily activity summaries
export const dailyActivity = pgTable('daily_activity', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  activityDate: date('activity_date').notNull(),
  totalSteps: integer('total_steps').default(0),
  totalCalories: integer('total_calories').default(0),
  totalDistanceMeters: decimal('total_distance_meters', { precision: 10, scale: 2 }).default('0'),
  activeMinutes: integer('active_minutes').default(0),
  dataSource: text('data_source').default('health_connect'),
  syncedAt: timestamp('synced_at').defaultNow(),
});

// Nutrition data from Health Connect
export const nutritionData = pgTable('nutrition_data', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  recordedAt: timestamp('recorded_at').notNull(),
  mealType: text('meal_type'), // 'breakfast', 'lunch', 'dinner', 'snack'
  calories: integer('calories'),
  protein: decimal('protein', { precision: 8, scale: 2 }), // grams
  carbohydrates: decimal('carbohydrates', { precision: 8, scale: 2 }), // grams
  fat: decimal('fat', { precision: 8, scale: 2 }), // grams
  fiber: decimal('fiber', { precision: 8, scale: 2 }), // grams
  sugar: decimal('sugar', { precision: 8, scale: 2 }), // grams
  sodium: decimal('sodium', { precision: 8, scale: 2 }), // mg
  waterIntake: decimal('water_intake', { precision: 8, scale: 2 }), // ml
  dataSource: text('data_source').default('health_connect'),
  deviceName: text('device_name'),
  syncedAt: timestamp('synced_at').defaultNow(),
});

// Health Connect permissions tracking
export const healthConnectPermissions = pgTable('health_connect_permissions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  permissionType: text('permission_type').notNull(), // 'READ_HEART_RATE', 'READ_SLEEP', etc.
  isGranted: boolean('is_granted').notNull(),
  grantedAt: timestamp('granted_at'),
  revokedAt: timestamp('revoked_at'),
  lastChecked: timestamp('last_checked').defaultNow(),
});

// Data export requests for GDPR compliance
export const dataExportRequests = pgTable('data_export_requests', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').notNull().references(() => users.id),
  requestedAt: timestamp('requested_at').defaultNow(),
  dataTypes: text('data_types').array(), // JSON array of requested data types
  status: text('status').default('pending'), // 'pending', 'processing', 'completed', 'failed'
  exportFileUrl: text('export_file_url'),
  completedAt: timestamp('completed_at'),
  expiresAt: timestamp('expires_at'), // Export link expiration
});

// Import references to users table (assuming it exists)
import { users } from './schema';

// Zod schemas for validation
export const insertHealthConnectSyncSchema = createInsertSchema(healthConnectSync);
export const insertVitalsExtendedSchema = createInsertSchema(vitalsExtended);
export const insertSleepSessionSchema = createInsertSchema(sleepSessions);
export const insertExerciseSessionSchema = createInsertSchema(exerciseSessions);
export const insertDailyActivitySchema = createInsertSchema(dailyActivity);
export const insertNutritionDataSchema = createInsertSchema(nutritionData);
export const insertHealthConnectPermissionsSchema = createInsertSchema(healthConnectPermissions);
export const insertDataExportRequestSchema = createInsertSchema(dataExportRequests);

// Types for TypeScript
export type HealthConnectSync = typeof healthConnectSync.$inferSelect;
export type InsertHealthConnectSync = z.infer<typeof insertHealthConnectSyncSchema>;

export type VitalsExtended = typeof vitalsExtended.$inferSelect;
export type InsertVitalsExtended = z.infer<typeof insertVitalsExtendedSchema>;

export type SleepSession = typeof sleepSessions.$inferSelect;
export type InsertSleepSession = z.infer<typeof insertSleepSessionSchema>;

export type ExerciseSession = typeof exerciseSessions.$inferSelect;
export type InsertExerciseSession = z.infer<typeof insertExerciseSessionSchema>;

export type DailyActivity = typeof dailyActivity.$inferSelect;
export type InsertDailyActivity = z.infer<typeof insertDailyActivitySchema>;

export type NutritionData = typeof nutritionData.$inferSelect;
export type InsertNutritionData = z.infer<typeof insertNutritionDataSchema>;

export type HealthConnectPermissions = typeof healthConnectPermissions.$inferSelect;
export type InsertHealthConnectPermissions = z.infer<typeof insertHealthConnectPermissionsSchema>;

export type DataExportRequest = typeof dataExportRequests.$inferSelect;
export type InsertDataExportRequest = z.infer<typeof insertDataExportRequestSchema>;

// Health Connect data sync interface
export interface HealthConnectDataSync {
  dataType: 'heart_rate' | 'sleep' | 'exercise' | 'nutrition' | 'steps';
  records: any[];
  deviceSource?: string;
  syncTimestamp: string;
}

// Health Connect status interface
export interface HealthConnectStatus {
  isConnected: boolean;
  lastSync: string | null;
  connectedDevices: string[];
  dataTypes: {
    heartRate: { enabled: boolean; lastSync: string | null; recordCount: number };
    sleep: { enabled: boolean; lastSync: string | null; recordCount: number };
    exercise: { enabled: boolean; lastSync: string | null; recordCount: number };
    nutrition: { enabled: boolean; lastSync: string | null; recordCount: number };
    steps: { enabled: boolean; lastSync: string | null; recordCount: number };
  };
  permissions: {
    granted: string[];
    denied: string[];
    pending: string[];
  };
}