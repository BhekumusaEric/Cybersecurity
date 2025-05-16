import axios from 'axios';
import { fetchCourses, fetchCourseDetails, markLessonCompleted } from '../../../services/api/courseService';

// Mock axios
jest.mock('axios');

describe('Course Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  describe('fetchCourses', () => {
    it('should fetch courses successfully', async () => {
      // Mock data
      const mockCourses = [
        {
          id: 1,
          title: 'Introduction to Ethical Hacking',
          description: 'Learn the basics of ethical hacking',
          progress: 0.5,
        },
        {
          id: 2,
          title: 'Network Penetration Testing',
          description: 'Advanced techniques for network penetration testing',
          progress: 0.2,
        },
      ];
      
      // Mock axios response
      axios.get.mockResolvedValueOnce({ data: mockCourses });
      
      // Call the function
      const result = await fetchCourses();
      
      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/courses');
      expect(result).toEqual(mockCourses);
    });
    
    it('should handle errors when fetching courses', async () => {
      // Mock error
      const mockError = new Error('Network error');
      axios.get.mockRejectedValueOnce(mockError);
      
      // Call the function and expect it to throw
      await expect(fetchCourses()).rejects.toThrow('Network error');
      
      // Assertions
      expect(axios.get).toHaveBeenCalledWith('/api/courses');
    });
  });
  
  describe('fetchCourseDetails', () => {
    it('should fetch course details successfully', async () => {
      // Mock data
      const courseId = 1;
      const mockCourseDetails = {
        id: 1,
        title: 'Introduction to Ethical Hacking',
        description: 'Learn the basics of ethical hacking',
        modules: [
          {
            id: 1,
            title: 'Module 1: Fundamentals',
            lessons: [
              {
                id: 1,
                title: 'Lesson 1: Introduction',
                completed: true,
              },
              {
                id: 2,
                title: 'Lesson 2: Basic Concepts',
                completed: false,
              },
            ],
          },
        ],
        progress: 0.5,
      };
      
      // Mock axios response
      axios.get.mockResolvedValueOnce({ data: mockCourseDetails });
      
      // Call the function
      const result = await fetchCourseDetails(courseId);
      
      // Assertions
      expect(axios.get).toHaveBeenCalledWith(`/api/courses/${courseId}`);
      expect(result).toEqual(mockCourseDetails);
    });
    
    it('should handle errors when fetching course details', async () => {
      // Mock error
      const courseId = 1;
      const mockError = new Error('Course not found');
      axios.get.mockRejectedValueOnce(mockError);
      
      // Call the function and expect it to throw
      await expect(fetchCourseDetails(courseId)).rejects.toThrow('Course not found');
      
      // Assertions
      expect(axios.get).toHaveBeenCalledWith(`/api/courses/${courseId}`);
    });
  });
  
  describe('markLessonCompleted', () => {
    it('should mark lesson as completed successfully', async () => {
      // Mock data
      const lessonId = 1;
      const mockResponse = {
        success: true,
        message: 'Lesson marked as completed',
        progress: 0.6,
      };
      
      // Mock axios response
      axios.post.mockResolvedValueOnce({ data: mockResponse });
      
      // Call the function
      const result = await markLessonCompleted(lessonId);
      
      // Assertions
      expect(axios.post).toHaveBeenCalledWith(`/api/lessons/${lessonId}/complete`);
      expect(result).toEqual(mockResponse);
    });
    
    it('should handle errors when marking lesson as completed', async () => {
      // Mock error
      const lessonId = 1;
      const mockError = new Error('Failed to mark lesson as completed');
      axios.post.mockRejectedValueOnce(mockError);
      
      // Call the function and expect it to throw
      await expect(markLessonCompleted(lessonId)).rejects.toThrow('Failed to mark lesson as completed');
      
      // Assertions
      expect(axios.post).toHaveBeenCalledWith(`/api/lessons/${lessonId}/complete`);
    });
  });
});
