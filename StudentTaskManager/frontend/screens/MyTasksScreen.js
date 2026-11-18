import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import TaskCard from '../components/TaskCard';
import { useTaskContext } from '../context/TaskContext';
import Colors from '../styling/Colors';
import globalStyles from '../styling/globalStyles';

export default function MyTasksScreen({ navigation }) {
  const { tasks, tasksLoading, taskError, editTask, removeTask } =
    useTaskContext();
  const [actionError, setActionError] = useState('');

  const handleEdit = useCallback(
    (task) => navigation.navigate('EditTask', { task }),
    [navigation],
  );

  const handleDelete = useCallback(
    async (taskId) => {
      setActionError('');

      try {
        await removeTask(taskId);
      } catch (error) {
        setActionError(error.message);
      }
    },
    [removeTask],
  );

  const handleMarkCompleted = useCallback(
    async (taskId) => {
      setActionError('');

      try {
        await editTask(taskId, { completed: true });
      } catch (error) {
        setActionError(error.message);
      }
    },
    [editTask],
  );

  const renderTask = useCallback(
    ({ item }) => (
      <TaskCard
        task={item}
        onEdit={() => handleEdit(item)}
        onDelete={() => handleDelete(item.id)}
        onMarkCompleted={() => handleMarkCompleted(item.id)}
      />
    ),
    [handleDelete, handleEdit, handleMarkCompleted],
  );

  const listHeader = (
    <View style={styles.header}>
      <Text style={globalStyles.pageTitle}>My tasks</Text>
      <Text style={globalStyles.pageSubtitle}>
        Review, update, and complete your study tasks.
      </Text>
      {taskError || actionError ? (
        <Text accessibilityRole="alert" style={[globalStyles.errorText, styles.error]}>
          {actionError || `Unable to load your tasks: ${taskError}`}
        </Text>
      ) : null}
      <View style={styles.dashboardButton}>
        <CustomButton
          title="Back to dashboard"
          variant="secondary"
          onPress={navigation.goBack}
        />
      </View>
      <View style={styles.addButton}>
        <CustomButton
          title="Add a new task"
          onPress={() => navigation.navigate('AddTask')}
        />
      </View>
      {tasksLoading ? (
        <ActivityIndicator
          accessibilityLabel="Loading tasks"
          color={Colors.primary}
          style={styles.loading}
        />
      ) : null}
    </View>
  );

  const emptyList = (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No tasks yet</Text>
      <Text style={styles.emptyMessage}>
        Add your first study task to see it here.
      </Text>
    </View>
  );

  return (
    <FlatList
      contentContainerStyle={[
        globalStyles.pageContent,
        !tasks.length && styles.fillList,
      ]}
      data={tasks}
      keyExtractor={(task) => task.id}
      ListEmptyComponent={tasksLoading ? null : emptyList}
      ListHeaderComponent={listHeader}
      renderItem={renderTask}
      style={globalStyles.screen}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    marginBottom: 18,
  },
  error: {
    marginTop: 16,
  },
  dashboardButton: {
    marginTop: 18,
  },
  addButton: {
    marginTop: 10,
  },
  loading: {
    marginTop: 20,
  },
  fillList: {
    flexGrow: 1,
  },
  emptyState: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginTop: 8,
    paddingHorizontal: 22,
    paddingVertical: 30,
  },
  emptyTitle: {
    color: Colors.text,
    fontSize: 17,
    fontWeight: '700',
  },
  emptyMessage: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 7,
    textAlign: 'center',
  },
});
