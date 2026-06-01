'use client';

import { FC } from 'react';

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon?: string;
  trend?: number;
  suffix?: string;
  decimals?: number;
}

const DashboardCard: FC<DashboardCardProps> = ({
  title,
  value,
  icon = '📊',
  trend,
  suffix = '',
  decimals = 0,
}) => {
  const isTrendPositive = trend !== undefined && trend >= 0;
  const trendColor = isTrendPositive ? 'text-green-600' : 'text-red-600';
  const trendBgColor = isTrendPositive ? 'bg-green-50' : 'bg-red-50';

  const formattedValue = typeof value === 'number' 
    ? decimals > 0 
      ? value.toFixed(decimals)
      : Math.floor(value).toLocaleString()
    : value;

  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900">
            {formattedValue}
            {suffix && <span className="text-xl ml-1">{suffix}</span>}
          </p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>

      {trend !== undefined && (
        <div className={`mt-4 inline-block px-3 py-1 rounded-full text-sm font-medium ${trendBgColor} ${trendColor}`}>
          {isTrendPositive ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
        </div>
      )}
    </div>
  );
};

export default DashboardCard;