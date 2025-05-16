import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Image,
  Linking,
  TouchableOpacity,
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

const AboutScreen = ({ navigation }) => {
  const { theme } = useTheme();
  
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
  
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="About" />
      </Appbar.Header>
      
      <ScrollView style={styles.scrollView}>
        {/* App Info */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Title style={styles.appName}>Ethical Hacking LMS</Title>
          <Text style={styles.version}>Version 1.0.0</Text>
        </View>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>About the App</Title>
            <Paragraph style={styles.paragraph}>
              Ethical Hacking LMS is a comprehensive mobile learning platform designed for cybersecurity enthusiasts, 
              students, and professionals who want to master ethical hacking skills through hands-on practice.
            </Paragraph>
            <Paragraph style={styles.paragraph}>
              Our 12-week ethical hacking course provides a structured learning path with interactive lessons, 
              practical labs, and assessments to help you build real-world cybersecurity skills.
            </Paragraph>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Key Features</Title>
            
            <List.Item
              title="Comprehensive Curriculum"
              description="Follow our structured 12-week ethical hacking course covering everything from basic networking to advanced exploitation techniques."
              left={props => <List.Icon {...props} icon="book-open-variant" />}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Interactive Labs"
              description="Practice your skills in our secure, isolated lab environments directly from your mobile device."
              left={props => <List.Icon {...props} icon="console" />}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Offline Learning"
              description="Download course materials and simplified lab simulations for learning on the go, even without an internet connection."
              left={props => <List.Icon {...props} icon="download" />}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Progress Tracking"
              description="Monitor your learning journey with detailed progress tracking and performance analytics."
              left={props => <List.Icon {...props} icon="chart-line" />}
            />
            
            <Divider style={styles.divider} />
            
            <List.Item
              title="Hands-on Assessments"
              description="Test your knowledge with quizzes, practical challenges, and real-world scenarios."
              left={props => <List.Icon {...props} icon="clipboard-check" />}
            />
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Our Team</Title>
            <Paragraph style={styles.paragraph}>
              Ethical Hacking LMS was developed by a team of cybersecurity experts and educators 
              passionate about making high-quality cybersecurity education accessible to everyone.
            </Paragraph>
            
            <View style={styles.teamContainer}>
              <View style={styles.teamMember}>
                <Image
                  source={require('../../assets/team/team1.png')}
                  style={styles.teamPhoto}
                  resizeMode="cover"
                />
                <Text style={styles.teamName}>Dr. Sarah Johnson</Text>
                <Text style={styles.teamRole}>Lead Instructor</Text>
              </View>
              
              <View style={styles.teamMember}>
                <Image
                  source={require('../../assets/team/team2.png')}
                  style={styles.teamPhoto}
                  resizeMode="cover"
                />
                <Text style={styles.teamName}>Michael Chen</Text>
                <Text style={styles.teamRole}>Security Researcher</Text>
              </View>
              
              <View style={styles.teamMember}>
                <Image
                  source={require('../../assets/team/team3.png')}
                  style={styles.teamPhoto}
                  resizeMode="cover"
                />
                <Text style={styles.teamName}>Aisha Patel</Text>
                <Text style={styles.teamRole}>Lab Developer</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Connect With Us</Title>
            
            <View style={styles.socialContainer}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => openURL('https://twitter.com/ethicalhackinglms')}
              >
                <Icon name="twitter" size={24} color="#1DA1F2" />
                <Text style={styles.socialText}>Twitter</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => openURL('https://linkedin.com/company/ethicalhackinglms')}
              >
                <Icon name="linkedin" size={24} color="#0077B5" />
                <Text style={styles.socialText}>LinkedIn</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => openURL('https://github.com/ethicalhackinglms')}
              >
                <Icon name="github" size={24} color="#333" />
                <Text style={styles.socialText}>GitHub</Text>
              </TouchableOpacity>
            </View>
            
            <Button
              mode="contained"
              icon="email"
              onPress={() => openURL('mailto:support@ethicalhackinglms.com')}
              style={styles.contactButton}
            >
              Contact Us
            </Button>
          </Card.Content>
        </Card>
        
        <Card style={styles.card}>
          <Card.Content>
            <Title>Legal Information</Title>
            
            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => navigation.navigate('PrivacyPolicy')}
            >
              <Icon name="shield-account" size={24} color={theme.colors.primary} />
              <Text style={styles.legalText}>Privacy Policy</Text>
              <Icon name="chevron-right" size={24} color="#757575" />
            </TouchableOpacity>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => navigation.navigate('TermsOfService')}
            >
              <Icon name="file-document" size={24} color={theme.colors.primary} />
              <Text style={styles.legalText}>Terms of Service</Text>
              <Icon name="chevron-right" size={24} color="#757575" />
            </TouchableOpacity>
            
            <Divider style={styles.divider} />
            
            <TouchableOpacity
              style={styles.legalItem}
              onPress={() => openURL('https://ethicalhackinglms.com/licenses')}
            >
              <Icon name="license" size={24} color={theme.colors.primary} />
              <Text style={styles.legalText}>Open Source Licenses</Text>
              <Icon name="chevron-right" size={24} color="#757575" />
            </TouchableOpacity>
          </Card.Content>
        </Card>
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © 2023 Ethical Hacking LMS. All rights reserved.
          </Text>
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
  logoContainer: {
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  version: {
    fontSize: 14,
    color: '#757575',
  },
  card: {
    margin: 16,
    marginTop: 8,
    marginBottom: 8,
  },
  paragraph: {
    marginBottom: 16,
    lineHeight: 22,
  },
  divider: {
    marginVertical: 8,
  },
  teamContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    marginTop: 16,
  },
  teamMember: {
    alignItems: 'center',
    marginBottom: 16,
    width: '30%',
  },
  teamPhoto: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 8,
  },
  teamName: {
    fontWeight: 'bold',
    textAlign: 'center',
  },
  teamRole: {
    fontSize: 12,
    color: '#757575',
    textAlign: 'center',
  },
  socialContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 16,
  },
  socialButton: {
    alignItems: 'center',
  },
  socialText: {
    marginTop: 8,
  },
  contactButton: {
    marginTop: 8,
  },
  legalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  legalText: {
    flex: 1,
    marginLeft: 16,
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

export default AboutScreen;
