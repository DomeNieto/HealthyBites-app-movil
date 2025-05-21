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
import userService from "../../services/user-service";
import * as Progress from 'react-native-progress';


const RecipesPage = () => {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const { recipesData, fetchRecipes, deleteRecipeInList } = useRecipe();
  const [recommendedDailyCalories, setRecommendedDailyCalories] = useState(1500);
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  
  useEffect(() => {
    fetchRecipes();
    // console.log('recipesData IDs:', recipesData.map(r => r.id));
    const calculateRecommendedCalories = async () => {
      try {
        const fullInfo = await userService.getInfoUser();

        if (!fullInfo || !fullInfo.infoUser) {
          throw new Error("Datos de usuario incompletos o inválidos");
        }

        const { sex, weight, height, age, activityLevel } = fullInfo.infoUser;

        const weightNum = Number(weight);
        const heightNum = Number(height);
        const ageNum = Number(age);
        const activityLevelNormalized = activityLevel?.toLowerCase();
        const sexNormalized = sex?.toLowerCase();

        if (
          !sexNormalized ||
          isNaN(weightNum) ||
          isNaN(heightNum) ||
          isNaN(ageNum) ||
          !activityLevelNormalized
        ) {
          throw new Error("Datos de usuario incompletos o inválidos");
        }

        const factoresActividad: Record<string, number> = {
          baja: 1.2,
          moderada: 1.55,
          alta: 1.725,
        };

        const factorActividad = factoresActividad[activityLevelNormalized] || 1.2;

        let tmb = 0;
        if (sexNormalized === "femenino") {
          tmb = 10 * weightNum + 6.25 * heightNum - 5 * ageNum - 161;
        } else {
          tmb = 10 * weightNum + 6.25 * heightNum - 5 * ageNum + 5;
        }

        const totalCaloriesRecomendadas = tmb * factorActividad;
        setRecommendedDailyCalories(totalCaloriesRecomendadas);
      } catch (error) {
        console.error("Error al obtener info usuario o calcular calorías:", error);
        setRecommendedDailyCalories(1500); 
      }
    };



    calculateRecommendedCalories();
  }, []);

  const totalCalories = recipesData
  .filter((recipe) => selectedIds.includes(recipe.id))
  .reduce(
    (sumRecipes, recipe) => sumRecipes + recipe.ingredients.reduce((sumIngs, ing) => sumIngs + ing.quantityCalories, 0),
    0
  );

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
              {ing.quantity}  {ing.name}  
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
        <Pressable style={styles.createButton}  onPress={() => navigation.navigate({ name: "NewRecipe", params: {} }) }>
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
      <View style={{ alignItems: 'center', marginTop: 20 }}>
      <Progress.Bar
        progress={progress}
        width={300}
        color={progressColor}
        borderRadius={10}
        height={20}
        unfilledColor="#ddd"
        borderWidth={0}
      />
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
    marginBottom: 10 
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
