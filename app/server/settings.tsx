import { View, ScrollView } from 'react-native'
import SectionTitle from '../components/text/SectionTitle'
import ThemedTextInput from '../components/input/ThemedTextInput'
import { useServerData } from '@/lib/storage/serverdata'
import { useShallow } from 'zustand/react/shallow'
import ThemedButton from '../components/buttons/ThemedButton'
import Alert from '../components/views/Alert'
import { useRouter } from 'expo-router'

export default function Settings() {
    const router = useRouter()
    const { activeServer, setServerData, deleteServer } = useServerData(
        useShallow((state) => ({
            activeServer: state.activeServer,
            setServerData: state.setServerData,
            deleteServer: state.delete,
        }))
    )
    return (
        <ScrollView contentContainerStyle={{ margin: 16, rowGap: 16 }}>
            <SectionTitle>Server</SectionTitle>
            <ThemedTextInput
                value={activeServer?.name ?? ''}
                label="Configuration Name"
                onChangeText={(text) => {
                    if (!activeServer) return
                    const newServer = { ...activeServer }
                    newServer.name = text
                    setServerData(newServer)
                }}
            />
            <ThemedTextInput
                value={activeServer?.device.ip ?? ''}
                label="Device Server IP"
                onChangeText={(text) => {
                    if (!activeServer) return
                    const newServer = { ...activeServer }
                    newServer.device.ip = text
                    setServerData(newServer)
                }}
            />
            <ThemedTextInput
                value={activeServer?.valum.server_ip ?? ''}
                label="Valum Server IP"
                onChangeText={(text) => {
                    if (!activeServer) return
                    const newServer = { ...activeServer }
                    newServer.valum.server_ip = text
                    setServerData(newServer)
                }}
            />
            {activeServer?.valum.server_ip && (
                <>
                    <SectionTitle>Valum Actions</SectionTitle>
                    <ThemedButton label="Stop Server" variant="critical" />
                    <ThemedButton label="Start Server" variant="secondary" />
                    <ThemedButton label="Ping Server" variant="secondary" />
                </>
            )}

            <SectionTitle>Danger Zone</SectionTitle>

            <ThemedButton
                label="Delete This Server"
                variant="critical"
                onPress={() =>
                    Alert.alert({
                        title: 'Delete Server',
                        description: 'Are you sure you want to delete this server?',
                        buttons: [
                            {
                                label: 'Cancel',
                            },
                            {
                                label: 'Delete',
                                type: 'warning',
                                onPress: () => {
                                    if (!activeServer) return
                                    router.replace('/')
                                    deleteServer(activeServer.uuid)
                                },
                            },
                        ],
                    })
                }
            />
        </ScrollView>
    )
}

