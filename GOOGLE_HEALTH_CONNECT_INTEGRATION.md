# Google Health Connect Integration Guide
## S.O.M.E fitness method Complete Implementation

### 🎯 Overview
Google Health Connect allows your app to securely access health and fitness data from multiple sources (Samsung Health, Fitbit, Google Fit, etc.) with user permission.

### 📋 Required Permissions for S.O.M.E Method

#### Sleep Data (S)
```xml
<uses-permission android:name="android.permission.health.READ_SLEEP" />
<uses-permission android:name="android.permission.health.WRITE_SLEEP" />
```

#### Heart Rate & Oxygen (O)
```xml
<uses-permission android:name="android.permission.health.READ_HEART_RATE" />
<uses-permission android:name="android.permission.health.READ_OXYGEN_SATURATION" />
<uses-permission android:name="android.permission.health.WRITE_HEART_RATE" />
```

#### Exercise & Movement (M)
```xml
<uses-permission android:name="android.permission.health.READ_STEPS" />
<uses-permission android:name="android.permission.health.READ_EXERCISE" />
<uses-permission android:name="android.permission.health.READ_DISTANCE" />
<uses-permission android:name="android.permission.health.READ_ACTIVE_CALORIES_BURNED" />
<uses-permission android:name="android.permission.health.WRITE_STEPS" />
<uses-permission android:name="android.permission.health.WRITE_EXERCISE" />
```

#### Nutrition (E)
```xml
<uses-permission android:name="android.permission.health.READ_NUTRITION" />
<uses-permission android:name="android.permission.health.WRITE_NUTRITION" />
<uses-permission android:name="android.permission.health.READ_HYDRATION" />
<uses-permission android:name="android.permission.health.WRITE_HYDRATION" />
```

### 🔧 Backend Database Schema

#### Health Connect Data Tables
```sql
-- Health Connect sync tracking
CREATE TABLE health_connect_sync (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    data_type TEXT NOT NULL, -- 'sleep', 'heart_rate', 'steps', etc.
    last_sync_time TIMESTAMP DEFAULT NOW(),
    sync_status TEXT DEFAULT 'active',
    device_source TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Comprehensive vitals with source tracking
CREATE TABLE vitals_extended (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    heart_rate INTEGER,
    oxygen_saturation INTEGER,
    blood_pressure_systolic INTEGER,
    blood_pressure_diastolic INTEGER,
    data_source TEXT NOT NULL, -- 'health_connect', 'manual', 'camera'
    device_name TEXT,
    recorded_at TIMESTAMP NOT NULL,
    synced_at TIMESTAMP DEFAULT NOW()
);

-- Sleep data from Health Connect
CREATE TABLE sleep_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    sleep_quality_score DECIMAL(3,2), -- 0.00 to 5.00
    deep_sleep_minutes INTEGER,
    light_sleep_minutes INTEGER,
    rem_sleep_minutes INTEGER,
    awake_minutes INTEGER,
    data_source TEXT DEFAULT 'health_connect',
    device_name TEXT,
    synced_at TIMESTAMP DEFAULT NOW()
);

-- Exercise sessions from Health Connect
CREATE TABLE exercise_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    exercise_type TEXT NOT NULL, -- 'walking', 'running', 'cycling', etc.
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP NOT NULL,
    duration_minutes INTEGER,
    calories_burned INTEGER,
    distance_meters DECIMAL(10,2),
    steps INTEGER,
    average_heart_rate INTEGER,
    max_heart_rate INTEGER,
    data_source TEXT DEFAULT 'health_connect',
    device_name TEXT,
    synced_at TIMESTAMP DEFAULT NOW()
);

-- Daily activity summaries
CREATE TABLE daily_activity (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES users(id),
    activity_date DATE NOT NULL,
    total_steps INTEGER DEFAULT 0,
    total_calories INTEGER DEFAULT 0,
    total_distance_meters DECIMAL(10,2) DEFAULT 0,
    active_minutes INTEGER DEFAULT 0,
    data_source TEXT DEFAULT 'health_connect',
    synced_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, activity_date, data_source)
);
```

### 🔗 API Endpoints for Health Connect

#### Sync Health Data
```javascript
// POST /api/health-connect/sync
app.post('/api/health-connect/sync', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const { dataType, records } = req.body;
  const userId = req.user.id;

  try {
    switch (dataType) {
      case 'heart_rate':
        await syncHeartRateData(userId, records);
        break;
      case 'sleep':
        await syncSleepData(userId, records);
        break;
      case 'exercise':
        await syncExerciseData(userId, records);
        break;
      case 'steps':
        await syncStepsData(userId, records);
        break;
      default:
        return res.status(400).json({ error: 'Unsupported data type' });
    }

    // Update sync status
    await storage.updateHealthConnectSync(userId, dataType);
    
    res.json({ 
      success: true, 
      synced: records.length,
      dataType 
    });

  } catch (error) {
    console.error('Health Connect sync error:', error);
    res.status(500).json({ error: 'Sync failed' });
  }
});

// GET /api/health-connect/status
app.get('/api/health-connect/status', async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const syncStatus = await storage.getHealthConnectStatus(req.user.id);
  res.json(syncStatus);
});
```

#### Data Processing Functions
```javascript
async function syncHeartRateData(userId, records) {
  const vitalsData = records.map(record => ({
    user_id: userId,
    heart_rate: record.beatsPerMinute,
    recorded_at: record.time,
    data_source: 'health_connect',
    device_name: record.metadata?.device || 'Unknown Device'
  }));

  await storage.insertVitalsData(vitalsData);
}

async function syncSleepData(userId, records) {
  const sleepSessions = records.map(record => ({
    user_id: userId,
    start_time: record.startTime,
    end_time: record.endTime,
    duration_minutes: Math.round((new Date(record.endTime) - new Date(record.startTime)) / 60000),
    deep_sleep_minutes: record.stages?.deepSleep || 0,
    light_sleep_minutes: record.stages?.lightSleep || 0,
    rem_sleep_minutes: record.stages?.remSleep || 0,
    awake_minutes: record.stages?.awake || 0,
    data_source: 'health_connect',
    device_name: record.metadata?.device || 'Unknown Device'
  }));

  await storage.insertSleepSessions(sleepSessions);
}
```

### 📱 Frontend Health Connect Interface

#### Health Connect Dashboard Component
```typescript
interface HealthConnectData {
  isConnected: boolean;
  lastSync: string;
  connectedDevices: string[];
  dataTypes: {
    heartRate: { enabled: boolean; lastSync: string };
    sleep: { enabled: boolean; lastSync: string };
    exercise: { enabled: boolean; lastSync: string };
    nutrition: { enabled: boolean; lastSync: string };
  };
}

export function HealthConnectDashboard() {
  const [healthData, setHealthData] = useState<HealthConnectData | null>(null);
  const [syncing, setSyncing] = useState(false);

  const syncHealthData = async () => {
    setSyncing(true);
    try {
      // Request Health Connect permissions
      const permissions = await requestHealthConnectPermissions();
      
      if (permissions.granted) {
        // Sync different data types
        await syncHeartRateData();
        await syncSleepData();
        await syncExerciseData();
        await syncNutritionData();
        
        // Update UI
        await refreshHealthStatus();
      }
    } catch (error) {
      console.error('Health Connect sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">Health Connect Integration</h2>
      
      {healthData?.isConnected ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-green-600">✅ Connected</span>
            <button 
              onClick={syncHealthData}
              disabled={syncing}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <DataTypeStatus title="Heart Rate" data={healthData.dataTypes.heartRate} />
            <DataTypeStatus title="Sleep" data={healthData.dataTypes.sleep} />
            <DataTypeStatus title="Exercise" data={healthData.dataTypes.exercise} />
            <DataTypeStatus title="Nutrition" data={healthData.dataTypes.nutrition} />
          </div>
          
          <div>
            <h3 className="font-medium mb-2">Connected Devices:</h3>
            <ul className="text-sm text-gray-600">
              {healthData.connectedDevices.map(device => (
                <li key={device}>• {device}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            Connect Health Connect to sync data from your fitness devices
          </p>
          <button 
            onClick={initializeHealthConnect}
            className="bg-green-600 text-white px-6 py-3 rounded-lg"
          >
            Connect Health Connect
          </button>
        </div>
      )}
    </div>
  );
}
```

### 🔐 Privacy & Security Implementation

#### Data Handling Policy
```typescript
// Privacy settings for Health Connect data
interface HealthDataPrivacy {
  dataRetentionDays: number; // Default: 365 days
  shareWithThirdParties: boolean; // Default: false
  allowAnalytics: boolean; // Default: false (explicit opt-in)
  exportEnabled: boolean; // Default: true
  deleteOnRequest: boolean; // Default: true (GDPR compliance)
}

// Secure data processing
export class HealthDataProcessor {
  static async processAndStore(userId: string, data: any, dataType: string) {
    // Encrypt sensitive health data before storage
    const encrypted = await encrypt(data, process.env.HEALTH_DATA_KEY);
    
    // Log access for audit trail
    await this.logDataAccess(userId, dataType, 'store');
    
    // Store with expiration
    return await storage.storeHealthData(userId, encrypted, dataType);
  }

  static async retrieveUserData(userId: string, dataType: string) {
    // Log access
    await this.logDataAccess(userId, dataType, 'retrieve');
    
    // Get encrypted data
    const encrypted = await storage.getHealthData(userId, dataType);
    
    // Decrypt and return
    return await decrypt(encrypted, process.env.HEALTH_DATA_KEY);
  }
}
```

### 📋 Google Play Store Requirements

#### App Store Listing Requirements
1. **Privacy Policy**: Must explicitly state Health Connect usage
2. **Permissions Rationale**: Explain why each permission is needed
3. **Data Handling**: Document how health data is processed and stored
4. **User Control**: Provide clear opt-out mechanisms

#### Required Documentation
```
Health Connect Integration Features:
✅ Read sleep data for sleep quality tracking
✅ Read heart rate for wellness monitoring
✅ Read exercise data for activity tracking
✅ Read nutrition data for meal planning
✅ Secure data encryption and storage
✅ User-controlled data sharing preferences
✅ GDPR-compliant data deletion
✅ Audit logging for data access
```

### 🚀 Implementation Timeline

**Phase 1: Backend Setup (Week 1)**
- Database schema implementation
- API endpoints for Health Connect sync
- Data processing and encryption

**Phase 2: Frontend Integration (Week 2)**
- Health Connect dashboard component
- Permission request flows
- Data visualization components

**Phase 3: Android App Integration (Week 3)**
- Health Connect SDK integration
- Permission manifest setup
- Background sync implementation

**Phase 4: Testing & Compliance (Week 4)**
- Privacy policy updates
- Google Play Store submission
- Security audit and documentation

This comprehensive Health Connect integration demonstrates professional health data handling required for Google Play Store approval.
