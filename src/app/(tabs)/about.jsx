import { View, Text, ScrollView, TouchableOpacity, Share, Linking } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Calculator, Heart, Share2, ExternalLink, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function AboutScreen() {
  const insets = useSafeAreaInsets();

  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Join with me and make financial calculations easy and accurate! Download FinAssist: https://play.google.com/store/apps/details?id=com.singularitysoftwares.lightsync',
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenLink = async () => {
    try {
      await Linking.openURL('https://play.google.com/store/apps/details?id=com.singularitysoftwares.lightsync');
    } catch (error) {
      console.error('Failed to open link');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <StatusBar style="dark" />
      
      <LinearGradient
        colors={['#6366f1', '#6366f1dd']}
        style={{ paddingTop: insets.top + 16, paddingBottom: 24, paddingHorizontal: 20 }}
      >
        <Text style={{ fontSize: 28, fontWeight: '700', color: '#ffffff', marginBottom: 4 }}>About</Text>
        <Text style={{ fontSize: 14, color: '#ffffff', opacity: 0.9 }}>Know more about FinAssist</Text>
      </LinearGradient>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}>
        {/* App Icon & Name */}
        <View style={{ alignItems: 'center', paddingVertical: 32 }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 20,
            backgroundColor: '#6366f1',
            justifyContent: 'center',
            alignItems: 'center',
            elevation: 8,
            shadowColor: '#6366f1',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.3,
            shadowRadius: 12,
          }}>
            <Calculator size={40} color="#ffffff" />
          </View>
          <Text style={{ fontSize: 24, fontWeight: '700', color: '#1e293b', marginTop: 16 }}>FinAssist</Text>
          <Text style={{ fontSize: 14, color: '#64748b', marginTop: 4 }}>Your Financial Calculator</Text>
          <Text style={{ fontSize: 12, color: '#94a3b8', marginTop: 8 }}>Version 1.0.0</Text>
        </View>

        {/* Features Grid */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <Text style={{ fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 16 }}>Features</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            <View style={{
              width: '48%',
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 16,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#dbeafe',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Calculator size={20} color="#3b82f6" />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 4 }}>
                EMI Calculator
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b' }}>
                Calculate monthly EMI payments
              </Text>
            </View>

            <View style={{
              width: '48%',
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 16,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#ddd6fe',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Sparkles size={20} color="#8b5cf6" />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 4 }}>
                SIP Calculator
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b' }}>
                Plan your investments
              </Text>
            </View>

            <View style={{
              width: '48%',
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 16,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#fce7f3',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Calculator size={20} color="#ec4899" />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 4 }}>
                Interest Calculators
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b' }}>
                Simple & compound interest
              </Text>
            </View>

            <View style={{
              width: '48%',
              backgroundColor: '#ffffff',
              borderRadius: 16,
              padding: 16,
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
            }}>
              <View style={{
                width: 40,
                height: 40,
                borderRadius: 10,
                backgroundColor: '#dcfce7',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 12,
              }}>
                <Heart size={20} color="#10b981" />
              </View>
              <Text style={{ fontSize: 13, fontWeight: '600', color: '#1e293b', marginBottom: 4 }}>
                Offline Access
              </Text>
              <Text style={{ fontSize: 11, color: '#64748b' }}>
                Works without internet
              </Text>
            </View>
          </View>
        </View>

        {/* Description */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
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
            <Text style={{ fontSize: 14, color: '#475569', lineHeight: 22 }}>
              FinAssist is your comprehensive financial calculator app that helps you make informed financial decisions. 
              Calculate EMI, SIP returns, simple and compound interest with ease. All calculations are stored locally 
              on your device and work completely offline.
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View style={{ paddingHorizontal: 20, marginBottom: 24 }}>
          <TouchableOpacity
            onPress={handleShare}
            style={{
              backgroundColor: '#6366f1',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 4,
              shadowColor: '#6366f1',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              marginBottom: 12,
            }}
          >
            <Share2 size={18} color="#ffffff" />
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#ffffff', marginLeft: 8 }}>
              Share FinAssist
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleOpenLink}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 16,
              paddingVertical: 16,
              paddingHorizontal: 20,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              borderWidth: 2,
              borderColor: '#e2e8f0',
            }}
          >
            <ExternalLink size={18} color="#6366f1" />
            <Text style={{ fontSize: 15, fontWeight: '600', color: '#6366f1', marginLeft: 8 }}>
              View on Play Store
            </Text>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={{ paddingHorizontal: 20, paddingVertical: 24, alignItems: 'center' }}>
          <Text style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
            Made with{' '}
            <Heart size={12} color="#ef4444" fill="#ef4444" />{' '}
            for better financial planning
          </Text>
          <Text style={{ fontSize: 11, color: '#cbd5e1', marginTop: 8, textAlign: 'center' }}>
            © 2025 FinAssist. All rights reserved.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
