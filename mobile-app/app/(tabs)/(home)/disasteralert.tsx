// ============================================================
// app/index.jsx — Kerala Disaster Alert Dashboard
// Shows all 14 districts in a color-coded table
// Stack: Expo + NativeWind (Tailwind CSS for RN)
// ============================================================

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from 'react-native';
import { getAllDistricts } from '../../../services/disasterServices';
import { usePushNotification } from '../../../hooks/usePushNotification';
import { AppBar } from '@/components/AppBar';

// ── Alert level config ────────────────────────────────────────
const LEVEL_CONFIG = {
  RED: {
    label: '🔴 DANGER',
    bg: 'bg-red-50',
    border: 'border-red-400',
    badge: 'bg-red-500',
    badgeText: 'text-white',
    dot: '#EF4444',
  },
  ORANGE: {
    label: '🟠 WATCH',
    bg: 'bg-orange-50',
    border: 'border-orange-400',
    badge: 'bg-orange-500',
    badgeText: 'text-white',
    dot: '#F97316',
  },
  GREEN: {
    label: '🟢 SAFE',
    bg: 'bg-green-50',
    border: 'border-green-400',
    badge: 'bg-green-500',
    badgeText: 'text-white',
    dot: '#22C55E',
  },
};

type AlertLevel = keyof typeof LEVEL_CONFIG;

// ── Alert Badge ───────────────────────────────────────────────
function AlertBadge({ level }: { level: AlertLevel }) {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.GREEN;
  return (
    <View className={`rounded-full px-2 py-1 ${cfg.badge}`}>
      <Text className={`text-xs font-semibold ${cfg.badgeText}`}>{cfg.label}</Text>
    </View>
  );
}

// ── District Row ──────────────────────────────────────────────
function DistrictRow({ item, isLast }: { item: any; isLast: boolean }) {
  const cfg = LEVEL_CONFIG[item.alertLevel] ?? LEVEL_CONFIG.GREEN;

  return (
    <View
      className={`
        mx-4 mb-3 rounded-2xl border ${cfg.border} ${cfg.bg}
        overflow-hidden
      `}
    >
      {/* Header row */}
      <View className="flex-row items-center justify-between px-4 pt-3 pb-2">
        <View className="flex-row items-center gap-2">
          {/* Colored dot */}
          <View
            style={{ backgroundColor: cfg.dot, width: 10, height: 10, borderRadius: 5 }}
          />
          <Text className="text-base font-bold text-slate-800">{item.district}</Text>
          {item.baseRisk === 'EXTREME' && (
            <View className="rounded bg-red-100 px-1.5 py-0.5">
              <Text className="text-xs font-medium text-red-700">High Risk Zone</Text>
            </View>
          )}
        </View>
        <AlertBadge level={item.alertLevel} />
      </View>

      {/* Description */}
      <View className="px-4 pb-2">
        <Text className="text-sm text-slate-600 leading-5">{item.description}</Text>
      </View>

      {/* Data pills row */}
      <View className="flex-row flex-wrap gap-2 px-4 pb-3">
        {item.rainMm != null && (
          <View className="flex-row items-center rounded-lg bg-blue-100 px-2.5 py-1 gap-1">
            <Text className="text-xs">🌧</Text>
            <Text className="text-xs font-medium text-blue-800">
              {Number(item.rainMm).toFixed(1)} mm/day
            </Text>
          </View>
        )}
        {item.riverDischarge != null && item.riverDischarge > 0 && (
          <View className="flex-row items-center rounded-lg bg-cyan-100 px-2.5 py-1 gap-1">
            <Text className="text-xs">🌊</Text>
            <Text className="text-xs font-medium text-cyan-800">
              {Math.round(item.riverDischarge)} m³/s
            </Text>
          </View>
        )}
        {item.gdacsAlert && (
          <View className="flex-row items-center rounded-lg bg-purple-100 px-2.5 py-1 gap-1">
            <Text className="text-xs">🌍</Text>
            <Text className="text-xs font-medium text-purple-800">
              GDACS: {item.gdacsAlert}
            </Text>
          </View>
        )}
        {/* Threats */}
        {item.mainThreats?.slice(0, 2).map((t) => (
          <View key={t} className="rounded-lg bg-slate-100 px-2.5 py-1">
            <Text className="text-xs text-slate-600">{t}</Text>
          </View>
        ))}
      </View>

      {/* Last updated */}
      {item.lastUpdated && (
        <View className="border-t border-slate-200 px-4 py-1.5">
          <Text className="text-xs text-slate-400">
            Updated: {new Date(item.lastUpdated).toLocaleString('en-IN', {
              hour: '2-digit', minute: '2-digit', day: '2-digit',
              month: 'short', hour12: true
            })}
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Summary Bar ───────────────────────────────────────────────
function SummaryBar({ districts }) {
  const red    = districts.filter((d) => d.alertLevel === 'RED').length;
  const orange = districts.filter((d) => d.alertLevel === 'ORANGE').length;
  const green  = districts.filter((d) => d.alertLevel === 'GREEN').length;

  return (
    <View className="flex-row mx-4 mb-4 rounded-2xl bg-slate-900 overflow-hidden">
      <View className="flex-1 items-center py-3 border-r border-slate-700">
        <Text className="text-2xl font-bold text-red-400">{red}</Text>
        <Text className="text-xs text-slate-400 mt-0.5">Danger</Text>
      </View>
      <View className="flex-1 items-center py-3 border-r border-slate-700">
        <Text className="text-2xl font-bold text-orange-400">{orange}</Text>
        <Text className="text-xs text-slate-400 mt-0.5">Watch</Text>
      </View>
      <View className="flex-1 items-center py-3">
        <Text className="text-2xl font-bold text-green-400">{green}</Text>
        <Text className="text-xs text-slate-400 mt-0.5">Safe</Text>
      </View>
    </View>
  );
}

// ── Main Screen ───────────────────────────────────────────────
export default function HomeScreen() {
  const [districts, setDistricts] = useState<any[]>([]);
  const [loading, setLoading]     = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError]         = useState<string | null>(null);
  const [lastFetch, setLastFetch] = useState<Date | null>(null);
  const [filter, setFilter]       = useState('ALL'); // ALL | RED | ORANGE | GREEN

  // Register push notifications for Wayanad (change to user's district)
  usePushNotification();

  const fetchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);

      setError(null);
      const response = await getAllDistricts();
      setDistricts(response.data ?? []);
      setLastFetch(new Date());
    } catch (err) {
      setError('Unable to load alerts. Check your connection.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => fetchData(), 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const filtered = filter === 'ALL'
    ? districts
    : districts.filter((d) => d.alertLevel === filter);

  // ── Loading state ─────────────────────────────────────────
  if (loading) {
    return (
      <View className="flex-1 bg-slate-50 items-center justify-center">
        <ActivityIndicator size="large" color="#EF4444" />
        <Text className="mt-3 text-slate-500 text-sm">Fetching Kerala alerts...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-slate-50">
      <StatusBar barStyle="light-content" backgroundColor="#0f172a" />
       <AppBar/>
      {/* ── Header ─────────────────────────────────────── */}
      <View className="bg-slate-900 pt-12 pb-5 px-4">
        <Text className="text-slate-400 text-sm mt-1">
          All 14 Districts · Real-time disaster monitoring
        </Text>
        {lastFetch && (
          <Text className="text-slate-500 text-xs mt-1">
            Last updated: {lastFetch.toLocaleTimeString('en-IN', { hour12: true })}
          </Text>
        )}
      </View>

      {/* ── Filter tabs ─────────────────────────────────── */}
      <View className="flex-row bg-slate-900 pb-4 px-4 gap-2">
        {['ALL', 'RED', 'ORANGE', 'GREEN'].map((lvl) => (
          <TouchableOpacity
            key={lvl}
            onPress={() => setFilter(lvl)}
            className={`
              flex-1 items-center py-2 rounded-xl
              ${filter === lvl ? 'bg-white' : 'bg-slate-800'}
            `}
          >
            <Text
              className={`text-xs font-semibold
                ${filter === lvl ? 'text-slate-900' : 'text-slate-400'}
              `}
            >
              {lvl === 'ALL' ? 'All' : lvl === 'RED' ? '🔴' : lvl === 'ORANGE' ? '🟠' : '🟢'}{' '}
              {lvl !== 'ALL' && lvl}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchData(true)}
            colors={['#EF4444']}
            tintColor="#EF4444"
          />
        }
      >
        <View className="pt-4" />

        {/* Summary counts */}
        {districts.length > 0 && <SummaryBar districts={districts} />}

        {/* Error banner */}
        {error && (
          <View className="mx-4 mb-4 rounded-xl bg-red-100 border border-red-300 px-4 py-3">
            <Text className="text-red-700 text-sm">{error}</Text>
            <TouchableOpacity onPress={() => fetchData()} className="mt-2">
              <Text className="text-red-600 text-sm font-semibold">Tap to retry</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* District cards */}
        {filtered.length === 0 ? (
          <View className="items-center py-16">
            <Text className="text-slate-400 text-base">No districts match this filter</Text>
          </View>
        ) : (
          filtered.map((item, index) => (
            <DistrictRow key={item.district} item={item} isLast={index === filtered.length - 1} />
          ))
        )}

        {/* Footer */}
        <View className="items-center py-6">
          <Text className="text-slate-400 text-xs">
            Data: Open-Meteo · GDACS (UN) · GloFAS
          </Text>
          <Text className="text-slate-400 text-xs mt-1">
            Auto-refreshes every 30 min
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
