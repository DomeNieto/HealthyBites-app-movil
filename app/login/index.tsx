import { StyleSheet, Text, View, TextInput, Button, Pressable, Image } from "react-native";
import React, { useState } from "react";
import Toast from "react-native-toast-message";
import { Link, router } from "expo-router";
import userService from "../../services/user-service";
import { loginInfo } from "../../types/login-info";

const LoginPage = () => {
  const emptyForm = {
    email: "",
    password: "",
  };
  const [formLogin, setFormLogin] = useState(emptyForm);

  /**
   * The `sevedUser` function is an asynchronous function that attempts to log in a user by sending their
   * credentials (email and password) to a user service. If the login is successful, it navigates to the
   * home screen. If the login fails, it shows an error message using a toast notification.
   * @param user 
   */
  const sevedUser = async(user: loginInfo) => {
    try {
      const response = await userService.registerLogin(user);
      if (response != 200) {
        Toast.show({
          type: "error",
          text1: "Credenciales Inválidas",
          text2: "Inténtelo de nuevo ",
        });
      } else {
        router.navigate("../(drawer)/home");
      }
    } catch (error) {
      console.log("Fetch Error:", error);
      Toast.show({
        type: "error",
        text1: "Error al iniciar sesión",
        text2: "Verifica tus datos o intenta más tarde",
      });
    }
  }
  
  /**
   * The `sendForm` function is called when the user presses the "Iniciar sesión" button.
   * It checks if the email and password fields are empty. If they are, it shows an error message using a toast notification. 
   * If they are not empty, it calls the `sevedUser` function to attempt to log in the user.
   * After the login attempt, it resets the form fields to their initial state.
   */
  const sendForm = () => {
    if (
      formLogin.email === "" ||
      formLogin.password === "" 
    ) {
      Toast.show({
        type: "error",
        text1: "Error tipado",
        text2: "Intente ingresar un email y/o password válidos",
      });
    } else {
      sevedUser({
        email: formLogin.email,
        password: formLogin.password,
      });
    }
    console.log("formLogin", formLogin);
    setFormLogin(emptyForm);
  };

  return (
    <View style={styles.outerContainer}>
      <Toast />
      <View style={styles.container}>
        <Image source={require("./../../assets/images/logo.png")} style={{ width: 100, height: 100, marginBottom: 20 }} />
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formLogin.email}
            onChangeText={(text) => setFormLogin({ ...formLogin, email: text })}
            placeholder="Dirección de correo electrónico"
            keyboardType="email-address"
            returnKeyType="done"
          />
        </View>

        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.input}
            value={formLogin.password}
            onChangeText={(text) => setFormLogin({ ...formLogin, password: text })}
            placeholder="Contraseña"
            secureTextEntry={true}
            returnKeyType="done"
          />
        </View>

        <View>
          <Pressable style={styles.button} onPress={sendForm}>
            <Text style={styles.buttonText}>Iniciar sesión</Text>
          </Pressable>

          <Link href="./../registry" style={styles.link}>
            No Tengo Cuenta
          </Link>
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.develop}>Desarrollado por:</Text>
        <Image source={require("./../../assets/images/codex_logo.png")} style={{ width: 105, height: 30, marginBottom: 20 }} />
      </View>
    </View>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  redirectButtom: {
    color: "purple",
    alignSelf: "center",
    fontSize: 20,
    marginTop: 20,
  },
  title: {
    fontSize: 30,
    marginBottom: 20,
    textAlign: "center",
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
  },
  buttonText: {
    alignSelf: "center",
    fontFamily: "InstrumentSans-Bold",
    color: "#fff",
    fontSize: 16,
  },
  link: {
    fontFamily: "InstrumentSans-Bold",
    color: "#723694",
    fontSize: 16,
    textDecorationLine: "underline",
    alignSelf: "center",
  },
  develop: {
    fontFamily: "InstrumentSans-Bold",
    color: "#723694",
    fontSize: 16,
    alignSelf: "center",
  },
  footer: {
    alignItems: "center",
  },
  outerContainer: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 30,
  },
  container: {
    width: "100%",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  inputWrapper: {
    width: "70%",       
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",       
  },
});
