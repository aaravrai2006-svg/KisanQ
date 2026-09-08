export interface QueueItem {
  token: string
  farmer: string
  phone: string
  village: string
  crop: string
  quantity: string
  quintals: number
  vehicle: string
  status: 'Waiting' | 'Inspection' | 'Weighing' | 'Ready' | 'Completed'
  arrivalTime: string
  window: string
}

export interface CentreItem {
  id: string
  name: string
  district: string
  type: string
  manager: string
  phone: string
  activeBridges: number
  totalBridges: number
  capacityMT: number
  currentStockMT: number
  todayIntakeMT: number
  targetIntakeMT: number
  queueCount: number
  status: 'Open' | 'Peak Queue' | 'Closed'
  acceptedCrops: string[]
}

export interface PaymentItem {
  id: string
  dbtRef: string
  farmerId: string
  farmerName: string
  bankName: string
  accountMask: string
  ifsc: string
  crop: string
  quintals: number
  mspRate: number
  amount: number
  status: 'Disbursed' | 'Processing' | 'Flagged'
  utr?: string
  date: string
}

export interface ReportMetric {
  crop: string
  tonnage: number
  percentage: number
  valueCrores: number
  avgMoisture: string
}

export const MOCK_QUEUE_ITEMS: QueueItem[] = [
  {
    token: 'A-030',
    farmer: 'Ramesh Kumar',
    phone: '9876543210',
    village: 'Dharampur',
    crop: 'Wheat (Sharbati)',
    quantity: '48.50 Qtl',
    quintals: 48.5,
    vehicle: 'PB-10-CZ-4921',
    status: 'Ready',
    arrivalTime: '09:42 AM',
    window: 'Window 02',
  },
  {
    token: 'A-031',
    farmer: 'Suresh Patel',
    phone: '9812457890',
    village: 'Rasulpur',
    crop: 'Wheat (PBW-550)',
    quantity: '62.00 Qtl',
    quintals: 62.0,
    vehicle: 'PB-11-AB-1823',
    status: 'Weighing',
    arrivalTime: '09:55 AM',
    window: 'Window 01',
  },
  {
    token: 'A-032',
    farmer: 'Meena Devi',
    phone: '9845123980',
    village: 'Kotla Kalan',
    crop: 'Rice (Basmati 1121)',
    quantity: '34.20 Qtl',
    quintals: 34.2,
    vehicle: 'PB-10-TY-9021',
    status: 'Inspection',
    arrivalTime: '10:02 AM',
    window: 'Lab Counter 3',
  },
  {
    token: 'A-033',
    farmer: 'Harish Lal',
    phone: '9789012345',
    village: 'Bhatinda Jatt',
    crop: 'Wheat (Sharbati)',
    quantity: '84.00 Qtl',
    quintals: 84.0,
    vehicle: 'PB-03-LK-7711',
    status: 'Waiting',
    arrivalTime: '10:14 AM',
    window: 'Queue Line A',
  },
  {
    token: 'A-034',
    farmer: 'Kamla Bai',
    phone: '9654128901',
    village: 'Fatehgarh',
    crop: 'Mustard (Pusa Bold)',
    quantity: '22.50 Qtl',
    quintals: 22.5,
    vehicle: 'PB-10-XX-4310',
    status: 'Waiting',
    arrivalTime: '10:18 AM',
    window: 'Queue Line B',
  },
  {
    token: 'A-035',
    farmer: 'Gurpreet Singh',
    phone: '9988776655',
    village: 'Nabha Patti',
    crop: 'Wheat (HD-2967)',
    quantity: '110.00 Qtl',
    quintals: 110.0,
    vehicle: 'PB-23-RT-6622',
    status: 'Waiting',
    arrivalTime: '10:22 AM',
    window: 'Queue Line A',
  },
  {
    token: 'A-036',
    farmer: 'Jaswinder Kaur',
    phone: '9765432109',
    village: 'Sirhind Road',
    crop: 'Mustard (Varuna)',
    quantity: '38.00 Qtl',
    quintals: 38.0,
    vehicle: 'PB-10-MM-3109',
    status: 'Waiting',
    arrivalTime: '10:25 AM',
    window: 'Queue Line B',
  },
]

export const MOCK_CENTRES: CentreItem[] = [
  {
    id: 'CTR-01',
    name: 'Dharampur Main Procurement Yard',
    district: 'Ludhiana Central',
    type: 'Category A Mandi Yard',
    manager: 'Arjun Singh',
    phone: '+91 98123-45678',
    activeBridges: 3,
    totalBridges: 4,
    capacityMT: 12000,
    currentStockMT: 8400,
    todayIntakeMT: 480,
    targetIntakeMT: 600,
    queueCount: 38,
    status: 'Open',
    acceptedCrops: ['Wheat', 'Paddy', 'Mustard', 'Maize'],
  },
  {
    id: 'CTR-02',
    name: 'Mandi Yard — Sector 4 Hub',
    district: 'Ludhiana East',
    type: 'Sub-Division Yard',
    manager: 'Rajinder Verma',
    phone: '+91 98761-23450',
    activeBridges: 2,
    totalBridges: 2,
    capacityMT: 8500,
    currentStockMT: 7100,
    todayIntakeMT: 310,
    targetIntakeMT: 350,
    queueCount: 24,
    status: 'Peak Queue',
    acceptedCrops: ['Wheat', 'Mustard'],
  },
  {
    id: 'CTR-03',
    name: 'Kisan Seva Kendra Depot',
    district: 'Samrala Rural',
    type: 'Primary Cooperative Centre',
    manager: 'Gurmeet Dhillon',
    phone: '+91 94172-88990',
    activeBridges: 2,
    totalBridges: 2,
    capacityMT: 5000,
    currentStockMT: 2200,
    todayIntakeMT: 145,
    targetIntakeMT: 250,
    queueCount: 9,
    status: 'Open',
    acceptedCrops: ['Paddy', 'Pulses', 'Wheat'],
  },
  {
    id: 'CTR-04',
    name: 'Nabha Road Grain Terminal',
    district: 'Patiala Border',
    type: 'Bulk Rail-Head Silo',
    manager: 'Vikramjit Randhawa',
    phone: '+91 98881-00213',
    activeBridges: 4,
    totalBridges: 5,
    capacityMT: 25000,
    currentStockMT: 18900,
    todayIntakeMT: 920,
    targetIntakeMT: 1100,
    queueCount: 42,
    status: 'Open',
    acceptedCrops: ['Wheat', 'Paddy'],
  },
  {
    id: 'CTR-05',
    name: 'Sirhind State Warehouse Silos',
    district: 'Fatehgarh Sahib',
    type: 'FCI Certified Modern Silo',
    manager: 'Surinder Pal',
    phone: '+91 98552-33411',
    activeBridges: 3,
    totalBridges: 3,
    capacityMT: 30000,
    currentStockMT: 14200,
    todayIntakeMT: 650,
    targetIntakeMT: 800,
    queueCount: 15,
    status: 'Open',
    acceptedCrops: ['Wheat', 'Maize'],
  },
]

export const MOCK_PAYMENTS: PaymentItem[] = [
  {
    id: 'PMT-9001',
    dbtRef: 'DBT-2026-SBIN-8912',
    farmerId: 'KS-2491',
    farmerName: 'Ramesh Kumar',
    bankName: 'State Bank of India',
    accountMask: '•••• 2491',
    ifsc: 'SBIN0001428',
    crop: 'Wheat (Sharbati)',
    quintals: 48.5,
    mspRate: 2425,
    amount: 117612.5,
    status: 'Processing',
    date: 'Today, 10:28 AM',
  },
  {
    id: 'PMT-9002',
    dbtRef: 'DBT-2026-PUNB-4190',
    farmerId: 'KS-1823',
    farmerName: 'Baldev Singh',
    bankName: 'Punjab National Bank',
    accountMask: '•••• 7712',
    ifsc: 'PUNB0182900',
    crop: 'Wheat (PBW-550)',
    quintals: 82.0,
    mspRate: 2425,
    amount: 198850.0,
    status: 'Disbursed',
    utr: 'CMS29018402941',
    date: 'Today, 08:45 AM',
  },
  {
    id: 'PMT-9003',
    dbtRef: 'DBT-2026-HDFC-9932',
    farmerId: 'KS-3304',
    farmerName: 'Satwinder Kaur',
    bankName: 'HDFC Bank Ltd',
    accountMask: '•••• 5590',
    ifsc: 'HDFC0000412',
    crop: 'Mustard (Pusa)',
    quintals: 30.5,
    mspRate: 5680,
    amount: 173240.0,
    status: 'Disbursed',
    utr: 'CMS29018391204',
    date: 'Yesterday, 04:12 PM',
  },
  {
    id: 'PMT-9004',
    dbtRef: 'DBT-2026-ICIC-2104',
    farmerId: 'KS-4199',
    farmerName: 'Manpreet Sandhu',
    bankName: 'ICICI Bank',
    accountMask: '•••• 8821',
    ifsc: 'ICIC0000210',
    crop: 'Wheat (HD-3086)',
    quintals: 65.0,
    mspRate: 2425,
    amount: 157625.0,
    status: 'Disbursed',
    utr: 'CMS29018102933',
    date: 'Yesterday, 02:30 PM',
  },
  {
    id: 'PMT-9005',
    dbtRef: 'DBT-2026-BARB-6512',
    farmerId: 'KS-5120',
    farmerName: 'Karamjit Lal',
    bankName: 'Bank of Baroda',
    accountMask: '•••• 3198',
    ifsc: 'BARB0LUDHIA',
    crop: 'Rice (Paddy Common)',
    quintals: 44.0,
    mspRate: 2190,
    amount: 96360.0,
    status: 'Flagged',
    date: 'Yesterday, 11:15 AM',
  },
  {
    id: 'PMT-9006',
    dbtRef: 'DBT-2026-SBIN-7731',
    farmerId: 'KS-2908',
    farmerName: 'Kulwinder Singh',
    bankName: 'State Bank of India',
    accountMask: '•••• 1045',
    ifsc: 'SBIN0002190',
    crop: 'Wheat (Sharbati)',
    quintals: 52.0,
    mspRate: 2425,
    amount: 126100.0,
    status: 'Disbursed',
    utr: 'CMS29017992011',
    date: '05 Sep 2026',
  },
]

export const MOCK_REPORTS: ReportMetric[] = [
  {
    crop: 'Wheat (Sharbati / PBW)',
    tonnage: 28450,
    percentage: 64,
    valueCrores: 68.99,
    avgMoisture: '11.1%',
  },
  {
    crop: 'Paddy / Basmati',
    tonnage: 9780,
    percentage: 22,
    valueCrores: 21.41,
    avgMoisture: '13.4%',
  },
  {
    crop: 'Mustard (Seed)',
    tonnage: 4450,
    percentage: 10,
    valueCrores: 25.27,
    avgMoisture: '7.8%',
  },
  {
    crop: 'Maize & Coarse',
    tonnage: 1780,
    percentage: 4,
    valueCrores: 3.72,
    avgMoisture: '12.0%',
  },
]
