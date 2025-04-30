import useDoubleBackPressExit from '@/lib/hooks/useDoubleBack'
import { useServerData } from '@/lib/storage/serverdata'
import { Theme } from '@/lib/theme/ThemeManager'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React, { useRef, useState } from 'react'
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native'
import WebView from 'react-native-webview'
import { useShallow } from 'zustand/react/shallow'
import ThemedButton from '../components/buttons/ThemedButton'
import DropdownSheet from '../components/input/DropdownSheet'
import DoubleTextBoxModal from '../components/views/DoubleTextBox'
import { Logger } from '@/lib/storage/Logger'
import Alert from '../components/views/Alert'
import { SafeAreaView } from 'react-native-safe-area-context'
import PopupMenu from '../components/views/PopupMenu'
import TText from '../components/text/TText'

export default function HomeScreen() {
    const webviewRef = useRef<WebView>(null)
    const [showNewService, setShowNewService] = useState(false)
    const [showEditService, setShowEditService] = useState(false)
    const { color } = Theme.useTheme()

    const { activeServer, ip, services, setServerData } = useServerData(
        useShallow((state) => ({
            activeServer: state.activeServer,
            ip: state.activeServer?.device.ip ?? '',
            services: state.activeServer?.device.services,
            setServerData: state.setServerData,
        }))
    )

    const [activeService, setActiveService] = useState(services?.[0])

    useDoubleBackPressExit('Press back again to exit server.')
    const reload = () => {
        webviewRef.current?.reload()
    }
    const back = () => {
        webviewRef.current?.goBack()
    }
    const source = { uri: activeService?.address ?? '' }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <DoubleTextBoxModal
                title="Add Service"
                booleans={[showNewService, setShowNewService]}
                onConfirm={(label, address) => {
                    if (!activeServer) return
                    const newServer = { ...activeServer }
                    const newService = { label, address, uuid: Date.now() }
                    newServer.device.services.push(newService)
                    Logger.infoToast('Service Created')
                    setServerData(newServer)
                    setActiveService(newService)
                }}
                label1="Label"
                label2="Address"
                defaultValue2={`http://${ip}${ip ? ':' : ''}`}
                defaultValue1="New Service"
                showPaste
            />

            <DoubleTextBoxModal
                title="Edit Service"
                booleans={[showEditService, setShowEditService]}
                onConfirm={(label, address) => {
                    if (!activeServer) return
                    const newServer = { ...activeServer }
                    newServer.device.services = newServer.device.services.map((item) => {
                        if (item.uuid === activeService?.uuid) {
                            const newService = {
                                label: label,
                                address: address,
                                uuid: item.uuid,
                            }
                            setActiveService(newService)
                            return newService
                        }
                        return item
                    })
                    Logger.infoToast('Service Updated')
                    setServerData(newServer)
                }}
                label1="Label"
                label2="Address"
                defaultValue2={activeService?.address ?? `http://${ip}:`}
                defaultValue1={activeService?.label ?? 'New Service'}
                showPaste
            />

            {services && services?.length > 0 && (
                <WebView
                    style={{ backgroundColor: color.neutral._100 }}
                    source={source}
                    onSourceChanged={(event) => {
                        reload()
                    }}
                    ref={webviewRef}
                    allowsFullscreenVideo
                    onError={(e) => {
                        Logger.error(e.nativeEvent.description)
                    }}
                    renderError={(domain, code, description) => (
                        <View
                            style={{
                                flex: 1,
                                rowGap: 16,
                                justifyContent: 'center',
                                alignItems: 'center',
                                top: 0,
                                bottom: 0,
                                left: 0,
                                right: 0,
                                position: 'absolute',
                                backgroundColor: color.neutral._100,
                            }}>
                            <TText>Failed to load page {`:(`}</TText>
                            <TText>Error: {code}</TText>
                            <TText>{description}</TText>
                        </View>
                    )}
                    renderLoading={() => {
                        return (
                            <View
                                style={{
                                    flex: 1,
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    top: 0,
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    position: 'absolute',
                                    backgroundColor: color.neutral._100,
                                }}>
                                <ActivityIndicator size={32} />
                            </View>
                        )
                    }}
                />
            )}
            {services && services.length === 0 && (
                <View
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 24 }}>
                    <MaterialCommunityIcons name="server-off" size={72} color={color.text._700} />
                    <Text style={{ color: color.text._600, fontSize: 18, fontStyle: 'italic' }}>
                        No Services Added
                    </Text>
                </View>
            )}
            <View
                style={{
                    flexDirection: 'row',
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    columnGap: 8,
                    alignItems: 'center',
                }}>
                <ThemedButton iconName="left" variant="tertiary" onPress={back} />
                <ThemedButton iconName="reload1" variant="tertiary" onPress={reload} />
                <DropdownSheet
                    data={services ?? []}
                    labelExtractor={(item) => item.label}
                    onChangeValue={(value) => {
                        webviewRef.current?.clearHistory?.()
                        setActiveService(value)
                    }}
                    setData={(data) => {
                        if (!activeServer) return
                        const newServer = { ...activeServer }
                        newServer.device.services = data
                        setServerData(newServer)
                    }}
                    keyExtractor={(item) => item.uuid.toString()}
                    selected={activeService}
                    placeholder="Select Service"
                    modalTitle="Select Service"
                    containerStyle={{ flex: 1 }}
                />

                <PopupMenu
                    icon="setting"
                    placement="top"
                    options={[
                        {
                            label: 'Delete Service',
                            icon: 'delete',
                            warning: true,
                            disabled: !activeService,
                            onPress: (menu) =>
                                Alert.alert({
                                    title: 'Delete Service',
                                    description: `Are you sure you want to delete \n${
                                        activeService?.label
                                            ? `"${activeService.label}"`
                                            : 'this service'
                                    } ?`,
                                    buttons: [
                                        {
                                            label: 'Cancel',
                                        },
                                        {
                                            label: 'Delete',
                                            type: 'warning',
                                            onPress: () => {
                                                if (!activeServer) return
                                                const newServer = { ...activeServer }
                                                newServer.device.services =
                                                    newServer.device.services.filter(
                                                        (item) => item.uuid !== activeService?.uuid
                                                    )
                                                setActiveService(undefined)
                                                Logger.infoToast('Service Deleted')
                                                setServerData(newServer)
                                                menu.current?.close()
                                            },
                                        },
                                    ],
                                }),
                        },
                        {
                            label: 'Edit Service',
                            icon: 'edit',
                            disabled: !activeService,
                            onPress: (menu) => {
                                menu.current?.close()
                                setShowEditService(true)
                            },
                        },
                        {
                            label: 'Add New Service',
                            icon: 'plus',
                            onPress: (menu) => {
                                menu.current?.close()
                                setShowNewService(true)
                            },
                        },
                    ]}
                />
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
})

