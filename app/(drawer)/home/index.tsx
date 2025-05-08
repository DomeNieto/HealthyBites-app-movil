import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import asyncStorageService from "../../../services/async-storage-service";
import userService from "../../../services/user-service";
import { InfoUser } from "../../../types/info-user";
import adviceService from "../../../services/advice-service";
import { InfoAdvice } from "../../../types/info-advice";
import { useNavigation } from "expo-router";

const HomePage = () => {
  const [userData, setUserData] = useState<InfoUser | null>(null);
  const [advices, setAdvices] = useState<InfoAdvice[]>([]);

  const navigation = useNavigation();
  const [userName, setUserName] = useState<string>('Usuario');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: 'black' }}>
          Hola, {userName}
        </Text>
      )
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
        setAdvices(advices.data);
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

  const bmi = (weight / (height / 100) ** 2).toFixed(1);

  const getBmiCategory = (bmiValue: number) => {
    if (bmiValue < 18.5) return "Bajo peso";
    if (bmiValue < 25) return "Peso Saludable";
    if (bmiValue < 30) return "Sobrepeso";
    return "Obesidad";
  };

  const getBmiImage = (bmiValue: number) => {
    if (bmiValue < 18.5) return require("../../../assets/images/delgado.png");
    if (bmiValue < 25) return require("../../../assets/images/normal.png");
    return require("../../../assets/images/gordito.png");
  };

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
            {getBmiCategory(parseFloat(bmi)).replace(" ", "\n")}
          </Text>
          <Image
            source={getBmiImage(parseFloat(bmi))}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
      </View>

      <View>
        <Text style={styles.headerText}>Consejos:</Text>
        <FlatList
          data={advices}
          style={{ height: 300}}
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

  adviceContainer: {
    backgroundColor: "#F6E7FF",
    padding: 10,
    borderRadius: 10,
    width: '100%',
    marginBottom: 10,
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
  adviceTitle: {
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
  imcValue: {
    fontSize: 30,
    fontWeight: "bold",
    color: "black",
  },
});
