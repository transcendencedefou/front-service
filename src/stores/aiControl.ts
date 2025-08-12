import { ref } from 'vue';

// Global flag to control AI behavior
export const aiControlStore = {
  disableAutoAI: ref(false),
  
  setDisableAutoAI(disable: boolean) {
    this.disableAutoAI.value = disable;
  },
  
  shouldDisableAutoAI(): boolean {
    return this.disableAutoAI.value;
  }
};
