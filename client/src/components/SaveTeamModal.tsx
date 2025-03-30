import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useTeam } from "@/context/TeamContext";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface SaveTeamModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SaveTeamModal({ isOpen, onClose }: SaveTeamModalProps) {
  const { toast } = useToast();
  const { teamName, selectedFormation, playerPositions, powerScore } = useTeam();
  
  const [teamNameInput, setTeamNameInput] = useState(teamName);
  const [notes, setNotes] = useState("");

  const saveTeamMutation = useMutation({
    mutationFn: async () => {
      const teamData = {
        name: teamNameInput,
        formation: selectedFormation?.name || "4-3-3",
        players: playerPositions,
        powerScore: powerScore,
        notes: notes
      };
      
      return await apiRequest('POST', '/api/teams', teamData);
    },
    onSuccess: async () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({
        title: "Team saved",
        description: "Your team has been successfully saved.",
      });
      onClose();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to save team: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleSave = () => {
    if (!teamNameInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter a team name.",
        variant: "destructive",
      });
      return;
    }
    
    saveTeamMutation.mutate();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-montserrat font-semibold text-xl">Save Team</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="save-team-name" className="text-sm font-medium mb-1">Team Name</Label>
            <Input
              id="save-team-name"
              value={teamNameInput}
              onChange={(e) => setTeamNameInput(e.target.value)}
              placeholder="My French XI"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002654]"
            />
          </div>
          
          <div>
            <Label htmlFor="save-team-notes" className="text-sm font-medium mb-1">Notes (Optional)</Label>
            <Textarea
              id="save-team-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Add notes about this team composition..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002654]"
            />
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSave}
            style={{ backgroundColor: "#ED2939", color: "white" }}
            disabled={saveTeamMutation.isPending}
          >
            {saveTeamMutation.isPending ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-2 border-white border-t-transparent rounded-full"></span>
                Saving...
              </>
            ) : (
              "Save Team"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
