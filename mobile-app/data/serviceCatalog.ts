/**
 * KULABOUR - Complete Service Catalog for India
 * All home services, construction, and daily wage work categories
 * Based on Urban Company, Housejoy, and construction industry research
 */
export interface ServiceItem {
    id: string;
    emoji: string;
    hindi: string;
    english: string;
    price: number;
    unit: string;
}

export interface ServiceCategory {
    id: string;
    hindi: string;
    emoji: string;
    color: string;
    services: ServiceItem[];
}

// Service Categories with Hindi names and emojis
export const SERVICE_CATEGORIES: Record<string, ServiceCategory> = {
    // ===== CONSTRUCTION & MASONRY =====
    construction: {
        id: 'construction',
        hindi: 'निर्माण कार्य',
        emoji: '🏗️',
        color: '#FF6B35',
        services: [
            { id: 'mason', emoji: '🧱', hindi: 'मिस्त्री', english: 'Mason', price: 600, unit: 'दिन' },
            { id: 'helper', emoji: '👷', hindi: 'हेल्पर/मजदूर', english: 'Helper/Labor', price: 400, unit: 'दिन' },
            { id: 'tile_worker', emoji: '🔲', hindi: 'टाइल वाला', english: 'Tile Worker', price: 500, unit: 'दिन' },
            { id: 'plasterer', emoji: '🪣', hindi: 'प्लास्टर वाला', english: 'Plasterer', price: 550, unit: 'दिन' },
            { id: 'bar_bender', emoji: '🔩', hindi: 'सरिया वाला', english: 'Bar Bender', price: 600, unit: 'दिन' },
            { id: 'false_ceiling', emoji: '📐', hindi: 'फॉल्स सीलिंग', english: 'False Ceiling', price: 700, unit: 'दिन' },
            { id: 'waterproofing', emoji: '💧', hindi: 'वाटरप्रूफिंग', english: 'Waterproofing', price: 800, unit: 'काम' },
            { id: 'demolition', emoji: '🔨', hindi: 'तोड़फोड़', english: 'Demolition', price: 500, unit: 'दिन' },
        ],
    },

    // ===== ELECTRICAL =====
    electrical: {
        id: 'electrical',
        hindi: 'बिजली का काम',
        emoji: '⚡',
        color: '#FFD700',
        services: [
            { id: 'electrician', emoji: '⚡', hindi: 'बिजली वाला', english: 'Electrician', price: 200, unit: 'विजिट' },
            { id: 'wiring', emoji: '🔌', hindi: 'वायरिंग', english: 'Wiring', price: 300, unit: 'पॉइंट' },
            { id: 'fan_install', emoji: '🌀', hindi: 'पंखा लगाओ', english: 'Fan Installation', price: 250, unit: 'पंखा' },
            { id: 'switchboard', emoji: '🔲', hindi: 'स्विचबोर्ड', english: 'Switchboard', price: 150, unit: 'बोर्ड' },
            { id: 'mcb_fitting', emoji: '⬜', hindi: 'MCB/DB फिटिंग', english: 'MCB/DB Fitting', price: 500, unit: 'बोर्ड' },
            { id: 'inverter', emoji: '🔋', hindi: 'इन्वर्टर', english: 'Inverter', price: 400, unit: 'विजिट' },
            { id: 'cctv', emoji: '📹', hindi: 'CCTV लगाओ', english: 'CCTV Install', price: 1000, unit: 'कैमरा' },
        ],
    },

    // ===== PLUMBING =====
    plumbing: {
        id: 'plumbing',
        hindi: 'नल का काम',
        emoji: '🔧',
        color: '#4169E1',
        services: [
            { id: 'plumber', emoji: '🔧', hindi: 'नल वाला', english: 'Plumber', price: 200, unit: 'विजिट' },
            { id: 'tap_repair', emoji: '🚰', hindi: 'नल मरम्मत', english: 'Tap Repair', price: 150, unit: 'नल' },
            { id: 'pipe_fitting', emoji: '🔩', hindi: 'पाइप फिटिंग', english: 'Pipe Fitting', price: 300, unit: 'मीटर' },
            { id: 'flush_tank', emoji: '🚽', hindi: 'फ्लश टैंक', english: 'Flush Tank', price: 350, unit: 'टैंक' },
            { id: 'water_tank', emoji: '💧', hindi: 'पानी टंकी', english: 'Water Tank', price: 500, unit: 'टंकी' },
            { id: 'geyser', emoji: '🔥', hindi: 'गीजर', english: 'Geyser', price: 400, unit: 'विजिट' },
            { id: 'drainage', emoji: '🕳️', hindi: 'नाली साफ', english: 'Drainage', price: 300, unit: 'काम' },
            { id: 'borewell', emoji: '⬇️', hindi: 'बोरवेल', english: 'Borewell', price: 5000, unit: 'फीट' },
        ],
    },

    // ===== CARPENTRY =====
    carpentry: {
        id: 'carpentry',
        hindi: 'लकड़ी का काम',
        emoji: '🪚',
        color: '#8B4513',
        services: [
            { id: 'carpenter', emoji: '🪚', hindi: 'बढ़ई', english: 'Carpenter', price: 400, unit: 'दिन' },
            { id: 'furniture', emoji: '🪑', hindi: 'फर्नीचर', english: 'Furniture', price: 500, unit: 'दिन' },
            { id: 'door_repair', emoji: '🚪', hindi: 'दरवाजा मरम्मत', english: 'Door Repair', price: 300, unit: 'दरवाजा' },
            { id: 'window_frame', emoji: '🪟', hindi: 'खिड़की फ्रेम', english: 'Window Frame', price: 400, unit: 'खिड़की' },
            { id: 'cupboard', emoji: '🗄️', hindi: 'अलमारी', english: 'Cupboard', price: 600, unit: 'दिन' },
            { id: 'modular_kitchen', emoji: '🍳', hindi: 'मॉड्यूलर किचन', english: 'Modular Kitchen', price: 1000, unit: 'दिन' },
            { id: 'wood_polish', emoji: '✨', hindi: 'पॉलिश', english: 'Wood Polish', price: 250, unit: 'वर्ग फीट' },
        ],
    },

    // ===== PAINTING =====
    painting: {
        id: 'painting',
        hindi: 'रंगाई का काम',
        emoji: '🎨',
        color: '#9B59B6',
        services: [
            { id: 'painter', emoji: '🎨', hindi: 'रंग वाला', english: 'Painter', price: 400, unit: 'दिन' },
            { id: 'interior_paint', emoji: '🏠', hindi: 'अंदर का रंग', english: 'Interior Paint', price: 25, unit: 'वर्ग फीट' },
            { id: 'exterior_paint', emoji: '🏢', hindi: 'बाहर का रंग', english: 'Exterior Paint', price: 30, unit: 'वर्ग फीट' },
            { id: 'texture_paint', emoji: '🌊', hindi: 'टेक्सचर पेंट', english: 'Texture Paint', price: 50, unit: 'वर्ग फीट' },
            { id: 'wall_putty', emoji: '⬜', hindi: 'वॉल पुट्टी', english: 'Wall Putty', price: 15, unit: 'वर्ग फीट' },
            { id: 'whitewash', emoji: '🤍', hindi: 'व्हाइटवॉश', english: 'Whitewash', price: 10, unit: 'वर्ग फीट' },
            { id: 'primer', emoji: '🎯', hindi: 'प्राइमर', english: 'Primer', price: 12, unit: 'वर्ग फीट' },
        ],
    },

    // ===== HEAVY MACHINERY =====
    machinery: {
        id: 'machinery',
        hindi: 'भारी मशीनें',
        emoji: '🚜',
        color: '#FFA500',
        services: [
            { id: 'jcb', emoji: '🚜', hindi: 'JCB', english: 'JCB', price: 1200, unit: 'घंटा' },
            { id: 'crane', emoji: '🏗️', hindi: 'क्रेन', english: 'Crane', price: 2500, unit: 'घंटा' },
            { id: 'tractor', emoji: '🚛', hindi: 'ट्रैक्टर', english: 'Tractor', price: 800, unit: 'घंटा' },
            { id: 'truck', emoji: '🚚', hindi: 'ट्रक', english: 'Truck', price: 500, unit: 'ट्रिप' },
            { id: 'dumper', emoji: '🛻', hindi: 'डंपर', english: 'Dumper', price: 600, unit: 'ट्रिप' },
            { id: 'roller', emoji: '🛞', hindi: 'रोलर', english: 'Roller', price: 1500, unit: 'घंटा' },
            { id: 'concrete_mixer', emoji: '🔄', hindi: 'मिक्सर मशीन', english: 'Concrete Mixer', price: 400, unit: 'घंटा' },
            { id: 'boring_machine', emoji: '⬇️', hindi: 'बोरिंग मशीन', english: 'Boring Machine', price: 3000, unit: 'फीट' },
        ],
    },

    // ===== AC & APPLIANCES =====
    appliances: {
        id: 'appliances',
        hindi: 'उपकरण मरम्मत',
        emoji: '❄️',
        color: '#00CED1',
        services: [
            { id: 'ac_repair', emoji: '❄️', hindi: 'AC मरम्मत', english: 'AC Repair', price: 400, unit: 'विजिट' },
            { id: 'ac_install', emoji: '📦', hindi: 'AC इंस्टॉल', english: 'AC Install', price: 800, unit: 'AC' },
            { id: 'ac_gas', emoji: '💨', hindi: 'AC गैस', english: 'AC Gas Refill', price: 1500, unit: 'AC' },
            { id: 'ac_service', emoji: '🧹', hindi: 'AC सर्विस', english: 'AC Service', price: 500, unit: 'AC' },
            { id: 'fridge_repair', emoji: '🧊', hindi: 'फ्रिज मरम्मत', english: 'Fridge Repair', price: 400, unit: 'विजिट' },
            { id: 'washing_machine', emoji: '🫧', hindi: 'वॉशिंग मशीन', english: 'Washing Machine', price: 400, unit: 'विजिट' },
            { id: 'tv_repair', emoji: '📺', hindi: 'TV मरम्मत', english: 'TV Repair', price: 350, unit: 'विजिट' },
            { id: 'ro_service', emoji: '💧', hindi: 'RO सर्विस', english: 'RO Service', price: 300, unit: 'विजिट' },
            { id: 'microwave', emoji: '📡', hindi: 'माइक्रोवेव', english: 'Microwave', price: 350, unit: 'विजिट' },
            { id: 'chimney', emoji: '🔥', hindi: 'चिमनी', english: 'Chimney', price: 400, unit: 'विजिट' },
        ],
    },

    // ===== CLEANING =====
    cleaning: {
        id: 'cleaning',
        hindi: 'सफाई',
        emoji: '🧹',
        color: '#32CD32',
        services: [
            { id: 'house_cleaning', emoji: '🏠', hindi: 'घर सफाई', english: 'House Cleaning', price: 500, unit: 'BHK' },
            { id: 'bathroom_clean', emoji: '🚿', hindi: 'बाथरूम सफाई', english: 'Bathroom Clean', price: 300, unit: 'बाथरूम' },
            { id: 'kitchen_clean', emoji: '🍳', hindi: 'किचन सफाई', english: 'Kitchen Clean', price: 400, unit: 'किचन' },
            { id: 'sofa_clean', emoji: '🛋️', hindi: 'सोफा सफाई', english: 'Sofa Clean', price: 350, unit: 'सीट' },
            { id: 'carpet_clean', emoji: '🧶', hindi: 'कालीन सफाई', english: 'Carpet Clean', price: 10, unit: 'वर्ग फीट' },
            { id: 'tank_clean', emoji: '💧', hindi: 'टंकी सफाई', english: 'Tank Clean', price: 800, unit: 'टंकी' },
            { id: 'maid', emoji: '👩', hindi: 'नौकरानी', english: 'Maid/Helper', price: 300, unit: 'दिन' },
        ],
    },

    // ===== PEST CONTROL =====
    pest_control: {
        id: 'pest_control',
        hindi: 'कीट नियंत्रण',
        emoji: '🐜',
        color: '#8B0000',
        services: [
            { id: 'cockroach', emoji: '🪳', hindi: 'कॉकरोच', english: 'Cockroach', price: 600, unit: 'BHK' },
            { id: 'termite', emoji: '🐛', hindi: 'दीमक', english: 'Termite', price: 1500, unit: 'BHK' },
            { id: 'bedbug', emoji: '🐞', hindi: 'खटमल', english: 'Bedbug', price: 1000, unit: 'BHK' },
            { id: 'mosquito', emoji: '🦟', hindi: 'मच्छर', english: 'Mosquito', price: 500, unit: 'BHK' },
            { id: 'rat', emoji: '🐀', hindi: 'चूहा', english: 'Rat Control', price: 800, unit: 'BHK' },
            { id: 'fumigation', emoji: '💨', hindi: 'फ्यूमिगेशन', english: 'Fumigation', price: 2000, unit: 'BHK' },
        ],
    },

    // ===== WELDING & METAL =====
    welding: {
        id: 'welding',
        hindi: 'वेल्डिंग/लोहे का काम',
        emoji: '⚒️',
        color: '#4A4A4A',
        services: [
            { id: 'welder', emoji: '⚒️', hindi: 'वेल्डर', english: 'Welder', price: 500, unit: 'दिन' },
            { id: 'grill', emoji: '🔲', hindi: 'ग्रिल', english: 'Grill Work', price: 600, unit: 'वर्ग फीट' },
            { id: 'gate', emoji: '🚪', hindi: 'गेट', english: 'Gate', price: 800, unit: 'गेट' },
            { id: 'railing', emoji: '🛤️', hindi: 'रेलिंग', english: 'Railing', price: 400, unit: 'मीटर' },
            { id: 'shed', emoji: '🏚️', hindi: 'शेड', english: 'Shed', price: 100, unit: 'वर्ग फीट' },
            { id: 'fabrication', emoji: '🔧', hindi: 'फैब्रिकेशन', english: 'Fabrication', price: 500, unit: 'दिन' },
        ],
    },

    // ===== TRANSPORT & MOVING =====
    transport: {
        id: 'transport',
        hindi: 'परिवहन',
        emoji: '🚚',
        color: '#2E86AB',
        services: [
            { id: 'packers_movers', emoji: '📦', hindi: 'पैकर्स मूवर्स', english: 'Packers & Movers', price: 3000, unit: 'ट्रिप' },
            { id: 'tempo', emoji: '🛺', hindi: 'टेम्पो', english: 'Tempo', price: 500, unit: 'ट्रिप' },
            { id: 'pickup', emoji: '🛻', hindi: 'पिकअप', english: 'Pickup', price: 400, unit: 'ट्रिप' },
            { id: 'loading_labor', emoji: '💪', hindi: 'लोडिंग मजदूर', english: 'Loading Labor', price: 300, unit: 'व्यक्ति' },
        ],
    },

    // ===== BEAUTY & WELLNESS (for home) =====
    beauty: {
        id: 'beauty',
        hindi: 'ब्यूटी',
        emoji: '💅',
        color: '#FF69B4',
        services: [
            { id: 'salon_home', emoji: '💇', hindi: 'होम सैलून', english: 'Home Salon', price: 500, unit: 'विजिट' },
            { id: 'haircut', emoji: '✂️', hindi: 'बाल काटना', english: 'Haircut', price: 200, unit: 'व्यक्ति' },
            { id: 'facial', emoji: '😊', hindi: 'फेशियल', english: 'Facial', price: 600, unit: 'विजिट' },
            { id: 'mehendi', emoji: '🤲', hindi: 'मेहंदी', english: 'Mehendi', price: 500, unit: 'हाथ' },
            { id: 'massage', emoji: '💆', hindi: 'मालिश', english: 'Massage', price: 800, unit: 'विजिट' },
        ],
    },

    // ===== GARDENING =====
    gardening: {
        id: 'gardening',
        hindi: 'बागवानी',
        emoji: '🌿',
        color: '#228B22',
        services: [
            { id: 'gardener', emoji: '👨‍🌾', hindi: 'माली', english: 'Gardener', price: 400, unit: 'दिन' },
            { id: 'lawn_mowing', emoji: '🌱', hindi: 'घास कटाई', english: 'Lawn Mowing', price: 300, unit: 'विजिट' },
            { id: 'tree_cutting', emoji: '🌳', hindi: 'पेड़ कटाई', english: 'Tree Cutting', price: 500, unit: 'पेड़' },
            { id: 'landscaping', emoji: '🏞️', hindi: 'लैंडस्केपिंग', english: 'Landscaping', price: 1000, unit: 'दिन' },
        ],
    },

    // ===== GLASS & ALUMINIUM =====
    glass: {
        id: 'glass',
        hindi: 'कांच/एल्युमीनियम',
        emoji: '🪟',
        color: '#87CEEB',
        services: [
            { id: 'glass_work', emoji: '🪟', hindi: 'कांच का काम', english: 'Glass Work', price: 500, unit: 'वर्ग फीट' },
            { id: 'aluminium_window', emoji: '🔲', hindi: 'एल्युमीनियम खिड़की', english: 'Aluminium Window', price: 600, unit: 'वर्ग फीट' },
            { id: 'mirror', emoji: '🪞', hindi: 'शीशा', english: 'Mirror', price: 200, unit: 'वर्ग फीट' },
            { id: 'glass_door', emoji: '🚪', hindi: 'कांच का दरवाजा', english: 'Glass Door', price: 800, unit: 'दरवाजा' },
        ],
    },

    // ===== EVENT & DECORATION =====
    events: {
        id: 'events',
        hindi: 'इवेंट/सजावट',
        emoji: '🎉',
        color: '#FF1493',
        services: [
            { id: 'tent_house', emoji: '⛺', hindi: 'टेंट हाउस', english: 'Tent House', price: 5000, unit: 'इवेंट' },
            { id: 'decoration', emoji: '🎈', hindi: 'सजावट', english: 'Decoration', price: 2000, unit: 'इवेंट' },
            { id: 'catering', emoji: '🍽️', hindi: 'केटरिंग', english: 'Catering', price: 300, unit: 'प्लेट' },
            { id: 'dj', emoji: '🎵', hindi: 'DJ', english: 'DJ', price: 5000, unit: 'इवेंट' },
            { id: 'photography', emoji: '📸', hindi: 'फोटोग्राफी', english: 'Photography', price: 3000, unit: 'इवेंट' },
        ],
    },
};

// Worker Types for Partner App
export const WORKER_TYPES = {
    unskilled: {
        hindi: 'अनस्किल्ड',
        english: 'Unskilled',
        minWage: 400,
        examples: ['हेल्पर', 'मजदूर', 'लोडिंग'],
        emoji: '👷',
    },
    semi_skilled: {
        hindi: 'सेमी-स्किल्ड',
        english: 'Semi-Skilled',
        minWage: 500,
        examples: ['पेंटर हेल्पर', 'मिस्त्री हेल्पर', 'टाइल हेल्पर'],
        emoji: '🔧',
    },
    skilled: {
        hindi: 'स्किल्ड',
        english: 'Skilled',
        minWage: 600,
        examples: ['मिस्त्री', 'इलेक्ट्रीशियन', 'प्लंबर', 'कारपेंटर', 'पेंटर'],
        emoji: '⚡',
    },
    highly_skilled: {
        hindi: 'हाइली स्किल्ड',
        english: 'Highly Skilled',
        minWage: 800,
        examples: ['AC टेक्नीशियन', 'ड्राइवर', 'ऑपरेटर', 'वेल्डर'],
        emoji: '🏆',
    },
    operator: {
        hindi: 'ऑपरेटर',
        english: 'Machine Operator',
        minWage: 1000,
        examples: ['JCB', 'क्रेन', 'ट्रैक्टर', 'रोलर'],
        emoji: '🚜',
    },
};

// Get all services as flat array
export function getAllServices() {
    const allServices: any[] = [];
    Object.values(SERVICE_CATEGORIES).forEach((category) => {
        category.services.forEach((service) => {
            allServices.push({
                ...service,
                category: category.id,
                categoryHindi: category.hindi,
                categoryColor: category.color,
            });
        });
    });
    return allServices;
}

// Get services by category
export function getServicesByCategory(categoryId: string) {
    return SERVICE_CATEGORIES[categoryId as keyof typeof SERVICE_CATEGORIES]?.services || [];
}

// Search services (Hindi + English)
export function searchServices(query: string) {
    const lowerQuery = query.toLowerCase();
    return getAllServices().filter(
        (s) =>
            s.hindi.includes(query) ||
            s.english.toLowerCase().includes(lowerQuery)
    );
}

export default SERVICE_CATEGORIES;
