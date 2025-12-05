import React from "react";
import { motion } from "framer-motion";
import { Trophy, User } from "lucide-react";

function MatchCard({ match, round }) {
  const { player1, player2, winner } = match;
  
  return (
    <div className="glass-card rounded-lg overflow-hidden w-48">
      <div className={`p-2 flex items-center gap-2 ${
        winner === player1 ? "bg-emerald-500/20" : winner ? "bg-white/5" : "bg-white/5"
      }`}>
        <User className="w-4 h-4 text-white/40" />
        <span className={`text-sm flex-1 truncate ${
          winner === player1 ? "text-emerald-400 font-medium" : "text-white/70"
        }`}>
          {player1 || "TBD"}
        </span>
        {winner === player1 && <Trophy className="w-3 h-3 text-yellow-400" />}
      </div>
      <div className="h-px bg-white/10" />
      <div className={`p-2 flex items-center gap-2 ${
        winner === player2 ? "bg-emerald-500/20" : winner ? "bg-white/5" : "bg-white/5"
      }`}>
        <User className="w-4 h-4 text-white/40" />
        <span className={`text-sm flex-1 truncate ${
          winner === player2 ? "text-emerald-400 font-medium" : "text-white/70"
        }`}>
          {player2 || "TBD"}
        </span>
        {winner === player2 && <Trophy className="w-3 h-3 text-yellow-400" />}
      </div>
    </div>
  );
}

export default function TournamentBracket({ bracketData }) {
  // Parse bracket data if it's a string
  let rounds = [];
  try {
    if (typeof bracketData === "string") {
      rounds = JSON.parse(bracketData);
    } else if (Array.isArray(bracketData)) {
      rounds = bracketData;
    }
  } catch (e) {
    rounds = [];
  }

  if (!rounds || rounds.length === 0) {
    return (
      <div className="glass-card rounded-xl p-8 text-center">
        <Trophy className="w-12 h-12 text-white/20 mx-auto mb-4" />
        <h3 className="text-white font-semibold mb-2">Bracket não disponível</h3>
        <p className="text-white/40 text-sm">
          O bracket será gerado quando as inscrições forem encerradas
        </p>
      </div>
    );
  }

  const roundNames = ["Oitavas", "Quartas", "Semi", "Final"];

  return (
    <div className="glass-card rounded-xl p-6 overflow-x-auto">
      <h3 className="text-lg font-semibold text-white mb-6">Bracket do Torneio</h3>
      
      <div className="flex gap-8 min-w-max">
        {rounds.map((round, roundIndex) => (
          <div key={roundIndex} className="flex flex-col">
            <div className="text-center mb-4">
              <span className="text-white/60 text-sm font-medium">
                {roundNames[roundIndex] || `Rodada ${roundIndex + 1}`}
              </span>
            </div>
            
            <div 
              className="flex flex-col justify-around flex-1 gap-4"
              style={{ 
                paddingTop: `${Math.pow(2, roundIndex) * 20}px`,
                gap: `${Math.pow(2, roundIndex + 1) * 16}px`
              }}
            >
              {round.matches?.map((match, matchIndex) => (
                <motion.div
                  key={matchIndex}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: roundIndex * 0.1 + matchIndex * 0.05 }}
                >
                  <MatchCard match={match} round={roundIndex} />
                </motion.div>
              ))}
            </div>
          </div>
        ))}

        {/* Winner */}
        {rounds.length > 0 && rounds[rounds.length - 1]?.matches?.[0]?.winner && (
          <div className="flex flex-col justify-center">
            <div className="text-center mb-4">
              <span className="text-yellow-400 text-sm font-medium">🏆 Campeão</span>
            </div>
            <div className="glass-card rounded-lg p-4 bg-gradient-to-r from-yellow-500/20 to-amber-500/10 border-yellow-500/30">
              <div className="flex items-center gap-3">
                <Trophy className="w-6 h-6 text-yellow-400" />
                <span className="text-yellow-400 font-bold">
                  {rounds[rounds.length - 1].matches[0].winner}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple bracket generator from participants
export function generateBracket(participants = []) {
  const shuffled = [...participants].sort(() => Math.random() - 0.5);
  const rounds = [];
  let currentRound = [];

  // Create first round matches
  for (let i = 0; i < shuffled.length; i += 2) {
    currentRound.push({
      player1: shuffled[i]?.name || shuffled[i] || "TBD",
      player2: shuffled[i + 1]?.name || shuffled[i + 1] || "TBD",
      winner: null
    });
  }
  rounds.push({ matches: currentRound });

  // Create subsequent rounds
  let matchCount = currentRound.length;
  while (matchCount > 1) {
    matchCount = Math.ceil(matchCount / 2);
    const nextRound = [];
    for (let i = 0; i < matchCount; i++) {
      nextRound.push({ player1: "TBD", player2: "TBD", winner: null });
    }
    rounds.push({ matches: nextRound });
  }

  return rounds;
}