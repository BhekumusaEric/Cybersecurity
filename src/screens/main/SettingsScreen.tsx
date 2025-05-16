import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
  TouchableOpacity,
  Alert,
  Modal,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useLocalization } from '../../context/LocalizationContext';
import Button from '../../components/common/Button';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();
  const { colors, isDark, themeMode, setThemeMode } = useTheme();
  const { signOut } = useAuth();
  const { t, locale, setLocale, availableLocales, getLocaleName } = useLocalization();
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [biometricsEnabled, setBiometricsEnabled] = useState(false);
  const [autoPlayVideos, setAutoPlayVideos] = useState(true);
  const [offlineDownloadsEnabled, setOfflineDownloadsEnabled] = useState(true);
  const [downloadOverWifiOnly, setDownloadOverWifiOnly] = useState(true);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [fontSizeMultiplier, setFontSizeMultiplier] = useState(1);
  
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showFontSizeModal, setShowFontSizeModal] = useState(false);
  const [showClearDataModal, setShowClearDataModal] = useState(false);
  
  // Handle theme change
  const handleThemeChange = (value: 'light' | 'dark' | 'system') => {
    setThemeMode(value);
    setShowThemeModal(false);
  };
  
  // Handle language change
  const handleLanguageChange = async (value: string) => {
    await setLocale(value);
    setShowLanguageModal(false);
  };
  
  // Handle font size change
  const handleFontSizeChange = async (value: number) => {
    setFontSizeMultiplier(value);
    await AsyncStorage.setItem('fontSizeMultiplier', value.toString());
    setShowFontSizeModal(false);
  };
  
  // Handle clear data
  const handleClearData = async () => {
    try {
      // Clear offline data
      await AsyncStorage.removeItem('offlineData');
      
      // Clear settings
      await AsyncStorage.removeItem('autoPlayVideos');
      await AsyncStorage.removeItem('fontSizeMultiplier');
      await AsyncStorage.removeItem('offlineDownloadsEnabled');
      
      // Reset state
      setAutoPlayVideos(true);
      setFontSizeMultiplier(1);
      setOfflineDownloadsEnabled(true);
      
      setShowClearDataModal(false);
      
      Alert.alert(t('settings.clearDataSuccess'));
    } catch (error) {
      console.error('Clear data error:', error);
      Alert.alert(t('common.error'), t('settings.clearDataError'));
    }
  };
  
  // Get theme name
  const getThemeName = (theme: string) => {
    switch (theme) {
      case 'light':
        return t('settings.lightMode');
      case 'dark':
        return t('settings.darkMode');
      case 'system':
        return t('settings.systemDefault');
      default:
        return theme;
    }
  };
  
  // Get font size name
  const getFontSizeName = (size: number) => {
    switch (size) {
      case 0.85:
        return t('settings.fontSizeSmall');
      case 1:
        return t('settings.fontSizeMedium');
      case 1.15:
        return t('settings.fontSizeLarge');
      default:
        return size.toString();
    }
  };
  
  // Render section header
  const renderSectionHeader = (title: string) => (
    <Text
      style={[
        styles.sectionHeader,
        { color: isDark ? colors.white : colors.dark },
      ]}
    >
      {title}
    </Text>
  );
  
  // Render setting item with switch
  const renderSwitchItem = (
    title: string,
    value: boolean,
    onValueChange: (value: boolean) => void,
    description?: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text
          style={[
            styles.settingTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.settingDescription,
              { color: isDark ? colors.lightGray : colors.gray },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: '#767577', true: colors.primary }}
        thumbColor={value ? colors.white : '#f4f3f4'}
      />
    </View>
  );
  
  // Render setting item with value
  const renderValueItem = (
    title: string,
    value: string,
    onPress: () => void,
    description?: string
  ) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingTextContainer}>
        <Text
          style={[
            styles.settingTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.settingDescription,
              { color: isDark ? colors.lightGray : colors.gray },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      <View style={styles.settingValueContainer}>
        <Text
          style={[
            styles.settingValue,
            { color: isDark ? colors.lightGray : colors.gray },
          ]}
        >
          {value}
        </Text>
        <Text style={{ color: isDark ? colors.lightGray : colors.gray }}>
          ›
        </Text>
      </View>
    </TouchableOpacity>
  );
  
  // Render button item
  const renderButtonItem = (
    title: string,
    onPress: () => void,
    type: 'primary' | 'danger' = 'primary',
    description?: string
  ) => (
    <View style={styles.settingItem}>
      <View style={styles.settingTextContainer}>
        <Text
          style={[
            styles.settingTitle,
            { color: isDark ? colors.white : colors.dark },
          ]}
        >
          {title}
        </Text>
        {description && (
          <Text
            style={[
              styles.settingDescription,
              { color: isDark ? colors.lightGray : colors.gray },
            ]}
          >
            {description}
          </Text>
        )}
      </View>
      <Button
        title={t('common.edit')}
        onPress={onPress}
        variant={type === 'danger' ? 'danger' : 'primary'}
        size="small"
      />
    </View>
  );
  
  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? colors.darker : colors.lighter },
      ]}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Account Settings */}
        {renderSectionHeader(t('settings.account'))}
        
        {renderButtonItem(
          t('profile.editProfile'),
          () => navigation.navigate('EditProfile' as never),
          'primary',
          t('profile.editProfileDescription')
        )}
        
        {renderButtonItem(
          t('profile.changePassword'),
          () => navigation.navigate('ChangePassword' as never),
          'primary',
          t('profile.changePasswordDescription')
        )}
        
        {renderSwitchItem(
          t('settings.enableBiometrics'),
          biometricsEnabled,
          setBiometricsEnabled,
          t('settings.enableBiometricsDescription')
        )}
        
        {/* Appearance Settings */}
        {renderSectionHeader(t('settings.appearance'))}
        
        {renderValueItem(
          t('settings.theme'),
          getThemeName(themeMode),
          () => setShowThemeModal(true)
        )}
        
        {renderValueItem(
          t('settings.fontSizeMultiplier'),
          getFontSizeName(fontSizeMultiplier),
          () => setShowFontSizeModal(true)
        )}
        
        {renderValueItem(
          t('settings.language'),
          getLocaleName(locale),
          () => setShowLanguageModal(true)
        )}
        
        {/* Notification Settings */}
        {renderSectionHeader(t('settings.notifications'))}
        
        {renderSwitchItem(
          t('settings.pushNotifications'),
          notificationsEnabled,
          setNotificationsEnabled
        )}
        
        {renderSwitchItem(
          t('settings.emailNotifications'),
          true,
          () => {}
        )}
        
        {renderSwitchItem(
          t('settings.reminders'),
          true,
          () => {}
        )}
        
        {/* Data Usage Settings */}
        {renderSectionHeader(t('settings.dataUsage'))}
        
        {renderSwitchItem(
          t('settings.autoPlayVideos'),
          autoPlayVideos,
          setAutoPlayVideos
        )}
        
        {renderSwitchItem(
          t('settings.offlineDownloads'),
          offlineDownloadsEnabled,
          setOfflineDownloadsEnabled
        )}
        
        {renderSwitchItem(
          t('settings.downloadOverWifi'),
          downloadOverWifiOnly,
          setDownloadOverWifiOnly
        )}
        
        {renderSwitchItem(
          t('settings.autoSyncProgress'),
          autoSyncEnabled,
          setAutoSyncEnabled
        )}
        
        {renderButtonItem(
          t('settings.clearData'),
          () => setShowClearDataModal(true),
          'danger',
          t('settings.clearDataDescription')
        )}
        
        {/* Sign Out Button */}
        <View style={styles.signOutContainer}>
          <Button
            title={t('auth.signOut')}
            onPress={signOut}
            variant="outline"
            fullWidth
          />
        </View>
      </ScrollView>
      
      {/* Theme Modal */}
      <Modal
        visible={showThemeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowThemeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.darkGray : colors.white },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? colors.white : colors.dark },
              ]}
            >
              {t('settings.theme')}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.modalOption,
                themeMode === 'light' && {
                  backgroundColor: isDark ? colors.darker : colors.lightGray,
                },
              ]}
              onPress={() => handleThemeChange('light')}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  { color: isDark ? colors.white : colors.dark },
                ]}
              >
                {t('settings.lightMode')}
              </Text>
              {themeMode === 'light' && (
                <Text style={{ color: colors.primary }}>✓</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modalOption,
                themeMode === 'dark' && {
                  backgroundColor: isDark ? colors.darker : colors.lightGray,
                },
              ]}
              onPress={() => handleThemeChange('dark')}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  { color: isDark ? colors.white : colors.dark },
                ]}
              >
                {t('settings.darkMode')}
              </Text>
              {themeMode === 'dark' && (
                <Text style={{ color: colors.primary }}>✓</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modalOption,
                themeMode === 'system' && {
                  backgroundColor: isDark ? colors.darker : colors.lightGray,
                },
              ]}
              onPress={() => handleThemeChange('system')}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  { color: isDark ? colors.white : colors.dark },
                ]}
              >
                {t('settings.systemDefault')}
              </Text>
              {themeMode === 'system' && (
                <Text style={{ color: colors.primary }}>✓</Text>
              )}
            </TouchableOpacity>
            
            <Button
              title={t('common.cancel')}
              onPress={() => setShowThemeModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
      
      {/* Language Modal */}
      <Modal
        visible={showLanguageModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.darkGray : colors.white },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? colors.white : colors.dark },
              ]}
            >
              {t('settings.language')}
            </Text>
            
            <FlatList
              data={availableLocales}
              keyExtractor={(item) => item}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.modalOption,
                    locale === item && {
                      backgroundColor: isDark ? colors.darker : colors.lightGray,
                    },
                  ]}
                  onPress={() => handleLanguageChange(item)}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      { color: isDark ? colors.white : colors.dark },
                    ]}
                  >
                    {getLocaleName(item)}
                  </Text>
                  {locale === item && (
                    <Text style={{ color: colors.primary }}>✓</Text>
                  )}
                </TouchableOpacity>
              )}
              style={styles.modalList}
            />
            
            <Button
              title={t('common.cancel')}
              onPress={() => setShowLanguageModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
      
      {/* Font Size Modal */}
      <Modal
        visible={showFontSizeModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowFontSizeModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.darkGray : colors.white },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? colors.white : colors.dark },
              ]}
            >
              {t('settings.fontSizeMultiplier')}
            </Text>
            
            <TouchableOpacity
              style={[
                styles.modalOption,
                fontSizeMultiplier === 0.85 && {
                  backgroundColor: isDark ? colors.darker : colors.lightGray,
                },
              ]}
              onPress={() => handleFontSizeChange(0.85)}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  { color: isDark ? colors.white : colors.dark, fontSize: 14 },
                ]}
              >
                {t('settings.fontSizeSmall')}
              </Text>
              {fontSizeMultiplier === 0.85 && (
                <Text style={{ color: colors.primary }}>✓</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modalOption,
                fontSizeMultiplier === 1 && {
                  backgroundColor: isDark ? colors.darker : colors.lightGray,
                },
              ]}
              onPress={() => handleFontSizeChange(1)}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  { color: isDark ? colors.white : colors.dark, fontSize: 16 },
                ]}
              >
                {t('settings.fontSizeMedium')}
              </Text>
              {fontSizeMultiplier === 1 && (
                <Text style={{ color: colors.primary }}>✓</Text>
              )}
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.modalOption,
                fontSizeMultiplier === 1.15 && {
                  backgroundColor: isDark ? colors.darker : colors.lightGray,
                },
              ]}
              onPress={() => handleFontSizeChange(1.15)}
            >
              <Text
                style={[
                  styles.modalOptionText,
                  { color: isDark ? colors.white : colors.dark, fontSize: 18 },
                ]}
              >
                {t('settings.fontSizeLarge')}
              </Text>
              {fontSizeMultiplier === 1.15 && (
                <Text style={{ color: colors.primary }}>✓</Text>
              )}
            </TouchableOpacity>
            
            <Button
              title={t('common.cancel')}
              onPress={() => setShowFontSizeModal(false)}
              variant="outline"
              style={styles.modalButton}
            />
          </View>
        </View>
      </Modal>
      
      {/* Clear Data Modal */}
      <Modal
        visible={showClearDataModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowClearDataModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[
              styles.modalContent,
              { backgroundColor: isDark ? colors.darkGray : colors.white },
            ]}
          >
            <Text
              style={[
                styles.modalTitle,
                { color: isDark ? colors.white : colors.dark },
              ]}
            >
              {t('settings.clearData')}
            </Text>
            <Text
              style={[
                styles.modalText,
                { color: isDark ? colors.lightGray : colors.gray },
              ]}
            >
              {t('settings.clearDataConfirm')}
            </Text>
            <View style={styles.modalButtons}>
              <Button
                title={t('common.cancel')}
                onPress={() => setShowClearDataModal(false)}
                variant="outline"
                style={styles.modalButton}
              />
              <Button
                title={t('common.confirm')}
                onPress={handleClearData}
                variant="danger"
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingTextContainer: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
  },
  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    marginRight: 8,
  },
  signOutContainer: {
    marginTop: 32,
    marginBottom: 24,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    borderRadius: 8,
    padding: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 24,
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  modalOptionText: {
    fontSize: 16,
  },
  modalList: {
    maxHeight: 300,
    marginBottom: 16,
  },
  modalButton: {
    marginTop: 8,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
});

export default SettingsScreen;
