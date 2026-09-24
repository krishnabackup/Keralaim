
import { AppBar } from "@/components/AppBar";
import { useAuthStore } from "@/store/useAuthStore";
import { useRouter } from "expo-router";
import { useState } from "react";
import { View, TouchableOpacity, Text, ScrollView, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";


// ── Types ────────────────────────────────────────────────────────────────────
interface UserProfile {
    name: string;
    dob: string;
    gender: string;
    district: string;
    region: string;
    religion: string;
    category: string;
    education: string;
    occupation: string;
    annualIncome: string;
}

// ── Mock — replace with your auth context / API ──────────────────────────────
const MOCK_PROFILE: UserProfile = {
    name: "Arjun Krishnan",
    dob: "12 March 1998",
    gender: "Male",
    district: "Wayanad",
    region: "Rural",
    religion: "Hindu",
    category: "OBC",
    education: "Bachelor's Degree",
    occupation: "Self-employed",
    annualIncome: "₹ 2,40,000",
};

// ── Field row ────────────────────────────────────────────────────────────────
function FieldRow({
    label,
    value,
    icon,
    last = false,
}: {
    label: string;
    value: string;
    icon: string;
    last?: boolean;
}) {
    return (
        <View
            className={`flex-row items-center py-3 gap-3
        ${!last ? "border-b border-slate-100" : ""}`}
        >
            <View className="w-8 h-8 rounded-full bg-sky-50 items-center justify-center flex-shrink-0">
                <Text style={{ fontSize: 15 }}>{icon}</Text>
            </View>
            <View className="flex-1">
                <Text className="text-xs text-slate-400 mb-0.5">{label}</Text>
                <Text className="text-sm font-semibold text-slate-800">{value}</Text>
            </View>
        </View>
    );
}

// ── Section card ─────────────────────────────────────────────────────────────
function SectionCard({
    title,
    children,
}: {
    title: string;
    children: React.ReactNode;
}) {
    return (
        <View className="mx-4 mb-4">
            <Text className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 ml-1">
                {title}
            </Text>
            <View className="bg-white rounded-2xl px-4 border border-slate-100">
                {children}
            </View>
        </View>
    );
}

export default function ProfileScreen() {
    const logout = useAuthStore((state) => state.logout);
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const [profile] = useState<UserProfile>(MOCK_PROFILE);
    function getInitials(name: string) {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    }

    function handleLogout() {
        Alert.alert("Logout", "Are you sure you want to logout?", [
            { text: "Cancel", style: "cancel" },
            {
                text: "Logout",
                style: "destructive",
                onPress: () => {
                    // TODO: clear auth token / context
                    router.replace("/(auth)/login");
                },
            },
        ]);
    }

    function handleEdit() {
        router.push("/(tabs)/(profile)/edit");
    }
    return (
        <>
            <View style={{paddingBottom : insets.bottom + 100 , paddingTop : insets.top}}>
                <AppBar/>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: 32 }}
                >
                    {/* ── Avatar hero ─────────────────────────────────────────────── */}
                    <View className="bg-sky-200 pt-6 pb-10 items-center">
                        <View className="w-20 h-20 rounded-full bg-white items-center justify-center mb-3 border-4 border-sky-200">
                            <Text className="text-2xl font-bold text-sky-500">
                                {getInitials(profile.name)}
                            </Text>
                        </View>
                        <Text className="text-black text-lg font-bold">{profile.name}</Text>
                        <View className="mt-1.5 px-3 py-0.5 bg-sky-300 rounded-full">
                            <Text className="text-sky-900 text-xs font-semibold">
                                {profile.category} · {profile.district}
                            </Text>
                        </View>
                    </View>

                    {/* Negative pull-up card */}
                    <View className="h-5 bg-slate-100 -mt-5 rounded-t-3xl" />

                    {/* ── Personal details ─────────────────────────────────────────── */}
                    <SectionCard title="Personal">
                        <FieldRow label="Full name" value={profile.name} icon="👤" />
                        <FieldRow label="Date of birth" value={profile.dob} icon="🎂" />
                        <FieldRow label="Gender" value={profile.gender} icon="⚧" />
                        <FieldRow label="Religion" value={profile.religion} icon="🕌" last />
                    </SectionCard>

                    {/* ── Location ─────────────────────────────────────────────────── */}
                    <SectionCard title="Location">
                        <FieldRow label="District" value={profile.district} icon="📍" />
                        <FieldRow label="Region" value={profile.region} icon="🗺️" last />
                    </SectionCard>

                    {/* ── Socio-economic ───────────────────────────────────────────── */}
                    <SectionCard title="Socio-economic">
                        <FieldRow label="Category" value={profile.category} icon="🏷️" />
                        <FieldRow label="Education" value={profile.education} icon="🎓" />
                        <FieldRow label="Occupation" value={profile.occupation} icon="💼" />
                        <FieldRow label="Annual income" value={profile.annualIncome} icon="💰" last />
                    </SectionCard>

                    {/* ── Logout ───────────────────────────────────────────────────── */}
                    <View className="mx-4 mt-2">
                        <TouchableOpacity
                            onPress={handleLogout}
                            className="bg-red-500 py-4 rounded-2xl items-center"
                            activeOpacity={0.85}
                        >
                            <Text className="text-white font-semibold text-sm">Logout</Text>
                        </TouchableOpacity>
                    </View>

                    <Text className="text-center text-xs text-slate-300 mt-6">
                        KeralAim v1.0.0
                    </Text>
                </ScrollView>
            </View>
        </>
    )
}



