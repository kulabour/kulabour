import { View, TextInput } from 'react-native';
import { useRef, useState } from 'react';

interface OTPInputProps {
    length?: number;
    onComplete: (otp: string) => void;
    value: string;
    onChange: (otp: string) => void;
}

export default function OTPInput({
    length = 6,
    onComplete,
    value,
    onChange,
}: OTPInputProps) {
    const [focusedIndex, setFocusedIndex] = useState(0);
    const inputRefs = useRef<Array<TextInput | null>>(
        Array(length).fill(null)
    );

    const handleChange = (text: string, index: number) => {
        // Handle paste
        if (text.length > 1) {
            const pastedCode = text.slice(0, length);
            onChange(pastedCode);
            if (pastedCode.length === length) {
                onComplete(pastedCode);
                inputRefs.current[length - 1]?.blur();
            } else {
                inputRefs.current[pastedCode.length]?.focus();
            }
            return;
        }

        // Handle single character input
        const newValue = value.split('');
        newValue[index] = text;
        const newOTP = newValue.join('');
        onChange(newOTP);

        // Auto focus next input
        if (text && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }

        // Call onComplete when all digits are entered
        if (newOTP.length === length) {
            onComplete(newOTP);
        }
    };

    const handleKeyPress = (e: any, index: number) => {
        // Handle backspace
        if (e.nativeEvent.key === 'Backspace' && !value[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <View className="flex-row justify-between">
            {Array.from({ length }).map((_, index) => {
                const isFocused = focusedIndex === index;
                const hasValue = value[index];

                return (
                    <View
                        key={index}
                        className={`w-12 h-14 rounded-xl border-2 items-center justify-center ${hasValue
                            ? 'bg-neon-blue/20 border-neon-blue'
                            : isFocused
                                ? 'bg-dark-charcoal border-neon-blue shadow-glow-blue'
                                : 'bg-dark-charcoal border-white/20'
                            }`}
                    >
                        <TextInput
                            ref={(ref) => {
                                inputRefs.current[index] = ref;
                            }}
                            className="text-white text-2xl font-bold text-center w-full h-full"
                            keyboardType="number-pad"
                            maxLength={1}
                            value={value[index] || ''}
                            onChangeText={(text) => handleChange(text, index)}
                            onKeyPress={(e) => handleKeyPress(e, index)}
                            onFocus={() => setFocusedIndex(index)}
                            selectTextOnFocus
                        />
                    </View>
                );
            })}
        </View>
    );
}
