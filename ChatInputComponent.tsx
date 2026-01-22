import React, { useState, useCallback, memo } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  Text,
  StyleSheet,
  Keyboard,
  Platform,
  Image,
  ScrollView,
  ActivityIndicator,
  useWindowDimensions,
} from 'react-native';
import { Plus, SendHorizontal, X } from 'lucide-react-native';
import { COLORS, globalStyles } from '../styles/global';

interface ChatInputComponentProps {
  onSend: (text: string) => void;
  onPlusPress: () => void;
  attachments: string[];
  onRemoveAttachment: (uri: string) => void;
  isUploading?: boolean;
  disabled?: boolean;
}

export const ChatInputComponent = memo(
  ({
    onSend,
    onPlusPress,
    attachments = [],
    onRemoveAttachment,
    isUploading = false,
    disabled = false,
  }: ChatInputComponentProps) => {
    const [value, setValue] = useState('');
    const [isFocused, setIsFocused] = useState(false);
    const [inputHeight, setInputHeight] = useState(40);
    const { height: screenHeight, width: screenWidth } = useWindowDimensions();

    const isLandscape = screenWidth > screenHeight;
    const hasContent = value.trim().length > 0 || attachments.length > 0;
    const isExpanded = isFocused || hasContent || isUploading;

    const handleSubmit = useCallback(() => {
      if (hasContent && !isUploading && !disabled) {
        onSend(value);
        setValue('');
        setInputHeight(40);
        Keyboard.dismiss();
      }
    }, [value, hasContent, isUploading, onSend]);

    return (
      <View style={styles.outerContainer}>
        <View style={[styles.bubbleContainer, globalStyles.shadow]}>
          <View style={styles.contentWrapper}>
            <TextInput
              multiline
              value={value}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              onChangeText={setValue}
              placeholder={isExpanded ? 'Start typing' : 'Start asking scout'}
              placeholderTextColor={COLORS.textMuted}
              onContentSizeChange={e =>
                setInputHeight(e.nativeEvent.contentSize.height)
              }
              {...({ disableExtractUI: true } as any)}
              style={[
                styles.input,
                {
                  height: Math.max(
                    40,
                    Math.min(inputHeight, isLandscape ? 80 : 90),
                  ),
                },

                !isExpanded
                  ? styles.inputPaddingCompact
                  : styles.inputPaddingExpanded,
              ]}
            />

            {(attachments.length > 0 || isUploading) && (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.attachmentScroll}
                contentContainerStyle={styles.attachmentContent}
              >
                {attachments.map(uri => (
                  <View key={uri} style={styles.thumbnailContainer}>
                    <Image source={{ uri }} style={styles.thumbnail} />
                    <TouchableOpacity
                      style={styles.removeBadge}
                      onPress={() => onRemoveAttachment(uri)}
                      hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
                    >
                      <X size={12} color="black" strokeWidth={3} />
                    </TouchableOpacity>
                  </View>
                ))}
                {isUploading && (
                  <View style={styles.loadingThumbnail}>
                    <ActivityIndicator size="small" color={COLORS.primary} />
                  </View>
                )}
              </ScrollView>
            )}

            <View
              style={[
                styles.buttonRow,
                isExpanded ? styles.expandedButtons : styles.compactButtons,
              ]}
            >
              <TouchableOpacity
                onPress={onPlusPress}
                style={[styles.iconButton, !isExpanded && styles.borderless]}
              >
                <Plus
                  size={22}
                  color={COLORS.textMain as any}
                  strokeWidth={2.5}
                />
              </TouchableOpacity>

              {isExpanded && <View style={{ flex: 1 }} />}

              <TouchableOpacity
                disabled={!hasContent || isUploading || disabled}
                onPress={handleSubmit}
                style={[
                  styles.sendButton,
                  {
                    backgroundColor:
                      hasContent && !isUploading && !disabled
                        ? COLORS.primary
                        : COLORS.primaryFaded,
                  },
                ]}
              >
                <SendHorizontal
                  size={20}
                  color={COLORS.white as any}
                  strokeWidth={2}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Text style={[styles.footerText, isLandscape && { marginTop: 4 }]}>
          Scout can make mistakes, please double check
        </Text>
      </View>
    );
  },
);

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 8 : 12,
    paddingTop: 8,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  bubbleContainer: {
    backgroundColor: COLORS.background || '#F3F4F6',
    borderWidth: 1,
    borderColor: COLORS.border || '#E5E7EB',
    borderRadius: 20,
    padding:6,
  },
  inputPaddingCompact: { paddingHorizontal: 48 },
  inputPaddingExpanded: { paddingHorizontal: 10 },
  input: {
    fontSize: 16,
    color: COLORS.textMain,
    paddingVertical: 10,
    textAlignVertical: 'top',
    lineHeight: 20,
  },
  attachmentScroll: { marginTop: 8,
    overflow:'visible'
  },
  attachmentContent: { paddingBottom: 4 },
  thumbnailContainer: {
    marginRight: 10,
    position: 'relative',
    overflow: 'visible',
  },
  thumbnail: { width: 54, height: 54, borderRadius: 12 },
  loadingThumbnail: {
    width: 54,
    height: 54,
    borderRadius: 12,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    zIndex: 10,
    backgroundColor: 'white',
    borderRadius: 12,
    width: 22,
    height: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  contentWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compactButtons: {
    position: 'absolute',
    left: 4,
    right: 4,
    top: 0,
    bottom: 0,
    justifyContent: 'space-between',
  },
  expandedButtons: {
    marginTop: 8,
    paddingBottom: 4,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  borderless: {
    borderWidth: 0,
    backgroundColor: 'transparent',
  },
  sendButton: {
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footerText: {
    textAlign: 'center',
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 8,
  },
});
