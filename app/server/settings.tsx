import { useServerData } from '@/lib/storage/serverdata'
import { useRouter } from 'expo-router'
import { ScrollView, View } from 'react-native'
import { useShallow } from 'zustand/react/shallow'
import ThemedButton from '../components/buttons/ThemedButton'
import ThemedTextInput from '../components/input/ThemedTextInput'
import SectionTitle from '../components/text/SectionTitle'
import Alert from '../components/views/Alert'
import ValumActions from '../screens/valumactions'

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
                placeholder="New Server"
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
                placeholder="http://127.0.0.1"
                autoCapitalize="none"
                onChangeText={(text) => {
                    if (!activeServer) return
                    const newServer = { ...activeServer }
                    newServer.device.ip = text
                    setServerData(newServer)
                }}
            />
            <View style={{ flexDirection: 'row', columnGap: 8 }}>
                <ThemedTextInput
                    containerStyle={{ flex: 2 }}
                    value={activeServer?.valum.server_ip ?? ''}
                    label="Valum Server IP"
                    placeholder="http://127.0.0.1"
                    autoCapitalize="none"
                    onChangeText={(text) => {
                        if (!activeServer) return
                        const newServer = { ...activeServer }
                        newServer.valum.server_ip = text
                        setServerData(newServer)
                    }}
                />
                <ThemedTextInput
                    containerStyle={{ flex: 1 }}
                    value={activeServer?.valum.port ?? ''}
                    label="Port"
                    placeholder="3000"
                    autoCapitalize="none"
                    onChangeText={(text) => {
                        if (!activeServer) return
                        const newServer = { ...activeServer }
                        newServer.valum.port = text
                        setServerData(newServer)
                    }}
                />
            </View>

            {activeServer && activeServer?.valum.server_ip && (
                <ValumActions activeServer={activeServer} />
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

