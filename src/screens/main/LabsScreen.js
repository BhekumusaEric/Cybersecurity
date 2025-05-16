/**
 * Labs Screen
 */
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const labsData = [
  {
    id: '1',
    title: 'Network Scanning Lab',
    description: 'Learn how to scan networks and identify vulnerabilities',
    difficulty: 'Beginner',
    duration: '2 hours',
    status: 'completed', // 'completed', 'inProgress', 'notStarted'
    tools: ['Nmap', 'Wireshark'],
  },
  {
    id: '2',
    title: 'SQL Injection Practice',
    description: 'Practice SQL injection techniques in a safe environment',
    difficulty: 'Intermediate',
    duration: '3 hours',
    status: 'inProgress',
    tools: ['SQLmap', 'Burp Suite'],
  },
  {
    id: '3',
    title: 'Password Cracking Lab',
    description: 'Learn various password cracking techniques and tools',
    difficulty: 'Intermediate',
    duration: '2.5 hours',
    status: 'notStarted',
    tools: ['John the Ripper', 'Hashcat'],
  },
  {
    id: '4',
    title: 'Web Application Penetration Testing',
    description: 'Comprehensive lab for testing web application security',
    difficulty: 'Advanced',
    duration: '4 hours',
    status: 'notStarted',
    tools: ['OWASP ZAP', 'Burp Suite', 'Metasploit'],
  },
  {
    id: '5',
    title: 'Wireless Network Security',
    description: 'Test the security of wireless networks and identify vulnerabilities',
    difficulty: 'Intermediate',
    duration: '3 hours',
    status: 'notStarted',
    tools: ['Aircrack-ng', 'Kismet'],
  },
];

const LabsScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState('all'); // 'all', 'inProgress', 'completed', 'notStarted'

  // Filter labs based on search query and filter
  const filteredLabs = labsData.filter((lab) => {
    const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filter === 'all') return matchesSearch;
    if (filter === 'inProgress') return matchesSearch && lab.status === 'inProgress';
    if (filter === 'completed') return matchesSearch && lab.status === 'completed';
    if (filter === 'notStarted') return matchesSearch && lab.status === 'notStarted';
    
    return matchesSearch;
  });

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
      padding: 16,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: colors.card,
      borderRadius: 8,
      paddingHorizontal: 12,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    searchIcon: {
      marginRight: 8,
    },
    searchInput: {
      flex: 1,
      height: 40,
      color: colors.text,
    },
    filterContainer: {
      flexDirection: 'row',
      marginBottom: 16,
    },
    filterButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 20,
      marginRight: 8,
      borderWidth: 1,
    },
    filterButtonText: {
      fontWeight: '500',
    },
    labCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 16,
      padding: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    labTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    labDescription: {
      fontSize: 14,
      color: colors.text + '99',
      marginBottom: 12,
    },
    labMetaContainer: {
      flexDirection: 'row',
      marginBottom: 12,
    },
    labMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
    },
    labMetaText: {
      fontSize: 12,
      color: colors.text + '99',
      marginLeft: 4,
    },
    toolsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    toolChip: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 8,
      marginBottom: 8,
    },
    toolChipText: {
      fontSize: 12,
      color: colors.primary,
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 12,
    },
    statusText: {
      fontSize: 12,
      marginLeft: 4,
    },
    labActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
    },
    labButton: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    labButtonText: {
      color: '#FFFFFF',
      fontWeight: '500',
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 40,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text + '99',
      textAlign: 'center',
      marginTop: 16,
    },
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return colors.success;
      case 'inProgress':
        return colors.warning;
      case 'notStarted':
      default:
        return colors.text + '99';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'inProgress':
        return 'In Progress';
      case 'notStarted':
      default:
        return 'Not Started';
    }
  };

  const getButtonText = (status) => {
    switch (status) {
      case 'completed':
        return 'Review Lab';
      case 'inProgress':
        return 'Continue Lab';
      case 'notStarted':
      default:
        return 'Start Lab';
    }
  };

  const renderLabItem = ({ item }) => (
    <TouchableOpacity
      style={styles.labCard}
      onPress={() => navigation.navigate('LabDetail', { labId: item.id })}
    >
      <Text style={styles.labTitle}>{item.title}</Text>
      <Text style={styles.labDescription}>{item.description}</Text>
      
      <View style={styles.labMetaContainer}>
        <View style={styles.labMeta}>
          <Icon name="speedometer" size={16} color={colors.text + '99'} />
          <Text style={styles.labMetaText}>{item.difficulty}</Text>
        </View>
        <View style={styles.labMeta}>
          <Icon name="clock-outline" size={16} color={colors.text + '99'} />
          <Text style={styles.labMetaText}>{item.duration}</Text>
        </View>
      </View>
      
      <View style={styles.toolsContainer}>
        {item.tools.map((tool, index) => (
          <View key={index} style={styles.toolChip}>
            <Text style={styles.toolChipText}>{tool}</Text>
          </View>
        ))}
      </View>
      
      <View style={styles.statusContainer}>
        <Icon
          name={
            item.status === 'completed'
              ? 'check-circle'
              : item.status === 'inProgress'
              ? 'progress-clock'
              : 'circle-outline'
          }
          size={16}
          color={getStatusColor(item.status)}
        />
        <Text
          style={[
            styles.statusText,
            { color: getStatusColor(item.status) },
          ]}
        >
          {getStatusText(item.status)}
        </Text>
      </View>
      
      <View style={styles.labActions}>
        <TouchableOpacity
          style={styles.labButton}
          onPress={() => navigation.navigate('LabDetail', { labId: item.id })}
        >
          <Text style={styles.labButtonText}>
            {getButtonText(item.status)}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Icon name="flask-empty" size={64} color={colors.text + '50'} />
      <Text style={styles.emptyText}>No labs found matching your criteria</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <Icon name="magnify" size={20} color={colors.text + '99'} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search labs..."
          placeholderTextColor={colors.text + '80'}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'all' ? colors.primary + '20' : 'transparent',
              borderColor: filter === 'all' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setFilter('all')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'all' ? colors.primary : colors.text },
            ]}
          >
            All
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'inProgress' ? colors.primary + '20' : 'transparent',
              borderColor: filter === 'inProgress' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setFilter('inProgress')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'inProgress' ? colors.primary : colors.text },
            ]}
          >
            In Progress
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[
            styles.filterButton,
            {
              backgroundColor: filter === 'completed' ? colors.primary + '20' : 'transparent',
              borderColor: filter === 'completed' ? colors.primary : colors.border,
            },
          ]}
          onPress={() => setFilter('completed')}
        >
          <Text
            style={[
              styles.filterButtonText,
              { color: filter === 'completed' ? colors.primary : colors.text },
            ]}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>
      
      <FlatList
        data={filteredLabs}
        renderItem={renderLabItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyList}
      />
    </View>
  );
};

export default LabsScreen;
