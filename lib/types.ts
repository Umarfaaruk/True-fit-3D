export interface Measurements {
  height: number;
  chest: number;
  waist: number;
  hip: number;
  shoulderWidth: number;
  inseam: number;
}

export const defaultMeasurements: Measurements = {
  height: 175,
  chest: 96,
  waist: 82,
  hip: 96,
  shoulderWidth: 43,
  inseam: 82,
};
