import React, { useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View, TextInput, Alert, ActivityIndicator } from "react-native";
import recipesService from "../../services/recipe-service";
import userService from "../../services/user-service";
import { useRecipe } from "../../context/RecipeContext";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { CreateRecipe, IngredientInfoRecipe } from "../../types/create-recipe";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";
import { DrawerParamList } from "../../types/navigation";
import { InfoRecipe } from "../../types/info-recipe";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Keyboard } from "react-native";
import asyncStorageService from "../../services/async-storage-service";
import { cleanEmail } from "../../utitlity/utility";

// The `NewRecipe` component is a React Native screen that allows users to create or edit a recipe.
const NewRecipe = () => {
  const { data, fetchRecipes, setName, setPreparation, addRecipe, setIngredients, updateRecipeInList } = useRecipe();
  /* The line `const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();` is using the
  `useNavigation` hook from React Navigation to get the navigation object specific to the Drawer
  navigation. */
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  type NewRecipeRouteProp = RouteProp<DrawerParamList, "NewRecipe">;
  const route = useRoute<NewRecipeRouteProp>();
  const { mode, recipeId } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  const clearRecipeFormContext = () => {
    setName("");
    setPreparation("");
    setIngredients([]);
  };

  /**
   * The `useEffect` hook is used to load a recipe when the component mounts or when the `mode` or `recipeId` changes.
   * If the mode is "edit" and a recipeId is provided, it fetches the recipe data from the server
   * and populates the form fields with the recipe details.
   * If the mode is "create", it clears the recipe form context.
   */
  useEffect(() => {
    const loadRecipe = async () => {
      setIsLoading(true);
      if (mode === "edit" && recipeId) {
        try {
          const res = await recipesService.getRecipeById(Number(recipeId));
          if (res?.data) {
            setName(res.data.name);
            setPreparation(res.data.preparation);
            setIngredients(res.data.ingredients.map((ing: any) => ({
              ingredientId: ing.id,
              name: ing.name,
              quantity: ing.quantity,
              active: ing.active,
              quantityCalories: ing.quantityCalories ?? 0,
            })));
          } else {
            Alert.alert("Error", "No se encontró la receta.");
          }
        } catch (err) {
          console.log("Error al cargar receta:", err);
          Alert.alert("Error", "Ocurrió un error al cargar la receta.");
        }
      } else {
        clearRecipeFormContext();
      }
      setIsLoading(false);
    };

    loadRecipe();
  }, [mode, recipeId]);

  /**
   * The `isLoading` state is used to show a loading indicator while the recipe data is being fetched.
   * If `isLoading` is true, it displays an `ActivityIndicator` in the center of the screen.
   */
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "white" }}>
        <ActivityIndicator size="large" color="#723694" />
      </View>
    );
  }

  /**
   * The `deleteIngredient` function removes an ingredient from the list of ingredients in the recipe.
   * It filters out the ingredient with the specified `ingredientId` and updates the state.
   * @param {number} ingredientId - The ID of the ingredient to be deleted.
   */
  const deleteIngredient = (ingredientId: number) => {
    setIngredients(data.ingredients.filter((ing) => ing.ingredientId !== ingredientId));
  };

  /**
   * The `onSave` function is called when the user presses the "Guardar" button.
   * It validates the input fields, constructs a recipe object, and either creates or updates a recipe
   * based on the mode (create or edit).
   * If successful, it navigates back to the "Recetas" screen and clears the form context.
   */
  const onSave = async () => {
    try {
      if (!data.name.trim()) {
        Alert.alert("Campo requerido", "El nombre de la receta es obligatorio.");
        return;
      }
      if (!data.preparation.trim()) {
        Alert.alert("Campo requerido", "La preparación es obligatoria.");
        return;
      }
      if (data.ingredients.length === 0) {
        Alert.alert("Campo requerido", "Debe añadir al menos un ingrediente.");
        return;
      }

      const emailStored = await asyncStorageService.getInfoStorage(asyncStorageService.KEYS.userEmail);
      if (!emailStored) {
        console.log("Error", "Email no encontrado.");
        return;
      }
      const email = cleanEmail(emailStored);
      if (!email) {
        console.log("Error", "Email no válido.");
        return;
      }
      const user = await userService.getUserByEmail(email);
      if (!user?.data.id) {
        console.log("Error", "No se pudo obtener el usuario.");
        return;
      }
      const recipeToSend: CreateRecipe = {
        name: data.name,
        preparation: data.preparation,
        userId: user.data.id,
        ingredients: data.ingredients.map((i) => ({
          ingredientId: i.ingredientId,
          quantity: i.quantity,
          quantityCalories: i.quantityCalories ?? 0,
        })),
      };

      if (mode === "edit" && recipeId) {
        await recipesService.updateRecipe(Number(recipeId), recipeToSend);
        const recipeEdit: InfoRecipe = {
          id: Number(recipeId),
          name: data.name,
          preparation: data.preparation,
          ingredients: data.ingredients.map((i) => ({
            id: i.ingredientId,
            name: i.name ?? "",
            quantity: i.quantity,
            active: true,
            quantityCalories: i.quantityCalories ?? 0,
          })),
        };
        updateRecipeInList(recipeEdit);
        Alert.alert("Éxito", "Receta actualizada");
      } else {
        const created = await recipesService.createRecipe(recipeToSend);
        if (created) {
          addRecipe(created);
          Alert.alert("Éxito", "Receta creada");
        } else {
          console.log("API de creación no devolvió la receta. Se re-intentará cargar la lista.");
          await fetchRecipes();
          Alert.alert("Éxito", "Receta creada (actualizando lista).");
        }
      }
      navigation.navigate("Recetas");
      clearRecipeFormContext();
    } catch (err) {
      console.log(err);
      Alert.alert("Error", "No se pudo guardar la receta, puede que ya exista una receta con ese nombre, intente nuevamente");
    }
  };


  /**
   * The `handleBackPress` function is called when the user presses the back button.
   * It clears the recipe form context and navigates back to the "Recetas" screen.
   */
  const handleBackPress = () => {
    clearRecipeFormContext();
    navigation.navigate("Recetas");
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleBackPress} style={styles.containerButtomBack}>
        <Text style={styles.buttomBack}>{"<- Volver"}</Text>
      </Pressable>
      <Text style={styles.title}>{mode === "edit" ? "Editar Receta" : "Nueva Receta"}</Text>

      <Text style={styles.labelTitle}>Nombre</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={data.name} onChangeText={setName} />

      <View style={styles.row}>
        <Text style={styles.label}>Ingredientes</Text>
        <Pressable style={({ pressed }) => [styles.addButton, pressed && styles.addButtonPressed]} onPress={() => navigation.navigate("addIngredient", { mode: mode ?? "create", recipeId })}>
          <Text style={styles.addButtonText}>Añadir +</Text>
        </Pressable>
      </View>

      <FlatList
        data={data.ingredients}
        keyExtractor={(item) => item.ingredientId.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{item.name}</Text>
            <Text style={styles.ingredientQty}> {item.quantity}</Text>
            <Pressable onPress={() => deleteIngredient(item.ingredientId)}>
              <Text style={styles.deleteText}>Eliminar</Text>
            </Pressable>
          </View>
        )}
      />

      <Text style={styles.labelTitle}>Preparación</Text>
      <TextInput
        style={[styles.input, styles.prepInput]}
        placeholder="Preparación"
        multiline
        value={data.preparation}
        onChangeText={setPreparation}
        returnKeyType="done"
        onSubmitEditing={Keyboard.dismiss}
      />

      <Pressable onPress={onSave} style={styles.button}>
        <Text style={styles.buttonText}>Guardar</Text>
      </Pressable>
    </View>
  );
};

export default NewRecipe;

const styles = StyleSheet.create({
  containerButtomBack: {
    position: "absolute",
    top: 620,
    left: 10,
  },
  buttomBack: {
    fontSize: 18,
    color: "#723694",
    borderRadius: 5,
    padding: 5,
  },
  deleteText: {
    color: "white",
    backgroundColor: "red",
    padding: 5,
    borderRadius: 15,
    fontWeight: "bold",
    marginLeft: 10,
    marginTop: -5,
  },
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: "InstrumentSans-Bold",
    color: "#723694",
    alignSelf: "auto",
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontFamily: "InstrumentSans-Regular",
    alignSelf: "flex-start",
    marginHorizontal: 50,
    marginTop: 10,
    marginLeft: 0,
  },
  labelTitle: {
    fontSize: 16,
    fontFamily: "InstrumentSans-Regular",
    alignSelf: "flex-start",
    marginHorizontal: 50,
    marginTop: 10,
    marginLeft: 35,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
    width: "80%",
    marginVertical: 5,
  },
  prepInput: {
    height: 120,
    textAlignVertical: "top",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "80%",
    marginTop: 10,
  },
  addButton: {
    backgroundColor: "#723694",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  addButtonPressed: {
    backgroundColor: "#C564FE",
  },
  addButtonText: {
    color: "#fff",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 14,
  },
  list: {
    width: "80%",
    backgroundColor: "#D9D9D9",
    borderRadius: 5,
    marginVertical: 10,
    maxHeight: 200,
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
  },
  ingredientName: {
    fontSize: 14,
    fontFamily: "InstrumentSans-Regular",
    flex: 1,
    alignItems: "center",
  },
  ingredientQty: {
    fontSize: 14,
    fontFamily: "InstrumentSans-Regular",
  },
  button: {
    backgroundColor: "#723694",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 16,
  },
});
