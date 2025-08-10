import { Vector3 } from '@babylonjs/core';

export interface CameraState {
  alpha: number;
  beta: number;
  radius: number;
  target: Vector3;
}

export const CAMERA_POSITIONS: Record<string, CameraState> = {
  menu: {
    alpha: -Math.PI / 2,
    beta: Math.PI / 7,
    radius: 40,
    target: new Vector3(0, 0, 0)
  },
  pong: {
    alpha: -Math.PI / 2,
    beta: Math.PI / 7,
    radius: 11,
    target: new Vector3(-20, 0, 0)
  },
  tictactoe: {
    alpha: -Math.PI / 2,
    beta: Math.PI / 10,
    radius: 12,
    target: new Vector3(20, 0, -0.5)
  }
};

export default CAMERA_POSITIONS;
