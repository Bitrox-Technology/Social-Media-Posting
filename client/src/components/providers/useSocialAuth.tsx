// useSocialAuth.tsx
import { useEffect } from 'react';

// Define types for the authentication functions
type AuthFunction = () => Promise<{ statusCode: number; data: { authUrl: string } }>;

// Define the shape of the auth status state
interface AuthStatus {
  linkedin: boolean;
  facebook: boolean;
  instagram: boolean;
}

// Define the props for the useSocialAuth hook
interface UseSocialAuthProps {
  authLinkedIn: AuthFunction;
  authFacebook: AuthFunction;
  authInstagram: AuthFunction;
  setIsAuthenticating: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useSocialAuth = ({
  authLinkedIn,
  authFacebook,
  authInstagram,
  setIsAuthenticating,
}: UseSocialAuthProps) => {

  const initiateAuth = async (platform: keyof AuthStatus) => {
    try {
      setIsAuthenticating(true);
      let authUrl: string;

      if (platform === 'linkedin') {
        const response = await authLinkedIn();
        authUrl = response.data.authUrl;
      } else if (platform === 'facebook') {
        const response = await authFacebook();
        authUrl = response.data.authUrl;
      } else if (platform === 'instagram') {
        const response = await authInstagram();
        authUrl = response.data.authUrl;
      } else {
        throw new Error('Unsupported platform');
      }

      if (!authUrl) {
        throw new Error('Authentication URL not received');
      }

      const width = 600;
      const height = 700;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;

      const authWindow = window.open(
        authUrl,
        `${platform}-auth-popup`,
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!authWindow || authWindow.closed || typeof authWindow.closed === 'undefined') {
        setIsAuthenticating(false);
        alert('Popup blocked! Please allow popups for this site to login.');
        return;
      }

      // Monitor popup closure as a fallback
      const checkPopupClosed = setInterval(() => {
        if (authWindow.closed) {
          clearInterval(checkPopupClosed);
          setIsAuthenticating(false);
        }
      }, 1000);
    } catch (err) {
      console.error(`Error initiating ${platform} auth:`, err);
      alert(`Failed to initiate ${platform} authentication`);
      setIsAuthenticating(false);
    }
  };

  return { initiateAuth };
};