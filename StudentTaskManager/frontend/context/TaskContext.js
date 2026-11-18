import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  createAccount,
  observeAuthState,
  signIn,
  signOutUser,
} from '../../src/services/auth';
import {
  createTask,
  deleteTask,
  updateTask,
  watchTasks,
} from '../../backend/taskService';

const TaskContext = createContext(null);

export function TaskProvider({ children }) {
  const [user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [authLoading, setAuthLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [taskError, setTaskError] = useState('');

  useEffect(() => {
    return observeAuthState(
      (nextUser) => {
        setUser(nextUser);
        setAuthLoading(false);
      },
      (error) => {
        setTaskError(error.message);
        setAuthLoading(false);
      },
    );
  }, []);

  useEffect(() => {
    if (!user) {
      setTasks([]);
      setTasksLoading(false);
      return undefined;
    }

    setTasksLoading(true);

    try {
      return watchTasks(
        (nextTasks) => {
          setTasks(nextTasks);
          setTasksLoading(false);
          setTaskError('');
        },
        (error) => {
          setTaskError(error.message);
          setTasksLoading(false);
        },
      );
    } catch (error) {
      setTaskError(error.message);
      setTasksLoading(false);
      return undefined;
    }
  }, [user]);

  const register = useCallback((email, password) => {
    return createAccount(email, password);
  }, []);

  const logIn = useCallback((email, password) => {
    return signIn(email, password);
  }, []);

  const logOut = useCallback(() => signOutUser(), []);
  const addTask = useCallback((taskData) => createTask(taskData), []);
  const editTask = useCallback((taskId, updates) => {
    return updateTask(taskId, updates);
  }, []);
  const removeTask = useCallback((taskId) => deleteTask(taskId), []);

  const contextValue = useMemo(
    () => ({
      user,
      tasks,
      authLoading,
      tasksLoading,
      taskError,
      register,
      logIn,
      logOut,
      addTask,
      editTask,
      removeTask,
    }),
    [
      user,
      tasks,
      authLoading,
      tasksLoading,
      taskError,
      register,
      logIn,
      logOut,
      addTask,
      editTask,
      removeTask,
    ],
  );

  return (
    <TaskContext.Provider value={contextValue}>{children}</TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);

  if (!context) {
    throw new Error('useTaskContext must be used inside TaskProvider.');
  }

  return context;
}
