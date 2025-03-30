import { useLocation } from "wouter";
import { useTeam } from "@/context/TeamContext";
import { useQuery } from "@tanstack/react-query";
import { calculateTeamPowerStats } from "@/lib/calculatePower";
import { Team } from "@shared/schema";

export default function TeamComparison() {
  const [, setLocation] = useLocation();
  const { currentTeam } = useTeam();
  
  const { data: teams, isLoading } = useQuery<Team[]>({
    queryKey: ['/api/teams'],
  });

  const handleReturnToBuilder = () => {
    setLocation("/");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <div className="animate-spin h-10 w-10 border-4 border-[#002654] border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-[#333333]">Chargement des comparaisons d'équipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4] text-[#333333] flex flex-col">
      {/* Header */}
      <header className="bg-[#002654] text-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-[#ED2939]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
              />
            </svg>
            <h1 className="font-montserrat text-xl font-bold">Créateur d'Équipe Française</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="font-montserrat font-semibold text-xl mb-4">Comparaison d'Équipes</h2>
          
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Current team */}
            {currentTeam && (
              <div className="comparison-team-card flex-1 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#002654] text-white p-3">
                  <h3 className="font-montserrat font-semibold">Équipe Actuelle</h3>
                  <div className="flex justify-between items-center">
                    <span>{currentTeam.formation}</span>
                    <div className="flex items-center">
                      <span className="mr-1">Puissance:</span>
                      <span className="font-bold">{currentTeam.powerScore}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="soccer-field rounded-lg h-[300px] relative bg-gradient-radial from-[#65a54e] to-[#4a8d3a] bg-no-repeat bg-cover">
                    {/* Mini soccer field - simplified for comparison view */}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {calculateTeamPowerStats(currentTeam).map((stat) => (
                      <div key={stat.name} className="flex justify-between items-center p-2 bg-[#F4F4F4] rounded">
                        <span className="text-sm">{stat.name}</span>
                        <div className="bg-[#002654] h-2 w-20 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#ED2939] h-full" 
                            style={{ width: `${stat.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            {/* Saved teams */}
            {teams && teams.slice(0, 2).map((team) => (
              <div key={team.id} className="comparison-team-card flex-1 border border-gray-200 rounded-lg overflow-hidden">
                <div className="bg-[#002654] text-white p-3">
                  <h3 className="font-montserrat font-semibold">{team.name}</h3>
                  <div className="flex justify-between items-center">
                    <span>{team.formation}</span>
                    <div className="flex items-center">
                      <span className="mr-1">Puissance:</span>
                      <span className="font-bold">{team.powerScore}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-3">
                  <div className="soccer-field rounded-lg h-[300px] relative bg-gradient-radial from-[#65a54e] to-[#4a8d3a] bg-no-repeat bg-cover">
                    {/* Mini soccer field - simplified for comparison view */}
                  </div>
                  
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {calculateTeamPowerStats(team).map((stat) => (
                      <div key={stat.name} className="flex justify-between items-center p-2 bg-[#F4F4F4] rounded">
                        <span className="text-sm">{stat.name}</span>
                        <div className="bg-[#002654] h-2 w-20 rounded-full overflow-hidden">
                          <div 
                            className="bg-[#ED2939] h-full" 
                            style={{ width: `${stat.value}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 flex justify-center">
            <button 
              onClick={handleReturnToBuilder}
              className="bg-[#002654] hover:bg-opacity-90 text-white px-4 py-2 rounded-md font-medium"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 inline"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Retourner au Créateur
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
