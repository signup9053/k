import AsyncStorage from '@react-native-async-storage/async-storage';

const HISTORY_KEY = '@finassist_history';
const SAVED_KEY = '@finassist_saved';
const CUSTOM_TYPES_KEY = '@finassist_custom_types';

export const saveToHistory = async (calculation) => {
  try {
    const history = await getHistory();
    const newHistory = [
      {
        ...calculation,
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
      },
      ...history,
    ].slice(0, 50); // Keep last 50 calculations
    await AsyncStorage.setItem(HISTORY_KEY, JSON.stringify(newHistory));
    return true;
  } catch (error) {
    console.error('Error saving to history:', error);
    return false;
  }
};

export const getHistory = async () => {
  try {
    const history = await AsyncStorage.getItem(HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error('Error getting history:', error);
    return [];
  }
};

export const clearHistory = async () => {
  try {
    await AsyncStorage.removeItem(HISTORY_KEY);
    return true;
  } catch (error) {
    console.error('Error clearing history:', error);
    return false;
  }
};

export const saveCalculation = async (calculation) => {
  try {
    const saved = await getSavedCalculations();
    const newSaved = [
      {
        ...calculation,
        id: Date.now().toString(),
        savedAt: new Date().toISOString(),
      },
      ...saved,
    ];
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(newSaved));
    return true;
  } catch (error) {
    console.error('Error saving calculation:', error);
    return false;
  }
};

export const getSavedCalculations = async () => {
  try {
    const saved = await AsyncStorage.getItem(SAVED_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Error getting saved calculations:', error);
    return [];
  }
};

export const deleteSavedCalculation = async (id) => {
  try {
    const saved = await getSavedCalculations();
    const filtered = saved.filter((item) => item.id !== id);
    await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting saved calculation:', error);
    return false;
  }
};

export const saveCustomType = async (typeName) => {
  try {
    const types = await getCustomTypes();
    if (!types.includes(typeName)) {
      const newTypes = [...types, typeName];
      await AsyncStorage.setItem(CUSTOM_TYPES_KEY, JSON.stringify(newTypes));
    }
    return true;
  } catch (error) {
    console.error('Error saving custom type:', error);
    return false;
  }
};

export const getCustomTypes = async () => {
  try {
    const types = await AsyncStorage.getItem(CUSTOM_TYPES_KEY);
    return types ? JSON.parse(types) : [];
  } catch (error) {
    console.error('Error getting custom types:', error);
    return [];
  }
};

export const deleteCustomType = async (typeName) => {
  try {
    const types = await getCustomTypes();
    const filtered = types.filter((type) => type !== typeName);
    await AsyncStorage.setItem(CUSTOM_TYPES_KEY, JSON.stringify(filtered));
    return true;
  } catch (error) {
    console.error('Error deleting custom type:', error);
    return false;
  }
};
