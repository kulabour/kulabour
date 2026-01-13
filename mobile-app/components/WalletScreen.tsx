import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../services/api/client'; // Assuming generalized API client

interface Transaction {
    _id: string;
    amount: number;
    type: 'CREDIT' | 'DEBIT';
    source: string;
    description: string;
    createdAt: string;
}

interface WalletData {
    balance: number;
    currency: string;
}

export default function WalletScreen() {
    const router = useRouter();
    const [wallet, setWallet] = useState<WalletData | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWalletData();
    }, []);

    const fetchWalletData = async () => {
        try {
            const [walletRes, historyRes] = await Promise.all([
                api.get<WalletData>('/wallet'),
                api.get<Transaction[]>('/wallet/transactions?limit=20')
            ]);

            if (walletRes.success && walletRes.data) {
                setWallet(walletRes.data);
            }

            if (historyRes.success && historyRes.data) {
                setTransactions(historyRes.data);
            }
        } catch (error) {
            console.error('Failed to fetch wallet:', error);
            Alert.alert('Error', 'Could not load wallet details');
        } finally {
            setLoading(false);
        }
    };

    const handleAddMoney = async () => {
        // Determine amount (e.g., via modal input)
        // For demo, we add fixed ₹500
        Alert.alert(
            'Add Money',
            'Add ₹500 to wallet?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Pay with Razorpay',
                    onPress: async () => {
                        try {
                            // Simulate payment ID
                            const dummyPaymentId = 'pay_' + Date.now();
                            await api.post('/wallet/add-money', { amount: 500, paymentId: dummyPaymentId });
                            Alert.alert('Success', '₹500 added to wallet!');
                            fetchWalletData();
                        } catch (error) {
                            Alert.alert('Error', 'Payment failed');
                        }
                    }
                }
            ]
        );
    };

    const renderTransaction = ({ item }: { item: Transaction }) => {
        const isCredit = item.type === 'CREDIT';
        return (
            <View style={styles.transactionItem}>
                <View style={[styles.iconContainer, { backgroundColor: isCredit ? '#E8F5E9' : '#FFEBEE' }]}>
                    <MaterialCommunityIcons
                        name={isCredit ? 'arrow-down-bold' : 'arrow-up-bold'}
                        size={24}
                        color={isCredit ? '#2E7D32' : '#C62828'}
                    />
                </View>
                <View style={styles.transactionDetails}>
                    <Text style={styles.transactionTitle}>{item.description}</Text>
                    <Text style={styles.transactionDate}>{new Date(item.createdAt).toLocaleDateString()}</Text>
                </View>
                <Text style={[styles.transactionAmount, { color: isCredit ? '#2E7D32' : '#C62828' }]}>
                    {isCredit ? '+' : '-'}₹{item.amount}
                </Text>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#0078D4" />
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <MaterialCommunityIcons name="arrow-left" size={24} color="white" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Wallet</Text>
                <View style={{ width: 24 }} />
            </View>

            <View style={styles.balanceCard}>
                <Text style={styles.balanceLabel}>Total Balance</Text>
                <Text style={styles.balanceAmount}>₹{wallet?.balance.toLocaleString() || '0'}</Text>
                <TouchableOpacity style={styles.addMoneyButton} onPress={handleAddMoney}>
                    <MaterialCommunityIcons name="plus" size={20} color="#0078D4" />
                    <Text style={styles.addMoneyText}>Add Money</Text>
                </TouchableOpacity>
            </View>

            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <FlatList
                data={transactions}
                renderItem={renderTransaction}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={<Text style={styles.emptyText}>No transactions yet</Text>}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3F4F6',
    },
    header: {
        padding: 20,
        paddingTop: 10,
        backgroundColor: '#0078D4',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    backButton: {
        padding: 4,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: 'white',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    balanceCard: {
        margin: 20,
        padding: 24,
        backgroundColor: 'white',
        borderRadius: 16,
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    balanceLabel: {
        fontSize: 16,
        color: '#64748B',
        marginBottom: 8,
    },
    balanceAmount: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#0F172A',
        marginBottom: 20,
    },
    addMoneyButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E0F2FE',
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 24,
    },
    addMoneyText: {
        marginLeft: 8,
        color: '#0078D4',
        fontWeight: '600',
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#334155',
        marginLeft: 20,
        marginBottom: 10,
    },
    listContent: {
        padding: 20,
        paddingTop: 0,
    },
    transactionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#0F172A',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#94A3B8',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#94A3B8',
        marginTop: 40,
    },
});
