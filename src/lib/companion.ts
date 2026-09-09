/**
 * WREN — the Oracle's Ledger given voice.
 * Soul-pass companion: accompanies Rowan, COMMENTS on trades, has opinions,
 * disagrees with dangerous positions, and REMEMBERS (seeded from persistent
 * player state: scamsFallen, failedTrades, grahamProtections, path scores —
 * so her memory survives saves and NG+ for free).
 *
 * Design rule (from tests/design-review.md): no new quiz, no new HP bar.
 * Wren reacts to what the player already did, in one or two lines.
 */

export interface WrenContext {
  day: number;
  marketPhase: string;
  iv: number;
  spot: number;
  path: string;
  scamsFallen: string[];
  scamsAvoided: string[];
  failedTrades: number;
  successfulTrades: number;
  protections: string[];
  ngPlus?: boolean;
  positionCount?: number;
  marginUsed?: number;
}

export type WrenEvent =
  | { kind: 'trade'; strategy: string; premium: number; kellyOk: boolean; quantity: number; dte: number; strike: number; spot: number }
  | { kind: 'tradeClosed'; pnl: number; strategy: string }
  | { kind: 'scamFell'; title: string }
  | { kind: 'scamRejected'; title: string }
  | { kind: 'dayAdvance'; phase: string }
  | { kind: 'bossFall'; boss: string; act: number }
  | { kind: 'sanctuary'; lessonId: string }
  | { kind: 'combatLoss' }
  | { kind: 'dungeonEnter'; act: number }
  | { kind: 'liquidation' }
  | { kind: 'firstMeet' };

const pick = <T,>(arr: T[], seed: number): T => arr[Math.abs(seed) % arr.length];
const hash = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return h;
};

/** One Wren line per event. Returns null when she stays quiet (silence is a voice too). */
export function wrenLine(event: WrenEvent, ctx: WrenContext): string | null {
  const seed = hash(JSON.stringify(event) + ctx.day);
  const fellBefore = ctx.scamsFallen.length;
  const winStreak = Math.max(0, ctx.successfulTrades - ctx.failedTrades);

  switch (event.kind) {
    case 'firstMeet':
      return 'Wren: "The storehouse ledger shows an empty granary and a debt marked PAID IN A TOKEN THAT NO LONGER EXISTS. I have corrected the entry. Walk east, Rowan — the Ashen Acre teaches what the Rug-Pull cost. I will keep the books."';

    case 'trade': {
      const isNaked = event.strategy === 'LONG_CALL' || event.strategy === 'LONG_PUT';
      const isDefinedRisk = ['BULL_CALL_SPREAD', 'BEAR_PUT_SPREAD', 'IRON_CONDOR', 'CALENDAR_SPREAD'].includes(event.strategy);
      const farDte = event.dte >= 45;
      if (isNaked && ctx.iv > 0.55) {
        return pick([
          'Wren: "At this IV you are buying fire at arson prices. I am writing my objection into the margin."',
          'Wren: "You know the Hydra breathes on contracts like these. I disagree — noted, and on the record."'
        ], seed);
      }
      if (isNaked && event.dte <= 7 && Math.abs(event.strike - event.spot) > 8) {
        return 'Wren: "A lottery ticket. I have seen this exact trade ruin three kingdoms. But it is your florin — this once."';
      }
      if (!event.kellyOk) {
        return 'Wren: "Kelly flinched. That position is larger than your edge justifies. I will hold my tongue only until it hurts."';
      }
      if (isDefinedRisk) {
        return pick([
          'Wren: "Both legs. Defined risk. Now THAT is a structure I would sign my name to."',
          'Wren: "A spread. You are beginning to think in shapes instead of directions. Good."'
        ], seed);
      }
      if (farDte && !isNaked) return 'Wren: "Time on your side for once. Even the Chrono-Sphinx respects a long DTE."';
      return pick([
        'Wren: "Booked. I have logged it beside your others — the pattern is yours to read."',
        'Wren: "Hmm. Not what I would have chosen. But not wrong enough to argue about. Yet."'
      ], seed);
    }

    case 'tradeClosed': {
      if (event.pnl < 0) {
        return fellBefore > 0
          ? 'Wren: "A loss. Remember the Goblin? This is that same ache wearing a suit. Do not chase it."'
          : pick([
              'Wren: "It will heal. Fail is the tuition here — I only ask that you actually pay attention in class."',
              'Wren: "One loss is data. Two is a pattern. Three is a biography you do not want."'
            ], seed);
      }
      if (winStreak >= 3) return 'Wren: "Three clean closes in a row. I did not say it aloud, but I was worried. Slightly."';
      return pick([
        'Wren: "A win I approve of. Try to end the day richer than the market expected you to be."',
        'Wren: "Noted in the ledger, in nice handwriting. Keep earning the nice handwriting."'
      ], seed);
    }

    case 'scamFell':
      return `Wren: "${event.title}. I flagged the tells. I said nothing louder because you would not have listened — and now you will never forget. That, apparently, is how you learn."`;

    case 'scamRejected': {
      if (ctx.scamsAvoided.length === 1) return `Wren: "${event.title} — and you walked away. First time a keeper has impressed me. It will not be the last, if you keep this up."`;
      return pick([
        `Wren: "Another charm monster walks away hungry. ${fellBefore > 0 ? 'You were not always this sharp — I remember.' : 'Discipline looks like this.'}"`,
        'Wren: "Declined. The best trade of most days, as it turns out."'
      ], seed);
    }

    case 'dayAdvance':
      if (event.phase === 'crash') return 'Wren: "The sky is falling. Again. This is the part where the frightened sell to the patient. Do not be the frightened."';
      if (event.phase === 'euphoria') return 'Wren: "Everyone is a genius today. Enjoy it — and notice that I said today."';
      if (event.phase === 'decline') return 'Wren: "The tide is going out. Check who is swimming naked. Preferably from behind glass."';
      if (event.phase === 'recovery') return 'Wren: "Green shoots. The market forgives, Wren remembers. Place your feet carefully."';
      return pick(['Wren: "Sideways. The disciplined earn while the restless starve. You know which one I am rooting for."', 'Wren: "Nothing is happening. Nothing happening is a strategy, if you sold premium."'], seed);

    case 'bossFall': {
      const bossLines: { [k: string]: string } = {
        bear: 'Wren: "The Bear of Drawdowns falls. It only ever hunts the unhedged. Wear your put like a coat next winter."',
        sphinx: 'Wren: "The Chrono-Sphinx, out-patience-ed. Somewhere, an OTM ticket just expired worthless — and it was not yours."',
        crab: 'Wren: "The Crab Golem cracked. You made money while nothing moved. I have waited three acts to say: told you."',
        hydra: 'Wren: "The Hydra of Implied Vega, beheaded. You bought your shield while everyone else was on fire. That was the whole lesson."',
        vex: 'Wren: "Vex kneels. He once taught margin of safety, you know. Be careful — the crown is heavier than it looks, and I will be watching how you carry it."'
      };
      const key = ['bear', 'sphinx', 'crab', 'hydra', 'vex'][event.act - 1] || 'vex';
      return bossLines[key] || 'Wren: "A guardian falls. The ledger and I both keep the score."';
    }

    case 'sanctuary':
      return `Wren: "The Sanctuary again. ${ctx.protections.length > 2 ? 'You are collecting these lessons like runes — because they are runes.' : 'It only costs a scar the first time. Try to make each scar count."'}`;

    case 'combatLoss':
      return pick(['Wren: "That will leave a mark. Breathe. The shield exists for exactly this turn."', 'Wren: "Wrong thesis, not wrong person. Answer the next riddle like someone who read the last one."'], seed);

    case 'dungeonEnter': {
      const dungeonNames: { [k: number]: string } = {
        1: 'The Sealed Vestibule. Mind the walls — and the chart rooms.',
        2: 'The Two Chambers. Two legs, one spread. The gates will not accept half a thesis.',
        3: 'The Iron Halls. Walkers on patrol. Stay behind their eyes, and they stay behind their desks.',
        4: 'The Lightless Vaults. Your torch is Vega — spend it wisely, refuel before you are blind.',
        5: 'The Gauntlet. Everything you beat, again, in order. I will wait at the end with Vex.'
      };
      return `Wren: "${dungeonNames[event.act] || 'Down we go. '}${ctx.ngPlus ? ' The second cycle makes it darker. I am still here.' : ''}"`;
    }

    case 'liquidation':
      return 'Wren: "LIQUIDATION. I removed my hand from the ledger so you would feel the desk shake. Leverage was never your friend — it was your landlord."';

    default:
      return null;
  }
}

/** Ambient idle lines for the overworld — low frequency, no event needed. */
export function wrenIdle(ctx: WrenContext): string | null {
  const lines: string[] = [];
  if (ctx.marginUsed && ctx.marginUsed > 0) lines.push('Wren: "You are on margin. I can hear the interest ticking. So can the broker."');
  if (ctx.positionCount === 0) lines.push('Wren: "Cash is a position. The quietest one. Do not let anyone tell you it is cowardice."');
  if (ctx.ngPlus) lines.push('Wren: "Second cycle. The market remembers what you did — and so do I. That shadow wearing your face: do not trade like it."');
  if (ctx.failedTrades > ctx.successfulTrades) lines.push('Wren: "More failures than wins so far. Good — you are still in school. The diploma is a positive ledger."');
  if (lines.length === 0) lines.push('Wren: "The Grove is quiet. Quiet markets breed the bravest fools — stay fond of your florins."');
  return pick(lines, ctx.day * 7 + ctx.failedTrades);
}
