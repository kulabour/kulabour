import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Image,
  Animated,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// ─── Types ──────────────────────────────────────────────────────────────
interface ChatConversation {
  id: string;
  workerName: string;
  workerImage: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  isOnline: boolean;
  skill: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────
const CONVERSATIONS: ChatConversation[] = [
  {
    id: 'c1',
    workerName: 'Rajesh Kumar',
    workerImage: 'https://randomuser.me/api/portraits/men/32.jpg',
    lastMessage: 'Haan bhai, kal subah 8:30 baje aa jaunga. Paint ka material main le aaunga.',
    timestamp: '2 min ago',
    unreadCount: 2,
    isOnline: true,
    skill: 'Painting',
  },
  {
    id: 'c2',
    workerName: 'Suresh Sharma',
    workerImage: 'https://randomuser.me/api/portraits/men/68.jpg',
    lastMessage: 'Wiring ka kaam complete ho gaya hai. Bill ready hai, check kar lo.',
    timestamp: '1 hr ago',
    unreadCount: 0,
    isOnline: true,
    skill: 'Electrical',
  },
  {
    id: 'c3',
    workerName: 'Lakshmi Bai',
    workerImage: 'https://randomuser.me/api/portraits/women/65.jpg',
    lastMessage: 'Thank you for the booking! I will bring all cleaning supplies. See you Monday.',
    timestamp: 'Yesterday',
    unreadCount: 1,
    isOnline: false,
    skill: 'Cleaning',
  },
];

// ─── Chat Row Component ─────────────────────────────────────────────────
function ChatRow({ conversation, index }: { conversation: ChatConversation; index: number }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(anim, {
      toValue: 1,
      delay: index * 100,
      duration: 400,
      useNativeDriver: true,
    }).start();
  }, []);

  const hasUnread = conversation.unreadCount > 0;

  return (
    <Animated.View
      style={{
        opacity: anim,
        transform: [{ translateX: anim.interpolate({ inputRange: [0, 1], outputRange: [-30, 0] }) }],
      }}
    >
      <Pressable
        style={({ pressed }) => [
          styles.chatRow,
          hasUnread && styles.chatRowUnread,
          pressed && { transform: [{ scale: 0.97 }], backgroundColor: '#F5F5F5' },
        ]}
      >
        {/* Avatar with online indicator */}
        <View style={styles.avatarContainer}>
          <Image source={{ uri: conversation.workerImage }} style={styles.avatar} />
          {conversation.isOnline && <View style={styles.onlineDot} />}
        </View>

        {/* Message content */}
        <View style={styles.messageContent}>
          <View style={styles.nameRow}>
            <Text style={[styles.workerName, hasUnread && styles.workerNameBold]} numberOfLines={1}>
              {conversation.workerName}
            </Text>
            <Text style={[styles.timestamp, hasUnread && styles.timestampUnread]}>
              {conversation.timestamp}
            </Text>
          </View>

          <View style={styles.skillBadgeRow}>
            <View style={styles.miniSkillTag}>
              <Text style={styles.miniSkillText}>{conversation.skill}</Text>
            </View>
          </View>

          <View style={styles.messageRow}>
            <Text
              style={[styles.lastMessage, hasUnread && styles.lastMessageBold]}
              numberOfLines={2}
            >
              {conversation.lastMessage}
            </Text>
            {hasUnread && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadText}>{conversation.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    </Animated.View>
  );
}

// ─── Main Screen ────────────────────────────────────────────────────────
export default function ChatScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Messages</Text>
            <Text style={styles.headerSubtitle}>
              {CONVERSATIONS.length} conversations
            </Text>
          </View>
          <Pressable style={({ pressed }) => [styles.newChatBtn, pressed && { opacity: 0.7 }]}>
            <MaterialCommunityIcons name="message-plus-outline" size={22} color="#E65100" />
          </Pressable>
        </View>
      </View>

      {/* Conversations list */}
      <FlatList
        data={CONVERSATIONS}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => <ChatRow conversation={item} index={index} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListFooterComponent={
          <View style={styles.footerContainer}>
            <View style={styles.footerDivider} />
            <View style={styles.encryptionRow}>
              <MaterialCommunityIcons name="lock-outline" size={14} color="#BDBDBD" />
              <Text style={styles.encryptionText}>
                Messages are end-to-end encrypted
              </Text>
            </View>
          </View>
        }
      />
    </View>
  );
}

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },

  // Header
  header: {
    paddingTop: Platform.OS === 'ios' ? 60 : 48,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    color: '#212121',
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  newChatBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF3E0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },

  // Chat row
  chatRow: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#FFFFFF',
  },
  chatRowUnread: {
    backgroundColor: '#FFFBF5',
  },

  // Avatar
  avatarContainer: {
    position: 'relative',
    marginRight: 14,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#EEEEEE',
  },
  onlineDot: {
    position: 'absolute',
    bottom: 1,
    right: 1,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#2E7D32',
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
  },

  // Message content
  messageContent: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  workerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    flex: 1,
  },
  workerNameBold: {
    fontWeight: '800',
  },
  timestamp: {
    fontSize: 12,
    color: '#BDBDBD',
    marginLeft: 8,
  },
  timestampUnread: {
    color: '#E65100',
    fontWeight: '600',
  },

  // Skill badge
  skillBadgeRow: {
    marginTop: 3,
  },
  miniSkillTag: {
    alignSelf: 'flex-start',
    backgroundColor: '#E0F2F1',
    paddingHorizontal: 8,
    paddingVertical: 1,
    borderRadius: 4,
  },
  miniSkillText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#00796B',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  // Message
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 6,
  },
  lastMessage: {
    flex: 1,
    fontSize: 14,
    color: '#757575',
    lineHeight: 19,
  },
  lastMessageBold: {
    color: '#424242',
    fontWeight: '500',
  },
  unreadBadge: {
    minWidth: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#E65100',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
    marginLeft: 10,
    marginTop: 2,
  },
  unreadText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },

  // Separator
  separator: {
    height: 1,
    backgroundColor: '#F5F5F5',
    marginLeft: 82,
  },

  // List
  listContent: {
    paddingBottom: 100,
  },

  // Footer
  footerContainer: {
    paddingTop: 24,
    alignItems: 'center',
  },
  footerDivider: {
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: '#EEEEEE',
    marginBottom: 16,
  },
  encryptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  encryptionText: {
    fontSize: 12,
    color: '#BDBDBD',
  },
});
