import React from "react";
import { WitnessLayout } from "@/components/witness-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { 
  Settings, 
  Key, 
  Shield, 
  Database, 
  Server, 
  Save,
  AlertTriangle
} from "lucide-react";

export default function SystemPage() {
  return (
    <WitnessLayout>
      <div className="flex flex-col gap-6 h-full max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground flex items-center gap-3">
              <Settings className="text-muted-foreground w-6 h-6" />
              SYSTEM CONFIGURATION
            </h1>
            <p className="text-muted-foreground text-sm font-mono mt-1">
              Global Parameters • Credentials • Access Control
            </p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90 font-mono text-xs">
            <Save className="w-4 h-4 mr-2" />
            SAVE CHANGES
          </Button>
        </div>

        {/* Main Config Area */}
        <Card className="flex-1 bg-card/30 border-border backdrop-blur-sm overflow-hidden flex flex-col">
           <Tabs defaultValue="general" className="flex-1 flex flex-col">
             <div className="border-b border-border px-6 pt-4">
               <TabsList className="bg-transparent h-auto p-0 gap-6">
                 <TabItem value="general" label="General" />
                 <TabItem value="apikeys" label="API Keys & Secrets" />
                 <TabItem value="crawling" label="Crawling Rules" />
                 <TabItem value="compute" label="Compute & Scale" />
               </TabsList>
             </div>

             <ScrollAreaWrapper>
               <div className="p-6 max-w-2xl">
                 
                 <TabsContent value="general" className="space-y-8 mt-0">
                   <Section title="Witness Identity">
                     <Field label="Node Name" placeholder="WITNESS-ALPHA-01" />
                     <Field label="Operator Contact" placeholder="admin@noosphere.io" />
                   </Section>
                   <Section title="Operational Mode">
                     <div className="flex items-center justify-between py-3 border-b border-border/50">
                       <div>
                         <div className="text-sm font-medium">Autonomous Mode</div>
                         <div className="text-xs text-muted-foreground">Allow agents to self-task and heal</div>
                       </div>
                       <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between py-3 border-b border-border/50">
                       <div>
                         <div className="text-sm font-medium">Deep Back Loop</div>
                         <div className="text-xs text-muted-foreground">Feed synthesized insights back as seeds</div>
                       </div>
                       <Switch defaultChecked />
                     </div>
                   </Section>
                 </TabsContent>

                 <TabsContent value="apikeys" className="space-y-8 mt-0">
                   <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-md flex gap-3 mb-6">
                     <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                     <div className="text-xs text-yellow-200/80">
                       Warning: Keys are stored in Replit Secrets. Changes here will trigger a worker restart.
                     </div>
                   </div>
                   
                   <Section title="LLM Providers">
                     <Field label="OpenAI API Key" type="password" value="sk-........................" />
                     <Field label="Anthropic API Key" type="password" value="sk-ant-...................." />
                     <Field label="Hugging Face Token" type="password" />
                   </Section>
                   
                   <Section title="Cloud Infrastructure">
                     <Field label="AWS Access Key ID" />
                     <Field label="AWS Secret Access Key" type="password" />
                     <Field label="GCP Service Account JSON" type="textarea" />
                   </Section>
                 </TabsContent>
                 
                 <TabsContent value="compute" className="space-y-8 mt-0">
                    <Section title="Scaling Limits">
                      <Field label="Max GPU Spend ($/hr)" placeholder="50.00" />
                      <Field label="Max Concurrent Lambdas" placeholder="1000" />
                    </Section>
                    <Section title="Storage Policy">
                      <div className="flex items-center justify-between py-3 border-b border-border/50">
                        <div>
                          <div className="text-sm font-medium">Archive Raw HTML</div>
                          <div className="text-xs text-muted-foreground">Keep original source (High Storage Cost)</div>
                        </div>
                        <Switch />
                      </div>
                    </Section>
                 </TabsContent>

               </div>
             </ScrollAreaWrapper>
           </Tabs>
        </Card>

      </div>
    </WitnessLayout>
  );
}

function TabItem({ value, label }: { value: string, label: string }) {
  return (
    <TabsTrigger 
      value={value}
      className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:bg-transparent px-0 py-3 font-mono text-xs uppercase tracking-wider transition-none hover:text-foreground"
    >
      {label}
    </TabsTrigger>
  );
}

function Section({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-display font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
        <div className="w-1 h-4 bg-primary rounded-sm"></div>
        {title}
      </h3>
      <div className="space-y-4 pl-3 border-l border-border/30 ml-0.5">
        {children}
      </div>
    </div>
  );
}

function Field({ label, placeholder, type = "text", value }: any) {
  return (
    <div className="space-y-1.5">
      <label className="text-xs font-mono text-muted-foreground uppercase">{label}</label>
      {type === 'textarea' ? (
        <textarea 
          className="w-full bg-background/50 border border-border rounded-sm px-3 py-2 text-sm font-mono focus:outline-none focus:border-primary min-h-[100px]"
          placeholder={placeholder}
        />
      ) : (
        <Input 
          type={type} 
          className="bg-background/50 border-border font-mono text-sm h-9" 
          placeholder={placeholder} 
          defaultValue={value}
        />
      )}
    </div>
  );
}

// Wrapper to just provide scrolling without importing ScrollArea if not needed, 
// but we used ScrollArea in other files so let's just use a div with overflow for simplicity here
// or reuse the ScrollArea component if we want consistent styling.
function ScrollAreaWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      {children}
    </div>
  );
}
