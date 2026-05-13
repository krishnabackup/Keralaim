import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AppBar } from '@/components/AppBar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RootStackParamList = {
  AdminHome: undefined;
  AdminDashboard: undefined;
  Complaints: undefined;
  AddScheme: undefined;
  Users: undefined;
  Reports: undefined;
  Settings: undefined;
};

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'AdminHome'>;
};

type Tile = {
  label: string;
  sub: string;
  icon: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgClass: string;
  screen: keyof RootStackParamList;
};

type RecentItem = {
  dotColor: string;
  text: string;
  time: string;
};

const TILES: Tile[] = [
  {
    label: 'Dashboard',
    sub: 'Overview & stats',
    icon: 'grid-outline',
    iconColor: '#1565C0',
    iconBgClass: 'bg-blue-100',
    screen: 'AdminDashboard',
  },
  {
    label: 'Complaints',
    sub: 'Manage all',
    icon: 'document-text-outline',
    iconColor: '#E65100',
    iconBgClass: 'bg-orange-100',
    screen: 'Complaints',
  },
  {
    label: 'Add Scheme',
    sub: 'New govt. scheme',
    icon: 'add-circle-outline',
    iconColor: '#2E7D32',
    iconBgClass: 'bg-green-100',
    screen: 'AddScheme',
  },
  {
    label: 'Users',
    sub: 'Manage accounts',
    icon: 'people-outline',
    iconColor: '#C62828',
    iconBgClass: 'bg-red-100',
    screen: 'Users',
  },
  {
    label: 'Reports',
    sub: 'Analytics & export',
    icon: 'bar-chart-outline',
    iconColor: '#6A1B9A',
    iconBgClass: 'bg-purple-100',
    screen: 'Reports',
  },
  {
    label: 'Settings',
    sub: 'App configuration',
    icon: 'settings-outline',
    iconColor: '#00695C',
    iconBgClass: 'bg-teal-100',
    screen: 'Settings',
  },
];

const RECENT: RecentItem[] = [
  { dotColor: '#E65100', text: 'New complaint #1042 — Road damage', time: '2m ago' },
  { dotColor: '#2E7D32', text: 'Scheme "PM Awas" updated', time: '1h ago' },
  { dotColor: '#1565C0', text: '38 new users registered today', time: '3h ago' },
];

export default function AdminHomeScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  return (
      <View style={{paddingBottom : insets.bottom , paddingTop : insets.top}}>
      <AppBar/>

      {/* Header */}
      <View className=" px-5 pt-4 pb-6 flex-row justify-between items-start">
        <View>
          <Text className="text-blue-800 text-lg font-bold">Welcome back,</Text>
          <Text className="text-black text-base font-semibold">District Admin</Text>
        </View>
      </View>
    
        {/* Section label */}
        <View className='p-4'>
        <Text className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-3">
          Quick Access
        </Text>

        {/* Tile grid */}
        <View className="flex-row flex-wrap gap-3 mb-5">
          {TILES.map((tile, i) => (
            <TouchableOpacity
              key={i}
              className="bg-white rounded-2xl p-4 border border-slate-200 w-[47.5%]"
              activeOpacity={0.75}
              onPress={() => navigation.navigate(tile.screen)}
            >
              <View className={`w-11 h-11 rounded-xl items-center justify-center mb-3 ${tile.iconBgClass}`}>
                <Ionicons name={tile.icon} size={22} color={tile.iconColor} />
              </View>
              <Text className="text-sm font-medium text-slate-800 mb-0.5">
                {tile.label}
              </Text>
              <Text className="text-xs text-slate-400">{tile.sub}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <Text className="text-xs font-semibold text-slate-400 tracking-widest uppercase mb-3">
          Recent Activity
        </Text>

        <View className="bg-white rounded-2xl border border-slate-200 overflow-hidden mb-6">
          {RECENT.map((item, i) => (
            <View
              key={i}
              className={`flex-row items-center px-4 py-3 gap-3 ${
                i < RECENT.length - 1 ? 'border-b border-slate-100' : ''
              }`}
            >
              <View
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: item.dotColor }}
              />
              <Text className="flex-1 text-sm text-slate-700" numberOfLines={1}>
                {item.text}
              </Text>
              <Text className="text-xs text-slate-400">{item.time}</Text>
            </View>
          ))}
        </View>
        </View>
    </View>
  );
}
