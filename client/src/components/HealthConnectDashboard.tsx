import React, { useState, useEffect } from 'react';
import { Heart, Moon, Activity, Apple, Smartphone, RefreshCw, Shield, Download, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';

interface HealthConnectData {
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

interface DataTypeStatusProps {
  title: string;
  icon: React.ReactNode;
  data: { enabled: boolean; lastSync: string | null; recordCount: number };
}

function DataTypeStatus({ title, icon, data }: DataTypeStatusProps) {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="font-medium">{title}</span>
        {data.enabled ? (
          <span className="text-green-600 text-sm">✓</span>
        ) : (
          <span className="text-gray-400 text-sm">○</span>
        )}
      </div>
      <div className="text-sm text-gray-600">
        <div>Records: {data.recordCount}</div>
        {data.lastSync && (
          <div>Last sync: {new Date(data.lastSync).toLocaleDateString()}</div>
        )}
      </div>
    </div>
  );
}

export default function HealthConnectDashboard() {
  const [syncing, setSyncing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch Health Connect status
  const { data: healthData, isLoading } = useQuery<HealthConnectData>({
    queryKey: ['/api/health-connect/status'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  // Sync Health Connect data mutation
  const syncMutation = useMutation({
    mutationFn: async (dataType: string) => {
      const response = await apiRequest(`/api/health-connect/sync`, 'POST', {
        dataType,
        records: [], // This would be populated by the Health Connect SDK
        syncTimestamp: new Date().toISOString()
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health-connect/status'] });
      toast({
        title: "Sync Complete",
        description: "Health data synchronized successfully",
      });
    },
    onError: () => {
      toast({
        title: "Sync Failed",
        description: "Unable to sync health data. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Initialize Health Connect
  const initializeMutation = useMutation({
    mutationFn: async () => {
      // In a real app, this would request Health Connect permissions
      const permissions = [
        'android.permission.health.READ_HEART_RATE',
        'android.permission.health.READ_SLEEP',
        'android.permission.health.READ_EXERCISE',
        'android.permission.health.READ_STEPS',
        'android.permission.health.READ_NUTRITION'
      ];

      const response = await apiRequest('/api/health-connect/initialize', 'POST', {
        permissions
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/health-connect/status'] });
      toast({
        title: "Health Connect Connected",
        description: "Successfully connected to Health Connect",
      });
    },
    onError: () => {
      toast({
        title: "Connection Failed",
        description: "Unable to connect to Health Connect",
        variant: "destructive",
      });
    }
  });

  const syncAllData = async () => {
    setSyncing(true);
    try {
      const dataTypes = ['heart_rate', 'sleep', 'exercise', 'nutrition', 'steps'];
      for (const dataType of dataTypes) {
        await syncMutation.mutateAsync(dataType);
      }
    } catch (error) {
      console.error('Sync failed:', error);
    } finally {
      setSyncing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center gap-2 mb-6">
        <Smartphone className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-semibold">Health Connect Integration</h2>
      </div>
      
      {healthData?.isConnected ? (
        <div className="space-y-6">
          {/* Connection Status */}
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
            <div className="flex items-center gap-2">
              <span className="text-green-600 text-lg">✓</span>
              <span className="text-green-800 font-medium">Connected to Health Connect</span>
            </div>
            <button 
              onClick={syncAllData}
              disabled={syncing || syncMutation.isPending}
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Syncing...' : 'Sync Now'}
            </button>
          </div>

          {/* Data Type Status Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <DataTypeStatus 
              title="Heart Rate" 
              icon={<Heart className="w-5 h-5 text-red-500" />}
              data={healthData.dataTypes.heartRate} 
            />
            <DataTypeStatus 
              title="Sleep" 
              icon={<Moon className="w-5 h-5 text-purple-500" />}
              data={healthData.dataTypes.sleep} 
            />
            <DataTypeStatus 
              title="Exercise" 
              icon={<Activity className="w-5 h-5 text-green-500" />}
              data={healthData.dataTypes.exercise} 
            />
            <DataTypeStatus 
              title="Nutrition" 
              icon={<Apple className="w-5 h-5 text-orange-500" />}
              data={healthData.dataTypes.nutrition} 
            />
            <DataTypeStatus 
              title="Steps" 
              icon={<Activity className="w-5 h-5 text-blue-500" />}
              data={healthData.dataTypes.steps} 
            />
          </div>

          {/* Connected Devices */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              Connected Devices
            </h3>
            {healthData.connectedDevices.length > 0 ? (
              <ul className="space-y-2">
                {healthData.connectedDevices.map((device, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    {device}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No devices connected</p>
            )}
          </div>

          {/* Permissions Status */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Data Permissions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <div className="font-medium text-green-600 mb-1">Granted ({healthData.permissions.granted.length})</div>
                <ul className="space-y-1">
                  {healthData.permissions.granted.map((permission, index) => (
                    <li key={index} className="text-gray-600">• {permission}</li>
                  ))}
                </ul>
              </div>
              {healthData.permissions.denied.length > 0 && (
                <div>
                  <div className="font-medium text-red-600 mb-1">Denied ({healthData.permissions.denied.length})</div>
                  <ul className="space-y-1">
                    {healthData.permissions.denied.map((permission, index) => (
                      <li key={index} className="text-gray-600">• {permission}</li>
                    ))}
                  </ul>
                </div>
              )}
              {healthData.permissions.pending.length > 0 && (
                <div>
                  <div className="font-medium text-yellow-600 mb-1">Pending ({healthData.permissions.pending.length})</div>
                  <ul className="space-y-1">
                    {healthData.permissions.pending.map((permission, index) => (
                      <li key={index} className="text-gray-600">• {permission}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Data Management */}
          <div className="border-t pt-4">
            <h3 className="font-medium mb-3">Data Management</h3>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50">
                <Download className="w-4 h-4" />
                Export Data
              </button>
              <button className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded hover:bg-red-50">
                <Trash2 className="w-4 h-4" />
                Delete Data
              </button>
            </div>
          </div>

          {/* Last Sync Info */}
          {healthData.lastSync && (
            <div className="text-sm text-gray-500 text-center">
              Last synchronized: {new Date(healthData.lastSync).toLocaleString()}
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <Smartphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Connect Health Connect</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Sync data from your fitness devices and health apps to get personalized insights 
            and track your S.O.M.E wellness journey automatically.
          </p>
          
          <div className="space-y-4 mb-6">
            <div className="text-sm text-gray-500">
              <p className="font-medium mb-2">Supported data types:</p>
              <div className="flex flex-wrap justify-center gap-4">
                <span className="flex items-center gap-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  Heart Rate
                </span>
                <span className="flex items-center gap-1">
                  <Moon className="w-4 h-4 text-purple-500" />
                  Sleep
                </span>
                <span className="flex items-center gap-1">
                  <Activity className="w-4 h-4 text-green-500" />
                  Exercise
                </span>
                <span className="flex items-center gap-1">
                  <Apple className="w-4 h-4 text-orange-500" />
                  Nutrition
                </span>
              </div>
            </div>
          </div>
          
          <button 
            onClick={() => initializeMutation.mutate()}
            disabled={initializeMutation.isPending}
            className="bg-green-600 text-white px-6 py-3 rounded-lg disabled:opacity-50 flex items-center gap-2 mx-auto"
          >
            <Smartphone className="w-5 h-5" />
            {initializeMutation.isPending ? 'Connecting...' : 'Connect Health Connect'}
          </button>
          
          <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm">
            <p className="text-blue-800">
              <strong>Privacy:</strong> Your health data is encrypted and stored securely. 
              You can export or delete your data at any time.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
