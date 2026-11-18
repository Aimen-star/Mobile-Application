import { useCallback, useEffect, useReducer, useRef, useState } from 'react';
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

const initialForm = {
  title: '',
  subject: '',
  description: '',
  completed: false,
};

function formReducer(state, action) {
  if (action.type === 'change') {
    return { ...state, [action.field]: action.value };
  }

  return state;
}

export default function AddTaskScreen({ navigation }) {
  const [form, dispatch] = useReducer(formReducer, initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const titleInputRef = useRef(null);
  const { addTask } = useTaskContext();

  useEffect(() => {
    titleInputRef.current?.focus();
  }, []);

  const updateField = useCallback((field, value) => {
    dispatch({ type: 'change', field, value });
  }, []);

  const handleSave = useCallback(async () => {
    setError('');
    setSaving(true);

    try {
      await addTask(form);
      Alert.alert('Task saved', 'Your task was added successfully.');
      navigation.goBack();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
  }, [addTask, form, navigation]);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={globalStyles.screen}
    >
      <ScrollView
        contentContainerStyle={globalStyles.pageContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={globalStyles.pageTitle}>Add a task</Text>
        <Text style={globalStyles.pageSubtitle}>
          Add the details so you can keep your studies on track.
        </Text>

        <View style={styles.form}>
          <CustomInput
            inputRef={titleInputRef}
            label="Task title"
            value={form.title}
            onChangeText={(value) => updateField('title', value)}
            placeholder="e.g. Review lecture notes"
            maxLength={160}
          />
          <CustomInput
            label="Subject name"
            value={form.subject}
            onChangeText={(value) => updateField('subject', value)}
            placeholder="e.g. Mobile Application Development"
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
            <StatusOption
              label="Pending"
              selected={!form.completed}
              onPress={() => updateField('completed', false)}
            />
            <StatusOption
              label="Completed"
              selected={form.completed}
              onPress={() => updateField('completed', true)}
            />
          </View>

          {error ? (
            <Text accessibilityRole="alert" style={[globalStyles.errorText, styles.error]}>
              {error}
            </Text>
          ) : null}

          <View style={styles.saveButton}>
            <CustomButton
              title="Save task"
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

function StatusOption({ label, selected, onPress }) {
  return (
    <View style={styles.statusOption}>
      <CustomButton
        title={label}
        variant={selected ? 'primary' : 'secondary'}
        onPress={onPress}
      />
    </View>
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
});
