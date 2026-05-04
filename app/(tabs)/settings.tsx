import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Shortcut, useShortcuts } from '@/hooks/use-shortcuts';

export default function SettingsScreen() {
  const colorScheme = useColorScheme() ?? 'light';
  const colors = Colors[colorScheme];
  const { shortcuts, setShortcuts } = useShortcuts();
  const [newLabel, setNewLabel] = useState('');
  const [newCode, setNewCode] = useState('');
  const [formError, setFormError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const inputColors = useMemo(
    () => ({
      text: colors.text,
      border: colors.icon,
      background: colors.background,
    }),
    [colors]
  );

  const resetForm = () => {
    setNewLabel('');
    setNewCode('');
    setEditingId(null);
    setFormError('');
  };

  const saveShortcut = () => {
    const label = newLabel.trim();
    const code = newCode.trim();
    if (!label || !code) {
      setFormError('Label and USSD code are required.');
      return;
    }

    setShortcuts((current) => {
      if (!editingId) {
        return [...current, { id: `${Date.now()}`, label, code }];
      }

      return current.map((shortcut) =>
        shortcut.id === editingId ? { ...shortcut, label, code } : shortcut
      );
    });
    resetForm();
  };

  const startEditing = (shortcut: Shortcut) => {
    setNewLabel(shortcut.label);
    setNewCode(shortcut.code);
    setEditingId(shortcut.id);
    setFormError('');
  };

  const deleteShortcut = (shortcutId: string) => {
    setShortcuts((current) => current.filter((shortcut) => shortcut.id !== shortcutId));
    if (editingId === shortcutId) {
      resetForm();
    }
  };

  return (
    <ThemedView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedView style={styles.header}>
          <ThemedText type="title">Shortcut Settings</ThemedText>
          <ThemedText style={styles.subtitle}>Add, edit, or delete your USSD shortcuts.</ThemedText>
        </ThemedView>

        <ThemedText style={styles.sectionTitle}>Manage Shortcuts</ThemedText>
        {shortcuts.map((shortcut) => (
          <View
            key={shortcut.id}
            style={[
              styles.shortcutRow,
              {
                borderColor: colors.icon,
                backgroundColor: colors.background,
              },
            ]}>
            <View style={styles.shortcutMeta}>
              <ThemedText type="defaultSemiBold">{shortcut.label}</ThemedText>
              <ThemedText style={styles.shortcutCode}>{shortcut.code}</ThemedText>
            </View>
            <View style={styles.shortcutActions}>
              <Pressable onPress={() => startEditing(shortcut)} style={styles.actionBtn}>
                <ThemedText style={{ color: colors.tint }}>Edit</ThemedText>
              </Pressable>
              <Pressable onPress={() => deleteShortcut(shortcut.id)} style={styles.actionBtn}>
                <ThemedText style={styles.deleteText}>Delete</ThemedText>
              </Pressable>
            </View>
          </View>
        ))}

        <ThemedText style={styles.sectionTitle}>{editingId ? 'Edit Shortcut' : 'Add Shortcut'}</ThemedText>
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
          onPress={saveShortcut}
          style={({ pressed }) => [
            styles.addButton,
            { backgroundColor: colors.tint, opacity: pressed ? 0.8 : 1 },
          ]}>
          <ThemedText style={styles.addButtonText}>
            {editingId ? 'Update Shortcut' : 'Add Shortcut'}
          </ThemedText>
        </Pressable>

        {editingId ? (
          <Pressable
            accessibilityRole="button"
            onPress={resetForm}
            style={({ pressed }) => [
              styles.cancelButton,
              { borderColor: colors.icon, opacity: pressed ? 0.8 : 1 },
            ]}>
            <ThemedText>Cancel Editing</ThemedText>
          </Pressable>
        ) : null}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 8,
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    gap: 8,
    marginBottom: 8,
  },
  subtitle: {
    opacity: 0.7,
  },
  sectionTitle: {
    marginTop: 8,
    opacity: 0.8,
  },
  shortcutRow: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  shortcutMeta: {
    flex: 1,
  },
  shortcutCode: {
    marginTop: 4,
    opacity: 0.7,
  },
  shortcutActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    paddingVertical: 2,
  },
  deleteText: {
    color: '#d32f2f',
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
  cancelButton: {
    marginTop: 8,
    borderWidth: 1,
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#d32f2f',
    marginTop: 6,
  },
});
