import { createDrawerNavigator } from '@react-navigation/drawer';
import Home from './home';

const Drawer = createDrawerNavigator();

function MyDrawer() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={Home} />
    </Drawer.Navigator>
  );
}

export default MyDrawer