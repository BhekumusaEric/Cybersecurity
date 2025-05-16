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

const PrivacyPolicyScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
  // Share privacy policy
  const sharePrivacyPolicy = async () => {
    try {
      await Share.share({
        message: 'Check out the Ethical Hacking LMS Privacy Policy: https://ethicalhackinglms.com/privacy',
        title: 'Ethical Hacking LMS Privacy Policy',
      });
    } catch (error) {
      console.log('Error sharing privacy policy:', error);
    }
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Privacy Policy" />
        <Appbar.Action icon="share-variant" onPress={sharePrivacyPolicy} />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.title}>Privacy Policy</Title>
            <Text style={styles.lastUpdated}>Last Updated: August 15, 2023</Text>
            
            <Paragraph style={styles.paragraph}>
              This Privacy Policy describes how Ethical Hacking LMS ("we", "our", or "us") collects, uses, 
              and shares your personal information when you use our mobile application and related services 
              (collectively, the "Services").
            </Paragraph>
            
            <Title style={styles.sectionTitle}>Information We Collect</Title>
            <Paragraph style={styles.paragraph}>
              We collect information that you provide directly to us, information we collect automatically 
              when you use the Services, and information from third-party sources.
            </Paragraph>
            
            <List.Section>
              <List.Subheader>Information You Provide to Us</List.Subheader>
              <List.Item
                title="Account Information"
                description="When you register for an account, we collect your name, email address, password, and profile information."
                left={props => <List.Icon {...props} icon="account" />}
              />
              <List.Item
                title="Course and Lab Activity"
                description="We collect information about your progress, quiz responses, lab activities, and other interactions with our educational content."
                left={props => <List.Icon {...props} icon="book-open-variant" />}
              />
              <List.Item
                title="Communications"
                description="When you contact us directly, we collect information about your communication and any additional information you provide."
                left={props => <List.Icon {...props} icon="email" />}
              />
              <List.Item
                title="Payment Information"
                description="If you make a purchase, we collect payment information, billing address, and other details necessary to complete the transaction."
                left={props => <List.Icon {...props} icon="credit-card" />}
              />
            </List.Section>
            
            <List.Section>
              <List.Subheader>Information We Collect Automatically</List.Subheader>
              <List.Item
                title="Device Information"
                description="We collect information about your device, including IP address, device type, operating system, and unique device identifiers."
                left={props => <List.Icon {...props} icon="cellphone" />}
              />
              <List.Item
                title="Usage Information"
                description="We collect information about how you use the Services, including the features you use, time spent, and other usage statistics."
                left={props => <List.Icon {...props} icon="chart-bar" />}
              />
              <List.Item
                title="Location Information"
                description="With your permission, we may collect precise location information from your device."
                left={props => <List.Icon {...props} icon="map-marker" />}
              />
            </List.Section>
            
            <Title style={styles.sectionTitle}>How We Use Your Information</Title>
            <Paragraph style={styles.paragraph}>
              We use the information we collect for various purposes, including:
            </Paragraph>
            
            <List.Item
              title="Providing the Services"
              description="To operate, maintain, and provide the features and functionality of the Services."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            <List.Item
              title="Improving the Services"
              description="To understand how users interact with the Services and improve them."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            <List.Item
              title="Personalization"
              description="To personalize your experience and provide content and features tailored to your preferences."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            <List.Item
              title="Communications"
              description="To communicate with you about the Services, respond to your inquiries, and send you updates and promotional messages."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            <List.Item
              title="Security and Fraud Prevention"
              description="To protect the security and integrity of the Services and prevent fraud and abuse."
              left={props => <List.Icon {...props} icon="check-circle" />}
            />
            
            <Title style={styles.sectionTitle}>How We Share Your Information</Title>
            <Paragraph style={styles.paragraph}>
              We may share your information in the following circumstances:
            </Paragraph>
            
            <List.Item
              title="Service Providers"
              description="We share information with third-party service providers who help us operate the Services."
              left={props => <List.Icon {...props} icon="account-group" />}
            />
            <List.Item
              title="Business Transfers"
              description="If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction."
              left={props => <List.Icon {...props} icon="swap-horizontal" />}
            />
            <List.Item
              title="Legal Requirements"
              description="We may disclose your information if required to do so by law or in response to valid legal requests."
              left={props => <List.Icon {...props} icon="gavel" />}
            />
            <List.Item
              title="With Your Consent"
              description="We may share your information with third parties when you have given us your consent to do so."
              left={props => <List.Icon {...props} icon="check" />}
            />
            
            <Title style={styles.sectionTitle}>Your Rights and Choices</Title>
            <Paragraph style={styles.paragraph}>
              You have certain rights and choices regarding your personal information:
            </Paragraph>
            
            <List.Item
              title="Account Information"
              description="You can update your account information through the app's settings."
              left={props => <List.Icon {...props} icon="account-edit" />}
            />
            <List.Item
              title="Marketing Communications"
              description="You can opt out of receiving promotional emails by following the instructions in those emails."
              left={props => <List.Icon {...props} icon="email-off" />}
            />
            <List.Item
              title="Push Notifications"
              description="You can opt out of receiving push notifications through your device settings."
              left={props => <List.Icon {...props} icon="bell-off" />}
            />
            <List.Item
              title="Data Access and Deletion"
              description="You can request access to or deletion of your personal information by contacting us."
              left={props => <List.Icon {...props} icon="delete" />}
            />
            
            <Title style={styles.sectionTitle}>Data Security</Title>
            <Paragraph style={styles.paragraph}>
              We implement appropriate technical and organizational measures to protect your personal information 
              against unauthorized access, disclosure, alteration, and destruction. However, no security system 
              is impenetrable, and we cannot guarantee the security of our systems 100%.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>Data Retention</Title>
            <Paragraph style={styles.paragraph}>
              We retain your personal information for as long as necessary to provide the Services and fulfill 
              the purposes outlined in this Privacy Policy, unless a longer retention period is required or 
              permitted by law.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>Children's Privacy</Title>
            <Paragraph style={styles.paragraph}>
              The Services are not directed to children under the age of 13, and we do not knowingly collect 
              personal information from children under 13. If we learn that we have collected personal information 
              from a child under 13, we will take steps to delete that information as quickly as possible.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>International Data Transfers</Title>
            <Paragraph style={styles.paragraph}>
              Your information may be transferred to, and processed in, countries other than the country in which 
              you are resident. These countries may have data protection laws that are different from the laws of 
              your country. We have taken appropriate safeguards to require that your personal information will 
              remain protected in accordance with this Privacy Policy.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>Changes to this Privacy Policy</Title>
            <Paragraph style={styles.paragraph}>
              We may update this Privacy Policy from time to time. If we make material changes, we will notify 
              you through the Services or by other means, such as email. We encourage you to review the Privacy 
              Policy whenever you access the Services.
            </Paragraph>
            
            <Title style={styles.sectionTitle}>Contact Us</Title>
            <Paragraph style={styles.paragraph}>
              If you have any questions about this Privacy Policy or our privacy practices, please contact us at:
            </Paragraph>
            <Paragraph style={styles.contactInfo}>
              Ethical Hacking LMS{'\n'}
              123 Security Street{'\n'}
              Cyber City, CS 12345{'\n'}
              privacy@ethicalhackinglms.com{'\n'}
              +1 (800) 555-1234
            </Paragraph>
          </Card.Content>
        </Card>
        
        <View style={styles.buttonContainer}>
          <Button
            mode="contained"
            onPress={sharePrivacyPolicy}
            style={styles.shareButton}
            icon="share-variant"
          >
            Share Privacy Policy
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

export default PrivacyPolicyScreen;
