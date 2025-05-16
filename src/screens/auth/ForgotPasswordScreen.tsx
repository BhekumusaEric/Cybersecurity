import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { AuthStackParamList } from '../../navigation/types';

type ForgotPasswordScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'ForgotPassword'>;

const ForgotPasswordScreen: React.FC = () => {
  const navigation = useNavigation<ForgotPasswordScreenNavigationProp>();
  const { forgotPassword } = useAuth();
  const { colors, isDark } = useTheme();
  
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  // Validate email
  const validateEmail = (): boolean => {
    if (!email) {
      setError('Email is required');
      return false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Email is invalid');
      return false;
    }
    
    setError('');
    return true;
  };

  // Handle reset password
  const handleResetPassword = async () => {
    if (!validateEmail()) {
      return;
    }

    setIsLoading(true);
    try {
      const success = await forgotPassword(email);
      if (success) {
        setIsSuccess(true);
      } else {
        Alert.alert('Error', 'Failed to send reset password email. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again later.');
      console.error('Forgot password error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Navigate back to login
  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={[
          styles.container,
          { backgroundColor: isDark ? colors.darker : colors.lighter },
        ]}
      >
        <View style={styles.headerContainer}>
          <Text
            style={[
              styles.title,
              { color: isDark ? colors.white : colors.dark },
            ]}
          >
            Forgot Password
          </Text>
          <Text
            style={[
              styles.subtitle,
              { color: isDark ? colors.lightGray : colors.gray },
            ]}
          >
            {isSuccess
              ? 'Password reset email sent! Check your inbox for instructions.'
              : 'Enter your email address and we\'ll send you instructions to reset your password.'}
          </Text>
        </View>

        {!isSuccess ? (
          <View style={styles.formContainer}>
            <Input
              label="Email"
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (error) validateEmail();
              }}
              error={error}
            />

            <Button
              title="Reset Password"
              onPress={handleResetPassword}
              loading={isLoading}
              fullWidth
              style={styles.resetButton}
            />
          </View>
        ) : (
          <View style={styles.successContainer}>
            <Text
              style={[
                styles.successText,
                { color: colors.success },
              ]}
            >
              ✓ Reset email sent successfully
            </Text>
            <Button
              title="Back to Login"
              onPress={navigateToLogin}
              variant="primary"
              fullWidth
              style={styles.backButton}
            />
          </View>
        )}

        <TouchableOpacity
          onPress={navigateToLogin}
          style={styles.backToLoginContainer}
        >
          <Text
            style={[styles.backToLoginText, { color: colors.primary }]}
          >
            ← Back to Login
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  headerContainer: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    lineHeight: 22,
  },
  formContainer: {
    width: '100%',
  },
  resetButton: {
    marginTop: 16,
  },
  successContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  successText: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 24,
  },
  backButton: {
    marginTop: 8,
  },
  backToLoginContainer: {
    marginTop: 32,
    alignSelf: 'center',
  },
  backToLoginText: {
    fontSize: 16,
  },
});

export default ForgotPasswordScreen;
