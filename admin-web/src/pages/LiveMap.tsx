import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import io, { Socket } from 'socket.io-client';
import 'leaflet/dist/leaflet.css';
import {
    Users,
    Navigation,
    Map as MapIcon,
    Search
} from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icon in Leaflet + React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Types
interface WorkerLocation {
    bookingId: string;
    workerId: string;
    latitude: number;
    longitude: number;
    timestamp: number;
}

export default function LiveMap() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_socket, setSocket] = useState<Socket | null>(null);
    const [locations, setLocations] = useState<Map<string, WorkerLocation>>(new Map());
    const [isConnected, setIsConnected] = useState(false);
    const [selectedWorker, setSelectedWorker] = useState<string | null>(null);

    // Mock initial center (New Delhi)
    const defaultCenter = { lat: 28.6139, lng: 77.2090 };

    useEffect(() => {
        // Connect to Live Tracking Gateway
        const newSocket = io('http://localhost:3000/live-tracking', {
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('✅ Connected to Live Tracking Gateway');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('❌ Disconnected from Live Tracking Gateway');
            setIsConnected(false);
        });

        // Listen for location updates
        newSocket.on('location_update', (data: WorkerLocation) => {
            // console.log('📍 Location Update:', data);
            setLocations(prev => {
                const newMap = new Map(prev);
                newMap.set(data.bookingId, data);
                return newMap;
            });
        });

        setSocket(newSocket);

        // Cleanup
        return () => {
            newSocket.disconnect();
        };
    }, []);

    // Convert Map to Array for rendering
    const activeWorkers = Array.from(locations.values());

    return (
        <div className="flex h-[calc(100vh-140px)] gap-6">
            {/* Sidebar List */}
            <div className="w-80 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
                <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                    <h3 className="font-bold text-gray-800 flex items-center gap-2">
                        <Users size={18} className="text-blue-600" />
                        Active Workers ({activeWorkers.length})
                    </h3>
                    <div className="mt-3 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                        <input
                            type="text"
                            placeholder="Search worker..."
                            className="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-2 space-y-2">
                    {activeWorkers.length === 0 ? (
                        <div className="text-center py-10 text-gray-400 text-sm">
                            <MapIcon size={32} className="mx-auto mb-2 opacity-50" />
                            <p>No active workers found.</p>
                        </div>
                    ) : (
                        activeWorkers.map(loc => (
                            <button
                                key={loc.bookingId}
                                onClick={() => setSelectedWorker(loc.bookingId)}
                                className={`w-full text-left p-3 rounded-xl transition-all border ${selectedWorker === loc.bookingId
                                    ? 'bg-blue-50 border-blue-200 shadow-sm'
                                    : 'hover:bg-gray-50 border-transparent hover:border-gray-100'
                                    }`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-semibold text-gray-800 text-sm">Worker #{loc.workerId.slice(-4)}</p>
                                        <p className="text-xs text-gray-500 mt-0.5">Booking: {loc.bookingId.slice(-6)}</p>
                                    </div>
                                    <div className="flex items-center gap-1 text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                        LIVE
                                    </div>
                                </div>
                                <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                                    <Navigation size={12} />
                                    <span>{loc.latitude.toFixed(4)}, {loc.longitude.toFixed(4)}</span>
                                </div>
                            </button>
                        ))
                    )}
                </div>

                <div className="p-3 border-t border-gray-100 text-xs text-center text-gray-400">
                    {isConnected ? (
                        <span className="text-green-600 flex items-center justify-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                            System Online
                        </span>
                    ) : (
                        <span className="text-red-500 flex items-center justify-center gap-1.5">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                            Disconnected
                        </span>
                    )}
                </div>
            </div>

            {/* Map View */}
            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative z-0">
                <MapContainer
                    center={[defaultCenter.lat, defaultCenter.lng]}
                    zoom={12}
                    style={{ height: '100%', width: '100%' }}
                    className="z-0"
                >
                    <TileLayer
                        url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                    />

                    {activeWorkers.map(loc => (
                        <Marker
                            key={loc.bookingId}
                            position={[loc.latitude, loc.longitude]}
                        >
                            <Popup>
                                <div className="font-sans">
                                    <h4 className="font-bold text-sm">Worker {loc.workerId}</h4>
                                    <p className="text-xs text-gray-500">Booking: {loc.bookingId}</p>
                                    <p className="text-xs mt-1">Updates: Live</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}

                    {/* Simulated Marker for Demo if empty */}
                    {activeWorkers.length === 0 && (
                        <Marker position={[28.6139, 77.2090]}>
                            <Popup>
                                Demo Marker (New Delhi)
                            </Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
}
