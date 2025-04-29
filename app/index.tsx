import { ServerData, useServerData } from '@/lib/storage/serverdata'
import { Theme } from '@/lib/theme/ThemeManager'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import React, { useState } from 'react'
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import ThemedButton from './components/buttons/ThemedButton'
import TText from './components/text/TText'
import TextBoxModal from './components/views/TextBoxModal'

const ServerItem: React.FC<{ item: ServerData }> = ({ item }) => {
    const { color } = Theme.useTheme()
    const setServer = useServerData((state) => state.setActiveServer)
    const router = useRouter()
    return (
        <View>
            <TouchableOpacity
                onPress={() => {
                    setServer(item)
                    router.push('/server')
                }}
                style={{
                    flex: 1,
                    borderColor: color.primary._500,
                    borderWidth: 2,
                    borderRadius: 16,
                    paddingVertical: 24,
                    paddingHorizontal: 24,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                <TText style={{ fontSize: 18 }}>{item.name}</TText>
                <Text style={{ color: color.text._400 }}>{item.device.ip || 'No IP Address'}</Text>
            </TouchableOpacity>
        </View>
    )
}

export default function ServerList() {
    const { color } = Theme.useTheme()
    const [showNew, setShowNew] = useState(false)
    const { data, create } = useServerData(
        useShallow((state) => ({
            data: state.data,
            create: state.create,
        }))
    )

    return (
        <View style={{ flex: 1, margin: 16 }}>
            <View>
                <TextBoxModal
                    booleans={[showNew, setShowNew]}
                    defaultValue="New Server"
                    placeholder="New Server"
                    onConfirm={(name) => {
                        create({
                            name: name,
                            valum: {
                                server_ip: '',
                            },
                            device: {
                                ip: '',
                                services: [],
                            },
                            uuid: Date.now(),
                        })
                    }}
                />
            </View>
            {data.length > 0 && (
                <FlatList
                    data={data}
                    keyExtractor={(item) => item.uuid.toString()}
                    renderItem={({ item }) => <ServerItem item={item} />}
                />
            )}
            {data.length === 0 && (
                <View
                    style={{ flex: 1, justifyContent: 'center', alignItems: 'center', rowGap: 24 }}>
                    <MaterialCommunityIcons name="server-off" size={72} color={color.text._700} />
                    <Text style={{ color: color.text._600, fontSize: 18, fontStyle: 'italic' }}>
                        No Servers Added
                    </Text>
                </View>
            )}
            <View style={{ flex: 1 }}></View>
            <ThemedButton label="Add Server" onPress={() => setShowNew(true)} />
        </View>
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

