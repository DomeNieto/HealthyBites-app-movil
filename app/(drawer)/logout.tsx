import React from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Alert, View } from "react-native";
import { useCallback, useEffect } from "react";
import asyncStorageService from "../../services/async-storage-service";
import { router } from "expo-router";

const LogoutScreen = () => {
  const navigation = useNavigation<any>();

  /**
   * The `useFocusEffect` hook is used to perform side effects when the screen comes into focus.
   * In this case, it shows an alert asking the user if they are sure they want to log out.
   * If the user confirms, it deletes the user token and email from async storage and navigates to the login screen.
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
