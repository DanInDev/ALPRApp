import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import useCameraPermission from '../hooks/useCameraPermission';
import useStoragePermission from '../hooks/useStoragePermission';
import { Camera, PhotoFile, useCameraDevice } from 'react-native-vision-camera';
import { cleanupCache, deleteTemporaryFile } from '../CleanupLogic';
import MlkitOcr, { MlkitOcrResult } from 'react-native-mlkit-ocr';

const ScannerScreen: React.FC = () => {
  const { cameraPermission, requestCameraPermission } = useCameraPermission();
  const { storagePermission, requestStoragePermission } = useStoragePermission();
  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
  const [ocrResult, setOcrResult] = useState<string | null>(null); // State to hold OCR result
  const cameraRef = useRef<Camera | null>(null);
  const device = useCameraDevice('back');

  useEffect(() => {
    const displayTimer = setTimeout(() => {
      setCapturedPhoto(null);
      setOcrResult(null); // Clear OCR result after 5 seconds
    }, 5000);
    return () => {
      clearTimeout(displayTimer);
    };
  }, [capturedPhoto, ocrResult]);

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
      //Take Picture
      try {
        const photo: PhotoFile = await cameraRef.current.takePhoto();
        setCapturedPhoto(photo);
                // Perform OCR on the captured photo
          try {
            const resultFromFile: MlkitOcrResult = await MlkitOcr.detectFromFile(`file://${photo.path}`);
            const ocrResult = resultFromFile.toString();
                  setOcrResult(ocrResult); // Update the OCR result state
                  console.log('SetOcrResult is: ', ocrResult)
                } catch (error) {
                  console.error('Error doing OCR:', error);
                  setOcrResult(null); // Clear OCR result on error
                }
                
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
      {ocrResult && (
        <View style={styles.ocrResultContainer}>
          <Text style={styles.ocrResultText}>{ocrResult}</Text>
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
  ocrResultContainer: {
    position: 'absolute',
    top: 150, // Adjust the position as needed
    alignSelf: 'center',
  },
  ocrResultText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ScannerScreen;
