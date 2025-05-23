import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import asyncStorageService from "../../services/async-storage-service";
import { InfoUser } from "../../types/info-user";
import { InfoAdvice } from "../../types/info-advice";
import userService from "../../services/user-service";
import adviceService from "../../services/advice-service";
import { cleanEmail, getBmiCategory, getBmiImage, getMarkerPercent } from "../../utitlity/utility";

const BAR_WIDTH = 300;

/**
 * HomePage is a React component that displays the user's personal information,
 * including weight, height, and BMI (Body Mass Index).
 * It also shows a list of advice items related to health and wellness.
 */
const HomePage = () => {
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const [advices, setAdvices] = useState<InfoAdvice[]>([]);

  /**
   * The `useEffect` hook is used to fetch the list of advices when the component mounts.
   * It calls the `getAllAdvice` function from the `adviceService` and sets the
   * `advices` state with the fetched data.
   */
  useEffect(() => {
    const fetchAdvices = async () => {
      const adviceList = await adviceService.getAllAdvice();
      console.log("Lista de consejos:", adviceList);
      setAdvices(adviceList);
    };

    fetchAdvices();
  }, []);

  /**
   * The `useEffect` hook is used to fetch the user's personal information when the component mounts.
   * It retrieves the user's email from AsyncStorage, fetches the user data using the email,
   * and sets the `userData` state with the fetched data.
   */
  useEffect(() => {
    const fetchUser = async () => {
      const emailStored = await asyncStorageService.getInfoStorage(
        asyncStorageService.KEYS.userEmail
      );
      if (!emailStored) {
        console.log("Error al obtener el email de AsyncStorage");
        return;
      }
      const email = cleanEmail(emailStored);
      if (!email) {
        console.log("Error al tipar el email");
        return;
      }
      const user = await userService.getUserByEmail(email);
      if (user) {
        setUserData(user.data);
      }
    };
    fetchUser();
  }, []);

  const weight = userData?.infoUser.weight ?? 0;
  const height = userData?.infoUser.height ?? 1;
  let bmiValue:number = 0;
  if ( height > 0 && weight > 0) {
    const heightInMeters = height / 100;
    bmiValue = weight / (heightInMeters * heightInMeters);
  }
  // Calculate BMI value
  const bmi = bmiValue.toFixed(1);

  const markerLeft = (getMarkerPercent(bmiValue) / 100) * BAR_WIDTH;

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
          <Text style={styles.imcText}>
            {getBmiCategory(bmiValue).replace(" ", "\n")}
          </Text>
          <Image
            source={getBmiImage(bmiValue)}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        <View style={styles.bmiBarContainer}>
          <View style={[styles.bmiSegment, { flex: 1, backgroundColor: "#2196F3" }]} />
          <View style={[styles.bmiSegment, { flex: 1.5, backgroundColor: "#4CAF50" }]} />
          <View style={[styles.bmiSegment, { flex: 1, backgroundColor: "#F44336" }]} />
          <View style={[styles.bmiSegment, { flex: 1.5, backgroundColor: "#F44336" }]} />
          <View style={[styles.bmiMarker, { left: markerLeft }]} />
        </View>

      </View>
      <Text style={styles.headerText}>Consejos:</Text>
      <FlatList
        // list of 5 latest tips from the list of tips
        data={advices.slice(-5).reverse()}
        style={{ height: 300 }}
        ListEmptyComponent={() => (
          <View
            style={styles.listEmptyContainer}
          >
            <Text style={{ fontSize: 18 }}>
              No hay consejos disponibles 🥲
            </Text>
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
  );
};

export default HomePage;

const styles = StyleSheet.create({
  listEmptyContainer: {
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
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