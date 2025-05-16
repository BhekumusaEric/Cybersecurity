import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import LoginScreen from '../../../screens/auth/LoginScreen';
import { AuthProvider } from '../../../context/AuthContext';

// Mock the navigation
const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: () => ({
      navigate: mockNavigate,
    }),
  };
});

// Mock the auth service
jest.mock('../../../services/api/authService', () => ({
  login: jest.fn(() => Promise.resolve({ token: 'fake-token', user: { id: 1, name: 'Test User' } })),
}));

describe('LoginScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });
  
  it('renders correctly', () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    
    expect(getByTestId('login-screen')).toBeTruthy();
    expect(getByText('Sign In')).toBeTruthy();
    expect(getByTestId('email-input')).toBeTruthy();
    expect(getByTestId('password-input')).toBeTruthy();
    expect(getByTestId('login-button')).toBeTruthy();
  });
  
  it('validates form inputs', async () => {
    const { getByTestId, getByText } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    
    // Try to submit with empty fields
    fireEvent.press(getByTestId('login-button'));
    
    await waitFor(() => {
      expect(getByText('Email is required')).toBeTruthy();
      expect(getByText('Password is required')).toBeTruthy();
    });
    
    // Enter invalid email
    fireEvent.changeText(getByTestId('email-input'), 'invalid-email');
    fireEvent.press(getByTestId('login-button'));
    
    await waitFor(() => {
      expect(getByText('Please enter a valid email address')).toBeTruthy();
    });
    
    // Enter valid email but short password
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), '123');
    fireEvent.press(getByTestId('login-button'));
    
    await waitFor(() => {
      expect(getByText('Password must be at least 6 characters')).toBeTruthy();
    });
  });
  
  it('submits the form with valid inputs', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    
    // Enter valid credentials
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.changeText(getByTestId('password-input'), 'password123');
    fireEvent.press(getByTestId('login-button'));
    
    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('Main');
    });
  });
  
  it('navigates to forgot password screen', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    
    fireEvent.press(getByTestId('forgot-password-link'));
    expect(mockNavigate).toHaveBeenCalledWith('ForgotPassword');
  });
  
  it('navigates to register screen', () => {
    const { getByTestId } = render(
      <AuthProvider>
        <LoginScreen />
      </AuthProvider>
    );
    
    fireEvent.press(getByTestId('register-link'));
    expect(mockNavigate).toHaveBeenCalledWith('Register');
  });
});
