import { FlatList, Pressable, StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import { useNavigation } from "expo-router";

const NewRecipe = () => {
  const [ingredients, setIngredients] = useState<{ name: string; quantity: string }[]>([]);
  const navigation = useNavigation();
  const [data, setData] = useState({
    name: "",
    preparation: "",
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nueva Receta</Text>

      <Text style={styles.labelTitle}>Nombre</Text>
      <TextInput
        style={styles.input}
        value={data.name}
        onChangeText={(txt) => setData((prev) => ({ ...prev, name: txt }))}
        placeholder="Nombre"
      />

      <View style={styles.row}>
        <Text style={styles.label}>Ingredientes</Text>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.addButtonPressed,
          ]}
          onPress={() => navigation.navigate('addIngredient')}
        >
          <Text style={styles.addButtonText}>Añadir +</Text>
        </Pressable>
      </View>

      <FlatList
        data={ingredients}
        keyExtractor={(_, idx) => idx.toString()}
        style={styles.list}
        renderItem={({ item }) => (
          <View style={styles.ingredientRow}>
            <Text style={styles.ingredientName}>{item.name}</Text>
            <Text style={styles.ingredientQty}>{item.quantity}</Text>
          </View>
        )}
      />

      <Text style={styles.labelTitle}>Preparación</Text>
      <TextInput
        style={[styles.input, styles.prepInput]}
        value={data.preparation}
        onChangeText={(txt) =>
          setData((prev) => ({ ...prev, preparation: txt }))
        }
        placeholder="Escriba la receta ..."
        multiline
      />

      <Pressable style={styles.button}>
        <Text style={styles.buttonText}>Guardar</Text>
      </Pressable>
    </View>
  );
};

export default NewRecipe;

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
