package com.example.googlefit

import android.content.Intent
import android.net.Uri
import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import com.example.googlefit.databinding.ActivityMainBinding
import androidx.health.connect.client.HealthConnectClient
import androidx.activity.result.contract.ActivityResultContracts
import kotlinx.coroutines.*
import android.util.Log
import android.widget.Toast
import androidx.health.connect.client.PermissionController
import java.time.Instant

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var healthConnectClient: HealthConnectClient
    private lateinit var fitDataHelper: FitDataHelper
    
    private val userId = 1 // Replace with actual user ID from your S.O.M.E app
    private val deviceId = "android_${android.os.Build.MODEL}_${System.currentTimeMillis()}"

    // Create the permissions launcher
    private val requestPermissionActivityContract = PermissionController.createRequestPermissionResultContract()
    private val requestPermissions = registerForActivityResult(requestPermissionActivityContract) { granted ->
        if (granted.containsAll(FitDataHelper.PERMISSIONS)) {
            // Permissions successfully granted
            Log.i("MainActivity", "All permissions granted")
            Toast.makeText(this, "Health permissions granted!", Toast.LENGTH_SHORT).show()
            registerDeviceWithSomeApp()
        } else {
            // Lack of required permissions
            Log.w("MainActivity", "Not all permissions granted")
            Toast.makeText(this, "Some permissions denied. App may not work properly.", Toast.LENGTH_LONG).show()
        }
    }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        // Check Health Connect availability before initializing
        checkHealthConnectAvailability()
    }

    private fun checkHealthConnectAvailability() {
        val providerPackageName = "com.google.android.apps.healthdata"
        val availabilityStatus = HealthConnectClient.getSdkStatus(this, providerPackageName)
        
        when (availabilityStatus) {
            HealthConnectClient.SDK_UNAVAILABLE -> {
                Log.e("MainActivity", "Health Connect SDK is unavailable")
                Toast.makeText(this, "Health Connect is not available on this device", Toast.LENGTH_LONG).show()
                return // Early return as there is no viable integration
            }
            HealthConnectClient.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED -> {
                Log.w("MainActivity", "Health Connect provider update required")
                Toast.makeText(this, "Health Connect needs to be updated. Redirecting to Play Store...", Toast.LENGTH_LONG).show()
                
                // Redirect to package installer to find a provider
                val uriString = "market://details?id=$providerPackageName&url=healthconnect%3A%2F%2Fonboarding"
                startActivity(
                    Intent(Intent.ACTION_VIEW).apply {
                        setPackage("com.android.vending")
                        data = Uri.parse(uriString)
                        putExtra("overlay", true)
                        putExtra("callerId", packageName)
                    }
                )
                return
            }
            HealthConnectClient.SDK_AVAILABLE -> {
                Log.i("MainActivity", "Health Connect SDK is available")
                // Initialize Health Connect client
                healthConnectClient = HealthConnectClient.getOrCreate(this)
                fitDataHelper = FitDataHelper(healthConnectClient)
                
                setupClickListeners()
                checkPermissionsAndRequestIfNeeded()
            }
        }
    }

    private fun setupClickListeners() {
        binding.btnReadHeartRate.setOnClickListener {
            fetchAndDisplayHeartRate()
        }

        binding.btnSyncToSome.setOnClickListener {
            syncAllDataToSomeApp()
        }

        binding.btnRegisterDevice.setOnClickListener {
            registerDeviceWithSomeApp()
        }
    }

    private fun checkPermissionsAndRequestIfNeeded() {
        CoroutineScope(Dispatchers.Main).launch {
            checkPermissionsAndRun(healthConnectClient)
        }
    }

    private suspend fun checkPermissionsAndRun(healthConnectClient: HealthConnectClient) {
        val granted = healthConnectClient.permissionController.getGrantedPermissions()
        if (granted.containsAll(FitDataHelper.PERMISSIONS)) {
            // Permissions already granted; proceed with inserting or reading data
            Log.i("MainActivity", "All permissions already granted")
            registerDeviceWithSomeApp()
        } else {
            Log.i("MainActivity", "Requesting missing permissions")
            requestPermissions.launch(FitDataHelper.PERMISSIONS)
        }
    }

    private fun fetchAndDisplayHeartRate() {
        binding.tvData.text = "Fetching heart rate data..."
        
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val heartRateRecords = fitDataHelper.fetchHeartRateData()
                val oxygenRecords = fitDataHelper.fetchOxygenSaturationData()
                
                val displayText = buildString {
                    appendLine("=== HEART RATE DATA ===")
                    if (heartRateRecords.isEmpty()) {
                        appendLine("No heart rate data found")
                    } else {
                        heartRateRecords.take(10).forEach { hr ->
                            appendLine("HR: ${hr.beatsPerMinute} BPM")
                            appendLine("Time: ${hr.time}")
                            appendLine("Device: ${hr.metadata.device?.model ?: "Unknown"}")
                            appendLine("---")
                        }
                    }
                    
                    appendLine("\n=== OXYGEN SATURATION ===")
                    if (oxygenRecords.isEmpty()) {
                        appendLine("No oxygen saturation data found")
                    } else {
                        oxygenRecords.take(5).forEach { ox ->
                            appendLine("O2 Sat: ${(ox.percentage.value * 100).toInt()}%")
                            appendLine("Time: ${ox.time}")
                            appendLine("---")
                        }
                    }
                }

                binding.tvData.text = displayText
                
            } catch (e: Exception) {
                Log.e("MainActivity", "Error fetching data", e)
                binding.tvData.text = "Error fetching data: ${e.message}"
            }
        }
    }

    private fun syncAllDataToSomeApp() {
        binding.tvData.text = "Syncing data to S.O.M.E app..."
        
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val result = fitDataHelper.syncToSomeApp(userId)
                
                result.fold(
                    onSuccess = { message ->
                        binding.tvData.text = "✅ Sync Successful!\n\n$message"
                        Toast.makeText(this@MainActivity, "Data synced successfully!", Toast.LENGTH_SHORT).show()
                    },
                    onFailure = { error ->
                        binding.tvData.text = "❌ Sync Failed!\n\nError: ${error.message}"
                        Toast.makeText(this@MainActivity, "Sync failed: ${error.message}", Toast.LENGTH_LONG).show()
                    }
                )
            } catch (e: Exception) {
                Log.e("MainActivity", "Error during sync", e)
                binding.tvData.text = "Error during sync: ${e.message}"
            }
        }
    }

    private fun registerDeviceWithSomeApp() {
        CoroutineScope(Dispatchers.Main).launch {
            try {
                val result = fitDataHelper.registerDevice(userId, deviceId)
                
                result.fold(
                    onSuccess = { response ->
                        Log.i("MainActivity", "Device registered: $response")
                        Toast.makeText(this@MainActivity, "Device registered with S.O.M.E app!", Toast.LENGTH_SHORT).show()
                    },
                    onFailure = { error ->
                        Log.e("MainActivity", "Registration failed", error)
                        Toast.makeText(this@MainActivity, "Registration failed: ${error.message}", Toast.LENGTH_LONG).show()
                    }
                )
            } catch (e: Exception) {
                Log.e("MainActivity", "Error during registration", e)
            }
        }
    }
}