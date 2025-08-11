import { defineStore } from 'pinia';

interface ColorState {
  playerBoardBorder: string;
  playerBoardBackground: string;
  playerOneColor: string;
  playerTwoColor: string;
  homeButtonText: string;
  homeButtonBackground: string;
  controlsOverlayBorder: string;
  controlsOverlayBackground: string;
  controlsTitleText: string;
  controlsTitleOutline: string;
  controlsKeyBorder: string;
  controlsKeyBackground: string;
  controlsKeyText: string;
  controlsDescText: string;
  selectionHomeButtonText: string;
  selectionHomeButtonBackground: string;
  selectionButtonText: string;
  selectionButtonBackground: string;
  selectionPanelBorder: string;
  selectionPanelBackground: string;
  selectionColorZoneBorder: string;
  selectionColorZoneBackground: string;
  ballColor: string;
  ballParticleColor: string;
  ballLightColor: string;
  tttBorderColor: string;
  tttCellColor: string;
  tttGroundColor: string;
  synthwaveGridColor: string;
  sceneClearColor: string;
}

export const useColorStore = defineStore('color', {
  state: (): ColorState => ({
    playerBoardBorder: '#00D4FF',
    playerBoardBackground: '#000000',
    playerOneColor: '#ff0000',
    playerTwoColor: '#0012ff',
    homeButtonText: '#ffffff',
    homeButtonBackground: '#000000',
    controlsOverlayBorder: '#00D4FF',
    controlsOverlayBackground: '#000000',
    controlsTitleText: '#00D4FF',
    controlsTitleOutline: '#000000',
    controlsKeyBorder: '#FFFFFF',
    controlsKeyBackground: '#111111',
    controlsKeyText: '#FFFFFF',
    controlsDescText: '#EDEDED',
    selectionHomeButtonText: '#00D4FF',
    selectionHomeButtonBackground: '#000000',
    selectionButtonText: '#00D4FF',
    selectionButtonBackground: '#000000',
    selectionPanelBorder: '#00D4FF',
    selectionPanelBackground: '#000000',
    selectionColorZoneBorder: '#00D4FF',
    selectionColorZoneBackground: '#111111',
    ballColor: '#A9DFFF',
    ballParticleColor: '#709DFF',
    ballLightColor: '#99CCFF',
    tttBorderColor: '#FFFFFF',
    tttCellColor: '#FFFFFF',
    tttGroundColor: '#000000',
    synthwaveGridColor: '#00FFFF',
    sceneClearColor: '#000000FF',
  }),
  actions: {
    setColor<K extends keyof ColorState>(key: K, value: string) {
      this[key] = value;
    },
  },
});
