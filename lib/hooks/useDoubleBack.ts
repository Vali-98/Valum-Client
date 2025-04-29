import { useState, useEffect } from 'react'
import { BackHandler } from 'react-native'
import { Logger } from '../storage/Logger'
import { useFocusEffect } from 'expo-router'

const useDoubleBackPressExit = (message = 'Press back again to exit app.', duration = 3000) => {
    const [backPressed, setBackpressed] = useState(false)

    useFocusEffect(() => {
        const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
            if (backPressed) {
                return false
            } else {
                setBackpressed(true)
                Logger.infoToast(message)
                setTimeout(() => {
                    setBackpressed(false)
                }, duration)
                return true
            }
        })
        return () => {
            backHandler.remove()
        }
    })

    return null
}

export default useDoubleBackPressExit

