import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { History, Trash2, Calendar } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getHistory, clearHistory } from '../../utils/storage';
import { formatCurrency } from '../../utils/calculations';
import { useRouter } from 'expo-router';

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    loadHistory();
    const interval = setInterval(loadHistory, 2000);
    return () => clearInterval(interval);
  }, []);

  const loadHistory = async () => {
    const data = await getHistory();
    setHistory(data);
  };

  const handleClearHistory = async () => {
    await clearHistory();
    setHistory([]);
  };

  const handleViewCalculation = (item) => {
    router.push({
      pathname: '/(tabs)/calculation-detail',
      params: {
        data: JSON.stringify(item),
      },
    });
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  const getResultValue = (item) => {
    if (item.type === 'emi' || item.type === 'loan') return item.result.emi;
    if (item.type === 'sip') return item.result.futureValue;
    return item.result.totalAmount;
  };

  const getResultLabel = (item) => {
    if (item.type === 'emi' || item.type === 'loan') return 'EMI';
    if (item.type === 'sip') return 'Future Value';
    return 'Total Amount';
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#6366f1', '#6366f1dd']}
        style={{ paddingTop: insets.top + 16, paddingBottom: 24, paddingHorizontal: 20 }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 28, fontWeight: '700', color: '#ffffff', marginBottom: 4 }}>History</Text>
            <Text style={{ fontSize: 14, color: '#ffffff', opacity: 0.9 }}>{history.length} calculations</Text>
          </View>
          {history.length > 0 && (
            <TouchableOpacity
              onPress={handleClearHistory}
              style={{
                backgroundColor: 'rgba(255,255,255,0.2)',
                borderRadius: 12,
                paddingVertical: 10,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Trash2 size={16} color="#ffffff" />
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff', marginLeft: 6 }}>Clear</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>

      {history.length === 0 ? (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <History size={64} color="#cbd5e1" />
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#475569', marginTop: 16, textAlign: 'center' }}>
            No calculations yet
          </Text>
          <Text style={{ fontSize: 14, color: '#94a3b8', marginTop: 8, textAlign: 'center' }}>
            Your calculation history will appear here
          </Text>
        </View>
      ) : (
        <FlatList
          data={history}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 20, paddingBottom: insets.bottom + 20 }}
          numColumns={2}
          columnWrapperStyle={{ gap: 12, marginBottom: 12 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleViewCalculation(item)}
              style={{
                flex: 1,
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
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <Calendar size={14} color="#94a3b8" />
                <Text style={{ fontSize: 11, color: '#94a3b8', marginLeft: 4 }}>
                  {formatDate(item.timestamp)}
                </Text>
              </View>
              
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#475569', marginBottom: 4 }}>
                {item.typeName}
              </Text>
              
              <Text style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>
                {getResultLabel(item)}
              </Text>
              
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1e293b' }}>
                {formatCurrency(getResultValue(item))}
              </Text>
              
              <View style={{ marginTop: 12, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#f1f5f9' }}>
                <Text style={{ fontSize: 10, color: '#94a3b8', marginBottom: 2 }}>
                  Principal: {formatCurrency(item.principal)}
                </Text>
                <Text style={{ fontSize: 10, color: '#94a3b8' }}>
                  Rate: {item.rate}% | Tenure: {item.tenure}{item.type === 'simple' || item.type === 'compound' ? 'Y' : 'M'}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}
