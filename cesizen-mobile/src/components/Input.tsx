import React, { useState } from 'react';
import {
  View, TextInput, Text, TouchableOpacity, StyleSheet, TextInputProps,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputProps extends TextInputProps {
  label: string;
  error?: string;
  secureToggle?: boolean;
}

export function Input({ label, error, secureToggle, secureTextEntry, ...props }: InputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrap, error ? styles.inputError : null]}>
        <TextInput
          {...props}
          secureTextEntry={secureToggle ? !visible : secureTextEntry}
          style={styles.input}
          placeholderTextColor="#9CA3AF"
        />
        {secureToggle && (
          <TouchableOpacity onPress={() => setVisible(v => !v)} style={styles.eye}>
            <Ionicons
              name={visible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '500', color: '#374151', marginBottom: 6 },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  inputError: { borderColor: '#EF4444' },
  input: {
    flex: 1,
    height: 52,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111827',
  },
  eye: { paddingHorizontal: 12 },
  eyeText: { fontSize: 18 },
  error: { fontSize: 12, color: '#EF4444', marginTop: 4 },
});