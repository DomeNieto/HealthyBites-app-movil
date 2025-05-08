import React, { useState } from "react";
import { Modal, View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { registerNewUser } from "../../services/user-service";

const RegisterModal = ({ onClose }: { onClose: () => void }) => {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState("name");
  const [data, setData] = useState({
    name: "",
    weight: 0.0,
    height: 0.0,
    activityLevel: "",
    email: "",
    password: "",
  });
  const [repeatPassword, setRepeatPassword] = useState("");

  const router = useRouter();

  const handleNext = async () => {
    if (data[step as keyof typeof data] === "" || data[step as keyof typeof data] === 0) {
      Alert.alert("Campo vacío", "Por favor, complete este campo antes de continuar");
      return;
    }
  
    if (step === "name") {
      setStep("weight");
    } else if (step === "weight") {
      setStep("height");
    } else if (step === "height") {
      setStep("activityLevel");
    } else if (step === "activityLevel") {
      setStep("email");
    } else if (step === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(data.email)) {
        Alert.alert("Correo electrónico no válido", "Ingrese una dirección de correo electrónico válida");
        return;
      }
      setStep("password");
    } else {
      if (data.password !== repeatPassword) {
        Alert.alert("Error", "Contraseñas no coinciden.");
        return;
      }
  
      const passwordRegex =
        /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!passwordRegex.test(data.password)) {
        Alert.alert(
          "Contraseña débil",
          "La contraseña debe tener al menos 8 caracteres e incluir una letra mayúscula, un número y un carácter especial"
        );
        return;
      }
  
      const newUser = {
        name: data.name,
        email: data.email,
        password: data.password,
        infoUser: {
          height: data.height,
          weight: data.weight,
          activityLevel: data.activityLevel,
        },
      };
      console.log(JSON.stringify(newUser));
      const status = await registerNewUser(newUser);
      console.log(status);
      if (status === 200 || status === 201) {
        setVisible(false);
        onClose();
        router.replace("../login");
      } else {
        Alert.alert("Error", `Registro fallido (status ${status})`);
      }
    }
  };
  
  

  const renderContent = () => {
    switch (step) {
      case "name":
        return (
          <>
            <Text style={styles.label}>... Cuál es tu nombre?</Text>
            <TextInput
              style={styles.input}
              value={data.name}
              onChangeText={(txt) => setData(prev => ({ ...prev, name: txt }))}
              placeholder="Andrea"
            />
          </>
        );
        case "height":
          return (
            <>
            <Text style={styles.label}>... Indícanos tu Altura</Text>

            <TextInput
              style={styles.input}
              value={data.height.toString()}
              onChangeText={(txt) => setData((prev) => ({ ...prev, height: parseFloat(txt) }))}
              placeholder="e.g. 170"
              keyboardType="number-pad"
              />
          </>
        );
        case "weight":
          return (
            <>
              <Text style={styles.label}>... Indícanos tu Peso</Text>
              <TextInput
              style={styles.input}
              value={data.weight.toString()}
              onChangeText={(txt) => setData((prev) => ({ ...prev, weight: parseFloat(txt) }))}
              placeholder="70"
              keyboardType="number-pad"
              />
            </>
          );
        case "activityLevel":
        return (
          <>
            <Text style={styles.label}>... Cual es tu Nivel de Actividad Física ?</Text>
            <Picker
              selectedValue={data.activityLevel}
              onValueChange={(value) => setData((prev) => ({ ...prev, activityLevel: value }))}
            >
              <Picker.Item label="Selecciona una opción..." value="" />
              <Picker.Item label="Baja" value="Baja" />
              <Picker.Item label="Moderada" value="Moderada" />
              <Picker.Item label="Alta" value="Alta" />
            </Picker>
          </>
        );
      case "email":
        return (
          <>
            <Text style={styles.label}>Introduce Email</Text>
            <TextInput
              style={styles.input}
              value={data.email}
              onChangeText={(txt) => setData(prev => ({ ...prev, email: txt }))}
              placeholder="example@example.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </>
        );
      case "password":
        return (
          <>
            <Text style={styles.label}>Introduce Password</Text>
            <Text >Password</Text>
            <TextInput
              style={styles.input}
              value={data.password}
              onChangeText={(txt) => setData(prev => ({ ...prev, password: txt }))}
              placeholder="Password123*"
              secureTextEntry
            />
            <Text >Repite Password</Text>
            <TextInput
              style={styles.input}
              value={repeatPassword}
              onChangeText={setRepeatPassword}
              placeholder="Repeat password"
              secureTextEntry
            />
          </>
        );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          {renderContent()}
          <Pressable style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>
              {step === "password" ? "Guadar" : "Siguiente"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  label: {
    fontSize: 24,
    fontFamily: "InstrumentSans-Regular",
    marginTop: 40,
    marginBottom: 20,
  },
  label_actividad: {
    fontSize: 24,
    fontFamily: "InstrumentSans-Regular",
    marginTop: 40,
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
    marginBottom: 20,
    alignSelf: "center",
    color: "#fff",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 16,
    marginTop: 20,
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginVertical: 10,
    borderRadius: 5,
  },
});

export default RegisterModal;
