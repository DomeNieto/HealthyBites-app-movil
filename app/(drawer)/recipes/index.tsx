import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { InfoRecipe } from "../../../types/info-recipe";
import recipesService from "../../../services/recipe-service";
import { useNavigation } from "@react-navigation/native"; 

const RecipesPage = () => {
  const [recipes, setRecipes] = useState<InfoRecipe[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const navigation = useNavigation();
  useEffect(() => {
    async function fetchRecipes() {
      const res = await recipesService.getAllRecipesByUser();
      if (res == null) return;
      setRecipes(res.data);
    }
    fetchRecipes();
  }, []);

  const totalCalories = selectedIds.reduce((total, id) => {
    const recipe = recipes.find((r) => r.id === id);
    if (!recipe) return total;
    const recipeCal = recipe.ingredients.reduce(
      (sum, ing) => sum + ing.quantityCalories
    );
    return total + recipeCal;
  }, 0);

  const toggleSelect = (id: number) => {
    // TODO: Implementar Lógica para seleccionar recetas 
  };

  const renderItem = ({ item }: { item: InfoRecipe }) => {
    const recipeCal = item.ingredients.reduce(
      (sum, ing) => sum + ing.quantityCalories,
      0
    );
    const selected = selectedIds.includes(item.id);
    return (
      <View style={styles.recipesContainer}>
        <Pressable
          style={styles.checkbox}
          onPress={() => toggleSelect(item.id)}
        >
          <Text style={styles.checkboxText}>{selected ? "☑︎" : "☐"}</Text>
        </Pressable>
        <View style={styles.info}>
          <Text style={styles.recipeTitle}>{item.name}</Text>
          <Text style={styles.recipeInfo}>{recipeCal} kcal</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.headerText}>Total Calorías:</Text>
        <Text style={styles.headerValue}>{totalCalories}</Text>
      </View>

      <Pressable
        style={styles.createButton}
        onPress={() => navigation.navigate('NewRecipe')}  
      >
        <Text style={styles.createButtonText}>+ Crear</Text>
      </Pressable>

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export default RecipesPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  headerText: {
    fontSize: 18,
    fontFamily: "InstrumentSans-Bold",
  },
  headerValue: {
    fontSize: 18,
    fontFamily: "InstrumentSans-Bold",
    color: "#723694",
  },
  createButton: {
    backgroundColor: "#723694",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  createButtonText: {
    color: "#fff",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 16,
  },
  list: {
    paddingBottom: 20,
  },
  recipesContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F6E7FF",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  checkbox: {
    marginRight: 12,
  },
  checkboxText: {
    fontSize: 20,
  },
  info: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  recipeTitle: {
    fontSize: 16,
    fontFamily: "InstrumentSans-Bold",
  },
  recipeInfo: {
    fontSize: 16,
    fontFamily: "InstrumentSans-Regular",
  },
});
