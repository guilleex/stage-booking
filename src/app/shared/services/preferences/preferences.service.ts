import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

@Injectable({
  providedIn: 'root'
})
/**
 * Service class for managing preferences
 * 
 * @class Preferences
  */
export class PreferencesService {

  /**
   * Get preference value by key
   * 
   * @param key 
   * @returns {Promise<string | null>}
   */
  async getPreference(key: string): Promise<string | null> {

    const { value } = await Preferences.get({ key });
    return value;

  }

  /**
   * Set preference value by key
   * 
   * @param key 
   * @param value 
   */
  async setPreference(key: string, value: string): Promise<void> {

    await Preferences.set({ key, value });

  }

  /**
   * Remove preference by key
   * 
   * @param key 
   */
  async removePreference(key: string): Promise<void> {

    await Preferences.remove({ key });

  }

}
