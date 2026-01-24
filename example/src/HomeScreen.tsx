import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import type {NativeStackNavigationProp} from '@react-navigation/native-stack';
import type {RootStackParamList} from '../App';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface ExampleItem {
  title: string;
  description: string;
  screen: keyof RootStackParamList;
  icon: string;
}

const examples: ExampleItem[] = [
  {
    title: 'Basic Usage',
    description: 'Simple button with menu - the fundamentals',
    screen: 'BasicExample',
    icon: '🎯',
  },
  {
    title: 'FlatList Integration', 
    description: 'Menus anchored to items in scrolling lists',
    screen: 'FlatListExample',
    icon: '📋',
  },
  {
    title: 'Modal Usage',
    description: 'Menu inside React Native Modal components',
    screen: 'ModalExample',
    icon: '🪟',
  },
  {
    title: 'Placement Options',
    description: 'Auto, top, bottom positioning with alignment',
    screen: 'PlacementExample',
    icon: '📍',
  },
  {
    title: 'Custom Styling',
    description: 'Different designs, animations, and themes',
    screen: 'StylingExample',
    icon: '🎨',
  },
];

export default function HomeScreen() {
  const navigation = useNavigation<NavigationProp>();

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.header}>
        <Text style={styles.title}>🎯 Anchored Menu</Text>
        <Text style={styles.subtitle}>
          Explore different examples showcasing the capabilities of react-native-anchored-menu
        </Text>
      </View>

      <View style={styles.examplesContainer}>
        {examples.map((example, index) => (
          <Pressable
            key={index}
            style={({pressed}) => [
              styles.exampleCard,
              pressed && styles.exampleCardPressed,
            ]}
            onPress={() => navigation.navigate(example.screen)}>
            <View style={styles.cardContent}>
              <Text style={styles.icon}>{example.icon}</Text>
              <View style={styles.textContent}>
                <Text style={styles.exampleTitle}>{example.title}</Text>
                <Text style={styles.exampleDescription}>{example.description}</Text>
              </View>
              <Text style={styles.arrow}>→</Text>
            </View>
          </Pressable>
        ))}
      </View>

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Tip: Try different device orientations and screen sizes to see how positioning adapts
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 24,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#212529',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6c757d',
    textAlign: 'center',
    lineHeight: 24,
  },
  examplesContainer: {
    padding: 16,
    gap: 12,
  },
  exampleCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  exampleCardPressed: {
    backgroundColor: '#f8f9fa',
    transform: [{scale: 0.98}],
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 28,
    marginRight: 16,
  },
  textContent: {
    flex: 1,
  },
  exampleTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  exampleDescription: {
    fontSize: 14,
    color: '#6c757d',
    lineHeight: 20,
  },
  arrow: {
    fontSize: 20,
    color: '#6c757d',
    marginLeft: 12,
  },
  footer: {
    padding: 24,
    backgroundColor: '#f8f9fa',
    marginTop: 16,
  },
  footerText: {
    fontSize: 14,
    color: '#6c757d',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});