import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TeamProvider } from "./context/TeamContext";
import TeamBuilder from "./pages/TeamBuilder";
import TeamComparison from "./pages/TeamComparison";
import NotFound from "@/pages/not-found";
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

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
      <DndProvider backend={HTML5Backend}>
        <TeamProvider>
          <Router />
          <Toaster />
        </TeamProvider>
      </DndProvider>
    </QueryClientProvider>
  );
}

export default App;
