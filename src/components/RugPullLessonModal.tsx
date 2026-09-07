import React, { useState } from 'react';
import { ScamEncounter, PlayerStats } from '../types';
import { sound } from '../lib/audioEngine';
import { TrendingUp, BookOpen, Coins, Crown, Wallet, Flame } from 'lucide-react';
import scammerSpriteUrl from '../assets/sprites/scammer.png';

interface RugPullLessonModalProps {
  scam: ScamEncounter;
  player: PlayerStats;
  onFallForScam: () => void;
  onRejectScam: () => void;
  onClose: () => void;
}

/**
 * UX FIX (principal bug report): the wrong choice must NOT be pre-cued red.
 * Real scams lure: the "invest" path is styled as the attractive, legitimate,
 * green-lit opportunity with loud trust claims; the tell lives in unstyled fine
 * print. Some scams even pay out early before rugging — that is how real
 * victims are made. Only AFTER the rug does the UI turn red.
 */
export const RugPullLessonModal: React.FC<RugPullLessonModalProps> = ({ scam, player, onFallForScam, onRejectScam, onClose }) => {
  const [phase, setPhase] = useState<'PITCH' | 'EARLY_WIN' | 'RUG_PULLED' | 'REJECTED'>('PITCH');

  const handleDeposit = () => {
    sound.playSecretChime();
    if (scam.earlyWin) {
      setPhase('EARLY_WIN');
    } else {
      rugIt();
    }
  };

  const rugIt = () => {
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

  const typeBadgeClass = 'bg-sky-950 text-sky-300 border-sky-500';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 backdrop-blur-sm">
      <div className={`zelda-panel w-full max-w-2xl p-4 max-h-[92vh] overflow-y-auto rounded-xl shadow-2xl border-2 ${
        phase === 'RUG_PULLED' ? 'border-red-500 bg-[#1a0a0a]' : phase === 'REJECTED' ? 'border-emerald-500 bg-[#0a1a0a]' : 'border-purple-500 bg-[#100818]'
      }`}>
        <div className="flex items-center justify-between border-b-2 border-current/30 pb-2 mb-3">
          <div className="flex items-center gap-2">
            {phase === 'RUG_PULLED' ? <Flame className="w-5 h-5 text-red-500 animate-pulse" /> : phase === 'REJECTED' ? <Crown className="w-5 h-5 text-emerald-400" /> : <Coins className="w-5 h-5 text-amber-300" />}
            <div>
              <h2 className="font-cinzel text-base font-bold">{phase === 'RUG_PULLED' ? 'CATASTROPHIC RUG PULL!' : phase === 'EARLY_WIN' ? 'POSITION UP BIG!' : scam.title}</h2>
              <p className="text-[11px] opacity-70">{scam.shillerName} • {scam.shillerTitle} • Path {player.currentPath} • Bond {player.oracleBondLevel?.toFixed(1)}/5</p>
            </div>
          </div>
          <span className={`text-[10px] px-2 py-0.5 border rounded font-bold ${typeBadgeClass}`}>{scam.scamType}</span>
        </div>

        {phase === 'PITCH' && (
          <div className="space-y-3">
            <div className="bg-black/60 border border-amber-500/20 p-3 rounded-xl">
              <div className="flex gap-3 items-start">
                <img src={scammerSpriteUrl} alt={scam.shillerName} className="w-20 h-20 shrink-0 rounded-lg border-2 border-purple-500/50 bg-black/60 object-contain" style={{ imageRendering: 'pixelated' }} />
                <div className="flex-1">
                  <div className="font-bold text-amber-300 text-sm mb-1">PITCH • {scam.shillerName}:</div>
                  <p className="text-sm leading-relaxed text-slate-200 italic">"{scam.pitch}"</p>
                </div>
              </div>
            </div>

            {/* Trust signals — loud, green, confident. This is the lure. */}
            {scam.legitimacyClaims && scam.legitimacyClaims.length > 0 && (
              <div className="bg-emerald-950/30 border border-emerald-500/40 p-2.5 rounded-xl space-y-1">
                <div className="text-[11px] font-bold text-emerald-300 tracking-wide uppercase">Why {scam.shillerName.split(' ')[0]} is trusted:</div>
                {scam.legitimacyClaims.map((claim, i) => (
                  <div key={i} className="text-xs text-emerald-200 flex items-start gap-1.5">{claim}</div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* INVEST: styled as the attractive opportunity. No red. No skull. No warning. */}
              <button disabled={!canAfford} onClick={handleDeposit} className={`p-3 border-2 rounded-xl font-bold flex flex-col gap-1 ${canAfford ? 'border-emerald-500 bg-gradient-to-b from-emerald-900/60 to-emerald-950/60 hover:from-emerald-800/70 hover:to-emerald-900/70 text-emerald-100 cursor-pointer shadow-[0_0_12px_rgba(16,185,129,0.25)]' : 'opacity-40 cursor-not-allowed border-slate-700 text-slate-600'}`}>
                <span className="flex items-center gap-1.5 text-base"><TrendingUp className="w-4 h-4 text-emerald-400" /> INVEST • {scam.costFlorins}ƒ</span>
                <span className="text-[11px] text-emerald-300/90">{scam.promiseText}</span>
              </button>
              {/* DECLINE: deliberately plain. No green reward preview, no shield, no cue. */}
              <button onClick={handleReject} className="p-3 border-2 border-slate-600 bg-slate-900/40 hover:bg-slate-800/60 text-slate-300 font-bold rounded-xl flex flex-col gap-1 cursor-pointer">
                <span className="flex items-center gap-1.5"><Wallet className="w-4 h-4" /> DECLINE POLITELY</span>
                <span className="text-[11px] opacity-70">Keep your florins. Walk away from the desk.</span>
              </button>
            </div>

            {/* Fine print — the tells are HERE, subtle and unstyled, exactly like real prospectuses. */}
            {scam.subtleTells && scam.subtleTells.length > 0 && (
              <div className="text-[9.5px] leading-relaxed text-slate-500/80 pt-1 border-t border-slate-800">
                <span className="uppercase tracking-wider">Disclosures: </span>
                {scam.subtleTells.join(' · ')} · Terms subject to change without notice. Past performance is not indicative of future results. Yields are not guaranteed regardless of any statement to the contrary above.
              </div>
            )}

            <button onClick={onClose} className="snes-btn w-full py-2 rounded-xl text-xs">CLOSE</button>
          </div>
        )}

        {phase === 'EARLY_WIN' && scam.earlyWin && (
          <div className="space-y-3">
            <div className="bg-black/70 border-2 border-emerald-500 p-3 rounded-xl text-emerald-200">
              <div className="font-bold text-sm mb-1 text-emerald-400 flex items-center gap-2"><TrendingUp className="w-5 h-5" /> YOU'RE UP +{Math.round((scam.earlyWin.florinsGained / scam.costFlorins) * 100)}% • {scam.earlyWin.florinsGained}ƒ UNREALIZED GAIN</div>
              <p className="leading-relaxed text-sm mb-2">{scam.earlyWin.storyText}</p>
              <div className="text-xs text-emerald-300/80">Balance shown on screen: {scam.costFlorins + scam.earlyWin.florinsGained}ƒ</div>
            </div>
            {/* Both exits rug — but neither is colored as a trap. */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button onClick={rugIt} className="p-3 border-2 border-amber-500 bg-gradient-to-b from-amber-900/60 to-amber-950/60 hover:from-amber-800/70 text-amber-100 font-bold rounded-xl flex flex-col gap-1 cursor-pointer">
                <span className="flex items-center gap-1.5"><Flame className="w-4 h-4 text-amber-400" /> COMPOUND • Reinvest All</span>
                <span className="text-[11px] opacity-80">"Whales are entering. Don't get left behind."</span>
              </button>
              <button onClick={rugIt} className="p-3 border-2 border-emerald-500 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-100 font-bold rounded-xl flex flex-col gap-1 cursor-pointer">
                <span className="flex items-center gap-1.5"><Coins className="w-4 h-4" /> WITHDRAW PROFITS</span>
                <span className="text-[11px] opacity-80">Take the win. Cash out {scam.costFlorins + scam.earlyWin.florinsGained}ƒ.</span>
              </button>
            </div>
            <div className="text-[9.5px] text-slate-500/80 border-t border-slate-800 pt-1">Withdrawals process in the order received. Epoch queue position: 41,208.</div>
          </div>
        )}

        {phase === 'RUG_PULLED' && (
          <div className="space-y-3">
            <div className="bg-black/80 border-2 border-red-500 p-3 rounded-xl text-red-200">
              <div className="font-bold text-sm mb-1 text-red-400">{scam.temptationOutcome.rugPullHeadline}</div>
              <p className="leading-relaxed text-sm mb-2">{scam.temptationOutcome.storyExplanation}</p>
              {scam.earlyWin && (
                <p className="leading-relaxed text-sm mb-2 text-amber-300/90 border-l-4 border-amber-500/50 pl-2">The early "profit" was the bait — numbers on a dashboard the operator controls. Real victims are made precisely here: a small win first, trust established, then the rug.</p>
              )}
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
              <div className="font-bold text-sm mb-1 text-emerald-400 flex items-center gap-2"><Crown className="w-5 h-5" /> YOU ASKED THE ONE QUESTION • Discipline Rewarded</div>
              <p className="leading-relaxed text-sm mb-2">{scam.rejectionOutcome.response}</p>
              {scam.subtleTells && scam.subtleTells.length > 0 && (
                <div className="text-xs text-sky-300/90 mb-2 border-l-4 border-sky-500/50 pl-2">
                  The tells were there: {scam.subtleTells[0].toLowerCase()}.
                </div>
              )}
              <p className="font-bold text-amber-300 text-sm">{scam.rejectionOutcome.rewardWisdom}</p>
              <div className="flex flex-wrap gap-2 text-sm font-bold text-amber-300 border-t border-emerald-500/30 pt-2 mt-2">
                <span className="flex items-center gap-1"><Coins className="w-4 h-4" />+{scam.rejectionOutcome.rewardFlorins}ƒ Bounty</span>
                {pathScore && <span className="px-2 py-0.5 bg-slate-800 border border-amber-500/20 rounded text-xs">{pathScore} Path</span>}
                {scam.rejectionOutcome.protectionGranted && <span className="px-2 py-0.5 bg-sky-950 border border-sky-500/30 text-sky-300 rounded text-xs flex items-center gap-1"><Crown className="w-3 h-2.5" />+{scam.rejectionOutcome.protectionGranted} Protection Permanent</span>}
              </div>
            </div>
            <button onClick={onClose} className="snes-btn-primary w-full py-2.5 bg-emerald-600 text-black rounded-xl">CONTINUE WITH DISCIPLINE • Oracle Bond +0.15</button>
          </div>
        )}
      </div>
    </div>
  );
};
