import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import LoginForm from '../../components/LoginForm';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LoginForm
        onSwitchToSignup={() => router.push('/(auth)/signup')}
        onForgotPassword={() => router.push('/(auth)/forgot-password')}
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
