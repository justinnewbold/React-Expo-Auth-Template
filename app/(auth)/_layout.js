import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';
import { useAuth } from '../../contexts/AuthContext';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  // If already logged in, redirect to app
  if (!loading && user) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0f0f23' },
      }}
    />
  );
}
