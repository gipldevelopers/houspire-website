'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import Image from 'next/image';
import { verifyAccess } from './actions';
import logoImg from '@/assets/logo.png';

export default function AccessPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password.trim()) return;

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('password', password);

    try {
      const result = await verifyAccess(formData);
      
      if (result.success) {
        const from = searchParams.get('from') || '/';
        router.push(from);
      } else {
        setError(result.error);
        setLoading(false);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#FAFAFA] text-[#1A1A1A] overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#E48B53] opacity-[0.08] blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-[#E48B53] opacity-[0.05] blur-[120px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md px-6 z-10"
      >
        <div className="mb-10 flex justify-center">
          <div className="relative w-[180px] h-[45px]">
            <Image
              src="/houspire-logo.png"
              alt="Houspire"
              fill
              style={{ objectFit: 'contain' }}
              priority
            />
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#E48B53] to-transparent opacity-50" />
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-4 border border-gray-100 shadow-sm">
              <Lock className="w-6 h-6 text-[#E48B53]" />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A] mb-2">Restricted Access</h1>
            <p className="text-sm text-gray-500 text-center">
              This site is currently for internal use only. Please enter the password to proceed.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Enter access password"
                  className="w-full bg-white border border-gray-200 shadow-sm rounded-xl px-4 py-3 text-[#1A1A1A] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E48B53]/50 focus:border-[#E48B53]/50 transition-all"
                  autoFocus
                />
              </div>
              {error && (
                <motion.p 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="text-sm text-red-400 pl-1"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-[#E48B53] hover:bg-[#D57A42] text-white rounded-xl py-3 px-4 font-medium transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Unlock Access
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
        
        <div className="mt-8 flex items-center justify-center gap-2 text-xs text-gray-400">
          <ShieldCheck className="w-3 h-3" />
          <span>Secured by Houspire Internal Access</span>
        </div>
      </motion.div>
    </div>
  );
}
