import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createPortal } from 'react-dom'
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  Wand2,
  AlertCircle,
  MessageSquare,
  Copy,
  Check,
  Trash2,
  Sparkles
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { SUGGESTED_QUESTIONS, FAQ_DATA, FAQ_CATEGORIES } from '@/lib/faqData'
import ReactMarkdown from 'react-markdown'
const WHATSAPP_NUMBER = '919876543210'
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}?text=Hi%20Houspire!%20I%20have%20a%20question.`

const FOLLOWUP_SUGGESTIONS = [
  "Tell me more about pricing",
  "How do revisions work?",
  "What's the refund policy?",
  "Which cities do you serve?",
]

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-muted-foreground/50"
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  )
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button
      onClick={handleCopy}
      className="opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded hover:bg-accent"
      aria-label="Copy message"
    >
      {copied ? <Check className="h-3 w-3 text-green-500" /> : <Copy className="h-3 w-3 text-muted-foreground" />}
    </button>
  )
}

function HiddenTrigger({ onOpen }) {
  useEffect(() => {
    const handler = () => onOpen()
    window.addEventListener('open-ai-chat', handler)
    return () => window.removeEventListener('open-ai-chat', handler)
  }, [onOpen])
  return null
}

export function FAQChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const [isMounted, setIsMounted] = useState(false)
  const [showFollowups, setShowFollowups] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => { scrollToBottom() }, [messages, scrollToBottom])
  useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 100)
  }, [isOpen])
  useEffect(() => { setIsMounted(true) }, [])
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) setIsOpen(false)
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen])

  const getStaticFaqReply = useCallback((question) => {
    const normalizedQuestion = question.toLowerCase()
    const matchedFaq = FAQ_DATA.find((item) => {
      const haystack = `${item.category} ${item.question} ${item.answer}`.toLowerCase()
      return normalizedQuestion.split(/\s+/).some((word) => word.length > 3 && haystack.includes(word))
    })

    if (matchedFaq) {
      return `**${matchedFaq.question}**\n\n${matchedFaq.answer}`
    }

    return `I can help with Houspire's packages, style quiz, delivery timeline, revisions, pricing, and support.\n\nTry asking about:\n- pricing\n- refunds\n- design styles\n- delivery timeline\n- revisions`
  }, [])

  const streamChat = async (userMessage) => {
    setIsLoading(true)
    setError(null)
    setShowFollowups(false)
    const newUserMessage = { id: Date.now().toString(), role: 'user', content: userMessage, timestamp: new Date() }
    setMessages((prev) => [...prev, newUserMessage])
    const assistantId = (Date.now() + 1).toString()
    let assistantContent = ''
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '', timestamp: new Date() }])

    try {
      assistantContent = getStaticFaqReply(userMessage)
      await new Promise((resolve) => setTimeout(resolve, 300))
      setMessages((prev) => prev.map((m) => (m.id === assistantId ? { ...m, content: assistantContent } : m)))
      setShowFollowups(true)
    } catch (err) {
      console.error('Chat error:', err)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    const message = input.trim()
    setInput('')
    streamChat(message)
  }

  const handleSuggestionClick = (question) => streamChat(question)
  const handleClearChat = () => {
    setMessages([])
    setError(null)
    setShowFollowups(false)
  }
  const handleCategoryQuickAsk = (categoryName) => {
    const categoryFaq = FAQ_DATA.find((f) => f.category === categoryName && f.isPopular) || FAQ_DATA.find((f) => f.category === categoryName)
    if (categoryFaq) streamChat(categoryFaq.question)
  }

  return (
    <>
      {!isOpen && <HiddenTrigger onOpen={() => setIsOpen(true)} />}
      {isMounted &&
        createPortal(
          <AnimatePresence>
            {isOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsOpen(false)}
                  className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[9998] md:hidden"
                />
                <motion.div
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.95 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                  role="dialog"
                  aria-modal="true"
                  className={cn(
                    'fixed z-[9999] bg-card border border-border rounded-2xl shadow-2xl flex flex-col overflow-hidden inset-4 md:inset-auto md:bottom-8 md:right-8 md:w-[420px] md:h-[620px] md:max-h-[80vh]'
                  )}
                >
                  <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-5 w-5 text-primary" />
                        </div>
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-card rounded-full" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">Houspire AI</h3>
                        <p className="text-xs text-green-600 font-medium">Online • Replies instantly</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {messages.length > 0 && (
                        <Button variant="ghost" size="icon" onClick={handleClearChat} className="h-9 w-9 text-muted-foreground hover:text-destructive" aria-label="Clear chat">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-9 w-9" aria-label="Close chat">
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 ? (
                      <div className="text-center py-6">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                          <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h4 className="font-semibold text-foreground mb-2">Hi! I'm your AI assistant 👋</h4>
                        <p className="text-sm text-muted-foreground mb-5 max-w-xs mx-auto">I know everything about Houspire's services. Ask me anything!</p>
                        <div className="mb-5">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide mb-2">Browse by topic</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {FAQ_CATEGORIES.slice(0, 4).map((cat) => {
                              const Icon = cat.icon
                              return (
                                <button
                                  key={cat.name}
                                  onClick={() => handleCategoryQuickAsk(cat.name)}
                                  className={cn('flex items-center gap-1.5 px-3 py-2 text-xs rounded-full bg-primary/5 border border-primary/20 hover:bg-primary/10 hover:border-primary/40 transition-colors text-foreground')}
                                >
                                  <Icon className="h-3.5 w-3.5 text-primary" />
                                  {cat.name}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Popular questions</p>
                          <div className="flex flex-wrap gap-2 justify-center">
                            {SUGGESTED_QUESTIONS.slice(0, 4).map((question) => (
                              <button
                                key={question}
                                onClick={() => handleSuggestionClick(question)}
                                className={cn('px-3 py-2 text-sm rounded-lg border border-border hover:bg-accent hover:border-primary/30 transition-colors text-muted-foreground hover:text-foreground text-left')}
                              >
                                {question}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={cn('flex gap-3 group', message.role === 'user' && 'flex-row-reverse')}
                        >
                          <div className={cn('w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0', message.role === 'assistant' ? 'bg-primary/10' : 'bg-muted')}>
                            {message.role === 'assistant' ? <Bot className="h-4 w-4 text-primary" /> : <User className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <div className="flex flex-col gap-1 max-w-[80%]">
                            <div className={cn('rounded-2xl px-4 py-2.5', message.role === 'assistant' ? 'bg-muted text-foreground rounded-tl-sm' : 'bg-primary text-primary-foreground rounded-tr-sm')}>
                              {message.role === 'assistant' ? (
                                <div className="prose prose-sm dark:prose-invert max-w-none">
                                  {message.content ? (
                                    <ReactMarkdown
                                      components={{
                                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                                        ul: ({ children }) => <ul className="my-2 ml-4 list-disc">{children}</ul>,
                                        ol: ({ children }) => <ol className="my-2 ml-4 list-decimal">{children}</ol>,
                                        li: ({ children }) => <li className="mb-1">{children}</li>,
                                        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                                      }}
                                    >
                                      {message.content}
                                    </ReactMarkdown>
                                  ) : (
                                    <TypingDots />
                                  )}
                                </div>
                              ) : (
                                <p className="text-sm">{message.content}</p>
                              )}
                            </div>
                            {message.role === 'assistant' && message.content && (
                              <div className="flex items-center gap-2 pl-1">
                                <CopyButton text={message.content} />
                                <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                                  {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      ))
                    )}
                    {isLoading && messages[messages.length - 1]?.content === '' && (
                      <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                        <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
                          <TypingDots />
                        </div>
                      </div>
                    )}
                    {showFollowups && !isLoading && messages.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap gap-1.5 pl-11">
                        {FOLLOWUP_SUGGESTIONS.slice(0, 3).map((q) => (
                          <button key={q} onClick={() => handleSuggestionClick(q)} className={cn('px-2.5 py-1.5 text-xs rounded-full border border-border hover:bg-accent hover:border-primary/30 transition-colors text-muted-foreground hover:text-foreground')}>
                            {q}
                          </button>
                        ))}
                      </motion.div>
                    )}
                    {error && (
                      <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                        <AlertCircle className="h-4 w-4 flex-shrink-0" />
                        <span>{error}</span>
                      </div>
                    )}
                    <div ref={messagesEndRef} />
                  </div>
                  <form onSubmit={handleSubmit} className="p-4 border-t bg-muted/30">
                    <div className="flex gap-2">
                      <Input ref={inputRef} value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type your question..." disabled={isLoading} className="flex-1 h-11 bg-background" />
                      <Button type="submit" disabled={!input.trim() || isLoading} size="icon" className="h-11 w-11">
                        {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                      </Button>
                    </div>
                    <div className="mt-3 pt-3 border-t border-border/50 text-center">
                      <p className="text-xs text-muted-foreground mb-2">Prefer to chat on WhatsApp?</p>
                      <Button type="button" variant="outline" size="sm" onClick={() => window.open(WHATSAPP_URL, '_blank')} className="gap-2 text-green-600 border-green-200 hover:bg-green-50 hover:border-green-300">
                        <MessageSquare className="h-4 w-4" />
                        Chat on WhatsApp
                      </Button>
                    </div>
                  </form>
                </motion.div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  )
}
