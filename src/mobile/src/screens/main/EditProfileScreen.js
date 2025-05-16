import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
  Platform,
} from 'react-native';
import {
  Text,
  Appbar,
  TextInput,
  Button,
  Avatar,
  Divider,
  Switch,
  ActivityIndicator,
  Portal,
  Dialog,
  Paragraph,
  Chip,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as ImagePicker from 'react-native-image-picker';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api/authService';

const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, updateUser } = useAuth();
  
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [company, setCompany] = useState(user?.company || '');
  const [jobTitle, setJobTitle] = useState(user?.jobTitle || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatar, setAvatar] = useState(user?.avatar || null);
  const [newAvatar, setNewAvatar] = useState(null);
  const [publicProfile, setPublicProfile] = useState(user?.publicProfile || false);
  const [showActivityFeed, setShowActivityFeed] = useState(user?.showActivityFeed || true);
  const [loading, setLoading] = useState(false);
  const [showDiscardDialog, setShowDiscardDialog] = useState(false);
  const [skills, setSkills] = useState(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  
  // Check if form has been modified
  const isFormModified = () => {
    return (
      name !== (user?.name || '') ||
      bio !== (user?.bio || '') ||
      company !== (user?.company || '') ||
      jobTitle !== (user?.jobTitle || '') ||
      phone !== (user?.phone || '') ||
      website !== (user?.website || '') ||
      location !== (user?.location || '') ||
      newAvatar !== null ||
      publicProfile !== (user?.publicProfile || false) ||
      showActivityFeed !== (user?.showActivityFeed || true) ||
      JSON.stringify(skills) !== JSON.stringify(user?.skills || [])
    );
  };
  
  // Handle back button press
  const handleBackPress = () => {
    if (isFormModified()) {
      setShowDiscardDialog(true);
    } else {
      navigation.goBack();
    }
  };
  
  // Handle image picker
  const handleImagePicker = () => {
    const options = {
      title: 'Select Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      includeBase64: true,
    };
    
    ImagePicker.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
        Alert.alert('Error', 'Failed to select image. Please try again.');
      } else {
        const source = { uri: response.assets[0].uri };
        setNewAvatar(source);
      }
    });
  };
  
  // Handle camera
  const handleCamera = () => {
    const options = {
      title: 'Take Profile Picture',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
      mediaType: 'photo',
      includeBase64: true,
    };
    
    ImagePicker.launchCamera(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.error) {
        console.log('Camera Error: ', response.error);
        Alert.alert('Error', 'Failed to take image. Please try again.');
      } else {
        const source = { uri: response.assets[0].uri };
        setNewAvatar(source);
      }
    });
  };
  
  // Handle add skill
  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };
  
  // Handle remove skill
  const handleRemoveSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };
  
  // Handle save profile
  const handleSaveProfile = async () => {
    // Validate form
    if (!name.trim()) {
      Alert.alert('Error', 'Name is required');
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    setLoading(true);
    
    try {
      // Prepare profile data
      const profileData = {
        name,
        email,
        bio,
        company,
        jobTitle,
        phone,
        website,
        location,
        publicProfile,
        showActivityFeed,
        skills,
      };
      
      // Add avatar if changed
      if (newAvatar) {
        profileData.avatar = newAvatar.uri;
      }
      
      // Update profile
      const updatedUser = await updateProfile(profileData);
      
      // Update local user data
      updateUser(updatedUser);
      
      // Show success message
      Alert.alert('Success', 'Profile updated successfully');
      
      // Navigate back
      navigation.goBack();
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={handleBackPress} />
        <Appbar.Content title="Edit Profile" />
        {loading ? (
          <ActivityIndicator animating={true} color={theme.colors.primary} style={{ marginRight: 16 }} />
        ) : (
          <Appbar.Action icon="check" onPress={handleSaveProfile} />
        )}
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        {/* Profile Picture */}
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Avatar.Image
              size={120}
              source={newAvatar || (avatar ? { uri: avatar } : require('../../assets/default-avatar.png'))}
              style={styles.avatar}
            />
            <View style={styles.editAvatarButton}>
              <Icon name="camera" size={24} color="#fff" />
            </View>
          </TouchableOpacity>
          
          <View style={styles.avatarButtons}>
            <Button
              mode="text"
              onPress={handleImagePicker}
              style={styles.avatarButton}
            >
              Gallery
            </Button>
            <Button
              mode="text"
              onPress={handleCamera}
              style={styles.avatarButton}
            >
              Camera
            </Button>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Basic Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Basic Information</Text>
          
          <TextInput
            label="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Bio"
            value={bio}
            onChangeText={setBio}
            style={styles.input}
            mode="outlined"
            multiline
            numberOfLines={4}
          />
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Professional Information */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          
          <TextInput
            label="Company"
            value={company}
            onChangeText={setCompany}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Job Title"
            value={jobTitle}
            onChangeText={setJobTitle}
            style={styles.input}
            mode="outlined"
          />
          
          <TextInput
            label="Phone"
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            mode="outlined"
            keyboardType="phone-pad"
          />
          
          <TextInput
            label="Website"
            value={website}
            onChangeText={setWebsite}
            style={styles.input}
            mode="outlined"
            keyboardType="url"
            autoCapitalize="none"
          />
          
          <TextInput
            label="Location"
            value={location}
            onChangeText={setLocation}
            style={styles.input}
            mode="outlined"
          />
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Skills */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          
          <View style={styles.skillsContainer}>
            {skills.map((skill, index) => (
              <Chip
                key={index}
                style={styles.skillChip}
                onClose={() => handleRemoveSkill(skill)}
              >
                {skill}
              </Chip>
            ))}
          </View>
          
          <View style={styles.addSkillContainer}>
            <TextInput
              label="Add Skill"
              value={newSkill}
              onChangeText={setNewSkill}
              style={styles.skillInput}
              mode="outlined"
              onSubmitEditing={handleAddSkill}
            />
            <Button
              mode="contained"
              onPress={handleAddSkill}
              style={styles.addButton}
              disabled={!newSkill.trim()}
            >
              Add
            </Button>
          </View>
        </View>
        
        <Divider style={styles.divider} />
        
        {/* Privacy Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>Public Profile</Text>
              <Text style={styles.switchDescription}>
                Allow other users to view your profile
              </Text>
            </View>
            <Switch
              value={publicProfile}
              onValueChange={setPublicProfile}
            />
          </View>
          
          <View style={styles.switchContainer}>
            <View style={styles.switchInfo}>
              <Text style={styles.switchTitle}>Activity Feed</Text>
              <Text style={styles.switchDescription}>
                Show your activity in the community feed
              </Text>
            </View>
            <Switch
              value={showActivityFeed}
              onValueChange={setShowActivityFeed}
            />
          </View>
        </View>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={handleSaveProfile}
            style={styles.saveButton}
            loading={loading}
            disabled={loading}
          >
            Save Changes
          </Button>
        </View>
      </ScrollView>
      
      {/* Discard Changes Dialog */}
      <Portal>
        <Dialog visible={showDiscardDialog} onDismiss={() => setShowDiscardDialog(false)}>
          <Dialog.Title>Discard Changes?</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              You have unsaved changes. Are you sure you want to discard them?
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowDiscardDialog(false)}>Cancel</Button>
            <Button onPress={() => {
              setShowDiscardDialog(false);
              navigation.goBack();
            }}>
              Discard
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  avatarContainer: {
    alignItems: 'center',
    padding: 24,
  },
  avatar: {
    backgroundColor: '#E0E0E0',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#1976d2',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarButtons: {
    flexDirection: 'row',
    marginTop: 16,
  },
  avatarButton: {
    marginHorizontal: 8,
  },
  divider: {
    marginVertical: 8,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  input: {
    marginBottom: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  skillChip: {
    margin: 4,
  },
  addSkillContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skillInput: {
    flex: 1,
    marginRight: 8,
  },
  addButton: {
    marginTop: 8,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  switchInfo: {
    flex: 1,
  },
  switchTitle: {
    fontSize: 16,
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 12,
    color: '#757575',
  },
  buttonContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  saveButton: {
    marginTop: 8,
  },
});

export default EditProfileScreen;
