import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import asyncStorageService from "../../services/async-storage-service";
import userService from "../../services/user-service";
import { InfoUser } from "../../types/info-user";
import adviceService from "../../services/advice-service";
import { InfoAdvice } from "../../types/info-advice";
import { useNavigation } from "expo-router";

const BAR_WIDTH = 300;

const HomePage = () => {
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const [advices, setAdvices] = useState<InfoAdvice[]>([]);
  const [userName, setUserName] = useState<string>("Usuario");
  const navigation = useNavigation();
  const IMC_MIN = 10;
  const IMC_MAX = 40;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => <Text style={{ fontSize: 17, fontWeight: "bold", color: "black" }}>Hola, {userName}</Text>,
    });
  }, [navigation, userName]);
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const email = await asyncStorageService.getUser("user-email");
        const cleanEmail = email?.replace(/^"(.*)"$/, "$1");

        if (!cleanEmail) {
          console.error("Email no encontrado en AsyncStorage");
          return;
        }

        const advices = await adviceService.getAllAdvice();
        setAdvices(advices.data || []);
        if (!advices) {
          console.error("No se encontraron consejos");
          return;
        }

        const userRes = await userService.getUserByEmail(cleanEmail);
        if (userRes?.data?.name) {
          setUserName(userRes.data.name);
        }
        setUserData(userRes.data);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    fetchData();
  }, []);

  const weight = userData?.infoUser?.weight ?? 0;
  const height = userData?.infoUser?.height ?? 1;

  const bmiValue = height > 0 ? weight / (height / 100) ** 2 : 0;
  const bmi = bmiValue.toFixed(1);

  const getBmiCategory = (bmiVal: number) => {
    if (bmiVal < 18.5) return "Bajo peso";
    if (bmiVal < 25) return "Peso Saludable";
    if (bmiVal < 30) return "Sobrepeso";
    return "Obesidad";
  };

  const getBmiImage = (bmiVal: number) => {
    if (bmiVal < 18.5) return require("../../assets/images/delgado.png");
    if (bmiVal < 25) return require("../../assets/images/normal.png");
    return require("../../assets/images/gordito.png");
  };

  const getMarkerPositionPercent = (bmiVal: number) => {
    if (bmiVal < IMC_MIN) return 0;
    if (bmiVal > IMC_MAX) return 100;
    return ((bmiVal - IMC_MIN) / (IMC_MAX - IMC_MIN)) * 100;
  };

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
          data={advices.slice(-5).reverse()}
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
