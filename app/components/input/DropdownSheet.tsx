import { Entypo, Ionicons } from '@expo/vector-icons'
import { Theme } from '@/lib/theme/ThemeManager'
import { useState } from 'react'
import { FlatList, Modal, Pressable, Text, View, ViewStyle, TextInput } from 'react-native'

import { useDropdownStyles } from './MultiDropdownSheet'
import FadeBackrop from '../views/FadeBackdrop'
import DragList from 'react-native-draglist'

type DropdownSheetProps<T> = {
    containerStyle?: ViewStyle
    style?: ViewStyle
    data: T[]
    setData?: (data: T[]) => void
    selected?: T | undefined
    onChangeValue: (data: T) => void
    labelExtractor: (data: T) => string
    keyExtractor?: (data: T) => string
    search?: boolean
    placeholder?: string
    modalTitle?: string
    closeOnSelect?: boolean
}

const DropdownSheet = <T,>({
    containerStyle = undefined,
    onChangeValue,
    style,
    selected = undefined,
    data = [],
    setData,
    placeholder = 'Select Item...',
    modalTitle = 'Select Item',
    labelExtractor = (data) => data as string,
    keyExtractor,
    search = false,
    closeOnSelect = true,
}: DropdownSheetProps<T>) => {
    const styles = useDropdownStyles()
    const [showList, setShowList] = useState(false)
    const [searchFilter, setSearchFilter] = useState('')
    const theme = Theme.useTheme()
    const items = data.filter((item) =>
        labelExtractor(item).toLowerCase().includes(searchFilter.toLowerCase())
    )
    const selectedFunction = keyExtractor || labelExtractor

    return (
        <View style={containerStyle}>
            <Modal
                transparent
                onRequestClose={() => setShowList(false)}
                statusBarTranslucent
                visible={showList}
                animationType="fade">
                <FadeBackrop
                    handleOverlayClick={() => {
                        setSearchFilter('')
                        setShowList(false)
                    }}
                />
                <View style={{ flex: 1 }} />
                <View style={styles.listContainer}>
                    <Text style={styles.modalTitle}>{modalTitle}</Text>
                    {items.length > 0 ? (
                        <DragList
                            style={{ paddingHorizontal: 24, paddingVertical: 16 }}
                            contentContainerStyle={{ rowGap: 2 }}
                            showsVerticalScrollIndicator={false}
                            data={items}
                            onReordered={(fromIndex, toIndex) => {
                                if (!setData) return
                                const copy = [...data] // Don't modify react data in-place
                                const removed = copy.splice(fromIndex, 1)

                                copy.splice(toIndex, 0, removed[0]) // Now insert at the new pos
                                setData(copy)
                            }}
                            keyExtractor={(item, index) =>
                                keyExtractor ? keyExtractor(item) : index.toString()
                            }
                            renderItem={({ item, onDragStart, onDragEnd, isActive }) => (
                                <Pressable
                                    onLongPress={onDragStart}
                                    onPressOut={onDragEnd}
                                    disabled={isActive}
                                    style={[
                                        selected &&
                                        selectedFunction(item) === selectedFunction(selected)
                                            ? styles.listItemSelected
                                            : styles.listItem,
                                        isActive
                                            ? {
                                                  transform: [{ scale: 1.05 }],
                                                  borderWidth: 2,
                                                  borderColor: theme.color.neutral._300,
                                                  borderRadius: 16,
                                                  backgroundColor:
                                                      selected &&
                                                      selectedFunction(item) ===
                                                          selectedFunction(selected)
                                                          ? theme.color.primary._200
                                                          : theme.color.neutral._200,
                                              }
                                            : {},
                                    ]}
                                    onPress={() => {
                                        onChangeValue(item)
                                        setShowList(!closeOnSelect)
                                    }}>
                                    <Text style={styles.listItemText}>{labelExtractor(item)}</Text>
                                </Pressable>
                            )}
                        />
                    ) : (
                        <Text style={styles.emptyText}>No Items</Text>
                    )}
                    {search && (
                        <TextInput
                            placeholder="Filter..."
                            placeholderTextColor={theme.color.text._300}
                            style={styles.searchBar}
                            value={searchFilter}
                            onChangeText={setSearchFilter}
                        />
                    )}
                </View>
            </Modal>
            <Pressable style={[style, styles.button]} onPress={() => setShowList(true)}>
                {selected && <Text style={styles.buttonText}>{labelExtractor(selected)}</Text>}
                {!selected && <Text style={styles.placeholderText}>{placeholder}</Text>}
                <Entypo name="chevron-down" color={theme.color.primary._800} size={18} />
            </Pressable>
        </View>
    )
}

export default DropdownSheet

