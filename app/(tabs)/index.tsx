import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { Linking, Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useShortcuts } from '@/hooks/use-shortcuts';

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { shortcuts, loadShortcuts } = useShortcuts();

  useFocusEffect(
    useCallback(() => {
      void loadShortcuts();
    }, [loadShortcuts])
  );

  const callShortcut = (code: string) => {
    void Linking.openURL(`tel:${encodeURIComponent(code)}`);
  };

  return (
    <ThemedView style={styles.screen}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">BX Utility</ThemedText>
          <ThemedText style={styles.subtitle}>USSD Menu Shortcut Buttons</ThemedText>
        </ThemedView>

        <ThemedView style={styles.grid}>
          {shortcuts.map((shortcut) => (
            <Pressable
              key={shortcut.id}
              accessibilityRole="button"
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.icon,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
              onPress={() => callShortcut(shortcut.code)}>
              <ThemedText type="defaultSemiBold" style={styles.buttonLabel}>
                {shortcut.label}
              </ThemedText>
              <ThemedText style={styles.codeLabel}>{shortcut.code}</ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 32,
  },
  header: {
    gap: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  button: {
    minHeight: 120,
    width: '47%',
    borderWidth: 1,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonLabel: {
    textAlign: 'center',
  },
  codeLabel: {
    marginTop: 8,
    opacity: 0.7,
    textAlign: 'center',
  },
});
