import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Check, Users, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getSocialProofCount, formatCount } from './QuizSocialProof';
import { useQuizKeyboardShortcuts, KeyboardShortcutHint } from '@/hooks/useQuizKeyboardShortcuts';
const ROOM_OPTIONS = [
    {
        id: 'living_room',
        name: 'Living Room',
        icon: '🛋️',
        description: 'Main gathering space for family and guests',
        commonElements: ['Sofa', 'TV unit', 'Coffee table', 'Lighting'],
        image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&h=400&fit=crop&q=80',
    },
    {
        id: 'bedroom',
        name: 'Bedroom',
        icon: '🛏️',
        description: 'Personal sanctuary for rest and relaxation',
        commonElements: ['Bed', 'Wardrobe', 'Side tables', 'Lighting'],
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&h=400&fit=crop&q=80',
    },
    {
        id: 'kitchen',
        name: 'Kitchen',
        icon: '🍳',
        description: 'Functional cooking and dining space',
        commonElements: ['Cabinets', 'Countertops', 'Appliances', 'Storage'],
        image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600&h=400&fit=crop&q=80',
    },
    {
        id: 'dining_room',
        name: 'Dining Room',
        icon: '🍽️',
        description: 'Space for meals and entertaining',
        commonElements: ['Dining table', 'Chairs', 'Storage', 'Lighting'],
        image: 'https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=600&h=400&fit=crop&q=80',
    },
    {
        id: 'home_office',
        name: 'Home Office',
        icon: '💼',
        description: 'Productive workspace for remote work',
        commonElements: ['Desk', 'Chair', 'Storage', 'Lighting'],
        image: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=600&h=400&fit=crop&q=80',
    },
    {
        id: 'kids_room',
        name: 'Kids Room',
        icon: '🧸',
        description: 'Playful and functional space for children',
        commonElements: ['Bed', 'Study desk', 'Storage', 'Play area'],
        image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&h=400&fit=crop&q=80',
    },
    {
        id: 'bathroom',
        name: 'Bathroom',
        icon: '🚿',
        description: 'Spa-like retreat for daily rituals',
        commonElements: ['Vanity', 'Fixtures', 'Storage', 'Tiles'],
        image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&h=400&fit=crop&q=80',
    },
    {
        id: 'balcony',
        name: 'Balcony/Terrace',
        icon: '🌿',
        description: 'Outdoor oasis for relaxation',
        commonElements: ['Seating', 'Plants', 'Flooring', 'Lighting'],
        image: 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=600&h=400&fit=crop&q=80',
    },
    {
        id: 'full_home',
        name: 'Full Home',
        icon: '🏡',
        description: 'Complete interior design for entire home',
        commonElements: ['Multiple rooms', 'Cohesive theme', 'All spaces'],
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop&q=80',
        popular: true,
    },
];
export function QuizStep7_RoomType({ answers, onNext, onBack }) {
    const [selected, setSelected] = useState(answers.room_type || '');
    const handleContinue = useCallback(() => {
        if (!selected)
            return;
        onNext({ room_type: selected });
    }, [selected, onNext]);
    // Keyboard shortcuts
    useQuizKeyboardShortcuts({
        onNext: handleContinue,
        onBack: onBack || (() => { }),
        onSelectOption: (index) => {
            if (index < ROOM_OPTIONS.length) {
                setSelected(ROOM_OPTIONS[index].id);
            }
        },
        canContinue: !!selected,
    });
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.04 }
        }
    };
    return (<div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h2 initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-2xl md:text-3xl lg:text-4xl font-display font-bold text-foreground tracking-tight">
          Which room are you designing?
        </motion.h2>
        <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-base text-muted-foreground">
          Select the space you want to transform first
        </motion.p>
      </div>

      {/* Room Grid */}
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
        {ROOM_OPTIONS.map((room, index) => {
            const isSelected = selected === room.id;
            return (<motion.button key={room.id} type="button" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.04, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }} onClick={() => setSelected(room.id)} className={`
                relative rounded-2xl overflow-hidden text-left group
                transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground
                ${isSelected
                    ? 'ring-2 ring-foreground scale-[1.02] shadow-xl'
                    : 'hover:scale-[1.02] hover:shadow-xl'}
              `}>
              {/* Popular Badge */}
              {room.popular && (<div className="absolute top-4 right-4 z-10">
                  <div className="px-3 py-1.5 bg-foreground text-background rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
                    <Sparkles className="h-3 w-3"/>
                    Popular
                  </div>
                </div>)}

              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={room.image} alt={room.name} loading="lazy" className={`
                    w-full h-full object-cover transition-transform duration-500
                    ${isSelected ? 'scale-110' : 'group-hover:scale-105'}
                  `}/>

                {/* Gradient Overlay */}
                <div className={`
                    absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent
                    transition-opacity duration-300
                    ${isSelected ? 'opacity-90' : 'opacity-70 group-hover:opacity-90'}
                  `}/>

                {/* Check Icon */}
                {isSelected && (<motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} className="absolute top-4 left-4 w-10 h-10 rounded-full bg-background text-foreground flex items-center justify-center shadow-lg">
                    <Check className="h-6 w-6" strokeWidth={3}/>
                  </motion.div>)}

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl md:text-3xl">{room.icon}</span>
                    <h3 className="text-white font-semibold text-base md:text-lg">
                      {room.name}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-white/90 text-sm mb-3">
                    {room.description}
                  </p>

                  {/* Common Elements */}
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {room.commonElements.slice(0, 3).map((element, elementIdx) => (<span key={elementIdx} className="px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-sm text-white text-xs">
                        {element}
                      </span>))}
                  </div>

                  {/* Social Proof */}
                  <div className="flex items-center gap-1 text-xs text-white/70">
                    <Users className="h-3 w-3"/>
                    <span>{formatCount(getSocialProofCount(room.id))} chose this</span>
                  </div>
                </div>
              </div>
            </motion.button>);
        })}
      </motion.div>

      {/* Additional Info */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="bg-muted/30 rounded-2xl p-5 md:p-6 border border-border/50">
        <div className="flex items-start gap-4">
          <div className="text-2xl md:text-3xl">💡</div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">
              Want to design multiple rooms?
            </h4>
            <p className="text-muted-foreground text-sm mb-3">
              No problem! After completing your first room, you can easily add more rooms at discounted rates.
            </p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-foreground" strokeWidth={3}/>
                <span>Second room: 20% off</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Check className="h-4 w-4 text-foreground" strokeWidth={3}/>
                <span>Full home: Best value</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Continue Button */}
      <div className="flex justify-between items-center pt-4">
        {onBack && (<Button variant="outline" size="lg" onClick={onBack} className="rounded-full">
            Back
          </Button>)}
        <div className="ml-auto flex items-center gap-4">
          <KeyboardShortcutHint shortcut="Enter" label="to continue"/>
          <Button size="lg" className="group rounded-full bg-foreground text-background hover:bg-foreground/90" disabled={!selected} onClick={handleContinue}>
            See My Results
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
          </Button>
        </div>
      </div>
    </div>);
}
