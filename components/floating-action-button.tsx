import React from 'react';
import { TouchableOpacity, StyleSheet, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { IconSymbol } from './ui/icon-symbol';
import { useColors } from '@/hooks/use-colors';

interface FloatingActionButtonProps {
  onPress?: () => void;
  iconName?: string;
  className?: string;
}

export function FloatingActionButton({ 
  onPress, 
  iconName = 'plus',
  className = ''
}: FloatingActionButtonProps) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const themeColors = useColors();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push('/add-expense');
    }
  };

  const bottomPadding = Platform.OS === "web" ? 12 : Math.max(insets.bottom, 8);
  const tabBarHeight = bottomPadding;
  const bottomInset = tabBarHeight - 12;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={handlePress}
      style={[
        styles.container,
        { 
          bottom: bottomInset,
          backgroundColor: themeColors.primary,
        }
      ]}
      className={`shadow-lg ${className}`}
    >
      <IconSymbol name="plus" size={32} color="#ffffff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
});
