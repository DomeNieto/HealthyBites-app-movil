import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import ingredientService from "../../services/ingredient-service";
import { useRecipe } from "../../context/RecipeContext";
import { useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { DrawerParamList } from "../../types/navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { Keyboard } from "react-native";

type AddIngredientRouteProp = RouteProp<DrawerParamList, "addIngredient">;

/**
 * AddIngredient is a React component that allows users to add ingredients to a recipe.
 * @returns 
 */
const AddIngredient = () => {
  const { addIngredient } = useRecipe();
  const [ingredientsList, setIngredientsList] = useState<{ id: number; name: string }[]>([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<{ id: number; name: string, quantityCalories?: number } | null>(null);
  const [quantity, setQuantity] = useState("");
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  /**
   * The `useRoute` hook is used to access the route parameters passed to this screen.
   * It retrieves the `mode` and `recipeId` from the route parameters.
   */
  const route = useRoute<AddIngredientRouteProp>();
  const { mode, recipeId } = route.params;

  /**
   * The `useEffect` hook is used to fetch the list of ingredients when the component mounts.
   * It calls the `getAllIngredients` function from the `ingredientService` and sets the
   * `ingredientsList` state with the fetched data.
   */
  useEffect(() => {
    const fetchIngredients = async () => {
      const ingredients = await ingredientService.getAllIngredients();
      if (!ingredients) {
        console.log("No se encontraron ingredientes");
        return;
      }
      setIngredientsList(ingredients);
    };
    fetchIngredients();

  }, []);

  /*  filtering the `all` array based on the ingredient name  */
  const filtered = ingredientsList.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase()));
  

  /**
   * The `onAdd` function is called when the user presses the "Añadir" button.
   * It checks if an ingredient is selected and a quantity is provided.
   * If so, it calls the `addIngredient` function from the `RecipeContext` to add the ingredient
   * to the recipe and navigates back to the "NewRecipe" screen.
   */
  const onAdd = () => {
    if (selected && quantity) {
      addIngredient({
        ingredientId: selected.id,
        name: selected.name,
        quantity: Number(quantity),
        quantityCalories: selected.quantityCalories ?? 0,
      });
      navigation.navigate("NewRecipe", { mode, recipeId });
      setQuantity("");
      setSelected(null);
    }
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Añadir Ingrediente</Text>

      <Text style={styles.labelTitle}>Buscar Ingrediente</Text>
      <TextInput style={styles.input} placeholder="Nombre" value={filter} onChangeText={setFilter} />

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.filteredRow}>
            <Text style={styles.ingredientName}>{item.name}</Text>
            <Pressable style={({ pressed }) => [styles.selectButton, pressed && styles.selectButtonPressed]} onPress={() => setSelected(item)}>
              <Text style={styles.selectButtonText}>Seleccionar</Text>
            </Pressable>
          </View>
        )}
      />

      {selected && (
        <>
          <Text style={styles.labelTitle}>Cantidad en gr/lts/und</Text>
          <Text style={styles.labelTitle}>Cantidad para: {selected.name}</Text>
          <TextInput
            style={styles.input}
            placeholder="Cantidad (ej. 100.0)"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
            returnKeyType="done"
            onSubmitEditing={Keyboard.dismiss}
          />

          <Pressable style={styles.button} onPress={onAdd}>
            <Text style={styles.buttonText}>Añadir</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};

export default AddIngredient;

const styles = StyleSheet.create({
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
  filteredRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
  },
  ingredientName: {
    fontSize: 14,
    fontFamily: "InstrumentSans-Regular",
  },
  selectButton: {
    backgroundColor: "#723694",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
    justifyContent: "center",
  },
  selectButtonPressed: {
    backgroundColor: "#C564FE",
  },
  selectButtonText: {
    color: "#fff",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 12,
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#bbb",
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
