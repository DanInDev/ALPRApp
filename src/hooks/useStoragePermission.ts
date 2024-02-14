import { useState, useEffect } from 'react';
import { PermissionsAndroid, Platform } from 'react-native';

const useStoragePermission = () => {
  const [storagePermission, setStoragePermission] = useState<boolean | null>(null);

  const requestStoragePermission = async () => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission',
            message: 'App needs access to your storage for saving pictures.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        setStoragePermission(granted === PermissionsAndroid.RESULTS.GRANTED);
      } else {
        // For iOS or other platforms, handle permission accordingly
        setStoragePermission(true); // Assume permission is granted for simplicity
      }
    } catch (error) {
      console.error('Error requesting storage permission:', error);
      setStoragePermission(false);
    }
  };

  useEffect(() => {
    const checkStoragePermission = async () => {
      try {
        if (Platform.OS === 'android') {
          const status = await PermissionsAndroid.check(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          );
          setStoragePermission(status);
        } else {
          // For iOS or other platforms, handle permission accordingly
          setStoragePermission(true); // Assume permission is granted for simplicity
        }
      } catch (error) {
        console.error('Error checking storage permission:', error);
        setStoragePermission(false);
      }
    };

    checkStoragePermission();
  }, []);

  return { storagePermission, requestStoragePermission };
};

export default useStoragePermission;
