import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import {
  MenuAnchor,
  AnchoredMenuProvider,
  useAnchoredMenuActions,
} from 'react-native-anchored-menu';

interface ModalDemoProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  content: string;
}

function ModalDemo({visible, onClose, title, content}: ModalDemoProps) {
  const {open} = useAnchoredMenuActions();

  const openOptionsMenu = () => {
    open({
      id: 'modal-options',
      render: ({close}) => (
        <View style={styles.menu}>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              Alert.alert('Bookmark', 'Content bookmarked!');
              close();
            }}>
            <Text style={styles.menuText}>🔖 Bookmark</Text>
          </Pressable>
          
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              Alert.alert('Share', 'Content shared!');
              close();
            }}>
            <Text style={styles.menuText}>📤 Share</Text>
          </Pressable>
          
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              Alert.alert('Print', 'Printing content...');
              close();
            }}>
            <Text style={styles.menuText}>🖨️ Print</Text>
          </Pressable>
          
          <View style={styles.separator} />
          
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              Alert.alert('Report', 'Content reported');
              close();
            }}>
            <Text style={[styles.menuText, styles.destructiveText]}>⚠️ Report</Text>
          </Pressable>
        </View>
      ),
    });
  };

  const openUserMenu = () => {
    open({
      id: 'modal-user',
      render: ({close}) => (
        <View style={styles.compactMenu}>
          <Pressable
            style={styles.compactItem}
            onPress={() => {
              Alert.alert('Profile', 'Opening profile...');
              close();
            }}>
            <Text style={styles.compactText}>👤</Text>
          </Pressable>
          
          <Pressable
            style={styles.compactItem}
            onPress={() => {
              Alert.alert('Messages', 'Opening messages...');
              close();
            }}>
            <Text style={styles.compactText}>💬</Text>
          </Pressable>
          
          <Pressable
            style={styles.compactItem}
            onPress={() => {
              Alert.alert('Settings', 'Opening settings...');
              close();
            }}>
            <Text style={styles.compactText}>⚙️</Text>
          </Pressable>
        </View>
      ),
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}>
      {/* Wrap modal content with AnchoredMenuProvider for proper menu rendering */}
      <View style={styles.modalContainer}>
        <AnchoredMenuProvider>
          <View style={styles.modalHeader}>
            <Pressable onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </Pressable>
            
            <Text style={styles.modalTitle}>{title}</Text>
            
            <MenuAnchor id="modal-options">
              <Pressable onPress={openOptionsMenu} style={styles.optionsButton}>
                <Text style={styles.optionsButtonText}>⋯</Text>
              </Pressable>
            </MenuAnchor>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <Text style={styles.modalText}>{content}</Text>
            
            <View style={styles.contentActions}>
              <Text style={styles.sectionTitle}>User Actions</Text>
              <Text style={styles.sectionDescription}>
                These menus work perfectly inside the modal
              </Text>
              
              <MenuAnchor id="modal-user">
                <Pressable style={styles.actionButton} onPress={openUserMenu}>
                  <Text style={styles.actionButtonText}>👤 User Menu</Text>
                </Pressable>
              </MenuAnchor>
            </View>
            
            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>💡 Modal Menu Tips</Text>
              <Text style={styles.infoText}>
                • Each modal needs its own AnchoredMenuProvider{'\n'}
                • Menus render above modal content{'\n'}
                • Positioning works correctly in modal context{'\n'}
                • Try both portrait and landscape orientations
              </Text>
            </View>
          </ScrollView>
        </AnchoredMenuProvider>
      </View>
    </Modal>
  );
}

export default function ModalExample() {
  const [modalVisible, setModalVisible] = useState(false);
  const [fullscreenModalVisible, setFullscreenModalVisible] = useState(false);
  const {open} = useAnchoredMenuActions();

  const sampleContent = `This is a sample modal with anchored menus. The library handles menu positioning correctly even inside React Native modals.

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Notice how the menus in the header and content area position themselves correctly relative to their anchors, even inside this modal context.`;

  return (
    <ScrollView style={styles.container} contentInsetAdjustmentBehavior="automatic">
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>🪟 Modals with Menus</Text>
        <Text style={styles.sectionDescription}>
          React Native modals render in a separate native layer. To ensure menus appear 
          correctly, wrap the modal content with AnchoredMenuProvider.
        </Text>
        
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.primaryButton}
            onPress={() => setModalVisible(true)}>
            <Text style={styles.primaryButtonText}>Open Sheet Modal</Text>
          </Pressable>
          
          <Pressable
            style={styles.secondaryButton}
            onPress={() => setFullscreenModalVisible(true)}>
            <Text style={styles.secondaryButtonText}>Open Fullscreen Modal</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.codeSection}>
        <Text style={styles.codeSectionTitle}>💻 Modal Setup Code</Text>
        <View style={styles.codeBlock}>
          <Text style={styles.codeText}>{`<Modal visible={visible} onRequestClose={onClose}>
  <View style={{ flex: 1, position: 'relative' }}>
    <AnchoredMenuProvider>
      {/* Your modal content with MenuAnchors */}
      <MenuAnchor id="modal-menu">
        <Pressable onPress={openMenu}>
          <Text>Menu Button</Text>
        </Pressable>
      </MenuAnchor>
    </AnchoredMenuProvider>
  </View>
</Modal>`}</Text>
        </View>
      </View>

      <ModalDemo
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Sheet Modal Demo"
        content={sampleContent}
      />
      
      <Modal
        visible={fullscreenModalVisible}
        animationType="fade"
        onRequestClose={() => setFullscreenModalVisible(false)}>
        <View style={styles.fullscreenModalContainer}>
          <AnchoredMenuProvider>
            <View style={styles.fullscreenModalHeader}>
              <Text style={styles.fullscreenModalTitle}>Fullscreen Modal</Text>
              <Pressable
                onPress={() => setFullscreenModalVisible(false)}
                style={styles.fullscreenCloseButton}>
                <Text style={styles.fullscreenCloseButtonText}>Done</Text>
              </Pressable>
            </View>
            
            <View style={styles.fullscreenModalContent}>
              <Text style={styles.fullscreenModalText}>
                This is a fullscreen modal with menu support.
              </Text>
              
              <MenuAnchor id="fullscreen-menu">
                <Pressable
                  style={styles.fullscreenMenuButton}
                  onPress={() => {
                    open({
                      id: 'fullscreen-menu',
                      render: ({close}) => (
                        <View style={styles.menu}>
                          <Pressable style={styles.menuItem} onPress={close}>
                            <Text style={styles.menuText}>📱 Fullscreen Action</Text>
                          </Pressable>
                        </View>
                      ),
                    });
                  }}>
                  <Text style={styles.fullscreenMenuButtonText}>Open Menu</Text>
                </Pressable>
              </MenuAnchor>
            </View>
          </AnchoredMenuProvider>
        </View>
      </Modal>
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
  buttonContainer: {
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  secondaryButtonText: {
    color: '#495057',
    fontSize: 16,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
    backgroundColor: '#f8f9fa',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 16,
    color: '#495057',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  optionsButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionsButtonText: {
    fontSize: 16,
    color: '#495057',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  modalText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    marginBottom: 24,
  },
  contentActions: {
    marginBottom: 24,
  },
  actionButton: {
    backgroundColor: '#28a745',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 160,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 15,
    color: '#333',
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
    fontSize: 16,
  },
  fullscreenModalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  fullscreenModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#333',
  },
  fullscreenModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  fullscreenCloseButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  fullscreenCloseButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  fullscreenModalContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fullscreenModalText: {
    fontSize: 18,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 24,
  },
  fullscreenMenuButton: {
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  fullscreenMenuButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '600',
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