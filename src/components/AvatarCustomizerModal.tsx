import React, { useState } from 'react';
import { PlayerStats, TunicColor, HairColor, AvatarConfig } from '../types';
import { sound } from '../lib/audioEngine';
import { Shield, Sparkles, Check, User, Wand2, X } from 'lucide-react';

type AvatarPropsOld = {
  player: PlayerStats;
  onSaveProfile: (name: string, title: string, avatar: AvatarConfig) => void;
  onClose: () => void;
};
type AvatarPropsNew = {
  currentName: string;
  currentTitle: string;
  currentAvatar?: AvatarConfig;
  onSave: (name: string, title: string, avatar: AvatarConfig) => void;
  onClose: () => void;
};
type Props = AvatarPropsOld | AvatarPropsNew;

const TUNIC_OPTIONS: { id: TunicColor; name: string; hex: string; desc: string }[] = [
  { id: 'green', name: "Kokiri Emerald", hex: '#2e7d32', desc: 'Classic Hero green tunic' },
  { id: 'blue', name: "Zora Blue Mail", hex: '#1e40af', desc: 'Sapphire tunic volatility shield' },
  { id: 'red', name: "Goron Red Mail", hex: '#b91c1c', desc: 'Crimson mail dragon fortitude' },
  { id: 'purple', name: "Royal Amethyst", hex: '#7e22ce', desc: 'Mystic purple Value Oracles' },
  { id: 'black', name: "Shadow Knight", hex: '#1f2937', desc: 'Obsidian mail nocturnal trading' }
];
const HAIR_OPTIONS: { id: HairColor; name: string; hex: string }[] = [
  { id: 'blonde', name: 'Hylian Gold', hex: '#facc15' },
  { id: 'brown', name: 'Chestnut Brown', hex: '#78350f' },
  { id: 'black', name: 'Raven Black', hex: '#111827' },
  { id: 'white', name: 'Silver Wisdom', hex: '#e2e8f0' }
];
const TITLE_OPTIONS = ['Hero of Valuaria', 'Knight of the Margin of Safety', 'Oracle of Option Greeks', 'Apprentice of the Black-Scholes', 'Guardian of Fair Value'];

export const AvatarCustomizerModal: React.FC<Props> = (props: any) => {
  const isNew = 'currentName' in props;
  const initialName = isNew ? props.currentName : props.player?.name || 'Valen';
  const initialTitle = isNew ? props.currentTitle : props.player?.title || 'Hero of Valuaria';
  const initialAvatar: AvatarConfig = isNew ? props.currentAvatar : props.player?.avatar;

  const [heroName, setHeroName] = useState(initialName);
  const [selectedTitle, setSelectedTitle] = useState(initialTitle);
  const [tunicColor, setTunicColor] = useState<TunicColor>(initialAvatar?.tunicColor || 'green');
  const [hairColor, setHairColor] = useState<HairColor>(initialAvatar?.hairColor || 'blonde');
  const [shieldStyle, setShieldStyle] = useState<'wooden'|'hylian'|'mirror'>(initialAvatar?.shieldStyle || 'hylian');

  const handleSave = () => {
    sound.playHeartContainer();
    const avatar: AvatarConfig = { tunicColor, hairColor, shieldStyle, avatarTitle: selectedTitle };
    if (isNew) props.onSave(heroName.trim()||'Valen', selectedTitle, avatar);
    else props.onSaveProfile(heroName.trim()||'Valen', selectedTitle, avatar);
    props.onClose();
  };

  const getTunicHex = (t: TunicColor) => TUNIC_OPTIONS.find(x=>x.id===t)?.hex || '#2e7d32';
  const getHairHex = (h: HairColor) => HAIR_OPTIONS.find(x=>x.id===h)?.hex || '#facc15';

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
      <div className="oracle-bottom-sheet w-full max-w-2xl max-h-[92vh] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b-2 border-amber-500/30 bg-gradient-to-r from-slate-900 to-[#1a2744]">
          <div className="flex items-center gap-2.5">
            <div className="oracle-glyph w-8 h-8"><Sparkles className="w-4 h-4 text-amber-400 animate-pulse" /></div>
            <div>
              <h2 className="font-cinzel text-base text-amber-200">HERO OF VALUARIA: PROFILE • Oracle Bonded</h2>
              <p className="text-[11px] text-slate-400">Choose name, appearance, heraldry • Path same crown • Fail→Learn permanent</p>
            </div>
          </div>
          <button onClick={props.onClose} className="snes-btn p-2 rounded-lg"><X className="w-4 h-4" /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 md:grid-cols-12 gap-5 bg-gradient-to-b from-[#121a2e] to-[#0a0e1d]">
          <div className="md:col-span-4 flex flex-col items-center p-4 bg-slate-900/80 border-2 border-amber-500/20 rounded-xl">
            <span className="text-[11px] font-bold text-amber-300 uppercase mb-2">Sprite Preview • SNES</span>
            <div className="w-32 h-36 bg-emerald-950/30 border-2 border-amber-400/50 rounded-xl flex items-center justify-center relative shadow-inner">
              <svg width="84" height="96" viewBox="0 0 28 32" className="pixelated drop-shadow-md">
                <ellipse cx="14" cy="30" rx="9" ry="2" fill="rgba(0,0,0,0.5)" />
                <rect x="9" y="26" width="4" height="4" fill="#5c3a21" />
                <rect x="15" y="26" width="4" height="4" fill="#5c3a21" />
                <rect x="8" y="14" width="12" height="12" fill={getTunicHex(tunicColor)} />
                <polygon points="8,14 14,20 20,14" fill="#000" opacity="0.15" />
                <rect x="8" y="21" width="12" height="2.5" fill="#78350f" />
                <rect x="12.5" y="21" width="3" height="2.5" fill="#facc15" />
                <rect x="5" y="14" width="3" height="7" fill={getTunicHex(tunicColor)} />
                <rect x="20" y="14" width="3" height="7" fill={getTunicHex(tunicColor)} />
                {shieldStyle==='wooden' && <rect x="3" y="15" width="4" height="9" fill="#92400e" stroke="#451a03" strokeWidth="0.5" />}
                {shieldStyle==='hylian' && <g><path d="M 3 15 L 7 15 L 7 22 L 5 24 L 3 22 Z" fill="#2563eb" stroke="#d97706" strokeWidth="0.5" /><polygon points="5,17 6,19 4,19" fill="#facc15" /></g>}
                {shieldStyle==='mirror' && <rect x="3" y="15" width="4" height="9" fill="#e2e8f0" stroke="#38bdf8" strokeWidth="0.5" />}
                <rect x="22" y="13" width="2" height="11" fill="#cbd5e1" />
                <rect x="21" y="12" width="4" height="2" fill="#facc15" />
                <rect x="10" y="7" width="8" height="7" fill="#fed7aa" />
                <rect x="11.5" y="9.5" width="1.5" height="1.5" fill="#0f172a" />
                <rect x="15" y="9.5" width="1.5" height="1.5" fill="#0f172a" />
                <rect x="9" y="8" width="1.5" height="4" fill={getHairHex(hairColor)} />
                <rect x="17.5" y="8" width="1.5" height="4" fill={getHairHex(hairColor)} />
                <rect x="8.5" y="4" width="11" height="4" fill={getTunicHex(tunicColor)} />
                <polygon points="8.5,4 14,0 19.5,4" fill={getTunicHex(tunicColor)} />
                <polygon points="14,0 21,3 18,5" fill={getTunicHex(tunicColor)} />
              </svg>
            </div>
            <div className="mt-3 text-center"><span className="font-bold text-amber-300 text-sm">{heroName}</span><p className="text-[11px] text-slate-400">{selectedTitle}</p></div>
          </div>

          <div className="md:col-span-8 space-y-4">
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Hero's Name</label>
              <div className="flex gap-2">
                <input type="text" value={heroName} onChange={e=>setHeroName(e.target.value.slice(0,16))} placeholder="Enter Hero Name..." className="flex-1 bg-slate-900 border-2 border-amber-500/50 p-2 text-sm text-amber-200 font-bold focus:outline-none focus:border-amber-400 rounded-xl" maxLength={16} />
                <button type="button" onClick={()=>{ const names=['Valen','Link','Robin','Arthur','Valeria','Solomon','Aurelius','Lyra']; const pick=names[Math.floor(Math.random()*names.length)]; setHeroName(pick); sound.playKeyClick(); }} className="snes-btn px-3 py-1.5 text-xs rounded-xl flex items-center gap-1"><Wand2 className="w-3.5 h-3.5" /><span>Random</span></button>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1">Order & Title</label>
              <select value={selectedTitle} onChange={e=>setSelectedTitle(e.target.value)} className="w-full bg-slate-900 border-2 border-amber-500/30 p-2 text-xs text-amber-100 font-bold rounded-xl">
                {TITLE_OPTIONS.map(t=><option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1.5">Tunic & Mail Armor</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TUNIC_OPTIONS.map(opt=>(
                  <button key={opt.id} type="button" onClick={()=>{ setTunicColor(opt.id); sound.playKeyClick(); }} className={`p-2 border-2 rounded-xl text-left flex items-center gap-2.5 transition-colors cursor-pointer ${tunicColor===opt.id?'border-amber-400 bg-amber-500/20 text-amber-200':'border-slate-700 bg-slate-900/60 hover:border-slate-600 text-slate-300'}`}>
                    <span className="w-5 h-5 rounded-md border border-white/30 shadow-xs flex-shrink-0" style={{backgroundColor:opt.hex}} />
                    <div className="min-w-0"><div className="text-xs font-bold truncate">{opt.name}</div><div className="text-[10px] opacity-60 truncate">{opt.desc}</div></div>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1.5">Hair Color</label>
              <div className="flex flex-wrap gap-2">
                {HAIR_OPTIONS.map(opt=>(
                  <button key={opt.id} type="button" onClick={()=>{ setHairColor(opt.id); sound.playKeyClick(); }} className={`px-3 py-1.5 border-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer ${hairColor===opt.id?'border-amber-400 bg-amber-500/20 text-amber-200':'border-slate-700 bg-slate-900 hover:border-slate-600 text-slate-300'}`}>
                    <span className="w-3 h-3 rounded-full border border-black/50" style={{backgroundColor:opt.hex}} /><span>{opt.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase mb-1.5 flex items-center gap-1.5"><Shield className="w-3.5 h-3.5" /> Defined-Risk Shield Emblem</label>
              <div className="grid grid-cols-3 gap-2">
                <button type="button" onClick={()=>setShieldStyle('wooden')} className={`p-2 border-2 rounded-xl text-center text-xs font-bold cursor-pointer ${shieldStyle==='wooden'?'border-amber-400 bg-amber-500/20 text-amber-200':'border-slate-700 bg-slate-900 text-slate-400'}`}>🪵 Wooden Value</button>
                <button type="button" onClick={()=>setShieldStyle('hylian')} className={`p-2 border-2 rounded-xl text-center text-xs font-bold cursor-pointer ${shieldStyle==='hylian'?'border-amber-400 bg-amber-500/20 text-amber-200':'border-slate-700 bg-slate-900 text-slate-400'}`}>🛡️ Hylian Crest</button>
                <button type="button" onClick={()=>setShieldStyle('mirror')} className={`p-2 border-2 rounded-xl text-center text-xs font-bold cursor-pointer ${shieldStyle==='mirror'?'border-amber-400 bg-amber-500/20 text-amber-200':'border-slate-700 bg-slate-900 text-slate-400'}`}>🪞 Mirror Hedge</button>
              </div>
            </div>
          </div>
        </div>

        <div className="p-3 border-t-2 border-amber-500/20 bg-slate-950 flex items-center justify-end gap-3">
          <button onClick={props.onClose} className="snes-btn px-4 py-2 text-xs rounded-xl">Cancel</button>
          <button onClick={handleSave} className="snes-btn-primary px-6 py-2.5 text-xs rounded-xl flex items-center gap-1.5"><Check className="w-4 h-4" /><span>Confirm Hero Profile</span></button>
        </div>
      </div>
    </div>
  );
};
