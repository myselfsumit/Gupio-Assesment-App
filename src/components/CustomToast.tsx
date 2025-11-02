import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const CustomToastConfig = {
  success: ({ text1, text2 }: any) => (
    <View style={styles.successContainer}>
      <View style={styles.iconContainer}>
        <Text style={styles.successIcon}>✓</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{text1}</Text>
        {text2 && <Text style={styles.message}>{text2}</Text>}
      </View>
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View style={styles.errorContainer}>
      <View style={[styles.iconContainer, styles.errorIconContainer]}>
        <Text style={styles.errorIcon}>✕</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.errorTitle}>{text1}</Text>
        {text2 && <Text style={styles.errorMessage}>{text2}</Text>}
      </View>
    </View>
  ),
  info: ({ text1, text2 }: any) => (
    <View style={styles.infoContainer}>
      <View style={[styles.iconContainer, styles.infoIconContainer]}>
        <Text style={styles.infoIcon}>ℹ</Text>
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.infoTitle}>{text1}</Text>
        {text2 && <Text style={styles.infoMessage}>{text2}</Text>}
      </View>
    </View>
  ),
};

const styles = StyleSheet.create({
  successContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    minHeight: 70,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    width: SCREEN_WIDTH - 40,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    minHeight: 70,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    width: SCREEN_WIDTH - 40,
  },
  infoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0ea5e9',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 20,
    minHeight: 70,
    shadowColor: '#0ea5e9',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#0284c7',
    width: SCREEN_WIDTH - 40,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  errorIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  infoIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  successIcon: {
    fontSize: 22,
    color: '#fff',
    fontWeight: '900',
  },
  errorIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '900',
  },
  infoIcon: {
    fontSize: 20,
    color: '#fff',
    fontWeight: '900',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  message: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  errorMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  infoMessage: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.95)',
    lineHeight: 20,
  },
});

export default CustomToastConfig;

