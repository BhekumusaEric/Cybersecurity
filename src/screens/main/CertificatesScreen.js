/**
 * Certificates Screen
 */
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Share,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// Mock data
const certificatesData = [
  {
    id: '1',
    title: 'Introduction to Ethical Hacking',
    issueDate: '2023-05-20',
    expiryDate: '2026-05-20',
    image: 'https://via.placeholder.com/400',
    courseId: '1',
    credentialId: 'CERT-EH-1234-5678',
    issuer: 'Ethical Hacking LMS',
    skills: [
      'Ethical Hacking Fundamentals',
      'Reconnaissance Techniques',
      'Vulnerability Assessment',
    ],
  },
  {
    id: '2',
    title: 'Network Security Fundamentals',
    issueDate: '2023-07-15',
    expiryDate: '2026-07-15',
    image: 'https://via.placeholder.com/400',
    courseId: '2',
    credentialId: 'CERT-NS-5678-9012',
    issuer: 'Ethical Hacking LMS',
    skills: [
      'Network Security Principles',
      'Firewall Configuration',
      'Intrusion Detection Systems',
      'VPN Setup and Management',
    ],
  },
  {
    id: '3',
    title: 'Web Application Security',
    issueDate: '2023-08-30',
    expiryDate: '2026-08-30',
    image: 'https://via.placeholder.com/400',
    courseId: '3',
    credentialId: 'CERT-WAS-9012-3456',
    issuer: 'Ethical Hacking LMS',
    skills: [
      'OWASP Top 10 Vulnerabilities',
      'SQL Injection Prevention',
      'Cross-Site Scripting (XSS) Mitigation',
      'Security Headers Implementation',
    ],
  },
];

const CertificatesScreen = ({ navigation }) => {
  const { colors } = useTheme();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  
  useEffect(() => {
    // Simulate API call to fetch certificates
    const fetchCertificates = async () => {
      try {
        // In a real app, you would fetch certificates from an API
        // For now, we'll use the mock data
        setTimeout(() => {
          setCertificates(certificatesData);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error fetching certificates:', error);
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, []);
  
  const handleCertificatePress = (certificate) => {
    setSelectedCertificate(certificate);
  };
  
  const handleDownload = (certificate) => {
    // In a real app, you would download the certificate
    Alert.alert('Download Certificate', `Downloading certificate for ${certificate.title}...`);
  };
  
  const handleShare = async (certificate) => {
    try {
      const result = await Share.share({
        message: `I've earned the ${certificate.title} certificate from Ethical Hacking LMS! Credential ID: ${certificate.credentialId}`,
        title: 'Share Certificate',
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to share certificate');
    }
  };
  
  const handleVerify = (certificate) => {
    // In a real app, you would verify the certificate
    Alert.alert(
      'Certificate Verification',
      `Certificate ${certificate.credentialId} is valid and was issued on ${certificate.issueDate}.`
    );
  };
  
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    header: {
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    headerSubtitle: {
      fontSize: 14,
      color: colors.text + '99',
    },
    content: {
      flex: 1,
      padding: 16,
    },
    certificateCard: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
    },
    certificateImage: {
      width: '100%',
      height: 150,
      resizeMode: 'cover',
    },
    certificateContent: {
      padding: 16,
    },
    certificateTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 8,
    },
    certificateMeta: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    certificateMetaItem: {
      flexDirection: 'row',
      alignItems: 'center',
      marginRight: 16,
      marginBottom: 8,
    },
    certificateMetaText: {
      fontSize: 14,
      color: colors.text + '99',
      marginLeft: 4,
    },
    certificateActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    certificateButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 4,
      backgroundColor: colors.primary + '20',
    },
    certificateButtonText: {
      fontSize: 12,
      color: colors.primary,
      marginLeft: 4,
    },
    modalContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 16,
      backgroundColor: colors.card,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
    },
    modalTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginLeft: 16,
      flex: 1,
    },
    modalContent: {
      flex: 1,
      padding: 16,
    },
    certificateDetailImage: {
      width: '100%',
      height: 200,
      resizeMode: 'cover',
      borderRadius: 12,
      marginBottom: 16,
    },
    certificateDetailTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 16,
    },
    certificateDetailSection: {
      marginBottom: 24,
    },
    certificateDetailSectionTitle: {
      fontSize: 18,
      fontWeight: 'bold',
      color: colors.text,
      marginBottom: 12,
    },
    certificateDetailRow: {
      flexDirection: 'row',
      marginBottom: 8,
    },
    certificateDetailLabel: {
      fontSize: 14,
      color: colors.text + '99',
      width: 120,
    },
    certificateDetailValue: {
      fontSize: 14,
      color: colors.text,
      flex: 1,
    },
    skillsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 8,
    },
    skillChip: {
      backgroundColor: colors.primary + '20',
      paddingHorizontal: 8,
      paddingVertical: 4,
      borderRadius: 4,
      marginRight: 8,
      marginBottom: 8,
    },
    skillChipText: {
      fontSize: 12,
      color: colors.primary,
    },
    certificateDetailActions: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    certificateDetailButton: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 12,
      borderRadius: 8,
      marginHorizontal: 4,
    },
    certificateDetailButtonText: {
      fontSize: 14,
      fontWeight: 'bold',
      marginLeft: 8,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
    },
    emptyIcon: {
      marginBottom: 16,
    },
    emptyText: {
      fontSize: 16,
      color: colors.text + '99',
      textAlign: 'center',
      marginBottom: 24,
    },
    emptyButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 4,
      backgroundColor: colors.primary,
    },
    emptyButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      marginLeft: 8,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={{ marginTop: 16, color: colors.text }}>Loading certificates...</Text>
      </View>
    );
  }

  if (selectedCertificate) {
    return (
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <TouchableOpacity onPress={() => setSelectedCertificate(null)}>
            <Icon name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.modalTitle}>Certificate Details</Text>
        </View>
        
        <ScrollView style={styles.modalContent}>
          <Image
            source={{ uri: selectedCertificate.image }}
            style={styles.certificateDetailImage}
          />
          
          <Text style={styles.certificateDetailTitle}>{selectedCertificate.title}</Text>
          
          <View style={styles.certificateDetailSection}>
            <Text style={styles.certificateDetailSectionTitle}>Certificate Information</Text>
            
            <View style={styles.certificateDetailRow}>
              <Text style={styles.certificateDetailLabel}>Credential ID:</Text>
              <Text style={styles.certificateDetailValue}>{selectedCertificate.credentialId}</Text>
            </View>
            
            <View style={styles.certificateDetailRow}>
              <Text style={styles.certificateDetailLabel}>Issuer:</Text>
              <Text style={styles.certificateDetailValue}>{selectedCertificate.issuer}</Text>
            </View>
            
            <View style={styles.certificateDetailRow}>
              <Text style={styles.certificateDetailLabel}>Issue Date:</Text>
              <Text style={styles.certificateDetailValue}>{formatDate(selectedCertificate.issueDate)}</Text>
            </View>
            
            <View style={styles.certificateDetailRow}>
              <Text style={styles.certificateDetailLabel}>Expiry Date:</Text>
              <Text style={styles.certificateDetailValue}>{formatDate(selectedCertificate.expiryDate)}</Text>
            </View>
          </View>
          
          <View style={styles.certificateDetailSection}>
            <Text style={styles.certificateDetailSectionTitle}>Skills</Text>
            
            <View style={styles.skillsContainer}>
              {selectedCertificate.skills.map((skill, index) => (
                <View key={index} style={styles.skillChip}>
                  <Text style={styles.skillChipText}>{skill}</Text>
                </View>
              ))}
            </View>
          </View>
          
          <View style={styles.certificateDetailActions}>
            <TouchableOpacity
              style={[
                styles.certificateDetailButton,
                { backgroundColor: colors.primary },
              ]}
              onPress={() => handleDownload(selectedCertificate)}
            >
              <Icon name="download" size={18} color="#FFFFFF" />
              <Text style={[styles.certificateDetailButtonText, { color: '#FFFFFF' }]}>
                Download
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.certificateDetailButton,
                { backgroundColor: colors.success + '20' },
              ]}
              onPress={() => handleShare(selectedCertificate)}
            >
              <Icon name="share-variant" size={18} color={colors.success} />
              <Text style={[styles.certificateDetailButtonText, { color: colors.success }]}>
                Share
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.certificateDetailButton,
                { backgroundColor: colors.info + '20' },
              ]}
              onPress={() => handleVerify(selectedCertificate)}
            >
              <Icon name="check-decagram" size={18} color={colors.info} />
              <Text style={[styles.certificateDetailButtonText, { color: colors.info }]}>
                Verify
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }

  const renderCertificateItem = ({ item }) => (
    <TouchableOpacity
      style={styles.certificateCard}
      onPress={() => handleCertificatePress(item)}
    >
      <Image source={{ uri: item.image }} style={styles.certificateImage} />
      <View style={styles.certificateContent}>
        <Text style={styles.certificateTitle}>{item.title}</Text>
        
        <View style={styles.certificateMeta}>
          <View style={styles.certificateMetaItem}>
            <Icon name="calendar" size={16} color={colors.text + '99'} />
            <Text style={styles.certificateMetaText}>Issued: {formatDate(item.issueDate)}</Text>
          </View>
          <View style={styles.certificateMetaItem}>
            <Icon name="calendar-clock" size={16} color={colors.text + '99'} />
            <Text style={styles.certificateMetaText}>Expires: {formatDate(item.expiryDate)}</Text>
          </View>
        </View>
        
        <View style={styles.certificateActions}>
          <TouchableOpacity
            style={styles.certificateButton}
            onPress={() => handleDownload(item)}
          >
            <Icon name="download" size={16} color={colors.primary} />
            <Text style={styles.certificateButtonText}>Download</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.certificateButton}
            onPress={() => handleShare(item)}
          >
            <Icon name="share-variant" size={16} color={colors.primary} />
            <Text style={styles.certificateButtonText}>Share</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.certificateButton}
            onPress={() => handleVerify(item)}
          >
            <Icon name="check-decagram" size={16} color={colors.primary} />
            <Text style={styles.certificateButtonText}>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Icon
        name="certificate"
        size={64}
        color={colors.text + '30'}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyText}>
        You haven't earned any certificates yet. Complete courses to earn certificates.
      </Text>
      <TouchableOpacity
        style={styles.emptyButton}
        onPress={() => navigation.navigate('Courses')}
      >
        <Icon name="book-open-variant" size={16} color="#FFFFFF" />
        <Text style={styles.emptyButtonText}>Browse Courses</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Certificates</Text>
        <Text style={styles.headerSubtitle}>
          {certificates.length > 0
            ? `You have earned ${certificates.length} certificate${certificates.length > 1 ? 's' : ''}`
            : 'Complete courses to earn certificates'}
        </Text>
      </View>
      
      <FlatList
        data={certificates}
        renderItem={renderCertificateItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, flexGrow: 1 }}
        ListEmptyComponent={renderEmptyComponent}
      />
    </View>
  );
};

export default CertificatesScreen;
