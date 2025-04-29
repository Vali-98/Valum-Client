import ThemedButton from '@/app/components/buttons/ThemedButton'
import { FontAwesome } from '@expo/vector-icons'
import { Theme } from '@/lib/theme/ThemeManager'
import { getStringAsync } from 'expo-clipboard'
import { useState, useEffect } from 'react'
import {
    View,
    Text,
    Modal,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    GestureResponderEvent,
} from 'react-native'
import ThemedTextInput from '../input/ThemedTextInput'

type TextBoxModalProps = {
    booleans: [boolean, (b: boolean) => void]
    onConfirm: (text1: string, text2: string) => void
    onClose?: () => void
    title?: string
    showPaste?: boolean
    placeholder1?: string
    placeholder2?: string
    textCheck?: (text: string) => boolean
    errorMessage?: string
    autoFocus?: boolean
    defaultValue1?: string
    defaultValue2?: string
    label1?: string
    label2?: string
}

const DoubleTextBoxModal: React.FC<TextBoxModalProps> = ({
    booleans: [showModal, setShowModal],
    onConfirm = (text1, text2) => {},
    onClose = () => {},
    title = 'Enter Name',
    showPaste = false,
    placeholder1 = '',
    placeholder2 = '',
    textCheck = (text: string) => false,
    errorMessage = 'Name cannot be empty',
    autoFocus = false,
    defaultValue1 = '',
    defaultValue2 = '',
    label2 = '',
    label1 = '',
}) => {
    const styles = useStyles()
    const { color, spacing } = Theme.useTheme()
    const [text1, setText1] = useState(defaultValue1)
    const [text2, setText2] = useState(defaultValue2)
    const [showError, setShowError] = useState(false)

    useEffect(() => {
        setText1(defaultValue1)
        setText2(defaultValue2)
    }, [showModal])

    const handleOverlayClick = (e: GestureResponderEvent) => {
        if (e.target === e.currentTarget) handleClose()
    }

    const handleClose = () => {
        setShowModal(false)
        setShowError(false)
        onClose()
    }

    return (
        <Modal
            visible={showModal}
            style={{ flex: 1 }}
            transparent
            onRequestClose={handleClose}
            animationType="fade">
            <TouchableOpacity
                activeOpacity={1}
                onPress={handleOverlayClick}
                style={{
                    flex: 1,
                    backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    justifyContent: 'center',
                }}>
                <View style={styles.modalview}>
                    <Text style={styles.title}>{title}</Text>
                    <View style={styles.inputContainer}>
                        <ThemedTextInput
                            defaultValue={defaultValue1}
                            placeholder={placeholder1}
                            label={label1}
                            value={text1}
                            onChangeText={setText1}
                        />
                        {showPaste && !text1 && (
                            <TouchableOpacity
                                style={styles.inputButton}
                                onPress={async () => {
                                    setText1(await getStringAsync())
                                }}>
                                <FontAwesome name="paste" size={24} color={color.text._100} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.inputContainer}>
                        <ThemedTextInput
                            defaultValue={defaultValue2}
                            placeholder={placeholder2}
                            label={label2}
                            value={text2}
                            onChangeText={setText2}
                        />
                        {showPaste && !text2 && (
                            <TouchableOpacity
                                style={styles.inputButton}
                                onPress={async () => {
                                    setText2(await getStringAsync())
                                }}>
                                <FontAwesome name="paste" size={24} color={color.text._100} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={styles.buttonContainer}>
                            <ThemedButton
                                label="Cancel"
                                variant="tertiary"
                                onPress={() => handleClose()}
                                buttonStyle={{
                                    paddingVertical: spacing.l,
                                    paddingHorizontal: spacing.xl,
                                }}
                            />
                            <ThemedButton
                                label="Confirm"
                                variant="secondary"
                                onPress={() => {
                                    onConfirm(text1, text2)
                                    handleClose()
                                }}
                                buttonStyle={{
                                    paddingVertical: spacing.l,
                                    paddingHorizontal: spacing.xl,
                                }}
                            />
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        </Modal>
    )
}

export default DoubleTextBoxModal

const useStyles = () => {
    const { color, spacing, borderRadius } = Theme.useTheme()
    return StyleSheet.create({
        title: {
            color: color.text._100,
        },

        modalview: {
            rowGap: 16,
            margin: spacing.xl,
            backgroundColor: color.neutral._100,
            borderRadius: borderRadius.xl,
            paddingHorizontal: spacing.xl2,
            paddingTop: spacing.xl2,
            paddingBottom: spacing.xl,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: spacing.m,
        },

        buttonContainer: {
            flex: 1,
            columnGap: spacing.xl,
            marginTop: spacing.s,
            flexDirection: 'row',
            justifyContent: 'flex-end',
        },

        confirmButton: {
            backgroundColor: color.neutral._300,
            paddingHorizontal: spacing.xl2,
            paddingVertical: spacing.l,
            borderRadius: borderRadius.m,
        },

        cancelButton: {
            marginLeft: spacing.xl3,
            marginRight: spacing.xl2,
            borderColor: color.neutral._400,
            borderWidth: 1,
            paddingHorizontal: spacing.xl2,
            paddingVertical: spacing.l,
            borderRadius: borderRadius.m,
        },

        inputContainer: {
            flexDirection: 'row',
            alignItems: 'flex-end',
        },

        input: {
            color: color.text._100,
            backgroundColor: color.neutral._100,
            flex: 1,
            borderRadius: borderRadius.m,
            paddingHorizontal: spacing.m,
            paddingVertical: spacing.xs,
            margin: spacing.m,
        },

        inputButton: {
            marginLeft: spacing.l,
        },

        errorMessage: {
            color: color.error._300,
            marginBottom: spacing.m,
        },
    })
}

