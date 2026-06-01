'use client';

import { useState, useEffect } from 'react';
import DashboardCard from '@/components/DashboardCard';
import { DashboardMetrics } from '@/types/dashboard';

export default function FounderDashboard() {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardMetrics = async () => {
      try {
        setLoading(true);
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://pesamind-backend.onrender.com';
        const response = await fetch(`${apiUrl}/api/dashboard/metrics`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard metrics');
        }
        
        const data = await response.json();
        setMetrics(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setMetrics(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardMetrics();
    
    // Refresh metrics every 30 seconds
    const interval = setInterval(fetchDashboardMetrics, 30000);
    
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Founder Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Founder Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Founder Dashboard</h1>
          <p className="text-gray-600 mt-2">Real-time analytics and metrics</p>
        </div>

        {/* Primary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <DashboardCard
            title="Total Users"
            value={metrics?.totalUsers || 0}
            icon="👥"
            trend={metrics?.usersTrend}
          />
          <DashboardCard
            title="Active Users"
            value={metrics?.activeUsers || 0}
            icon="✨"
            trend={metrics?.activeUsersTrend}
          />
          <DashboardCard
            title="Average Transactions"
            value={metrics?.averageTransactions || 0}
            icon="💰"
            decimals={2}
            trend={metrics?.transactionsTrend}
          />
          <DashboardCard
            title="Statements Uploaded"
            value={metrics?.statementsUploaded || 0}
            icon="📄"
            trend={metrics?.statementsUploadedTrend}
          />
        </div>

        {/* Secondary Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            title="Monthly Uploads"
            value={metrics?.monthlyUploads || 0}
            icon="📊"
            trend={metrics?.monthlyUploadsTrend}
          />
          <DashboardCard
            title="Retention Rate"
            value={metrics?.retentionRate || 0}
            icon="📈"
            suffix="%"
            decimals={1}
            trend={metrics?.retentionRateTrend}
          />
          <DashboardCard
            title="Avg Transactions Parsed"
            value={metrics?.avgTransactionsParsed || 0}
            icon="🔍"
            decimals={2}
            trend={metrics?.avgTransactionsParsedTrend}
          />
          <DashboardCard
            title="Monthly Used Features"
            value={metrics?.monthlyUsedFeatures || 0}
            icon="⚙️"
            trend={metrics?.monthlyUsedFeaturesTrend}
          />
        </div>

        {/* Additional Info Section */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Dashboard Info</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="text-lg font-medium text-gray-900">
                {metrics?.lastUpdated ? new Date(metrics.lastUpdated).toLocaleString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Data Period</p>
              <p className="text-lg font-medium text-gray-900">
                {metrics?.dataPeriod || 'Current Month'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}