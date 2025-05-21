import { FlatList, Pressable, StyleSheet, Text, View, TextInput, Alert } from "react-native";
import recipesService from "../../services/recipe-service";
import userService from "../../services/user-service";
import { useRecipe } from "../../context/RecipeContext";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { CreateRecipe } from "../../types/create-recipe";
import { useRoute } from "@react-navigation/native";
import { useCallback } from "react";
import { useFocusEffect } from "expo-router";
import { DrawerParamList } from "../../types/navigation";
import { InfoRecipe } from "../../types/info-recipe";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Keyboard } from "react-native";

const NewRecipe = () => {
  const { data, setName, setPreparation, resetRecipe, addRecipe, setIngredients, updateRecipeInList } = useRecipe();
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  type NewRecipeRouteProp = RouteProp<DrawerParamList, "NewRecipe">;
  const route = useRoute<NewRecipeRouteProp>();
  const { mode, recipeId } = route.params || {};

  useFocusEffect(
    useCallback(() => {
      if (mode === "edit" && recipeId && data.ingredients.length === 0) {
        try {
          const fetchInfo = async () => {
            const res = await recipesService.getRecipeById(recipeId);
            if (!res?.data) return;
            setName(res.data.name);
            setPreparation(res.data.preparation);
            const formattedIngredients = res.data.ingredients.map((ing: any) => ({
              ingredientId: ing.id,
              name: ing.name,
              quantity: ing.quantity,
              quantityCalories: ing.quantityCalories,
            }));
            setIngredients(formattedIngredients);
          };
          fetchInfo();
        } catch (err) {
          console.error("Error al cargar receta:", err);
        }
      }
    }, [mode, recipeId, data.ingredients.length, setName, setPreparation, setIngredients])
  );

  const deleteIngredient = (ingredientId: number) => {
    setIngredients(data.ingredients.filter((ing) => ing.ingredientId !== ingredientId));
  };

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
      const idUser = (await userService.getInfoUser()).id;
      const recipeToSend: CreateRecipe = {
        name: data.name,
        preparation: data.preparation,
        userId: idUser,
        ingredients: data.ingredients.map((i) => ({
          ingredientId: i.ingredientId,
          quantity: i.quantity,
        })),
      };

      if (mode === "edit" && recipeId) {
        await recipesService.updateRecipe(recipeId, recipeToSend);
        const recipeEdit: InfoRecipe = {
          id: recipeId,
          name: data.name,
          preparation: data.preparation,
          ingredients: data.ingredients.map((i) => ({
            id: i.ingredientId,
            name: i.name ?? "",
            quantity: i.quantity,
            quantityCalories: i.quantityCalories ?? 0,
          })),
        };
        updateRecipeInList(recipeEdit);
        Alert.alert("Éxito", "Receta actualizada");
      } else {
        const created = await recipesService.createRecipe(recipeToSend);
        if (created) {
          const recipesUpdated = await recipesService.getAllRecipesByUser();
          if (recipesUpdated == null) return;
          const newRecipe = recipesUpdated.data[recipesUpdated.data.length - 1];
          addRecipe(newRecipe);
        }
        Alert.alert("Éxito", "Receta creada");
      }

      resetRecipe();
      navigation.navigate("Recetas");
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "No se pudo guardar la receta, puede que ya exista una receta con ese nombre, intente nuevamente");
    }
  };

  return (
    <View style={styles.container}>
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
    textAlign: "center",
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
