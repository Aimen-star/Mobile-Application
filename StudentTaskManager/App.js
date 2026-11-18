import { StatusBar } from 'expo-status-bar';
import { AppNavigator } from './frontend/navigation/AppNavigator';
import { TaskProvider } from './frontend/context/TaskContext';

export default function App() {
  return (
    <TaskProvider>
      <StatusBar style="dark" />
      <AppNavigator />
    </TaskProvider>
  );
}
