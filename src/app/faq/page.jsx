'use client';

import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { motion } from 'framer-motion';
import { SEOHead } from '@/components/SEOHead';
import { Container } from '@/components/layout/Container';
import { faqSchema, breadcrumbSchema } from '@/lib/seo';
import { FAQ_DATA, FAQ_CATEGORIES, getRelatedFAQs } from '@/lib/faqData';
import { FAQChatbot, FAQItem, FAQSearch, FAQSidebar, FAQCategoryPills } from '@/components/faq';
import { Button } from '@/components/ui/button';
import { 
  HelpCircle, 
  ChevronDown, 
  ChevronUp,
  Mail,
  MessageSquare
} from 'lucide-react';
import { Card } from '@/components/ui/card';

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('General');
  const [openItems, setOpenItems] = useState([]);
  const [allExpanded, setAllExpanded] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const categoryRefs = useRef({});

  // Filter FAQs based on search
  const filteredFAQs = useMemo(() => {
    if (!searchQuery.trim()) return FAQ_DATA;
    
    const query = searchQuery.toLowerCase();
    return FAQ_DATA.filter(item =>
      item.question.toLowerCase().includes(query) ||
      item.answer.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // Group FAQs by category
  const groupedFAQs = useMemo(() => {
    const grouped = {};
    FAQ_CATEGORIES.forEach(cat => {
      grouped[cat.name] = filteredFAQs.filter(faq => faq.category === cat.name);
    });
    return grouped;
  }, [filteredFAQs]);

  // Intersection Observer for active category
  useEffect(() => {
    const observers = [];

    FAQ_CATEGORIES.forEach(category => {
      const ref = categoryRefs.current[category.name];
      if (!ref) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.3) {
              setActiveCategory(category.name);
            }
          });
        },
        { threshold: [0.3], rootMargin: '-100px 0px -50% 0px' }
      );

      observer.observe(ref);
      observers.push(observer);
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  // Handle category click - scroll to section
  const handleCategoryClick = useCallback((category) => {
    setActiveCategory(category);
    const ref = categoryRefs.current[category];
    if (ref) {
      ref.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  // Toggle FAQ item
  const toggleItem = useCallback((id) => {
    setOpenItems(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  }, []);

  // Expand/Collapse all
  const toggleAll = useCallback(() => {
    if (allExpanded) {
      setOpenItems([]);
    } else {
      setOpenItems(filteredFAQs.map(faq => faq.id));
    }
    setAllExpanded(!allExpanded);
  }, [allExpanded, filteredFAQs]);

  // Handle related FAQ click
  const handleRelatedClick = useCallback((id) => {
    setOpenItems(prev => prev.includes(id) ? prev : [...prev, id]);
    const element = document.getElementById(`faq-${id}`);
    element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, []);

  // Generate schema for SEO
  const schemaData = useMemo(() => {
    const faqSchemaData = faqSchema(FAQ_DATA.map(item => ({
      question: item.question,
      answer: item.answer,
    })));
    
    const breadcrumbs = breadcrumbSchema([
      { name: 'Home', url: 'https://houspire.com' },
      { name: 'FAQ', url: 'https://houspire.com/faq' },
    ]);
    
    return [faqSchemaData, breadcrumbs];
  }, []);

  return (
    <>
      <SEOHead
        title="FAQ - Help Center"
        description="Frequently asked questions about Houspire interior design services. Get answers about pricing, process, timeline, vendors, and more."
        keywords={['interior design FAQ', 'Houspire questions', 'design service help', 'pricing questions']}
        url="https://houspire.com/faq"
        schema={schemaData}
      />

      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 pt-20 pb-12">
        <Container>
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full mb-6" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
              <HelpCircle className="h-8 w-8" style={{ color: 'var(--color-primary)' }} />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-heading-main)' }}>
              Help Center
            </h1>

            <p className="text-lg max-w-2xl mx-auto opacity-60" style={{ color: 'var(--color-description)' }}>
              Everything you need to know about Houspire and our services. 
              Can't find what you're looking for? Ask our AI assistant!
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <FAQSearch
              value={searchQuery}
              onChange={setSearchQuery}
              resultsCount={filteredFAQs.length}
              onOpenChat={() => setIsChatOpen(true)}
            />
          </motion.div>

          {/* Mobile Category Pills */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:hidden mb-6"
          >
            <FAQCategoryPills
              activeCategory={activeCategory}
              onCategoryClick={handleCategoryClick}
            />
          </motion.div>

          {/* Main Content */}
          <div className="flex gap-8">
            {/* Sidebar - Desktop only */}
            <motion.aside
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="hidden lg:block w-72 flex-shrink-0"
            >
              <FAQSidebar
                activeCategory={activeCategory}
                onCategoryClick={handleCategoryClick}
              />
            </motion.aside>

            {/* FAQ Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.25 }}
              className="flex-1 min-w-0"
            >
              {/* Expand/Collapse All */}
              <div className="flex justify-end mb-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleAll}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {allExpanded ? (
                    <>
                      <ChevronUp className="h-4 w-4 mr-2" />
                      Collapse All
                    </>
                  ) : (
                    <>
                      <ChevronDown className="h-4 w-4 mr-2" />
                      Expand All
                    </>
                  )}
                </Button>
              </div>

              {/* No results state */}
              {filteredFAQs.length === 0 && (
                <Card className="p-12 text-center">
                  <HelpCircle className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">
                    No FAQs found matching "{searchQuery}"
                  </p>
                  <Button onClick={() => setIsChatOpen(true)}>
                    Ask our AI Assistant
                  </Button>
                </Card>
              )}

              {/* FAQ Sections by Category */}
              {FAQ_CATEGORIES.map((category) => {
                const categoryFAQs = groupedFAQs[category.name];
                if (categoryFAQs.length === 0) return null;

                return (
                  <div
                    key={category.name}
                    ref={(el) => { categoryRefs.current[category.name] = el; }}
                    className="mb-10 scroll-mt-24"
                    id={`category-${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {/* Category Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)' }}>
                        <category.icon className="h-5 w-5" style={{ color: 'var(--color-primary)' }} />
                      </div>
                      <div>
                        <h2 className="text-xl font-semibold" style={{ color: 'var(--color-heading-secondary)' }}>
                          {category.name}
                        </h2>
                        <p className="text-sm opacity-60" style={{ color: 'var(--color-description)' }}>
                          {category.description}
                        </p>
                      </div>
                    </div>

                    {/* FAQ Items */}
                    <div className="space-y-3">
                      {categoryFAQs.map((faq) => (
                        <FAQItem
                          key={faq.id}
                          item={faq}
                          isOpen={openItems.includes(faq.id)}
                          onToggle={() => toggleItem(faq.id)}
                          searchQuery={searchQuery}
                          relatedItems={getRelatedFAQs(faq.id)}
                          onRelatedClick={handleRelatedClick}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}

              {/* Still Have Questions CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-12"
              >
                <Card className="p-8 border-none" style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 5%, var(--color-bg))' }}>
                  <div className="text-center">
                    <HelpCircle className="h-12 w-12 mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
                    <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-heading-main)' }}>
                      Still Have Questions?
                    </h2>
                    <p className="mb-6 max-w-md mx-auto opacity-60" style={{ color: 'var(--color-description)' }}>
                      Can't find the answer you're looking for? Our support team is here to help!
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button
                        onClick={() => window.location.href = 'mailto:hello@houspire.ai'}
                        className="h-12 px-6 btn-primary"
                      >
                        <Mail className="h-5 w-5 mr-2" />
                        Email Support
                      </Button>

                      <Button
                        onClick={() => window.open('https://wa.me/917075827625', '_blank')}
                        variant="outline"
                        className="h-12 px-6"
                      >
                        <MessageSquare className="h-5 w-5 mr-2" />
                        WhatsApp Us
                      </Button>
                    </div>

                    <p className="text-sm text-muted-foreground mt-4">
                      Response time: Within 24 hours (usually much faster!)
                    </p>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </Container>
      </div>

      {/* Floating AI Chatbot */}
      <FAQChatbot />
    </>
  );
}
