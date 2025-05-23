import React from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert, View } from "react-native";
import { useCallback, useEffect } from "react";
import asyncStorageService from "../../services/async-storage-service";
import { router } from "expo-router";

const LogoutScreen = () => {
  const navigation = useNavigation<any>();

  /**
   * The `useFocusEffect` hook is used to show an alert when the screen is focused.
   * It prompts the user to confirm if they want to log out.
   */

  useEffect(() => {
    Alert.alert("Cerrar sesión", "¿Estás seguro de que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        onPress: () => navigation.goBack(),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: async () => {
          await asyncStorageService.deleteItemStorage(asyncStorageService.KEYS.userToken);
          await asyncStorageService.deleteItemStorage(asyncStorageService.KEYS.userEmail);
          router.replace("/login");
        },
        style: "destructive",
      },
    ]);
  }, [navigation]);

  return (
    <>
    </>
  );
};

export default LogoutScreen;
