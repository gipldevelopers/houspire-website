"use client";

import React, { useState } from 'react';
import { useColorTheme } from '@/context/ColorThemeContext';
import { defaultPalette } from '@/lib/palette';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  RotateCcw, 
  Download, 
  Upload, 
  Copy, 
  Check, 
  Eye,
  Settings2,
  Layout,
  Type,
  MousePointer2,
  Palette,
  CheckCircle2
} from 'lucide-react';
import { toast } from 'sonner';

export default function ColorPalettePage() {
  const { palette, updateColor, savePalette, resetToDefault, importPalette } = useColorTheme();
  const [copiedKey, setCopiedKey] = useState(null);

  const handleSave = () => {
    savePalette();
    toast.success("Design saved successfully!");
  };

  const handleCopy = (hex, key) => {
    navigator.clipboard.writeText(hex);
    setCopiedKey(key);
    toast.success(`Copied ${hex}`);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const ColorInput = ({ label, pKey }) => (
    <div className="flex flex-col gap-2 p-4 bg-white/5 rounded-2xl border border-[var(--color-border)]">
      <div className="flex items-center justify-between">
        <Label className="capitalize font-bold opacity-80">{label || pKey.replace(/([A-Z])/g, ' $1')}</Label>
        <span className="text-[10px] font-mono opacity-40 uppercase">{palette[pKey]}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-black/5">
          <input 
            type="color" 
            value={palette[pKey]}
            onChange={(e) => updateColor(pKey, e.target.value)}
            className="absolute -inset-2 w-[200%] h-[200%] cursor-pointer"
          />
        </div>
        <Input 
          value={palette[pKey]}
          onChange={(e) => updateColor(pKey, e.target.value)}
          className="flex-1 bg-transparent border-[var(--color-border)] h-10"
        />
        <button 
          onClick={() => handleCopy(palette[pKey], pKey)}
          className="p-2 hover:bg-black/5 rounded-lg transition-colors"
        >
          {copiedKey === pKey ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 opacity-40" />}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-24 pb-12 transition-colors duration-500" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-[var(--color-border)] pb-8">
          <div>
            <h1 className="text-4xl font-black tracking-tight" style={{ color: 'var(--color-heading)' }}>
              Brand Theme Controller
            </h1>
            <p className="text-[17px] opacity-60 mt-2">
              Deep-sync every button, border, and brand detail in real-time.
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSave} className="rounded-full bg-[var(--color-primary)] text-white hover:opacity-90 shadow-lg px-8">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Save Design
            </Button>
            <Button variant="outline" onClick={resetToDefault} className="rounded-full border-[var(--color-border)]">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* LEFT: Controls with Tabs */}
          <div className="lg:col-span-1">
            <Tabs defaultValue="core" className="w-full">
              <TabsList className="grid w-full grid-cols-3 rounded-full mb-8 p-1 bg-black/5">
                <TabsTrigger value="core" className="rounded-full">Core</TabsTrigger>
                <TabsTrigger value="heading" className="rounded-full">Heading</TabsTrigger>
                <TabsTrigger value="buttons" className="rounded-full">Buttons</TabsTrigger>
              </TabsList>

              <TabsContent value="core" className="space-y-4">
                <div className="flex items-center gap-2 mb-4 opacity-60">
                   <Palette className="w-4 h-4" />
                   <span className="text-sm font-bold uppercase tracking-tight">Base Palette</span>
                </div>
                <ColorInput pKey="primary" label="Brand Primary" />
                <ColorInput pKey="secondary" label="Brand Secondary" />
                <ColorInput pKey="card" label="Card Surfaces" />
                <ColorInput pKey="accent" label="Accent Highlight" />
                <ColorInput pKey="background" label="Main Background" />
                <ColorInput pKey="border" label="System Borders" />
              </TabsContent>

              <TabsContent value="heading" className="space-y-8">
                {/* Main Heading Set */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-[var(--color-heading-main)]" />
                        <span className="text-xs font-black uppercase tracking-widest">Main Heading (H1/H2)</span>
                    </div>
                    <ColorInput pKey="headingMain" label="Primary Color" />
                    <ColorInput pKey="headingMainHighlight" label="Highlight Color" />
                </section>

                {/* Secondary Heading Set */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full border border-[var(--color-heading-secondary)]" />
                        <span className="text-xs font-black uppercase tracking-widest">Secondary Heading</span>
                    </div>
                    <ColorInput pKey="headingSecondary" label="Primary Color" />
                    <ColorInput pKey="headingSecondaryHighlight" label="Highlight Color" />
                </section>

                {/* Description Set */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <Type className="w-4 h-4 opacity-40" />
                        <span className="text-xs font-black uppercase tracking-widest">Description / Body Text</span>
                    </div>
                    <ColorInput pKey="description" label="Text Color" />
                </section>
              </TabsContent>

              <TabsContent value="buttons" className="space-y-8">
                {/* Primary Button Set */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full bg-[var(--color-primary)]" />
                        <span className="text-xs font-black uppercase tracking-widest">Primary Button Style</span>
                    </div>
                    <ColorInput pKey="btnPrimaryBg" label="Fill Color" />
                    <ColorInput pKey="btnPrimaryText" label="Text Color" />
                    <ColorInput pKey="btnPrimaryHoverBg" label="Hover Background" />
                    <ColorInput pKey="btnPrimaryHoverText" label="Hover Text" />
                    <ColorInput pKey="btnPrimaryBorder" label="Outer Border" />
                </section>

                {/* Secondary Button Set */}
                <section className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="h-2 w-2 rounded-full border border-[var(--color-primary)]" />
                        <span className="text-xs font-black uppercase tracking-widest">Secondary Button Style</span>
                    </div>
                    <ColorInput pKey="btnSecondaryBg" label="Fill Color" />
                    <ColorInput pKey="btnSecondaryText" label="Text Color" />
                    <ColorInput pKey="btnSecondaryBorder" label="Outline / Border" />
                    <ColorInput pKey="btnSecondaryHoverBg" label="Hover Background" />
                </section>
              </TabsContent>
            </Tabs>
          </div>

          {/* RIGHT: Live Previews */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* Section 1: Surface & Hierarchy */}
            <div className="p-10 rounded-[48px] border border-[var(--color-border)] bg-[var(--color-bg)] shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                    <Layout className="w-32 h-32" />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-white/50 text-[10px] font-bold uppercase tracking-tighter shadow-sm" style={{ color: 'var(--color-primary)' }}>
                             <Eye className="w-3 h-3" /> Live Interface Preview
                        </div>
                        <h3 className="text-5xl font-black leading-[1.1] tracking-tight" style={{ color: 'var(--color-heading)' }}>
                            The New Standard <br/>for Interiors.
                        </h3>
                        <p className="text-lg leading-relaxed" style={{ color: 'var(--color-text)', opacity: 0.8 }}>
                            You can now control the primary and secondary buttons from the "Button Logic" tab on the left.
                        </p>
                        <div className="flex flex-wrap gap-4 pt-4">
                            <button className="btn-primary btn-lg group">
                                Primary CTA
                                <Check className="ml-2 w-5 h-5 transition-transform group-hover:scale-110" />
                            </button>
                            <button className="btn-secondary btn-lg">
                                Secondary Action
                            </button>
                        </div>
                    </div>
                    
                    <div className="p-8 rounded-[32px] shadow-2xl transition-all duration-500 scale-95 md:scale-105" 
                         style={{ backgroundColor: 'var(--color-card)', border: '1px solid var(--color-border)' }}>
                        <div className="w-14 h-14 rounded-2xl mb-8 flex items-center justify-center text-white shadow-lg" style={{ backgroundColor: 'var(--color-secondary)' }}>
                            <Settings2 className="w-7 h-7" />
                        </div>
                        <h4 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-heading)' }}>Card Visualizer</h4>
                        <p className="text-base leading-relaxed mb-8" style={{ color: 'var(--color-heading)', opacity: 0.6 }}>
                            This card uses your secondary color as the icon background and mocha beige for the surface.
                        </p>
                        <div className="flex items-center gap-3 mt-auto">
                            <div className="h-2 flex-1 bg-black/5 rounded-full overflow-hidden">
                                <div className="h-full bg-[var(--color-primary)] w-[65%]" />
                            </div>
                            <span className="text-xs font-bold opacity-40">System Ready</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Section 2: Small Button Previews */}
            <Card className="p-8 rounded-[40px] border-[var(--color-border)] bg-white shadow-sm overflow-hidden">
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-2 opacity-30">
                        <MousePointer2 className="w-4 h-4" />
                        <span className="text-xs font-bold uppercase tracking-widest">Button Variants</span>
                    </div>
                    <div className="h-px flex-1 mx-6 bg-black/5" />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold opacity-30 uppercase">Primary Default</p>
                        <button className="btn-primary w-full shadow-md">Main Button</button>
                    </div>
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold opacity-30 uppercase">Primary Sm</p>
                        <button className="btn-primary btn-sm w-full">Small CTA</button>
                    </div>
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold opacity-30 uppercase">Secondary Default</p>
                        <button className="btn-secondary w-full">Outline</button>
                    </div>
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold opacity-30 uppercase">Secondary Sm</p>
                        <button className="btn-secondary btn-sm w-full">Outline Sm</button>
                    </div>
                </div>
            </Card>

            <div className="p-6 rounded-2xl bg-black/5 flex items-start gap-4">
                <div className="p-2 rounded-full bg-white">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                </div>
                <div className="flex-1">
                     <h5 className="font-bold text-sm mb-1">Deep Button Injection Active</h5>
                     <p className="text-xs opacity-60 leading-relaxed max-w-lg">
                        We have now split the button logic into 10 unique variables. This allows you to have a black button with white text that turns red with yellow text on hover, if you really wanted to! 
                     </p>
                     <div className="mt-4 flex gap-4 text-[10px] font-mono opacity-40">
                        <span>--color-btn-primary-bg</span>
                        <span>--color-btn-secondary-border</span>
                     </div>
                </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
