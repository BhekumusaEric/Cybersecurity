import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native';
import {
  Text,
  Appbar,
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  List,
  TextInput,
  Chip,
  ActivityIndicator,
  Portal,
  Dialog,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';

const SupportScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  
  // Open URL
  const openURL = (url) => {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log("Don't know how to open URI: " + url);
      }
    });
  };
  
  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!name.trim() || !email.trim() || !subject.trim() || !message.trim() || !category) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    
    // Submit form
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setShowSuccessDialog(true);
      
      // Reset form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      setCategory('');
    }, 2000);
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Help & Support" />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        {/* FAQ Section */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Frequently Asked Questions</Title>
            
            <List.Accordion
              title="How do I reset my password?"
              left={props => <List.Icon {...props} icon="lock-reset" />}
            >
              <Paragraph style={styles.accordionContent}>
                To reset your password, go to the login screen and tap on "Forgot Password". 
                Enter your email address and follow the instructions sent to your email.
              </Paragraph>
            </List.Accordion>
            
            <Divider style={styles.divider} />
            
            <List.Accordion
              title="How do I download content for offline use?"
              left={props => <List.Icon {...props} icon="download" />}
            >
              <Paragraph style={styles.accordionContent}>
                To download content for offline use, navigate to the course or lab you want to download.
                Tap on the download icon in the top right corner. You can manage your downloads in the
                "Manage Downloads" section accessible from the side menu.
              </Paragraph>
            </List.Accordion>
            
            <Divider style={styles.divider} />
            
            <List.Accordion
              title="How do I access the lab environment?"
              left={props => <List.Icon {...props} icon="console" />}
            >
              <Paragraph style={styles.accordionContent}>
                To access the lab environment, navigate to the lab you want to work on and tap "Start Lab".
                The lab environment will load and you can interact with it directly from your device.
                Make sure you have a stable internet connection for the best experience.
              </Paragraph>
            </List.Accordion>
            
            <Divider style={styles.divider} />
            
            <List.Accordion
              title="How do I get a certificate?"
              left={props => <List.Icon {...props} icon="certificate" />}
            >
              <Paragraph style={styles.accordionContent}>
                To earn a certificate, you need to complete all lessons, labs, and assessments in a course
                with a passing grade. Once you've completed everything, your certificate will be automatically
                generated and available in your profile.
              </Paragraph>
            </List.Accordion>
            
            <Divider style={styles.divider} />
            
            <List.Accordion
              title="How do I report a bug or issue?"
              left={props => <List.Icon {...props} icon="bug" />}
            >
              <Paragraph style={styles.accordionContent}>
                To report a bug or issue, use the contact form below. Select "Bug Report" as the category
                and provide as much detail as possible about the issue, including steps to reproduce it,
                your device model, and operating system version.
              </Paragraph>
            </List.Accordion>
          </Card.Content>
        </Card>
        
        {/* Contact Options */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Contact Options</Title>
            
            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => openURL('mailto:support@ethicalhackinglms.com')}
            >
              <Icon name="email" size={24} color={theme.colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Email Support</Text>
                <Text style={styles.contactDetail}>support@ethicalhackinglms.com</Text>
                <Text style={styles.contactDescription}>
                  For general inquiries and support requests
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#757575" />
            </TouchableOpacity>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => openURL('tel:+18005551234')}
            >
              <Icon name="phone" size={24} color={theme.colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Phone Support</Text>
                <Text style={styles.contactDetail}>+1 (800) 555-1234</Text>
                <Text style={styles.contactDescription}>
                  Available Monday-Friday, 9am-5pm EST
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#757575" />
            </TouchableOpacity>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity
              style={styles.contactOption}
              onPress={() => openURL('https://ethicalhackinglms.com/live-chat')}
            >
              <Icon name="chat" size={24} color={theme.colors.primary} />
              <View style={styles.contactInfo}>
                <Text style={styles.contactTitle}>Live Chat</Text>
                <Text style={styles.contactDetail}>ethicalhackinglms.com/live-chat</Text>
                <Text style={styles.contactDescription}>
                  Chat with our support team in real-time
                </Text>
              </View>
              <Icon name="chevron-right" size={24} color="#757575" />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        {/* Contact Form */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Contact Form</Title>
            <Paragraph style={styles.paragraph}>
              Fill out the form below and we'll get back to you as soon as possible.
            </Paragraph>
            
            <TextInput
              label="Name"
              value={name}
              onChangeText={setName}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Email"
              value={email}
              onChangeText={setEmail}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <Text style={styles.categoryLabel}>Category</Text>
            <View style={styles.categoryContainer}>
              <TouchableOpacity
                onPress={() => setCategory('General')}
                style={styles.categoryChip}
              >
                <Chip
                  selected={category === 'General'}
                  onPress={() => setCategory('General')}
                  style={[
                    styles.chip,
                    category === 'General' && { backgroundColor: theme.colors.primary }
                  ]}
                  textStyle={category === 'General' && { color: '#fff' }}
                >
                  General
                </Chip>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setCategory('Technical')}
                style={styles.categoryChip}
              >
                <Chip
                  selected={category === 'Technical'}
                  onPress={() => setCategory('Technical')}
                  style={[
                    styles.chip,
                    category === 'Technical' && { backgroundColor: theme.colors.primary }
                  ]}
                  textStyle={category === 'Technical' && { color: '#fff' }}
                >
                  Technical
                </Chip>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setCategory('Billing')}
                style={styles.categoryChip}
              >
                <Chip
                  selected={category === 'Billing'}
                  onPress={() => setCategory('Billing')}
                  style={[
                    styles.chip,
                    category === 'Billing' && { backgroundColor: theme.colors.primary }
                  ]}
                  textStyle={category === 'Billing' && { color: '#fff' }}
                >
                  Billing
                </Chip>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setCategory('Bug Report')}
                style={styles.categoryChip}
              >
                <Chip
                  selected={category === 'Bug Report'}
                  onPress={() => setCategory('Bug Report')}
                  style={[
                    styles.chip,
                    category === 'Bug Report' && { backgroundColor: theme.colors.primary }
                  ]}
                  textStyle={category === 'Bug Report' && { color: '#fff' }}
                >
                  Bug Report
                </Chip>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => setCategory('Feature Request')}
                style={styles.categoryChip}
              >
                <Chip
                  selected={category === 'Feature Request'}
                  onPress={() => setCategory('Feature Request')}
                  style={[
                    styles.chip,
                    category === 'Feature Request' && { backgroundColor: theme.colors.primary }
                  ]}
                  textStyle={category === 'Feature Request' && { color: '#fff' }}
                >
                  Feature Request
                </Chip>
              </TouchableOpacity>
            </View>
            
            <TextInput
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              style={styles.input}
              mode="outlined"
            />
            
            <TextInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              style={styles.messageInput}
              mode="outlined"
              multiline
              numberOfLines={6}
            />
            
            <Button
              mode="contained"
              onPress={handleSubmit}
              style={styles.submitButton}
              loading={loading}
              disabled={loading}
            >
              Submit
            </Button>
          </Card.Content>
        </Card>
        
        {/* Knowledge Base */}
        <Card style={styles.card}>
          <Card.Content>
            <Title>Knowledge Base</Title>
            <Paragraph style={styles.paragraph}>
              Visit our knowledge base for detailed guides, tutorials, and troubleshooting tips.
            </Paragraph>
            
            <Button
              mode="outlined"
              icon="book-open-page-variant"
              onPress={() => openURL('https://ethicalhackinglms.com/kb')}
              style={styles.kbButton}
            >
              Browse Knowledge Base
            </Button>
          </Card.Content>
        </Card>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Our support team is available Monday-Friday, 9am-5pm EST.
          </Text>
        </View>
      </ScrollView>
      
      {/* Success Dialog */}
      <Portal>
        <Dialog visible={showSuccessDialog} onDismiss={() => setShowSuccessDialog(false)}>
          <Dialog.Title>Thank You!</Dialog.Title>
          <Dialog.Content>
            <Paragraph>
              Your message has been sent successfully. Our support team will get back to you as soon as possible.
            </Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setShowSuccessDialog(false)}>OK</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 16,
  },
  divider: {
    marginVertical: 8,
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  contactOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  contactInfo: {
    flex: 1,
    marginLeft: 16,
  },
  contactTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  contactDetail: {
    fontSize: 14,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 12,
    color: '#757575',
  },
  input: {
    marginBottom: 16,
  },
  categoryLabel: {
    fontSize: 14,
    marginBottom: 8,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  chip: {
    height: 36,
  },
  messageInput: {
    marginBottom: 16,
  },
  submitButton: {
    marginTop: 8,
  },
  kbButton: {
    marginTop: 8,
  },
  footer: {
    padding: 24,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
});

export default SupportScreen;
