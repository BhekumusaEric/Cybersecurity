import request from 'supertest';
import app from '../app.js';
import { sequelize } from '../config/database.js';
import bcrypt from 'bcryptjs';
import { User, Course, Module } from '../models/index.js';

// Test user credentials
const testUser = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123',
  role: 'student'
};

// Admin user credentials
const adminUser = {
  name: 'Admin User',
  email: 'admin@example.com',
  password: 'admin123',
  role: 'admin'
};

// Test tokens
let userToken;
let adminToken;

// Setup before tests
beforeAll(async () => {
  // Sync database in test mode
  await sequelize.sync({ force: true });
  
  // Create test users
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(testUser.password, salt);
  const adminHashedPassword = await bcrypt.hash(adminUser.password, salt);
  
  await User.create({
    ...testUser,
    password: hashedPassword
  });
  
  await User.create({
    ...adminUser,
    password: adminHashedPassword
  });
  
  // Login to get tokens
  const userResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: testUser.email,
      password: testUser.password
    });
  
  userToken = userResponse.body.token;
  
  const adminResponse = await request(app)
    .post('/api/auth/login')
    .send({
      email: adminUser.email,
      password: adminUser.password
    });
  
  adminToken = adminResponse.body.token;
  
  // Create test course and modules
  const course = await Course.create({
    title: 'Test Course',
    description: 'Test course description',
    thumbnail: 'https://example.com/thumbnail.jpg',
    duration: 8,
    level: 'intermediate',
    prerequisites: ['Basic knowledge'],
    learningOutcomes: ['Learn testing'],
    tags: ['Testing'],
    isPublished: true
  });
  
  await Module.create({
    title: 'Test Module 1',
    description: 'Test module description',
    order: 1,
    duration: 60,
    content: 'Test content',
    isPublished: true,
    courseId: course.id
  });
  
  await Module.create({
    title: 'Test Module 2',
    description: 'Test module description',
    order: 2,
    duration: 90,
    content: 'Test content',
    isPublished: true,
    courseId: course.id
  });
});

// Cleanup after tests
afterAll(async () => {
  await sequelize.close();
});

// Auth tests
describe('Auth API', () => {
  test('Should register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123'
      });
    
    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty('token');
  });
  
  test('Should login a user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty('token');
  });
  
  test('Should not login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: testUser.email,
        password: 'wrongpassword'
      });
    
    expect(res.statusCode).toEqual(401);
  });
  
  test('Should get current user profile', async () => {
    const res = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.email).toEqual(testUser.email);
  });
});

// Course tests
describe('Course API', () => {
  test('Should get all courses', async () => {
    const res = await request(app)
      .get('/api/courses')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
  
  test('Should get a single course', async () => {
    const courses = await Course.findAll();
    const courseId = courses[0].id;
    
    const res = await request(app)
      .get(`/api/courses/${courseId}`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.title).toEqual('Test Course');
  });
  
  test('Should create a course (admin only)', async () => {
    const newCourse = {
      title: 'New Course',
      description: 'New course description',
      thumbnail: 'https://example.com/new-thumbnail.jpg',
      duration: 6,
      level: 'beginner',
      prerequisites: ['None'],
      learningOutcomes: ['Learn new things'],
      tags: ['New'],
      isPublished: true
    };
    
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newCourse);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.title).toEqual(newCourse.title);
  });
  
  test('Should not create a course (regular user)', async () => {
    const newCourse = {
      title: 'Unauthorized Course',
      description: 'This should fail',
      thumbnail: 'https://example.com/thumbnail.jpg',
      duration: 4,
      level: 'beginner',
      isPublished: true
    };
    
    const res = await request(app)
      .post('/api/courses')
      .set('Authorization', `Bearer ${userToken}`)
      .send(newCourse);
    
    expect(res.statusCode).toEqual(403);
  });
  
  test('Should enroll in a course', async () => {
    const courses = await Course.findAll();
    const courseId = courses[0].id;
    
    const res = await request(app)
      .post(`/api/courses/${courseId}/enroll`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('enrolledAt');
  });
  
  test('Should get enrolled courses', async () => {
    const res = await request(app)
      .get('/api/courses/enrolled')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
});

// Module tests
describe('Module API', () => {
  test('Should get all modules for a course', async () => {
    const courses = await Course.findAll();
    const courseId = courses[0].id;
    
    const res = await request(app)
      .get(`/api/courses/${courseId}/modules`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toEqual(2);
  });
  
  test('Should get a single module', async () => {
    const modules = await Module.findAll();
    const moduleId = modules[0].id;
    
    const res = await request(app)
      .get(`/api/modules/${moduleId}`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.title).toEqual('Test Module 1');
  });
  
  test('Should create a module (admin only)', async () => {
    const courses = await Course.findAll();
    const courseId = courses[0].id;
    
    const newModule = {
      title: 'New Module',
      description: 'New module description',
      content: 'New module content',
      duration: 45,
      isPublished: true
    };
    
    const res = await request(app)
      .post(`/api/courses/${courseId}/modules`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newModule);
    
    expect(res.statusCode).toEqual(201);
    expect(res.body.data.title).toEqual(newModule.title);
  });
  
  test('Should mark a module as completed', async () => {
    const modules = await Module.findAll();
    const moduleId = modules[0].id;
    
    const res = await request(app)
      .post(`/api/modules/${moduleId}/complete`)
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('completedAt');
  });
});

// User tests
describe('User API', () => {
  test('Should get user profile', async () => {
    const res = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.email).toEqual(testUser.email);
  });
  
  test('Should update user profile', async () => {
    const updatedProfile = {
      name: 'Updated Name',
      bio: 'This is my updated bio'
    };
    
    const res = await request(app)
      .put('/api/users/profile')
      .set('Authorization', `Bearer ${userToken}`)
      .send(updatedProfile);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.name).toEqual(updatedProfile.name);
    expect(res.body.data.bio).toEqual(updatedProfile.bio);
  });
  
  test('Should get user dashboard', async () => {
    const res = await request(app)
      .get('/api/users/dashboard')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('recentCourses');
    expect(res.body.data).toHaveProperty('stats');
  });
  
  test('Should get all users (admin only)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${adminToken}`);
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data.length).toBeGreaterThan(0);
  });
  
  test('Should not get all users (regular user)', async () => {
    const res = await request(app)
      .get('/api/users')
      .set('Authorization', `Bearer ${userToken}`);
    
    expect(res.statusCode).toEqual(403);
  });
});
