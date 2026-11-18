import { deleteObject, getBytes, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../lib/firebase';

const MAX_ATTACHMENT_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_CONTENT_TYPE = /^(image\/[a-zA-Z0-9.+-]+|application\/pdf)$/;

function getCurrentUser() {
  const user = auth.currentUser;

  if (!user) {
    throw new Error('Sign in before accessing task attachments.');
  }

  return user;
}

function validateStoragePath(storagePath, userId) {
  const expectedPrefix = `users/${userId}/tasks/`;

  if (typeof storagePath !== 'string' || !storagePath.startsWith(expectedPrefix)) {
    throw new TypeError('The attachment path does not belong to the signed-in user.');
  }
}

export async function uploadTaskAttachment(
  taskId,
  fileUri,
  fileName,
  contentType,
) {
  const user = getCurrentUser();

  if (!taskId || typeof fileUri !== 'string' || !fileName || !contentType) {
    throw new TypeError('Task ID, file URI, file name, and content type are required.');
  }

  if (!ALLOWED_CONTENT_TYPE.test(contentType)) {
    throw new TypeError('Only image files and PDFs can be uploaded.');
  }

  const response = await fetch(fileUri);

  if (!response.ok) {
    throw new Error(`Unable to read the selected attachment (${response.status}).`);
  }

  const file = await response.blob();

  if (file.size === 0 || file.size > MAX_ATTACHMENT_SIZE_BYTES) {
    throw new TypeError('Attachments must be larger than 0 bytes and no larger than 10 MB.');
  }

  const safeFileName = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).slice(2)}-${safeFileName}`;
  const attachmentRef = ref(
    storage,
    `users/${user.uid}/tasks/${taskId}/${uniqueFileName}`,
  );

  await uploadBytes(attachmentRef, file, { contentType });

  return {
    fullPath: attachmentRef.fullPath,
    name: safeFileName,
    contentType,
    size: file.size,
  };
}

export function downloadTaskAttachment(storagePath) {
  const user = getCurrentUser();
  validateStoragePath(storagePath, user.uid);

  return getBytes(ref(storage, storagePath), MAX_ATTACHMENT_SIZE_BYTES);
}

export function deleteTaskAttachment(storagePath) {
  const user = getCurrentUser();
  validateStoragePath(storagePath, user.uid);

  return deleteObject(ref(storage, storagePath));
}
