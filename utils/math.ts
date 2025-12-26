
import { CONFIG } from '../constants';

/**
 * Generates a random point within a cone (Christmas Tree shape)
 */
export const getTreePosition = (): [number, number, number] => {
  const h = Math.random() * CONFIG.TREE_HEIGHT;
  const maxRadiusAtHeight = ((CONFIG.TREE_HEIGHT - h) / CONFIG.TREE_HEIGHT) * CONFIG.TREE_RADIUS;
  const radius = Math.sqrt(Math.random()) * maxRadiusAtHeight;
  const theta = Math.random() * Math.PI * 2;
  
  return [
    radius * Math.cos(theta),
    h - CONFIG.TREE_HEIGHT / 2.5, // Center it slightly
    radius * Math.sin(theta)
  ];
};

/**
 * Generates a random point within a sphere for the scattered state
 */
export const getScatterPosition = (): [number, number, number] => {
  const u = Math.random();
  const v = Math.random();
  const theta = 2 * Math.PI * u;
  const phi = Math.acos(2 * v - 1);
  const r = Math.cbrt(Math.random()) * CONFIG.SCATTER_RADIUS;
  
  return [
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  ];
};
