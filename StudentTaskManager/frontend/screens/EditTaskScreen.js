import { useCallback, useReducer, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CustomButton from '../components/CustomButton';
import CustomInput from '../components/CustomInput';
import { useTaskContext } from '../context/TaskContext';
import Colors from '../styling/Colors';
import globalStyles from '../styling/globalStyles';

function createInitialForm(task = {}) {
  return {
    title: task.title || '',
    subject: task.subject || '',
    description: task.description || '',
    completed: Boolean(task.completed),
  };
}

function formReducer(state, action) {
  if (action.type === 'change') {
    return { ...state, [action.field]: action.value };
  }

  return state;
}

export default function EditTaskScreen({ navigation, route }) {
  const task = route.params?.task;
  const [form, dispatch] = useReducer(formReducer, task, createInitialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { editTask } = useTaskContext();

  const updateField = useCallback((field, value) => {
    dispatch({ type: 'change', field, value });
  }, []);

  const handleSave = useCallback(async () => {
    setError('');
    setSaving(true);

    try {
      await editTask(task.id, form);
      Alert.alert('Changes saved', 'Your task was updated successfully.');
      navigation.goBack();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }, [editTask, form, navigation, task]);

  if (!task) {
    return (
      <View style={[globalStyles.screen, styles.missingTask]}>
        <Text style={globalStyles.pageTitle}>Task not found</Text>
        <Text style={globalStyles.pageSubtitle}>
          Return to your task list and choose a task to edit.
        </Text>
        <View style={styles.backButton}>
          <CustomButton
            title="Back to my tasks"
            onPress={navigation.goBack}
          />
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={globalStyles.screen}
    >
      <ScrollView
        contentContainerStyle={globalStyles.pageContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={globalStyles.pageTitle}>Edit task</Text>
        <Text style={globalStyles.pageSubtitle}>
          Update the task details and save your changes.
        </Text>

        <View style={styles.form}>
          <CustomInput
            label="Task title"
            value={form.title}
            onChangeText={(value) => updateField('title', value)}
            placeholder="Task title"
            maxLength={160}
          />
          <CustomInput
            label="Subject name"
            value={form.subject}
            onChangeText={(value) => updateField('subject', value)}
            placeholder="Subject name"
            maxLength={120}
          />
          <CustomInput
            label="Description"
            value={form.description}
            onChangeText={(value) => updateField('description', value)}
            placeholder="Add any useful details (optional)"
            multiline
            numberOfLines={4}
            maxLength={2000}
          />

          <Text style={styles.fieldLabel}>Status</Text>
          <View style={styles.statusOptions}>
            <View style={styles.statusOption}>
              <CustomButton
                title="Pending"
                variant={form.completed ? 'secondary' : 'primary'}
                onPress={() => updateField('completed', false)}
              />
            </View>
            <View style={styles.statusOption}>
              <CustomButton
                title="Completed"
                variant={form.completed ? 'primary' : 'secondary'}
                onPress={() => updateField('completed', true)}
              />
            </View>
          </View>

          {error ? (
            <Text accessibilityRole="alert" style={[globalStyles.errorText, styles.error]}>
              {error}
            </Text>
          ) : null}

          <View style={styles.saveButton}>
            <CustomButton
              title="Save changes"
              onPress={handleSave}
              loading={saving}
              disabled={!form.title.trim() || !form.subject.trim()}
            />
          </View>
          <CustomButton
            title="Cancel"
            variant="secondary"
            onPress={navigation.goBack}
            disabled={saving}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  form: {
    marginTop: 28,
  },
  fieldLabel: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  statusOptions: {
    flexDirection: 'row',
    gap: 10,
  },
  statusOption: {
    flex: 1,
  },
  error: {
    marginTop: 18,
  },
  saveButton: {
    marginBottom: 10,
    marginTop: 24,
  },
  missingTask: {
    justifyContent: 'center',
    paddingHorizontal: 22,
  },
  backButton: {
    marginTop: 24,
  },
});
