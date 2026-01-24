import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StatusBar} from 'expo-status-bar';
import {AnchoredMenuProvider} from 'react-native-anchored-menu';

import HomeScreen from './src/HomeScreen';
import BasicExample from './src/examples/BasicExample';
import FlatListExample from './src/examples/FlatListExample';
import ModalExample from './src/examples/ModalExample';
import PlacementExample from './src/examples/PlacementExample';
import StylingExample from './src/examples/StylingExample';

export type RootStackParamList = {
  Home: undefined;
  BasicExample: undefined;
  FlatListExample: undefined;
  ModalExample: undefined;
  PlacementExample: undefined;
  StylingExample: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <AnchoredMenuProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerStyle: {backgroundColor: '#f8f9fa'},
            headerTintColor: '#333',
            headerTitleStyle: {fontWeight: '600'},
          }}>
          <Stack.Screen 
            name="Home" 
            component={HomeScreen}
            options={{title: 'Anchored Menu Examples'}}
          />
          <Stack.Screen 
            name="BasicExample" 
            component={BasicExample}
            options={{title: 'Basic Usage'}}
          />
          <Stack.Screen 
            name="FlatListExample" 
            component={FlatListExample}
            options={{title: 'FlatList Integration'}}
          />
          <Stack.Screen 
            name="ModalExample" 
            component={ModalExample}
            options={{title: 'Modal Usage'}}
          />
          <Stack.Screen 
            name="PlacementExample" 
            component={PlacementExample}
            options={{title: 'Placement Options'}}
          />
          <Stack.Screen 
            name="StylingExample" 
            component={StylingExample}
            options={{title: 'Custom Styling'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AnchoredMenuProvider>
  );
}