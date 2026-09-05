import React, { useState, useEffect } from 'react';
import { PlayerStats, OptionContract, AssetQuote, SaveSlotData, TunicColor } from '../types';
import { SaveSystem } from '../lib/saveSystem';
import { sound } from '../lib/audioEngine';
import { Save, Download, Trash2, Sparkles, Check, Clock, MapPin, Heart, X } from 'lucide-react';

interface SaveGameModalPropsBase {
  player: PlayerStats;
  positions: OptionContract[];
  assetQuote: AssetQuote;
  terminalLog: string[];
  isAtSaveShrine?: boolean;
  onLoadGame: (data: SaveSlotData) => void;
  onClose: () => void;
}
type SavePropsOld = SaveGameModalPropsBase & { mode: 'SAVE'|'LOAD'; locationName: string; };
type SavePropsNew = SaveGameModalPropsBase & { initialMode: 'SAVE'|'LOAD'; isAtShrine?: boolean; };
type Props = SavePropsOld | SavePropsNew;

export const SaveGameModal: React.FC<Props> = (props: any) => {
  const initialMode: 'SAVE'|'LOAD' = props.initialMode || props.mode || 'SAVE';
  const locationName: string = props.locationName || `Act ${props.player.chapter} Overworld`;
  const isAtSaveShrine = props.isAtSaveShrine || props.isAtShrine || false;

  const [mode, setMode] = useState<'SAVE'|'LOAD'>(initialMode);
  const [slots, setSlots] = useState<(SaveSlotData | null)[]>([]);
  const [autoSave, setAutoSave] = useState<SaveSlotData | null>(null);
  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);

  const refreshSlots = () => { setSlots(SaveSystem.getAllSlots()); setAutoSave(SaveSystem.getAutoSave()); };
  useEffect(()=>{ refreshSlots(); }, []);

  const handleSaveToSlot = (slotNumber: number) => {
    sound.playSaveGame();
    SaveSystem.saveToSlot(slotNumber, locationName, props.player, props.positions, props.assetQuote, props.terminalLog);
    refreshSlots();
    setSaveSuccessNotice(`Adventure preserved in Slot ${slotNumber}! Oracle Bond +0.2`);
    setTimeout(()=>setSaveSuccessNotice(null), 2800);
  };
  const handleLoadSlot = (data: SaveSlotData) => { sound.playHeartContainer(); props.onLoadGame(data); props.onClose(); };
  const handleDeleteSlot = (slotNumber: number, e: React.MouseEvent) => { e.stopPropagation(); sound.playKeyClick(); SaveSystem.deleteSlot(slotNumber); refreshSlots(); };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-end md:items-center justify-center p-0 md:p-4 backdrop-blur-sm">
      <div className="oracle-bottom-sheet w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {isAtSaveShrine && (
          <div className="m-3 p-2.5 bg-gradient-to-r from-amber-950/60 via-amber-900/40 to-amber-950/60 border-2 border-amber-400 text-amber-200 text-xs flex items-center justify-between rounded-xl">
            <div className="flex items-center gap-2"><Sparkles className="w-4 h-4 text-amber-300 animate-pulse" /><span className="font-cinzel font-bold">SACRED SAVE SHRINE • Goddess of Margin</span></div>
            <span className="text-[11px] opacity-80 hidden sm:inline">Blessed by Oracle Stone • +0.5♥ +0.2 Bond</span>
          </div>
        )}

        <div className="flex items-center justify-between p-4 border-b-2 border-amber-500/30 bg-gradient-to-r from-slate-900 to-[#1a2744]">
          <div className="flex items-center gap-3">
            <div className="oracle-glyph w-8 h-8"><Save className="w-4 h-4 text-amber-400" /></div>
            <div>
              <h2 className="font-cinzel text-base text-amber-200">{mode==='SAVE'?'PRESERVE ADVENTURE • SAVE':'RESTORE ADVENTURE • LOAD'} • Oracle Ledger</h2>
              <p className="text-[11px] text-slate-400">Select sacred chronicle parchment • Path {props.player.currentPath} • Bond {props.player.oracleBondLevel?.toFixed(1)}/5</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex border-2 border-amber-500/30 rounded-xl overflow-hidden text-xs">
              <button type="button" onClick={()=>{ setMode('SAVE'); sound.playKeyClick(); }} className={`px-3 py-1 font-bold cursor-pointer ${mode==='SAVE'?'bg-amber-500 text-black':'bg-slate-900 text-amber-200 hover:bg-slate-800'}`}>SAVE</button>
              <button type="button" onClick={()=>{ setMode('LOAD'); sound.playKeyClick(); }} className={`px-3 py-1 font-bold cursor-pointer ${mode==='LOAD'?'bg-amber-500 text-black':'bg-slate-900 text-amber-200 hover:bg-slate-800'}`}>LOAD</button>
            </div>
            <button onClick={props.onClose} className="snes-btn p-2 rounded-lg"><X className="w-4 h-4" /></button>
          </div>
        </div>

        {saveSuccessNotice && <div className="m-3 p-3 bg-emerald-950/80 border-2 border-emerald-400 text-emerald-200 text-xs font-bold flex items-center gap-2 rounded-xl"><Check className="w-4 h-4" /><span>{saveSuccessNotice}</span></div>}

        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gradient-to-b from-[#121a2e] to-[#0a0e1d]">
          {[1,2,3].map(slotNum=>{
            const slotData = slots[slotNum-1];
            return (
              <div key={slotNum} className={`p-3.5 border-2 rounded-xl transition-all relative ${slotData?'border-amber-500/50 bg-slate-900/80 hover:border-amber-400':'border-slate-700 bg-slate-950/50 hover:border-slate-600'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 border-2 border-amber-400/50 bg-slate-950 flex items-center justify-center font-cinzel text-amber-300 text-xs shrink-0 rounded-xl">#{slotNum}</div>
                    <div className="min-w-0">
                      {slotData ? (
                        <>
                          <div className="flex items-center gap-2"><span className="font-bold text-amber-300 text-sm">{slotData.player.name}</span><span className="text-[10px] px-1.5 py-0.5 bg-amber-500/20 border border-amber-400/30 text-amber-200 rounded">{slotData.player.avatar?.avatarTitle || slotData.player.title}</span><span className={`text-[10px] px-1.5 py-0.5 border rounded ${slotData.player.currentPath==='TRADER'?'border-red-500 text-red-300':slotData.player.currentPath==='INVESTOR'?'border-green-500 text-green-300':'border-sky-500 text-sky-300'}`}>{slotData.player.currentPath}</span></div>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 mt-1">
                            <div className="flex items-center gap-0.5 text-red-500">{Array.from({length: slotData.player.maxHearts||4}).map((_,idx)=><Heart key={idx} className={`w-3.5 h-3.5 ${idx < slotData.player.hearts ? 'fill-red-500 text-red-500' : 'opacity-30 text-slate-500'}`} />)}</div>
                            <span className="text-amber-300 font-bold">{slotData.player.florins.toLocaleString()}ƒ</span>
                            <div className="flex items-center gap-1 text-slate-400 text-[11px]"><MapPin className="w-3 h-3 text-amber-400" /><span className="truncate max-w-[180px]">{slotData.locationName}</span></div>
                            <div className="flex items-center gap-1 text-slate-500 text-[10px]"><Clock className="w-3 h-3" /><span>{slotData.savedAt}</span></div>
                          </div>
                        </>
                      ) : (
                        <div><span className="font-bold text-slate-500 text-sm">[EMPTY CHRONICLE SLOT #{slotNum}]</span><p className="text-xs text-slate-600 mt-0.5">No quest data recorded yet. Fail→Learn progress saves here.</p></div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:self-center">
                    {mode==='SAVE' ? (
                      <button onClick={()=>handleSaveToSlot(slotNum)} className="snes-btn-primary px-4 py-2 text-xs rounded-xl flex items-center gap-1.5"><Save className="w-3.5 h-3.5" /><span>{slotData?'Overwrite':'Save Here'}</span></button>
                    ) : (
                      <button disabled={!slotData} onClick={()=>slotData && handleLoadSlot(slotData)} className={`px-4 py-2 font-bold text-xs rounded-xl flex items-center gap-1.5 ${slotData?'snes-btn-primary':'bg-slate-800 text-slate-500 cursor-not-allowed'}`}><Download className="w-3.5 h-3.5" /><span>Load Quest</span></button>
                    )}
                    {slotData && <button onClick={e=>handleDeleteSlot(slotNum,e)} className="snes-btn p-2 border-red-900/50 text-red-400 rounded-xl" title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {autoSave && (
          <div className="p-3 border-t border-slate-800 bg-slate-950/80">
            <div className="text-[11px] font-bold text-slate-400 uppercase mb-2 flex items-center gap-1"><Sparkles className="w-3 h-3 text-amber-400" /><span>Auto-Save Backup</span></div>
            <div className="p-2.5 bg-slate-900 border-2 border-slate-700 flex items-center justify-between rounded-xl text-xs">
              <div className="flex items-center gap-2 text-slate-300"><span className="font-bold text-amber-300">{autoSave.player.name}</span><span className="opacity-70">Day #{autoSave.player.day}</span><span className="opacity-50">• {autoSave.locationName}</span><span className="text-[10px] text-slate-500">({autoSave.savedAt})</span></div>
              <button onClick={()=>handleLoadSlot(autoSave)} className="snes-btn px-3 py-1 text-xs rounded-xl border-amber-500/40">Restore Auto-Save</button>
            </div>
          </div>
        )}

        <div className="p-3 border-t-2 border-amber-500/20 bg-slate-950 flex items-center justify-between text-xs">
          <span className="text-slate-500">Location: <strong className="text-amber-300">{locationName}</strong> • Fail→Learn loop saves protections permanently</span>
          <button onClick={props.onClose} className="snes-btn px-4 py-1.5 text-xs rounded-xl">Close</button>
        </div>
      </div>
    </div>
  );
};
