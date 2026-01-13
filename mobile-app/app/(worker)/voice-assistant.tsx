import { useEffect } from 'react';
import { View } from 'react-native';
import { AdvancedVoiceInterface } from '../../components/AdvancedVoiceInterface';
import { WorkerVoiceAgent } from '../../services/WorkerVoiceAgent';

/**
 * Worker Voice Assistant Screen
 * Optimized for hands-free operation while working
 */
export default function WorkerVoiceScreen() {
    const voiceAgent = new WorkerVoiceAgent();

    useEffect(() => {
        // Initialize agent
        voiceAgent.initialize({
            userType: 'worker',
            language: 'hi',
            handsFreeMode: true, // Auto-listen for responses
        });
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <AdvancedVoiceInterface
                agent={voiceAgent}
                welcomeMessage="Namaste! Main aapka work assistant hoon. Kya help chahiye?"
                quickActions={[
                    'Naya job dekho',
                    'Job complete karo',
                    'Navigation start karo',
                    'Earnings check karo',
                ]}
                placeholder="Hands-free mode active..."
                handsFree={true}
            />
        </View>
    );
}
