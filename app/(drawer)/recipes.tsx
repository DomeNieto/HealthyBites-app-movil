import { Alert, FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useCallback, useEffect, useState } from "react";
import { InfoRecipe } from "../../types/info-recipe";
import recipesService from "../../services/recipe-service";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useRecipe } from "../../context/RecipeContext";
import { useNavigation } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { DrawerParamList } from "../../types/navigation";
import * as Progress from "react-native-progress";
import { calculateRecommendedCalories, cleanEmail } from "../../utitlity/utility";
import userService from "../../services/user-service";
import asyncStorageService from "../../services/async-storage-service";

const RecipesPage = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { recipesData, fetchRecipes, deleteRecipeInList } = useRecipe();
  const [recommendedDailyCalories, setRecommendedDailyCalories] = useState(1500);
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();

  /* The above code snippet is a `useEffect` hook in a TypeScript React component. It is fetching
  recipes and then calculating the recommended daily calories for a user based on their personal
  information such as sex, weight, height, age, and activity level. */
  useEffect(() => {
    fetchRecipes();
    const getCalories = async () => {
      try {
        const emailStored = await asyncStorageService.getInfoStorage(asyncStorageService.KEYS.userEmail);
        if (!emailStored) {
          console.error("Error", "Email no encontrado.");
          return;
        }
        const email = cleanEmail(emailStored);
        if (!email) {
          console.error("Error", "Email no válido.");
          return;
        }

        const fullInfo = await userService.getUserByEmail(email);
        if (!fullInfo) {
          console.error("Error", "Usuario no encontrado.");
          return;
        }
        const totalCaloriesRecomended = await calculateRecommendedCalories(fullInfo);
        if (totalCaloriesRecomended) {
          setRecommendedDailyCalories(totalCaloriesRecomended);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getCalories();
  }, []);

  /* The `totalCalories` constant is calculating the total number of calories for the selected recipes. */
  const totalCalories = recipesData
    .filter((recipe) => selectedIds.includes(recipe.id))
    .reduce((sumRecipes, recipe) => sumRecipes + recipe.ingredients.reduce((sumIngs, ing) => sumIngs + ing.quantityCalories, 0), 0);

  /**
   * The `toggleSelect` function toggles the selection of an item with the given ID in a list of selected
   * IDs.
   * @param {number} id - The `id` parameter in the `toggleSelect` function is a number that represents
   * the identifier of an item that you want to toggle the selection status for.
   */
  const toggleSelect = (id: number) => {
    const isSelected = selectedIds.includes(id);
    setSelectedIds(isSelected ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]);
  };

  const progress = Math.min(totalCalories / recommendedDailyCalories, 1);

  let progressColor = "#4caf50";

  if (totalCalories > recommendedDailyCalories) {
    progressColor = "#f44336";
  } else if (totalCalories > recommendedDailyCalories * 0.75) {
    progressColor = "#ff9800";
  }

  /**
   * The function `deleteRecipe` prompts the user with a confirmation alert before deleting a recipe
   * with a specific ID.
   * @param {number} id - The `id` parameter in the `deleteRecipe` function is the unique identifier of
   * the recipe that you want to delete. This identifier is used to locate and delete the specific
   * recipe from the list of recipes.
   */
  const deleteRecipe = async (id: number) => {
    const message = "¿Está seguro que quiere eliminar el registro con ID: " + id + "?";
    Alert.alert("Alert", message, [
      {
        text: "Cancelar",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Ok",
        onPress: async () => {
          const res = await recipesService.deleteRecipe(id);
          if (res == null) return;
          deleteRecipeInList(id);
        },
        style: "destructive",
      },
    ]);
  };

  /* The above code is a TypeScript React component that renders a recipe item. It calculates the total
  calories of the recipe based on the ingredients, checks if the recipe is selected, displays the
  recipe name, ingredients, preparation steps, edit and delete buttons, and the total number of
  calories. The component also includes functionality to toggle the selection of the recipe, edit
  the recipe, and delete the recipe. */
  const renderItem = ({ item }: { item: InfoRecipe }) => {
    const recipeCal = item.ingredients.reduce((sum, ing) => sum + ing.quantityCalories, 0);
    const selected = selectedIds.includes(item.id);
    return (
      <View style={styles.recipesContainer}>
        <View style={styles.cardHeader}>
          <Text style={styles.recipeTitle}>{item.name}</Text>
          <Pressable onPress={() => toggleSelect(item.id)}>
            <Text style={styles.checkboxText}>
              {selected ? <MaterialCommunityIcons name="checkbox-blank-circle" size={24} color="blue" /> : <MaterialCommunityIcons name="checkbox-blank-circle-outline" size={24} color="black" />}
            </Text>
          </Pressable>
        </View>
        <Text>Ingredientes:</Text>
        <View style={styles.ingredientsList}>
          {item.ingredients.map((ing) => (
            <Text key={ing.id} style={styles.ingredientName}>
              {ing.quantity} {ing.name}
            </Text>
          ))}
        </View>

        <Text>Preparación:</Text>
        <Text style={styles.preparation}>{item.preparation}</Text>
        <View style={{ flexDirection: "row", marginTop: 10 }}>
          <View style={styles.buttomEdit}>
            <Pressable onPress={() => navigation.navigate("NewRecipe", { mode: "edit", recipeId: item.id })}>
              <FontAwesome5 name="edit" size={20} color="white" />
            </Pressable>
          </View>
          <View style={styles.buttomTrash}>
            <Pressable onPress={() => deleteRecipe(item.id)}>
              <FontAwesome6 name="trash-can" size={20} color="white" />
            </Pressable>
          </View>
        </View>
        <Text style={styles.caloriesText}>Nº Calorías: {recipeCal}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.header}>
          <Text>Total Calorías:</Text>
          <Text style={styles.headerValue}>{totalCalories}</Text>
        </View>
        <Pressable style={styles.createButton} onPress={() => navigation.navigate({ name: "NewRecipe", params: {} })}>
          <Text style={styles.createButtonText}>+ Crear</Text>
        </Pressable>
      </View>

      <FlatList
        data={recipesData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>🍽️</Text>
            <Text style={styles.emptyTitle}>¡Ups! No hay recetas disponibles</Text>
            <Text style={styles.emptyMessage}>¡No pases hambre!</Text>
            <Text style={styles.emptySuggestion}>
              Pulsa <Text style={{ fontWeight: "bold" }}>+ Crear</Text> y empieza a añadir nuevas recetas 🧑‍🍳✨
            </Text>
          </View>
        )}
      />
      <View style={{ alignItems: "center", marginTop: 20 }}>
        <Progress.Bar progress={progress} width={300} color={progressColor} borderRadius={10} height={20} unfilledColor="#ddd" borderWidth={0} />
        <Text style={[styles.progressText, { color: progressColor }]}>
          {totalCalories > recommendedDailyCalories
            ? `Has excedido tu límite calórico diario (${recommendedDailyCalories.toFixed(0)} cal)`
            : totalCalories > recommendedDailyCalories * 0.75
            ? `Casi alcanzas tu límite diario (${recommendedDailyCalories.toFixed(0)} cal)`
            : `Estás dentro de tu límite calórico diario (${recommendedDailyCalories.toFixed(0)} cal)`}
        </Text>
      </View>
    </View>
  );
};

export default RecipesPage;

const styles = StyleSheet.create({
  caloriesText: {
    alignSelf: "flex-end",
    marginTop: -30,
    marginBottom: 10,
  },
  buttomEdit: {
    margin: 5,
    backgroundColor: "#FF9500",
    padding: 5,
    borderRadius: 5,
  },
  buttomTrash: {
    margin: 5,
    backgroundColor: "#FF3B30",
    padding: 5,
    borderRadius: 5,
  },
  progressText: {
    marginTop: 8,
    fontWeight: "bold",
    textAlign: "center",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
    paddingHorizontal: 30,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 10,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  emptyMessage: {
    fontSize: 26,
    color: "#666",
    textAlign: "center",
    marginBottom: 5,
  },
  emptySuggestion: {
    fontSize: 15,
    color: "#444",
    textAlign: "center",
    marginTop: 10,
  },

  ingredientsList: {
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 14,
    fontFamily: "InstrumentSans-Regular",
  },
  preparation: {
    fontSize: 14,
    fontFamily: "InstrumentSans-Regular",
    color: "#333",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    marginBottom: 15,
  },
  row: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  headerText: {
    fontSize: 18,
    fontFamily: "InstrumentSans-Bold",
  },
  headerValue: {
    fontSize: 18,
    fontFamily: "InstrumentSans-Bold",
  },
  createButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignSelf: "flex-end",
    marginBottom: 10,
  },
  createButtonText: {
    color: "#723694",
    fontFamily: "InstrumentSans-Bold",
    fontSize: 20,
  },
  list: {
    paddingBottom: 20,
  },
  recipesContainer: {
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
    width: "80%",
  },
  recipeInfo: {
    fontSize: 16,
    fontFamily: "InstrumentSans-Regular",
  },
});
