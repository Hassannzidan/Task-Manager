import { Audio } from 'expo-av';

/**
 * Sound utility for playing audio feedback
 * Handles task completion sounds and other audio notifications
 */
class SoundManager {
  private sound: Audio.Sound | null = null;
  private isLoaded = false
  /**
   * Load the success notification sound
   */
  async loadSuccessSound() {
    try {
      if (this.isLoaded) return;

      const { sound } = await Audio.Sound.createAsync(
        require('../../assets/sounds/success-notification.mp3')
      );
      
      this.sound = sound;
      this.isLoaded = true;
    } catch (error) {
      console.warn('Failed to load success sound:', error);
    }
  }

  /**
   * Play the success notification sound
   */
  async playSuccessSound() {
    try {
      if (!this.sound || !this.isLoaded) {
        await this.loadSuccessSound();
      }

      if (this.sound) {
        await this.sound.replayAsync();
      }
    } catch (error) {
      console.warn('Failed to play success sound:', error);
    }
  }

  /**
   * Unload the sound to free up resources
   */
  async unloadSound() {
    try {
      if (this.sound) {
        await this.sound.unloadAsync();
        this.sound = null;
        this.isLoaded = false;
      }
    } catch (error) {
      console.warn('Failed to unload sound:', error);
    }
  }

  /**
   * Clean up resources
   */
  cleanup() {
    this.unloadSound();
  }
}

// Export singleton instance
export const soundManager = new SoundManager();
export default soundManager;
