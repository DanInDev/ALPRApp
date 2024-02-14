import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image } from 'react-native';
import useCameraPermission from '../hooks/useCameraPermission';
import useStoragePermission from '../hooks/useStoragePermission';
import {
  Camera,
  PhotoFile,
  useCameraDevice,
} from 'react-native-vision-camera';
import RNFS from 'react-native-fs';

const ScannerScreen: React.FC = () => {
  const { cameraPermission, requestCameraPermission } = useCameraPermission();
  const { storagePermission, requestStoragePermission } = useStoragePermission();

  const [isTakingPicture, setIsTakingPicture] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState<PhotoFile | null>(null);
  const cameraRef = useRef<Camera | null>(null);

  const device = useCameraDevice('back');

  useEffect(() => {
    const displayTimer = setTimeout(() => {
      setCapturedPhoto(null); // Clear the captured photo after 5 seconds
    }, 5000);

    return () => {
      clearTimeout(displayTimer); // Clear the timer when the component is unmounted
    };
  }, [capturedPhoto]);

  useEffect(() => {
    return () => {
      // Clean up resources when the component is unmounted
      if (capturedPhoto) {
        // Perform cleanup, e.g., delete the temporary file
        // You might want to handle this according to your use case
        deleteTemporaryFile(capturedPhoto.path);
      }
    };
  }, [capturedPhoto]);

  useEffect(() => {
    // Set up cleanup interval every 5 seconds
    const cleanupInterval = setInterval(() => {
      cleanupCache();
    }, 5000);

    // Don't forget to clear the interval when the component unmounts
    return () => clearInterval(cleanupInterval);
  }, []);

  const cleanupCache = async () => {
    try {
      // Get the cache directory path
      const cacheDir = `${RNFS.CachesDirectoryPath}/vision-camera`;

      // List files in the cache directory
      const files = await RNFS.readdir(cacheDir);

      // Filter and delete files based on your criteria (e.g., old files)
      const filesToDelete = files.filter((file) => {
        // Implement your criteria for deciding which files to delete
        return /* Your criteria here */;
      });

      // Delete files
      await Promise.all(filesToDelete.map((file) => deleteTemporaryFile(`${cacheDir}/${file}`)));

      console.log('Cleanup successful');
    } catch (error) {
      console.error('Error during cleanup:', error);
    }
  };

  const deleteTemporaryFile = async (filePath: string) => {
    try {
      await RNFS.unlink(filePath);
      console.log(`Deleted file: ${filePath}`);
    } catch (error) {
      console.error(`Error deleting file: ${filePath}`, error);
    }
  };

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
        console.log('Photo taken:', photo);

        // Save the photo to the state to display it
        setCapturedPhoto(photo);
      } catch (error) {
        console.error('Error taking photo:', error);
      } finally {
        setIsTakingPicture(false);
      }
    }
  };

  if (!cameraPermission /*|| !storagePermission */) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>
          {cameraPermission === false && 'Camera Permission Denied'}
          {storagePermission === false && 'Storage Permission Denied'} 
        </Text>
        <Button title="Request Camera Permission" onPress={handleRequestCameraPermission} />
        <Button title="Request Storage Permission" onPress={handleRequestStoragePermission} />
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
      <Camera
        ref={cameraRef}
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={true}
        photo={true}
      />
      {capturedPhoto && (
        <View style={styles.previewContainer}>
          <Image style={styles.previewImage} source={{ uri: `file://${capturedPhoto.path}` }} />
        </View>
      )}
      <TouchableOpacity
        style={styles.takePictureButton}
        onPress={handleTakePicture}
        disabled={isTakingPicture}
      >
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
