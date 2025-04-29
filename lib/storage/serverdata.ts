import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { mmkvStorage } from './mmkv'

export interface ServerData {
    uuid: number
    name: string
    device: {
        ip: string
        services: {
            label: string
            address: string
            uuid: number
        }[]
    }
    valum: {
        server_ip: string
        port: string
    }
}

interface ServerDataStorage {
    data: ServerData[]
    activeServer?: ServerData
    setActiveServer: (server: ServerData) => void
    setServerData: (server: ServerData) => void
    create: (data: ServerData) => void
    createBlank: (name: string) => void
    delete: (uuid: number) => void
}

const createBlankData = (name: string): ServerData => {
    return {
        name: name,
        valum: {
            server_ip: '',
            port: '',
        },
        device: {
            ip: '',
            services: [],
        },
        uuid: Date.now(),
    }
}

export namespace Routes {
    export const valum = (server: ServerData, route: 'status' | 'wol' | 'shutdown') => {
        const ip = server.valum.server_ip
        const port = server.valum.port
        const url = `${ip}${(port ? ':' : '') + port}/${route}`
        return url
    }
}

export const useServerData = create<ServerDataStorage>()(
    persist(
        (set, get) => ({
            data: [],
            setActiveServer: (server) => {
                set({ activeServer: server })
            },
            create: (data) => {
                set((state) => ({ data: [...state.data, data] }))
            },
            createBlank: (name) => {
                get().create(createBlankData(name))
            },
            delete: (uuid) => {
                set((state) => ({ data: state.data.filter((item) => item.uuid !== uuid) }))
            },
            setServerData: (data) => {
                set((state) => ({
                    data: state.data.map((item) => (item.uuid === data.uuid ? data : item)),
                }))
                if (data.uuid !== get().activeServer?.uuid) return
                set({ activeServer: data })
            },
        }),
        {
            name: 'server-data-storage',
            storage: createJSONStorage(() => mmkvStorage),
        }
    )
)

