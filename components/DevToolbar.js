import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Platform,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

/**
 * DevToolbar - A floating toolbar for development that allows:
 * - Quick role switching without logging in
 * - Visual indicator of current auth state
 * - Toggle between dev mode and real auth
 * 
 * IMPORTANT: This component ONLY renders in development mode.
 * It is completely invisible in production builds.
 */
export default function DevToolbar() {
  const {
    isDev,
    isDevMode,
    profile,
    enableDevMode,
    switchDevRole,
    disableDevMode,
    DEV_USERS,
  } = useAuth();

  const [expanded, setExpanded] = useState(false);

  // Only render in development
  if (!isDev) return null;

  const roles = Object.keys(DEV_USERS);
  const currentRole = profile?.role || 'none';

  const getRoleColor = (role) => {
    const colors = {
      super_admin: '#e74c3c',
      location_admin: '#f39c12',
      staff: '#3498db',
      customer: '#2ecc71',
      none: '#95a5a6',
    };
    return colors[role] || colors.none;
  };

  const getRoleLabel = (role) => {
    const labels = {
      super_admin: 'Super Admin',
      location_admin: 'Location Admin',
      staff: 'Staff',
      customer: 'Customer',
    };
    return labels[role] || role;
  };

  if (!expanded) {
    // Collapsed state - just show a small indicator
    return (
      <TouchableOpacity
        style={[styles.collapsedButton, { backgroundColor: getRoleColor(currentRole) }]}
        onPress={() => setExpanded(true)}
      >
        <Text style={styles.collapsedText}>
          {isDevMode ? '🛠️' : '🔐'}
        </Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>🛠️ DEV MODE</Text>
        <TouchableOpacity onPress={() => setExpanded(false)}>
          <Text style={styles.closeButton}>✕</Text>
        </TouchableOpacity>
      </View>

      {/* Current State */}
      <View style={[styles.statusBar, { backgroundColor: getRoleColor(currentRole) }]}>
        <Text style={styles.statusText}>
          {isDevMode ? `Mock: ${getRoleLabel(currentRole)}` : 'Real Auth'}
        </Text>
      </View>

      {/* Toggle Dev Mode */}
      {!isDevMode ? (
        <TouchableOpacity
          style={styles.enableButton}
          onPress={() => enableDevMode('super_admin')}
        >
          <Text style={styles.enableButtonText}>Enable Dev Mode</Text>
        </TouchableOpacity>
      ) : (
        <>
          {/* Role Switcher */}
          <Text style={styles.sectionTitle}>Switch Role:</Text>
          <View style={styles.roleGrid}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role}
                style={[
                  styles.roleButton,
                  { 
                    backgroundColor: getRoleColor(role),
                    opacity: currentRole === role ? 1 : 0.6,
                  },
                ]}
                onPress={() => switchDevRole(role)}
              >
                <Text style={styles.roleButtonText}>{getRoleLabel(role)}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Exit Dev Mode */}
          <TouchableOpacity
            style={styles.exitButton}
            onPress={disableDevMode}
          >
            <Text style={styles.exitButtonText}>Exit Dev Mode</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 20 : 100,
    right: 20,
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 12,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    zIndex: 9999,
  },
  collapsedButton: {
    position: 'absolute',
    bottom: Platform.OS === 'web' ? 20 : 100,
    right: 20,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 9999,
  },
  collapsedText: {
    fontSize: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  closeButton: {
    color: '#fff',
    fontSize: 18,
    padding: 4,
  },
  statusBar: {
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  enableButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  enableButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  sectionTitle: {
    color: '#aaa',
    fontSize: 11,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  roleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  roleButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  roleButtonText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '500',
  },
  exitButton: {
    backgroundColor: '#333',
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
  },
  exitButtonText: {
    color: '#aaa',
    fontSize: 12,
  },
});
