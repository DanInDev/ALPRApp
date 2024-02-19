
import RNFS from 'react-native-fs';

export const cleanupCache = async () => {
  try {
    // Get the cache directory path
    const cacheDir = `${RNFS.CachesDirectoryPath}/vision-camera`;

    // List files in the cache directory
    const files = await RNFS.readdir(cacheDir);
    
    // Delete files
    await Promise.all(files.map((file) => deleteTemporaryFile(`${cacheDir}/${file}`)));

    console.log('Cleanup successful');
  } catch (error) {
    //console.error('Error during cleanup:', error);
  }
};

export const deleteTemporaryFile = async (filePath: string) => {
  try {
    await RNFS.unlink(filePath);
    console.log(`Deleted file: ${filePath}`);
  } catch (error) {
    console.error(`Error deleting file: ${filePath}`, error);
  }
};
