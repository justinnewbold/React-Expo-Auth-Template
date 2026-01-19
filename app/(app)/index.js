import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { AdminOnly, SuperAdminOnly } from '../../components/RoleGate';

export default function DashboardScreen() {
  const { user, profile, signOut, isAdmin, isSuperAdmin } = useAuth();

  const getRoleColor = (role) => {
    const colors = {
      super_admin: '#e74c3c',
      location_admin: '#f39c12',
      staff: '#3498db',
      customer: '#2ecc71',
    };
    return colors[role] || '#95a5a6';
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        {/* Welcome Header */}
        <View style={styles.header}>
          <Text style={styles.greeting}>Welcome back!</Text>
          <Text style={styles.email}>{user?.email}</Text>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(profile?.role) }]}>
            <Text style={styles.roleText}>
              {profile?.role?.replace('_', ' ').toUpperCase() || 'USER'}
            </Text>
          </View>
        </View>

        {/* Everyone sees this */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>📊 Your Dashboard</Text>
          <Text style={styles.cardText}>
            This content is visible to all authenticated users.
          </Text>
        </View>

        {/* Staff and above */}
        <AdminOnly fallback={null}>
          <View style={[styles.card, styles.staffCard]}>
            <Text style={styles.cardTitle}>👥 Staff Section</Text>
            <Text style={styles.cardText}>
              This content is only visible to Staff, Location Admins, and Super Admins.
            </Text>
          </View>
        </AdminOnly>

        {/* Location Admin and above */}
        <AdminOnly>
          <View style={[styles.card, styles.adminCard]}>
            <Text style={styles.cardTitle}>🏢 Admin Section</Text>
            <Text style={styles.cardText}>
              This content is only visible to Location Admins and Super Admins.
            </Text>
            <Text style={styles.cardSubtext}>
              • Manage staff{'\n'}
              • View reports{'\n'}
              • Configure settings
            </Text>
          </View>
        </AdminOnly>

        {/* Super Admin only */}
        <SuperAdminOnly>
          <View style={[styles.card, styles.superCard]}>
            <Text style={styles.cardTitle}>🔐 Super Admin Section</Text>
            <Text style={styles.cardText}>
              This content is ONLY visible to Super Admins.
            </Text>
            <Text style={styles.cardSubtext}>
              • Manage all locations{'\n'}
              • System configuration{'\n'}
              • User management{'\n'}
              • Billing & subscriptions
            </Text>
          </View>
        </SuperAdminOnly>

        {/* Quick Stats Example */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Tasks</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>4</Text>
            <Text style={styles.statLabel}>Messages</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>89%</Text>
            <Text style={styles.statLabel}>Progress</Text>
          </View>
        </View>

        {/* Sign Out */}
        <TouchableOpacity style={styles.signOutButton} onPress={signOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>

        {/* Spacer for dev toolbar */}
        <View style={{ height: 100 }} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f23',
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
    paddingTop: 20,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#888',
    marginBottom: 12,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
  },
  roleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  card: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  staffCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#3498db',
  },
  adminCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#f39c12',
  },
  superCard: {
    borderLeftWidth: 4,
    borderLeftColor: '#e74c3c',
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#fff',
    marginBottom: 8,
  },
  cardText: {
    fontSize: 14,
    color: '#aaa',
    lineHeight: 20,
  },
  cardSubtext: {
    fontSize: 13,
    color: '#777',
    marginTop: 12,
    lineHeight: 22,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: '#1a1a2e',
    borderRadius: 12,
    padding: 20,
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#3498db',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textTransform: 'uppercase',
  },
  signOutButton: {
    backgroundColor: '#16213e',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  signOutText: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
});
