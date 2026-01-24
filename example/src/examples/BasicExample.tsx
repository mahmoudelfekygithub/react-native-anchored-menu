import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import {
  MenuAnchor,
  useAnchoredMenuActions,
  useAnchoredMenuState,
} from 'react-native-anchored-menu';

export default function BasicExample() {
  const {open, close} = useAnchoredMenuActions();
  const isOpen = useAnchoredMenuState(state => state.isOpen);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleMenuAction = (action: string) => {
    setSelectedItem(action);
    close();
    setTimeout(() => {
      Alert.alert('Action Selected', `You selected: ${action}`);
    }, 100);
  };

  const openProfileMenu = () => {
    open({
      id: 'profile-menu',
      render: ({close}) => (
        <View style={styles.menu}>
          <Pressable 
            style={styles.menuItem}
            onPress={() => handleMenuAction('View Profile')}>
            <Text style={styles.menuText}>👤 View Profile</Text>
          </Pressable>
          <Pressable 
            style={styles.menuItem}
            onPress={() => handleMenuAction('Settings')}>
            <Text style={styles.menuText}>⚙️ Settings</Text>
          </Pressable>
          <Pressable 
            style={styles.menuItem}
            onPress={() => handleMenuAction('Help')}>
            <Text style={styles.menuText}>❓ Help</Text>
          </Pressable>
          <View style={styles.separator} />
          <Pressable 
            style={[styles.menuItem, styles.destructiveItem]}
            onPress={() => handleMenuAction('Logout')}>
            <Text style={[styles.menuText, styles.destructiveText]}>🚪 Logout</Text>
          </Pressable>
        </View>
      ),
    });
  };

  const openQuickMenu = () => {
    open({
      id: 'quick-menu',
      render: ({close}) => (
        <View style={styles.compactMenu}>
          <Pressable 
            style={styles.compactItem}
            onPress={() => handleMenuAction('Copy')}>
            <Text style={styles.compactText}>📋</Text>
          </Pressable>
          <Pressable 
            style={styles.compactItem}
            onPress={() => handleMenuAction('Share')}>
            <Text style={styles.compactText}>📤</Text>
          </Pressable>
          <Pressable 
            style={styles.compactItem}
            onPress={() => handleMenuAction('Delete')}>
            <Text style={styles.compactText}>🗑️</Text>
          </Pressable>
        </View>
      ),
    });
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📋 Basic Menu Usage</Text>
        <Text style={styles.sectionDescription}>
          The simplest way to add menus to your app. Just wrap any component with MenuAnchor
          and call open() to show the menu.
        </Text>

        <View style={styles.exampleContainer}>
          <MenuAnchor id="profile-menu">
            <Pressable style={styles.button} onPress={openProfileMenu}>
              <Text style={styles.buttonText}>👤 Profile Menu</Text>
            </Pressable>
          </MenuAnchor>

          <Text style={styles.helperText}>
            Try tapping the button above to see a typical profile menu
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Quick Actions</Text>
        <Text style={styles.sectionDescription}>
          Menus can also be compact and icon-based for quick actions.
        </Text>

        <View style={styles.exampleContainer}>
          <MenuAnchor id="quick-menu">
            <Pressable style={styles.iconButton} onPress={openQuickMenu}>
              <Text style={styles.iconButtonText}>⋯</Text>
            </Pressable>
          </MenuAnchor>

          <Text style={styles.helperText}>
            A more compact menu style for quick actions
          </Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 State Information</Text>
        <View style={styles.infoBox}>
          <Text style={styles.infoText}>Menu Open: {isOpen ? '✅ Yes' : '❌ No'}</Text>
          <Text style={styles.infoText}>
            Last Action: {selectedItem || 'None'}
          </Text>
        </View>
      </View>

      <View style={styles.codeSection}>
        <Text style={styles.codeSectionTitle}>💻 Code Example</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{`const { open } = useAnchoredMenuActions();

<MenuAnchor id="my-menu">
  <Pressable onPress={() => open({
    id: "my-menu",
    render: ({ close }) => (
      <View style={menuStyles}>
        <Pressable onPress={() => {
          doSomething();
          close();
        }}>
          <Text>Menu Item</Text>
        </Pressable>
      </View>
    )
  })}>
    <Text>Open Menu</Text>
  </Pressable>
</MenuAnchor>`}</Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 20,
  },
  exampleContainer: {
    alignItems: 'center',
    gap: 12,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 150,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  iconButton: {
    backgroundColor: '#f8f9fa',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  iconButtonText: {
    fontSize: 20,
    color: '#495057',
  },
  helperText: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 16,
    color: '#333',
  },
  destructiveItem: {
    backgroundColor: '#fff5f5',
  },
  destructiveText: {
    color: '#dc3545',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 8,
  },
  compactMenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  compactItem: {
    padding: 12,
  },
  compactText: {
    fontSize: 18,
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    gap: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#495057',
    fontFamily: 'monospace',
  },
  codeSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  codeSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  codeBlock: {
    backgroundColor: '#2d3748',
    padding: 16,
    borderRadius: 8,
  },
  codeText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});