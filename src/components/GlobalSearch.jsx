import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { appDataClient } from '@/lib/static-client';
import { Search, FileText, HelpCircle, ArrowRight, X, Clock, TrendingUp, Zap, Image, Star, Folder, Trash2, } from 'lucide-react';
const pages = [
    { title: 'Dashboard', url: '/dashboard', description: 'Your projects' },
    { title: 'Settings', url: '/settings', description: 'Account settings' },
    { title: 'Payment History', url: '/payment-history', description: 'View transactions' },
    { title: 'Notifications', url: '/notifications', description: 'Recent updates' },
    { title: 'Reviews', url: '/reviews', description: 'Customer reviews' },
    { title: 'FAQ', url: '/faq', description: 'Frequently asked questions' },
    { title: 'Gallery', url: '/discover', description: 'Browse designs' },
    { title: 'Style Quiz', url: '/style-quiz', description: 'Find your style' },
    { title: 'Checkout', url: '/checkout', description: 'Pricing and packages' },
    { title: 'Wishlist', url: '/wishlist', description: 'Your saved items' },
    { title: 'Favorites', url: '/favorites', description: 'Favorite designs' },
];
const faqItems = [
    { question: 'What is Houspire?', answer: 'Professional interior design service', url: '/faq' },
    { question: 'How much does it cost?', answer: 'Plans start from ₹499 for a complete design package', url: '/faq' },
    { question: 'How long does it take?', answer: '72-hour delivery for most projects', url: '/faq' },
    { question: 'Can I request revisions?', answer: 'Yes, revisions are included', url: '/faq' },
];
export function GlobalSearch({ isOpen, onClose }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    const inputRef = useRef(null);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [suggestions, setSuggestions] = useState([]);
    const [history, setHistory] = useState([]);
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('all');
    useEffect(() => {
        if (isOpen) {
            setQuery('');
            setResults([]);
            setSelectedIndex(0);
            setTimeout(() => inputRef.current?.focus(), 100);
            fetchHistory();
            fetchTrending();
        }
    }, [isOpen]);
    useEffect(() => {
        if (query.trim()) {
            searchEverything();
            fetchSuggestions();
        }
        else {
            setResults([]);
            setSuggestions([]);
        }
    }, [query]);
    const fetchHistory = async () => {
        if (!user)
            return;
        try {
            const { data, error } = await appDataClient.rpc('get_user_search_history', {
                p_user_id: user.id,
                p_limit: 5,
            });
            if (error)
                throw error;
            setHistory(data?.map((h) => h.search_query) || []);
        }
        catch (error) {
            console.error('Failed to fetch search history:', error);
        }
    };
    const fetchTrending = async () => {
        try {
            const { data, error } = await appDataClient.rpc('get_trending_searches', {
                p_limit: 5,
            });
            if (error)
                throw error;
            setTrending(data || []);
        }
        catch (error) {
            console.error('Failed to fetch trending searches:', error);
        }
    };
    const fetchSuggestions = async () => {
        if (query.length < 2)
            return;
        try {
            const { data, error } = await appDataClient.rpc('get_search_suggestions', {
                p_partial_query: query,
                p_limit: 5,
            });
            if (error)
                throw error;
            setSuggestions(data || []);
        }
        catch (error) {
            console.error('Failed to fetch suggestions:', error);
        }
    };
    const searchEverything = async () => {
        const searchResults = [];
        const lowerQuery = query.toLowerCase();
        // Search pages
        pages
            .filter((page) => page.title.toLowerCase().includes(lowerQuery) ||
            page.description.toLowerCase().includes(lowerQuery))
            .slice(0, 4)
            .forEach((page) => {
            searchResults.push({
                type: 'page',
                title: page.title,
                description: page.description,
                url: page.url,
                icon: FileText,
            });
        });
        // Search FAQ
        faqItems
            .filter((item) => item.question.toLowerCase().includes(lowerQuery) ||
            item.answer.toLowerCase().includes(lowerQuery))
            .slice(0, 3)
            .forEach((item) => {
            searchResults.push({
                type: 'faq',
                title: item.question,
                description: item.answer,
                url: item.url,
                icon: HelpCircle,
            });
        });
        // If logged in and query is long enough, search database
        if (user && query.length >= 3) {
            setLoading(true);
            try {
                const { data, error } = await appDataClient.rpc('global_search', {
                    p_query: query,
                    p_limit: 5,
                    p_user_id: user.id,
                });
                if (!error && data) {
                    data.forEach((result) => {
                        searchResults.push({
                            type: 'db_result',
                            title: result.title,
                            description: result.description || '',
                            url: getEntityUrl(result.entity_type, result.entity_id, result.metadata),
                            icon: getEntityIcon(result.entity_type),
                            metadata: result.metadata,
                        });
                    });
                }
            }
            catch (error) {
                console.error('Database search failed:', error);
            }
            finally {
                setLoading(false);
            }
        }
        setResults(searchResults);
        setSelectedIndex(0);
    };
    const getEntityUrl = (entityType, entityId, metadata) => {
        switch (entityType) {
            case 'project':
                return `/project/${entityId}`;
            case 'render':
                return `/project/${metadata?.project_id || entityId}`;
            case 'review':
                return '/reviews';
            default:
                return '/dashboard';
        }
    };
    const getEntityIcon = (entityType) => {
        switch (entityType) {
            case 'project':
                return Folder;
            case 'render':
                return Image;
            case 'review':
                return Star;
            default:
                return FileText;
        }
    };
    const handleSelect = async (result) => {
        navigate(result.url);
        onClose();
    };
    const handleSelectSuggestion = async (suggestion) => {
        setQuery(suggestion);
        try {
            await appDataClient.rpc('track_suggestion_click', {
                p_suggestion: suggestion,
            });
        }
        catch (error) {
            console.error('Failed to track suggestion click:', error);
        }
    };
    const handleClearHistory = async () => {
        if (!user)
            return;
        try {
            await appDataClient.rpc('clear_search_history', {
                p_user_id: user.id,
            });
            setHistory([]);
        }
        catch (error) {
            console.error('Failed to clear history:', error);
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.min(prev + 1, results.length - 1));
        }
        else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setSelectedIndex((prev) => Math.max(prev - 1, 0));
        }
        else if (e.key === 'Enter' && results[selectedIndex]) {
            handleSelect(results[selectedIndex]);
        }
        else if (e.key === 'Escape') {
            onClose();
        }
    };
    const getTrendIcon = (direction) => {
        if (direction === 'up' || direction === 'new') {
            return <TrendingUp className="h-3 w-3 text-green-600"/>;
        }
        return null;
    };
    return (<AnimatePresence>
      {isOpen && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-[15vh]">
          <motion.div initial={{ opacity: 0, scale: 0.95, y: -20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: -20 }} transition={{ duration: 0.2 }} onClick={(e) => e.stopPropagation()} className="w-[90vw] max-w-2xl">
            <Card className="overflow-hidden shadow-2xl border-border">
              {/* Search Input */}
              <div className="border-b border-border">
                <div className="flex items-center px-4">
                  <Search className="h-5 w-5 text-muted-foreground"/>
                  <Input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} onKeyDown={handleKeyDown} placeholder="Search pages, projects, FAQ..." className="border-0 focus-visible:ring-0 h-14 text-base pl-3"/>
                  {loading && (<div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full mr-2"/>)}
                  <button onClick={onClose} className="p-2 hover:bg-muted rounded-md transition-colors">
                    <X className="h-4 w-4 text-muted-foreground"/>
                  </button>
                </div>
              </div>

              {/* Tabs when no query */}
              {!query && (history.length > 0 || trending.length > 0) && (<div className="flex gap-1 p-2 border-b border-border bg-muted/30">
                  <button onClick={() => setActiveTab('all')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activeTab === 'all'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'}`}>
                    Suggestions
                  </button>
                  {history.length > 0 && (<button onClick={() => setActiveTab('history')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'history'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'}`}>
                      <Clock className="h-3 w-3"/>
                      Recent
                    </button>)}
                  {trending.length > 0 && (<button onClick={() => setActiveTab('trending')} className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-1.5 ${activeTab === 'trending'
                        ? 'bg-background text-foreground shadow-sm'
                        : 'text-muted-foreground hover:text-foreground'}`}>
                      <TrendingUp className="h-3 w-3"/>
                      Trending
                    </button>)}
                </div>)}

              {/* Results / Suggestions */}
              <div className="max-h-96 overflow-y-auto">
                {/* When query is empty - show tabs content */}
                {!query && (<div className="p-3">
                    {activeTab === 'history' && history.length > 0 && (<div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                            Recent Searches
                          </span>
                          <button onClick={handleClearHistory} className="text-xs text-muted-foreground hover:text-destructive flex items-center gap-1">
                            <Trash2 className="h-3 w-3"/>
                            Clear
                          </button>
                        </div>
                        <div className="space-y-1">
                          {history.map((item, index) => (<button key={index} onClick={() => setQuery(item)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground"/>
                              {item}
                            </button>))}
                        </div>
                      </div>)}

                    {activeTab === 'trending' && trending.length > 0 && (<div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Trending Searches
                        </span>
                        <div className="space-y-1 mt-2">
                          {trending.map((item, index) => (<button key={index} onClick={() => setQuery(item.search_query)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground flex items-center justify-between">
                              <span className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-muted-foreground"/>
                                {item.search_query}
                              </span>
                              <span className="flex items-center gap-1.5">
                                {getTrendIcon(item.trend_direction)}
                                <Badge variant="secondary" className="text-xs">
                                  {item.recent_count}
                                </Badge>
                              </span>
                            </button>))}
                        </div>
                      </div>)}

                    {activeTab === 'all' && (<div>
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                          <Zap className="h-3 w-3"/>
                          Quick Access
                        </span>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          {pages.slice(0, 6).map((page, index) => (<button key={index} onClick={() => {
                            navigate(page.url);
                            onClose();
                        }} className="text-left px-3 py-2 rounded-lg hover:bg-muted text-sm">
                              <div className="font-medium text-foreground">{page.title}</div>
                              <div className="text-xs text-muted-foreground">{page.description}</div>
                            </button>))}
                        </div>
                      </div>)}
                  </div>)}

                {/* Suggestions while typing */}
                {query && suggestions.length > 0 && results.length === 0 && (<div className="p-3">
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                      Suggestions
                    </span>
                    <div className="space-y-1 mt-2">
                      {suggestions.map((suggestion, index) => (<button key={index} onClick={() => handleSelectSuggestion(suggestion.suggestion)} className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted text-sm text-foreground flex items-center justify-between">
                          <span>{suggestion.suggestion}</span>
                          {suggestion.category && (<Badge variant="outline" className="text-xs">
                              {suggestion.category}
                            </Badge>)}
                        </button>))}
                    </div>
                  </div>)}

                {/* Search Results */}
                {results.length > 0 && (<div className="p-2">
                    {results.map((result, index) => {
                    const Icon = result.icon;
                    return (<button key={`${result.type}-${result.url}-${index}`} onClick={() => handleSelect(result)} className={`w-full flex items-center gap-4 p-3 rounded-lg transition-colors text-left ${index === selectedIndex
                            ? 'bg-accent'
                            : 'hover:bg-muted'}`}>
                          <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                            <Icon className="h-5 w-5 text-muted-foreground"/>
                          </div>

                          <div className="flex-1 min-w-0">
                            <p className="font-medium text-foreground truncate">
                              {result.title}
                            </p>
                            <p className="text-sm text-muted-foreground truncate">
                              {result.description}
                            </p>
                          </div>

                          <div className="flex items-center gap-2 flex-shrink-0">
                            <Badge variant="secondary" className="text-xs">
                              {result.type === 'db_result' ? 'Project' : result.type}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground"/>
                          </div>
                        </button>);
                })}
                  </div>)}

                {/* No Results */}
                {query && results.length === 0 && !loading && query.length >= 2 && (<div className="p-8 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-3 opacity-50"/>
                    <p>No results found for "{query}"</p>
                    <p className="text-sm mt-1">Try different keywords</p>
                  </div>)}

                {/* Initial State */}
                {!query && history.length === 0 && trending.length === 0 && (<div className="p-8 text-center text-muted-foreground">
                    <Search className="h-8 w-8 mx-auto mb-3 opacity-50"/>
                    <p>Start typing to search...</p>
                  </div>)}
              </div>

              {/* Footer */}
              <div className="border-t border-border p-3 bg-muted/50">
                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px]">↑↓</kbd>{' '}
                    Navigate
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px]">Enter</kbd>{' '}
                    Select
                  </span>
                  <span>
                    <kbd className="px-1.5 py-0.5 bg-background rounded border text-[10px]">Esc</kbd>{' '}
                    Close
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>)}
    </AnimatePresence>);
}

