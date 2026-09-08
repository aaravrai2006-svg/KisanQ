'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export type Language = 'en' | 'hi'

export interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: (key: string, fallback?: string) => string
}

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Top Navigation
    'brand.name': 'KisanQ',
    'brand.tagline': 'Procurement made simple',
    'nav.overview': 'Overview',
    'nav.centers': 'Find a centre',
    'nav.queue': 'My queue token',
    'nav.status': 'Procurement status',
    'nav.notifications': 'Notifications',
    'nav.help': 'Help & support',
    'nav.mode_switch': 'हिंदी / Hindi mode',
    'nav.mode_switch_active': 'English mode',
    'nav.admin_login': 'Admin console login',
    'topbar.sign_in': 'Sign In',
    'topbar.register': 'Register',
    'topbar.sign_in_switch': 'Sign In / Switch Account',
    'topbar.register_new': '+ Register New Farmer',
    'topbar.signed_in_as': 'Signed in as',
    'topbar.logout': 'Log Out',
    'topbar.view_profile': 'View profile',
    'topbar.profile_updated': 'Profile details are up to date',
    'topbar.signed_out': 'Signed out successfully',

    // Home / Overview Welcome
    'home.date': 'TODAY · SEASON 2026',
    'home.greeting': 'Good morning,',
    'home.farmer': 'Farmer',
    'home.subtitle': 'Your farm, your produce, your fair price — all in one place.',
    'home.hero_tag': '● SEASON 2026 · WHEAT',
    'home.hero_title': 'Sell your harvest\nwith confidence.',
    'home.hero_desc': 'Skip the waiting room. Get your token online and arrive when it\'s your turn.',
    'home.get_token_btn': 'Get a queue token',
    'home.token_generated': 'Token generated successfully',

    // Dashboard Stats
    'stats.activity_title': 'Your activity',
    'stats.activity_subtitle': 'A quick look at your procurement journey.',
    'stats.view_history': 'View history →',
    'stats.current_queue': 'Current queue',
    'stats.estimated_wait': 'Estimated wait',
    'stats.next_in_line': 'You are next in line',
    'stats.this_season': 'This season',
    'stats.quintals_sold': '12.4 quintals sold',

    // Live Procurement Status on Dashboard
    'live_proc.badge': 'LIVE CONSIGNMENT STATUS',
    'live_proc.title': 'Active Harvest Consignment',
    'live_proc.subtitle': 'Real-time tracking from entry gate to direct bank transfer (DBT).',
    'live_proc.lot_no': 'Lot #KS-2026-8941',
    'live_proc.token_label': 'Token',
    'live_proc.vehicle': 'Vehicle / Trolley',
    'live_proc.vehicle_val': 'PB-10-CZ-4921 (Tractor Trolley)',
    'live_proc.center_label': 'Procurement Centre',
    'live_proc.center_val': 'Dharampur Procurement Centre · Gate 1',
    'live_proc.crop_label': 'Crop & Variety',
    'live_proc.crop_val': 'Wheat (Sharbati Grade A)',
    'live_proc.net_weight': 'Net Weight',
    'live_proc.net_weight_val': '48.50 Quintals (4,850 kg)',
    'live_proc.gross_weight': 'Gross: 6,420 kg | Tare: 1,570 kg',
    'live_proc.msp_rate': 'MSP Rate',
    'live_proc.msp_rate_val': '₹2,425 / quintal',
    'live_proc.total_payout': 'Estimated Payout',
    'live_proc.total_payout_val': '₹1,17,612.50',
    'live_proc.current_stage': 'Current Stage: MSP Verification & Bill Generation',

    // 5 Stages
    'stage.1.title': 'Gate Inward Scan',
    'stage.1.time': '09:42 AM · Gate #1',
    'stage.1.desc': 'Vehicle entry logged, QR verified & token validated.',
    'stage.2.title': 'Moisture & Quality Check',
    'stage.2.time': '10:05 AM · Lab Counter 3',
    'stage.2.desc': 'Moisture: 11.2% (Max 12%). Grade A clean grain accepted.',
    'stage.3.title': 'Electronic Weighbridge',
    'stage.3.time': '10:28 AM · Scale #2',
    'stage.3.desc': 'Gross 6,420 kg - Tare 1,570 kg = 48.50 Quintals net.',
    'stage.4.title': 'MSP & Bill Generation',
    'stage.4.time': 'In Progress · Desk 4',
    'stage.4.desc': 'Form J / Mandi Sale Slip #EP-9021 being generated at ₹2,425/qtl.',
    'stage.5.title': 'DBT Direct Bank Credit',
    'stage.5.time': 'Scheduled · PFMS/NPCI',
    'stage.5.desc': 'Direct payment to SBI A/C •••• 2491 within 24-48 hours.',

    // Live Procurement Modal/Actions
    'live_proc.btn_slip': 'View Mandi Slip',
    'live_proc.btn_cert': 'Inspection Report',
    'live_proc.btn_dbt': 'Track DBT Payment',
    'live_proc.receipt_title': 'Electronic Mandi Weighment Slip',
    'live_proc.receipt_close': 'Close Slip',
    'live_proc.receipt_print': 'Print / Download Slip',

    // Nearby Centres
    'centres.nearby_title': 'Nearby procurement centres',
    'centres.nearby_subtitle': 'Live availability around you',
    'centres.see_all': 'See all',
    'centres.open_now': 'Open now',
    'centres.opens_at': 'Opens at 9:00 AM',
    'centres.get_directions': 'Get directions',
    'centres.get_token': 'Get token',
    'centres.search_placeholder': 'Search by centre, village or crop',
    'centres.filter': 'Filter',
    'centres.your_location': 'Your location · Dharampur',
    'centres.page_title': 'Find a procurement centre',
    'centres.page_subtitle': 'Choose a centre with the shortest wait near you.',

    // Mandi Prices
    'prices.title': "Today's mandi prices",
    'prices.subtitle': 'Updated 10 minutes ago',
    'prices.live_badge': 'LIVE',
    'prices.wheat': 'Wheat',
    'prices.mustard': 'Mustard',
    'prices.paddy': 'Paddy',
    'prices.per_quintal': 'per quintal',

    // Queue Token View
    'queue.page_title': 'Your queue token',
    'queue.page_subtitle': 'Dharampur Procurement Centre · Today, Season 2026',
    'queue.your_token': 'YOUR TOKEN',
    'queue.token_details': 'Wheat · 48.50 quintals',
    'queue.arrive_by': 'Arrive by',
    'queue.arrive_time': '10:42 AM',
    'queue.counter': 'Counter',
    'queue.counter_no': 'Window 02',
    'queue.live_position': 'Live queue position',
    'queue.updated_now': 'Updated just now',
    'queue.people_ahead': 'people ahead of you',
    'queue.now_serving': 'Now serving',
    'queue.cancel_token': 'Cancel token',
    'queue.back_overview': 'Back to overview',
    'queue.tip': 'Keep this screen handy. We\'ll notify you when your turn is near.',

    // Harvest Journey / Status View
    'status.page_title': 'Harvest journey',
    'status.page_subtitle': 'Track your produce from arrival to payment.',
    'status.processing_badge': '● PAYMENT PROCESSING',
    'status.payment_details': 'Payment details',
    'status.bank_account': 'Bank account',
    'status.msp_rate_label': 'MSP rate',
    'status.gross_amount': 'Gross amount',
    'status.expected_by': 'Expected by',
    'status.timeline_arrived': 'Arrived',
    'status.timeline_qc': 'Quality checked',
    'status.timeline_accepted': 'Accepted',
    'status.timeline_payment': 'Payment processing',

    // Notifications
    'notif.page_title': 'Notifications',
    'notif.page_subtitle': 'Important updates about your harvest and centre.',
    'notif.1_title': 'Your turn is coming up',
    'notif.1_text': 'You are 12th in line at Dharampur Procurement Centre.',
    'notif.1_time': 'Just now',
    'notif.2_title': 'Payment is processing',
    'notif.2_text': '₹1,17,612.50 for Wheat · 48.5 quintals is on its way to account •••• 2491.',
    'notif.2_time': 'Today, 10:18 AM',
    'notif.3_title': 'Mandi prices updated',
    'notif.3_text': 'Wheat prices increased by 2.1% today. Current MSP is ₹2,425/qtl.',
    'notif.3_time': 'Today, 9:30 AM',

    // Help
    'help.page_title': 'How can we help?',
    'help.page_subtitle': 'Find quick answers or talk to our support team.',
    'help.q1_title': 'How do tokens work?',
    'help.q1_sub': 'Get a token in 3 simple steps →',
    'help.q2_title': 'Payment & MSP rates',
    'help.q2_sub': 'Understand your payment →',
    'help.q3_title': 'Talk to support',
    'help.q3_sub': '1800-180-1551 · Toll free →',
  },
  hi: {
    // Brand & Top Navigation
    'brand.name': 'किसान क्यू (KisanQ)',
    'brand.tagline': 'फसल खरीद अब हुई आसान',
    'nav.overview': 'अवलोकन (होम)',
    'nav.centers': 'खरीद केंद्र खोजें',
    'nav.queue': 'मेरा कतार टोकन',
    'nav.status': 'खरीद स्थिति',
    'nav.notifications': 'सूचनाएं',
    'nav.help': 'सहायता एवं संपर्क',
    'nav.mode_switch': 'English / अंग्रेजी मोड',
    'nav.mode_switch_active': 'हिंदी मोड',
    'nav.admin_login': 'प्रशासक (एडमिन) लॉगिन',
    'topbar.sign_in': 'साइन इन',
    'topbar.register': 'पंजीकरण',
    'topbar.sign_in_switch': 'साइन इन / खाता बदलें',
    'topbar.register_new': '+ नया किसान पंजीकरण',
    'topbar.signed_in_as': 'लॉगिन खाता:',
    'topbar.logout': 'लॉग आउट',
    'topbar.view_profile': 'प्रोफ़ाइल देखें',
    'topbar.profile_updated': 'प्रोफ़ाइल विवरण अद्यतन हैं',
    'topbar.signed_out': 'सफलतापूर्वक लॉग आउट हो गया',

    // Home / Overview Welcome
    'home.date': 'आज · सीज़न 2026',
    'home.greeting': 'सुप्रभात,',
    'home.farmer': 'किसान भाई',
    'home.subtitle': 'आपका खेत, आपकी उपज, आपका सही दाम — सब कुछ एक ही जगह।',
    'home.hero_tag': '● सीज़न 2026 · गेहूं खरीद',
    'home.hero_title': 'अपनी फसल बेचें\nपूरे विश्वास के साथ।',
    'home.hero_desc': 'मंडी में लंबी कतारों से बचें। घर बैठे ऑनलाइन टोकन लें और अपनी बारी आने पर ही मंडी पहुंचें।',
    'home.get_token_btn': 'कतार टोकन प्राप्त करें',
    'home.token_generated': 'टोकन सफलतापूर्वक जनरेट हुआ',

    // Dashboard Stats
    'stats.activity_title': 'आपकी गतिविधि',
    'stats.activity_subtitle': 'आपकी हालिया फसल खरीद और स्थिति का विवरण।',
    'stats.view_history': 'इतिहास देखें →',
    'stats.current_queue': 'वर्तमान टोकन',
    'stats.estimated_wait': 'अनुमानित प्रतीक्षा',
    'stats.next_in_line': 'आप अगली बारी में हैं',
    'stats.this_season': 'इस सीज़न कुल बिक्री',
    'stats.quintals_sold': '12.4 क्विंटल बिका',

    // Live Procurement Status on Dashboard
    'live_proc.badge': 'लाइव फसल खरीद स्थिति (LIVE)',
    'live_proc.title': 'सक्रिय फसल खरीद लॉट',
    'live_proc.subtitle': 'मंडी गेट एंट्री से लेकर बैंक खाते में डीबीटी (DBT) भुगतान तक का लाइव स्टेटस।',
    'live_proc.lot_no': 'लॉट संख्या #KS-2026-8941',
    'live_proc.token_label': 'टोकन नंबर',
    'live_proc.vehicle': 'वाहन / ट्रॉली नंबर',
    'live_proc.vehicle_val': 'PB-10-CZ-4921 (ट्रैक्टर ट्रॉली)',
    'live_proc.center_label': 'खरीद केंद्र',
    'live_proc.center_val': 'धरमपुर मुख्य खरीद केंद्र · गेट 1',
    'live_proc.crop_label': 'फसल एवं किस्म',
    'live_proc.crop_val': 'गेहूं (शरबती - ग्रेड A)',
    'live_proc.net_weight': 'शुद्ध वजन (Net)',
    'live_proc.net_weight_val': '48.50 क्विंटल (4,850 किग्रा)',
    'live_proc.gross_weight': 'सकल वजन: 6,420 किग्रा | खाली ट्रॉली: 1,570 किग्रा',
    'live_proc.msp_rate': 'सरकारी एमएसपी दर',
    'live_proc.msp_rate_val': '₹2,425 / क्विंटल',
    'live_proc.total_payout': 'अनुमानित कुल भुगतान',
    'live_proc.total_payout_val': '₹1,17,612.50',
    'live_proc.current_stage': 'वर्तमान चरण: एमएसपी बिल सत्यापन जारी है',

    // 5 Stages
    'stage.1.title': 'गेट पर आवक स्कैन',
    'stage.1.time': 'सुबह 09:42 · गेट #1',
    'stage.1.desc': 'ट्रॉली एंट्री दर्ज, किसान क्यूआर कोड एवं टोकन सत्यापित।',
    'stage.2.title': 'नमी एवं गुणवत्ता जांच',
    'stage.2.time': 'सुबह 10:05 · लैब काउंटर 3',
    'stage.2.desc': 'नमी: 11.2% (अनुमेय: 12% से कम)। ग्रेड A दाना स्वीकृत।',
    'stage.3.title': 'इलेक्ट्रॉनिक धर्म कांटा (वजन)',
    'stage.3.time': 'सुबह 10:28 · कांटा #2',
    'stage.3.desc': 'कुल 6,420 किग्रा - खाली 1,570 किग्रा = 48.50 क्विंटल शुद्ध वजन।',
    'stage.4.title': 'एमएसपी बिल (फॉर्म J) जनरेशन',
    'stage.4.time': 'प्रक्रियाधीन · डेस्क 4',
    'stage.4.desc': 'मंडी बिक्री रसीद #EP-9021 जनरेट की जा रही है @ ₹2,425/क्विंटल।',
    'stage.5.title': 'डीबीटी प्रत्यक्ष बैंक भुगतान',
    'stage.5.time': 'निर्धारित · PFMS / NPCI',
    'stage.5.desc': 'एसबीआई खाता •••• 2491 में 24-48 घंटे के भीतर राशि हस्तांतरित होगी।',

    // Live Procurement Modal/Actions
    'live_proc.btn_slip': 'मंडी पर्ची देखें',
    'live_proc.btn_cert': 'जांच प्रमाणपत्र',
    'live_proc.btn_dbt': 'डीबीटी स्थिति ट्रैक करें',
    'live_proc.receipt_title': 'इलेक्ट्रॉनिक मंडी तौल पर्ची (e-Mandi Slip)',
    'live_proc.receipt_close': 'पर्ची बंद करें',
    'live_proc.receipt_print': 'प्रिंट / डाउनलोड पर्ची',

    // Nearby Centres
    'centres.nearby_title': 'आस-पास के खरीद केंद्र',
    'centres.nearby_subtitle': 'आपके निकटतम केंद्रों की लाइव स्थिति',
    'centres.see_all': 'सभी देखें',
    'centres.open_now': 'खुला है',
    'centres.opens_at': 'सुबह 9:00 बजे खुलेगा',
    'centres.get_directions': 'दिशा-निर्देश',
    'centres.get_token': 'टोकन लें',
    'centres.search_placeholder': 'केंद्र, गांव या फसल के नाम से खोजें',
    'centres.filter': 'फ़िल्टर',
    'centres.your_location': 'आपका स्थान · धरमपुर',
    'centres.page_title': 'खरीद केंद्र खोजें',
    'centres.page_subtitle': 'सबसे कम प्रतीक्षा समय वाला नजदीकी केंद्र चुनें।',

    // Mandi Prices
    'prices.title': 'आज के मंडी भाव',
    'prices.subtitle': '10 मिनट पहले अपडेट किया गया',
    'prices.live_badge': 'लाइव भाव',
    'prices.wheat': 'गेहूं',
    'prices.mustard': 'सरसों',
    'prices.paddy': 'धान',
    'prices.per_quintal': 'प्रति क्विंटल',

    // Queue Token View
    'queue.page_title': 'आपका कतार टोकन',
    'queue.page_subtitle': 'धरमपुर खरीद केंद्र · आज, सीज़न 2026',
    'queue.your_token': 'आपका टोकन नंबर',
    'queue.token_details': 'गेहूं · 48.50 क्विंटल',
    'queue.arrive_by': 'पहुंचने का समय',
    'queue.arrive_time': 'सुबह 10:42',
    'queue.counter': 'काउंटर',
    'queue.counter_no': 'खिड़की 02',
    'queue.live_position': 'लाइव कतार स्थिति',
    'queue.updated_now': 'अभी अपडेट हुआ',
    'queue.people_ahead': 'किसान आपसे आगे हैं',
    'queue.now_serving': 'अभी बुलाया जा रहा है',
    'queue.cancel_token': 'टोकन रद्द करें',
    'queue.back_overview': 'वापस मुख्य पृष्ठ पर जाएं',
    'queue.tip': 'इस स्क्रीन को अपने पास रखें। आपकी बारी नजदीक आने पर आपको एसएमएस/नोटिफिकेशन भेजा जाएगा।',

    // Harvest Journey / Status View
    'status.page_title': 'फसल खरीद यात्रा',
    'status.page_subtitle': 'मंडी में आगमन से लेकर बैंक खाते में भुगतान तक का पूरा विवरण।',
    'status.processing_badge': '● भुगतान प्रक्रियाधीन',
    'status.payment_details': 'भुगतान का विवरण',
    'status.bank_account': 'बैंक खाता',
    'status.msp_rate_label': 'एमएसपी दर',
    'status.gross_amount': 'कुल देय राशि',
    'status.expected_by': 'अपेक्षित भुगतान तिथि',
    'status.timeline_arrived': 'आगमन संपन्न',
    'status.timeline_qc': 'गुणवत्ता जांच पास',
    'status.timeline_accepted': 'फसल स्वीकृत',
    'status.timeline_payment': 'भुगतान प्रक्रियाधीन',

    // Notifications
    'notif.page_title': 'सूचनाएं एवं अलर्ट',
    'notif.page_subtitle': 'आपकी फसल खरीद एवं मंडी से जुड़े महत्वपूर्ण अपडेट।',
    'notif.1_title': 'आपकी बारी नजदीक है',
    'notif.1_text': 'धरमपुर खरीद केंद्र पर आप कतार में 12वें स्थान पर हैं। कृपया तैयार रहें।',
    'notif.1_time': 'अभी-अभी',
    'notif.2_title': 'भुगतान प्रक्रिया शुरू हो गई है',
    'notif.2_text': 'गेहूं · 48.5 क्विंटल के लिए ₹1,17,612.50 बैंक खाता •••• 2491 में भेजे जा रहे हैं।',
    'notif.2_time': 'आज, सुबह 10:18',
    'notif.3_title': 'आज के मंडी भाव अपडेट',
    'notif.3_text': 'गेहूं की दरों में आज 2.1% का उछाल। सरकारी एमएसपी ₹2,425/क्विंटल है।',
    'notif.3_time': 'आज, सुबह 9:30',

    // Help
    'help.page_title': 'हम आपकी क्या सहायता कर सकते हैं?',
    'help.page_subtitle': 'अक्सर पूछे जाने वाले प्रश्न या हमारी सहायता टीम से सीधे बात करें।',
    'help.q1_title': 'टोकन कैसे प्राप्त करें?',
    'help.q1_sub': '3 आसान चरणों में टोकन प्राप्त करें →',
    'help.q2_title': 'भुगतान एवं सरकारी एमएसपी दरें',
    'help.q2_sub': 'भुगतान और दरों के नियम समझें →',
    'help.q3_title': 'किसान सहायता केंद्र से बात करें',
    'help.q3_sub': '1800-180-1551 · टोल फ्री सहायता →',
  },
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en')

  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('kisanq_lang') as Language | null
      if (savedLang === 'en' || savedLang === 'hi') {
        setLanguageState(savedLang)
      }
    } catch {
      // LocalStorage access fallback
    }
  }, [])

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    try {
      localStorage.setItem('kisanq_lang', lang)
    } catch {
      // Ignore
    }
  }

  const toggleLanguage = () => {
    const next = language === 'en' ? 'hi' : 'en'
    setLanguage(next)
  }

  const t = (key: string, fallback?: string): string => {
    const dict = translations[language]
    if (dict && dict[key]) {
      return dict[key]
    }
    const defaultDict = translations.en
    if (defaultDict && defaultDict[key]) {
      return defaultDict[key]
    }
    return fallback || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
