import { Theme } from '@/lib/theme/ThemeManager'
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import { useEffect } from 'react'
import { MenuProvider } from 'react-native-popup-menu'
import 'react-native-reanimated'
import { AlertProvider } from './components/views/Alert'

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
    const [loaded] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    })

    const { color } = Theme.useTheme()

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync()
        }
    }, [loaded])

    if (!loaded) {
        return null
    }

    return (
        <AlertProvider>
            <MenuProvider>
                <Stack
                    screenOptions={{
                        headerStyle: { backgroundColor: color.neutral._100 },
                        contentStyle: { backgroundColor: color.neutral._100 },
                        statusBarBackgroundColor: color.neutral._100,
                        headerTitleAlign: 'center',
                    }}>
                    <Stack.Screen
                        name="index"
                        options={{ headerTintColor: color.text._100, title: "Val's UI Manager" }}
                    />
                    <Stack.Screen name="server" options={{ headerShown: false }} />
                </Stack>
                <StatusBar style="auto" />
            </MenuProvider>
        </AlertProvider>
    )
}

