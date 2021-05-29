import * as Permissions from 'expo-permissions';
import CameraRoll from "@react-native-community/cameraroll"

export default async (index) => {
  const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
  if (status !== 'granted') {
    alert('failed to get library asset, please enable and restart demo');
    return;
  }
  const { edges } = await CameraRoll.getPhotos({ first: index + 1 });
  const assets = edges.map(({ node: { image } }) => image.uri);
  return assets[Math.min(assets.length - 1, index)];
};