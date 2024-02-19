import { StyleSheet } from 'react-native';

export const scannerScreen = StyleSheet.create({
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