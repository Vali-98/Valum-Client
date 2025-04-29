import { Redirect, Tabs } from 'expo-router'
import React from 'react'
import { Platform } from 'react-native'

import { useServerData } from '@/lib/storage/serverdata'
import { Theme } from '@/lib/theme/ThemeManager'
import { Ionicons } from '@expo/vector-icons'

export default function TabLayout() {
    const { color } = Theme.useTheme()

    const activeServer = useServerData((state) => state.activeServer)
    if (!activeServer) {
        ;<Redirect href={'/'} />
    }

    return (
        <Tabs
            screenOptions={{
                tabBarStyle: Platform.select({
                    ios: {
                        borderTopWidth: 0,
                        // Use a transparent background on iOS to show the blur effect
                        position: 'absolute',
                    },
                    default: {
                        borderTopWidth: 0,
                    },
                }),
                sceneStyle: {
                    backgroundColor: color.neutral._100,
                },
                tabBarActiveTintColor: color.text._100,
                tabBarActiveBackgroundColor: color.neutral._200,
                tabBarInactiveTintColor: color.text._300,
                tabBarInactiveBackgroundColor: color.neutral._100,
                headerStyle: { backgroundColor: color.neutral._100 },
                headerTitleAlign: 'center',
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    headerShown: false,
                    headerTintColor: color.text._100,
                    tabBarLabel: 'Browse',
                    tabBarIcon: ({ color }) => <Ionicons name="search" color={color} size={24} />,
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    headerTintColor: color.text._100,
                    title: 'Settings',
                    tabBarIcon: ({ color }) => <Ionicons name="settings" color={color} size={24} />,
                }}
            />
        </Tabs>
    )
}

