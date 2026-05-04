import { useMemo, useState } from 'react';
import {
  Linking,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

type Shortcut = {
  id: string;
  label: string;
  code: string;
};

const DEFAULT_SHORTCUTS: Shortcut[] = [
  { id: 'button-1', label: 'Balance Check' },
  { id: 'button-2', label: '100 Menu' },
  { id: 'button-3', label: 'MTN paka' },
  { id: 'button-4', label: 'Airtime Top Up' },
].map((shortcut, index) => ({
  ...shortcut,
  code: ['*131#', '*100#', '*100*2*1*1*1*1*1*1*2#', '*136#'][index],
}));

export default function HomeScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const [shortcuts, setShortcuts] = useState<Shortcut[]>(DEFAULT_SHORTCUTS);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [newLabel, setNewLabel] = useState('');
  const [newCode, setNewCode] = useState('');
  const [formError, setFormError] = useState('');

  const inputColors = useMemo(
    () => ({
      text: colors.text,
      border: colors.icon,
      background: colors.background,
    }),
    [colors]
  );

  const callShortcut = (code: string) => {
    void Linking.openURL(`tel:${encodeURIComponent(code)}`);
  };

  const addShortcut = () => {
    const label = newLabel.trim();
    const code = newCode.trim();
    if (!label || !code) {
      setFormError('Label and USSD code are required.');
      return;
    }

    setShortcuts((current) => [
      ...current,
      { id: `${Date.now()}`, label, code },
    ]);
    setNewLabel('');
    setNewCode('');
    setFormError('');
  };

  return (
    <ThemedView style={styles.screen}>
      <ThemedView style={styles.content}>
        <ThemedView style={styles.header}>
          <View style={styles.headerRow}>
            <ThemedText type="title">BX Utility</ThemedText>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Open settings"
              onPress={() => setSettingsOpen(true)}
              style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}>
              <IconSymbol name="gearshape.fill" size={24} color={colors.tint} />
            </Pressable>
          </View>
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
              <ThemedText style={styles.codeLabel}>
                {shortcut.code}
              </ThemedText>
            </Pressable>
          ))}
        </ThemedView>
      </ThemedView>

      <Modal visible={settingsOpen} transparent animationType="slide" onRequestClose={() => setSettingsOpen(false)}>
        <View style={styles.modalOverlay}>
          <ThemedView style={[styles.modalCard, { borderColor: colors.icon }]}>
            <View style={styles.modalHeader}>
              <ThemedText type="subtitle">Shortcut Settings</ThemedText>
              <Pressable onPress={() => setSettingsOpen(false)}>
                <IconSymbol name="xmark.circle.fill" size={22} color={colors.icon} />
              </Pressable>
            </View>

            <ScrollView contentContainerStyle={styles.formContent}>
              <ThemedText style={styles.inputLabel}>Shortcut Name</ThemedText>
              <TextInput
                placeholder="e.g. Data Bundles"
                placeholderTextColor={colors.icon}
                value={newLabel}
                onChangeText={setNewLabel}
                style={[
                  styles.input,
                  {
                    color: inputColors.text,
                    borderColor: inputColors.border,
                    backgroundColor: inputColors.background,
                  },
                ]}
              />

              <ThemedText style={styles.inputLabel}>USSD Code</ThemedText>
              <TextInput
                placeholder="e.g. *123#"
                placeholderTextColor={colors.icon}
                value={newCode}
                onChangeText={setNewCode}
                autoCapitalize="none"
                autoCorrect={false}
                style={[
                  styles.input,
                  {
                    color: inputColors.text,
                    borderColor: inputColors.border,
                    backgroundColor: inputColors.background,
                  },
                ]}
              />

              {formError ? <ThemedText style={styles.errorText}>{formError}</ThemedText> : null}

              <Pressable
                accessibilityRole="button"
                onPress={addShortcut}
                style={({ pressed }) => [
                  styles.addButton,
                  { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
                ]}>
                <ThemedText style={styles.addButtonText}>Add Shortcut</ThemedText>
              </Pressable>
            </ScrollView>
          </ThemedView>
        </View>
      </Modal>
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
  headerRow: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    minHeight: '45%',
    maxHeight: '85%',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 28,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  formContent: {
    gap: 8,
    paddingBottom: 24,
  },
  inputLabel: {
    marginTop: 8,
    opacity: 0.75,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  addButton: {
    marginTop: 16,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  errorText: {
    color: '#d32f2f',
    marginTop: 6,
  },
});
