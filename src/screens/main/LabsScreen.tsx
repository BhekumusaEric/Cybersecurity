import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { MainStackParamList } from '../../navigation/types';

type LabsScreenNavigationProp = StackNavigationProp<MainStackParamList, 'Labs'>;

// Mock data for labs
const labsData = [
  {
    id: '1',
    title: 'Network Scanning Lab',
    description: 'Learn how to use Nmap for network reconnaissance and vulnerability scanning.',
    category: 'Network Security',
    difficulty: 'Intermediate',
    duration: '45 minutes',
    status: 'available', // available, scheduled, completed
    scheduledDate: null,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '2',
    title: 'SQL Injection Workshop',
    description: 'Practice SQL injection techniques on vulnerable web applications.',
    category: 'Web Security',
    difficulty: 'Advanced',
    duration: '60 minutes',
    status: 'scheduled',
    scheduledDate: '2023-05-20T14:00:00Z',
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '3',
    title: 'Password Cracking Lab',
    description: 'Learn various password cracking techniques using popular tools.',
    category: 'System Security',
    difficulty: 'Intermediate',
    duration: '30 minutes',
    status: 'completed',
    scheduledDate: null,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '4',
    title: 'Wireless Network Security',
    description: 'Explore vulnerabilities in wireless networks and how to secure them.',
    category: 'Network Security',
    difficulty: 'Advanced',
    duration: '75 minutes',
    status: 'available',
    scheduledDate: null,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '5',
    title: 'Social Engineering Basics',
    description: 'Learn the fundamentals of social engineering attacks and defenses.',
    category: 'Social Engineering',
    difficulty: 'Beginner',
    duration: '45 minutes',
    status: 'available',
    scheduledDate: null,
    image: 'https://via.placeholder.com/150',
  },
  {
    id: '6',
    title: 'Cryptography Fundamentals',
    description: 'Understand basic cryptographic concepts and algorithms.',
    category: 'Cryptography',
    difficulty: 'Beginner',
    duration: '60 minutes',
    status: 'completed',
    scheduledDate: null,
    image: 'https://via.placeholder.com/150',
  },
];

// Filter options
const categories = ['All', 'Network Security', 'Web Security', 'System Security', 'Social Engineering', 'Cryptography'];
const difficulties = ['All', 'Beginner', 'Intermediate', 'Advanced'];
const statusFilters = ['All', 'Available', 'Scheduled', 'Completed'];

const LabsScreen: React.FC = () => {
  const navigation = useNavigation<LabsScreenNavigationProp>();
  const { colors, isDark } = useTheme();
  const { user } = useAuth();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Simulate loading labs
  useEffect(() => {
    const loadLabs = async () => {
      setIsLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setIsLoading(false);
    };

    loadLabs();
  }, []);

  // Navigate to lab details
  const navigateToLab = (labId: string) => {
    navigation.navigate('LabDetails', { labId });
  };

  // Handle refresh
  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  // Filter labs based on search query and filters
  const filteredLabs = labsData.filter((lab) => {
    // Search query filter
    const matchesSearch = lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Category filter
    const matchesCategory = selectedCategory === 'All' || lab.category === selectedCategory;
    
    // Difficulty filter
    const matchesDifficulty = selectedDifficulty === 'All' || lab.difficulty === selectedDifficulty;
    
    // Status filter
    const matchesStatus = selectedStatus === 'All' || 
      (selectedStatus === 'Available' && lab.status === 'available') ||
      (selectedStatus === 'Scheduled' && lab.status === 'scheduled') ||
      (selectedStatus === 'Completed' && lab.status === 'completed');
    
    return matchesSearch && matchesCategory && matchesDifficulty && matchesStatus;
  });

  // Render lab item
  const renderLabItem = ({ item }: { item: typeof labsData[0] }) => {
    // Determine color based on difficulty
    const getDifficultyColor = () => {
      switch (item.difficulty) {
        case 'Beginner':
          return colors.success;
        case 'Intermediate':
          return colors.warning;
        case 'Advanced':
          return colors.danger;
        default:
          return colors.info;
      }
    };

    // Determine status color and text
    const getStatusInfo = () => {
      switch (item.status) {
        case 'available':
          return { color: colors.success, text: 'Available' };
        case 'scheduled':
          return { color: colors.warning, text: 'Scheduled' };
        case 'completed':
          return { color: colors.info, text: 'Completed' };
        default:
          return { color: colors.gray, text: 'Unknown' };
      }
    };

    const statusInfo = getStatusInfo();

    return (
      <TouchableOpacity
        style={[
          styles.labItem,
          { backgroundColor: isDark ? colors.darkGray : colors.white },
        ]}
        onPress={() => navigateToLab(item.id)}
      >
        <View style={styles.labImageContainer}>
          <Image
            source={{ uri: item.image }}
            style={styles.labImage}
            resizeMode="cover"
          />
        </View>
        
        <View style={styles.labContent}>
          <View style={styles.labHeader}>
            <Text
              style={[
                styles.labTitle,
                { color: isDark ? colors.white : colors.dark },
              ]}
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <View
              style={[
                styles.difficultyBadge,
                { backgroundColor: getDifficultyColor() },
              ]}
            >
              <Text style={styles.difficultyText}>{item.difficulty}</Text>
            </View>
          </View>
          
          <Text
            style={[
              styles.labDescription,
              { color: isDark ? colors.lightGray : colors.gray },
            ]}
            numberOfLines={2}
          >
            {item.description}
          </Text>
          
          <View style={styles.labFooter}>
            <View style={styles.labInfo}>
              <Text
                style={[
                  styles.labCategory,
                  { color: isDark ? colors.lightGray : colors.gray },
                ]}
              >
                {item.category} • {item.duration}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: statusInfo.color }]}>
                <Text style={styles.statusText}>{statusInfo.text}</Text>
              </View>
            </View>
            
            <Button
              title={item.status === 'completed' ? 'Review' : item.status === 'scheduled' ? 'Join' : 'Start'}
              variant={item.status === 'completed' ? 'outline' : 'primary'}
              size="small"
              onPress={() => navigateToLab(item.id)}
            />
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // Render filter chip
  const renderFilterChip = (
    title: string,
    isSelected: boolean,
    onPress: () => void
  ) => (
    <TouchableOpacity
      style={[
        styles.filterChip,
        {
          backgroundColor: isSelected
            ? colors.primary
            : isDark
            ? colors.darkGray
            : colors.lightGray,
        },
      ]}
      onPress={onPress}
    >
      <Text
        style={[
          styles.filterChipText,
          {
            color: isSelected
              ? colors.white
              : isDark
              ? colors.lightGray
              : colors.gray,
          },
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darker : colors.lighter },
      ]}
    >
      {/* Search Bar */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: isDark ? colors.darkGray : colors.white },
        ]}
      >
        <TextInput
          style={[
            styles.searchInput,
            { color: isDark ? colors.white : colors.dark },
          ]}
          placeholder="Search labs..."
          placeholderTextColor={isDark ? colors.lightGray : colors.gray}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        {/* Category Filters */}
        <Text
          style={[
            styles.filterTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          Category
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderFilterChip(
            item,
            selectedCategory === item,
            () => setSelectedCategory(item)
          )}
          style={styles.filterList}
        />

        {/* Difficulty Filters */}
        <Text
          style={[
            styles.filterTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          Difficulty
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={difficulties}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderFilterChip(
            item,
            selectedDifficulty === item,
            () => setSelectedDifficulty(item)
          )}
          style={styles.filterList}
        />

        {/* Status Filters */}
        <Text
          style={[
            styles.filterTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          Status
        </Text>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={statusFilters}
          keyExtractor={(item) => item}
          renderItem={({ item }) => renderFilterChip(
            item,
            selectedStatus === item,
            () => setSelectedStatus(item)
          )}
          style={styles.filterList}
        />
      </View>

      {/* Lab List */}
      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text
            style={[
              styles.loadingText,
              { color: isDark ? colors.white : colors.dark },
            ]}
          >
            Loading labs...
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredLabs}
          keyExtractor={(item) => item.id}
          renderItem={renderLabItem}
          contentContainerStyle={styles.labList}
          onRefresh={handleRefresh}
          refreshing={refreshing}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text
                style={[
                  styles.emptyText,
                  { color: isDark ? colors.lightGray : colors.gray },
                ]}
              >
                No labs found matching your filters.
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchContainer: {
    margin: 16,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    fontSize: 16,
    height: 40,
  },
  filtersContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  filterList: {
    marginBottom: 16,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
  },
  labList: {
    padding: 16,
    paddingTop: 0,
  },
  labItem: {
    flexDirection: 'row',
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  labImageContainer: {
    width: 100,
    height: 'auto',
  },
  labImage: {
    width: '100%',
    height: '100%',
  },
  labContent: {
    flex: 1,
    padding: 12,
  },
  labHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  labTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  labDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  labFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labInfo: {
    flex: 1,
  },
  labCategory: {
    fontSize: 12,
    marginBottom: 4,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default LabsScreen;
