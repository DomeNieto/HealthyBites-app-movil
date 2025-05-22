import { createDrawerNavigator } from "@react-navigation/drawer";
import React from "react";
import HomePage from "./home";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Entypo from "@expo/vector-icons/Entypo";
import Ionicons from "@expo/vector-icons/Ionicons";
import RececipesPage from "./recipes";
import SettingsPage from "./settings";
import LogoutScreen from "./logout";
import NewRecipe from "./new-recipe";
import AddIngredient from "./add-ingredient";
import { RecipeProvider } from "../../context/RecipeContext";

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <RecipeProvider>
      <Drawer.Navigator>
        <Drawer.Screen
          name="Home"
          component={HomePage}
          options={{
            headerTitleAlign: "left",
            headerTintColor: "black",
            headerStyle: { backgroundColor: "#EDDCFF" },
            drawerIcon: () => (
              <MaterialIcons name="home-filled" size={24} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="Recetas"
          component={RececipesPage}
          options={{
            headerTintColor: "black",
            headerTitleAlign: "left",
            headerStyle: {
              backgroundColor: "#EDDCFF",
            },
            drawerIcon: () => <Entypo name="bowl" size={24} color="black" />,
          }}
        />
        <Drawer.Screen
          name="Ajustes"
          component={SettingsPage}
          options={{
            title: "Ajustes de Perfil",
            headerTintColor: "black",
            headerTitleAlign: "left",
            headerStyle: {
              backgroundColor: "#EDDCFF",
            },
            drawerIcon: () => (
              <MaterialIcons name="home-filled" size={24} color="black" />
            ),
          }}
        />
        <Drawer.Screen
          name="Cierre de Sesión"
          component={LogoutScreen}
          options={{
            headerShown: false,
            drawerIcon: () => <Ionicons name="exit" size={24} color="black" />,
          }}
        />

        <Drawer.Screen
          name="NewRecipe"
          component={NewRecipe}
          options={{
            drawerItemStyle: { display: "none" },
            headerTintColor: "black",
            headerTitleAlign: "left",
            headerStyle: {
              backgroundColor: "#EDDCFF",
            },
            headerTitle: "Recetas",
          }}
        />
        <Drawer.Screen
          name="addIngredient"
          component={AddIngredient}
          options={{
            drawerItemStyle: { display: "none" },
            headerTintColor: "black",
            headerTitleAlign: "left",
            headerStyle: {
              backgroundColor: "#EDDCFF",
            },
            headerTitle: "Recetas",
          }}
        />
      </Drawer.Navigator>
    </RecipeProvider>
  );
}

export default MyDrawer;
