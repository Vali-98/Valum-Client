import { Logger } from '@/lib/storage/Logger'
import { Routes, ServerData } from '@/lib/storage/serverdata'
import { Theme } from '@/lib/theme/ThemeManager'
import { Octicons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { View } from 'react-native'
import ThemedButton from '../components/buttons/ThemedButton'
import SectionTitle from '../components/text/SectionTitle'
import TText from '../components/text/TText'
import Alert from '../components/views/Alert'

interface ValumActionProps {
    activeServer: ServerData
}

const ValumActions: React.FC<ValumActionProps> = ({ activeServer }) => {
    const [active, setActive] = useState(false)

    useEffect(() => {
        handlePingRequest()
    }, [activeServer.device.ip])

    const handlePingRequest = async () => {
        const result = await fetchRequest('status', 'get')
        if (result?.status !== 200) {
            Logger.errorToast('Request failed - Status: ' + result?.status || 'Unknown')
            const data = await result?.json()
            if (data) Logger.error(data.toString())
            return
        }
        const jsonData = await result.json()
        setActive(jsonData?.active)
        Logger.info('Server: ' + JSON.stringify(jsonData))
    }

    const fetchRequest = async (
        path: 'wol' | 'shutdown' | 'status',
        method: 'post' | 'get' = 'post'
    ) => {
        const url = Routes.valum(activeServer, path)
        const ac = new AbortController()
        const timeout = setTimeout(() => {
            ac.abort()
        }, 1000)
        const result = await fetch(url, {
            signal: ac.signal,
            method: method,
            body: '',
        }).catch((e) => {
            Logger.info(e.toString())
        })
        clearTimeout(timeout)
        return result
    }

    const wakeRequest = async () => {
        const result = await fetchRequest('wol')
        if (result?.status !== 200) {
            Logger.errorToast('Request failed - Status: ' + result?.status || 'Unknown')
            const data = await result?.json()
            if (data) Logger.error(data.toString())
            return
        }
        Logger.infoToast('Wakeup packet sent')
        Logger.info('Server: ' + (await result.json())?.message)
    }

    const shutdownRequest = async () => {
        const result = await fetchRequest('shutdown')
        if (result?.status !== 200) {
            Logger.errorToast('Failed to shutdown server: Status ' + result?.status || 'Unknown')
            const data = await result?.json()
            if (data) Logger.error(data.toString())
            return
        }
        Logger.infoToast('Device shutdown sent')
        Logger.info('Server: ' + (await result.json())?.message)
        setTimeout(() => {
            handlePingRequest()
        }, 5000)
    }

    const handleShutdown = () => {
        Alert.alert({
            title: 'Shutdown Device',
            description: 'Are you sure you want to shutdown this device?',
            buttons: [
                {
                    label: 'Cancel',
                },
                {
                    label: 'Shutdown',
                    type: 'warning',
                    onPress: shutdownRequest,
                },
            ],
        })
    }

    const { color } = Theme.useTheme()
    return (
        <>
            <SectionTitle>Valum Actions</SectionTitle>
            <View
                style={{
                    flexDirection: 'row',
                    columnGap: 8,
                    paddingVertical: 8,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    backgroundColor: color.neutral._200,
                }}>
                <TText style={{ alignItems: 'center' }}>
                    Status: <TText>{active ? 'Active' : 'Inactive'}</TText>
                </TText>
                <Octicons color={active ? 'green' : 'red'} name="dot-fill" size={18} />
            </View>
            <ThemedButton label="Ping Server" variant="secondary" onPress={handlePingRequest} />
            <ThemedButton
                label="Wake Device"
                variant={active ? 'disabled' : 'secondary'}
                onPress={wakeRequest}
            />
            <ThemedButton
                label="Shutdown Device"
                variant={active ? 'critical' : 'disabled'}
                onPress={handleShutdown}
            />
        </>
    )
}

export default ValumActions

