"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Clock, RefreshCw, Heart,
    Cookie, ShieldCheck, Target, List, Settings, EyeOff,
    CheckCircle2, XCircle, ExternalLink, Mail, MapPin, Info
} from 'lucide-react';

const CookiePolicyPage = () => {
    const router = useRouter();

    const effectiveDate = "03.02.2026";
    const lastUpdatedDate = "03.02.2026";
    const legalEntity = "Armishq Design Private Limited";
    const websiteUrl = "www.houspire.ai";

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

    const CookieTable = ({ cookies }) => (
        <div className="overflow-x-auto my-6 rounded-2xl border border-gray-100 dark:border-white/10">
            <table className="w-full text-left text-sm border-collapse">
                <thead>
                    <tr className="bg-gray-50/50 dark:bg-white/5">
                        <th className="p-4 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 uppercase text-[10px] tracking-widest">Cookie Name</th>
                        <th className="p-4 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 uppercase text-[10px] tracking-widest">Provider</th>
                        <th className="p-4 font-bold text-gray-900 dark:text-white border-b border-gray-100 dark:border-white/10 uppercase text-[10px] tracking-widest">Purpose</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-white/10">
                    {cookies.map((cookie, i) => (
                        <tr key={i}>
                            <td className="p-4 font-mono text-[11px] text-primary">{cookie.name}</td>
                            <td className="p-4 font-semibold text-gray-900 dark:text-white">{cookie.provider}</td>
                            <td className="p-4 text-gray-500">{cookie.purpose}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
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
                        <Cookie className="w-3 h-3" /> Transparency Note
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
                        Cookie Policy
                    </h1>
                    <p className="text-lg text-muted-foreground mb-12 max-w-2xl leading-relaxed">
                        This Cookie Policy explains how {legalEntity} uses cookies and similar technologies on {websiteUrl}.
                    </p>
                    <div className="flex flex-wrap gap-6 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                        <span className="flex items-center gap-2"><Clock className="w-4 h-4" /> Effective: {effectiveDate}</span>
                        <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4" /> Updated: {lastUpdatedDate}</span>
                    </div>
                </header>

                {/* Content */}
                <div className="space-y-4">
                    <p className="text-sm italic text-gray-500 mb-12 pt-4">This Policy should be read together with our <a href="/legal/privacy" className="text-primary font-bold hover:underline">Privacy Policy</a>.</p>

                    <Section title="1. WHAT ARE COOKIES?">
                        <p><strong>1.1 Definition:</strong> Cookies are small text files that are placed on your device (computer, smartphone, or tablet) when you visit a website or use a mobile application. They are widely used to make digital platforms work efficiently and to provide information to platform owners.</p>
                        <p><strong>1.2 How Cookies Work:</strong> When you access our Platform, your browser stores the cookie on your device. When you revisit the Platform, the cookie is sent back to our servers, allowing us to recognize you and remember your preferences.</p>
                    </Section>
<br /><br />
                    <Section title="2. WHY WE USE COOKIES">
                        <p>We use cookies and similar technologies to:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                            {[
                                "Enable essential functionality (login, security)",
                                "Remember your preferences and settings",
                                "Understand Platform usage (analytics)",
                                "Improve performance and UX",
                                "Deliver personalized content",
                                "Measure marketing effectiveness",
                                "Prevent fraud and enhance security"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 p-4 rounded-xl bg-gray-50/50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                                    <CheckCircle2 className="w-4 h-4 text-primary flex-shrink-0" />
                                    <span className="text-sm font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </Section>
<br /><br />
                    <Section title="3. TYPES OF COOKIES WE USE">
                        <Subtitle>3.1 By Duration</Subtitle>
                        <p><strong>A. Session Cookies (Temporary):</strong> Deleted when you close your browser or application. Used for basic functionality like maintaining login sessions.</p>
                        <p><strong>B. Persistent Cookies (Stored):</strong> Remain on your device for a specified period (days to years). Used to remember you on return visits.</p>

                        <Subtitle>3.2 By Origin</Subtitle>
                        <p><strong>A. First-Party Cookies:</strong> Set directly by Houspire. Used for core functionality and internal analytics.</p>
                        <p><strong>B. Third-Party Cookies:</strong> Set by external providers like Google, Facebook, or Razorpay. Governed by their respective privacy policies.</p>
                    </Section>
<br /><br />
                    <Section title="4. COOKIE CATEGORIES AND DETAILS">
                        <div className="space-y-12">
                            <div>
                                <Subtitle>4.1 ESSENTIAL COOKIES (Always Active)</Subtitle>
                                <p className="text-sm mb-4">Necessary for the Platform to function correctly and cannot be disabled. Based on legitimate interest for service provision.</p>
                                <CookieTable cookies={[
                                    { name: "houspire_session", provider: "Houspire", purpose: "Maintain user session and enable login" },
                                    { name: "XSRF-TOKEN", provider: "Houspire", purpose: "Prevents CSRF attacks" },
                                    { name: "houspire_auth", provider: "Houspire", purpose: "Authentication token for logged-in users" },
                                    { name: "cookie_consent", provider: "Houspire", purpose: "Store your consent preferences" }
                                ]} />
                                <div className="p-4 rounded-xl bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/10 flex items-start gap-3">
                                    <Info className="w-4 h-4 text-red-500 mt-0.5" />
                                    <p className="text-xs text-red-600 dark:text-red-400 font-medium">Impact if Blocked: Website will not function properly. You will not be able to login, checkout, or use interactive features.</p>
                                </div>
                            </div>

                            <div>
                                <Subtitle>4.2 FUNCTIONAL COOKIES (Optional)</Subtitle>
                                <p className="text-sm">Used to remember preferences like language and theme. Requires your consent.</p>
                                <CookieTable cookies={[
                                    { name: "houspire_lang", provider: "Houspire", purpose: "Remember language preference" },
                                    { name: "houspire_theme", provider: "Houspire", purpose: "Remember dark/light mode settings" }
                                ]} />
                            </div>

                            <div>
                                <Subtitle>4.3 ANALYTICS COOKIES (Optional)</Subtitle>
                                <p className="text-sm">Help us understand how visitors use the Platform. Requires your consent.</p>
                                <CookieTable cookies={[
                                    { name: "_ga / _gid", provider: "Google Analytics", purpose: "Distinguish unique users and sessions" },
                                    { name: "houspire_analytics", provider: "Houspire", purpose: "Track internal user journey flows" }
                                ]} />
                            </div>

                            <div>
                                <Subtitle>4.4 MARKETING/ADVERTISING COOKIES (Optional)</Subtitle>
                                <p className="text-sm">Used for personalized advertisements and measuring campaign effectiveness. Requires your consent.</p>
                                <CookieTable cookies={[
                                    { name: "_fbp / fr", provider: "Facebook", purpose: "Track conversions and optimize ads" },
                                    { name: "IDE / _gcl_au", provider: "Google", purpose: "Serve targeted advertisements" }
                                ]} />
                            </div>
                        </div>
                    </Section>
<br /><br />
                    <Section title="5. COOKIE CONSENT MANAGEMENT">
                        <Subtitle>5.1 Cookie Banner</Subtitle>
                        <ul className="space-y-4 text-sm">
                            <li>• <strong>Option 1: Accept All</strong> - Enables all features for the best experience.</li>
                            <li>• <strong>Option 2: Essential Only</strong> - Declines optional tracking for basic functionality.</li>
                            <li>• <strong>Option 3: Manage Preferences</strong> - Granular control over each category.</li>
                        </ul>
                        <p><strong>5.2 Changing Preferences:</strong> You can update settings via the "Cookie Settings" link in the footer or through your Account Dashboard.</p>
                    </Section>
<br /><br />
                    <Section title="6. MANAGING VIA BROWSER">
                        <p>Most browsers allow you to block or delete cookies. Note that restricting essential cookies will impact the security and functionality of the Platform.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                            {[
                                { b: "Chrome", l: "https://support.google.com/chrome/answer/95647" },
                                { b: "Firefox", l: "https://support.mozilla.org/en-US/kb/cookies-information-websites-store-on-your-computer" },
                                { b: "Safari", l: "https://support.apple.com/guide/safari/manage-cookies-sfri11471/mac" },
                                { b: "Edge", l: "https://support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" }
                            ].map((item, i) => (
                                <a key={i} href={item.l} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-4 rounded-xl border border-gray-100 dark:border-white/10 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group">
                                    <span className="font-bold text-gray-900 dark:text-white text-sm">{item.b} Instructions</span>
                                    <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                                </a>
                            ))}
                        </div>
                    </Section>
<br /><br />
                    <Section title="7. THIRD-PARTY COOKIES">
                        <p>The Platform integrates third-party services like <strong>Google Analytics, Facebook Pixel, and Razorpay</strong>. We do not control their cookie lifecycles or data processing practices. Please refer to their respective privacy policies for details.</p>
                    </Section>
<br /><br />
                    <Section title="8. DATA PROTECTION">
                        <p><strong>8.1 Legal Basis (DPDP Act, 2023):</strong> Essential cookies are used for legitimate service provision. Optional cookies are processed ONLY on the basis of your explicit consent.</p>
                        <p><strong>8.2 Retention:</strong> Analytics data is typically retained for up to 26 months. Session cookies are deleted immediately upon closing the browser.</p>
                    </Section>
<br /><br />
                    <Section title="9. CONTACT INFORMATION">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-4">
                                <p className="flex items-center gap-3 text-sm font-semibold text-gray-900 dark:text-white">
                                    <Mail className="w-4 h-4 text-primary" /> privacy@houspire.ai
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

export default CookiePolicyPage;
