import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useTeam } from "@/context/TeamContext";
import { Team } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { formations } from "@/lib/formations";
import { useToast } from "@/hooks/use-toast";

export default function TeamInfoPanel() {
  const { toast } = useToast();
  const { 
    currentTeam, 
    setCurrentTeam,
    teamName, 
    setTeamName, 
    selectedFormation, 
    setSelectedFormation, 
    powerScore 
  } = useTeam();

  const { data: savedTeams, isLoading } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });

  const deleteTeamMutation = useMutation({
    mutationFn: async (teamId: number) => {
      await apiRequest('DELETE', `/api/teams/${teamId}`);
      return teamId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/teams'] });
      toast({
        title: "Team deleted",
        description: "The team has been successfully deleted.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to delete team: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const handleFormationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const formationKey = e.target.value;
    const formationData = formations.find(f => f.name === formationKey);
    if (formationData) {
      setSelectedFormation(formationData);
    }
  };

  const handleLoadTeam = (team: Team) => {
    setCurrentTeam(team);
    setTeamName(team.name);
    const formationData = formations.find(f => f.name === team.formation);
    if (formationData) {
      setSelectedFormation(formationData);
    }
    toast({
      title: "Team loaded",
      description: `${team.name} has been loaded into the builder.`,
    });
  };

  const handleDeleteTeam = (teamId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteTeamMutation.mutate(teamId);
  };

  return (
    <div className="w-full lg:w-1/4 bg-white p-4 rounded-lg shadow-md">
      {/* Team Details Section */}
      <div className="mb-6">
        <h2 className="font-montserrat font-semibold text-lg border-b border-gray-200 pb-2 mb-3">Team Setup</h2>
        
        <div className="mb-4">
          <label htmlFor="team-name" className="block text-sm font-medium mb-1">Team Name</label>
          <input 
            id="team-name" 
            type="text" 
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
            placeholder="My French XI" 
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002654]"
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="formation-select" className="block text-sm font-medium mb-1">Formation</label>
          <div className="relative">
            <select 
              id="formation-select" 
              value={selectedFormation?.name}
              onChange={handleFormationChange}
              className="w-full appearance-none px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#002654] bg-white"
            >
              {formations.map((formation) => (
                <option key={formation.name} value={formation.name}>
                  {formation.name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Power Score */}
        <div className="bg-[#002654] text-white rounded-md p-3 flex items-center justify-between">
          <span className="font-medium">Team Power</span>
          <div className="flex items-center space-x-1">
            <span id="power-score" className="text-xl font-bold">{powerScore}</span>
            <span className="text-sm">/100</span>
          </div>
        </div>
      </div>
      
      {/* Saved Teams Section */}
      <div>
        <h2 className="font-montserrat font-semibold text-lg border-b border-gray-200 pb-2 mb-3">Saved Teams</h2>
        
        {isLoading ? (
          <div className="flex justify-center py-4">
            <div className="animate-spin h-6 w-6 border-2 border-[#002654] border-t-transparent rounded-full"></div>
          </div>
        ) : savedTeams && savedTeams.length > 0 ? (
          savedTeams.map((team) => (
            <div 
              key={team.id}
              onClick={() => handleLoadTeam(team)}
              className="saved-team-item p-3 bg-[#F4F4F4] rounded-md mb-2 cursor-pointer hover:bg-gray-200"
            >
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium">{team.name}</div>
                  <div className="text-sm text-gray-600">{team.formation} • Power {team.powerScore}</div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    onClick={(e) => handleDeleteTeam(team.id, e)}
                    className="text-[#ED2939] hover:text-opacity-80"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-500">
            No saved teams yet. Create and save your first team!
          </div>
        )}
      </div>
    </div>
  );
}
