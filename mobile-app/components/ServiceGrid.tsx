import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { ServiceCard } from './ServiceCard';

const SERVICE_CATEGORIES = [
    {
        title: "योजना | Planning",
        data: [
            { hindi: "आर्किटेक्ट", english: "Architect", price: "999", imageUri: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=200&h=200&fit=crop", href: "/(customer)/booking/architect", rating: 4.8, verified: true },
            { hindi: "इंजीनियर", english: "Engineer", price: "499", imageUri: "https://images.unsplash.com/photo-1581094794329-cd1361ddee2d?w=200&h=200&fit=crop", href: "/(customer)/booking/civil_engineer", rating: 4.7, verified: true },
            { hindi: "वास्तु", english: "Vastu", price: "501", imageUri: "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=200&h=200&fit=crop", href: "/(customer)/booking/vastu", rating: 4.6, verified: true },
            { hindi: "सर्वेयर", english: "Surveyor", price: "799", imageUri: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=200&h=200&fit=crop", href: "/(customer)/booking/surveyor", rating: 4.5, verified: true },
            { hindi: "मिट्टी टेस्ट", english: "Soil Test", price: "1200", imageUri: "https://images.unsplash.com/photo-1581092335397-9583eb92d232?w=200&h=200&fit=crop", href: "/(customer)/booking/soil_test", rating: 4.7, verified: true },
        ]
    },
    {
        title: "निर्माण | Construction",
        data: [
            { hindi: "मिस्त्री", english: "Mason", price: "600", imageUri: "https://images.unsplash.com/photo-1590579491624-f98f36d4c763?w=200&h=200&fit=crop", href: "/(customer)/booking/mason", rating: 4.9, verified: true },
            { hindi: "बेलदार", english: "Labor", price: "450", imageUri: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=200&h=200&fit=crop", href: "/(customer)/booking/laborer", rating: 4.6, verified: true },
            { hindi: "सरिया वाला", english: "Bar Bender", price: "550", imageUri: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=200&h=200&fit=crop", href: "/(customer)/booking/bar_bender", rating: 4.7, verified: true },
            { hindi: "शटरिंग", english: "Shuttering", price: "500", imageUri: "https://images.unsplash.com/photo-1535732820275-9ffd998cac22?w=200&h=200&fit=crop", href: "/(customer)/booking/shuttering", rating: 4.5, verified: true },
            { hindi: "पत्थर वाला", english: "Stone Layer", price: "650", imageUri: "https://images.unsplash.com/photo-1599619351208-3e6c839d6828?w=200&h=200&fit=crop", href: "/(customer)/booking/stone", rating: 4.8, verified: true },
        ]
    },
    {
        title: "मशीन | Machinery",
        data: [
            { hindi: "जेसीबी", english: "JCB Operator", price: "1200/घंटा", imageUri: "https://images.unsplash.com/photo-1579621970563-ebec7560eb3e?w=200&h=200&fit=crop", href: "/(customer)/booking/jcb", rating: 4.8, verified: true },
            { hindi: "क्रेन", english: "Crane", price: "1500/घंटा", imageUri: "https://images.unsplash.com/photo-1580901368919-7738efb0f87e?w=200&h=200&fit=crop", href: "/(customer)/booking/crane", rating: 4.9, verified: true },
            { hindi: "बोरिंग", english: "Borewell", price: "80/फुट", imageUri: "https://images.unsplash.com/photo-1574689211272-bc14e289e223?w=200&h=200&fit=crop", href: "/(customer)/booking/driller", rating: 4.7, verified: true },
            { hindi: "मिक्सर", english: "Mixer", price: "800/दिन", imageUri: "https://images.unsplash.com/photo-1590054767850-97922d05f692?w=200&h=200&fit=crop", href: "/(customer)/booking/mixer", rating: 4.6, verified: true },
        ]
    },
    {
        title: "फिनिशिंग | Finishing",
        data: [
            { hindi: "बिजली वाला", english: "Electrician", price: "200", imageUri: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=200&h=200&fit=crop", href: "/(customer)/booking/electrician", rating: 4.8, verified: true },
            { hindi: "नल वाला", english: "Plumber", price: "250", imageUri: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?w=200&h=200&fit=crop", href: "/(customer)/booking/plumber", rating: 4.9, verified: true },
            { hindi: "बढ़ई", english: "Carpenter", price: "300", imageUri: "https://images.unsplash.com/photo-1611021061285-19a873c9d2f6?w=200&h=200&fit=crop", href: "/(customer)/booking/carpenter", rating: 4.7, verified: true },
            { hindi: "रंग वाला", english: "Painter", price: "15/sqft", imageUri: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&h=200&fit=crop", href: "/(customer)/booking/painter", rating: 4.8, verified: true },
            { hindi: "वेल्डर", english: "Welder", price: "350", imageUri: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=200&h=200&fit=crop", href: "/(customer)/booking/welder", rating: 4.6, verified: true },
            { hindi: "शीशा वाला", english: "Glass Worker", price: "400", imageUri: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=200&h=200&fit=crop", href: "/(customer)/booking/glass", rating: 4.7, verified: true },
            { hindi: "पीओपी", english: "POP/Ceiling", price: "40/sqft", imageUri: "https://images.unsplash.com/photo-1594818379496-da1e345b0ded?w=200&h=200&fit=crop", href: "/(customer)/booking/pop", rating: 4.5, verified: true },
            { hindi: "टाइल्स", english: "Tile", price: "35/sqft", imageUri: "https://images.unsplash.com/photo-1584622050111-993a426fbf0a?w=200&h=200&fit=crop", href: "/(customer)/booking/tile", rating: 4.8, verified: true },
        ]
    },
    {
        title: "सजावट | Decor",
        data: [
            { hindi: "डिजाइनर", english: "Interior Designer", price: "2000", imageUri: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=200&h=200&fit=crop", href: "/(customer)/booking/interior", rating: 4.9, verified: true },
            { hindi: "वॉलपेपर", english: "Wallpaper", price: "25/sqft", imageUri: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=200&h=200&fit=crop", href: "/(customer)/booking/wallpaper", rating: 4.6, verified: true },
            { hindi: "पर्दा", english: "Curtain", price: "150", imageUri: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=200&h=200&fit=crop", href: "/(customer)/booking/curtain", rating: 4.7, verified: true },
            { hindi: "फर्नीचर", english: "Furniture", price: "500", imageUri: "https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=200&h=200&fit=crop", href: "/(customer)/booking/furniture", rating: 4.8, verified: true },
            { hindi: "पॉलिश", english: "Polish", price: "20/sqft", imageUri: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=200&h=200&fit=crop", href: "/(customer)/booking/polish", rating: 4.5, verified: true },
        ]
    },
    {
        title: "घर सेवा | Home Services",
        data: [
            { hindi: "एसी वाला", english: "AC Repair", price: "499", imageUri: "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=200&h=200&fit=crop", href: "/(customer)/booking/ac", rating: 4.7, verified: true },
            { hindi: "आरओ", english: "RO Service", price: "299", imageUri: "https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=200&h=200&fit=crop", href: "/(customer)/booking/ro", rating: 4.8, verified: true },
            { hindi: "सफाई", english: "Cleaning", price: "999", imageUri: "https://images.unsplash.com/photo-1581578731117-104f8a3d3dfa?w=200&h=200&fit=crop", href: "/(customer)/booking/cleaning", rating: 4.9, verified: true },
            { hindi: "कीड़े", english: "Pest Control", price: "799", imageUri: "https://images.unsplash.com/photo-1633511090164-b43840ea1607?w=200&h=200&fit=crop", href: "/(customer)/booking/pest", rating: 4.6, verified: true },
            { hindi: "रिपेयर", english: "Appliance Repair", price: "199", imageUri: "https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=200&h=200&fit=crop", href: "/(customer)/booking/appliance", rating: 4.7, verified: true },
            { hindi: "टैंक सफाई", english: "Tank Cleaning", price: "499", imageUri: "https://images.unsplash.com/photo-1603712725038-e9334ae8f39f?w=200&h=200&fit=crop", href: "/(customer)/booking/tank", rating: 4.8, verified: true },
            { hindi: "सोलर", english: "Solar", price: "2500", imageUri: "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=200&h=200&fit=crop", href: "/(customer)/booking/solar", rating: 4.9, verified: true },
        ]
    },
    {
        title: "लॉजिस्टिक्स | Logistics",
        data: [
            { hindi: "टेम्पो", english: "Tempo", price: "500", imageUri: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=200&h=200&fit=crop", href: "/(customer)/booking/tempo", rating: 4.7, verified: true },
            { hindi: "लोडिंग", english: "Loading", price: "300", imageUri: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=200&h=200&fit=crop", href: "/(customer)/booking/loading", rating: 4.6, verified: true },
        ]
    }
];

export function ServiceGrid() {
    return (
        <View className="pb-20">
            {SERVICE_CATEGORIES.map((category, index) => (
                <View key={index} className="mb-6">
                    <Text className="text-base font-bold text-secondary mb-3 ml-1 tracking-wide">{category.title}</Text>
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="-mx-2">
                        {category.data.map((service, idx) => (
                            <ServiceCard
                                key={idx}
                                title={service.hindi}
                                hindi={service.hindi}
                                english={service.english}
                                imageUri={service.imageUri}
                                href={service.href}
                                price={service.price}
                                rating={service.rating}
                                verified={service.verified}
                                delay={idx * 80}
                            />
                        ))}
                    </ScrollView>
                </View>
            ))}
        </View>
    );
}
