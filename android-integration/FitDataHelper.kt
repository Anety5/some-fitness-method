package com.example.googlefit

import androidx.health.connect.client.HealthConnectClient
import androidx.health.connect.client.permission.HealthPermission
import androidx.health.connect.client.records.*
import androidx.health.connect.client.request.ReadRecordsRequest
import androidx.health.connect.client.request.AggregateRequest
import androidx.health.connect.client.aggregate.AggregationResult
import androidx.health.connect.client.time.TimeRangeFilter
import androidx.health.connect.client.metadata.Device
import androidx.health.connect.client.metadata.Metadata
import java.time.Duration
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import java.time.Instant
import java.time.ZoneOffset
import android.util.Log
import okhttp3.*
import okhttp3.MediaType.Companion.toMediaType
import org.json.JSONArray
import org.json.JSONObject
import java.io.IOException
import java.time.format.DateTimeFormatter

class FitDataHelper(private val healthConnectClient: HealthConnectClient) {
    
    private val client = OkHttpClient()
    private val baseUrl = "https://your-some-app.replit.app" // Replace with your actual S.O.M.E app URL
    
    companion object {
        // Create a set of permissions for required data types
        val PERMISSIONS = setOf(
            HealthPermission.getReadPermission(HeartRateRecord::class),
            HealthPermission.getWritePermission(HeartRateRecord::class),
            HealthPermission.getReadPermission(StepsRecord::class),
            HealthPermission.getWritePermission(StepsRecord::class),
            HealthPermission.getReadPermission(SleepSessionRecord::class),
            HealthPermission.getWritePermission(SleepSessionRecord::class),
            HealthPermission.getReadPermission(OxygenSaturationRecord::class),
            HealthPermission.getWritePermission(OxygenSaturationRecord::class),
            HealthPermission.getReadPermission(ActiveCaloriesBurnedRecord::class),
            HealthPermission.getWritePermission(ActiveCaloriesBurnedRecord::class),
            // Permission to read health data beyond 30 days prior to permission grant
            HealthPermission.PERMISSION_READ_HEALTH_DATA_HISTORY
        )
    }

    // Fetch heart rate data from Health Connect
    suspend fun fetchHeartRateData(startTime: Instant = Instant.now().minusSeconds(3600)): List<HeartRateRecord> {
        return withContext(Dispatchers.IO) {
            try {
                val request = ReadRecordsRequest(
                    recordType = HeartRateRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(startTime, Instant.now())
                )
                val response = healthConnectClient.readRecords(request)
                response.records
            } catch (e: Exception) {
                Log.e("FitDataHelper", "Error fetching heart rate data", e)
                emptyList()
            }
        }
    }

    // Fetch sleep data from Health Connect
    suspend fun fetchSleepData(startTime: Instant = Instant.now().minusSeconds(86400)): List<SleepSessionRecord> {
        return withContext(Dispatchers.IO) {
            try {
                val request = ReadRecordsRequest(
                    recordType = SleepSessionRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(startTime, Instant.now())
                )
                val response = healthConnectClient.readRecords(request)
                response.records
            } catch (e: Exception) {
                Log.e("FitDataHelper", "Error fetching sleep data", e)
                emptyList()
            }
        }
    }

    // Fetch oxygen saturation data
    suspend fun fetchOxygenSaturationData(startTime: Instant = Instant.now().minusSeconds(3600)): List<OxygenSaturationRecord> {
        return withContext(Dispatchers.IO) {
            try {
                val request = ReadRecordsRequest(
                    recordType = OxygenSaturationRecord::class,
                    timeRangeFilter = TimeRangeFilter.between(startTime, Instant.now())
                )
                val response = healthConnectClient.readRecords(request)
                response.records
            } catch (e: Exception) {
                Log.e("FitDataHelper", "Error fetching oxygen saturation data", e)
                emptyList()
            }
        }
    }

    // Sync all health data to S.O.M.E web app
    suspend fun syncToSomeApp(userId: Int): Result<String> {
        return withContext(Dispatchers.IO) {
            try {
                // Fetch data from Health Connect
                val heartRateData = fetchHeartRateData()
                val oxygenData = fetchOxygenSaturationData()
                val sleepData = fetchSleepData()

                // Prepare vitals data for API
                val vitalsArray = JSONArray()
                
                // Combine heart rate and oxygen saturation by timestamp
                val vitalsByTime = mutableMapOf<Instant, JSONObject>()
                
                heartRateData.forEach { hr ->
                    val timestamp = hr.time
                    val vital = vitalsByTime.getOrPut(timestamp) { 
                        JSONObject().apply {
                            put("timestamp", timestamp.toString())
                            put("deviceInfo", hr.metadata.device?.model ?: "Unknown Device")
                            put("externalId", "hc_hr_${hr.metadata.id}")
                        }
                    }
                    vital.put("heartRate", hr.beatsPerMinute)
                }

                oxygenData.forEach { ox ->
                    val timestamp = ox.time
                    val vital = vitalsByTime.getOrPut(timestamp) { 
                        JSONObject().apply {
                            put("timestamp", timestamp.toString())
                            put("deviceInfo", ox.metadata.device?.model ?: "Unknown Device")
                            put("externalId", "hc_ox_${ox.metadata.id}")
                        }
                    }
                    vital.put("oxygenSaturation", (ox.percentage.value * 100).toInt())
                }

                vitalsByTime.values.forEach { vitalsArray.put(it) }

                // Prepare sleep data for API
                val sleepArray = JSONArray()
                sleepData.forEach { sleep ->
                    val sleepObj = JSONObject().apply {
                        put("timestamp", sleep.startTime.toString())
                        put("bedtime", sleep.startTime.toString())
                        put("wakeTime", sleep.endTime.toString())
                        put("duration", (sleep.endTime.epochSecond - sleep.startTime.epochSecond) / 60) // minutes
                        put("quality", "7.5") // Default quality, could be enhanced with sleep stages
                    }
                    sleepArray.put(sleepObj)
                }

                // Create sync payload
                val payload = JSONObject().apply {
                    put("userId", userId)
                    put("vitals", vitalsArray)
                    put("sleepData", sleepArray)
                }

                // Send to S.O.M.E app API
                val requestBody = RequestBody.create(
                    "application/json".toMediaType(),
                    payload.toString()
                )

                val request = Request.Builder()
                    .url("$baseUrl/api/health-connect/sync")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()

                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    val responseBody = response.body?.string() ?: ""
                    Log.i("FitDataHelper", "Sync successful: $responseBody")
                    Result.success("Successfully synced ${vitalsArray.length()} vitals and ${sleepArray.length()} sleep records")
                } else {
                    val errorBody = response.body?.string() ?: "Unknown error"
                    Log.e("FitDataHelper", "Sync failed: ${response.code} - $errorBody")
                    Result.failure(Exception("Sync failed: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e("FitDataHelper", "Error syncing data", e)
                Result.failure(e)
            }
        }
    }

    // Write health data back to Health Connect
    suspend fun writeHealthData(heartRate: Int? = null, steps: Long? = null, timestamp: Instant = Instant.now()): Result<String> {
        return withContext(Dispatchers.IO) {
            try {
                val records = mutableListOf<Record>()

                // Add heart rate record if provided
                heartRate?.let { hr ->
                    val heartRateRecord = HeartRateRecord(
                        time = timestamp,
                        zoneOffset = ZoneOffset.UTC,
                        beatsPerMinute = hr.toLong()
                    )
                    records.add(heartRateRecord)
                }

                // Add steps record if provided
                steps?.let { stepCount ->
                    val stepsRecord = StepsRecord(
                        count = stepCount,
                        startTime = timestamp.minusSeconds(3600), // 1 hour window
                        endTime = timestamp,
                        startZoneOffset = ZoneOffset.UTC,
                        endZoneOffset = ZoneOffset.UTC
                    )
                    records.add(stepsRecord)
                }

                if (records.isNotEmpty()) {
                    // Write your record using insertRecords
                    healthConnectClient.insertRecords(records)
                    Log.i("FitDataHelper", "Successfully wrote ${records.size} records to Health Connect")
                    Result.success("Wrote ${records.size} health records")
                } else {
                    Result.success("No data to write")
                }
            } catch (e: Exception) {
                Log.e("FitDataHelper", "Error writing health data", e)
                Result.failure(e)
            }
        }
    }

    // Read heart rate data by time range using readRecords
    suspend fun readHeartRateByTimeRange(
        healthConnectClient: HealthConnectClient,
        startTime: Instant,
        endTime: Instant
    ): Result<List<HeartRateRecord>> {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient.readRecords(
                    ReadRecordsRequest(
                        HeartRateRecord::class,
                        timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
                    )
                )
                val records = mutableListOf<HeartRateRecord>()
                for (record in response.records) {
                    // Process each record
                    records.add(record)
                    Log.d("FitDataHelper", "Heart Rate: ${record.beatsPerMinute} BPM at ${record.time}")
                }
                Log.i("FitDataHelper", "Successfully read ${records.size} heart rate records")
                Result.success(records)
            } catch (e: Exception) {
                // Run error handling here
                Log.e("FitDataHelper", "Error reading heart rate data", e)
                Result.failure(e)
            }
        }
    }

    // Read aggregated steps data to avoid double counting from multiple sources
    suspend fun readAggregatedSteps(
        healthConnectClient: HealthConnectClient,
        startTime: Instant,
        endTime: Instant
    ): Result<Long> {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient.aggregate(
                    AggregateRequest(
                        metrics = setOf(StepsRecord.COUNT_TOTAL),
                        timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
                    )
                )
                val totalSteps = response[StepsRecord.COUNT_TOTAL] ?: 0L
                Log.i("FitDataHelper", "Total aggregated steps: $totalSteps")
                Result.success(totalSteps)
            } catch (e: Exception) {
                Log.e("FitDataHelper", "Error reading aggregated steps", e)
                Result.failure(e)
            }
        }
    }



    // Aggregate steps with proper null handling when no data is available
    suspend fun aggregateSteps(
        healthConnectClient: HealthConnectClient,
        startTime: Instant,
        endTime: Instant
    ): Result<Long?> {
        return withContext(Dispatchers.IO) {
            try {
                val response = healthConnectClient.aggregate(
                    AggregateRequest(
                        metrics = setOf(StepsRecord.COUNT_TOTAL),
                        timeRangeFilter = TimeRangeFilter.between(startTime, endTime)
                    )
                )
                // The result may be null if no data is available in the time range
                val stepCount = response[StepsRecord.COUNT_TOTAL]
                Log.i("FitDataHelper", "Aggregated steps: ${stepCount ?: "No data available"}")
                Result.success(stepCount)
            } catch (e: Exception) {
                // Run error handling here
                Log.e("FitDataHelper", "Error aggregating steps", e)
                Result.failure(e)
            }
        }
    }

    // Insert steps record using Health Connect best practices
    suspend fun insertSteps(healthConnectClient: HealthConnectClient): Result<String> {
        return withContext(Dispatchers.IO) {
            val endTime = Instant.now()
            val startTime = endTime.minus(Duration.ofMinutes(15))
            try {
                val stepsRecord = StepsRecord(
                    count = 120,
                    startTime = startTime,
                    endTime = endTime,
                    startZoneOffset = ZoneOffset.UTC,
                    endZoneOffset = ZoneOffset.UTC,
                    metadata = Metadata.autoRecorded(
                        device = Device(type = Device.TYPE_WATCH)
                    ),
                )
                healthConnectClient.insertRecords(listOf(stepsRecord))
                Log.i("FitDataHelper", "Successfully inserted steps record: 120 steps")
                Result.success("Successfully inserted steps record")
            } catch (e: Exception) {
                // Run error handling here
                Log.e("FitDataHelper", "Error inserting steps record", e)
                Result.failure(e)
            }
        }
    }

    // Register device with S.O.M.E app
    suspend fun registerDevice(userId: Int, deviceId: String): Result<String> {
        return withContext(Dispatchers.IO) {
            try {
                val payload = JSONObject().apply {
                    put("userId", userId)
                    put("deviceId", deviceId)
                    put("permissions", JSONArray(PERMISSIONS.map { it.toString() }))
                }

                val requestBody = RequestBody.create(
                    "application/json".toMediaType(),
                    payload.toString()
                )

                val request = Request.Builder()
                    .url("$baseUrl/api/health-connect/register")
                    .post(requestBody)
                    .addHeader("Content-Type", "application/json")
                    .build()

                val response = client.newCall(request).execute()
                
                if (response.isSuccessful) {
                    val responseBody = response.body?.string() ?: ""
                    Log.i("FitDataHelper", "Registration successful: $responseBody")
                    Result.success(responseBody)
                } else {
                    Result.failure(Exception("Registration failed: ${response.code}"))
                }
            } catch (e: Exception) {
                Log.e("FitDataHelper", "Error registering device", e)
                Result.failure(e)
            }
        }
    }
}
