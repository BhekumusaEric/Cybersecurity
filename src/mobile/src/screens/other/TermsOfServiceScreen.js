import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Share,
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
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../../context/ThemeContext';

const TermsOfServiceScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  // Share terms of service
  const shareTermsOfService = async () => {
    try {
      await Share.share({
        message: 'Check out the Ethical Hacking LMS Terms of Service: https://ethicalhackinglms.com/terms',
        title: 'Ethical Hacking LMS Terms of Service',
      });
    } catch (error) {
      console.log('Error sharing terms of service:', error);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Terms of Service" />
        <Appbar.Action icon="share-variant" onPress={shareTermsOfService} />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Terms of Service</Title>
            <Text style={styles.lastUpdated}>Last Updated: August 15, 2023</Text>
            
            <Paragraph style={styles.paragraph}>
              Please read these Terms of Service ("Terms") carefully before using the Ethical Hacking LMS 
              mobile application and related services (collectively, the "Services") operated by Ethical 
              Hacking LMS ("we", "our", or "us").
            </Paragraph>
            
            <Paragraph style={styles.paragraph}>
              By accessing or using the Services, you agree to be bound by these Terms. If you disagree 
              with any part of the Terms, you may not access the Services.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>1. Accounts</Title>
            <Paragraph style={styles.paragraph}>
              When you create an account with us, you must provide accurate, complete, and current 
              information. Failure to do so constitutes a breach of the Terms, which may result in 
              immediate termination of your account.
            </Paragraph>
            
            <Paragraph style={styles.paragraph}>
              You are responsible for safeguarding the password that you use to access the Services and 
              for any activities or actions under your password. We encourage you to use a strong password 
              (a password that uses a combination of upper and lower case letters, numbers, and symbols) 
              with your account.
            </Paragraph>
            
            <Paragraph style={styles.paragraph}>
              You agree not to disclose your password to any third party. You must notify us immediately 
              upon becoming aware of any breach of security or unauthorized use of your account.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>2. Intellectual Property</Title>
            <Paragraph style={styles.paragraph}>
              The Services and their original content, features, and functionality are and will remain the 
              exclusive property of Ethical Hacking LMS and its licensors. The Services are protected by 
              copyright, trademark, and other laws of both the United States and foreign countries.
            </Paragraph>
            
            <Paragraph style={styles.paragraph}>
              Our trademarks and trade dress may not be used in connection with any product or service 
              without the prior written consent of Ethical Hacking LMS.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>3. User Content</Title>
            <Paragraph style={styles.paragraph}>
              Our Services allow you to post, link, store, share and otherwise make available certain 
              information, text, graphics, videos, or other material ("User Content"). You are responsible 
              for the User Content that you post on or through the Services, including its legality, 
              reliability, and appropriateness.
            </Paragraph>
            
            <Paragraph style={styles.paragraph}>
              By posting User Content on or through the Services, you represent and warrant that:
            </Paragraph>
            
            <List.Item
              title="Ownership"
              description="The User Content is yours or you have the right to use it and grant us the rights and license as provided in these Terms."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            <List.Item
              title="Non-infringement"
              description="The User Content does not infringe upon the intellectual property rights of any third party."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            <List.Item
              title="Legality"
              description="The User Content does not violate any applicable law, regulation, or these Terms."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            <List.Item
              title="Harm"
              description="The User Content will not cause injury to any person or entity."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            
            <Paragraph style={styles.paragraph}>
              We reserve the right to remove any User Content from the Services at any time, for any reason, 
              without notice.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>4. Acceptable Use</Title>
            <Paragraph style={styles.paragraph}>
              You agree not to use the Services:
            </Paragraph>
            
            <List.Item
              title="Illegal Activities"
              description="In any way that violates any applicable national or international law or regulation."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            <List.Item
              title="Harm"
              description="To harm or attempt to harm minors in any way."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            <List.Item
              title="Impersonation"
              description="To impersonate or attempt to impersonate Ethical Hacking LMS, an Ethical Hacking LMS employee, another user, or any other person or entity."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            <List.Item
              title="Fraud"
              description="To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which may harm Ethical Hacking LMS or users of the Services."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            
            <Paragraph style={styles.paragraph}>
              Additionally, you agree not to:
            </Paragraph>
            
            <List.Item
              title="Unauthorized Access"
              description="Use the Services in any manner that could disable, overburden, damage, or impair the Services or interfere with any other party's use of the Services."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            <List.Item
              title="Automated Access"
              description="Use any robot, spider, or other automatic device, process, or means to access the Services for any purpose, including monitoring or copying any of the material on the Services."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            <List.Item
              title="Reverse Engineering"
              description="Attempt to reverse engineer any portion of the Services."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            <List.Item
              title="Circumvention"
              description="Circumvent, disable, or otherwise interfere with security-related features of the Services."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            
            <Title style={styles.sectionTitle}>5. Ethical Hacking Guidelines</Title>
            <Paragraph style={styles.paragraph}>
              The Services are designed for educational purposes only. You agree to use the knowledge and 
              skills gained through the Services only for legal and ethical purposes, such as:
            </Paragraph>
            
            <List.Item
              title="Authorized Testing"
              description="Testing the security of systems and networks with explicit permission from the owner."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            <List.Item
              title="Research"
              description="Conducting security research in a responsible manner."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            <List.Item
              title="Education"
              description="Learning about cybersecurity concepts and techniques."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            
            <Paragraph style={styles.paragraph}>
              You agree NOT to use the knowledge and skills gained through the Services for:
            </Paragraph>
            
            <List.Item
              title="Unauthorized Access"
              description="Accessing systems, networks, or data without explicit permission."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            <List.Item
              title="Illegal Activities"
              description="Engaging in any activity that violates local, state, national, or international law."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            <List.Item
              title="Malicious Intent"
              description="Causing harm to individuals, organizations, or their systems and data."
              left={props => <List.Icon {...props} icon="close-circle" color="#f44336" />}
            />
            
            <Title style={styles.sectionTitle}>6. Termination</Title>
            <Paragraph style={styles.paragraph}>
              We may terminate or suspend your account immediately, without prior notice or liability, for 
              any reason whatsoever, including without limitation if you breach the Terms.
            </Paragraph>
            
            <Paragraph style={styles.paragraph}>
              Upon termination, your right to use the Services will immediately cease. If you wish to 
              terminate your account, you may simply discontinue using the Services or contact us to 
              request account deletion.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>7. Limitation of Liability</Title>
            <Paragraph style={styles.paragraph}>
              In no event shall Ethical Hacking LMS, nor its directors, employees, partners, agents, 
              suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or 
              punitive damages, including without limitation, loss of profits, data, use, goodwill, or 
              other intangible losses, resulting from:
            </Paragraph>
            
            <List.Item
              title="Access"
              description="Your access to or use of or inability to access or use the Services."
              left={props => <List.Icon {...props} icon="information" />}
            />
            <List.Item
              title="Third Party Conduct"
              description="Any conduct or content of any third party on the Services."
              left={props => <List.Icon {...props} icon="information" />}
            />
            <List.Item
              title="Unauthorized Access"
              description="Unauthorized access, use or alteration of your transmissions or content."
              left={props => <List.Icon {...props} icon="information" />}
            />
            
            <Title style={styles.sectionTitle}>8. Changes</Title>
            <Paragraph style={styles.paragraph}>
              We reserve the right, at our sole discretion, to modify or replace these Terms at any time. 
              If a revision is material we will try to provide at least 30 days' notice prior to any new 
              terms taking effect. What constitutes a material change will be determined at our sole discretion.
            </Paragraph>
            
            <Paragraph style={styles.paragraph}>
              By continuing to access or use our Services after those revisions become effective, you agree 
              to be bound by the revised terms. If you do not agree to the new terms, please stop using the Services.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>9. Contact Us</Title>
            <Paragraph style={styles.paragraph}>
              If you have any questions about these Terms, please contact us at:
            </Paragraph>
            <Paragraph style={styles.contactInfo}>
              Ethical Hacking LMS{'\n'}
              123 Security Street{'\n'}
              Cyber City, CS 12345{'\n'}
              terms@ethicalhackinglms.com{'\n'}
              +1 (800) 555-1234
            </Paragraph>
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={shareTermsOfService}
            style={styles.shareButton}
            icon="share-variant"
          >
            Share Terms of Service
          </Button>
        </View>
      </ScrollView>
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
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  lastUpdated: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 16,
    lineHeight: 22,
  },
  contactInfo: {
    marginTop: 8,
    marginBottom: 16,
  },
  buttonContainer: {
    padding: 16,
    paddingTop: 0,
    marginBottom: 24,
  },
  shareButton: {
    marginTop: 8,
  },
});

export default TermsOfServiceScreen;
