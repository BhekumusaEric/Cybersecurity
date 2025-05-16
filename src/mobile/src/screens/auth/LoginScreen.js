import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import {
  TextInput,
  Button,
  Text,
  Headline,
  Subheading,
  HelperText,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { useOffline } from '../../context/OfflineContext';

const LoginScreen = ({ navigation }) => {
  const { login, loginWithBiometrics, biometricsAvailable, loading, error } = useAuth();
  const { theme } = useTheme();
  const { isOnline } = useOffline();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  
  // Check if biometric login is enabled
  useEffect(() => {
    const checkBiometrics = async () => {
      try {
        const biometricEmail = await AsyncStorage.getItem('biometricEmail');
        setBiometricsEnabled(!!biometricEmail);
        
        // If remember me was enabled, load the email
        const savedEmail = await AsyncStorage.getItem('rememberedEmail');
        if (savedEmail) {
          setEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.log('Check biometrics error:', error);
      }
    };
    
    checkBiometrics();
  }, []);
  
  // Handle login
  const handleLogin = async () => {
    if (!isOnline) {
      Alert.alert(
        'Offline Mode',
        'You are currently offline. Please connect to the internet to log in.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }
    
    const success = await login(email, password);
    
    if (success) {
      // Save email if remember me is checked
      if (rememberMe) {
        await AsyncStorage.setItem('rememberedEmail', email);
      } else {
        await AsyncStorage.removeItem('rememberedEmail');
      }
    }
  };
  
  // Handle biometric login
  const handleBiometricLogin = async () => {
    if (!isOnline) {
      Alert.alert(
        'Offline Mode',
        'You are currently offline. Please connect to the internet to log in.',
        [{ text: 'OK' }]
      );
      return;
    }
    
    await loginWithBiometrics();
  };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Headline style={[styles.title, { color: theme.colors.primary }]}>
            Ethical Hacking LMS
          </Headline>
          <Subheading style={styles.subtitle}>
            Learn. Practice. Master.
          </Subheading>
        </View>
        
        <View style={styles.formContainer}>
          {error && (
            <HelperText type="error" visible={!!error}>
              {error}
            </HelperText>
          )}
          
          <TextInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            mode="outlined"
            autoCapitalize="none"
            keyboardType="email-address"
            left={<TextInput.Icon icon="email" />}
            style={styles.input}
          />
          
          <TextInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            mode="outlined"
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
          />
          
          <View style={styles.rememberContainer}>
            <TouchableOpacity
              style={styles.rememberMe}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <Icon
                name={rememberMe ? 'checkbox-marked' : 'checkbox-blank-outline'}
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.rememberText}>Remember me</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={[styles.forgotPassword, { color: theme.colors.primary }]}>
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
          >
            Log In
          </Button>
          
          {biometricsAvailable && biometricsEnabled && (
            <Button
              mode="outlined"
              onPress={handleBiometricLogin}
              icon="fingerprint"
              style={styles.biometricButton}
            >
              Login with Biometrics
            </Button>
          )}
          
          <Divider style={styles.divider} />
          
          <View style={styles.registerContainer}>
            <Text>Don't have an account?</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('Register')}
            >
              <Text style={[styles.registerLink, { color: theme.colors.primary }]}>
                {' '}Register
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  formContainer: {
    width: '100%',
  },
  input: {
    marginBottom: 16,
  },
  rememberContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  rememberMe: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rememberText: {
    marginLeft: 8,
  },
  forgotPassword: {
    fontWeight: '500',
  },
  loginButton: {
    marginBottom: 16,
    paddingVertical: 8,
  },
  biometricButton: {
    marginBottom: 24,
  },
  divider: {
    marginVertical: 24,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  registerLink: {
    fontWeight: 'bold',
  },
});

export default LoginScreen;
