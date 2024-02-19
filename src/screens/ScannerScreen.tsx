import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import useCameraPermission from '../hooks/useCameraPermission';
import useStoragePermission from '../hooks/useStoragePermission';
import { Camera, PhotoFile, useCameraDevice } from 'react-native-vision-camera';
import { cleanupCache, deleteTemporaryFile } from '../CleanupLogic';

const ScannerScreen: React.FC = () => {
  const { cameraPermission, requestCameraPermission } = useCameraPermission();
  const { storagePermission, requestStoragePermission } = useStoragePermission();
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
  const cameraRef = useRef<Camera | null>(null);
  const device = useCameraDevice('back');

  useEffect(() => {
    const displayTimer = setTimeout(() => {
      setCapturedPhoto(null);
    }, 5000);
    return () => {
      clearTimeout(displayTimer);
    };
  }, [capturedPhoto]);

  useEffect(() => {
    return () => {
      if (capturedPhoto) {
        deleteTemporaryFile(capturedPhoto.path);
      }
    };
  }, [capturedPhoto]);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      cleanupCache();
    }, 5000);
    return () => clearInterval(cleanupInterval);
  }, []);

  const handleRequestCameraPermission = () => {
    requestCameraPermission();
  };

  const handleRequestStoragePermission = () => {
    requestStoragePermission();
  };

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      setIsTakingPicture(true);
      try {
        const photo: PhotoFile = await cameraRef.current.takePhoto();
        setCapturedPhoto(photo);
      } catch (error) {
        console.error('Error taking photo:', error);
      } finally {
        setIsTakingPicture(false);
      }
    }
  };

  if (!cameraPermission) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{cameraPermission === false && 'Camera Permission Denied'}</Text>
        <Button title="Request Camera Permission" onPress={handleRequestCameraPermission} />
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
    <View style={{ flex: 1 }}>
      <Camera ref={cameraRef} style={StyleSheet.absoluteFill} device={device} isActive={true} photo={true} />
      {capturedPhoto && (
        <View style={styles.previewContainer}>
          <Image style={styles.previewImage} source={{ uri: `file://${capturedPhoto.path}` }} />
        </View>
      )}
      <TouchableOpacity style={styles.takePictureButton} onPress={handleTakePicture} disabled={isTakingPicture}>
        <Text style={styles.takePictureButtonText}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  takePictureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  takePictureButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  previewContainer: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
  },
  previewImage: {
    width: 100,
    height: 100,
    borderRadius: 5,
  },
});

export default ScannerScreen;