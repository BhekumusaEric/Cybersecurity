# App Store Accounts Setup Guide

This guide provides step-by-step instructions for setting up Apple Developer and Google Play Developer accounts for the Ethical Hacking LMS mobile app.

## Apple Developer Program

### 1. Prerequisites

- Apple ID
- Valid credit card
- Legal entity information (if enrolling as an organization)
- DUNS number (for organizations)

### 2. Enrollment Process

1. **Visit the Apple Developer website**
   - Go to [developer.apple.com](https://developer.apple.com)
   - Click "Account" and sign in with your Apple ID

2. **Enroll in the Apple Developer Program**
   - Click "Enroll" in the top-right corner
   - Choose between Individual or Organization enrollment
   - For Individual: Provide personal information
   - For Organization: Provide company information, DUNS number, and legal documents

3. **Complete the enrollment form**
   - Fill out all required fields
   - Agree to the Apple Developer Program License Agreement
   - Pay the annual fee ($99 USD)

4. **Verification**
   - For Individual: Verification is usually quick
   - For Organization: Apple will verify your organization's information, which may take several days

### 3. App Store Connect Setup

1. **Access App Store Connect**
   - Go to [appstoreconnect.apple.com](https://appstoreconnect.apple.com)
   - Sign in with your Apple Developer account

2. **Create a new app**
   - Click "My Apps"
   - Click the "+" button and select "New App"
   - Fill out the required information:
     - Platforms: iOS, iPadOS
     - Name: Ethical Hacking LMS
     - Primary language: English
     - Bundle ID: com.ethicalhackinglms.app
     - SKU: EHLMS2023
     - User Access: Full Access

3. **Set up app information**
   - Navigate to the newly created app
   - Fill out the App Information section:
     - Privacy Policy URL: https://ethicalhackinglms.com/privacy
     - Category: Education
     - Content Rights: Select appropriate option

### 4. Certificates and Identifiers

1. **Create App ID**
   - Go to [developer.apple.com/account/resources/identifiers/list](https://developer.apple.com/account/resources/identifiers/list)
   - Click the "+" button
   - Select "App IDs" and click "Continue"
   - Select "App" and click "Continue"
   - Fill out the form:
     - Description: Ethical Hacking LMS
     - Bundle ID: com.ethicalhackinglms.app
     - Capabilities: Select required capabilities (Push Notifications, etc.)
   - Click "Continue" and then "Register"

2. **Create Distribution Certificate**
   - Go to [developer.apple.com/account/resources/certificates/list](https://developer.apple.com/account/resources/certificates/list)
   - Click the "+" button
   - Select "iOS Distribution (App Store and Ad Hoc)" and click "Continue"
   - Follow the instructions to create a Certificate Signing Request (CSR) using Keychain Access
   - Upload the CSR file and click "Continue"
   - Download the certificate and double-click to install it in Keychain Access

3. **Create Provisioning Profile**
   - Go to [developer.apple.com/account/resources/profiles/list](https://developer.apple.com/account/resources/profiles/list)
   - Click the "+" button
   - Select "App Store" and click "Continue"
   - Select your App ID and click "Continue"
   - Select your distribution certificate and click "Continue"
   - Enter a name (e.g., "Ethical Hacking LMS App Store") and click "Generate"
   - Download the provisioning profile

## Google Play Developer Account

### 1. Prerequisites

- Google account
- Valid credit card
- Legal entity information (if registering as an organization)

### 2. Registration Process

1. **Visit the Google Play Console**
   - Go to [play.google.com/console/signup](https://play.google.com/console/signup)
   - Sign in with your Google account

2. **Accept the Developer Agreement**
   - Read and accept the Google Play Developer Distribution Agreement

3. **Pay the registration fee**
   - Pay the one-time registration fee ($25 USD)

4. **Complete account details**
   - Fill out your developer account details:
     - Developer name: Ethical Hacking LMS
     - Contact information: Your email and phone number
     - Developer website: https://ethicalhackinglms.com

### 3. Google Play Console Setup

1. **Create a new app**
   - In the Google Play Console, click "Create app"
   - Fill out the form:
     - App name: Ethical Hacking LMS
     - Default language: English
     - App or game: App
     - Free or paid: Free
     - Declarations: Complete as required

2. **Set up app information**
   - Navigate to "Store presence" > "Store listing"
   - Fill out all required fields:
     - Short description
     - Full description
     - Screenshots
     - Feature graphic
     - App icon
     - Content rating
     - Contact details

3. **Content rating**
   - Navigate to "Store presence" > "Content rating"
   - Complete the content rating questionnaire
   - Submit for rating

4. **Pricing & distribution**
   - Navigate to "Store presence" > "Pricing & distribution"
   - Select countries for distribution
   - Set the app as free
   - Confirm compliance with export laws
   - Confirm the app does not contain ads (if applicable)

### 4. App Signing

1. **Generate upload key**
   - Use the following command to generate a keystore:
     ```bash
     keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload
     ```
   - Remember the keystore password and key password

2. **Configure app signing**
   - Navigate to "Setup" > "App integrity"
   - Choose "Export and upload a key from Java keystore"
   - Upload your keystore file
   - Enter your key alias and passwords

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
   - Create a secure password for your Match repository

5. **MATCH_GIT_URL**
   - Create a private repository for Match
   - Copy the repository URL

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
   - Copy your key alias

4. **ANDROID_KEY_PASSWORD**
   - Copy your key password

5. **GOOGLE_PLAY_SERVICE_ACCOUNT_JSON**
   - Create a service account in the Google Cloud Console
   - Generate a JSON key
   - Copy the contents of the JSON file

## Next Steps

After setting up your app store accounts and configuring the necessary certificates and keys, you can proceed with:

1. **Generating app assets**
   ```bash
   npm run prepare:appstore
   ```

2. **Building and testing the app**
   ```bash
   npm run build:ios
   npm run build:android
   ```

3. **Deploying to beta channels**
   ```bash
   npm run deploy:ios:beta
   npm run deploy:android:beta
   ```

4. **Submitting for review**
   - After testing in beta channels, use the app store consoles to submit for review
   - Or use the automated deployment:
     ```bash
     npm run deploy:ios:release
     npm run deploy:android:release
     ```
