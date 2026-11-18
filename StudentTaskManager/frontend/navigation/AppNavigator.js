import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, BackHandler, View } from 'react-native';
import AddTaskScreen from '../screens/AddTaskScreen';
import EditTaskScreen from '../screens/EditTaskScreen';
import HomeScreen from '../screens/HomeScreen';
import MyTasksScreen from '../screens/MyTasksScreen';
import { useTaskContext } from '../context/TaskContext';
import Colors from '../styling/Colors';

export function AppNavigator() {
  const { authLoading, user } = useTaskContext();
  const [routes, setRoutes] = useState([{ name: 'Home', params: {} }]);
  const currentRoute = routes[routes.length - 1];

  const navigate = useCallback((name, params = {}) => {
    setRoutes((currentRoutes) => [...currentRoutes, { name, params }]);
  }, []);

  const goBack = useCallback(() => {
    setRoutes((currentRoutes) =>
      currentRoutes.length > 1
        ? currentRoutes.slice(0, currentRoutes.length - 1)
        : currentRoutes,
    );
  }, []);

  const navigation = useMemo(() => ({ navigate, goBack }), [navigate, goBack]);

  useEffect(() => {
    if (!user && routes.length > 1) {
      setRoutes([{ name: 'Home', params: {} }]);
    }
  }, [user, routes.length]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (routes.length > 1) {
          goBack();
          return true;
        }

        return false;
      },
    );

    return () => subscription.remove();
  }, [goBack, routes.length]);

  let screen;

  switch (currentRoute.name) {
    case 'AddTask':
      screen = <AddTaskScreen navigation={navigation} />;
      break;
    case 'MyTasks':
      screen = <MyTasksScreen navigation={navigation} />;
      break;
    case 'EditTask':
      screen = (
        <EditTaskScreen
          navigation={navigation}
          route={{ params: currentRoute.params }}
        />
      );
      break;
    default:
      screen = <HomeScreen navigation={navigation} />;
  }

  if (authLoading) {
    return (
      <View
        style={{
          alignItems: 'center',
          backgroundColor: Colors.background,
          flex: 1,
          justifyContent: 'center',
        }}
      >
        <ActivityIndicator color={Colors.primary} size="large" />
      </View>
    );
  }

  return screen;
}
