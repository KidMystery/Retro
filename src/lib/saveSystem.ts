import { SaveSlotData, PlayerStats, OptionContract, AssetQuote } from '../types';

const SAVE_KEY_PREFIX = 'valuaria_save_slot_';
const AUTO_SAVE_KEY = 'valuaria_auto_save';

export class SaveSystem {
  public static getSaveSlot(slotNumber: number): SaveSlotData | null {
    try {
      const raw = localStorage.getItem(`${SAVE_KEY_PREFIX}${slotNumber}`);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static getAllSlots(): (SaveSlotData | null)[] {
    return [1, 2, 3].map(slot => this.getSaveSlot(slot));
  }

  public static getAutoSave(): SaveSlotData | null {
    try {
      const raw = localStorage.getItem(AUTO_SAVE_KEY);
      if (!raw) return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  public static saveToSlot(
    slotNumber: number,
    locationName: string,
    player: PlayerStats,
    positions: OptionContract[],
    assetQuote: AssetQuote,
    terminalLog: string[]
  ): SaveSlotData {
    const saveData: SaveSlotData = {
      id: `slot_${slotNumber}_${Date.now()}`,
      slotNumber,
      saveName: `${player.name}'s Quest - ${locationName}`,
      savedAt: new Date().toLocaleString(),
      locationName,
      player,
      positions,
      assetQuote,
      terminalLog: terminalLog.slice(-15)
    };

    try {
      localStorage.setItem(`${SAVE_KEY_PREFIX}${slotNumber}`, JSON.stringify(saveData));
      // Also update auto-save
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }

    return saveData;
  }

  public static autoSave(
    locationName: string,
    player: PlayerStats,
    positions: OptionContract[],
    assetQuote: AssetQuote,
    terminalLog: string[]
  ): void {
    const saveData: SaveSlotData = {
      id: `autosave_${Date.now()}`,
      slotNumber: 0,
      saveName: `Auto-Save: ${player.name} in ${locationName}`,
      savedAt: new Date().toLocaleString(),
      locationName,
      player,
      positions,
      assetQuote,
      terminalLog: terminalLog.slice(-15)
    };

    try {
      localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(saveData));
    } catch {}
  }

  public static deleteSlot(slotNumber: number): void {
    try {
      localStorage.removeItem(`${SAVE_KEY_PREFIX}${slotNumber}`);
    } catch {}
  }
}
