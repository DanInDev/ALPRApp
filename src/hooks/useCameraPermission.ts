import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  const requestPermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs access to your camera.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          setHasPermission(true);
        } else {
          setHasPermission(false);
        }
      } else {
        // For iOS or other platforms, handle permission accordingly
        setHasPermission(true); // Assume permission is granted for simplicity
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setHasPermission(false);
    }
  };

  useEffect(() => {
    const checkPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const status = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          setHasPermission(status);
        } else {
          // For iOS or other platforms, handle permission accordingly
          setHasPermission(true); // Assume permission is granted for simplicity
        }
      } catch (error) {
        console.error('Error checking camera permission:', error);
        setHasPermission(false);
      }
    };

    checkPermission();
  }, []);

  return { hasPermission, requestPermission };
};

export default useCameraPermission;
