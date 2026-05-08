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
    return (<div className="max-w-7xl mx-auto px-4 pt-8 md:pt-16 pb-12">
      <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-16">
        {/* Hero Section - Two Columns */}
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column: Content */}
          <div className="text-left space-y-8">
            <motion.div variants={itemVariants}>
              <Badge className="bg-primary/10 text-primary border-primary/20 px-5 py-2.5 text-sm font-medium backdrop-blur-sm">
                <Clock className="h-4 w-4 mr-2"/>
                Takes only 2 minutes
              </Badge>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-6">
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-display font-bold text-foreground leading-[1.05] tracking-tight">
                Discover Your
                <span className="block mt-2 bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
                  Perfect Design Style
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-xl leading-relaxed">
                Take our visual style quiz and unlock personalized design recommendations 
                tailored to your taste, lifestyle, and budget.
              </p>
            </motion.div>

            {/* Stats Row - Left Aligned */}
            <motion.div variants={itemVariants} className="flex gap-10 md:gap-16 py-4">
              {stats.map((stat, index) => (<div key={index} className="text-left">
                  <p className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">{stat.value}</p>
                  <p className="text-xs md:text-sm text-muted-foreground mt-1 uppercase tracking-wider font-medium">{stat.label}</p>
                </div>))}
            </motion.div>

            {/* CTA - Left Aligned */}
            <motion.div variants={itemVariants} className="space-y-4 pt-4">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Button size="lg" className="w-full sm:w-auto h-16 px-10 text-lg rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-2xl shadow-primary/20 group transition-all duration-300" onClick={() => onNext({})}>
                  <Zap className="h-5 w-5 mr-2"/>
                  Find My Style
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform"/>
                </Button>
                <div className="flex -space-x-3 items-center">
                  {[1, 2, 3, 4].map((i) => (<div key={i} className="w-10 h-10 rounded-full border-2 border-background overflow-hidden bg-muted">
                      <img src={`https://i.pravatar.cc/100?img=${i + 10}`} alt="User" className="w-full h-full object-cover"/>
                    </div>))}
                  <div className="pl-5 text-sm text-muted-foreground font-medium">
                    +2.4k others matched today
                  </div>
                </div>
              </div>
              <p className="text-sm text-muted-foreground pl-2">
                Free • No signup required • Instant results
              </p>
            </motion.div>
          </div>

          {/* Right Column: Illustration */}
          <motion.div variants={itemVariants} className="relative lg:block hidden">
            <div className="relative z-10 w-full aspect-square rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-white/20">
              <img 
                src="/quiz_intro_illustration_1778224076077.png" 
                alt="Style Quiz Illustration" 
                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-accent/10 pointer-events-none" />
            </div>
            
            {/* Decorative Floating Elements */}
            <motion.div animate={{ y: [0, -20, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="absolute -top-6 -right-6 w-24 h-24 bg-accent/20 rounded-2xl blur-2xl -z-10" />
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }} className="absolute -bottom-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl -z-10" />
          </motion.div>
        </div>

        {/* Separator */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-border to-transparent opacity-50" />

        <div className="text-center space-y-12">
          {/* Benefits Grid */}
          <div className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
              Why our style quiz is different
            </h2>
            <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6 md:gap-8">
              {benefits.map((benefit, index) => (<motion.div key={benefit.title} whileHover={{ y: -8, transition: { duration: 0.3 } }}>
                  <Card className="p-8 text-center h-full border-border/50 bg-card/50 backdrop-blur-sm hover:border-primary/20 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-primary/5 flex items-center justify-center group-hover:bg-primary/10 group-hover:scale-110 transition-all duration-500">
                      <benefit.icon className="h-8 w-8 text-primary/70"/>
                    </div>
                    <h3 className="text-xl font-bold text-foreground mb-3">
                      {benefit.title}
                    </h3>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </Card>
                </motion.div>))}
            </motion.div>
          </div>

          {/* What You'll Get */}
          <div className="grid lg:grid-cols-5 gap-8 items-center pt-8">
            <div className="lg:col-span-2 text-left space-y-4">
              <h3 className="text-3xl font-display font-bold text-foreground leading-tight">
                Wait, there's more.
                <br />
                <span className="text-muted-foreground">What you'll discover:</span>
              </h3>
              <p className="text-muted-foreground text-lg">
                Your results aren't just a label. We provide a comprehensive design profile.
              </p>
            </div>
            <div className="lg:col-span-3">
              <motion.div variants={itemVariants}>
                <Card className="p-8 bg-muted/20 border-border/50 backdrop-blur-sm">
                  <div className="grid sm:grid-cols-2 gap-x-12 gap-y-6 text-left">
                    {[
                      'Your primary design style match',
                      'Alternative styles that suit you',
                      'Personalized color palette recommendations',
                      'Budget-aligned design approach',
                      'Team of style specialists ready to help',
                      'Saved profile for future projects'
                    ].map((item, index) => (<motion.div key={index} className="flex items-center gap-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 + index * 0.05 }}>
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <CheckCircle className="h-4 w-4 text-primary"/>
                        </div>
                        <span className="text-base text-foreground/80 font-medium">{item}</span>
                      </motion.div>))}
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-10 md:gap-20 py-8 border-t border-border/50">
          <div className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <Shield className="h-5 w-5 text-muted-foreground group-hover:text-primary"/>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">100% Private</span>
          </div>
          <div className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <Heart className="h-5 w-5 text-muted-foreground group-hover:text-primary"/>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">No Spam Ever</span>
          </div>
          <div className="flex items-center gap-2.5 group">
            <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
              <Zap className="h-5 w-5 text-muted-foreground group-hover:text-primary"/>
            </div>
            <span className="text-sm font-semibold text-muted-foreground">Instant Results</span>
          </div>
        </motion.div>
      </motion.div>
    </div>);
}
