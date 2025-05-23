import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Button, Pressable } from "react-native";
import { Link } from "expo-router";
import { loadFonts } from "../assets/fonts/fonts";
import ModalRegistro from "./registry";
import asyncStorageService from "../services/async-storage-service";
import { router } from "expo-router";
import { get } from "axios";

export default function App() {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);

/* The `useEffect` hook in the provided code snippet is used to perform side effects in a functional
component. In this case, the `useEffect` hook is being used to load fonts asynchronously and check
for a user token in the async storage. */
  useEffect(() => {
    const loadFont = async () => {
      try {
        await loadFonts();
        const token = await asyncStorageService.getInfoStorage(asyncStorageService.KEYS.userToken);
        if (token) {
          router.replace("/(drawer)/home");
        }
        setFontsLoaded(true);
      } catch (error) {
        console.error("Error loading fonts or when get inforation user:", error);
      }
    }
    loadFont();
  }, []);

  /**
   * The `handleLogin` function is responsible for handling the login process. It retrieves the user
   * token from async storage and navigates to the home screen if the token exists.
   */
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Cargando...</Text>
      </View>
    );
  }
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

      <Link href="./login" style={styles.link}>
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
