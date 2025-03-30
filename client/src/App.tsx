import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TeamProvider } from "./context/TeamContext";
import TeamBuilder from "./pages/TeamBuilder";
import TeamComparison from "./pages/TeamComparison";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={TeamBuilder} />
      <Route path="/compare" component={TeamComparison} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TeamProvider>
        <Router />
        <Toaster />
      </TeamProvider>
    </QueryClientProvider>
  );
}

export default App;
