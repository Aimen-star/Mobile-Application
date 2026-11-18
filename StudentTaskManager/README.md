# Firebase setup

This app uses Firebase as its serverless backend: Firebase Authentication for
accounts, Cloud Firestore for tasks, and Cloud Storage for task attachments.
There is no separate API server to run.

## Connect the app

1. In the [Firebase Console](https://console.firebase.google.com/), open your
   project and register a **Web app** in Project settings.
2. Copy the app's config values into a new `.env.local` file in the project
   root. Use `.env.example` as the template. These Firebase client settings are
   bundled into the app; do not put service-account credentials or private keys
   in `EXPO_PUBLIC_` variables.
3. In Firebase Console, enable **Authentication > Sign-in method > Email/Password**.
4. Create a **Cloud Firestore** database in **Databases & Storage > Firestore**.
   Choose its location carefully; the location cannot be changed later.
5. Create a **Cloud Storage** bucket in **Databases & Storage > Storage**.
   Firebase currently requires the Blaze (pay-as-you-go) plan for Cloud
   Storage. Check current pricing before enabling it.
6. Deploy the rules from this repository before using the app:

   ```sh
   npx firebase-tools login
   npx firebase-tools deploy --project YOUR_FIREBASE_PROJECT_ID --only firestore:rules,storage
   ```

   Review the rules before deployment if the Firebase project already has
   custom rules; deployment replaces the active rules for these services.

7. Start the app with `npm start`.

## Backend API

- `src/services/auth.js` provides account creation, sign-in, sign-out, password
  reset, and an auth-state observer. Native auth state persists using
  AsyncStorage.
- `src/services/tasks.js` provides realtime task subscriptions and task
  create/update/delete operations. Documents are stored under
  `users/{uid}/tasks/{taskId}`.
- `src/services/taskAttachments.js` uploads, downloads, and deletes images or
  PDFs under `users/{uid}/tasks/{taskId}/{fileName}`. Files are limited to
  10 MB.

The Firestore and Storage rules restrict each user's records and files to that
authenticated user. Client-side Firebase config is not an authorization
boundary; keep these rules deployed and do not add service-account keys to the
mobile app.

## Application structure

- `backend/firebaseConfig.js` initializes Firebase Authentication, Firestore,
  and Storage using the existing `.env.local` configuration.
- `backend/taskService.js` contains the Firestore task create, read, update,
  and delete operations.
- `frontend/screens/` contains the dashboard, add-task, task-list, and
  edit-task screens. `frontend/components/` contains reusable buttons, inputs,
  and task cards.
- `frontend/context/TaskContext.js` shares the signed-in user and realtime
  task list; `frontend/navigation/AppNavigator.js` connects the screens.
- Existing imports from `src/lib/firebase.js` and `src/services/tasks.js` are
  retained as compatibility exports.
