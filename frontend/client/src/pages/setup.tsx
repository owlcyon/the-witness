import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Sprout, 
  Settings2, 
  Cloud, 
  Bot, 
  Rocket, 
  Play,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useLocation } from "wouter";

export default function SetupWizard() {
  const [step, setStep] = useState(0);
  const [, setLocation] = useLocation();

  const nextStep = () => setStep(s => Math.min(s + 1, 5));
  const prevStep = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-ui selection:bg-primary selection:text-primary-foreground overflow-hidden relative">
      
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none opacity-20 scanline z-0"></div>
      <div className="absolute inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>

      {/* Header / Progress */}
      <div className="w-full h-16 border-b border-border flex items-center justify-between px-8 relative z-10 bg-background/50 backdrop-blur">
        <div className="flex items-center gap-2 font-display font-bold text-xl">
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground">
            <Rocket className="w-5 h-5" />
          </div>
          THE WITNESS <span className="text-muted-foreground font-mono text-sm font-normal">// INITIALIZATION</span>
        </div>
        <div className="flex items-center gap-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className={cn("w-2 h-2 rounded-full transition-all duration-500", i <= step ? "bg-primary scale-125" : "bg-muted")} />
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {step === 0 && <StepWelcome key="step0" onNext={nextStep} />}
          {step === 1 && <StepSeeds key="step1" onNext={nextStep} onBack={prevStep} />}
          {step === 2 && <StepTuning key="step2" onNext={nextStep} onBack={prevStep} />}
          {step === 3 && <StepCloud key="step3" onNext={nextStep} onBack={prevStep} />}
          {step === 4 && <StepAutonomy key="step4" onNext={nextStep} onBack={prevStep} />}
          {step === 5 && <StepLaunch key="step5" onLaunch={() => setLocation("/")} onBack={prevStep} />}
        </AnimatePresence>
      </div>

    </div>
  );
}

// --- Steps ---

function StepWelcome({ onNext }: { onNext: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="max-w-2xl text-center space-y-8"
    >
      <div className="space-y-4">
        <h1 className="text-5xl font-display font-bold text-glow">Enter the Noosphere</h1>
        <p className="text-xl text-muted-foreground font-light">
          You are initializing an autonomous distributed API for eternal threads.
          <br/>We will plant seeds, tune the filters, and launch your fleet.
        </p>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-left">
        <FeatureCard icon={Sprout} title="Crawl" desc="Harvest from the digital wilds" delay={0.1} />
        <FeatureCard icon={Settings2} title="Synthesize" desc="Map semantic connections" delay={0.2} />
        <FeatureCard icon={Cloud} title="Converge" desc="Scale across the cloud" delay={0.3} />
      </div>

      <Button size="lg" onClick={onNext} className="text-lg px-8 py-6 font-display tracking-widest bg-primary hover:bg-primary/90 shadow-[0_0_20px_rgba(139,92,246,0.5)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] transition-all">
        BEGIN INITIALIZATION <ArrowRight className="ml-2" />
      </Button>
    </motion.div>
  );
}

function StepSeeds({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  return (
    <WizardStep title="Plant Your Seeds" subtitle="Where should the Witness start looking?" icon={Sprout} onNext={onNext} onBack={onBack}>
       <div className="space-y-6">
         <div className="bg-card/50 border border-border p-6 rounded-lg">
           <label className="text-sm font-mono text-muted-foreground uppercase mb-2 block">Initial Ontology / Keywords</label>
           <Input placeholder="e.g. 'fana', 'spiritual AI', 'hyperstition'" className="font-mono text-lg p-6 h-auto bg-background/50" />
           <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
             <Info className="w-3 h-3" /> These seeds will be used to populate the initial bloom filter.
           </p>
         </div>

         <div className="grid grid-cols-3 gap-4">
           <SeedSource label="X (Twitter)" active />
           <SeedSource label="Reddit" active />
           <SeedSource label="4chan /x/" />
           <SeedSource label="Substack" />
           <SeedSource label="Hacker News" />
           <SeedSource label="Bluesky" />
         </div>
       </div>
    </WizardStep>
  );
}

function StepTuning({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  return (
    <WizardStep title="Tune the Filters" subtitle="Adjust how the AI synthesizes truth from noise." icon={Settings2} onNext={onNext} onBack={onBack}>
       <div className="space-y-8 bg-card/50 border border-border p-8 rounded-lg backdrop-blur-sm">
         <div className="space-y-4">
           <div className="flex justify-between">
             <label className="font-display font-bold text-lg">Cosine Similarity Threshold</label>
             <span className="font-mono text-primary text-xl">0.72</span>
           </div>
           <Slider defaultValue={[72]} max={100} step={1} />
           <p className="text-sm text-muted-foreground">Higher values create sparser, higher-quality graphs. Lower values allow for more "creative" leaps.</p>
         </div>

         <div className="space-y-4">
           <div className="flex justify-between">
             <label className="font-display font-bold text-lg">Freshness Decay Rate</label>
             <span className="font-mono text-accent text-xl">FAST</span>
           </div>
           <Slider defaultValue={[85]} max={100} step={1} />
           <p className="text-sm text-muted-foreground">How quickly should old threads be pruned? Fast decay favors viral content.</p>
         </div>
       </div>
    </WizardStep>
  );
}

function StepCloud({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  return (
    <WizardStep title="Scale the Fleet" subtitle="Connect your cloud infrastructure." icon={Cloud} onNext={onNext} onBack={onBack}>
       <div className="space-y-6 bg-card/50 border border-border p-8 rounded-lg backdrop-blur-sm">
         <div className="grid grid-cols-2 gap-4 mb-4">
           <Button variant="outline" className="h-24 flex flex-col gap-2 border-primary bg-primary/10">
             <Cloud className="w-8 h-8" />
             <span>AWS (Detected)</span>
           </Button>
           <Button variant="outline" className="h-24 flex flex-col gap-2 text-muted-foreground">
             <Cloud className="w-8 h-8 grayscale opacity-50" />
             <span>GCP</span>
           </Button>
         </div>

         <div className="space-y-4">
           <div className="space-y-2">
             <label className="text-xs font-mono text-muted-foreground uppercase">AWS Access Key ID</label>
             <Input value="AKIA................" disabled className="font-mono bg-background/50 opacity-50" />
           </div>
           <div className="space-y-2">
             <label className="text-xs font-mono text-muted-foreground uppercase">Max Budget Cap</label>
             <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input defaultValue="50.00" className="pl-6 font-mono bg-background/50" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground text-xs">/ HOUR</span>
             </div>
           </div>
         </div>
       </div>
    </WizardStep>
  );
}

function StepAutonomy({ onNext, onBack }: { onNext: () => void, onBack: () => void }) {
  return (
    <WizardStep title="Enable Autonomy" subtitle="Let the system heal and grow on its own." icon={Bot} onNext={onNext} onBack={onBack}>
       <div className="space-y-6 bg-card/50 border border-border p-8 rounded-lg backdrop-blur-sm">
         <div className="flex items-center justify-between p-4 border border-border rounded bg-background/30">
           <div className="flex items-center gap-4">
             <div className="p-2 bg-primary/20 rounded text-primary"><Bot className="w-6 h-6" /></div>
             <div>
               <h3 className="font-bold">Self-Healing Swarm</h3>
               <p className="text-sm text-muted-foreground">LangChain agents will reroute failed workers.</p>
             </div>
           </div>
           <Switch defaultChecked />
         </div>

         <div className="flex items-center justify-between p-4 border border-border rounded bg-background/30">
           <div className="flex items-center gap-4">
             <div className="p-2 bg-accent/20 rounded text-accent"><Settings2 className="w-6 h-6" /></div>
             <div>
               <h3 className="font-bold">Deep Back Loop</h3>
               <p className="text-sm text-muted-foreground">Feed synthesized insights back as new seeds.</p>
             </div>
           </div>
           <Switch defaultChecked />
         </div>
       </div>
    </WizardStep>
  );
}

function StepLaunch({ onLaunch, onBack }: { onLaunch: () => void, onBack: () => void }) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}
      className="max-w-md w-full text-center space-y-8"
    >
      <div className="w-32 h-32 mx-auto bg-primary/10 rounded-full flex items-center justify-center border-4 border-primary relative">
        <div className="absolute inset-0 rounded-full border-4 border-primary border-t-transparent animate-spin"></div>
        <Rocket className="w-16 h-16 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-3xl font-display font-bold">Ready to Launch</h2>
        <p className="text-muted-foreground">Configuration valid. Systems primed.</p>
      </div>

      <div className="space-y-4 font-mono text-sm text-left bg-card/50 p-6 rounded border border-border">
        <div className="flex justify-between"><span className="text-muted-foreground">SEEDS:</span> <span>3 Sources</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">THRESHOLD:</span> <span>0.72</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">CLOUD:</span> <span className="text-green-400">CONNECTED</span></div>
        <div className="flex justify-between"><span className="text-muted-foreground">AUTONOMY:</span> <span className="text-primary">ACTIVE</span></div>
      </div>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onBack} className="flex-1">BACK</Button>
        <Button size="lg" onClick={onLaunch} className="flex-[2] bg-green-500 hover:bg-green-600 text-white font-bold tracking-wider">
          DEPLOY WITNESS
        </Button>
      </div>
    </motion.div>
  );
}

// --- Components ---

function WizardStep({ title, subtitle, icon: Icon, children, onNext, onBack }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}
      className="max-w-2xl w-full space-y-8"
    >
      <div className="flex items-start gap-4">
        <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
          <Icon className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-display font-bold">{title}</h2>
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        </div>
      </div>

      <div className="min-h-[300px]">
        {children}
      </div>

      <div className="flex justify-between pt-8 border-t border-border">
        <Button variant="ghost" onClick={onBack} className="hover:bg-transparent hover:text-primary">
          <ArrowLeft className="mr-2 w-4 h-4" /> BACK
        </Button>
        <Button onClick={onNext} className="px-8">
          NEXT STEP <ArrowRight className="ml-2 w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}

function FeatureCard({ icon: Icon, title, desc, delay }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
      className="p-4 rounded border border-border bg-card/30 backdrop-blur-sm hover:border-primary/50 transition-colors"
    >
      <Icon className="w-6 h-6 text-primary mb-2" />
      <h3 className="font-bold font-display text-sm uppercase">{title}</h3>
      <p className="text-xs text-muted-foreground mt-1">{desc}</p>
    </motion.div>
  );
}

function SeedSource({ label, active }: { label: string, active?: boolean }) {
  return (
    <div className={cn(
      "p-4 rounded border flex items-center gap-3 cursor-pointer transition-all",
      active ? "bg-primary/20 border-primary text-foreground" : "bg-card/30 border-border text-muted-foreground hover:border-primary/50"
    )}>
      <div className={cn("w-4 h-4 rounded-full border flex items-center justify-center", active ? "border-primary bg-primary" : "border-muted-foreground")}>
        {active && <CheckCircle className="w-3 h-3 text-black" />}
      </div>
      <span className="font-mono text-sm font-bold">{label}</span>
    </div>
  );
}
