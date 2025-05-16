describe('Dashboard Flow', () => {
  beforeAll(async () => {
    await device.launchApp();
    
    // Login first
    await element(by.id('email-input')).typeText('test@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();
    await expect(element(by.id('dashboard-screen'))).toBeVisible();
  });

  beforeEach(async () => {
    // Ensure we're on the dashboard screen
    if (!(await element(by.id('dashboard-screen')).isVisible())) {
      await element(by.id('tab-dashboard')).tap();
    }
  });

  it('should show dashboard elements', async () => {
    await expect(element(by.id('dashboard-screen'))).toBeVisible();
    await expect(element(by.text('My Courses'))).toBeVisible();
    await expect(element(by.text('Recent Lessons'))).toBeVisible();
    await expect(element(by.text('Available Labs'))).toBeVisible();
  });

  it('should navigate to course details', async () => {
    await element(by.id('course-item-1')).tap();
    await expect(element(by.id('course-details-screen'))).toBeVisible();
    await element(by.id('back-button')).tap();
  });

  it('should navigate to lesson', async () => {
    await element(by.id('lesson-item-1')).tap();
    await expect(element(by.id('lesson-screen'))).toBeVisible();
    await element(by.id('back-button')).tap();
  });

  it('should navigate to lab', async () => {
    await element(by.id('lab-item-1')).tap();
    await expect(element(by.id('lab-screen'))).toBeVisible();
    await element(by.id('back-button')).tap();
  });

  it('should navigate to all courses', async () => {
    await element(by.id('view-all-courses-button')).tap();
    await expect(element(by.id('courses-screen'))).toBeVisible();
    await element(by.id('back-button')).tap();
  });

  it('should navigate to all labs', async () => {
    await element(by.id('view-all-labs-button')).tap();
    await expect(element(by.id('labs-screen'))).toBeVisible();
    await element(by.id('back-button')).tap();
  });

  it('should navigate to profile', async () => {
    await element(by.id('tab-profile')).tap();
    await expect(element(by.id('profile-screen'))).toBeVisible();
  });

  it('should navigate to settings', async () => {
    await element(by.id('tab-profile')).tap();
    await element(by.id('settings-button')).tap();
    await expect(element(by.id('settings-screen'))).toBeVisible();
    await element(by.id('back-button')).tap();
  });

  it('should log out', async () => {
    await element(by.id('tab-profile')).tap();
    await element(by.id('logout-button')).tap();
    await element(by.text('Yes')).tap();
    await expect(element(by.id('login-screen'))).toBeVisible();
  });
});
