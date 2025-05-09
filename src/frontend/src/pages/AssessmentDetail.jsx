import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Button,
  Divider,
  Card,
  CardContent,
  CardActions,
  Grid,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Alert,
  AlertTitle,
  Skeleton,
  LinearProgress,
  Stepper,
  Step,
  StepLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
  CheckCircle as CheckCircleIcon,
  Timer as TimerIcon,
  Warning as WarningIcon,
  Flag as FlagIcon,
  Assignment as AssignmentIcon
} from '@mui/icons-material';
import axios from 'axios';

const AssessmentDetail = () => {
  const { assessmentId } = useParams();
  const navigate = useNavigate();
  const [assessment, setAssessment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attemptStarted, setAttemptStarted] = useState(false);
  const [attemptCompleted, setAttemptCompleted] = useState(false);
  const [results, setResults] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [timeWarningDialogOpen, setTimeWarningDialogOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchAssessment = async () => {
      try {
        setLoading(true);
        
        // In a real app, this would be an API call
        // For now, we'll simulate with setTimeout and mock data
        setTimeout(() => {
          // Mock assessment data
          const mockAssessment = {
            id: assessmentId,
            title: 'Network Security Fundamentals Quiz',
            description: 'Test your knowledge of network security concepts, protocols, and common vulnerabilities.',
            type: 'quiz',
            timeLimit: 30, // minutes
            passingScore: 70,
            maxAttempts: 3,
            dueDate: '2023-06-30T23:59:59Z',
            questions: [
              {
                id: 'q1',
                question: 'Which of the following is NOT a common network scanning technique?',
                options: [
                  'TCP SYN scan',
                  'UDP scan',
                  'ICMP echo scan',
                  'HTTP injection scan'
                ],
                correctAnswer: 3 // zero-based index
              },
              {
                id: 'q2',
                question: 'What is the primary purpose of a firewall?',
                options: [
                  'To encrypt network traffic',
                  'To filter network traffic based on rules',
                  'To accelerate network connections',
                  'To compress data for faster transmission'
                ],
                correctAnswer: 1
              },
              {
                id: 'q3',
                question: 'Which protocol operates at the Transport layer of the OSI model?',
                options: [
                  'HTTP',
                  'IP',
                  'TCP',
                  'Ethernet'
                ],
                correctAnswer: 2
              },
              {
                id: 'q4',
                question: 'What type of attack attempts to exhaust a system\'s resources?',
                options: [
                  'Man-in-the-middle attack',
                  'SQL injection',
                  'Cross-site scripting',
                  'Denial of Service (DoS)'
                ],
                correctAnswer: 3
              },
              {
                id: 'q5',
                question: 'Which encryption protocol is considered insecure and should no longer be used?',
                options: [
                  'TLS 1.3',
                  'SSL 3.0',
                  'SSH',
                  'WPA3'
                ],
                correctAnswer: 1
              },
              {
                id: 'q6',
                question: 'What is ARP spoofing?',
                options: [
                  'A technique to crack wireless passwords',
                  'A method to intercept traffic by associating the attacker\'s MAC address with a legitimate IP',
                  'A way to hide malware in network packets',
                  'A protocol for secure file transfer'
                ],
                correctAnswer: 1
              },
              {
                id: 'q7',
                question: 'Which port is commonly used for HTTPS traffic?',
                options: [
                  '21',
                  '22',
                  '80',
                  '443'
                ],
                correctAnswer: 3
              },
              {
                id: 'q8',
                question: 'What is the purpose of network segmentation?',
                options: [
                  'To increase network speed',
                  'To reduce the attack surface and contain breaches',
                  'To enable wireless connectivity',
                  'To compress network traffic'
                ],
                correctAnswer: 1
              },
              {
                id: 'q9',
                question: 'Which of these is NOT a common wireless security protocol?',
                options: [
                  'WEP',
                  'WPA2',
                  'WTLS',
                  'WPA3'
                ],
                correctAnswer: 2
              },
              {
                id: 'q10',
                question: 'What does IDS stand for in network security?',
                options: [
                  'Internet Data Security',
                  'Intrusion Detection System',
                  'Identity Security',
                  'Internal Defense System'
                ],
                correctAnswer: 1
              }
            ],
            attempts: [
              {
                id: 'a1',
                startedAt: '2023-05-01T14:30:00Z',
                completedAt: '2023-05-01T14:45:00Z',
                score: 80,
                passed: true
              }
            ]
          };
          
          setAssessment(mockAssessment);
          setLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching assessment:', err);
        setError('Failed to load assessment. Please try again.');
        setLoading(false);
      }
    };

    fetchAssessment();

    // Cleanup timer on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [assessmentId]);

  const startAttempt = () => {
    // Initialize answers object
    const initialAnswers = {};
    assessment.questions.forEach(q => {
      initialAnswers[q.id] = null;
    });
    setAnswers(initialAnswers);
    
    // Set timer
    setTimeLeft(assessment.timeLimit * 60); // convert to seconds
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timerRef.current);
          submitAttempt();
          return 0;
        }
        
        // Show warning when 20% of time is left
        if (prevTime === Math.floor(assessment.timeLimit * 60 * 0.2)) {
          setTimeWarningDialogOpen(true);
        }
        
        return prevTime - 1;
      });
    }, 1000);
    
    setAttemptStarted(true);
  };

  const handleAnswerChange = (questionId, value) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: parseInt(value)
    }));
  };

  const handleNext = () => {
    setCurrentStep(prevStep => prevStep + 1);
  };

  const handleBack = () => {
    setCurrentStep(prevStep => prevStep - 1);
  };

  const handleSubmitConfirm = () => {
    setConfirmDialogOpen(true);
  };

  const handleCloseConfirm = () => {
    setConfirmDialogOpen(false);
  };

  const submitAttempt = () => {
    setIsSubmitting(true);
    setConfirmDialogOpen(false);
    
    // In a real app, this would be an API call
    // For now, we'll simulate with setTimeout
    setTimeout(() => {
      // Clear timer
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      
      // Calculate score
      let correctCount = 0;
      assessment.questions.forEach(question => {
        if (answers[question.id] === question.correctAnswer) {
          correctCount++;
        }
      });
      
      const score = Math.round((correctCount / assessment.questions.length) * 100);
      const passed = score >= assessment.passingScore;
      
      // Set results
      setResults({
        score,
        passed,
        correctCount,
        totalQuestions: assessment.questions.length,
        answers,
        correctAnswers: assessment.questions.map(q => ({ 
          questionId: q.id, 
          correctAnswer: q.correctAnswer 
        }))
      });
      
      setAttemptCompleted(true);
      setIsSubmitting(false);
    }, 2000);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Skeleton variant="text" height={60} sx={{ mb: 1 }} />
        <Skeleton variant="text" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mt: 4 }}>
        {error}
      </Alert>
    );
  }

  if (!assessment) {
    return (
      <Alert severity="info" sx={{ mt: 4 }}>
        Assessment not found.
      </Alert>
    );
  }

  // Check if user has reached maximum attempts
  const hasReachedMaxAttempts = assessment.attempts && assessment.attempts.length >= assessment.maxAttempts;
  
  // Check if due date has passed
  const dueDatePassed = assessment.dueDate && new Date() > new Date(assessment.dueDate);
  
  // Determine if user can start a new attempt
  const canStartAttempt = !hasReachedMaxAttempts && !dueDatePassed && !attemptStarted;

  return (
    <Box>
      {/* Assessment header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Button
            component={Link}
            to="/assessments"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 1 }}
          >
            Back to Assessments
          </Button>
          <Typography variant="h4" component="h1">
            {assessment.title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
          </Typography>
        </Box>
        
        {attemptStarted && !attemptCompleted && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            bgcolor: timeLeft < assessment.timeLimit * 60 * 0.2 ? 'error.light' : 'primary.light',
            color: 'white',
            px: 2,
            py: 1,
            borderRadius: 2
          }}>
            <TimerIcon sx={{ mr: 1 }} />
            <Typography variant="h6">
              {formatTime(timeLeft)}
            </Typography>
          </Box>
        )}
      </Box>
      
      {/* Assessment info */}
      {!attemptStarted && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Assessment Information
          </Typography>
          <Typography variant="body1" paragraph>
            {assessment.description}
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AssignmentIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Questions:</strong> {assessment.questions.length}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TimerIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Time Limit:</strong> {assessment.timeLimit} minutes
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CheckCircleIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Passing Score:</strong> {assessment.passingScore}%
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <FlagIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="body2">
                  <strong>Attempts:</strong> {assessment.attempts ? assessment.attempts.length : 0}/{assessment.maxAttempts}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          
          {dueDatePassed && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              <AlertTitle>Due Date Passed</AlertTitle>
              This assessment was due on {new Date(assessment.dueDate).toLocaleDateString()} and is no longer available.
            </Alert>
          )}
          
          {hasReachedMaxAttempts && (
            <Alert severity="info" sx={{ mb: 2 }}>
              <AlertTitle>Maximum Attempts Reached</AlertTitle>
              You have used all {assessment.maxAttempts} attempts for this assessment.
            </Alert>
          )}
          
          {assessment.attempts && assessment.attempts.length > 0 && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                Previous Attempts
              </Typography>
              <Grid container spacing={2}>
                {assessment.attempts.map((attempt, index) => (
                  <Grid item xs={12} sm={6} md={4} key={attempt.id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Attempt {index + 1}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          Date: {new Date(attempt.startedAt).toLocaleDateString()}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                          <Typography variant="body2" sx={{ mr: 1 }}>
                            Score: {attempt.score}%
                          </Typography>
                          <Chip 
                            size="small" 
                            color={attempt.passed ? 'success' : 'error'} 
                            label={attempt.passed ? 'Passed' : 'Failed'} 
                          />
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
          
          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={!canStartAttempt}
              onClick={startAttempt}
              startIcon={<AssignmentIcon />}
            >
              Start Assessment
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Assessment questions */}
      {attemptStarted && !attemptCompleted && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Question {currentStep + 1} of {assessment.questions.length}
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={(currentStep / assessment.questions.length) * 100} 
              sx={{ height: 8, borderRadius: 4 }} 
            />
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              {assessment.questions[currentStep].question}
            </Typography>
            
            <FormControl component="fieldset" sx={{ width: '100%', mt: 2 }}>
              <RadioGroup
                value={answers[assessment.questions[currentStep].id] === null ? '' : answers[assessment.questions[currentStep].id].toString()}
                onChange={(e) => handleAnswerChange(assessment.questions[currentStep].id, e.target.value)}
              >
                {assessment.questions[currentStep].options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={index.toString()}
                    control={<Radio />}
                    label={option}
                    sx={{ 
                      mb: 1, 
                      p: 1, 
                      borderRadius: 1,
                      '&:hover': { bgcolor: 'action.hover' }
                    }}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Box>
          
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button
              onClick={handleBack}
              disabled={currentStep === 0}
              startIcon={<ArrowBackIcon />}
            >
              Previous
            </Button>
            
            {currentStep < assessment.questions.length - 1 ? (
              <Button
                variant="contained"
                onClick={handleNext}
                endIcon={<ArrowForwardIcon />}
              >
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmitConfirm}
                endIcon={<CheckCircleIcon />}
              >
                Submit Assessment
              </Button>
            )}
          </Box>
        </Paper>
      )}
      
      {/* Assessment results */}
      {attemptCompleted && results && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              Assessment Completed
            </Typography>
            
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 3 }}>
              <Box
                sx={{
                  position: 'relative',
                  display: 'inline-flex',
                  mx: 2
                }}
              >
                <CircularProgress
                  variant="determinate"
                  value={results.score}
                  size={120}
                  thickness={5}
                  color={results.passed ? 'success' : 'error'}
                />
                <Box
                  sx={{
                    top: 0,
                    left: 0,
                    bottom: 0,
                    right: 0,
                    position: 'absolute',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="h4" component="div" color="text.secondary">
                    {results.score}%
                  </Typography>
                </Box>
              </Box>
              
              <Box sx={{ textAlign: 'left', ml: 2 }}>
                <Typography variant="h6" gutterBottom>
                  {results.passed ? 'Congratulations!' : 'Almost there!'}
                </Typography>
                <Typography variant="body1">
                  You answered {results.correctCount} out of {results.totalQuestions} questions correctly.
                </Typography>
                <Chip 
                  sx={{ mt: 1 }}
                  color={results.passed ? 'success' : 'error'} 
                  icon={results.passed ? <CheckCircleIcon /> : <WarningIcon />}
                  label={results.passed ? 'Passed' : 'Failed'} 
                />
              </Box>
            </Box>
          </Box>
          
          <Divider sx={{ my: 3 }} />
          
          <Typography variant="h6" gutterBottom>
            Question Review
          </Typography>
          
          {assessment.questions.map((question, index) => {
            const userAnswer = answers[question.id];
            const correctAnswer = question.correctAnswer;
            const isCorrect = userAnswer === correctAnswer;
            
            return (
              <Card key={question.id} sx={{ mb: 2, border: 1, borderColor: isCorrect ? 'success.main' : 'error.main' }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Question {index + 1}: {question.question}
                  </Typography>
                  
                  <Box sx={{ ml: 2 }}>
                    {question.options.map((option, optIndex) => (
                      <Typography 
                        key={optIndex} 
                        variant="body2" 
                        sx={{ 
                          py: 0.5,
                          color: optIndex === correctAnswer ? 'success.main' : 
                                 (optIndex === userAnswer && !isCorrect) ? 'error.main' : 
                                 'text.primary',
                          fontWeight: optIndex === correctAnswer || optIndex === userAnswer ? 'bold' : 'normal'
                        }}
                      >
                        {optIndex === userAnswer && '➤ '}
                        {optIndex === correctAnswer && '✓ '}
                        {option}
                        {optIndex === correctAnswer && ' (Correct Answer)'}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            );
          })}
          
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button
              variant="contained"
              component={Link}
              to="/assessments"
              startIcon={<ArrowBackIcon />}
            >
              Back to Assessments
            </Button>
          </Box>
        </Paper>
      )}
      
      {/* Confirmation Dialog */}
      <Dialog
        open={confirmDialogOpen}
        onClose={handleCloseConfirm}
      >
        <DialogTitle>Submit Assessment?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to submit your assessment? You won't be able to change your answers after submission.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Cancel</Button>
          <Button onClick={submitAttempt} variant="contained" color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      
      {/* Time Warning Dialog */}
      <Dialog
        open={timeWarningDialogOpen}
        onClose={() => setTimeWarningDialogOpen(false)}
      >
        <DialogTitle sx={{ color: 'warning.main' }}>
          <WarningIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Time Warning
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            You have less than {Math.ceil(assessment.timeLimit * 0.2)} minutes remaining. Please finish your assessment soon.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTimeWarningDialogOpen(false)} variant="contained">
            Continue
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AssessmentDetail;
