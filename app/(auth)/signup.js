import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import SignupForm from '../../components/SignupForm';

export default function SignupScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <SignupForm
        onSwitchToLogin={() => router.push('/(auth)/login')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
});
