'use client'

import { usePathname } from 'next/navigation'

export function useWhatsAppMessage() {
  const pathname = usePathname()

  if (pathname.includes('/select-package')) {
    return 'Hi! I need help choosing the right design package for my home.'
  }

  if (pathname.includes('/checkout')) {
    return 'Hi! I have questions about the payment process.'
  }

  if (pathname.includes('/dashboard')) {
    return 'Hi! I need help with my ongoing project.'
  }

  if (pathname.includes('/reviews')) {
    return 'Hi! I want to know more about customer experiences with Houspire.'
  }

  if (pathname.includes('/designers')) {
    return 'Hi! Can I request a specific designer for my project?'
  }

  if (pathname.includes('/style-quiz')) {
    return 'Hi! I need help with the style quiz and finding my design preferences.'
  }

  if (pathname.includes('/referrals')) {
    return 'Hi! I have questions about the referral program.'
  }

  if (pathname.includes('/vip')) {
    return 'Hi! I want to know more about VIP membership benefits.'
  }

  return 'Hi! I have a question about Houspire interior design services.'
}

export function generateWhatsAppUrl(phoneNumber, message) {
  const encodedMessage = encodeURIComponent(message)
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
}

export function isWithinChatHours() {
  const now = new Date()
  const hour = now.getHours()
  const day = now.getDay()
  
  if (day === 0) return false
  return hour >= 9 && hour < 21
}
