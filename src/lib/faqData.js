import {
  Info,
  CreditCard,
  Clock,
  Palette,
  Store,
  Settings,
  UserCircle,
} from 'lucide-react'

export const FAQ_CATEGORIES = [
  { name: 'General', icon: Info, description: 'About Houspire and our services' },
  { name: 'Pricing & Payment', icon: CreditCard, description: 'Costs, payment methods, and refunds' },
  { name: 'Process & Timeline', icon: Clock, description: 'How it works and delivery times' },
  { name: 'Design & Quality', icon: Palette, description: 'Design process and deliverables' },
  { name: 'Vendors & Execution', icon: Store, description: 'Verified contractors and implementation' },
  { name: 'Technical', icon: Settings, description: 'Room types, files, and specifications' },
  { name: 'Account & Support', icon: UserCircle, description: 'Account management and help' },
]

export const FAQ_DATA = [
  { id: 'gen-1', category: 'General', categoryIcon: Info, question: 'What is Houspire?', answer: "Houspire is a design intelligence service for Indian homeowners. We deliver complete interior design planning — photorealistic room designs, itemized budgets, shopping lists, and verified contractor connections — all within 72 hours at a fraction of what traditional designers charge.", isPopular: true },
  { id: 'gen-2', category: 'General', categoryIcon: Info, question: 'Which cities do you serve?', answer: "We currently serve 6 major Indian cities: Hyderabad, Bangalore, Mumbai, Delhi, Pune, and Chennai. We're constantly expanding to new cities based on demand." },
  { id: 'gen-3', category: 'General', categoryIcon: Info, question: 'How is Houspire different from traditional interior designers?', answer: "Traditional designers charge ₹50,000–₹2,00,000+ for the design phase alone, take 3–6 weeks for initial concepts, and often add material markups and commissions. Houspire delivers the same design clarity — room visualizations, budgets, contractor connections — in 72 hours at a fraction of the cost. You're free to work with any contractor or vendor you choose.", isPopular: true, relatedIds: ['price-2', 'vendor-2'] },
  { id: 'price-1', category: 'Pricing & Payment', categoryIcon: CreditCard, question: "What do I get with each package?", answer: 'Our packages range from a Free Discovery (style quiz + sample mood board) to the Premium tier (₹29,999) with unlimited revisions and on-site coordination. Every paid plan includes photorealistic room designs, a detailed budget breakdown, shopping guide, and a money-back guarantee. Check our pricing page for full details.', isPopular: true, relatedIds: ['process-1', 'design-2'] },
  { id: 'price-2', category: 'Pricing & Payment', categoryIcon: CreditCard, question: 'Are there any hidden charges?', answer: "No hidden charges, no commissions, no markups. Your package price is the complete price. What you see is what you pay.", isPopular: true },
  { id: 'price-3', category: 'Pricing & Payment', categoryIcon: CreditCard, question: 'What payment methods do you accept?', answer: 'We accept all major payment methods through Razorpay: Credit/Debit cards (Visa, Mastercard, Amex), UPI (Google Pay, PhonePe, Paytm), Net Banking (all major banks), and Digital Wallets.' },
  { id: 'price-4', category: 'Pricing & Payment', categoryIcon: CreditCard, question: 'Can I get a refund?', answer: 'Yes! Full refund within 1 hour of payment. 50% refund before intake form submission. No refund after work has commenced. If we fail to deliver within the promised timeline, you get a 100% refund automatically.', relatedIds: ['process-4'] },
  { id: 'process-1', category: 'Process & Timeline', categoryIcon: Clock, question: 'How does the process work?', answer: 'Simple 4-step process: 1) Take our free style quiz to discover your design preferences, 2) Choose a package and pay, 3) Upload room photos and share your preferences, 4) Receive your complete Home Design Report in 72 hours.', isPopular: true, relatedIds: ['price-1', 'process-2'] },
  { id: 'process-2', category: 'Process & Timeline', categoryIcon: Clock, question: 'How long does it really take?', answer: 'We guarantee delivery within 72 hours from the moment you complete the intake form and payment (48 hours for priority plans). Most projects are delivered even faster. The timer starts as soon as you submit your room details.', isPopular: true },
  { id: 'process-3', category: 'Process & Timeline', categoryIcon: Clock, question: 'What if I need changes after delivery?', answer: "Every paid plan includes at least one revision round. Submit your feedback and we'll make adjustments. The number of included revision rounds depends on your chosen package.", relatedIds: ['price-2'] },
  { id: 'process-4', category: 'Process & Timeline', categoryIcon: Clock, question: 'Can I pause or cancel my project?', answer: "You can cancel within 1 hour for full refund, or within 6 hours for 50% refund. Once work has started, cancellations are not eligible for refunds." },
  { id: 'design-1', category: 'Design & Quality', categoryIcon: Palette, question: 'Who will design my space?', answer: "Your design is created by the Houspire design team — experienced design professionals using advanced design technology. The technology handles visualization and rendering, while our team handles creative direction, quality review, and personalization." },
  { id: 'design-2', category: 'Design & Quality', categoryIcon: Palette, question: 'How detailed are the room designs?', answer: "Our photorealistic room designs show your space from multiple angles with accurate furniture placement, colors, materials, and lighting. High-resolution files suitable for printing or sharing with contractors." },
  { id: 'design-3', category: 'Design & Quality', categoryIcon: Palette, question: 'Is the budget breakdown accurate?', answer: 'Yes! Our budgets include itemized costs with quantities and unit prices across three tiers (Good / Better / Best). We provide current market rates. However, prices may vary slightly based on vendor negotiations and market fluctuations.' },
  { id: 'design-4', category: 'Design & Quality', categoryIcon: Palette, question: 'Can I request specific brands or materials?', answer: "Absolutely! In the intake form, specify any brand preferences, materials you want, or items you already own. We'll incorporate your preferences into the design." },
  { id: 'vendor-1', category: 'Vendors & Execution', categoryIcon: Store, question: 'Do I have to use your recommended contractors?', answer: "Not at all! Our verified contractor recommendations are suggestions to save you research time. You're free to choose any contractor or vendor you like — there's no obligation or lock-in." },
  { id: 'vendor-2', category: 'Vendors & Execution', categoryIcon: Store, question: 'Do you get commissions from vendors?', answer: 'No! We receive ZERO commissions from any vendors or contractors. This ensures our recommendations are completely unbiased and based solely on quality, pricing, and reliability.', isPopular: true },
  { id: 'vendor-3', category: 'Vendors & Execution', categoryIcon: Store, question: 'Do you handle execution/construction?', answer: 'We provide design planning and verified contractor connections. You can share our detailed Home Design Report with any contractor for accurate quotes and execution. The Premium package includes on-site contractor coordination.' },
  { id: 'vendor-4', category: 'Vendors & Execution', categoryIcon: Store, question: 'What if vendor prices differ from the budget?', answer: 'Our budgets are based on current market rates, but vendor prices can vary. Use our budget as a baseline for negotiation. If quotes are significantly higher, let us know and we can suggest alternative materials at different price points.' },
  { id: 'tech-1', category: 'Technical', categoryIcon: Settings, question: 'What room types do you design?', answer: "We design all residential spaces: Living rooms, Bedrooms, Kitchens, Bathrooms, Dining areas, Home offices, Balconies/terraces, Kids' rooms, and entire homes. Commercial spaces are not currently supported." },
  { id: 'tech-2', category: 'Technical', categoryIcon: Settings, question: 'What information do you need from me?', answer: 'We need: Clear photos of your space (from multiple angles), Accurate room dimensions (length, width, height), Your style preferences and must-haves, Budget range, Any existing furniture you want to keep, and Timeline/move-in date.' },
  { id: 'tech-3', category: 'Technical', categoryIcon: Settings, question: 'How do I download my design package?', answer: 'All files are available in your dashboard. You can download individual files (room designs, budget PDF, shopping list) or download everything as a single ZIP file. Files remain accessible for 6 months.' },
  { id: 'tech-4', category: 'Technical', categoryIcon: Settings, question: 'What file formats will I receive?', answer: 'Room designs: High-resolution JPG/PNG images. Budget: PDF and Excel/CSV. Shopping list: PDF and Excel/CSV. Materials: PDF with specifications. All formats are easy to share with contractors.' },
  { id: 'support-1', category: 'Account & Support', categoryIcon: UserCircle, question: 'How do I contact customer support?', answer: 'Multiple ways! Email: hello@houspire.ai (24-hour response), WhatsApp: +91 70758 27625, Phone: +91 70758 27625 (Mon-Sat, 9 AM – 7 PM IST), or chat via our dashboard.' },
  { id: 'support-2', category: 'Account & Support', categoryIcon: UserCircle, question: 'Can I have multiple projects?', answer: 'Yes! You can create as many projects as you need. Choose from single-room or full-home packages based on your requirements.' },
  { id: 'support-3', category: 'Account & Support', categoryIcon: UserCircle, question: 'Is my data safe and private?', answer: 'Absolutely. We use bank-grade encryption for all data. Your photos and information are only shared with your assigned design team. We never sell your data to third parties. Read our Privacy Policy for details.' },
  { id: 'support-4', category: 'Account & Support', categoryIcon: UserCircle, question: 'Can I share my designs with others?', answer: 'Yes! You can download and share your room designs, budget, and plans with family, contractors, or vendors. The designs are for your personal use on the specific project.' },
]

export const getFAQsByCategory = (category) => FAQ_DATA.filter((item) => item.category === category)
export const getPopularFAQs = () => FAQ_DATA.filter((item) => item.isPopular)
export const getRelatedFAQs = (faqId) => {
  const faq = FAQ_DATA.find((item) => item.id === faqId)
  if (!faq?.relatedIds) return []
  return FAQ_DATA.filter((item) => faq.relatedIds?.includes(item.id))
}

export const SUGGESTED_QUESTIONS = [
  "What packages do you offer?",
  "How long does delivery take?",
  "What's included in the Home Design Report?",
  "Do you take commissions from vendors?",
  "Can I get a refund?",
]
