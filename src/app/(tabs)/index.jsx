import { View, Text, TextInput, ScrollView, TouchableOpacity, Modal, Animated } from 'react-native';
import { useState, useCallback, useEffect, useRef } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Calculator, TrendingUp, PiggyBank, Percent, DollarSign, Save, Plus, X } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Slider from '../../components/Slider';
import { calculateEMI, calculateSIP, calculateSimpleInterest, calculateCompoundInterest, formatCurrency } from '../../utils/calculations';
import { saveToHistory, saveCalculation, saveCustomType, getCustomTypes } from '../../utils/storage';
import { useRouter } from 'expo-router';

const calculatorTypes = [
  { id: 'emi', name: 'EMI Calculator', icon: Calculator, color: '#6366f1' },
  { id: 'sip', name: 'SIP Calculator', icon: TrendingUp, color: '#8b5cf6' },
  { id: 'simple', name: 'Simple Interest', icon: Percent, color: '#ec4899' },
  { id: 'compound', name: 'Compound Interest', icon: DollarSign, color: '#f59e0b' },
  { id: 'loan', name: 'Loan Calculator', icon: PiggyBank, color: '#10b981' },
];

export default function CalculatorScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [selectedType, setSelectedType] = useState('emi');
  const [customTypes, setCustomTypes] = useState([]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customName, setCustomName] = useState('');
  
  const [principal, setPrincipal] = useState('500000');
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(12);
  const [result, setResult] = useState(null);
  
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    loadCustomTypes();
  }, []);

  const loadCustomTypes = async () => {
    const types = await getCustomTypes();
    setCustomTypes(types);
  };

  const handleAddCustomType = async () => {
    if (customName.trim()) {
      await saveCustomType(customName.trim());
      await loadCustomTypes();
      setCustomName('');
      setShowCustomModal(false);
    }
  };

  const handleCalculate = useCallback(() => {
    const p = parseFloat(principal) || 0;
    const r = parseFloat(rate) || 0;
    const t = parseFloat(tenure) || 0;

    let calculationResult = null;

    switch (selectedType) {
      case 'emi':
      case 'loan':
        calculationResult = calculateEMI(p, r, t);
        break;
      case 'sip':
        calculationResult = calculateSIP(p, r, t);
        break;
      case 'simple':
        calculationResult = calculateSimpleInterest(p, r, Math.ceil(t / 12));
        break;
      case 'compound':
        calculationResult = calculateCompoundInterest(p, r, Math.ceil(t / 12));
        break;
    }

    if (calculationResult) {
      const calc = {
        type: selectedType,
        typeName: calculatorTypes.find(t => t.id === selectedType)?.name || customTypes.find(n => n === selectedType) || selectedType,
        principal: p,
        rate: r,
        tenure: t,
        result: calculationResult,
      };
      
      setResult(calculationResult);
      saveToHistory(calc);
      
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 0.95,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [principal, rate, tenure, selectedType, customTypes]);

  const handleSave = async () => {
    if (result) {
      await saveCalculation({
        type: selectedType,
        typeName: calculatorTypes.find(t => t.id === selectedType)?.name || customTypes.find(n => n === selectedType) || selectedType,
        principal: parseFloat(principal),
        rate: parseFloat(rate),
        tenure: parseFloat(tenure),
        result,
      });
    }
  };

  const handleViewDetails = () => {
    if (result) {
      router.push({
        pathname: '/(tabs)/calculation-detail',
        params: {
          data: JSON.stringify({
            type: selectedType,
            typeName: calculatorTypes.find(t => t.id === selectedType)?.name || customTypes.find(n => n === selectedType) || selectedType,
            principal: parseFloat(principal),
            rate: parseFloat(rate),
            tenure: parseFloat(tenure),
            result,
          }),
        },
      });
    }
  };

  const currentColor = calculatorTypes.find(t => t.id === selectedType)?.color || '#6366f1';

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={[currentColor, currentColor + 'dd']}
        style={{ paddingTop: insets.top + 16, paddingBottom: 24, paddingHorizontal: 20 }}
      >
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#ffffff', marginBottom: 4 }}>FinAssist</Text>
        <Text style={{ fontSize: 14, color: '#ffffff', opacity: 0.9 }}>Your Financial Calculator</Text>
      </LinearGradient>

      <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 12 }}>Select Calculator Type</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginHorizontal: -20, paddingHorizontal: 20 }}>
            {calculatorTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = selectedType === type.id;
              return (
                <TouchableOpacity
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                  style={{
                    backgroundColor: isSelected ? type.color : '#ffffff',
                    borderRadius: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginRight: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: isSelected ? 4 : 2,
                    shadowColor: type.color,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.3 : 0.1,
                    shadowRadius: 4,
                  }}
                >
                  <Icon size={18} color={isSelected ? '#ffffff' : type.color} />
                  <Text style={{
                    marginLeft: 8,
                    fontSize: 13,
                    fontWeight: '600',
                    color: isSelected ? '#ffffff' : '#475569',
                  }}>
                    {type.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
            {customTypes.map((typeName) => {
              const isSelected = selectedType === typeName;
              return (
                <TouchableOpacity
                  key={typeName}
                  onPress={() => setSelectedType(typeName)}
                  style={{
                    backgroundColor: isSelected ? '#6366f1' : '#ffffff',
                    borderRadius: 16,
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    marginRight: 12,
                    flexDirection: 'row',
                    alignItems: 'center',
                    elevation: isSelected ? 4 : 2,
                    shadowColor: '#6366f1',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: isSelected ? 0.3 : 0.1,
                    shadowRadius: 4,
                  }}
                >
                  <Calculator size={18} color={isSelected ? '#ffffff' : '#6366f1'} />
                  <Text style={{
                    marginLeft: 8,
                    fontSize: 13,
                    fontWeight: '600',
                    color: isSelected ? '#ffffff' : '#475569',
                  }}>
                    {typeName}
                  </Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity
              onPress={() => setShowCustomModal(true)}
              style={{
                backgroundColor: '#ffffff',
                borderRadius: 16,
                paddingVertical: 12,
                paddingHorizontal: 16,
                marginRight: 12,
                flexDirection: 'row',
                alignItems: 'center',
                borderWidth: 2,
                borderColor: '#e2e8f0',
                borderStyle: 'dashed',
              }}
            >
              <Plus size={18} color="#94a3b8" />
              <Text style={{ marginLeft: 8, fontSize: 13, fontWeight: '600', color: '#64748b' }}>Add Custom</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 20,
            elevation: 3,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 8,
          }}>
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 8 }}>
                {selectedType === 'sip' ? 'Monthly Investment' : 'Principal Amount'}
              </Text>
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#f1f5f9',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 4,
              }}>
                <Text style={{ fontSize: 18, fontWeight: '600', color: '#64748b' }}>₹</Text>
                <TextInput
                  value={principal}
                  onChangeText={setPrincipal}
                  keyboardType="numeric"
                  style={{ flex: 1, fontSize: 18, fontWeight: '600', color: '#1e293b', paddingVertical: 12, paddingLeft: 8 }}
                  placeholder="Enter amount"
                  placeholderTextColor="#94a3b8"
                />
              </View>
            </View>

            <View style={{ marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569' }}>Interest Rate (% p.a.)</Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: currentColor }}>{rate.toFixed(1)}%</Text>
              </View>
              <Slider
                value={rate}
                onValueChange={setRate}
                minimumValue={1}
                maximumValue={20}
                step={0.5}
                minimumTrackTintColor={currentColor}
                maximumTrackTintColor="#e2e8f0"
                thumbTintColor={currentColor}
              />
            </View>

            <View style={{ marginBottom: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#475569' }}>
                  Tenure ({selectedType === 'simple' || selectedType === 'compound' ? 'Years' : 'Months'})
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: currentColor }}>
                  {Math.round(tenure)} {selectedType === 'simple' || selectedType === 'compound' ? 'Yrs' : 'Mo'}
                </Text>
              </View>
              <Slider
                value={tenure}
                onValueChange={setTenure}
                minimumValue={selectedType === 'simple' || selectedType === 'compound' ? 1 : 3}
                maximumValue={selectedType === 'simple' || selectedType === 'compound' ? 30 : 360}
                step={selectedType === 'simple' || selectedType === 'compound' ? 1 : 3}
                minimumTrackTintColor={currentColor}
                maximumTrackTintColor="#e2e8f0"
                thumbTintColor={currentColor}
              />
            </View>
          </View>
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 20 }}>
          <TouchableOpacity
            onPress={handleCalculate}
            style={{
              backgroundColor: currentColor,
              borderRadius: 16,
              paddingVertical: 16,
              alignItems: 'center',
              elevation: 4,
              shadowColor: currentColor,
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#ffffff' }}>Calculate</Text>
          </TouchableOpacity>
        </View>

        {result && (
          <Animated.View style={{ transform: [{ scale: scaleAnim }], paddingHorizontal: 20, marginTop: 24, marginBottom: 24 }}>
            <LinearGradient
              colors={[currentColor, currentColor + 'ee']}
              style={{
                borderRadius: 20,
                padding: 24,
                elevation: 6,
                shadowColor: currentColor,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
              }}
            >
              <Text style={{ fontSize: 14, fontWeight: '600', color: '#ffffff', opacity: 0.9, marginBottom: 8 }}>
                {selectedType === 'emi' || selectedType === 'loan' ? 'Monthly EMI' : selectedType === 'sip' ? 'Future Value' : 'Total Amount'}
              </Text>
              <Text style={{ fontSize: 36, fontWeight: '800', color: '#ffffff', marginBottom: 20 }}>
                {formatCurrency(
                  selectedType === 'emi' || selectedType === 'loan' ? result.emi :
                  selectedType === 'sip' ? result.futureValue :
                  result.totalAmount
                )}
              </Text>

              <View style={{ backgroundColor: 'rgba(255,255,255,0.2)', height: 1, marginBottom: 16 }} />

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                <Text style={{ fontSize: 13, color: '#ffffff', opacity: 0.9 }}>
                  {selectedType === 'sip' ? 'Total Invested' : 'Principal'}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>
                  {formatCurrency(selectedType === 'sip' ? result.totalInvested : result.principal)}
                </Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                <Text style={{ fontSize: 13, color: '#ffffff', opacity: 0.9 }}>
                  {selectedType === 'sip' ? 'Returns' : 'Interest'}
                </Text>
                <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>
                  {formatCurrency(selectedType === 'sip' ? result.totalReturns : result.totalInterest || result.interest)}
                </Text>
              </View>

              {(selectedType === 'emi' || selectedType === 'loan') && (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
                  <Text style={{ fontSize: 13, color: '#ffffff', opacity: 0.9 }}>Total Amount</Text>
                  <Text style={{ fontSize: 14, fontWeight: '700', color: '#ffffff' }}>
                    {formatCurrency(result.totalAmount)}
                  </Text>
                </View>
              )}

              <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                <TouchableOpacity
                  onPress={handleViewDetails}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    borderRadius: 12,
                    paddingVertical: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff' }}>View Details</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleSave}
                  style={{
                    flex: 1,
                    backgroundColor: 'rgba(255,255,255,0.25)',
                    borderRadius: 12,
                    paddingVertical: 12,
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                  }}
                >
                  <Save size={16} color="#ffffff" />
                  <Text style={{ fontSize: 13, fontWeight: '600', color: '#ffffff', marginLeft: 6 }}>Save</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </Animated.View>
        )}
      </ScrollView>

      <Modal visible={showCustomModal} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 24,
            width: '85%',
            maxWidth: 400,
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: '700', color: '#1e293b' }}>Add Custom Calculator</Text>
              <TouchableOpacity onPress={() => setShowCustomModal(false)}>
                <X size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <TextInput
              value={customName}
              onChangeText={setCustomName}
              placeholder="Enter calculator name"
              placeholderTextColor="#94a3b8"
              style={{
                backgroundColor: '#f1f5f9',
                borderRadius: 12,
                paddingHorizontal: 16,
                paddingVertical: 14,
                fontSize: 15,
                color: '#1e293b',
                marginBottom: 20,
              }}
            />

            <TouchableOpacity
              onPress={handleAddCustomType}
              style={{
                backgroundColor: '#6366f1',
                borderRadius: 12,
                paddingVertical: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#ffffff' }}>Add Calculator</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
