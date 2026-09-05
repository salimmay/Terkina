// Master registry of every editable, trilingual string on the public site.
//
// Each entry is the single source of truth for:
//  1. The fallback text components render before any admin override loads
//     (and forever, if a field is never edited).
//  2. What the Admin -> Website Text editor lists, grouped and searchable.
//
// Call sites use `t(key, fallback)` where `fallback` repeats this entry's
// `en` value — that keeps components correct even if a key is ever renamed
// here without updating every call site immediately.
export interface TranslationField {
  key: string;
  group: string;
  label: string;
  en: string;
  fr: string;
  ar: string;
}

export const TRANSLATION_REGISTRY: TranslationField[] = [
  // ============================= NAVIGATION =============================
  { key: 'nav.weddings', group: 'Navigation', label: 'Nav link: Weddings', en: 'Med Art (Weddings)', fr: 'Mariages (Med Art)', ar: 'أعراس (Med Art)' },
  { key: 'nav.production', group: 'Navigation', label: 'Nav link: Production', en: 'Terkina (Commercial)', fr: 'Production (Terkina)', ar: 'إنتاج (Terkina)' },
  { key: 'nav.about', group: 'Navigation', label: 'Nav link: About Us', en: 'About Us', fr: 'À Propos', ar: 'من نحن' },
  { key: 'nav.contact', group: 'Navigation', label: 'Nav link: Contact', en: 'Contact', fr: 'Contact', ar: 'تواصل معنا' },
  { key: 'nav.marketplace', group: 'Navigation', label: 'Nav link (3D page): Collection', en: '3D Collection', fr: 'Collection 3D', ar: 'المتجر والمنتجات' },
  { key: 'nav.customPrint', group: 'Navigation', label: 'Nav link (3D page): Custom Print', en: 'Custom Print', fr: 'Sur Mesure', ar: 'طلب طباعة خاصة' },
  { key: 'nav.mobileMenuTitle', group: 'Navigation', label: 'Mobile drawer title', en: 'Menu Navigation', fr: 'Menu de Navigation', ar: 'القائمة الرئيسية' },
  { key: 'nav.mobileWhatsappCta', group: 'Navigation', label: 'Mobile drawer WhatsApp button', en: '💬 Instant WhatsApp Booking →', fr: '💬 Réservation WhatsApp Instantanée →', ar: '💬 حجز فوري عبر واتساب ←' },

  // ========================= HOMEPAGE — HERO =============================
  { key: 'home.hero.medart.subtitle', group: 'Homepage — Hero', label: 'Med Art subtitle', en: 'Capturing timeless love stories, raw emotions, and wedding celebrations with cinematic warmth.', fr: "Immortaliser les plus beaux moments d'émotion, de romance et de célébration nuptiale avec une élégance cinématographique.", ar: 'توثيق أجمل لحظات العمر، العواطف الصادقة، وقصص الحب الخالدة بلمسة سينمائية راقية.' },
  { key: 'home.hero.medart.cta', group: 'Homepage — Hero', label: 'Med Art prompt / button', en: 'Explore Weddings', fr: 'Explorer les Mariages', ar: 'استكشف المعرض' },
  { key: 'home.hero.medart.lensLabel', group: 'Homepage — Hero', label: 'Med Art cursor-lens label', en: 'ENTER MED ART ↗', fr: 'ENTRER MED ART ↗', ar: 'دخول المعرض ↗' },
  { key: 'home.hero.terkina.subtitle', group: 'Homepage — Hero', label: 'Terkina subtitle', en: 'High-impact commercial photography, luxury product shoots, and cinematic brand campaigns.', fr: "Production publicitaire à fort impact, couverture d'événements corporate, campagnes de marque et créations vidéo.", ar: 'إنتاج محتوى إعلاني عالي التأثير، تصوير المنتجات، وتغطية الفعاليات الكبرى بأعلى معايير الإخراج.' },
  { key: 'home.hero.terkina.cta', group: 'Homepage — Hero', label: 'Terkina prompt / button', en: 'Explore Production', fr: 'Explorer la Production', ar: 'استكشف الإنتاج' },
  { key: 'home.hero.terkina.lensLabel', group: 'Homepage — Hero', label: 'Terkina cursor-lens label', en: 'ENTER TERKINA ↗', fr: 'ENTRER TERKINA ↗', ar: 'دخول الإنتاج ↗' },

  // ========================= HOMEPAGE — ABOUT =============================
  { key: 'home.about.badge', group: 'Homepage — About', label: 'Badge', en: 'Who We Are', fr: 'Qui Sommes-Nous', ar: 'من نحن' },
  { key: 'home.about.heading', group: 'Homepage — About', label: 'Heading', en: 'Two Specialized Visions. One Cinematic Standard.', fr: 'Deux Visions Spécialisées. Une Exigence Cinématographique.', ar: 'رؤيتان إبداعيتان بمعيار سينمائي استثنائي.' },
  { key: 'home.about.paragraph1', group: 'Homepage — About', label: 'Paragraph 1', en: 'TERKINA operates as a premier visual creative agency uniting two specialized divisions: MED ART, dedicated to luxury wedding cinematography and bespoke bridal storytelling, and TERKINA PRODUCTION, specializing in high-impact commercial advertising, corporate campaigns, and live event coverage.', fr: "TERKINA est une agence de création visuelle réunissant deux divisions d'excellence : MED ART, dédiée au cinéma de mariage de luxe et récits nuptiaux sur mesure, et TERKINA PRODUCTION, spécialisée dans la production publicitaire, les campagnes de marque et la couverture d'événements.", ar: 'تيركينا هي وكالة إنتاج بصري رائدة تجمع بين قسمين متخصصين: "ميد آرت (MED ART)" المخصص لتوثيق حفلات الزفاف الفاخرة والقصص الرومانسية بلمسة سينمائية، و"تيركينا للإنتاج (TERKINA)" المتخصص في الحملات الإعلانية التجارية وتغطية الفعاليات والمؤتمرات الكبرى.' },
  { key: 'home.about.paragraph2', group: 'Homepage — About', label: 'Paragraph 2', en: 'Whether capturing the raw emotional beauty of wedding vows or directing high-production commercial sets and festival stages, our multi-camera cinema infrastructure and masterclass color science ensure unforgettable visual masterpieces.', fr: "De l'émotion authentique des vœux de mariage aux plateaux de tournage publicitaires et scènes de festivals, nous déployons une technologie cinéma de pointe et une colorimétrie de maître.", ar: 'من توثيق اللحظات العاطفية الصادقة في ليلة العمر إلى إخراج أضخم الحملات الإعلانية وتغطية المهرجانات، نعتمد على أحدث الكاميرات السينمائية وهندسة ألوان احترافية لنصنع لك عملاً بصرياً لا يُنسى.' },
  { key: 'home.about.stat1Label', group: 'Homepage — About', label: 'Counter 1 label', en: 'Weddings & Films', fr: 'Mariages & Films', ar: 'حفل زفاف وفيلم' },
  { key: 'home.about.stat2Label', group: 'Homepage — About', label: 'Counter 2 label', en: 'Cinematic 4K/8K', fr: '4K/8K Cinéma', ar: 'جودة 4K/8K سينمائية' },
  { key: 'home.about.stat3Label', group: 'Homepage — About', label: 'Counter 3 label', en: 'Brands & Events', fr: 'Marques & Événements', ar: 'علامة تجارية وفعالية' },

  // ========================= HOMEPAGE — CONTACT ============================
  { key: 'home.contact.heading', group: 'Homepage — Contact Form', label: 'Heading', en: "Let's Create Cinematic History", fr: "Créons Ensemble un Chef-d'Œuvre", ar: 'دعنا نصنع عملاً بصرياً لا يُنسى' },
  { key: 'home.contact.serviceLabel', group: 'Homepage — Contact Form', label: 'Service field label', en: 'Select Service Type', fr: 'Type de Service', ar: 'الخدمة المطلوبة' },
  { key: 'home.contact.serviceWeddings', group: 'Homepage — Contact Form', label: 'Service option: Weddings', en: '💍 Weddings (Med Art)', fr: '💍 Mariages (Med Art)', ar: '💍 تصوير أعراس (Med Art)' },
  { key: 'home.contact.serviceProduction', group: 'Homepage — Contact Form', label: 'Service option: Commercial', en: '🎬 Commercial & Ads (Terkina)', fr: '🎬 Commercial & Publicité (Terkina)', ar: '🎬 إنتاج تجاري وإعلانات (Terkina)' },
  { key: 'home.contact.service3d', group: 'Homepage — Contact Form', label: 'Service option: 3D', en: '🧊 3D Print Lab & Prototyping', fr: '🧊 Studio Impression 3D & Prototypage', ar: '🧊 مختبر الطباعة ثلاثية الأبعاد والتصنيع' },
  { key: 'home.contact.nameLabel', group: 'Homepage — Contact Form', label: 'Name field label', en: 'Your Name / Couple / Brand', fr: 'Votre Nom / Couple / Entreprise', ar: 'الاسم الكامل / العروسين / الشركة' },
  { key: 'home.contact.namePlaceholder', group: 'Homepage — Contact Form', label: 'Name field placeholder', en: 'e.g. Alexander & Sophia / Brand Name', fr: 'ex. Alexandre & Sophie / Nom de Marque', ar: 'مثال: أحمد وسارة / اسم الشركة' },
  { key: 'home.contact.messageLabel', group: 'Homepage — Contact Form', label: 'Message field label', en: 'Project Scope & Dates', fr: 'Détails du Projet & Date', ar: 'تفاصيل المشروع والموعد' },
  { key: 'home.contact.messagePlaceholder', group: 'Homepage — Contact Form', label: 'Message field placeholder', en: 'Tell us about your wedding date, venue, or commercial campaign scope...', fr: 'Parlez-nous de votre date de mariage, lieu, ou projet publicitaire...', ar: 'أخبرنا عن موعد الزفاف والمكان، أو تفاصيل الحملة الإعلانية والإنتاج...' },
  { key: 'home.contact.buttonText', group: 'Homepage — Contact Form', label: 'Submit button', en: 'Start WhatsApp Chat', fr: 'Lancer le Chat WhatsApp', ar: 'تواصل عبر واتساب فوراً' },

  // =========================== 3D LAB — HERO FEATURES ======================
  { key: 'threeDStudio.feature1Title', group: '3D Lab — Feature Cards', label: 'Feature 1 title', en: 'Micron Precision & Tolerances', fr: 'Précision Micronique', ar: 'دقة ميكرونية فائقة' },
  { key: 'threeDStudio.feature1Desc', group: '3D Lab — Feature Cards', label: 'Feature 1 description', en: 'SLA resin and precision sintered layers down to 0.025mm for ultra-smooth surface finish and mechanical fit.', fr: "Résine SLA et couches frittées de précision jusqu'à 0,025mm pour une finition ultra-lisse et un ajustement mécanique parfait.", ar: 'طباعة ثلاثية الأبعاد بدقة تصل إلى 25 ميكرون لضمان تطابق الأجزاء الميكانيكية والنماذج المعمارية.' },
  { key: 'threeDStudio.feature2Title', group: '3D Lab — Feature Cards', label: 'Feature 2 title', en: 'Rapid Turnaround (24-48h)', fr: 'Livraison Rapide (24-48h)', ar: 'تسليم سريع (24-48 ساعة)' },
  { key: 'threeDStudio.feature2Desc', group: '3D Lab — Feature Cards', label: 'Feature 2 description', en: 'Fast-track fabrication workflows with rapid batch prototyping and direct dispatch for time-sensitive launches.', fr: 'Flux de fabrication accélérés avec prototypage par lots et expédition directe pour vos lancements urgents.', ar: 'إنتاج النماذج الأولية والمصنوعات بسرعة قياسية مع فحص الجودة قبل التسليم والشحن الفوري.' },
  { key: 'threeDStudio.feature3Title', group: '3D Lab — Feature Cards', label: 'Feature 3 title', en: 'Certified Engineering Polymers', fr: "Polymères d'Ingénierie Certifiés", ar: 'بوليمرات وراتنجات معتمدة' },
  { key: 'threeDStudio.feature3Desc', group: '3D Lab — Feature Cards', label: 'Feature 3 description', en: 'Industrial-grade materials including Carbon Fiber Nylon, PC High-Temp, Translucent Resin, and Flexible TPU.', fr: 'Matériaux de qualité industrielle incluant Nylon Fibre de Carbone, PC Haute Température, Résine Translucide et TPU Flexible.', ar: 'خيارات متعددة تشمل الكربون فايبر، الراتنج الشفاف، والـ TPU المرن للاستخدامات الصناعية والجمالية.' },

  // ========================= 3D LAB — MARKETPLACE ==========================
  { key: 'marketplace.badge', group: '3D Lab — Marketplace', label: 'Badge', en: 'Physical Collection & Artifacts', fr: 'Collection Physique & Artefacts', ar: 'المتجر والمصنوعات الملموسة' },
  { key: 'marketplace.heading', group: '3D Lab — Marketplace', label: 'Heading', en: 'Ready-Made 3D Objects', fr: "Objets 3D Prêts à l'Emploi", ar: 'منتجات 3D جاهزة للطلب' },
  { key: 'marketplace.filterAll', group: '3D Lab — Marketplace', label: 'Filter: All', en: 'All Items', fr: 'Tous les Articles', ar: 'الكل' },
  { key: 'marketplace.filterLighting', group: '3D Lab — Marketplace', label: 'Filter: Lighting', en: 'Lighting', fr: 'Éclairage', ar: 'إضاءة' },
  { key: 'marketplace.filterAccessories', group: '3D Lab — Marketplace', label: 'Filter: Desk & Tech', en: 'Desk & Tech', fr: 'Bureau & Tech', ar: 'إكسسوارات' },
  { key: 'marketplace.filterArt', group: '3D Lab — Marketplace', label: 'Filter: Art & Sculptures', en: 'Art & Sculptures', fr: 'Art & Sculptures', ar: 'تحف وفنون' },
  { key: 'marketplace.filterDecor', group: '3D Lab — Marketplace', label: 'Filter: Home Decor', en: 'Home Decor', fr: 'Décoration', ar: 'ديكور' },
  { key: 'marketplace.loadingText', group: '3D Lab — Marketplace', label: 'Loading state', en: 'Loading live 3D inventory...', fr: "Chargement de l'inventaire 3D...", ar: 'جاري تحميل المنتجات...' },
  { key: 'marketplace.emptyText', group: '3D Lab — Marketplace', label: 'Empty state', en: 'No products available in this category.', fr: 'Aucun produit disponible dans cette catégorie.', ar: 'لا توجد منتجات متوفرة في هذا القسم.' },
  { key: 'marketplace.madeToOrderBadge', group: '3D Lab — Marketplace', label: 'Badge: Made to Order', en: 'Made to Order', fr: 'Fabrication sur Demande', ar: 'تصنيع حسب الطلب' },
  { key: 'marketplace.priceOnRequestBadge', group: '3D Lab — Marketplace', label: 'Badge: Price on Request', en: 'Price on Request', fr: 'Prix sur Demande', ar: 'السعر عند الطلب' },
  { key: 'marketplace.orderButton', group: '3D Lab — Marketplace', label: 'Button: Order on WhatsApp', en: 'Order on WhatsApp', fr: 'Commander sur WhatsApp', ar: 'اطلب عبر واتساب' },
  { key: 'marketplace.backorderButton', group: '3D Lab — Marketplace', label: 'Button: Request Backorder', en: 'Request Backorder ↗', fr: 'Demander une Précommande ↗', ar: 'طلب تصنيع مخصص ↗' },

  // ====================== 3D LAB — PRODUCT MODAL ===========================
  { key: 'product3dModal.selectColorLabel', group: '3D Lab — Product Modal', label: 'Color selector label', en: 'Select Color / Finish:', fr: 'Choisir Couleur / Finition :', ar: 'اختر اللون / التشطيب:' },
  { key: 'product3dModal.specsHeading', group: '3D Lab — Product Modal', label: 'Specs heading', en: 'Technical Specifications', fr: 'Spécifications Techniques', ar: 'المواصفات التقنية' },
  { key: 'product3dModal.materialLabel', group: '3D Lab — Product Modal', label: 'Spec: Material', en: 'Material', fr: 'Matériau', ar: 'المادة' },
  { key: 'product3dModal.dimensionsLabel', group: '3D Lab — Product Modal', label: 'Spec: Dimensions', en: 'Dimensions', fr: 'Dimensions', ar: 'الأبعاد' },
  { key: 'product3dModal.layerHeightLabel', group: '3D Lab — Product Modal', label: 'Spec: Layer Height', en: 'Layer Height', fr: 'Épaisseur de Couche', ar: 'سماكة الطبقة' },
  { key: 'product3dModal.printTimeLabel', group: '3D Lab — Product Modal', label: 'Spec: Print Time', en: 'Print Time', fr: "Temps d'Impression", ar: 'مدة الطباعة' },
  { key: 'product3dModal.orderButtonPrefix', group: '3D Lab — Product Modal', label: 'Order button prefix (before color name)', en: 'Order on WhatsApp in', fr: 'Commander sur WhatsApp en', ar: 'اطلب عبر واتساب بلون' },
  { key: 'product3dModal.realModelBadge', group: '3D Lab — Product Modal', label: '3D viewer caption', en: '✦ Real 3D Model • Drag to Rotate', fr: '✦ Modèle 3D Réel • Glissez pour Tourner', ar: '✦ نموذج ثلاثي الأبعاد حقيقي • اسحب للتدوير' },

  // ============================ CUSTOM PRINT ================================
  { key: 'customPrint.badge', group: '3D Lab — Custom Print', label: 'Badge', en: 'Bespoke Fabrication Service', fr: 'Fabrication 3D sur Mesure', ar: 'خدمة الطباعة والتصنيع حسب الطلب' },
  { key: 'customPrint.heading', group: '3D Lab — Custom Print', label: 'Heading', en: 'Have a Custom 3D Model to Print?', fr: 'Vous Avez un Modèle ou Fichier 3D ?', ar: 'لديك تصميم خاص أو ملف 3D؟' },
  { key: 'customPrint.subheading', group: '3D Lab — Custom Print', label: 'Subheading', en: 'Share your CAD file, prototype dimensions, or rough idea. We handle precision slicing, material selection, and rapid turnaround.', fr: 'Partagez votre fichier CAO, dimensions ou croquis. Nous prenons en charge le tranchage de précision et la fabrication.', ar: 'أرسل لنا تفاصيل مشروعك أو رابط ملف التصميم (STL, OBJ, STEP) وسنقوم بتقدير التكلفة وتجهيز طلبك فوراً.' },
  { key: 'customPrint.nameLabel', group: '3D Lab — Custom Print', label: 'Name field label', en: 'Your Name / Company', fr: 'Votre Nom / Entreprise', ar: 'الاسم الكامل / الشركة' },
  { key: 'customPrint.namePlaceholder', group: '3D Lab — Custom Print', label: 'Name field placeholder', en: 'e.g. Karim Ben Ali', fr: 'ex. Karim Ben Ali', ar: 'مثال: كريم بن علي' },
  { key: 'customPrint.materialLabel', group: '3D Lab — Custom Print', label: 'Material field label', en: 'Preferred Material', fr: 'Matériau Souhaité', ar: 'المادة المفضلة (اختياري)' },
  { key: 'customPrint.fileLabel', group: '3D Lab — Custom Print', label: 'File link field label', en: '3D File Link (Optional .STL / .STEP / Drive)', fr: 'Lien du Fichier 3D (Drive / WeTransfer / .STL)', ar: 'رابط الملف ثلاثي الأبعاد (Google Drive / WeTransfer / Dropbox)' },
  { key: 'customPrint.filePlaceholder', group: '3D Lab — Custom Print', label: 'File link placeholder', en: 'https://drive.google.com/... or wetransfer.com/...', fr: 'https://drive.google.com/... ou wetransfer.com/...', ar: 'https://drive.google.com/... أو wetransfer.com/...' },
  { key: 'customPrint.detailsLabel', group: '3D Lab — Custom Print', label: 'Details field label', en: 'Project Notes & Dimensions', fr: 'Détails du Projet (Dimensions, Quantité, Usage)', ar: 'تفاصيل الطلب (الأبعاد، الألوان، الاستخدام)' },
  { key: 'customPrint.detailsPlaceholder', group: '3D Lab — Custom Print', label: 'Details field placeholder', en: 'Describe dimensions (e.g. 15cm height), quantity, mechanical requirements, or color preferences...', fr: 'Décrivez les dimensions (ex. 15cm de hauteur), la quantité, les exigences mécaniques ou préférences de couleur...', ar: 'أخبرنا عن أبعاد المجسم (مثال: ارتفاع 15 سم)، الكمية المطلوبة، وأي متطلبات خاصة...' },
  { key: 'customPrint.buttonText', group: '3D Lab — Custom Print', label: 'Submit button', en: 'Submit Custom Request to WhatsApp', fr: 'Envoyer la Demande sur WhatsApp', ar: 'إرسال طلب الطباعة عبر واتساب' },

  // ======================= WEDDINGS / PRODUCTION PAGES ======================
  { key: 'weddingsPage.badge', group: 'Weddings Page', label: 'Badge', en: 'MED ART CINEMA & STILLS', fr: 'CINÉMATOGRAPHIE MED ART', ar: 'سينما واستوديو ميد آرت' },
  { key: 'weddingsPage.title', group: 'Weddings Page', label: 'Title', en: 'Luxury Wedding Stories', fr: "Récits de Mariages d'Exception", ar: 'قصص الأعراس الفاخرة' },
  { key: 'weddingsPage.subtitle', group: 'Weddings Page', label: 'Subtitle', en: 'Editorial bridal portraits, emotional candid rituals, and cinematic wedding films crafted across breathtaking destinations.', fr: "Portraits de mariée éditoriaux, rituels empreints d'émotion et films de mariage cinématographiques capturés dans les plus beaux lieux.", ar: 'جلسات تصوير عرائس استثنائية، توثيق للمشاعر الصادقة، وأفلام زفاف سينمائية خالدة في أرقى الوجهات.' },
  { key: 'weddingsPage.emptyText', group: 'Weddings Page', label: 'Empty state', en: 'No albums published in this category yet.', fr: 'Aucun album publié dans cette catégorie pour le moment.', ar: 'لا توجد ألبومات منشورة في هذا القسم بعد.' },
  { key: 'productionPage.badge', group: 'Production Page', label: 'Badge', en: 'TERKINA PRODUCTION HOUSE', fr: 'MAISON DE PRODUCTION TERKINA', ar: 'استوديو تيركينا للإنتاج السينمائي' },
  { key: 'productionPage.title', group: 'Production Page', label: 'Title', en: 'Commercial & Video Production', fr: 'Production Commerciale & Vidéo', ar: 'الإنتاج الإعلاني وتغطية الفعاليات' },
  { key: 'productionPage.subtitle', group: 'Production Page', label: 'Subtitle', en: 'High-octane brand campaigns, commercial shoots, corporate conferences, and dynamic event coverage with industry-grade cinema equipment.', fr: "Campagnes de marque percutantes, publicités, conférences d'entreprise et couverture d'événements avec équipement cinéma de pointe.", ar: 'حملات إعلانية عالية التأثير، تغطية شاملة للمؤتمرات والمهرجانات، وإنتاج فيديو دعائي بأحدث كاميرات السينما العالمية.' },
  { key: 'productionPage.emptyText', group: 'Production Page', label: 'Empty state', en: 'No commercial projects published in this category yet.', fr: "Aucun projet commercial publié dans cette catégorie pour le moment.", ar: 'لا توجد مشاريع تجارية منشورة في هذا القسم بعد.' },

  // ============================ ORBITAL GALLERY =============================
  { key: 'orbitalGallery.defaultCategory', group: 'Orbital Gallery Modal', label: 'Default category label', en: 'Portfolio Album', fr: 'Album Portfolio', ar: 'ألبوم المعرض' },
  { key: 'orbitalGallery.framesHintSuffix', group: 'Orbital Gallery Modal', label: 'Hint text after frame count', en: 'Frames • Hover to pause, click to expand', fr: 'Photos • Survolez pour figer, cliquez pour agrandir', ar: 'صورة • مرر للإيقاف، اضغط للتكبير' },
  { key: 'orbitalGallery.closeButton', group: 'Orbital Gallery Modal', label: 'Close button', en: 'Close Album', fr: "Fermer l'Album", ar: 'إغلاق الألبوم' },
  { key: 'orbitalGallery.backButton', group: 'Orbital Gallery Modal', label: 'Back to orbit button', en: 'Back to Orbit', fr: "Retour à l'Orbite", ar: 'العودة للعرض المداري' },
  { key: 'orbitalGallery.defaultFrameTitle', group: 'Orbital Gallery Modal', label: 'Default frame title', en: 'Untitled Shoot Frame', fr: 'Photo Sans Titre', ar: 'صورة بدون عنوان' },

  // =============================== WHATSAPP TEMPLATES ========================
  // {{placeholders}} are substituted with live order/lead data — keep them intact when editing.
  { key: 'whatsapp.contactInquiry.template', group: 'WhatsApp Templates', label: 'Homepage contact form message', en: '*New Inquiry via TERKINA & MED ART* ✨\n\n👤 *Name / Client:* {{name}}\n🎯 *Service:* {{service}}\n💬 *Details:* {{message}}', fr: '*Nouvelle Demande via TERKINA & MED ART* ✨\n\n👤 *Nom / Client:* {{name}}\n🎯 *Service:* {{service}}\n💬 *Détails:* {{message}}', ar: '*طلب جديد عبر TERKINA & MED ART* ✨\n\n👤 *الاسم / العميل:* {{name}}\n🎯 *الخدمة:* {{service}}\n💬 *التفاصيل:* {{message}}' },
  { key: 'whatsapp.customPrint.template', group: 'WhatsApp Templates', label: 'Custom 3D print request message', en: '*Custom 3D Print Request* 🛠️⚙️\n\n👤 *Client Name:* {{name}}\n🧵 *Preferred Material:* {{material}}\n💬 *Description & Dimensions:* {{details}}\n🔗 *3D File / CAD Link:* {{fileUrl}}\n\n_Sent from TERKINA 3D Studio_', fr: "*Demande d'Impression 3D Personnalisée* 🛠️⚙️\n\n👤 *Nom du Client:* {{name}}\n🧵 *Matériau Souhaité:* {{material}}\n💬 *Description et Dimensions:* {{details}}\n🔗 *Lien Fichier 3D / CAO:* {{fileUrl}}\n\n_Envoyé depuis TERKINA 3D Studio_", ar: '*طلب طباعة 3D مخصص* 🛠️⚙️\n\n👤 *اسم العميل:* {{name}}\n🧵 *المادة المفضلة:* {{material}}\n💬 *الوصف والأبعاد:* {{details}}\n🔗 *رابط الملف/CAD:* {{fileUrl}}\n\n_أرسلت من استوديو TERKINA لثلاثي الأبعاد_' },
  { key: 'whatsapp.marketplaceOrder.template', group: 'WhatsApp Templates', label: 'Marketplace grid order message', en: '*{{intent}}: {{title}}* 📦\n\n💰 *Price:* {{price}}\n🧵 *Material:* {{material}}\n📐 *Dimensions:* {{dimensions}}\n⚡ *Availability:* {{availability}}\n\nHello! I would like to inquire about this 3D product.', fr: '*{{intent}}: {{title}}* 📦\n\n💰 *Prix:* {{price}}\n🧵 *Matériau:* {{material}}\n📐 *Dimensions:* {{dimensions}}\n⚡ *Disponibilité:* {{availability}}\n\nBonjour ! Je souhaite me renseigner sur ce produit 3D.', ar: '*{{intent}}: {{title}}* 📦\n\n💰 *السعر:* {{price}}\n🧵 *المادة:* {{material}}\n📐 *الأبعاد:* {{dimensions}}\n⚡ *التوفر:* {{availability}}\n\nمرحباً! أرغب بالاستفسار عن هذا المنتج ثلاثي الأبعاد.' },
  { key: 'whatsapp.marketplaceOrder.intentInStock', group: 'WhatsApp Templates', label: 'Marketplace: intent (in stock)', en: 'Order Inquiry', fr: 'Demande de Commande', ar: 'استفسار طلب' },
  { key: 'whatsapp.marketplaceOrder.intentBackorder', group: 'WhatsApp Templates', label: 'Marketplace: intent (backorder)', en: 'Custom Backorder Inquiry (Out of Stock)', fr: 'Demande de Précommande (Rupture de Stock)', ar: 'استفسار طلب تصنيع مخصص (غير متوفر)' },
  { key: 'whatsapp.marketplaceOrder.availabilityInStock', group: 'WhatsApp Templates', label: 'Marketplace: availability (in stock)', en: 'In Stock', fr: 'En Stock', ar: 'متوفر' },
  { key: 'whatsapp.marketplaceOrder.availabilityBackorder', group: 'WhatsApp Templates', label: 'Marketplace: availability (backorder)', en: 'Made to Order / Backorder', fr: 'Fabrication sur Demande / Précommande', ar: 'تصنيع حسب الطلب' },
  { key: 'whatsapp.productModalOrder.template', group: 'WhatsApp Templates', label: 'Product modal order message', en: '*Order Inquiry for: {{title}}* 📦\n\n🎨 *Selected Color / Finish:* {{color}}\n💰 *Price:* {{price}}\n🧵 *Material:* {{material}}\n📐 *Dimensions:* {{dimensions}}\n\nHello! I would like to order this 3D product in the *{{color}}* finish.', fr: '*Demande de Commande pour: {{title}}* 📦\n\n🎨 *Couleur / Finition Sélectionnée:* {{color}}\n💰 *Prix:* {{price}}\n🧵 *Matériau:* {{material}}\n📐 *Dimensions:* {{dimensions}}\n\nBonjour ! Je souhaite commander ce produit 3D en finition *{{color}}*.', ar: '*طلب لـ: {{title}}* 📦\n\n🎨 *اللون / التشطيب المختار:* {{color}}\n💰 *السعر:* {{price}}\n🧵 *المادة:* {{material}}\n📐 *الأبعاد:* {{dimensions}}\n\nمرحباً! أرغب بطلب هذا المنتج بتشطيب *{{color}}*.' },
];

export const TRANSLATION_GROUPS: string[] = Array.from(
  new Set(TRANSLATION_REGISTRY.map((f) => f.group))
);

export function renderTemplate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (match, key) => vars[key] ?? match);
}
