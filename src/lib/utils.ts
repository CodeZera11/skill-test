import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// export function formatSeconds(seconds?: number) {
//   if (!seconds) return "00:00";
//   const minutes = Math.floor(seconds / 60);
//   const remainingSeconds = parseInt((seconds % 60).toFixed(0));
//   return `${minutes}m:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}s`;
// }

export function formatSeconds(seconds?: number): string {
  if (!seconds || seconds <= 0) return "0 sec";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts: string[] = [];

  if (hours > 0) parts.push(`${hours} hr${hours > 1 ? "s" : ""}`);
  if (minutes > 0) parts.push(`${minutes} min${minutes > 1 ? "s" : ""}`);
  if (hours === 0 && minutes === 0 && remainingSeconds > 0) {
    parts.push(`${remainingSeconds} sec${remainingSeconds > 1 ? "s" : ""}`);
  }

  return parts.join(" ");
}

export function formatMinutes(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = parseInt((minutes % 60).toFixed(0));
  return `${hours}h:${remainingMinutes < 10 ? "0" : ""}${remainingMinutes}m`;
}

export function formatHours(hours: number) {
  const days = Math.floor(hours / 24);
  const remainingHours = parseInt((hours % 24).toFixed(0));
  if (days === 0) {
    return `${remainingHours}h`;
  }
  if (remainingHours === 0) {
    return `${days}d`;
  }
  if (remainingHours < 10) {
    return `${days}d 0${remainingHours}h`;
  }
  return `${days}d ${remainingHours}h`;
}
