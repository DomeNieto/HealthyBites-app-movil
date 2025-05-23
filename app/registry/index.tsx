import React, { useState } from "react";
import { Modal, View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useRouter } from "expo-router";
import { registerNewUser } from "../../services/user-service";
import { Keyboard } from "react-native";

type RegisterModalProps = {
  onClose: () => void;
};

const RegisterModal = ({ onClose }: RegisterModalProps) => {
  const [visible, setVisible] = useState(true);
  const [step, setStep] = useState("name");
  const [data, setData] = useState({
    name: "",
    weight: 0.0,
    height: 0.0,
    activityLevel: "",
    email: "",
    password: "",
    age: 0,
    sex: "",
  });
  const [repeatPassword, setRepeatPassword] = useState("");

  const router = useRouter();

  /**
   * The function `handleNext` is used to handle the navigation and validation logic for a multi-step
   * @returns The `handleNext` function returns different things based on the conditions met during its
   * execution. Here are the possible return scenarios: name, weight, height, activityLevel, age, sex, email,
   * password, and the final registration process.
   */
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
      setStep("age");
    } else if (step === "age") {
      setStep("sex");
    } else if (step === "sex") {
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

      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?]).{8,}$/;
      if (!passwordRegex.test(data.password)) {
        Alert.alert("Contraseña débil", "La contraseña debe tener al menos 8 caracteres e incluir una letra mayúscula, un número y un carácter especial");
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
          age: data.age,
          sex: data.sex,
        },
      };
      const status = await registerNewUser(newUser);
      console.log(status);
      if (status === 201) {
        setVisible(false);
        onClose();
        router.replace("../login");
      } else {
        Alert.alert("Error", `Registro fallido (status ${status})`);
      }
    }
  };

  /*  It is used to render different input fields based on the value of the `step` variable. The function uses a
  switch statement to determine which input fields to display based on the current step. */
  const renderContent = () => {
    switch (step) {
      case "name":
        return (
          <>
            <Text style={styles.label}>... Cuál es tu nombre?</Text>
            <TextInput style={styles.input} value={data.name} onChangeText={(txt) => setData((prev) => ({ ...prev, name: txt }))} placeholder="Andrea" />
          </>
        );
      case "height":
        return (
          <>
            <Text style={styles.label}>... Indícanos tu Altura en centímetros</Text>

            <TextInput
              style={styles.input}
              value={data.height.toString()}
              onChangeText={(txt) => setData((prev) => ({ ...prev, height: txt ? parseInt(txt) : 0 }))}
              placeholder="e.g. 170"
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
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
              onChangeText={(txt) => setData((prev) => ({ ...prev, weight: txt ? parseInt(txt) : 0 }))}
              placeholder="70"
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </>
        );
      case "activityLevel":
        return (
          <>
            <Text style={styles.label}>... Cual es tu Nivel de Actividad Física ?</Text>
            <Picker selectedValue={data.activityLevel} onValueChange={(value) => setData((prev) => ({ ...prev, activityLevel: value }))}>
              <Picker.Item label="Selecciona una opción..." value="" />
              <Picker.Item label="Baja" value="Baja" />
              <Picker.Item label="Moderada" value="Moderada" />
              <Picker.Item label="Alta" value="Alta" />
            </Picker>
          </>
        );
      case "age":
        return (
          <>
            <Text style={styles.label}>¿Cuántos años tienes?</Text>
            <TextInput
              style={styles.input}
              value={data.age.toString()}
              onChangeText={(txt) => setData((prev) => ({ ...prev, age: txt ? parseInt(txt) : 0 }))}
              placeholder="Ej: 25"
              keyboardType="number-pad"
              returnKeyType="done"
              onSubmitEditing={Keyboard.dismiss}
            />
          </>
        );
      case "sex":
        return (
          <>
            <Text style={styles.label}>¿Sexo biológico?</Text>
            <View style={styles.sexOptions}>
              <Pressable style={[styles.sexButton, data.sex === "Femenino" && styles.sexSelected]} onPress={() => setData((prev) => ({ ...prev, sex: "Femenino" }))}>
                <Text style={styles.sexLabel}>👩 Femenino</Text>
              </Pressable>
              <Pressable style={[styles.sexButton, data.sex === "Masculino" && styles.sexSelected]} onPress={() => setData((prev) => ({ ...prev, sex: "Masculino" }))}>
                <Text style={styles.sexLabel}>👨 Masculino</Text>
              </Pressable>
            </View>
          </>
        );

      case "email":
        return (
          <>
            <Text style={styles.label}>Introduce Email</Text>
            <TextInput
              style={styles.input}
              value={data.email}
              onChangeText={(txt) => setData((prev) => ({ ...prev, email: txt }))}
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
            <Text>Password</Text>
            <TextInput style={styles.input} value={data.password} onChangeText={(txt) => setData((prev) => ({ ...prev, password: txt }))} placeholder="Password123*" secureTextEntry />
            <Text>Repite Password</Text>
            <TextInput style={styles.input} value={repeatPassword} onChangeText={setRepeatPassword} placeholder="Repeat password" secureTextEntry />
          </>
        );
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modalContent}>
          <Pressable
            style={styles.closeIcon}
            onPress={() => {
              setVisible(false);
              router.replace("/");
            }}
          >
            <Text style={styles.closeText}>✕</Text>
          </Pressable>

          {renderContent()}
          <Pressable style={styles.button} onPress={handleNext}>
            <Text style={styles.buttonText}>{step === "password" ? "Guadar" : "Siguiente"}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 1,
  },
  closeText: {
    fontSize: 18,
    color: "#000",
  },
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
  sexOptions: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  sexButton: {
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "#f0f0f0",
  },
  sexSelected: {
    backgroundColor: "#add8e6",
    borderColor: "#0077b6",
  },
  sexLabel: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default RegisterModal;
