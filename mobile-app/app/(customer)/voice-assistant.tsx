import { useEffect } from 'react';
import { View } from 'react-native';
import { AdvancedVoiceInterface } from '../../components/AdvancedVoiceInterface';
import { CustomerVoiceAgent } from '../../services/CustomerVoiceAgent';

/**
 * Customer Voice Assistant Screen
 * Accessible from customer app bottom tab or FAB
 */
export default function CustomerVoiceScreen() {
    const voiceAgent = new CustomerVoiceAgent();

    useEffect(() => {
        // Initialize agent
        voiceAgent.initialize({
            userType: 'customer',
            language: 'hi',
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <AdvancedVoiceInterface
                agent={voiceAgent}
                welcomeMessage="Namaste! Main KULABOUR voice assistant hoon. Kaunsi service chahiye?"
                quickActions={[
                    'Find a plumber',
                    'Book electrician',
                    'Track my booking',
                    'Check prices',
                ]}
                placeholder="Tap to speak or type message..."
            />
        </View>
    );
}
