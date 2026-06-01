export interface DashboardMetrics {
  // Core Metrics
  totalUsers: number;
  activeUsers: number;
  averageTransactions: number;
  statementsUploaded: number;
  monthlyUploads: number;
  retentionRate: number;
  avgTransactionsParsed: number;
  monthlyUsedFeatures: number;

  // Trend Data (percentage change)
  usersTrend?: number;
  activeUsersTrend?: number;
  transactionsTrend?: number;
  statementsUploadedTrend?: number;
  monthlyUploadsTrend?: number;
  retentionRateTrend?: number;
  avgTransactionsParsedTrend?: number;
  monthlyUsedFeaturesTrend?: number;

  // Metadata
  lastUpdated?: string;
  dataPeriod?: string;
}

export interface DashboardResponse {
  success: boolean;
  data: DashboardMetrics;
  message?: string;
}