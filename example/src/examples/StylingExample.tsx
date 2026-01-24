import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Animated,
  Dimensions,
} from 'react-native';
import {
  MenuAnchor,
  useAnchoredMenuActions,
} from 'react-native-anchored-menu';
import type {AnimationType} from 'react-native-anchored-menu';

const {width} = Dimensions.get('window');

interface StyleTheme {
  name: string;
  menuStyle: any;
  itemStyle: any;
  textStyle: any;
  description: string;
}

const themes: StyleTheme[] = [
  {
    name: 'Modern Card',
    description: 'Clean card design with subtle shadows',
    menuStyle: {
      backgroundColor: '#fff',
      borderRadius: 16,
      padding: 8,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.15,
      shadowRadius: 20,
      elevation: 10,
      minWidth: 200,
    },
    itemStyle: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 8,
      marginBottom: 2,
    },
    textStyle: {
      fontSize: 15,
      color: '#333',
      fontWeight: '500',
    },
  },
  {
    name: 'Glassmorphism',
    description: 'Translucent glass effect with backdrop blur',
    menuStyle: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderRadius: 20,
      padding: 12,
      borderWidth: 1,
      borderColor: 'rgba(255, 255, 255, 0.3)',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      minWidth: 180,
    },
    itemStyle: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 12,
      marginBottom: 4,
      backgroundColor: 'rgba(255, 255, 255, 0.1)',
    },
    textStyle: {
      fontSize: 14,
      color: '#333',
      fontWeight: '600',
    },
  },
  {
    name: 'Dark Mode',
    description: 'Dark theme with vibrant accents',
    menuStyle: {
      backgroundColor: '#1e1e1e',
      borderRadius: 12,
      padding: 8,
      borderWidth: 1,
      borderColor: '#333',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
      minWidth: 180,
    },
    itemStyle: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      marginBottom: 2,
    },
    textStyle: {
      fontSize: 14,
      color: '#fff',
      fontWeight: '500',
    },
  },
  {
    name: 'Colorful',
    description: 'Vibrant gradient background',
    menuStyle: {
      backgroundColor: 'transparent',
      borderRadius: 16,
      padding: 0,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 4},
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
      minWidth: 160,
    },
    itemStyle: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255, 255, 255, 0.5)',
    },
    textStyle: {
      fontSize: 14,
      color: '#333',
      fontWeight: '600',
    },
  },
];

const AnimatedMenu = ({theme, onClose, title}: {theme: StyleTheme; onClose: () => void; title: string}) => {
  const animatedValue = new Animated.Value(0);
  
  React.useEffect(() => {
    Animated.spring(animatedValue, {
      toValue: 1,
      tension: 300,
      friction: 20,
      useNativeDriver: true,
    }).start();
  }, []);

  const transform = [{
    scale: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.8, 1],
    }),
  }];

  const opacity = animatedValue;

  const menuContent = (
    <View style={theme.menuStyle}>
      {theme.name === 'Colorful' && (
        <View style={styles.gradientBackground} />
      )}
      <Pressable
        style={[theme.itemStyle, {backgroundColor: theme.name === 'Dark Mode' ? '#333' : 'rgba(0, 123, 255, 0.1)'}]}
        onPress={() => {
          console.log('Action 1');
          onClose();
        }}>
        <Text style={theme.textStyle}>🎨 {title}</Text>
      </Pressable>
      
      <Pressable
        style={[theme.itemStyle, {backgroundColor: theme.name === 'Dark Mode' ? '#2d2d2d' : 'rgba(40, 167, 69, 0.1)'}]}
        onPress={() => {
          console.log('Customize');
          onClose();
        }}>
        <Text style={theme.textStyle}>⚙️ Customize</Text>
      </Pressable>
      
      <Pressable
        style={[theme.itemStyle, {backgroundColor: theme.name === 'Dark Mode' ? '#2d2d2d' : 'rgba(255, 193, 7, 0.1)'}]}
        onPress={() => {
          console.log('Share');
          onClose();
        }}>
        <Text style={theme.textStyle}>📤 Share Style</Text>
      </Pressable>
    </View>
  );

  return (
    <Animated.View style={[{opacity, transform}]}>
      {menuContent}
    </Animated.View>
  );
};

export default function StylingExample() {
  const {open} = useAnchoredMenuActions();
  const [selectedAnimation, setSelectedAnimation] = useState<AnimationType>('fade');

  const openThemedMenu = (theme: StyleTheme) => {
    const menuId = `theme-${theme.name.toLowerCase().replace(' ', '-')}`;
    open({
      id: menuId,
      animationType: selectedAnimation,
      render: ({close}) => (
        <AnimatedMenu 
          theme={theme} 
          onClose={close}
          title={theme.name}
        />
      ),
    });
  };

  const openContextualMenu = (context: string) => {
    open({
      id: `contextual-${context.toLowerCase()}`,
      render: ({close}) => (
        <View style={styles.contextualMenu}>
          <View style={styles.contextualHeader}>
            <Text style={styles.contextualTitle}>{context} Menu</Text>
          </View>
          
          <Pressable style={styles.contextualItem} onPress={close}>
            <Text style={styles.contextualEmoji}>📝</Text>
            <Text style={styles.contextualText}>Edit {context}</Text>
          </Pressable>
          
          <Pressable style={styles.contextualItem} onPress={close}>
            <Text style={styles.contextualEmoji}>📋</Text>
            <Text style={styles.contextualText}>Copy {context}</Text>
          </Pressable>
          
          <Pressable style={styles.contextualItem} onPress={close}>
            <Text style={styles.contextualEmoji}>🔗</Text>
            <Text style={styles.contextualText}>Share {context}</Text>
          </Pressable>
          
          <View style={styles.contextualSeparator} />
          
          <Pressable style={[styles.contextualItem, styles.contextualDestructive]} onPress={close}>
            <Text style={styles.contextualEmoji}>🗑️</Text>
            <Text style={[styles.contextualText, styles.contextualDestructiveText]}>
              Delete {context}
            </Text>
          </Pressable>
        </View>
      ),
    });
  };

  const [showSubmenu, setShowSubmenu] = useState(false);

  const openNestedMenu = () => {
    open({
      id: 'nested-menu',
      render: ({close}) => (
        <View style={styles.nestedMenu}>
          <Text style={styles.nestedTitle}>Main Menu</Text>
          
          <Pressable
            style={styles.nestedItem}
            onPress={() => {
              setShowSubmenu(true);
              open({
                id: 'nested-menu',
                placement: 'auto',
                align: 'end',
                offset: -10,
                immediate: true,
                render: ({close: closeSubmenu}) => (
                  <View style={[styles.submenu, {zIndex: 1001}]}>
                    <Text style={styles.submenuTitle}>More Options</Text>
                    <Pressable 
                      style={styles.submenuItem} 
                      onPress={() => {
                        console.log('Advanced Settings selected');
                        closeSubmenu();
                        close();
                        setShowSubmenu(false);
                      }}>
                      <Text style={styles.submenuText}>⚙️ Advanced Settings</Text>
                    </Pressable>
                    <Pressable 
                      style={styles.submenuItem} 
                      onPress={() => {
                        console.log('Export Options selected');
                        closeSubmenu();
                        close();
                        setShowSubmenu(false);
                      }}>
                      <Text style={styles.submenuText}>📤 Export Options</Text>
                    </Pressable>
                    <Pressable 
                      style={styles.submenuItem} 
                      onPress={() => {
                        console.log('Danger Zone selected');
                        closeSubmenu();
                        close();
                        setShowSubmenu(false);
                      }}>
                      <Text style={[styles.submenuText, {color: '#dc3545'}]}>⚠️ Danger Zone</Text>
                    </Pressable>
                    <View style={styles.separator} />
                    <Pressable 
                      style={styles.submenuItem} 
                      onPress={() => {
                        // OPTION 1: Just close submenu (current)
                        closeSubmenu();
                        setShowSubmenu(false);
                        
                        // OPTION 2: Navigate back to main menu (uncomment below)
                        // closeSubmenu();
                        // setShowSubmenu(false);
                        // setTimeout(() => openNestedMenu(), 150);
                        
                        // OPTION 3: Close everything (uncomment below)
                        // closeSubmenu();
                        // close();
                        // setShowSubmenu(false);
                      }}>
                      <Text style={styles.submenuText}>← Back</Text>
                    </Pressable>
                  </View>
                ),
              });
            }}>
            <Text style={styles.nestedText}>
              📁 More Options → {showSubmenu && '(Open)'}
            </Text>
          </Pressable>
          
          <Pressable style={styles.nestedItem} onPress={() => {
            console.log('Settings selected');
            close();
          }}>
            <Text style={styles.nestedText}>⚙️ General Settings</Text>
          </Pressable>
          
          <Pressable style={styles.nestedItem} onPress={() => {
            console.log('Help selected');
            close();
          }}>
            <Text style={styles.nestedText}>❓ Help & Support</Text>
          </Pressable>

          <Pressable style={styles.nestedItem} onPress={() => {
            console.log('About selected');
            close();
          }}>
            <Text style={styles.nestedText}>ℹ️ About</Text>
          </Pressable>
        </View>
      ),
    });
  };

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎨 Custom Styling</Text>
        <Text style={styles.sectionDescription}>
          The library is completely headless - you have full control over menu appearance and animations.
        </Text>
      </View>

      <View style={styles.themesSection}>
        <Text style={styles.themesTitle}>Design Themes</Text>
        <View style={styles.themesGrid}>
          {themes.map((theme, index) => (
            <MenuAnchor key={theme.name} id={`theme-${theme.name.toLowerCase().replace(' ', '-')}`}>
              <Pressable
                style={styles.themeCard}
                onPress={() => openThemedMenu(theme)}>
                <Text style={styles.themeCardTitle}>{theme.name}</Text>
                <Text style={styles.themeCardDescription}>{theme.description}</Text>
              </Pressable>
            </MenuAnchor>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>⚡ Animation Options</Text>
        <View style={styles.animationSection}>
          <Text style={styles.animationLabel}>Animation Type:</Text>
          <View style={styles.animationOptions}>
            {(['fade', 'none'] as AnimationType[]).map(animation => (
              <Pressable
                key={animation}
                style={[
                  styles.animationOption,
                  selectedAnimation === animation && styles.animationOptionSelected
                ]}
                onPress={() => setSelectedAnimation(animation)}>
                <Text style={[
                  styles.animationOptionText,
                  selectedAnimation === animation && styles.animationOptionTextSelected
                ]}>
                  {animation}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🎯 Contextual Menus</Text>
        <Text style={styles.sectionDescription}>
          Different contexts call for different menu styles and content.
        </Text>
        
        <View style={styles.contextualGrid}>
          {['Document', 'Image', 'Folder'].map(context => (
            <MenuAnchor key={context} id={`contextual-${context.toLowerCase()}`}>
              <Pressable
                style={styles.contextualTrigger}
                onPress={() => openContextualMenu(context)}>
                <Text style={styles.contextualTriggerIcon}>
                  {context === 'Document' ? '📄' : context === 'Image' ? '🖼️' : '📁'}
                </Text>
                <Text style={styles.contextualTriggerText}>{context}</Text>
              </Pressable>
            </MenuAnchor>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>📊 Advanced Patterns</Text>
        <Text style={styles.sectionDescription}>
          Complex menu structures and interactions.
        </Text>
        
        <View style={styles.advancedSection}>
          <MenuAnchor id="nested-menu">
            <Pressable style={styles.advancedButton} onPress={openNestedMenu}>
              <Text style={styles.advancedButtonText}>🔗 Cascading Menu</Text>
            </Pressable>
          </MenuAnchor>
        </View>
      </View>

      <View style={styles.codeSection}>
        <Text style={styles.codeSectionTitle}>💻 Custom Styling</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{`render: ({ close, anchor }) => (
  <View style={{
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  }}>
    <Pressable onPress={close}>
      <Text>Custom Menu Item</Text>
    </Pressable>
  </View>
)`}</Text>
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
  },
  themesSection: {
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  themesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
    textAlign: 'center',
  },
  themesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'space-between',
  },
  themeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    width: (width - 60) / 2,
    borderWidth: 1,
    borderColor: '#e9ecef',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  themeCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  themeCardDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  animationSection: {
    marginTop: 16,
    gap: 12,
  },
  animationLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#495057',
  },
  animationOptions: {
    flexDirection: 'row',
    gap: 8,
  },
  animationOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  animationOptionSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  animationOptionText: {
    fontSize: 12,
    color: '#495057',
    fontWeight: '600',
  },
  animationOptionTextSelected: {
    color: '#fff',
  },
  contextualGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 16,
  },
  contextualTrigger: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  contextualTriggerIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  contextualTriggerText: {
    fontSize: 14,
    color: '#495057',
    fontWeight: '600',
  },
  contextualMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 200,
    overflow: 'hidden',
  },
  contextualHeader: {
    backgroundColor: '#f8f9fa',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  contextualTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#495057',
    textAlign: 'center',
  },
  contextualItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 12,
  },
  contextualEmoji: {
    fontSize: 16,
  },
  contextualText: {
    fontSize: 14,
    color: '#333',
  },
  contextualSeparator: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginHorizontal: 8,
  },
  contextualDestructive: {
    backgroundColor: '#fff5f5',
  },
  contextualDestructiveText: {
    color: '#dc3545',
  },
  advancedSection: {
    marginTop: 16,
    alignItems: 'center',
  },
  advancedButton: {
    backgroundColor: '#6f42c1',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  advancedButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  nestedMenu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 180,
  },
  nestedTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    padding: 12,
    backgroundColor: '#f8f9fa',
    textAlign: 'center',
  },
  nestedItem: {
    padding: 12,
  },
  nestedText: {
    fontSize: 14,
    color: '#333',
  },
  submenu: {
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    minWidth: 140,
  },
  submenuTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#666',
    padding: 8,
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
  },
  submenuItem: {
    padding: 8,
  },
  submenuText: {
    fontSize: 12,
    color: '#333',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 16,
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
    fontSize: 11,
    fontFamily: 'monospace',
    lineHeight: 15,
  },
});