"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Clock, RefreshCw, Heart,
    RotateCcw, ShieldCheck, AlertCircle, CreditCard,
    CheckCircle2, Info, Mail, Phone, MapPin, ExternalLink
} from 'lucide-react';

const RefundPolicyPage = () => {
    const router = useRouter();

    const effectiveDate = "03.02.2026";
    const lastUpdatedDate = "03.02.2026";
    const legalEntity = "ARMISHQ DESIGN PRIVATE LIMITED";

    const handleBack = () => {
        router.back();
    };

    const Section = ({ title, children, id }) => (
        <section id={id} className="mb-20 scroll-mt-24">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full" />
                {title}
            </h2>
            <div className="text-gray-600 dark:text-gray-400 space-y-6 leading-relaxed text-sm md:text-base pl-3 border-l border-gray-50 dark:border-white/5 ml-0.5">
                {children}
            </div>
        </section>
    );

    const Subtitle = ({ children }) => (
        <p className="font-bold text-gray-900 dark:text-white mt-8 mb-4 uppercase text-xs tracking-widest">{children}</p>
    );

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950">
            <div className="max-w-4xl mx-auto px-6 py-12 md:py-24">
                {/* Navigation */}
                <button
                    onClick={handleBack}
                    className="flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors group mb-16"
                >
                    <ArrowLeft className="w-4 h-4 mr-2 transition-transform group-hover:-translate-x-1" />
                    Back
                </button>

                {/* Header */}
                <header className="mb-24">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/5 text-primary text-xs font-bold mb-6 tracking-wider uppercase">
                        <RotateCcw className="w-3 h-3" /> Refund Assurance
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
                        Refund & Cancellation
                    </h1>
                    <p className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
                        This Policy outlines the terms under which refunds and cancellations are processed for Houspire services.
                    </p>
                    <div className="flex flex-wrap gap-6 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Effective: {effectiveDate}</span>
                        <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Updated: {lastUpdatedDate}</span>
                    </div>
                </header>

                {/* Content */}
                <div className="space-y-4">
                    <p className="text-sm italic text-gray-500 mb-12 pt-4">This Policy is part of the <a href="/legal/terms" className="text-primary font-bold hover:underline">Terms and Conditions</a> of Houspire.</p>

                    <Section title="1. INTRODUCTION">
                        <p><strong>1.1 Our Commitment:</strong> At Houspire, we strive to provide high-quality AI-powered interior design services. We understand that circumstances may require order cancellation or refund requests.</p>
                        <p><strong>1.2 Applicability:</strong> This Policy applies to all services purchased through our website (www.houspire.ai), mobile application, or any authorized sales channel.</p>
                        <p><strong>1.3 Consumer Rights:</strong> This Policy is in addition to, and does not limit, your statutory rights under Indian consumer protection laws.</p>
                    </Section>
<br /><br />
                    <Section title="2. REFUND ELIGIBILITY CRITERIA">
                        {/* <Subtitle>2.1 Trial Packages - 100% money back guarantee*</Subtitle> */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                <p className="text-[10px] font-bold text-primary uppercase mb-2 tracking-widest">Single Room Trial</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">₹499</p>
                            </div>
                            <div className="p-5 rounded-2xl bg-primary/5 border border-primary/10">
                                <p className="text-[10px] font-bold text-primary uppercase mb-2 tracking-widest">Double Room Trial</p>
                                <p className="text-xl font-bold text-gray-900 dark:text-white">₹899</p>
                            </div>
                        </div>
                        {/* <p><strong>2.1 Eligibility:</strong> Request made within 7 days of design delivery if you are unsatisfied with the quality. No questions asked. 100% refund.</p> */}
                        {/* <p><strong>2.2 Conditions:</strong> Refund credited to original payment method. No deductions. One-time guarantee per customer. Processing time is 5-7 business days.</p> */}

                        <Subtitle>2.3 Full Home Packages - Tiered Refund Structure</Subtitle>
                        <div className="space-y-8 mt-6">
                            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                <div className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> SCENARIO A: Before Design Work Starts
                                </div>
                                <p className="text-sm mb-4">Timeframe: Within 24 hours of order placement AND before discovery call.</p>
                                <p className="text-sm font-bold text-primary">Refund: 100% minus ₹500 processing fee.</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                <div className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 rounded-full bg-primary" /> SCENARIO B: After Design Work Starts
                                </div>
                                <p className="text-sm mb-4">Timeframe: Within 48 hours of design work commencement, but before draft delivery.</p>
                                <p className="text-sm font-bold text-primary">Refund: 50% of order value.</p>
                            </div>
                            <div className="p-6 rounded-3xl bg-red-50/30 dark:bg-red-900/5 border border-red-100/50 dark:border-red-900/10">
                                <p className="font-bold text-red-900 dark:text-red-400 mb-4 flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> SCENARIO C: After First Draft Delivery
                                </p>
                                <p className="text-sm text-red-800 dark:text-red-900/70">Generally NOT eligible for refund except for significant quality issues or failure to meet agreed scope.</p>
                            </div>
                        </div>

                        <Subtitle>2.4 Add-On Services</Subtitle>
                        <p className="text-sm">Service not yet rendered: 100% refund. Service partially completed: Pro-rated refund (discretionary). Fully completed: No refund.</p>
                    </Section>
<br /><br />
                    <Section title="3. NON-REFUNDABLE SITUATIONS">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { t: "3.1 Customer-Initiated", d: "Change of mind, buyer’s remorse, project postponed, or finding another designer." },
                                { t: "3.2 Completed Services", d: "All deliverables provided as per package or all revisions exhausted." },
                                { t: "3.3 Customer Delays", d: "Unavailability for calls, failure to provide info, or delayed feedback > 15 days." },
                                { t: "3.4 Misuse", d: "Fraudulent orders, Terms violations, or abusive behavior toward staff." }
                            ].map((item, i) => (
                                <div key={i} className="p-5 rounded-2xl border border-gray-100 dark:border-white/10">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-2">{item.t}</p>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{item.d}</p>
                                </div>
                            ))}
                        </div>
                    </Section>
<br /><br />
                    <Section title="4. CANCELLATION PROCESS">
                        <div className="space-y-6">
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">1</div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">Send Email Request</p>
                                    <p className="text-sm">To <strong>refund@houspire.ai</strong> with Order #[Number] and detailed reason.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">2</div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">Review & Decision</p>
                                    <p className="text-sm">Team reviews within 48-72 hours. Notification of approval or denial via email.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">3</div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white text-sm mb-1">Refund Initiation</p>
                                    <p className="text-sm">If approved, initiated within 7 business days to your original payment method.</p>
                                </div>
                            </div>
                        </div>
                    </Section>
<br /><br />
                    <Section title="5. PROCESSING TIMELINES">
                        <div className="space-y-4 text-sm">
                            <p className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                <span className="font-medium">UPI & Wallets</span>
                                <span className="font-bold text-primary">3-5 Business Days</span>
                            </p>
                            <p className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                <span className="font-medium">Credit / Debit Cards</span>
                                <span className="font-bold text-primary">5-7 Business Days</span>
                            </p>
                            <p className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                <span className="font-medium">Net Banking</span>
                                <span className="font-bold text-primary">5-7 Business Days</span>
                            </p>
                            <p className="flex justify-between items-center py-2 border-b border-gray-50 dark:border-white/5">
                                <span className="font-medium">Bank Transfer (Manual)</span>
                                <span className="font-bold text-primary">7-10 Business Days</span>
                            </p>
                        </div>
                        <p className="text-xs italic text-muted-foreground mt-4">Note: Total timeline from request to account credit typically ranges between 8-17 business days.</p>
                    </Section>
<br /><br />
                    <Section title="6. UPGRADE CREDITS (TRIAL PACKAGES)">
                        <p><strong>6.1 Offer:</strong> If you upgrade from Trial to a Full Home Package within 7 days, your trial amount is credited back toward the new order. Pay only the difference.</p>
                        <p><strong>6.2 How to Claim:</strong> Place the new order and email <strong>upgrade@houspire.ai</strong> with both order numbers. Credit applied within 24 hours.</p>
                    </Section>
<br /><br />
                    <Section title="7. DISPUTE RESOLUTION">
                        <p><strong>7.1 Escalation:</strong> If a refund is denied, you may request escalation for senior review by our Quality Assurance Manager. Decisions are issued within 5 business days.</p>
                        <p><strong>7.2 Informal Resolution:</strong> Before legal action, parties agree to attempt informal resolution via <strong>legal@houspire.ai</strong> for at least 30 days.</p>
                        <p><strong>7.3 Arbitration:</strong> Unresolved disputes will be settled by arbitration in <strong>Hyderabad, India</strong> under the Arbitration and Conciliation Act, 1996.</p>
                    </Section>
<br /><br />
                    <Section title="8. CONTACT INFORMATION">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                                    <Mail className="w-4 h-4 text-primary" /> refund@houspire.ai
                                </p>
                                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                                    <Mail className="w-4 h-4 text-primary" /> grievance@houspire.ai
                                </p>
                            </div>
                            <div className="space-y-4">
                                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                                    <MapPin className="w-4 h-4 text-primary" /> Plot No 67, Jubilee Hills, Hyderabad- 500033
                                </p>
                            </div>
                        </div>
                    </Section>

                    <div className="mt-40 text-center pb-20">
                        <Heart className="w-6 h-6 text-primary/20 mx-auto mb-8 animate-pulse" />
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.3em] mb-1">
                            {legalEntity}
                        </p>
                        <p className="text-[8px] text-gray-400/50 mt-4 uppercase">© 2026 All Rights Reserved</p>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default RefundPolicyPage;
