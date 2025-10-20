import { View, Text, ScrollView, TouchableOpacity, Alert, Share } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Settings, Bookmark, Trash2, ChevronRight, Calculator } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getSavedCalculations, deleteSavedCalculation, clearHistory } from '../../utils/storage';
import { formatCurrency } from '../../utils/calculations';
import { useRouter } from 'expo-router';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [savedCalculations, setSavedCalculations] = useState([]);

  useEffect(() => {
    loadSavedCalculations();
  }, []);

  const loadSavedCalculations = async () => {
    const data = await getSavedCalculations();
    setSavedCalculations(data);
  };

  const handleDeleteSaved = async (id) => {
    await deleteSavedCalculation(id);
    loadSavedCalculations();
  };

  const handleClearHistory = async () => {
    Alert.alert(
      'Clear History',
      'Are you sure you want to clear all calculation history?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await clearHistory();
          },
        },
      ]
    );
  };

  const handleViewCalculation = (item) => {
    router.push({
      pathname: '/(tabs)/calculation-detail',
      params: {
        data: JSON.stringify(item),
      },
    });
  };

  const getResultValue = (item) => {
    if (item.type === 'emi' || item.type === 'loan') return item.result.emi;
    if (item.type === 'sip') return item.result.futureValue;
    return item.result.totalAmount;
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#6366f1', '#6366f1dd']}
        style={{ paddingTop: insets.top + 16, paddingBottom: 24, paddingHorizontal: 20 }}
      >
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#ffffff', marginBottom: 4 }}>Settings</Text>
        <Text style={{ fontSize: 14, color: '#ffffff', opacity: 0.9 }}>Manage your preferences</Text>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Saved Calculations */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
            <Bookmark size={20} color="#1e293b" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginLeft: 8 }}>
              Saved Calculations
            </Text>
            <Text style={{ fontSize: 14, color: '#94a3b8', marginLeft: 8 }}>
              ({savedCalculations.length})
            </Text>
          </View>

          {savedCalculations.length === 0 ? (
            <View style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 24,
              alignItems: 'center',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            }}>
              <Calculator size={48} color="#cbd5e1" />
              <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 12, textAlign: 'center' }}>
                No saved calculations yet
              </Text>
            </View>
          ) : (
            <View style={{ gap: 12 }}>
              {savedCalculations.map((item) => (
                <View
                  key={item.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: 16,
                    padding: 16,
                    elevation: 2,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.05,
                    shadowRadius: 4,
                  }}
                >
                  <TouchableOpacity onPress={() => handleViewCalculation(item)}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 4 }}>
                          {item.typeName}
                        </Text>
                        <Text style={{ fontSize: 20, fontWeight: '700', color: '#6366f1', marginBottom: 8 }}>
                          {formatCurrency(getResultValue(item))}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#94a3b8' }}>
                          Principal: {formatCurrency(item.principal)} • Rate: {item.rate}%
                        </Text>
                      </View>
                      <View style={{ flexDirection: 'row', gap: 8 }}>
                        <TouchableOpacity
                          onPress={() => handleDeleteSaved(item.id)}
                          style={{
                            backgroundColor: '#fee2e2',
                            borderRadius: 10,
                            padding: 8,
                          }}
                        >
                          <Trash2 size={18} color="#ef4444" />
                        </TouchableOpacity>
                        <View style={{
                          backgroundColor: '#f1f5f9',
                          borderRadius: 10,
                          padding: 8,
                        }}>
                          <ChevronRight size={18} color="#64748b" />
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 }}>Actions</Text>
          
          <TouchableOpacity
            onPress={handleClearHistory}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={{
                backgroundColor: '#fee2e2',
                borderRadius: 12,
                padding: 10,
              }}>
                <Trash2 size={20} color="#ef4444" />
              </View>
              <View style={{ marginLeft: 12 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e293b' }}>Clear History</Text>
                <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>
                  Remove all calculation history
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#cbd5e1" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={{ paddingHorizontal: 20, marginTop: 32 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 }}>App Info</Text>
          
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 16,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: '#64748b' }}>App Name</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>FinAssist</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Version</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>1.0.0</Text>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 13, color: '#64748b' }}>Storage</Text>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>Local Only</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
