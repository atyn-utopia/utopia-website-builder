export const COMPANIES = [
  "Encik Beku Aircond Sdn. Bhd.",
  "Butik Glam & Lux Sdn. Bhd.",
  "Mobile Wheeler Sdn. Bhd.",
  "Mandiri Sdn. Bhd.",
  "Pulse Pilates Sdn. Bhd.",
  "Jom Vend Sdn. Bhd.",
  "Scaffolding Malaysia Sdn. Bhd.",
  "Cold Truck Malaysia Sdn. Bhd.",
  "Rev Move Sdn. Bhd.",
  "Kak Kenduri Sdn. Bhd.",
  "Merry Elderly Care Sdn. Bhd.",
  "Ibnu Sina Care Sdn. Bhd.",
  "Rev Move Utara Sdn. Bhd.",
  "Rev Bike Sdn. Bhd.",
  "Utopia Holiday Sdn. Bhd.",
] as const;

export type Company = (typeof COMPANIES)[number];
