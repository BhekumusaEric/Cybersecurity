import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Appbar,
  TextInput,
  Button,
  ActivityIndicator,
  HelperText,
  Card,
  List,
  Divider,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';
import { changePassword } from '../../services/api/authService';

const ChangePasswordScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  
  // Password validation
  const validatePassword = (password) => {
    const validations = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      special: /[^A-Za-z0-9]/.test(password),
    };
    
    return validations;
  };
  
  // Get password strength
  const getPasswordStrength = (password) => {
    const validations = validatePassword(password);
    const strength = Object.values(validations).filter(Boolean).length;
    
    if (strength === 0) return 0;
    return strength / 5;
  };
  
  // Get password strength color
  const getPasswordStrengthColor = (strength) => {
    if (strength < 0.3) return '#f44336'; // Weak
    if (strength < 0.7) return '#ff9800'; // Medium
    return '#4caf50'; // Strong
  };
  
  // Get password strength text
  const getPasswordStrengthText = (strength) => {
    if (strength < 0.3) return 'Weak';
    if (strength < 0.7) return 'Medium';
    return 'Strong';
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!currentPassword) {
      newErrors.currentPassword = 'Current password is required';
    }
    
    if (!newPassword) {
      newErrors.newPassword = 'New password is required';
    } else {
      const validations = validatePassword(newPassword);
      
      if (!validations.length) {
        newErrors.newPassword = 'Password must be at least 8 characters long';
      }
      
      if (!(validations.uppercase && validations.lowercase)) {
        newErrors.newPassword = 'Password must include both uppercase and lowercase letters';
      }
      
      if (!validations.number) {
        newErrors.newPassword = 'Password must include at least one number';
      }
      
      if (!validations.special) {
        newErrors.newPassword = 'Password must include at least one special character';
      }
    }
    
    if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle change password
  const handleChangePassword = async () => {
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      await changePassword(currentPassword, newPassword);
      
      // Show success message
      Alert.alert(
        'Success',
        'Your password has been changed successfully.',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Error changing password:', error);
      
      // Show error message
      if (error.message.includes('current password')) {
        setErrors({
          ...errors,
          currentPassword: 'Current password is incorrect',
        });
      } else {
        Alert.alert('Error', 'Failed to change password. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Password strength
  const passwordStrength = getPasswordStrength(newPassword);
  const passwordStrengthColor = getPasswordStrengthColor(passwordStrength);
  const passwordStrengthText = getPasswordStrengthText(passwordStrength);
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Change Password" />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.description}>
              Change your password to keep your account secure. Your new password must be different from your current password.
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="Current Password"
                value={currentPassword}
                onChangeText={setCurrentPassword}
                secureTextEntry={!showCurrentPassword}
                style={styles.input}
                mode="outlined"
                error={!!errors.currentPassword}
                right={
                  <TextInput.Icon
                    icon={showCurrentPassword ? "eye-off" : "eye"}
                    onPress={() => setShowCurrentPassword(!showCurrentPassword)}
                  />
                }
              />
              {errors.currentPassword && (
                <HelperText type="error" visible={!!errors.currentPassword}>
                  {errors.currentPassword}
                </HelperText>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="New Password"
                value={newPassword}
                onChangeText={setNewPassword}
                secureTextEntry={!showNewPassword}
                style={styles.input}
                mode="outlined"
                error={!!errors.newPassword}
                right={
                  <TextInput.Icon
                    icon={showNewPassword ? "eye-off" : "eye"}
                    onPress={() => setShowNewPassword(!showNewPassword)}
                  />
                }
              />
              {errors.newPassword && (
                <HelperText type="error" visible={!!errors.newPassword}>
                  {errors.newPassword}
                </HelperText>
              )}
              
              {newPassword.length > 0 && (
                <View style={styles.strengthContainer}>
                  <View style={styles.strengthLabelContainer}>
                    <Text style={styles.strengthLabel}>Password Strength:</Text>
                    <Text style={[styles.strengthText, { color: passwordStrengthColor }]}>
                      {passwordStrengthText}
                    </Text>
                  </View>
                  <View style={styles.strengthBarContainer}>
                    <View
                      style={[
                        styles.strengthBar,
                        { width: `${passwordStrength * 100}%`, backgroundColor: passwordStrengthColor },
                      ]}
                    />
                  </View>
                </View>
              )}
            </View>
            
            <View style={styles.inputContainer}>
              <TextInput
                label="Confirm New Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                mode="outlined"
                error={!!errors.confirmPassword}
                right={
                  <TextInput.Icon
                    icon={showConfirmPassword ? "eye-off" : "eye"}
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
              />
              {errors.confirmPassword && (
                <HelperText type="error" visible={!!errors.confirmPassword}>
                  {errors.confirmPassword}
                </HelperText>
              )}
            </View>
            
            <Button
              mode="contained"
              onPress={handleChangePassword}
              style={styles.button}
              loading={loading}
              disabled={loading || !currentPassword || !newPassword || !confirmPassword}
            >
              Change Password
            </Button>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.requirementsTitle}>Password Requirements</Text>
            
            <List.Item
              title="At least 8 characters"
              left={props => (
                <List.Icon
                  {...props}
                  icon={newPassword.length >= 8 ? "check-circle" : "circle-outline"}
                  color={newPassword.length >= 8 ? "#4caf50" : "#757575"}
                />
              )}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="At least one uppercase letter"
              left={props => (
                <List.Icon
                  {...props}
                  icon={/[A-Z]/.test(newPassword) ? "check-circle" : "circle-outline"}
                  color={/[A-Z]/.test(newPassword) ? "#4caf50" : "#757575"}
                />
              )}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="At least one lowercase letter"
              left={props => (
                <List.Icon
                  {...props}
                  icon={/[a-z]/.test(newPassword) ? "check-circle" : "circle-outline"}
                  color={/[a-z]/.test(newPassword) ? "#4caf50" : "#757575"}
                />
              )}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="At least one number"
              left={props => (
                <List.Icon
                  {...props}
                  icon={/[0-9]/.test(newPassword) ? "check-circle" : "circle-outline"}
                  color={/[0-9]/.test(newPassword) ? "#4caf50" : "#757575"}
                />
              )}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="At least one special character"
              left={props => (
                <List.Icon
                  {...props}
                  icon={/[^A-Za-z0-9]/.test(newPassword) ? "check-circle" : "circle-outline"}
                  color={/[^A-Za-z0-9]/.test(newPassword) ? "#4caf50" : "#757575"}
                />
              )}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.securityTipsTitle}>Security Tips</Text>
            
            <View style={styles.securityTip}>
              <Icon name="shield-lock" size={24} color="#1976d2" style={styles.securityTipIcon} />
              <Text style={styles.securityTipText}>
                Don't reuse passwords across multiple sites or services.
              </Text>
            </View>
            
            <View style={styles.securityTip}>
              <Icon name="shield-lock" size={24} color="#1976d2" style={styles.securityTipIcon} />
              <Text style={styles.securityTipText}>
                Consider using a password manager to generate and store strong, unique passwords.
              </Text>
            </View>
            
            <View style={styles.securityTip}>
              <Icon name="shield-lock" size={24} color="#1976d2" style={styles.securityTipIcon} />
              <Text style={styles.securityTipText}>
                Change your password regularly, especially if you suspect your account may have been compromised.
              </Text>
            </View>
            
            <View style={styles.securityTip}>
              <Icon name="shield-lock" size={24} color="#1976d2" style={styles.securityTipIcon} />
              <Text style={styles.securityTipText}>
                Enable two-factor authentication for an additional layer of security.
              </Text>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
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
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  description: {
    marginBottom: 24,
    lineHeight: 22,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    marginBottom: 4,
  },
  button: {
    marginTop: 8,
  },
  strengthContainer: {
    marginTop: 8,
  },
  strengthLabelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  strengthLabel: {
    fontSize: 12,
    color: '#757575',
  },
  strengthText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  strengthBarContainer: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    overflow: 'hidden',
  },
  strengthBar: {
    height: '100%',
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  divider: {
    marginLeft: 56,
  },
  securityTipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  securityTip: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  securityTipIcon: {
    marginRight: 16,
  },
  securityTipText: {
    flex: 1,
    lineHeight: 22,
  },
});

export default ChangePasswordScreen;
