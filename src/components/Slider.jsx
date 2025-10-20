import { View, PanResponder, Animated } from 'react-native';
import { useRef, useState } from 'react';

export default function Slider({ value, onValueChange, minimumValue = 0, maximumValue = 100, step = 1, minimumTrackTintColor = '#6366f1', maximumTrackTintColor = '#e2e8f0', thumbTintColor = '#6366f1' }) {
  const [sliderWidth, setSliderWidth] = useState(300);
  const pan = useRef(new Animated.Value(0)).current;

  const valueToPosition = (val) => {
    return ((val - minimumValue) / (maximumValue - minimumValue)) * sliderWidth;
  };

  const positionToValue = (pos) => {
    const rawValue = (pos / sliderWidth) * (maximumValue - minimumValue) + minimumValue;
    return Math.round(rawValue / step) * step;
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        const locationX = evt.nativeEvent.locationX;
        const newValue = positionToValue(Math.max(0, Math.min(locationX, sliderWidth)));
        onValueChange(newValue);
      },
      onPanResponderMove: (evt, gestureState) => {
        const newPosition = valueToPosition(value) + gestureState.dx;
        const clampedPosition = Math.max(0, Math.min(newPosition, sliderWidth));
        const newValue = positionToValue(clampedPosition);
        onValueChange(newValue);
      },
    })
  ).current;

  const position = valueToPosition(value);
  const percentage = ((value - minimumValue) / (maximumValue - minimumValue)) * 100;

  return (
    <View
      style={{ height: 40, justifyContent: 'center' }}
      onLayout={(e) => setSliderWidth(e.nativeEvent.layout.width)}
    >
      <View
        style={{
          height: 4,
          backgroundColor: maximumTrackTintColor,
          borderRadius: 2,
          overflow: 'hidden',
        }}
        {...panResponder.panHandlers}
      >
        <View
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: minimumTrackTintColor,
            borderRadius: 2,
          }}
        />
      </View>
      <View
        style={{
          position: 'absolute',
          left: position - 12,
          width: 24,
          height: 24,
          borderRadius: 12,
          backgroundColor: thumbTintColor,
          elevation: 4,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.25,
          shadowRadius: 4,
        }}
        {...panResponder.panHandlers}
      />
    </View>
  );
}
