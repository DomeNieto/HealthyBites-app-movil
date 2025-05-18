import { FlatList, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useEffect, useState } from "react";
import ingredientService from "../../services/ingredient-service";
import { useRecipe } from "../../context/RecipeContext";
import { useNavigation } from "@react-navigation/native";
import { useRoute, RouteProp } from "@react-navigation/native";
import { DrawerParamList } from "../../types/navigation";
import { DrawerNavigationProp } from "@react-navigation/drawer";


type AddIngredientRouteProp = RouteProp<DrawerParamList, "addIngredient">;

const AddIngredient = () => {
  const { addIngredient } = useRecipe();
  const [all, setAll] = useState<{ id: number; name: string }[]>([]);
  const [filter, setFilter] = useState("");
  const [selected, setSelected] = useState<{ id: number; name: string } | null>(null);
  const [quantity, setQuantity] = useState("");

  const route = useRoute<AddIngredientRouteProp>();
  const { mode, recipeId } = route.params || {};

  useEffect(() => {
    ingredientService.getAllIngredients().then(setAll);
  }, []);

  const filtered = all.filter((i) => i.name.toLowerCase().includes(filter.toLowerCase()));
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const onAdd = () => {
    if (selected && quantity) {
      addIngredient({
        ingredientId: selected.id,
        name: selected.name,
        quantity: Number(quantity),
      });
      navigation.navigate("NewRecipe", { mode, recipeId });
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
          <TextInput style={styles.input} placeholder="Cantidad (ej. 100.0)" keyboardType="numeric" value={quantity} onChangeText={setQuantity} />

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
