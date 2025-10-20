import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ArrowLeft, TrendingUp, PieChart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { formatCurrency, formatNumber } from '../../utils/calculations';
import { Svg, Circle, Rect, Text as SvgText } from 'react-native-svg';

export default function CalculationDetailScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const params = useLocalSearchParams();
  
  const data = params.data ? JSON.parse(params.data) : null;

  if (!data) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' }}>
        <Text style={{ fontSize: 16, color: '#64748b' }}>No data available</Text>
      </View>
    );
  }

  const { type, typeName, principal, rate, tenure, result } = data;

  const renderPieChart = () => {
    const total = result.totalAmount || (result.futureValue || 0);
    const principalValue = result.principal || (result.totalInvested || 0);
    const interestValue = (result.totalInterest || result.interest || result.totalReturns || 0);
    
    const principalPercentage = (principalValue / total) * 100;
    const interestPercentage = (interestValue / total) * 100;
    
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const principalStrokeDashoffset = circumference - (principalPercentage / 100) * circumference;
    const interestStrokeDashoffset = circumference - (interestPercentage / 100) * circumference;

    return (
      <View style={{ alignItems: 'center', marginVertical: 24 }}>
        <Svg width={200} height={200}>
          <Circle
            cx={100}
            cy={100}
            r={radius}
            stroke="#e2e8f0"
            strokeWidth={20}
            fill="none"
          />
          <Circle
            cx={100}
            cy={100}
            r={radius}
            stroke="#6366f1"
            strokeWidth={20}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={principalStrokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 100 100)`}
          />
          <Circle
            cx={100}
            cy={100}
            r={radius}
            stroke="#8b5cf6"
            strokeWidth={20}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={interestStrokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(${principalPercentage * 3.6 - 90} 100 100)`}
          />
        </Svg>

        <View style={{ flexDirection: 'row', gap: 20, marginTop: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#6366f1', marginRight: 6 }} />
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              {type === 'sip' ? 'Invested' : 'Principal'} ({principalPercentage.toFixed(1)}%)
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ width: 12, height: 12, borderRadius: 2, backgroundColor: '#8b5cf6', marginRight: 6 }} />
            <Text style={{ fontSize: 12, color: '#64748b' }}>
              {type === 'sip' ? 'Returns' : 'Interest'} ({interestPercentage.toFixed(1)}%)
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderBreakdown = () => {
    if (!result.breakdown || result.breakdown.length === 0) {
      return null;
    }

    if (type === 'emi' || type === 'loan') {
      const limitedBreakdown = result.breakdown.slice(0, 12);
      return (
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TrendingUp size={20} color="#1e293b" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginLeft: 8 }}>
              Monthly Breakdown (First Year)
            </Text>
          </View>

          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            overflow: 'hidden',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}>
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#f8fafc',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e2e8f0',
            }}>
              <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#64748b' }}>Month</Text>
              <Text style={{ flex: 1.5, fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Principal</Text>
              <Text style={{ flex: 1.5, fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Interest</Text>
              <Text style={{ flex: 1.5, fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Balance</Text>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {limitedBreakdown.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 12, color: '#475569' }}>{item.month}</Text>
                  <Text style={{ flex: 1.5, fontSize: 12, color: '#1e293b', textAlign: 'right' }}>
                    ₹{formatNumber(item.principal)}
                  </Text>
                  <Text style={{ flex: 1.5, fontSize: 12, color: '#1e293b', textAlign: 'right' }}>
                    ₹{formatNumber(item.interest)}
                  </Text>
                  <Text style={{ flex: 1.5, fontSize: 12, color: '#1e293b', textAlign: 'right' }}>
                    ₹{formatNumber(item.balance)}
                  </Text>
                </View>
              ))}
            </ScrollView>

            {result.breakdown.length > 12 && (
              <View style={{
                backgroundColor: '#f8fafc',
                paddingVertical: 12,
                paddingHorizontal: 16,
                borderTopWidth: 1,
                borderTopColor: '#e2e8f0',
              }}>
                <Text style={{ fontSize: 11, color: '#64748b', textAlign: 'center' }}>
                  Showing first 12 months of {result.breakdown.length} total months
                </Text>
              </View>
            )}
          </View>
        </View>
      );
    }

    if (type === 'sip') {
      return (
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <TrendingUp size={20} color="#1e293b" />
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginLeft: 8 }}>
              Yearly Breakdown
            </Text>
          </View>

          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            overflow: 'hidden',
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}>
            <View style={{
              flexDirection: 'row',
              backgroundColor: '#f8fafc',
              paddingVertical: 12,
              paddingHorizontal: 16,
              borderBottomWidth: 1,
              borderBottomColor: '#e2e8f0',
            }}>
              <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#64748b' }}>Year</Text>
              <Text style={{ flex: 2, fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Invested</Text>
              <Text style={{ flex: 2, fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Value</Text>
              <Text style={{ flex: 2, fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Gains</Text>
            </View>

            <ScrollView style={{ maxHeight: 400 }}>
              {result.breakdown.map((item, index) => (
                <View
                  key={index}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 12,
                    paddingHorizontal: 16,
                    backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 12, color: '#475569' }}>{item.year}</Text>
                  <Text style={{ flex: 2, fontSize: 12, color: '#1e293b', textAlign: 'right' }}>
                    ₹{formatNumber(item.invested)}
                  </Text>
                  <Text style={{ flex: 2, fontSize: 12, color: '#1e293b', textAlign: 'right' }}>
                    ₹{formatNumber(item.value)}
                  </Text>
                  <Text style={{ flex: 2, fontSize: 12, color: '#10b981', textAlign: 'right', fontWeight: '600' }}>
                    +₹{formatNumber(item.gains)}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      );
    }

    return (
      <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <TrendingUp size={20} color="#1e293b" />
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginLeft: 8 }}>
            Yearly Breakdown
          </Text>
        </View>

        <View style={{
          backgroundColor: '#ffffff',
          borderRadius: 16,
          overflow: 'hidden',
          elevation: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 1 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
        }}>
          <View style={{
            flexDirection: 'row',
            backgroundColor: '#f8fafc',
            paddingVertical: 12,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: '#e2e8f0',
          }}>
            <Text style={{ flex: 1, fontSize: 12, fontWeight: '600', color: '#64748b' }}>Year</Text>
            <Text style={{ flex: 2, fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Interest</Text>
            <Text style={{ flex: 2, fontSize: 12, fontWeight: '600', color: '#64748b', textAlign: 'right' }}>Total</Text>
          </View>

          <ScrollView style={{ maxHeight: 400 }}>
            {result.breakdown.map((item, index) => (
              <View
                key={index}
                style={{
                  flexDirection: 'row',
                  paddingVertical: 12,
                  paddingHorizontal: 16,
                  backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8fafc',
                }}
              >
                <Text style={{ flex: 1, fontSize: 12, color: '#475569' }}>{item.year}</Text>
                <Text style={{ flex: 2, fontSize: 12, color: '#1e293b', textAlign: 'right' }}>
                  ₹{formatNumber(item.interest || item.cumulativeInterest)}
                </Text>
                <Text style={{ flex: 2, fontSize: 12, color: '#1e293b', textAlign: 'right' }}>
                  ₹{formatNumber(item.amount || item.totalAmount)}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#6366f1', '#6366f1dd']}
        style={{ paddingTop: insets.top + 16, paddingBottom: 24, paddingHorizontal: 20 }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
          }}
        >
          <ArrowLeft size={20} color="#ffffff" />
          <Text style={{ fontSize: 14, fontWeight: '600', color: '#ffffff', marginLeft: 8 }}>Back</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: '700', color: '#ffffff', marginBottom: 4 }}>{typeName}</Text>
        <Text style={{ fontSize: 13, color: '#ffffff', opacity: 0.9 }}>Detailed Breakdown</Text>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* Summary Card */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <LinearGradient
            colors={['#6366f1', '#8b5cf6']}
            style={{
              borderRadius: 20,
              padding: 24,
              elevation: 6,
              shadowColor: '#6366f1',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 12,
            }}
          >
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#ffffff', opacity: 0.9, marginBottom: 8 }}>
              {type === 'emi' || type === 'loan' ? 'Monthly EMI' : type === 'sip' ? 'Future Value' : 'Total Amount'}
            </Text>
            <Text style={{ fontSize: 40, fontWeight: '800', color: '#ffffff', marginBottom: 20 }}>
              {formatCurrency(
                type === 'emi' || type === 'loan' ? result.emi :
                type === 'sip' ? result.futureValue :
                result.totalAmount
              )}
            </Text>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontSize: 11, color: '#ffffff', opacity: 0.8, marginBottom: 4 }}>
                  {type === 'sip' ? 'Invested' : 'Principal'}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#ffffff' }}>
                  {formatCurrency(type === 'sip' ? result.totalInvested : result.principal)}
                </Text>
              </View>
              <View style={{ flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: 12 }}>
                <Text style={{ fontSize: 11, color: '#ffffff', opacity: 0.8, marginBottom: 4 }}>
                  {type === 'sip' ? 'Returns' : 'Interest'}
                </Text>
                <Text style={{ fontSize: 16, fontWeight: '700', color: '#ffffff' }}>
                  {formatCurrency(type === 'sip' ? result.totalReturns : result.totalInterest || result.interest)}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Pie Chart */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 20,
            padding: 24,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <PieChart size={20} color="#1e293b" />
              <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginLeft: 8 }}>
                Distribution
              </Text>
            </View>
            {renderPieChart()}
          </View>
        </View>

        {/* Input Summary */}
        <View style={{ paddingHorizontal: 20, marginTop: 24 }}>
          <View style={{
            backgroundColor: '#ffffff',
            borderRadius: 16,
            padding: 20,
            elevation: 2,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.05,
            shadowRadius: 4,
          }}>
            <Text style={{ fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 12 }}>
              Calculation Parameters
            </Text>
            <View style={{ gap: 8 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#64748b' }}>
                  {type === 'sip' ? 'Monthly Investment' : 'Principal Amount'}
                </Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>
                  {formatCurrency(principal)}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#64748b' }}>Interest Rate</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>{rate}% p.a.</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ fontSize: 13, color: '#64748b' }}>Tenure</Text>
                <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b' }}>
                  {tenure} {type === 'simple' || type === 'compound' ? 'Years' : 'Months'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Breakdown Table */}
        {renderBreakdown()}
      </ScrollView>
    </View>
  );
}
