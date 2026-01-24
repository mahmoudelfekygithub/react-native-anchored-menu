import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Alert,
} from 'react-native';
import {
  MenuAnchor,
  useAnchoredMenuActions,
} from 'react-native-anchored-menu';

interface ListItem {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'pending' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

const SAMPLE_DATA: ListItem[] = [
  {
    id: '1',
    title: 'Review quarterly reports',
    description: 'Analyze Q3 financial performance and prepare summary',
    status: 'pending',
    priority: 'high',
  },
  {
    id: '2',
    title: 'Update team documentation',
    description: 'Refresh onboarding guides and API documentation',
    status: 'active',
    priority: 'medium',
  },
  {
    id: '3',
    title: 'Schedule client meeting',
    description: 'Coordinate with ABC Corp for project kickoff',
    status: 'completed',
    priority: 'high',
  },
  {
    id: '4',
    title: 'Optimize database queries',
    description: 'Improve performance for user dashboard loading',
    status: 'active',
    priority: 'low',
  },
  {
    id: '5',
    title: 'Design new feature mockups',
    description: 'Create wireframes for the notification center',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: '6',
    title: 'Conduct security audit',
    description: 'Review authentication and data encryption practices',
    status: 'pending',
    priority: 'high',
  },
  {
    id: '7',
    title: 'Plan team retreat',
    description: 'Organize quarterly team building activities',
    status: 'active',
    priority: 'low',
  },
  {
    id: '8',
    title: 'Implement user feedback',
    description: 'Address top 5 feature requests from support tickets',
    status: 'pending',
    priority: 'medium',
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#dc3545';
    case 'medium': return '#fd7e14';
    case 'low': return '#28a745';
    default: return '#6c757d';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return '#007bff';
    case 'pending': return '#ffc107';
    case 'completed': return '#28a745';
    default: return '#6c757d';
  }
};

export default function FlatListExample() {
  const {open} = useAnchoredMenuActions();
  const [data, setData] = useState<ListItem[]>(SAMPLE_DATA);

  const handleAction = (itemId: string, action: string) => {
    switch (action) {
      case 'edit':
        Alert.alert('Edit Item', `Editing item ${itemId}`);
        break;
      case 'duplicate':
        const itemToDuplicate = data.find(item => item.id === itemId);
        if (itemToDuplicate) {
          const newItem = {
            ...itemToDuplicate,
            id: Date.now().toString(),
            title: `${itemToDuplicate.title} (Copy)`,
          };
          setData(prev => [...prev, newItem]);
          Alert.alert('Duplicated', 'Item has been duplicated');
        }
        break;
      case 'toggleStatus':
        setData(prev => prev.map(item => 
          item.id === itemId 
            ? {
                ...item, 
                status: item.status === 'completed' ? 'pending' : 'completed' as any
              }
            : item
        ));
        break;
      case 'delete':
        Alert.alert(
          'Delete Item',
          'Are you sure you want to delete this item?',
          [
            {text: 'Cancel', style: 'cancel'},
            {
              text: 'Delete',
              style: 'destructive',
              onPress: () => setData(prev => prev.filter(item => item.id !== itemId))
            },
          ]
        );
        break;
    }
  };

  const openItemMenu = (item: ListItem) => {
    const menuId = `item-${item.id}`;
    open({
      id: menuId,
      render: ({close}) => (
        <View style={styles.menu}>
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              handleAction(item.id, 'edit');
              close();
            }}>
            <Text style={styles.menuText}>✏️ Edit</Text>
          </Pressable>
          
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              handleAction(item.id, 'duplicate');
              close();
            }}>
            <Text style={styles.menuText}>📋 Duplicate</Text>
          </Pressable>
          
          <Pressable
            style={styles.menuItem}
            onPress={() => {
              handleAction(item.id, 'toggleStatus');
              close();
            }}>
            <Text style={styles.menuText}>
              {item.status === 'completed' ? '↩️ Mark Pending' : '✅ Mark Complete'}
            </Text>
          </Pressable>
          
          <View style={styles.separator} />
          
          <Pressable
            style={[styles.menuItem, styles.destructiveItem]}
            onPress={() => {
              handleAction(item.id, 'delete');
              close();
            }}>
            <Text style={[styles.menuText, styles.destructiveText]}>🗑️ Delete</Text>
          </Pressable>
        </View>
      ),
    });
  };

  const renderItem = ({item}: {item: ListItem}) => (
    <View style={styles.listItem}>
      <View style={styles.itemContent}>
        <View style={styles.itemHeader}>
          <Text style={styles.itemTitle}>{item.title}</Text>
          <View style={styles.badges}>
            <View style={[styles.badge, {backgroundColor: getPriorityColor(item.priority)}]}>
              <Text style={styles.badgeText}>{item.priority.toUpperCase()}</Text>
            </View>
            <View style={[styles.badge, {backgroundColor: getStatusColor(item.status)}]}>
              <Text style={styles.badgeText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
        </View>
        
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      
      <MenuAnchor id={`item-${item.id}`}>
        <Pressable
          style={styles.moreButton}
          onPress={() => openItemMenu(item)}>
          <Text style={styles.moreButtonText}>⋯</Text>
        </Pressable>
      </MenuAnchor>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Task List</Text>
        <Text style={styles.headerSubtitle}>
          Each item has a context menu. Try scrolling and opening menus at different positions.
        </Text>
      </View>
      
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          💡 The menu positioning automatically adapts as you scroll, ensuring menus stay visible
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f8f9fa',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  listContainer: {
    paddingVertical: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  itemContent: {
    flex: 1,
    marginRight: 12,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 4,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#fff',
  },
  itemDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#dee2e6',
  },
  moreButtonText: {
    fontSize: 18,
    color: '#495057',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 16,
  },
  menu: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
    minWidth: 180,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  menuText: {
    fontSize: 15,
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
  footer: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  footerText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});