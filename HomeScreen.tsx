import React, { useCallback, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { ChatInputComponent } from '../chat/ChatInputComponent';
import { useImageUpload } from '../hooks/UseImageUpload';

const HomeScreen = () => {
  const insets = useSafeAreaInsets();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    attachments,
    isUploading,
    uploadImage,
    removeAttachment,
    clearAttachments,
  } = useImageUpload();

  const handleSend = useCallback(
    async (messageText: string) => {
      if (!messageText.trim() && attachments.length === 0) return;

      setIsLoading(true);
      setError(null);
      try {
        await new Promise(resolve => setTimeout(() => resolve(undefined), 500));
        clearAttachments();
        Keyboard.dismiss();
      } catch (err) {
        Alert.alert('Error', 'Failed to send message');
      } finally {
        setIsLoading(false);
      }
    },
    [attachments, clearAttachments],
  );

  return (
    // 1. Remove 'bottom' from edges so the KeyboardAvoidingView can take over that space
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* 2. Wrap the entire screen in KeyboardAvoidingView */}
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        // If you have a Header, set this to the Header's height (usually 44-64)
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.inner}>
            {/* 3. The ScrollView should have flexGrow: 1 to push the input down */}
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              keyboardShouldPersistTaps="handled"
            >
              <View style={styles.spacer} />
              {/* Message List goes here */}
            </ScrollView>

            {isLoading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#007AFF" />
              </View>
            )}

            {/* 4. Chat Input - The bottom padding is handled by the safe area inset when keyboard is hidden */}
            <View style={{ marginBottom: insets.bottom }}>
              <ChatInputComponent
                onSend={handleSend}
                onPlusPress={uploadImage}
                attachments={attachments}
                onRemoveAttachment={removeAttachment}
                isUploading={isUploading || isLoading}
                disabled={isLoading}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  inner: {
    flex: 1,
    justifyContent: 'flex-end', // Keeps the input at the bottom
  },
  scrollContent: {
    flexGrow: 1,
  },
  spacer: {
    flex: 1,
  },
  loadingContainer: {
    paddingVertical: 8,
    alignItems: 'center',
  },
});

export default HomeScreen;
