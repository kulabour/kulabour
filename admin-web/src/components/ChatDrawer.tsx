import { useState, useEffect, useRef } from 'react';
import { X, Send, MessageSquare, Minimize2, Maximize2 } from 'lucide-react';
import { io, Socket } from 'socket.io-client';

interface Message {
    senderId: string;
    message: string;
    timestamp: number;
}

export default function ChatDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);

    // In a real app, you'd manage socket in a context
    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && !socketRef.current) {
            // Real Connection
            socketRef.current = io('http://localhost:3000/chat', {
                transports: ['websocket'],
            });

            socketRef.current.on('connect', () => {
                setIsConnected(true);
                // Join mock room
                socketRef.current?.emit('join_room', { roomId: 'admin_support' });
            });

            socketRef.current.on('disconnect', () => {
                setIsConnected(false);
            });

            socketRef.current.on('receive_message', (payload: any) => {
                setMessages(prev => [...prev, { ...payload, timestamp: Date.now() }]);
            });
        }

        return () => {
            if (!isOpen && socketRef.current) {
                socketRef.current.disconnect();
                socketRef.current = null;
            }
        };
    }, [isOpen]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim()) return;

        const payload = {
            roomId: 'admin_support',
            message: newMessage,
            senderId: 'admin',
        };

        setMessages(prev => [...prev, { ...payload, timestamp: Date.now() }]);
        socketRef.current?.emit('send_message', payload);
        setNewMessage('');

        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, { roomId: 'admin_support', message: 'Echo: ' + payload.message, senderId: 'system', timestamp: Date.now() }]);
        }, 1000);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-110 z-50"
            >
                <MessageSquare size={24} />
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col transition-all duration-300 z-50 ${isMinimized ? 'w-72 h-14' : 'w-80 sm:w-96 h-[500px]'
            }`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-blue-600 text-white rounded-t-2xl">
                <div className="flex items-center gap-2">
                    <MessageSquare size={18} />
                    <span className="font-semibold">Support Chat</span>
                    <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400' : 'bg-red-400'}`} />
                </div>
                <div className="flex items-center gap-1">
                    <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-white/10 rounded">
                        {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded">
                        <X size={16} />
                    </button>
                </div>
            </div>

            {!isMinimized && (
                <>
                    {/* Messages Area */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.length === 0 && (
                            <div className="text-center text-gray-400 text-sm mt-10">
                                No messages yet. Start chatting!
                            </div>
                        )}
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.senderId === 'admin' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.senderId === 'admin'
                                    ? 'bg-blue-600 text-white rounded-br-none'
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-none shadow-sm'
                                    }`}>
                                    {msg.message}
                                </div>
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white rounded-b-2xl">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                placeholder="Type a message..."
                                className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                            <button
                                type="submit"
                                disabled={!newMessage.trim()}
                                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </form>
                </>
            )}
        </div>
    );
}
