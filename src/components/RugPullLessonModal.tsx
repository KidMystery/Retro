import React, { useState } from 'react';
import { ScamEncounter, PlayerStats } from '../types';
import { sound } from '../lib/audioEngine';
import { AlertTriangle, ShieldCheck, Skull, BookOpen, Coins, Crown } from 'lucide-react';

interface RugPullLessonModalProps {
  scam: ScamEncounter;
  player: PlayerStats;
  onFallForScam: () => void;
  onRejectScam: () => void;
  onClose: () => void;
}

export const RugPullLessonModal: React.FC<RugPullLessonModalProps> = ({ scam, player, onFallForScam, onRejectScam, onClose }) => {
  const [phase, setPhase] = useState<'PITCH' | 'RUG_PULLED' | 'REJECTED'>('PITCH');

  const handleTakeBait = () => {
    sound.playRugPullExplosion();
    setPhase('RUG_PULLED');
    onFallForScam();
  };

  const handleReject = () => {
    sound.playSecretChime();
    setPhase('REJECTED');
    onRejectScam();
  };

  const canAfford = player.florins >= scam.costFlorins;

  const pathScore = scam.rejectionOutcome.pathScore ? `T+${scam.rejectionOutcome.pathScore.trader||0} I+${scam.rejectionOutcome.pathScore.investor||0}` : '';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 backdrop-blur-sm">
      <div className={`zelda-panel w-full max-w-2xl p-4 max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl border-2 ${
        phase === 'RUG_PULLED' ? 'border-red-500 bg-[#1a0a0a]' : phase === 'REJECTED' ? 'border-emerald-500 bg-[#0a1a0a]' : 'border-purple-500 bg-[#100818]'
      }`}>
        <div className="flex items-center justify-between border-b-2 border-current/30 pb-2 mb-3">
          <div className="flex items-center gap-2">
            {phase === 'RUG_PULLED' ? <Skull className="w-5 h-5 text-red-500 animate-pulse" /> : phase === 'REJECTED' ? <ShieldCheck className="w-5 h-5 text-emerald-400" /> : <AlertTriangle className="w-5 h-5 text-amber-400 animate-bounce" />}
            <div>
              <h2 className="font-cinzel text-base font-bold">{phase === 'RUG_PULLED' ? 'CATASTROPHIC RUG PULL!' : scam.title}</h2>
              <p className="text-[11px] opacity-70">{scam.shillerName} • {scam.shillerTitle} • Path {player.currentPath} • Bond {player.oracleBondLevel?.toFixed(1)}/5</p>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 border rounded font-bold ${scam.scamType === 'PONZI_YIELD' ? 'bg-purple-950 text-purple-300 border-purple-500' : scam.scamType === 'PUMP_AND_DUMP' ? 'bg-amber-950 text-amber-300 border-amber-500' : 'bg-red-950 text-red-300 border-red-500'}`}>{scam.scamType}</span>
        </div>

        {phase === 'PITCH' && (
          <div className="space-y-3">
            <div className="bg-black/60 border border-amber-500/20 p-3 rounded-xl">
              <div className="font-bold text-amber-300 text-sm mb-1">PITCH • Charm Monster Overpromises:</div>
              <p className="text-sm leading-relaxed text-slate-200 italic">"{scam.pitch}"</p>
              <div className="mt-2 p-2 bg-amber-950/20 border border-amber-500/30 rounded-lg text-xs text-amber-200"><strong>Promise:</strong> {scam.promiseText}</div>
              <div className="mt-2 text-[11px] text-slate-500">Cost to fall: {scam.costFlorins}ƒ • Fail Reason: {scam.temptationOutcome.failReason} • Lesson: {scam.temptationOutcome.lessonId}</div>
            </div>

            <div className="bg-sky-950/20 border border-sky-500/30 p-2.5 rounded-xl text-xs text-sky-200">
              <div className="flex items-center gap-1.5 font-bold"><BookOpen className="w-4 h-4" /> Oracle Insight:</div>
              <p className="mt-1">Charm monsters overpromise; sages patient and dry; Liquidation Lord menacing but cautionary tragedy. Never cynical. Check: audited? cash flows? margin of safety? If not, speculation not investment. Fail → Graham loop teaches permanent protection.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button disabled={!canAfford} onClick={handleTakeBait} className={`p-3 border-2 rounded-xl font-bold flex flex-col gap-1 ${canAfford ? 'border-red-500 bg-red-950/30 hover:bg-red-900/50 text-red-200 cursor-pointer' : 'opacity-40 cursor-not-allowed border-slate-700 text-slate-600'}`}>
                <span className="flex items-center gap-1.5"><Skull className="w-4 h-4" /> TAKE BAIT • {scam.costFlorins}ƒ</span>
                <span className="text-[11px] opacity-70">FOMO, greed, 100x dreams • Triggers Sanctuary</span>
              </button>
              <button onClick={handleReject} className="p-3 border-2 border-emerald-500 bg-emerald-950/30 hover:bg-emerald-900/50 text-emerald-200 font-bold rounded-xl flex flex-col gap-1 cursor-pointer">
                <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4" /> REJECT • Demand Tangible Cash Flows</span>
                <span className="text-[11px] opacity-80">Where tangible cash flows originate? I refuse unbacked speculation. +{scam.rejectionOutcome.rewardFlorins}ƒ {pathScore} {scam.rejectionOutcome.protectionGranted ? `+${scam.rejectionOutcome.protectionGranted}` : ''}</span>
              </button>
            </div>

            <button onClick={onClose} className="snes-btn w-full py-2 rounded-xl text-xs">CLOSE • Think: investment vs speculation?</button>
          </div>
        )}

        {phase === 'RUG_PULLED' && (
          <div className="space-y-3">
            <div className="bg-black/80 border-2 border-red-500 p-3 rounded-xl text-red-200">
              <div className="font-bold text-sm mb-1 text-red-400">{scam.temptationOutcome.rugPullHeadline}</div>
              <p className="leading-relaxed text-sm mb-2">{scam.temptationOutcome.storyExplanation}</p>
              <div className="flex items-center gap-2 text-sm font-bold text-red-400 border-t border-red-500/30 pt-2">
                <span>💔 PENALTY: -{scam.temptationOutcome.heartsLost}♥ -{scam.costFlorins}ƒ • Fail → Graham loop active!</span>
              </div>
            </div>
            <div className="bg-amber-950/20 border-2 border-amber-400 p-3 rounded-xl text-amber-200 space-y-2">
              <div className="flex items-center gap-2 font-bold text-amber-300"><BookOpen className="w-4 h-4" /> LESSON FROM INTELLIGENT INVESTOR:</div>
              <div className="text-[11px] opacity-70">{scam.temptationOutcome.chapterReference}</div>
              <p className="italic text-sm leading-relaxed border-l-4 border-amber-400 pl-2">{scam.temptationOutcome.intelligentInvestorLesson}</p>
              <div className="text-[11px] text-sky-300">Protection to unlock: {scam.temptationOutcome.lessonId} • Permanent, cannot be held hostage again</div>
            </div>
            <button onClick={onClose} className="snes-btn-primary w-full py-2.5 bg-red-600 text-white rounded-xl">INTERNALIZE LESSON & ENTER SANCTUARY • Fail to Learn</button>
          </div>
        )}

        {phase === 'REJECTED' && (
          <div className="space-y-3">
            <div className="bg-black/80 border-2 border-emerald-500 p-3 rounded-xl text-emerald-200">
              <div className="font-bold text-sm mb-1 text-emerald-400 flex items-center gap-2"><ShieldCheck className="w-5 h-5" /> FRAUD DETECTED & THWARTED! • Discipline Rewarded</div>
              <p className="leading-relaxed text-sm mb-2">{scam.rejectionOutcome.response}</p>
              <p className="font-bold text-amber-300 text-sm">{scam.rejectionOutcome.rewardWisdom}</p>
              <div className="flex flex-wrap gap-2 text-sm font-bold text-amber-300 border-t border-emerald-500/30 pt-2 mt-2">
                <span className="flex items-center gap-1"><Coins className="w-4 h-4" />+{scam.rejectionOutcome.rewardFlorins}ƒ Bounty</span>
                {pathScore && <span className="px-2 py-0.5 bg-slate-800 border border-amber-500/20 rounded text-xs">{pathScore} Path</span>}
                {scam.rejectionOutcome.protectionGranted && <span className="px-2 py-0.5 bg-sky-950 border border-sky-500/30 text-sky-300 rounded text-xs flex items-center gap-1"><Crown className="w-3 h-3" />+{scam.rejectionOutcome.protectionGranted} Protection Permanent</span>}
              </div>
            </div>
            <button onClick={onClose} className="snes-btn-primary w-full py-2.5 bg-emerald-600 text-black rounded-xl">CONTINUE WITH DISCIPLINE • Oracle Bond +0.15</button>
          </div>
        )}
      </div>
    </div>
  );
};
