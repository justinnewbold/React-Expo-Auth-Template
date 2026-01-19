import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '../contexts/AuthContext';

/**
 * RoleGate - Conditionally render children based on user role
 * 
 * Usage:
 * <RoleGate requiredRole="location_admin">
 *   <AdminOnlyComponent />
 * </RoleGate>
 * 
 * <RoleGate requiredRole="staff" fallback={<Text>Not authorized</Text>}>
 *   <StaffDashboard />
 * </RoleGate>
 */
export default function RoleGate({ 
  children, 
  requiredRole, 
  fallback = null,
  showMessage = false,
}) {
  const { hasRole, profile, loading } = useAuth();

  if (loading) {
    return null; // Or a loading spinner
  }

  if (!hasRole(requiredRole)) {
    if (showMessage) {
      return (
        <View style={styles.container}>
          <Text style={styles.icon}>🔒</Text>
          <Text style={styles.title}>Access Restricted</Text>
          <Text style={styles.message}>
            This content requires {requiredRole.replace('_', ' ')} permissions.
          </Text>
          <Text style={styles.currentRole}>
            Your role: {profile?.role || 'none'}
          </Text>
        </View>
      );
    }
    return fallback;
  }

  return children;
}

/**
 * Pre-configured role gates for common use cases
 */
export function AdminOnly({ children, fallback }) {
  return (
    <RoleGate requiredRole="location_admin" fallback={fallback}>
      {children}
    </RoleGate>
  );
}

export function SuperAdminOnly({ children, fallback }) {
  return (
    <RoleGate requiredRole="super_admin" fallback={fallback}>
      {children}
    </RoleGate>
  );
}

export function StaffOnly({ children, fallback }) {
  return (
    <RoleGate requiredRole="staff" fallback={fallback}>
      {children}
    </RoleGate>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginBottom: 8,
  },
  currentRole: {
    fontSize: 12,
    color: '#666',
    textTransform: 'capitalize',
  },
});
