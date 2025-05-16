// Navigation types for the app

// Auth Stack Param List
export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
};

// Main Stack Param List
export type MainStackParamList = {
  Home: undefined;
  Courses: undefined;
  CourseDetails: { courseId: string };
  Labs: undefined;
  LabDetails: { labId: string };
  Profile: undefined;
  Settings: undefined;
  Notifications: undefined;
};

// Drawer Param List
export type DrawerParamList = {
  MainStack: undefined;
  Settings: undefined;
  Help: undefined;
  About: undefined;
};
