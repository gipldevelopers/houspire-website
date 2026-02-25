import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Clock, Palette, Sparkles, ArrowRight, CheckCircle, Users, Zap, Shield, Heart } from 'lucide-react';
export function QuizIntro({ onNext, selectedFeature }) {
    const benefits = [
        {
            icon: Palette,
            title: 'Visual, Not Technical',
            description: 'Choose from beautiful images - no design jargon needed'
        },
        {
            icon: Sparkles,
            title: 'AI-Powered Matching',
            description: 'Our algorithm finds your perfect design style in seconds'
        },
        {
            icon: Users,
            title: 'Expert Team Match',
            description: 'Get connected with specialists in your matched style'
        }
    ];
    const stats = [
        { value: '7', label: 'Quiz Steps' },
        { value: '15', label: 'Design Styles' },
        { value: '2 min', label: 'To Complete' },
    ];
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1
            }
        }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }
        }
    };
    return (<div className="max-w-4xl mx-auto px-4 pt-12 md:pt-16">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="text-center space-y-10">
        {/* Badge */}
        <motion.div variants={itemVariants}>
          <Badge className="bg-foreground/5 text-foreground border-foreground/10 px-5 py-2.5 text-sm font-medium backdrop-blur-sm">
            <Clock className="h-4 w-4 mr-2"/>
            Takes only 2 minutes
          </Badge>
        </motion.div>

        {/* Headline */}
        <motion.div variants={itemVariants} className="space-y-6">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground leading-[1.1] tracking-tight">
            Discover Your
            <span className="block mt-2 bg-gradient-to-r from-foreground via-foreground/80 to-foreground/60 bg-clip-text text-transparent">
              Perfect Design Style
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Take our visual style quiz and unlock personalized design recommendations 
            tailored to your taste, lifestyle, and budget.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="flex justify-center gap-8 md:gap-16 py-6">
          {stats.map((stat, index) => (<div key={index} className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{stat.value}</p>
              <p className="text-xs md:text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>))}
        </motion.div>

        {/* Benefits Grid */}
        <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-4 md:gap-6">
          {benefits.map((benefit, index) => (<motion.div key={benefit.title} whileHover={{ y: -4, transition: { duration: 0.2 } }}>
              <Card className="p-6 text-center h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-foreground/20 hover:shadow-xl transition-all duration-300 group">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-foreground/5 flex items-center justify-center group-hover:bg-foreground/10 transition-colors">
                  <benefit.icon className="h-7 w-7 text-foreground/70"/>
                </div>
                <h3 className="font-semibold text-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {benefit.description}
                </p>
              </Card>
            </motion.div>))}
        </motion.div>

        {/* What You'll Get */}
        <motion.div variants={itemVariants}>
          <Card className="p-6 md:p-8 bg-muted/30 border-border/50 backdrop-blur-sm">
            <h3 className="text-lg md:text-xl font-heading font-bold text-foreground mb-6">
              What You'll Discover
            </h3>
            <div className="grid md:grid-cols-2 gap-3 md:gap-4 text-left max-w-2xl mx-auto">
              {[
            'Your primary design style match',
            'Alternative styles that suit you',
            'Personalized color palette recommendations',
            'Budget-aligned design approach',
            'Team of style specialists ready to help',
            'Saved profile for future projects'
        ].map((item, index) => (<motion.div key={index} className="flex items-center gap-3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.05 }}>
                  <div className="w-5 h-5 rounded-full bg-foreground/10 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-3 w-3 text-foreground/70"/>
                  </div>
                  <span className="text-sm text-foreground/80">{item}</span>
                </motion.div>))}
            </div>
          </Card>
        </motion.div>

        {selectedFeature?.title && (<motion.div variants={itemVariants}>
            <Card className="p-5 bg-foreground/5 border-foreground/10 max-w-2xl mx-auto">
              <p className="text-xs uppercase tracking-[0.08em] text-muted-foreground mb-1">Selected from homepage</p>
              <p className="text-base font-semibold text-foreground">{selectedFeature.title}</p>
              {selectedFeature.subtitle && (<p className="text-sm text-muted-foreground mt-1">{selectedFeature.subtitle}</p>)}
            </Card>
          </motion.div>)}

        {/* Trust Badges */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Shield className="h-4 w-4"/>
            <span>100% Private</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="h-4 w-4"/>
            <span>No Spam Ever</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="h-4 w-4"/>
            <span>Instant Results</span>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div variants={itemVariants} className="space-y-4 pt-4 pb-8">
          <Button size="lg" className="h-14 px-10 text-lg rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-xl shadow-foreground/10 group transition-all duration-300 hover:shadow-2xl hover:shadow-foreground/20" onClick={() => onNext({})}>
            <Zap className="h-5 w-5 mr-2"/>
            Find My Style
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
          </Button>
          <p className="text-sm text-muted-foreground">
            Free • No signup required • Instant results
          </p>
        </motion.div>
      </motion.div>
    </div>);
}
