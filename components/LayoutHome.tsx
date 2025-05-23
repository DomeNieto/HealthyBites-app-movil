import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import asyncStorageService from "../services/async-storage-service";
import { cleanEmail } from "../utitlity/utility";
import userService from "../services/user-service";

const LayoutHome = () => {
  const [userName, setUserName] = useState<string>("Usuario");

  useEffect (() => {
    const getUserName = async () => {
      try {
        const emailStored = await asyncStorageService.getInfoStorage(
          asyncStorageService.KEYS.userEmail
        );
        if (!emailStored) {
          console.error("Error al obtener el email de AsyncStorage");
          return;
        }
        const email = cleanEmail(emailStored);
        if (!email) {
          console.error("Error al tipar el email");
          return;
        }
        const user = await userService.getUserByEmail(email);
        if (user) {
          setUserName(user.data.name);
        }
      } catch (error) {
        console.log(error)
      }
    }
    getUserName();
  }, [])
  
  return (
  <Text style={{ fontSize: 17, fontWeight: "bold", color: "black"}}>Hola, {userName}</Text>
);
};

export default LayoutHome;

const styles = StyleSheet.create({});
