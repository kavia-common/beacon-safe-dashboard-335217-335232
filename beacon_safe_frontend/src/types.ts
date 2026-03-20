export type DeviceStatus = "Online" | "Offline" | "Warning";

export interface User {
  username: string;
  email: string;
  token: string;
}

export interface Device {
  id: string;
  name: string;
  location: string;
  status: DeviceStatus;
  battery: number; // percent 0..100
}

export interface ProfileSettings {
  name: string;
  email: string;
  theme: "dark" | "light";
}
