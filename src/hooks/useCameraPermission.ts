import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

const useCameraPermission = () => {
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  const requestCameraPermission = async () => {
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
        setCameraPermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        // For iOS or other platforms, handle permission accordingly
        setCameraPermission(true); // Assume permission is granted for simplicity
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      setCameraPermission(false);
    }
  };

  useEffect(() => {
    const checkCameraPermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const status = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.CAMERA,
          );
          setCameraPermission(status);
        } else {
          // For iOS or other platforms, handle permission accordingly
          setCameraPermission(true); // Assume permission is granted for simplicity
        }
      } catch (error) {
        console.error('Error checking camera permission:', error);
        setCameraPermission(false);
      }
    };

    checkCameraPermission();
  }, []);

  return { cameraPermission, requestCameraPermission };
};

export default useCameraPermission;
