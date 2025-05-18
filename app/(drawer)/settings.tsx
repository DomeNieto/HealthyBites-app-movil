import { Alert, Pressable, StyleSheet, Text, TextInput, View, ScrollView } from "react-native";
import React, { useEffect, useState } from "react";
import { Picker } from "@react-native-picker/picker";
import userService from "../../services/user-service";
import { useRouter } from "expo-router";

const SettingsPage = () => {
  const router = useRouter();

  const [data, setData] = useState({
    name: "",
    weight: 0.0,
    height: 0.0,
    activityLevel: "",
    email: "",
    password: "",
    sex: "",
    age: 0,
  });

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await userService.getInfoUser();
      if (userData) {
        setData({
          name: userData.name || "",
          weight: userData.infoUser?.weight || 0,
          height: userData.infoUser?.height || 0,
          activityLevel: userData.infoUser?.activityLevel || "",
          sex: userData.infoUser?.sex || "",
          age: userData.infoUser?.age || 0,
          email: "",
          password: "",
        });
        console.log("Datos del usuario:", userData);
      }
    };

    fetchUserData();
  }, []);

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;

  const handleUpdate = async () => {
    if (!data.name.trim() || data.height == 0 || data.weight == 0 || !data.activityLevel || !data.email.trim() || !data.password.trim() || !data.sex || data.age === 0) {
      Alert.alert("Error", "Por favor, completa todos los campos.");
      return;
    }

    if (!emailRegex.test(data.email)) {
      Alert.alert("Error", "Correo electrónico no válido.");
      return;
    }

    if (!passwordRegex.test(data.password)) {
      Alert.alert("Error", "La contraseña debe tener al menos 8 caracteres, una mayúscula, un número y un carácter especial.");
      return;
    }

    try {
      const responseStatus = await userService.updateUser({
        name: data.name,
        email: data.email,
        password: data.password,
        infoUser: {
          height: data.height,
          weight: data.weight,
          activityLevel: data.activityLevel,
          sex: data.sex,
          age: data.age,
        },
      });

      if (responseStatus === 200) {
        Alert.alert("Éxito", "Datos actualizados correctamente, vuelve a iniciar sesión.");
        router.replace("../login");
      } else {
        Alert.alert("Error", "No se pudo actualizar el usuario.");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      Alert.alert("Error", "Ocurrió un error al actualizar los datos.");
    }
  };
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput 
        style={styles.input} 
        value={data.name} 
        onChangeText={(txt) => setData((prev) => ({ ...prev, name: txt }))} 
        placeholder="Usuario" />
      <Text style={styles.label}>Altura en centímetros</Text>

      <TextInput
        style={styles.input}
        value={data.height.toString()}
        onChangeText={(txt) => setData((prev) => ({ ...prev, height: txt ? parseFloat(txt) : 0 }))}
        placeholder="156"
        keyboardType="number-pad"
      />
      <Text style={styles.label}>Peso en Kilogramos</Text>
      <TextInput
        style={styles.input}
        value={data.weight.toString()}
        onChangeText={(txt) => setData((prev) => ({ ...prev, weight: txt ? parseFloat(txt) : 0 }))}
        placeholder="56"
        keyboardType="number-pad"
      />
      <Text style={styles.label}>Nivel de Actividad Física</Text>
      <Picker 
        style={styles.labelActividad} 
        selectedValue={data.activityLevel} 
        onValueChange={(value) => setData((prev) => ({ ...prev, activityLevel: value }))}>
        <Picker.Item label="Selecciona una opción..." value="" />
        <Picker.Item label="Baja" value="Baja" />
        <Picker.Item label="Moderada" value="Moderada" />
        <Picker.Item label="Alta" value="Alta" />
      </Picker>
      <Text style={styles.label}>Edad</Text>
      <TextInput style={styles.input} value={data.age.toString()} onChangeText={(txt) => setData((prev) => ({ ...prev, age: txt ? parseInt(txt) : 0 }))} placeholder="Edad" keyboardType="number-pad" />

      <Text style={styles.label}>Sexo</Text>
      <View style={styles.checkboxGroup}>
        {["Femenino", "Masculino"].map((option) => (
          <Pressable key={option} style={[styles.checkboxOption, data.sex === option && styles.checkboxSelected]} onPress={() => setData((prev) => ({ ...prev, sex: option }))}>
            <Text style={styles.checkboxText}>
              {data.sex === option ? "✅" : "⬜"} {option}
            </Text>
          </Pressable>
        ))}
      </View>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={data.email}
        onChangeText={(txt) => setData((prev) => ({ ...prev, email: txt }))}
        placeholder="example@example.com"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Contraseña</Text>
      <TextInput 
        style={styles.input} 
        value={data.password} 
        onChangeText={(txt) => setData((prev) => ({ ...prev, password: txt }))} 
        placeholder="Password123*" 
        secureTextEntry 
      />
      <Pressable style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Actualizar</Text>
      </Pressable>
    </ScrollView>
  );
};

export default SettingsPage;

const styles = StyleSheet.create({
  checkboxGroup: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  checkboxOption: {
    padding: 10,
    borderRadius: 8,
  },
  checkboxText: {
    fontSize: 16,
  },
  checkboxSelected: {
    backgroundColor: "#e0e0e0",
  },
  label: {
    fontSize: 17,
    fontFamily: "InstrumentSans-Regular",
    width: "100%",
    marginRight: 50,
    marginLeft: 50,
  },
  container: {
    flex: 1,
    marginTop: 20,
  },
  labelActividad: {
    fontSize: 16,
    fontFamily: "InstrumentSans-Regular",
    marginRight: 50,
    marginLeft: 50,
    marginBottom: -20,
    marginTop: -10,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#723694",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignSelf: "center",
    color: "#fff",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 16,
    marginTop: 20,
    marginBottom: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 5,
    borderRadius: 5,
    marginRight: 50,
    marginLeft: 50,
  },
});
