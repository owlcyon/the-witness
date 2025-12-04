import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import LoomPage from "@/pages/loom";
import SemanticMapPage from "@/pages/semantic-map";
import StreamPage from "@/pages/stream";
import NodesPage from "@/pages/nodes";
import SystemPage from "@/pages/system";
import SetupWizard from "@/pages/setup";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/setup" component={SetupWizard} />
      <Route path="/loom" component={LoomPage} />
      <Route path="/stream" component={StreamPage} />
      <Route path="/map" component={SemanticMapPage} />
      <Route path="/nodes" component={NodesPage} />
      <Route path="/system" component={SystemPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
