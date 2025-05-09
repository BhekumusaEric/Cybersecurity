import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext.jsx';
import { ThemeProvider } from '../context/ThemeContext.jsx';
import App from '../App';
import Login from '../pages/Login';
import Register from '../pages/Register';
import Dashboard from '../pages/Dashboard';
import CourseList from '../pages/CourseList';

// Mock axios
jest.mock('axios');

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

// Wrapper component for tests
const TestWrapper = ({ children }) => (
  <BrowserRouter>
    <AuthProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </AuthProvider>
  </BrowserRouter>
);

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <TestWrapper>
        <App />
      </TestWrapper>
    );
  });
});

describe('Login Component', () => {
  test('renders login form', () => {
    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    expect(screen.getByText(/Log In to Your Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log In/i })).toBeInTheDocument();
  });

  test('shows error with invalid credentials', async () => {
    // Mock the login function to return an error
    const mockLogin = jest.fn().mockResolvedValue({
      success: false,
      error: 'Invalid email or password'
    });

    // Mock the useAuth hook
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        login: mockLogin,
        isAuthenticated: false,
        loading: false
      })
    }));

    render(
      <TestWrapper>
        <Login />
      </TestWrapper>
    );

    // Fill in the form
    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: 'wrongpassword' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Log In/i }));

    // Wait for the error message
    await waitFor(() => {
      expect(screen.getByText(/Invalid email or password/i)).toBeInTheDocument();
    });
  });
});

describe('Register Component', () => {
  test('renders registration form', () => {
    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    );

    expect(screen.getByText(/Create an Account/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Full Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email Address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Create Account/i })).toBeInTheDocument();
  });

  test('validates form inputs', async () => {
    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    );

    // Submit the form without filling it
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for validation errors
    await waitFor(() => {
      expect(screen.getByText(/Name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
    });
  });

  test('validates password match', async () => {
    render(
      <TestWrapper>
        <Register />
      </TestWrapper>
    );

    // Fill in the form with mismatched passwords
    fireEvent.change(screen.getByLabelText(/Full Name/i), {
      target: { value: 'Test User' }
    });

    fireEvent.change(screen.getByLabelText(/Email Address/i), {
      target: { value: 'test@example.com' }
    });

    fireEvent.change(screen.getByLabelText(/^Password/i), {
      target: { value: 'password123' }
    });

    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'password456' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /Create Account/i }));

    // Wait for validation error
    await waitFor(() => {
      expect(screen.getByText(/Passwords do not match/i)).toBeInTheDocument();
    });
  });
});

describe('Dashboard Component', () => {
  beforeEach(() => {
    // Mock the useAuth hook
    jest.mock('../context/AuthContext', () => ({
      useAuth: () => ({
        isAuthenticated: true,
        user: {
          name: 'Test User',
          email: 'test@example.com',
          role: 'student'
        },
        loading: false
      })
    }));
  });

  test('renders dashboard for authenticated user', () => {
    render(
      <TestWrapper>
        <Dashboard />
      </TestWrapper>
    );

    expect(screen.getByText(/Dashboard/i)).toBeInTheDocument();
  });
});

describe('CourseList Component', () => {
  test('renders course list', async () => {
    // Mock the axios response
    const mockCourses = [
      {
        id: '1',
        title: 'Test Course 1',
        description: 'Test description 1',
        thumbnail: 'https://example.com/thumbnail1.jpg',
        duration: 8,
        level: 'beginner',
        tags: ['Test'],
        enrolledStudents: 100,
        rating: 4.5
      },
      {
        id: '2',
        title: 'Test Course 2',
        description: 'Test description 2',
        thumbnail: 'https://example.com/thumbnail2.jpg',
        duration: 10,
        level: 'intermediate',
        tags: ['Advanced'],
        enrolledStudents: 200,
        rating: 4.8
      }
    ];

    // Mock the axios get request
    jest.mock('axios', () => ({
      get: jest.fn().mockResolvedValue({
        data: {
          success: true,
          data: mockCourses
        }
      })
    }));

    render(
      <TestWrapper>
        <CourseList />
      </TestWrapper>
    );

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/Courses/i)).toBeInTheDocument();
    });
  });

  test('filters courses by search term', async () => {
    render(
      <TestWrapper>
        <CourseList />
      </TestWrapper>
    );

    // Wait for courses to load
    await waitFor(() => {
      expect(screen.getByText(/Courses/i)).toBeInTheDocument();
    });

    // Enter search term
    fireEvent.change(screen.getByLabelText(/Search Courses/i), {
      target: { value: 'Test Course 1' }
    });

    // Wait for filtered results
    await waitFor(() => {
      expect(screen.getByText(/Test Course 1/i)).toBeInTheDocument();
      expect(screen.queryByText(/Test Course 2/i)).not.toBeInTheDocument();
    });
  });
});
