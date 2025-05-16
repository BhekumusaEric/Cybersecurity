# Signing Certificates Guide

This guide provides detailed instructions for generating and configuring signing certificates for both iOS and Android platforms.

## iOS Certificates and Provisioning Profiles

### Using Fastlane Match (Recommended)

Fastlane Match is a tool that helps you manage iOS certificates and provisioning profiles across your team. It stores your certificates in a Git repository, encrypted with a password.

#### 1. Set Up Match Repository

1. **Create a private Git repository**
   - Create a new private repository on GitHub, GitLab, or Bitbucket
   - Name it something like `ios-certificates`

2. **Initialize Match**
   ```bash
   cd src/mobile
   bundle exec fastlane match init
   ```
   - Select Git as the storage mode
   - Enter the URL of your private repository
   - Choose a strong password for encryption

#### 2. Generate Development Certificates

```bash
cd src/mobile
bundle exec fastlane match development
```

This will:
- Generate a development certificate if one doesn't exist
- Generate a development provisioning profile for your app
- Install the certificate and profile on your local machine

#### 3. Generate Distribution Certificates

```bash
cd src/mobile
bundle exec fastlane match appstore
```

This will:
- Generate a distribution certificate if one doesn't exist
- Generate an App Store provisioning profile for your app
- Install the certificate and profile on your local machine

#### 4. Configure Fastfile

The Fastfile is already configured to use Match for certificate management. Make sure the bundle identifier in the Fastfile matches your app's bundle identifier.

### Manual Certificate Management

If you prefer to manage certificates manually, follow these steps:

#### 1. Generate Certificate Signing Request (CSR)

1. **Open Keychain Access**
   - On your Mac, open Keychain Access (Applications > Utilities > Keychain Access)

2. **Create a CSR**
   - Go to Keychain Access > Certificate Assistant > Request a Certificate from a Certificate Authority
   - Enter your email address and name
   - Select "Saved to disk" and click Continue
   - Save the CSR file

#### 2. Create Development Certificate

1. **Go to Apple Developer Portal**
   - Visit [developer.apple.com/account/resources/certificates/list](https://developer.apple.com/account/resources/certificates/list)
   - Click the "+" button

2. **Select Certificate Type**
   - Choose "iOS App Development" and click Continue

3. **Upload CSR**
   - Upload the CSR file you created earlier
   - Click Continue and then Download

4. **Install Certificate**
   - Double-click the downloaded certificate to install it in Keychain Access

#### 3. Create Distribution Certificate

1. **Go to Apple Developer Portal**
   - Visit [developer.apple.com/account/resources/certificates/list](https://developer.apple.com/account/resources/certificates/list)
   - Click the "+" button

2. **Select Certificate Type**
   - Choose "iOS Distribution (App Store and Ad Hoc)" and click Continue

3. **Upload CSR**
   - Upload the CSR file you created earlier
   - Click Continue and then Download

4. **Install Certificate**
   - Double-click the downloaded certificate to install it in Keychain Access

#### 4. Create Provisioning Profiles

1. **Development Provisioning Profile**
   - Go to [developer.apple.com/account/resources/profiles/list](https://developer.apple.com/account/resources/profiles/list)
   - Click the "+" button
   - Select "iOS App Development" and click Continue
   - Select your App ID and click Continue
   - Select your development certificate and click Continue
   - Select devices and click Continue
   - Enter a name (e.g., "Ethical Hacking LMS Development") and click Generate
   - Download and install the profile

2. **Distribution Provisioning Profile**
   - Go to [developer.apple.com/account/resources/profiles/list](https://developer.apple.com/account/resources/profiles/list)
   - Click the "+" button
   - Select "App Store" and click Continue
   - Select your App ID and click Continue
   - Select your distribution certificate and click Continue
   - Enter a name (e.g., "Ethical Hacking LMS App Store") and click Generate
   - Download and install the profile

## Android Signing Keys

### Generate Signing Key

1. **Generate Keystore**
   ```bash
   keytool -genkey -v -keystore ethical-hacking-lms.keystore -alias upload -keyalg RSA -keysize 2048 -validity 10000
   ```
   - Enter a secure password when prompted
   - Fill in the required information (name, organization, etc.)
   - Remember the keystore password and key password

2. **Move Keystore to Android Directory**
   ```bash
   mkdir -p src/mobile/android/app
   cp ethical-hacking-lms.keystore src/mobile/android/app/upload-keystore.jks
   ```

### Configure Gradle for Signing

1. **Create key.properties File**
   ```bash
   cd src/mobile/android
   touch key.properties
   ```

2. **Add Signing Configuration**
   Edit the `key.properties` file and add:
   ```
   storePassword=YOUR_KEYSTORE_PASSWORD
   keyPassword=YOUR_KEY_PASSWORD
   keyAlias=upload
   storeFile=upload-keystore.jks
   ```
   Replace `YOUR_KEYSTORE_PASSWORD` and `YOUR_KEY_PASSWORD` with your actual passwords.

3. **Update build.gradle**
   The project's `build.gradle` file is already configured to use the signing configuration from `key.properties`.

### Google Play App Signing

Google Play App Signing is a service that securely manages your app's signing key. It's recommended for production apps.

1. **Opt in to Google Play App Signing**
   - In the Google Play Console, go to your app
   - Navigate to Setup > App integrity
   - Click "Opt in to app signing by Google Play"

2. **Upload Your Signing Key**
   - Choose "Export and upload a key from Java keystore"
   - Upload your keystore file
   - Enter your key alias and passwords

3. **Save the Upload Key**
   - Google Play will generate a new upload key
   - Download and securely store this key
   - Update your `key.properties` file with the new upload key information

## Setting Up GitHub Secrets for CI/CD

To enable automated deployment through GitHub Actions, add the following secrets to your GitHub repository:

### For iOS:

1. **APPLE_API_KEY_ID**
   - Generate an App Store Connect API Key in the App Store Connect portal
   - Copy the Key ID

2. **APPLE_API_KEY_ISSUER_ID**
   - From the App Store Connect API Key page, copy the Issuer ID

3. **APPLE_API_KEY_CONTENT**
   - Download the API Key file (.p8)
   - Copy the contents of the file

4. **MATCH_PASSWORD**
   - Use the password you created for your Match repository

5. **MATCH_GIT_URL**
   - Use the URL of your private Match repository

6. **FASTLANE_APPLE_APPLICATION_SPECIFIC_PASSWORD**
   - Generate an app-specific password for your Apple ID
   - Copy the password

### For Android:

1. **ANDROID_KEYSTORE_BASE64**
   - Convert your keystore file to base64:
     ```bash
     base64 -i upload-keystore.jks
     ```
   - Copy the output

2. **ANDROID_KEYSTORE_PASSWORD**
   - Copy your keystore password

3. **ANDROID_KEY_ALIAS**
   - Copy your key alias (usually "upload")

4. **ANDROID_KEY_PASSWORD**
   - Copy your key password

5. **GOOGLE_PLAY_SERVICE_ACCOUNT_JSON**
   - Create a service account in the Google Cloud Console
   - Generate a JSON key
   - Copy the contents of the JSON file

## Troubleshooting

### Common iOS Certificate Issues

1. **Certificate Already Exists**
   - If you get an error that a certificate already exists, try:
     ```bash
     bundle exec fastlane match nuke development
     bundle exec fastlane match nuke distribution
     ```
   - Then regenerate the certificates

2. **Provisioning Profile Errors**
   - If you get errors about provisioning profiles, try:
     ```bash
     bundle exec fastlane match development --force
     bundle exec fastlane match appstore --force
     ```

3. **Keychain Access Issues**
   - If you have issues with Keychain Access, try:
     ```bash
     security unlock-keychain -p YOUR_PASSWORD ~/Library/Keychains/login.keychain
     ```

### Common Android Signing Issues

1. **Keystore Not Found**
   - Make sure the keystore file is in the correct location
   - Check that the path in `key.properties` is correct

2. **Invalid Keystore Format**
   - If you get an error about invalid keystore format, try:
     ```bash
     keytool -list -v -keystore upload-keystore.jks
     ```
   - If this command fails, your keystore may be corrupted

3. **Wrong Password**
   - Double-check your keystore and key passwords
   - Make sure they match what's in `key.properties`

## Security Best Practices

1. **Never commit signing keys to version control**
   - Add `*.jks`, `*.keystore`, `key.properties`, and `*.p8` to your `.gitignore` file

2. **Securely back up your signing keys**
   - Store backups in a secure location
   - Consider using a password manager for passwords

3. **Limit access to signing keys**
   - Only share keys with team members who need them
   - Use Match for iOS to manage access

4. **Rotate keys if compromised**
   - If you suspect a key has been compromised, generate a new one
   - For iOS, use Match to manage the rotation
   - For Android, use Google Play App Signing to handle key rotation
