import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { auth, db } from './firebaseConfig';

const MAX_TITLE_LENGTH = 160;
const MAX_SUBJECT_LENGTH = 120;
const MAX_DESCRIPTION_LENGTH = 2000;

function ensureFirebaseReady() {
  if (!auth || !db) {
    throw new Error(
      'Firebase is not configured yet. Add your Firebase web config to .env.local and restart the app.',
    );
  }
}

function getTasksCollection() {
  ensureFirebaseReady();
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Sign in before accessing tasks.');
  }

  return collection(db, 'users', user.uid, 'tasks');
}

function validateTaskText(title, subject, description) {
  if (typeof title !== 'string' || title.trim().length === 0) {
    throw new TypeError('A task title is required.');
  }

  if (title.trim().length > MAX_TITLE_LENGTH) {
    throw new TypeError(
      `Task titles must be ${MAX_TITLE_LENGTH} characters or fewer.`,
    );
  }

  if (typeof subject !== 'string' || subject.trim().length === 0) {
    throw new TypeError('A subject name is required.');
  }

  if (subject.trim().length > MAX_SUBJECT_LENGTH) {
    throw new TypeError(
      `Subject names must be ${MAX_SUBJECT_LENGTH} characters or fewer.`,
    );
  }

  if (
    typeof description !== 'string' ||
    description.length > MAX_DESCRIPTION_LENGTH
  ) {
    throw new TypeError(
      `Task descriptions must be text with at most ${MAX_DESCRIPTION_LENGTH} characters.`,
    );
  }
}

export function watchTasks(onTasksChanged, onError) {
  if (typeof onTasksChanged !== 'function' || typeof onError !== 'function') {
    throw new TypeError('Task and error callbacks are required.');
  }

  const tasksQuery = query(getTasksCollection(), orderBy('createdAt', 'desc'));

  return onSnapshot(
    tasksQuery,
    (snapshot) => {
      onTasksChanged(
        snapshot.docs.map((taskDocument) => ({
          id: taskDocument.id,
          ...taskDocument.data(),
        })),
      );
    },
    onError,
  );
}

export function createTask({
  title,
  subject,
  description = '',
  completed = false,
}) {
  validateTaskText(title, subject, description);

  if (typeof completed !== 'boolean') {
    throw new TypeError('The completed value must be a boolean.');
  }

  return addDoc(getTasksCollection(), {
    title: title.trim(),
    subject: subject.trim(),
    description: description.trim(),
    completed,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export function updateTask(taskId, updates) {
  if (!taskId || !updates || typeof updates !== 'object') {
    throw new TypeError('A task ID and update object are required.');
  }

  const allowedFields = ['title', 'subject', 'description', 'completed'];
  const updateFields = Object.keys(updates);

  if (
    updateFields.length === 0 ||
    updateFields.some((field) => !allowedFields.includes(field))
  ) {
    throw new TypeError(
      'Only title, subject, description, and completed can be updated.',
    );
  }

  if ('title' in updates) {
    if (typeof updates.title !== 'string') {
      throw new TypeError('The task title must be text.');
    }

    if ('subject' in updates) {
      validateTaskText(updates.title, updates.subject, '');
    } else {
      validateTaskText(updates.title, 'Existing subject', '');
    }
  }

  if ('subject' in updates) {
    if (
      typeof updates.subject !== 'string' ||
      updates.subject.trim().length === 0
    ) {
      throw new TypeError('A subject name is required.');
    }

    if (updates.subject.trim().length > MAX_SUBJECT_LENGTH) {
      throw new TypeError(
        `Subject names must be ${MAX_SUBJECT_LENGTH} characters or fewer.`,
      );
    }
  }

  if ('description' in updates) {
    if (
      typeof updates.description !== 'string' ||
      updates.description.length > MAX_DESCRIPTION_LENGTH
    ) {
      throw new TypeError(
        `Task descriptions must be text with at most ${MAX_DESCRIPTION_LENGTH} characters.`,
      );
    }
  }

  if ('completed' in updates && typeof updates.completed !== 'boolean') {
    throw new TypeError('The completed value must be a boolean.');
  }

  const normalizedUpdates = { ...updates };

  if ('title' in normalizedUpdates) {
    normalizedUpdates.title = normalizedUpdates.title.trim();
  }

  if ('description' in normalizedUpdates) {
    normalizedUpdates.description = normalizedUpdates.description.trim();
  }

  if ('subject' in normalizedUpdates) {
    normalizedUpdates.subject = normalizedUpdates.subject.trim();
  }

  return updateDoc(doc(getTasksCollection(), taskId), {
    ...normalizedUpdates,
    updatedAt: serverTimestamp(),
  });
}

export function deleteTask(taskId) {
  if (!taskId) {
    throw new TypeError('A task ID is required.');
  }

  return deleteDoc(doc(getTasksCollection(), taskId));
}
