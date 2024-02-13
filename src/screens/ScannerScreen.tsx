import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import useCameraPermission from '../hooks/useCameraPermission';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import MlkitOcr, { MlkitOcrResult } from 'react-native-mlkit-ocr';

const ScannerScreen: React.FC = () => {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice('back');
  const [ocrResult, setOcrResult] = useState<string | null>(null);

  const cameraRef = useRef<Camera>(null);

  useEffect(() => {
    if (hasPermission) {
      performOcr(); // Initial capture and OCR
    }
  }, [hasPermission]);

  // Capture an image and perform OCR every second
  useEffect(() => {
    const intervalId = setInterval(async () => {
      await performOcr();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [hasPermission]);

  const performOcr = async () => {
    if (device && cameraRef.current) {
      try {
        // Take photo with Vision Camera
        const photo = await cameraRef.current.takePhoto();
        await CameraRoll.save(`file://${file.path}`, {
          type: 'photo',
        })
        // Get Photo data
        const photoPath = await fetch (`file://${photo.path}`)

      
        const result = await MlkitOcr.detectFromFile(photoPath);
        const textResult = result
          .map((block) => block.lines.map((line: { text: any; }) => line.text).join(' '))
          .join('\n');
        setOcrResult(textResult);
      } catch (error) {
        console.error('Error during OCR:', error);
      }
    }
  };
  

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
    <View style={{ flex: 1 }}>
      <Camera ref={cameraRef} style={StyleSheet.absoluteFill} device={device} isActive={true} />
      {ocrResult && (
        <View style={styles.bottomView}>
          <Text style={styles.bottomText}>{ocrResult}</Text>
        </View>
      )}
      <View style={styles.captureButtonContainer}>
        <Button title="Capture" onPress={performOcr} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomView: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomText: {
    fontSize: 18,
    color: 'white',
  },
  captureButtonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default ScannerScreen;
