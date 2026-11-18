import { useCallback, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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

function TaskSummary({ label, value, color }) {
  return (
    <View style={styles.summaryCard}>
      <Text style={[styles.summaryValue, { color }]}>{value}</Text>
      <Text style={styles.summaryLabel}>{label}</Text>
    </View>
  );
}

export default function HomeScreen({ navigation }) {
  const {
    user,
    tasks,
    authLoading,
    tasksLoading,
    taskError,
    register,
    logIn,
    logOut,
  } = useTaskContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [authError, setAuthError] = useState('');

  const summary = useMemo(() => {
    const completed = tasks.filter((task) => task.completed).length;

    return {
      total: tasks.length,
      completed,
      pending: tasks.length - completed,
    };
  }, [tasks]);

  const handleAuthentication = useCallback(async () => {
    setAuthError('');
    setIsSubmitting(true);

    try {
      if (isRegistering) {
        await register(email, password);
      } else {
        await logIn(email, password);
      }

      setPassword('');
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }, [email, isRegistering, logIn, password, register]);

  const handleSignOut = useCallback(async () => {
    try {
      await logOut();
    } catch (error) {
      setAuthError(error.message);
    }
  }, [logOut]);

  if (!user) {
    return (
      <ScrollView
        contentContainerStyle={[globalStyles.pageContent, styles.authContent]}
        keyboardShouldPersistTaps="handled"
        style={globalStyles.screen}
      >
        <View style={styles.brandMark}>
          <Text style={styles.brandMarkText}>ST</Text>
        </View>
        <Text style={globalStyles.pageTitle}>Student Task Manager</Text>
        <Text style={globalStyles.pageSubtitle}>
          Sign in to manage your study tasks, or create an account to get
          started.
        </Text>

        <View style={[globalStyles.surface, styles.authCard]}>
          <Text style={globalStyles.sectionHeading}>
            {isRegistering ? 'Create your account' : 'Welcome back'}
          </Text>
          <Text style={styles.authHint}>
            Your tasks are saved privately to your Firebase account.
          </Text>

          <CustomInput
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCapitalize="none"
          />
          <CustomInput
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Enter your password"
            secureTextEntry
            textContentType={isRegistering ? 'newPassword' : 'password'}
            autoCapitalize="none"
          />

          {authError ? (
            <Text accessibilityRole="alert" style={globalStyles.errorText}>
              {authError}
            </Text>
          ) : null}

          <View style={styles.authSubmit}>
            <CustomButton
              title={isRegistering ? 'Create account' : 'Sign in'}
              onPress={handleAuthentication}
              loading={isSubmitting || authLoading}
              disabled={!email.trim() || !password}
            />
          </View>
          <CustomButton
            title={
              isRegistering
                ? 'Already have an account? Sign in'
                : 'New here? Create an account'
            }
            variant="secondary"
            onPress={() => {
              setAuthError('');
              setIsRegistering((registering) => !registering);
            }}
          />
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={globalStyles.pageContent}
      style={globalStyles.screen}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.eyebrow}>YOUR STUDY SPACE</Text>
          <Text style={globalStyles.pageTitle}>Dashboard</Text>
          <Text style={globalStyles.pageSubtitle} numberOfLines={1}>
            {user.email}
          </Text>
        </View>
        <CustomButton title="Sign out" variant="secondary" onPress={handleSignOut} />
      </View>

      {taskError ? (
        <Text accessibilityRole="alert" style={[globalStyles.errorText, styles.error]}>
          Unable to load your tasks: {taskError}
        </Text>
      ) : null}

      <View style={styles.welcomePanel}>
        <Text style={styles.welcomeTitle}>Make time for what matters.</Text>
        <Text style={styles.welcomeText}>
          Keep your study tasks organized and stay on top of your subjects.
        </Text>
      </View>

      <View style={styles.summaryHeadingRow}>
        <Text style={globalStyles.sectionHeading}>Task overview</Text>
        {tasksLoading ? (
          <ActivityIndicator size="small" color={Colors.primary} />
        ) : null}
      </View>
      <View style={styles.summaryGrid}>
        <TaskSummary label="Total tasks" value={summary.total} color={Colors.primary} />
        <TaskSummary
          label="Completed"
          value={summary.completed}
          color={Colors.success}
        />
        <TaskSummary
          label="Pending"
          value={summary.pending}
          color={Colors.warning}
        />
      </View>

      <Text style={[globalStyles.sectionHeading, styles.actionsHeading]}>
        What would you like to do?
      </Text>
      <CustomButton
        title="Add a new task"
        onPress={() => navigation.navigate('AddTask')}
      />
      <View style={styles.secondaryAction}>
        <CustomButton
          title="View my tasks"
          variant="secondary"
          onPress={() => navigation.navigate('MyTasks')}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  authContent: {
    justifyContent: 'center',
  },
  brandMark: {
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 18,
    height: 56,
    justifyContent: 'center',
    marginBottom: 24,
    width: 56,
  },
  brandMarkText: {
    color: Colors.white,
    fontSize: 19,
    fontWeight: '800',
  },
  authCard: {
    marginTop: 28,
    padding: 20,
  },
  authHint: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 22,
    marginTop: 7,
  },
  authSubmit: {
    marginBottom: 10,
    marginTop: 6,
  },
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  headerText: {
    flex: 1,
  },
  eyebrow: {
    color: Colors.primary,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.4,
    marginBottom: 7,
  },
  error: {
    marginBottom: 16,
  },
  welcomePanel: {
    backgroundColor: Colors.primary,
    borderRadius: 20,
    marginBottom: 28,
    padding: 22,
  },
  welcomeTitle: {
    color: Colors.white,
    fontSize: 21,
    fontWeight: '700',
    lineHeight: 28,
  },
  welcomeText: {
    color: '#E9EEFF',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 8,
  },
  summaryHeadingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    minHeight: 100,
    justifyContent: 'center',
    paddingHorizontal: 6,
    paddingVertical: 14,
  },
  summaryValue: {
    fontSize: 26,
    fontWeight: '800',
  },
  summaryLabel: {
    color: Colors.textMuted,
    fontSize: 11,
    fontWeight: '600',
    marginTop: 6,
    textAlign: 'center',
  },
  actionsHeading: {
    marginBottom: 14,
    marginTop: 30,
  },
  secondaryAction: {
    marginTop: 10,
  },
});
