import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import { Link } from "expo-router";
import { loadFonts } from "../assets/fonts/fonts";
import ModalRegistro from "./registry";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false); 

  useEffect(() => {
    loadFonts().then(() => setFontsLoaded(true));
  }, []);

  if (!fontsLoaded) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenido a</Text>
      <Text style={styles.header}>Healthy{"\n"}Bites.</Text>

      <View style={styles.textContainer}>
        <Text style={styles.description}>
          Crea un plan de recetas adaptadas a tu cuerpo y estilo de vida!
        </Text>
        <Text style={styles.description}>Hablanos sobre ti ...</Text>
      </View>

      <Pressable style={styles.button} onPress={() => setShowModal(true)}>
        <Text style={styles.buttonText}>Comienza Ahora</Text>
      </Pressable>

      <Link href="../login" style={styles.link}>
        Ya Tengo Cuenta
      </Link>

      {showModal && <ModalRegistro onClose={() => setShowModal(false)} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "InstrumentSans-Regular",
    marginBottom: 10,
    marginTop: 50,
  },
  header: {
    fontSize: 45,
    fontFamily: "InstrumentSans-Bold",
    marginBottom: 80,
  },
  textContainer: {
    marginBottom: 60,
  },
  description: {
    fontSize: 24,
    fontFamily: "InstrumentSans-Regular",
    marginLeft: 90,
    textAlign: "right",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#723694",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginBottom: 20,
    alignSelf: "center",
    color: "#fff",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 16,
  },
  buttonText: {
    alignSelf: "center",
    fontFamily: "InstrumentSans-Bold",
    color: "#fff",
    fontSize: 16,
  },
  link: {
    fontFamily: "InstrumentSans-Bold",
    color: "#723694",
    fontSize: 16,
    textDecorationLine: "underline",
    alignSelf: "center",
  },
});
