import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppBar } from '@/components/AppBar';

type RootStackParamList = {
  AdminHome: undefined;
  AdminDashboard: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminDashboard'>;
};

// ─── Dummy Data ────────────────────────────────────────────────────────────────
const STATS = {
  totalUsers: '12,480',
  activeUsers: '9,142',
  activeRate: '73%',
  userGrowth: '+8.3% this month',

  totalComplaints: 4386,
  monthlyComplaints: 318,
  totalSolved: 3104,
  totalInProgress: 1282,
  totalSolvedPct: 71,

  monthlySolved: 214,
  monthlyInProgress: 104,
  monthlySolvedPct: 67,

  centralSchemes: 42,
  keralaSchemes: 29,
  totalSchemes: 71,
} as const;

// ─── Types ─────────────────────────────────────────────────────────────────────
type TagType = 'up' | 'done' | 'pend';

interface StatBoxProps {
  label: string;
  value: string;
  tagText?: string;
  tagType?: TagType;
}

interface ProgressBarProps {
  label: string;
  value: number;
  total: number;
  barColor: string;
}

interface RowItemProps {
  label: string;
  value: string;
  valueColor?: string;
  isLast?: boolean;
}

// ─── Tag config ────────────────────────────────────────────────────────────────
const TAG_CLASSES: Record<TagType, { bg: string; text: string }> = {
  up:   { bg: 'bg-green-100',  text: 'text-green-800'  },
  done: { bg: 'bg-blue-100',   text: 'text-blue-800'   },
  pend: { bg: 'bg-orange-100', text: 'text-orange-700' },
};

// ─── Sub-components ────────────────────────────────────────────────────────────
function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="bg-white rounded-2xl border border-slate-200 p-4 mb-3.5">
      <Text className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-3">
        {title}
      </Text>
      {children}
    </View>
  );
}

function StatBox({ label, value, tagText, tagType }: StatBoxProps) {
  const tag = tagType ? TAG_CLASSES[tagType] : null;
  return (
    <View className="flex-1 min-w-[45%] bg-slate-50 rounded-xl p-3">
      <Text className="text-xs text-slate-400 mb-1 leading-4">{label}</Text>
      <Text className="text-[22px] font-bold text-slate-800">{value}</Text>
      {tagText && tag && (
        <View className={`self-start rounded-md px-2 py-0.5 mt-1.5 ${tag.bg}`}>
          <Text className={`text-[10px] font-semibold ${tag.text}`}>{tagText}</Text>
        </View>
      )}
    </View>
  );
}

function ProgressBar({ label, value, total, barColor }: ProgressBarProps) {
  const pct = Math.round((value / total) * 100);
  return (
    <View className="mb-2.5">
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs text-slate-400">{label}</Text>
        <Text className="text-xs text-slate-400">{value.toLocaleString()}</Text>
      </View>
      <View className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <View
          className="h-full rounded-full"
          style={{ width: `${pct}%`, backgroundColor: barColor }}
        />
      </View>
    </View>
  );
}

function RowItem({ label, value, valueColor, isLast }: RowItemProps) {
  return (
    <View
      className={`flex-row justify-between items-center py-2.5 ${
        !isLast ? 'border-b border-slate-100' : ''
      }`}
    >
      <Text className="text-sm text-slate-600">{label}</Text>
      <Text
        className="text-sm font-semibold text-slate-800"
        style={valueColor ? { color: valueColor } : undefined}
      >
        {value}
      </Text>
    </View>
  );
}

// ─── Main Screen ───────────────────────────────────────────────────────────────
export default function AdminDashboardScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{paddingBottom : insets.bottom + 60 , paddingTop : insets.top}}>
     <AppBar/>

      {/* Header */}
      <View className="bg-blue-900 px-5 pt-4 pb-6 flex-row justify-between items-center">
        <View>
          <Text className="text-white text-xl font-bold">Dashboard</Text>
          <Text className="text-blue-300 text-xs mt-0.5">May 2026 · Kerala, India</Text>
        </View>
        <TouchableOpacity
          className="flex-row items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5"
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={15} color="#fff" />
          <Text className="text-white text-sm font-medium">Back</Text>
        </TouchableOpacity>
      </View>

      <ScrollView>

        {/* Users */}
        <SectionCard title="Users">
          <View className="flex-row gap-2.5">
            <StatBox
              label="Total Users"
              value={STATS.totalUsers}
              tagText={STATS.userGrowth}
              tagType="up"
            />
            <StatBox
              label="Active Users"
              value={STATS.activeUsers}
              tagText={`${STATS.activeRate} active rate`}
              tagType="up"
            />
          </View>
        </SectionCard>

        {/* Complaints overview */}
        <SectionCard title="Complaints Overview">
          <View className="flex-row flex-wrap gap-2.5">
            <StatBox
              label="Total Complaints"
              value={STATS.totalComplaints.toLocaleString()}
            />
            <StatBox
              label="Monthly Complaints"
              value={STATS.monthlyComplaints.toString()}
            />
            <StatBox
              label="Total Solved"
              value={STATS.totalSolved.toLocaleString()}
              tagText={`${STATS.totalSolvedPct}%`}
              tagType="done"
            />
            <StatBox
              label="In Progress"
              value={STATS.totalInProgress.toLocaleString()}
              tagText={`${100 - STATS.totalSolvedPct}%`}
              tagType="pend"
            />
          </View>
          <View className="mt-3.5">
            <ProgressBar
              label="Solved"
              value={STATS.totalSolved}
              total={STATS.totalComplaints}
              barColor="#1565C0"
            />
            <ProgressBar
              label="In Progress"
              value={STATS.totalInProgress}
              total={STATS.totalComplaints}
              barColor="#E65100"
            />
          </View>
        </SectionCard>

        {/* Monthly complaints */}
        <SectionCard title="Monthly Complaints">
          <RowItem
            label="Received this month"
            value={STATS.monthlyComplaints.toString()}
          />
          <RowItem
            label="Solved this month"
            value={STATS.monthlySolved.toString()}
            valueColor="#1565C0"
          />
          <RowItem
            label="In progress this month"
            value={STATS.monthlyInProgress.toString()}
            valueColor="#E65100"
            isLast
          />
          <View className="mt-3">
            <ProgressBar
              label="Monthly solved"
              value={STATS.monthlySolved}
              total={STATS.monthlyComplaints}
              barColor="#2E7D32"
            />
            <ProgressBar
              label="Monthly in progress"
              value={STATS.monthlyInProgress}
              total={STATS.monthlyComplaints}
              barColor="#FFA726"
            />
          </View>
        </SectionCard>

        {/* Schemes */}
        <SectionCard title="Schemes">
          <View className="flex-row gap-2.5 mb-2">
            <StatBox
              label="Central Schemes"
              value={STATS.centralSchemes.toString()}
            />
            <StatBox
              label="Kerala Schemes"
              value={STATS.keralaSchemes.toString()}
            />
          </View>
          <RowItem
            label="Total Schemes"
            value={STATS.totalSchemes.toString()}
            isLast
          />
        </SectionCard>

        <View className="h-6" />
      </ScrollView>
    </View>
  );
}
