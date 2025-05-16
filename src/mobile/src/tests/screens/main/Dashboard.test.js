import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import DashboardScreen from '../../../screens/main/DashboardScreen';
import { AuthProvider } from '../../../context/AuthContext';
import { OfflineProvider } from '../../../context/OfflineContext';

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

// Mock the course service
jest.mock('../../../services/api/courseService', () => ({
  getCourses: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Introduction to Ethical Hacking', progress: 0.3, image: 'https://example.com/image1.jpg' },
    { id: 2, title: 'Network Penetration Testing', progress: 0.7, image: 'https://example.com/image2.jpg' },
  ])),
  getRecentLessons: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Understanding Reconnaissance', courseId: 1, courseName: 'Introduction to Ethical Hacking' },
    { id: 2, title: 'Scanning Techniques', courseId: 1, courseName: 'Introduction to Ethical Hacking' },
  ])),
}));

// Mock the lab service
jest.mock('../../../services/api/labService', () => ({
  getLabs: jest.fn(() => Promise.resolve([
    { id: 1, title: 'Basic Network Scanning', difficulty: 'Beginner', estimatedTime: '30 minutes' },
    { id: 2, title: 'Web Application Vulnerabilities', difficulty: 'Intermediate', estimatedTime: '45 minutes' },
  ])),
}));

describe('DashboardScreen', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    jest.clearAllMocks();
  });
  
  it('renders correctly', async () => {
    const { getByTestId, getByText, findByText } = render(
      <AuthProvider>
        <OfflineProvider>
          <DashboardScreen />
        </OfflineProvider>
      </AuthProvider>
    );
    
    expect(getByTestId('dashboard-screen')).toBeTruthy();
    
    // Wait for data to load
    await findByText('Introduction to Ethical Hacking');
    
    // Check if courses are displayed
    expect(getByText('Introduction to Ethical Hacking')).toBeTruthy();
    expect(getByText('Network Penetration Testing')).toBeTruthy();
    
    // Check if recent lessons are displayed
    expect(getByText('Understanding Reconnaissance')).toBeTruthy();
    expect(getByText('Scanning Techniques')).toBeTruthy();
    
    // Check if labs are displayed
    expect(getByText('Basic Network Scanning')).toBeTruthy();
    expect(getByText('Web Application Vulnerabilities')).toBeTruthy();
  });
  
  it('navigates to course details when a course is pressed', async () => {
    const { findByText } = render(
      <AuthProvider>
        <OfflineProvider>
          <DashboardScreen />
        </OfflineProvider>
      </AuthProvider>
    );
    
    // Wait for data to load
    const courseItem = await findByText('Introduction to Ethical Hacking');
    
    // Press the course item
    fireEvent.press(courseItem);
    
    // Check if navigation was called with the correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('CourseDetails', { courseId: 1 });
  });
  
  it('navigates to lesson when a recent lesson is pressed', async () => {
    const { findByText } = render(
      <AuthProvider>
        <OfflineProvider>
          <DashboardScreen />
        </OfflineProvider>
      </AuthProvider>
    );
    
    // Wait for data to load
    const lessonItem = await findByText('Understanding Reconnaissance');
    
    // Press the lesson item
    fireEvent.press(lessonItem);
    
    // Check if navigation was called with the correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('Lesson', { lessonId: 1, courseId: 1 });
  });
  
  it('navigates to lab when a lab is pressed', async () => {
    const { findByText } = render(
      <AuthProvider>
        <OfflineProvider>
          <DashboardScreen />
        </OfflineProvider>
      </AuthProvider>
    );
    
    // Wait for data to load
    const labItem = await findByText('Basic Network Scanning');
    
    // Press the lab item
    fireEvent.press(labItem);
    
    // Check if navigation was called with the correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('Lab', { labId: 1 });
  });
  
  it('navigates to all courses when view all courses is pressed', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <OfflineProvider>
          <DashboardScreen />
        </OfflineProvider>
      </AuthProvider>
    );
    
    // Press the view all courses button
    fireEvent.press(getByTestId('view-all-courses-button'));
    
    // Check if navigation was called with the correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('Courses');
  });
  
  it('navigates to all labs when view all labs is pressed', async () => {
    const { getByTestId } = render(
      <AuthProvider>
        <OfflineProvider>
          <DashboardScreen />
        </OfflineProvider>
      </AuthProvider>
    );
    
    // Press the view all labs button
    fireEvent.press(getByTestId('view-all-labs-button'));
    
    // Check if navigation was called with the correct parameters
    expect(mockNavigate).toHaveBeenCalledWith('Labs');
  });
});
