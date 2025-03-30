import { useTeam } from "@/context/TeamContext";
import { Formation } from "@shared/schema";
import PlayerCard from "./PlayerCard";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";

interface SoccerFieldViewProps {
  formation: Formation | null;
}

export default function SoccerFieldView({ formation }: SoccerFieldViewProps) {
  const { toast } = useToast();
  const { playerPositions, autoFillTeam, resetTeam } = useTeam();

  const handleAutoFill = () => {
    autoFillTeam();
    toast({
      title: "Team auto-filled",
      description: "Team has been automatically filled with the best available players.",
    });
  };

  const handleReset = () => {
    resetTeam();
    toast({
      title: "Team reset",
      description: "All player selections have been cleared.",
    });
  };

  return (
    <div className="w-full lg:w-2/4">
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="font-montserrat font-semibold text-lg border-b border-gray-200 pb-2 mb-3">Formation View</h2>
        
        <div 
          className="soccer-field rounded-lg h-[300px] sm:h-[400px] md:h-[500px] relative"
          style={{
            background: "radial-gradient(circle, #65a54e, #4a8d3a)",
            backgroundSize: "100% 100%",
            backgroundRepeat: "no-repeat",
            position: "relative",
          }}
        >
          {/* Field lines */}
          <div 
            className="field-lines absolute inset-0 rounded-lg"
            style={{
              backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 1000 600'><path d='M500,0 L500,600 M0,300 L1000,300 M150,300 a150,150 0 0,0 300,0 a150,150 0 0,0 -300,0 M550,300 a150,150 0 0,0 300,0 a150,150 0 0,0 -300,0 M0,50 L0,550 L1000,550 L1000,50 Z' stroke='rgba(255,255,255,0.6)' fill='none' stroke-width='3'/></svg>")`,
              backgroundSize: "100% 100%",
              backgroundRepeat: "no-repeat",
            }}
          />

          {/* Player positions */}
          {formation && formation.positions.map((position) => {
            const playerPosition = playerPositions.find(pp => pp.positionId === position.id);
            return (
              <div
                key={position.id}
                className="player-slot absolute"
                style={{
                  left: position.left,
                  top: position.top,
                  transform: "translate(-50%, -50%)",
                }}
                data-position={position.position}
              >
                <PlayerCard
                  positionId={position.id}
                  playerId={playerPosition?.playerId}
                  position={position.position}
                />
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center mt-4 space-x-2">
          <button 
            onClick={handleAutoFill}
            className="bg-[#002654] hover:bg-opacity-90 text-white px-4 py-2 rounded-md font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 inline"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 00-1 1v5H4a1 1 0 000 2h5v5a1 1 0 102 0v-5h5a1 1 0 100-2h-5V4a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            Auto-Fill
          </button>
          <button 
            onClick={handleReset}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-md font-medium"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1 inline"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
