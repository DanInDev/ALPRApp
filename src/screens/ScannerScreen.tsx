// src/screens/ScannerScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useCameraPermission from '../hooks/useCameraPermission';
import {
  Camera,
  CameraProps,
  CameraRuntimeError,
  PhotoFile,
  useCameraDevice,
  useCameraFormat,
  useFrameProcessor,
  VideoFile,
} from 'react-native-vision-camera';

const ScannerScreen: React.FC = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');

  useEffect(() => {
    if (hasPermission) {
      // You can start additional camera-related setup here if needed
    }
  }, [hasPermission]);

  const handleRequestPermission = () => {
    requestPermission();
  };

  if (!hasPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Camera Permission Denied</Text>
        <Button title="Request Camera Permission" onPress={handleRequestPermission} />
      </View>
    );
  }

  if (device == null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>No Camera Device Found</Text>
      </View>
    );
  }

  return (
    <Camera
      style={StyleSheet.absoluteFill}
      device={device}
      isActive={true}
      // Additional camera props can be added here
    />
  );
};

export default ScannerScreen;
