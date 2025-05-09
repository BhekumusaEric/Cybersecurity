import axios from 'axios';
import { User } from '../models/index.js';
import { generateToken } from '../utils/tokenUtils.js';
import logger from '../utils/logger.js';

// Google OAuth
const googleAuth = async (code) => {
  try {
    // Exchange authorization code for tokens
    const tokenResponse = await axios.post('https://oauth2.googleapis.com/token', {
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: process.env.GOOGLE_REDIRECT_URI,
      grant_type: 'authorization_code'
    });
    
    const { access_token, id_token } = tokenResponse.data;
    
    // Get user info using access token
    const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    const { sub, email, name, picture } = userInfoResponse.data;
    
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name,
        email,
        password: '', // No password for OAuth users
        profilePicture: picture,
        role: 'student',
        provider: 'google',
        providerId: sub,
        metadata: {
          google: {
            id: sub,
            picture
          }
        }
      });
      
      logger.info(`New user created via Google OAuth: ${email}`);
    } else {
      // Update existing user
      user.provider = 'google';
      user.providerId = sub;
      user.profilePicture = picture || user.profilePicture;
      user.metadata = {
        ...user.metadata,
        google: {
          id: sub,
          picture
        }
      };
      
      await user.save();
      logger.info(`User logged in via Google OAuth: ${email}`);
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    };
  } catch (error) {
    logger.error('Google OAuth error:', error);
    throw error;
  }
};

// GitHub OAuth
const githubAuth = async (code) => {
  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: process.env.GITHUB_REDIRECT_URI
      },
      {
        headers: {
          Accept: 'application/json'
        }
      }
    );
    
    const { access_token } = tokenResponse.data;
    
    // Get user info using access token
    const userInfoResponse = await axios.get('https://api.github.com/user', {
      headers: {
        Authorization: `token ${access_token}`
      }
    });
    
    const { id, login, name: fullName, avatar_url, email: githubEmail } = userInfoResponse.data;
    
    // GitHub might not provide email, so we need to fetch it separately
    let email = githubEmail;
    
    if (!email) {
      const emailsResponse = await axios.get('https://api.github.com/user/emails', {
        headers: {
          Authorization: `token ${access_token}`
        }
      });
      
      const primaryEmail = emailsResponse.data.find(email => email.primary);
      email = primaryEmail ? primaryEmail.email : null;
      
      if (!email) {
        throw new Error('No email found in GitHub account');
      }
    }
    
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name: fullName || login,
        email,
        password: '', // No password for OAuth users
        profilePicture: avatar_url,
        role: 'student',
        provider: 'github',
        providerId: id.toString(),
        metadata: {
          github: {
            id,
            login,
            avatar_url
          }
        }
      });
      
      logger.info(`New user created via GitHub OAuth: ${email}`);
    } else {
      // Update existing user
      user.provider = 'github';
      user.providerId = id.toString();
      user.profilePicture = avatar_url || user.profilePicture;
      user.metadata = {
        ...user.metadata,
        github: {
          id,
          login,
          avatar_url
        }
      };
      
      await user.save();
      logger.info(`User logged in via GitHub OAuth: ${email}`);
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    };
  } catch (error) {
    logger.error('GitHub OAuth error:', error);
    throw error;
  }
};

// LinkedIn OAuth
const linkedinAuth = async (code) => {
  try {
    // Exchange authorization code for access token
    const tokenResponse = await axios.post(
      'https://www.linkedin.com/oauth/v2/accessToken',
      null,
      {
        params: {
          grant_type: 'authorization_code',
          code,
          redirect_uri: process.env.LINKEDIN_REDIRECT_URI,
          client_id: process.env.LINKEDIN_CLIENT_ID,
          client_secret: process.env.LINKEDIN_CLIENT_SECRET
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    const { access_token } = tokenResponse.data;
    
    // Get user profile
    const profileResponse = await axios.get('https://api.linkedin.com/v2/me', {
      headers: {
        Authorization: `Bearer ${access_token}`
      },
      params: {
        projection: '(id,firstName,lastName,profilePicture(displayImage~:playableStreams))'
      }
    });
    
    // Get user email
    const emailResponse = await axios.get('https://api.linkedin.com/v2/emailAddress?q=members&projection=(elements*(handle~))', {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    });
    
    const { id } = profileResponse.data;
    const firstName = profileResponse.data.firstName.localized[Object.keys(profileResponse.data.firstName.localized)[0]];
    const lastName = profileResponse.data.lastName.localized[Object.keys(profileResponse.data.lastName.localized)[0]];
    const fullName = `${firstName} ${lastName}`;
    
    let profilePicture = null;
    if (profileResponse.data.profilePicture && 
        profileResponse.data.profilePicture['displayImage~'] && 
        profileResponse.data.profilePicture['displayImage~'].elements) {
      const largestImage = profileResponse.data.profilePicture['displayImage~'].elements
        .reduce((largest, current) => {
          return current.data['com.linkedin.digitalmedia.mediaartifact.StillImage'].storageSize.width > 
                 largest.data['com.linkedin.digitalmedia.mediaartifact.StillImage'].storageSize.width ? 
                 current : largest;
        });
      
      profilePicture = largestImage.identifiers[0].identifier;
    }
    
    const email = emailResponse.data.elements[0]['handle~'].emailAddress;
    
    // Check if user exists
    let user = await User.findOne({ where: { email } });
    
    if (!user) {
      // Create new user
      user = await User.create({
        name: fullName,
        email,
        password: '', // No password for OAuth users
        profilePicture,
        role: 'student',
        provider: 'linkedin',
        providerId: id,
        metadata: {
          linkedin: {
            id,
            firstName,
            lastName,
            profilePicture
          }
        }
      });
      
      logger.info(`New user created via LinkedIn OAuth: ${email}`);
    } else {
      // Update existing user
      user.provider = 'linkedin';
      user.providerId = id;
      user.profilePicture = profilePicture || user.profilePicture;
      user.metadata = {
        ...user.metadata,
        linkedin: {
          id,
          firstName,
          lastName,
          profilePicture
        }
      };
      
      await user.save();
      logger.info(`User logged in via LinkedIn OAuth: ${email}`);
    }
    
    // Generate JWT token
    const token = generateToken(user);
    
    return {
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profilePicture: user.profilePicture
      }
    };
  } catch (error) {
    logger.error('LinkedIn OAuth error:', error);
    throw error;
  }
};

export {
  googleAuth,
  githubAuth,
  linkedinAuth
};
