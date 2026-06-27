export interface ServiceCategory {
  id: string;
  name: string;
  nameHi: string;
  icon: string;                 // MaterialCommunityIcons name
  color: string;
  workerCount: number;
}

export const mockCategories: ServiceCategory[] = [
  {
    id: 'cat1',
    name: 'Painting',
    nameHi: 'पेंटिंग',
    icon: 'format-paint',
    color: '#E65100',
    workerCount: 48,
  },
  {
    id: 'cat2',
    name: 'Plumbing',
    nameHi: 'प्लंबिंग',
    icon: 'water-pump',
    color: '#1565C0',
    workerCount: 36,
  },
  {
    id: 'cat3',
    name: 'Electrical',
    nameHi: 'इलेक्ट्रिकल',
    icon: 'lightning-bolt',
    color: '#F57F17',
    workerCount: 52,
  },
  {
    id: 'cat4',
    name: 'Carpentry',
    nameHi: 'बढ़ईगिरी',
    icon: 'hammer-screwdriver',
    color: '#5D4037',
    workerCount: 29,
  },
  {
    id: 'cat5',
    name: 'Cleaning',
    nameHi: 'सफाई',
    icon: 'broom',
    color: '#00796B',
    workerCount: 64,
  },
  {
    id: 'cat6',
    name: 'AC Service',
    nameHi: 'AC सर्विस',
    icon: 'air-conditioner',
    color: '#0277BD',
    workerCount: 31,
  },
  {
    id: 'cat7',
    name: 'Gardening',
    nameHi: 'बागवानी',
    icon: 'flower-tulip',
    color: '#2E7D32',
    workerCount: 18,
  },
  {
    id: 'cat8',
    name: 'Masonry',
    nameHi: 'राजमिस्त्री',
    icon: 'wall',
    color: '#6D4C41',
    workerCount: 22,
  },
];
