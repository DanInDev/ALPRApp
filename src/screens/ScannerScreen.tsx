import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import useCameraPermission from '../hooks/useCameraPermission';
// import useStoragePermission from '../hooks/useStoragePermission';
import {Camera, PhotoFile, useCameraDevice} from 'react-native-vision-camera';
import {cleanupCache, deleteTemporaryFile} from '../CleanupLogic';
import {scannerScreen} from '../styleSheets/scannerScreen'; // Import styles

import MlkitOcr, {MlkitOcrResult} from 'react-native-mlkit-ocr';

const ScannerScreen: React.FC = () => {
  const {cameraPermission, requestCameraPermission} = useCameraPermission();
  // const { storagePermission, requestStoragePermission } = useStoragePermission();
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

  const handleTakePicture = async () => {
    if (cameraRef.current) {
      setIsTakingPicture(true);
      //Take Picture
      try {
        const photo: PhotoFile = await cameraRef.current.takePhoto();
        setCapturedPhoto(photo);
        // Perform OCR on the captured photo
        try {
          const resultFromFile: MlkitOcrResult = await MlkitOcr.detectFromFile(
            `file://${photo.path}`,
          );

          // Process OCR result to obtain a readable string
          const recognizedText = resultFromFile
            .map(block => {
              const linesText = block.lines.map(line => line.text).join('\n');
              return `${linesText}\n`;
            })
            .join('\n');

          setOcrResult(recognizedText); // Update the OCR result state
          console.log('SetOcrResult is:', recognizedText);

          setOcrResult(ocrResult); // Update the OCR result state
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

  // Case if the camera does not have permission
  if (!cameraPermission) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>{cameraPermission === false && 'Camera Permission Denied'}</Text>
        <Button
          title="Request Camera Permission"
          onPress={handleRequestCameraPermission}
        />
      </View>
    );
  }

  // Case if no camera device was found
  if (device == null) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>No Camera Device Found</Text>
      </View>
    );
  }

  return (
    <View style={{flex: 1}}>
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      {capturedPhoto && (
        <View style={scannerScreen.previewContainer}>
          <Image
            style={scannerScreen.previewImage}
            source={{uri: `file://${capturedPhoto.path}`}}
          />
        </View>
      )}
      {ocrResult && (
        <View style={scannerScreen.ocrResultContainer}>
          <Text style={scannerScreen.ocrResultText}>{ocrResult}</Text>
        </View>
      )}
      <TouchableOpacity
        style={scannerScreen.takePictureButton}
        onPress={handleTakePicture}
        disabled={isTakingPicture}>
        <Text style={scannerScreen.takePictureButtonText}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ScannerScreen;
