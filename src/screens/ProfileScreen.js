import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
  StatusBar,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTasks } from '../context/TaskContext';
import { getApiUrl, setApiUrl } from '../config/api';
import apiService from '../services/apiService';

const showAlert = (title, message) => {
  if (Platform.OS === 'web') {
    window.alert(`${title}\n\n${message}`);
  } else {
    Alert.alert(title, message);
  }
};

export const ProfileScreen = () => {
  const { stats, fetchTasks } = useTasks();
  const [apiUrlInput, setApiUrlInput] = useState(getApiUrl());
  const [testingConnection, setTestingConnection] = useState(false);

  const handleSaveApiUrl = () => {
    if (!apiUrlInput.trim()) {
      showAlert('Erreur', "L'URL de l'API ne peut pas être vide.");
      return;
    }
    setApiUrl(apiUrlInput.trim());
    showAlert('Succès', "Nouvelle adresse d'API enregistrée !");
    fetchTasks();
  };

  const handleTestConnection = async () => {
    setTestingConnection(true);
    try {
      await apiService.getAllTasks();
      showAlert('Succès', 'Connexion au serveur API réussie !');
    } catch (err) {
      showAlert('Échec', `Impossible de contacter le serveur :\n${err.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const performReset = async () => {
    try {
      await apiService.resetTasks();
      await fetchTasks();
      showAlert('Succès', 'Données réinitialisées sur le serveur.');
    } catch (err) {
      showAlert('Erreur', 'Impossible de réinitialiser : ' + err.message);
    }
  };

  const handleResetData = () => {
    if (Platform.OS === 'web') {
      if (window.confirm('Voulez-vous restaurer les 5 tâches de démonstration sur le serveur API ?')) {
        performReset();
      }
    } else {
      Alert.alert(
        'Réinitialiser sur le serveur',
        'Voulez-vous restaurer les 5 tâches de démonstration sur le serveur API ?',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Réinitialiser', style: 'destructive', onPress: performReset },
        ]
      );
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Avatar et Nom */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Ionicons name="cloud" size={44} color="#0284C7" />
          </View>
          <Text style={styles.userName}>Mon Espace</Text>
          <Text style={styles.userRole}>Étudiant / Développeur Mobile</Text>
        </View>

        {/* Carte Mode de stockage */}
        <View style={styles.infoCard}>
          <View style={styles.infoCardHeader}>
            <Ionicons name="globe-outline" size={22} color="#0284C7" />
            <Text style={styles.infoCardTitle}>Mode de stockage</Text>
          </View>
          <View style={styles.badgeMode}>
            <Text style={styles.badgeModeText}>Projet 2 : 100% En Ligne (API REST)</Text>
          </View>
          <Text style={styles.infoCardDesc}>
            Toutes les opérations (CRUD) sont directement transmises à un serveur backend via des
            requêtes HTTP REST.
          </Text>
        </View>

        {/* Configuration de l'URL API */}
        <View style={styles.configCard}>
          <Text style={styles.configCardTitle}>Configuration Serveur API</Text>
          <Text style={styles.configCardSub}>
            URL actuelle utilisée pour contacter le backend :
          </Text>
          <TextInput
            style={styles.apiInput}
            value={apiUrlInput}
            onChangeText={setApiUrlInput}
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.configActions}>
            <TouchableOpacity
              style={styles.saveUrlBtn}
              onPress={handleSaveApiUrl}
              activeOpacity={0.8}
            >
              <Text style={styles.saveUrlBtnText}>Appliquer</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.testBtn}
              onPress={handleTestConnection}
              activeOpacity={0.8}
              disabled={testingConnection}
            >
              <Text style={styles.testBtnText}>
                {testingConnection ? 'Test...' : 'Tester connexion'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Statistiques rapides */}
        <View style={styles.statsCard}>
          <Text style={styles.statsCardTitle}>Statistiques en ligne</Text>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{stats.total}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#10B981' }]}>{stats.completed}</Text>
              <Text style={styles.statLabel}>Terminées</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, { color: '#F59E0B' }]}>{stats.pending}</Text>
              <Text style={styles.statLabel}>À faire</Text>
            </View>
          </View>
        </View>

        {/* Action réinitialiser */}
        <TouchableOpacity
          style={styles.resetButton}
          onPress={handleResetData}
          activeOpacity={0.8}
        >
          <Ionicons name="refresh-outline" size={18} color="#DC2626" />
          <Text style={styles.resetButtonText}>Réinitialiser les données de l'API</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    padding: 20,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0F172A',
  },
  userRole: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  infoCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  infoCardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  badgeMode: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    marginVertical: 6,
  },
  badgeModeText: {
    color: '#0284C7',
    fontWeight: '700',
    fontSize: 12,
  },
  infoCardDesc: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
    marginTop: 4,
  },
  configCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 16,
  },
  configCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 4,
  },
  configCardSub: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 10,
  },
  apiInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 10,
  },
  configActions: {
    flexDirection: 'row',
    gap: 10,
  },
  saveUrlBtn: {
    flex: 1,
    backgroundColor: '#0284C7',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  saveUrlBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  testBtn: {
    flex: 1,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  testBtnText: {
    color: '#334155',
    fontWeight: '700',
    fontSize: 13,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  statsCardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    paddingVertical: 14,
    borderRadius: 12,
  },
  resetButtonText: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
});

export default ProfileScreen;
