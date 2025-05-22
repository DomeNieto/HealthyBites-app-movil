import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import asyncStorageService from "../../services/async-storage-service";
import { InfoUser } from "../../types/info-user";
import { InfoAdvice } from "../../types/info-advice";
import { useNavigation } from "expo-router";
import userService from "../../services/user-service";
import adviceService from "../../services/advice-service";

const BAR_WIDTH = 300;

const HomePage = () => {
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const [advices, setAdvices] = useState<InfoAdvice[]>([]);
  const [userName, setUserName] = useState<string>("Usuario");
  const navigation = useNavigation();
  const IMC_MIN = 10;
  const IMC_MAX = 40;

/* The `useLayoutEffect` hook in the provided code snippet is used to set the options for the
navigation header in a React Native application. */

  useEffect(() => {
    const fetchAdvices = async () => {
      const adviceList = await adviceService.getAllAdvice();
      console.log("Lista de consejos:", adviceList);
      setAdvices(adviceList);
    };
    
    fetchAdvices();
  }, []);
  

  useEffect(() => { 
    const fetchUserData = async () => {
      const email = await asyncStorageService.getUser(asyncStorageService.KEYS.userEmail);
      const cleanEmail = email?.replace(/^"(.*)"$/, "$1");

      if (!cleanEmail) {
        console.error("Email no encontrado en AsyncStorage");
        return;
      }

      const userRes = await userService.getUserByEmail(cleanEmail);
      setUserData(userRes.data);
      setUserName(userRes.data.name);
    };

    fetchUserData();
  }, []);

 
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={{ fontSize: 17, fontWeight: "bold", color: "black" }}>Hola, {userName}</Text>,
    });
  }, [navigation, userName]);
  
  /* The `useEffect` hook in the provided code snippet is responsible for fetching user data and advice
  data when the `HomePage` component mounts for the first time. Here's a breakdown of what the
  `useEffect` is doing: */

  /* The `weight` and `height` variables extract the user's weight and height from the `userData`
  object. If the values are not available, they default to 0*/

  const weight = userData?.infoUser?.weight ?? 0;
  /* The `height` variable extracts the user's height from the `userData` object. If the value is not
  available, it defaults to 1. */
  const height = userData?.infoUser?.height ?? 1;

  /* The `bmiValue` variable calculates the Body Mass Index (BMI) using the formula weight / height^2,
  where weight is in kilograms and height is in meters. */
  const bmiValue = height > 0 ? weight / (height / 100) ** 2 : 0;
  /* The `bmi` variable formats the BMI value to one decimal place using the `toFixed` method. */
  const bmi = bmiValue.toFixed(1);

/**
 * The function `getBmiCategory` categorizes a BMI value into different weight categories based on
 * specific ranges.
 * @param {number} bmiVal - The `bmiVal` parameter in the `getBmiCategory` function represents the Body
 * Mass Index (BMI) value that is used to determine the weight category of a person based on their
 * height and weight. The function categorizes the BMI value into different weight categories such as
 * "Bajo peso
 * @returns The function `getBmiCategory` returns a string value representing the BMI category based on
 * the input BMI value. The possible return values are "Bajo peso" (Underweight), "Peso Saludable"
 * (Healthy weight), "Sobrepeso" (Overweight), or "Obesidad" (Obesity).
 */
  const getBmiCategory = (bmiVal: number) => {
    if (bmiVal < 18.5) return "Bajo peso";
    if (bmiVal < 25) return "Peso Saludable";
    if (bmiVal < 30) return "Sobrepeso";
    return "Obesidad";
  };

/**
 * The function `getBmiImage` returns an image based on the BMI value provided as input.
 * @param {number} bmiVal - The `bmiVal` parameter in the `getBmiImage` function represents the Body
 * Mass Index (BMI) value of a person. The function returns different images based on the BMI value
 * provided:
 * @returns The `getBmiImage` function returns the image path based on the BMI value provided. If the
 * BMI value is less than 18.5, it returns the image path for a thin person ("delgado.png"). If the BMI
 * value is less than 25, it returns the image path for a normal weight person ("normal.png").
 * Otherwise, it returns the image path for a chubby person
 */
  const getBmiImage = (bmiVal: number) => {
    if (bmiVal < 18.5) return require("../../assets/images/delgado.png");
    if (bmiVal < 25) return require("../../assets/images/normal.png");
    return require("../../assets/images/gordito.png");
  };

/**
 * The function `getMarkerPositionPercent` calculates the percentage position of a marker based on a
 * BMI value within a specified range.
 * @param {number} bmiVal - The `bmiVal` parameter in the `getMarkerPositionPercent` function
 * represents the Body Mass Index (BMI) value for which you want to calculate the marker position
 * percentage.
 * @returns The `getMarkerPositionPercent` function returns the percentage position of a BMI value
 * between `IMC_MIN` and `IMC_MAX`.
 */
  const getMarkerPositionPercent = (bmiVal: number) => {
    if (bmiVal < IMC_MIN) return 0;
    if (bmiVal > IMC_MAX) return 100;
    return ((bmiVal - IMC_MIN) / (IMC_MAX - IMC_MIN)) * 100;
  };

  /* The `markerLeft` variable calculates the left position of a marker on a BMI bar based on the*/
  const markerLeft = (getMarkerPositionPercent(bmiValue) / 100) * BAR_WIDTH;

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>Información Personal</Text>

      <View style={styles.infoContainer}>
        <View style={styles.infoBox}>
          <Text style={styles.label}>Peso: </Text>
          <View style={styles.info}>
            <Text style={styles.value}>{weight}</Text>
            <Text style={styles.unit}>Kg</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <Text style={styles.label}>Altura: </Text>
          <View style={styles.info}>
            <Text style={styles.value}>{(height / 100).toFixed(2)}</Text>
            <Text style={styles.unit}>m</Text>
          </View>
        </View>
      </View>

      <View style={styles.imcContainer}>
        <Text style={styles.imcTitle}>IMC (kg/m²):</Text>
        <View style={styles.info}>
          <Text style={styles.value}>{bmi}</Text>
          <Text style={styles.imcText}>{getBmiCategory(parseFloat(bmi)).replace(" ", "\n")}</Text>
          <Image source={getBmiImage(parseFloat(bmi))} style={styles.image} resizeMode="contain" />
        </View>
        <View style={styles.bmiBarContainer}>
          <View style={[styles.bmiSegment, { flex: 1, backgroundColor: "#2196F3" }]} />
          <View style={[styles.bmiSegment, { flex: 1.5, backgroundColor: "#4CAF50" }]} />
          <View style={[styles.bmiSegment, { flex: 1, backgroundColor: "#FF9800" }]} />
          <View style={[styles.bmiSegment, { flex: 1.5, backgroundColor: "#F44336" }]} />

          <View style={[styles.bmiMarker, { left: markerLeft }]} />
        </View>
      </View>

      <View>
        <Text style={styles.headerText}>Consejos:</Text>
        <FlatList
          data={advices}
          style={{ height: 300 }}
          ListEmptyComponent={() => (
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
              <Text style={{ fontSize: 18, color: "#000", flex: 1 }}>No hay consejos disponibles 🥲</Text>
            </View>
          )}
          renderItem={({ item }) => (
            <View style={styles.adviceContainer}>
              <Text style={styles.adviceTitle}>{item.title}</Text>
              <Text style={styles.adviceDescription}>{item.description}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default HomePage;

const styles = StyleSheet.create({
  bmiBarContainer: {
    flexDirection: "row",
    width: BAR_WIDTH,
    height: 20,
    marginTop: 10,
    borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  bmiSegment: {
    height: "100%",
  },
  bmiMarker: {
    position: "absolute",
    top: 0,
    width: 4,
    height: "100%",
    backgroundColor: "white",
    borderRadius: 2,
  },
  adviceContainer: {
    backgroundColor: "#F6E7FF",
    padding: 10,
    borderRadius: 10,
    width: "100%",
    marginBottom: 10,
  },
  adviceTitle: {
    fontWeight: "bold",
    marginTop: 15,
    marginBottom: 10,
    fontSize: 18,
    color: "#000000",
    marginLeft: 10,
    textAlign: "left",
  },
  adviceDescription: {
    marginLeft: 10,
    marginBottom: 15,
    fontSize: 16,
    color: "#000000",
    textAlign: "left",
  },
  image: {
    width: 50,
    height: 100,
    resizeMode: "contain",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 20,
    paddingRight: 20,
  },
  headerText: {
    fontSize: 24,
    marginTop: 20,
    marginBottom: 20,
  },
  infoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
  },
  info: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  infoBox: {
    backgroundColor: "#F6E7FF",
    padding: 10,
    borderRadius: 10,
    width: "48%",
  },
  label: {
    fontSize: 15,
    color: "#000000",
    textAlign: "left",
  },
  value: {
    fontSize: 50,
    color: "#919090",
  },
  unit: {
    fontSize: 20,
    color: "#919090",
    paddingTop: 25,
    marginLeft: 5,
  },
  imcContainer: {
    backgroundColor: "#F6E7FF",
    padding: 10,
    borderRadius: 10,
  },
  imcText: {
    fontSize: 15,
    color: "#723694",
    marginLeft: 20,
    marginRight: 20,
    textAlign: "center",
  },
  imcTitle: {
    fontSize: 15,
    color: "#000000",
    textAlign: "left",
  },
  imcValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
});
