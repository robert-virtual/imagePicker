import { StatusBar } from "expo-status-bar";
import {
  useWindowDimensions,
  Image,
  Button,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState, useEffect, useRef } from "react";
import { Camera } from "expo-camera";
export default function App() {
  const [image, setImage] = useState();
  const { width } = useWindowDimensions();
  async function pickImage() {
    console.log("picking");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      presentationStyle: ImagePicker.UIImagePickerPresentationStyle.FormSheet,
    });
    if (!res.cancelled) {
      setImage(res);
    }
  }
  const [hasPermission, setHasPermission] = useState(false);
  useEffect(() => {
    (async () => {
      const res = await Camera.requestCameraPermissionsAsync();
      setHasPermission(res.granted);
    })();
  }, []);

  const [type, setType] = useState("front");
  const thiscamera = useRef();
  const [showcamara, setShowcamara] = useState(false);
  if (showcamara) {
    return hasPermission ? (
      <View>
        <Camera
          ratio="16:9"
          ref={thiscamera}
          type={type}
          style={{ height: 16 * (width / 9), width }}
        >
          <TouchableOpacity
            style={{ margin: 15 }}
            onPress={() => {
              setType((type) => (type == "front" ? "back" : "front"));
            }}
          >
            <MaterialIcons name="flip-camera-android" size={30} color="white" />
          </TouchableOpacity>
        </Camera>
        <View
          style={{
            height: "100%",
            backgroundColor: "black",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <TouchableOpacity
            onPress={async () => {
              const photo = await thiscamera.current.takePictureAsync();
              setImage(photo);
              setShowcamara(false);
            }}
          >
            <Entypo name="circle" size={100} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    ) : (
      <View style={styles.container}></View>
    );
  }
  return (
    <View style={styles.container}>
      {image ? (
        <Image source={{ uri: image.uri, width, height: width }} />
      ) : (
        <View />
      )}
      <Button title="Selecionar imagen" onPress={pickImage} />
      <Button title="Tomar Foto" onPress={() => setShowcamara(true)} />

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
