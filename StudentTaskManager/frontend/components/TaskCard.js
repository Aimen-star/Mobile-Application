import { Alert, StyleSheet, Text, View } from 'react-native';
import CustomButton from './CustomButton';
import Colors from '../styling/Colors';

export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onMarkCompleted,
}) {
  const completed = Boolean(task.completed);

  function confirmDelete() {
    Alert.alert('Delete task?', `“${task.title}” will be removed.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: onDelete },
    ]);
  }

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>
          {task.title}
        </Text>
        <View
          style={[
            styles.statusBadge,
            completed ? styles.completedBadge : styles.pendingBadge,
          ]}
        >
          <Text
            style={[
              styles.statusText,
              completed ? styles.completedText : styles.pendingText,
            ]}
          >
            {completed ? 'Completed' : 'Pending'}
          </Text>
        </View>
      </View>

      <Text style={styles.subject}>{task.subject}</Text>
      {task.description ? (
        <Text style={styles.description} numberOfLines={3}>
          {task.description}
        </Text>
      ) : null}

      {!completed ? (
        <CustomButton
          title="Mark as completed"
          variant="secondary"
          onPress={onMarkCompleted}
        />
      ) : null}

      <View style={styles.actions}>
        <View style={styles.actionButton}>
          <CustomButton title="Edit" variant="secondary" onPress={onEdit} />
        </View>
        <View style={styles.actionButton}>
          <CustomButton
            title="Delete"
            variant="danger"
            onPress={confirmDelete}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
    borderRadius: 18,
    borderWidth: 1,
    marginBottom: 14,
    padding: 18,
  },
  titleRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    color: Colors.text,
    flex: 1,
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 23,
  },
  statusBadge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  completedBadge: {
    backgroundColor: Colors.successLight,
  },
  pendingBadge: {
    backgroundColor: Colors.warningLight,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },
  completedText: {
    color: Colors.success,
  },
  pendingText: {
    color: Colors.warning,
  },
  subject: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: '600',
    marginTop: 9,
  },
  description: {
    color: Colors.textMuted,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
    marginTop: 9,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
  },
});
