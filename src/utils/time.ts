import moment from "moment-timezone";
import { DAY_IN_SECONDS } from "@/config/constants/time";

export const formatMaturity = (timestamp: number) => {
  const now = moment();
  const matureDate = moment(timestamp);
  const timeLeft = moment.duration(matureDate.diff(now));

  const dayLeft = Math.floor(timeLeft.asDays());
  const hourLeft = Math.floor(timeLeft.asHours() % 24);
  const minuteLeft = Math.floor(timeLeft.asMinutes() % 60);

  if (dayLeft > 0) return `${dayLeft} ${dayLeft > 1 ? "days" : "day"} left`;
  if (hourLeft > 0)
    return `${hourLeft} ${hourLeft > 1 ? "hours" : "hour"} left`;
  if (minuteLeft > 0)
    return `${minuteLeft} ${minuteLeft > 1 ? "minutes" : "minute"} left`;

  return "matured";
};

export const formatLeverageMaturity = (timestamp: number, mode?: string) => {
  const now = moment();
  const matureDate = moment(timestamp * 1000);
  const timeLeft = moment.duration(matureDate.diff(now));

  const dayLeft = Math.floor(timeLeft.asDays());
  const hourLeft = Math.floor(timeLeft.asHours() % 24);
  const minuteLeft = Math.floor(timeLeft.asMinutes() % 60);
  const secondLeft = Math.floor(timeLeft.asSeconds() % 60);

  if (mode === "entire") {
    if (secondLeft > 0) return `${dayLeft}d ${hourLeft}h ${minuteLeft}m`;
    return `0d 0h 0m`;
  }

  if (dayLeft > 0) return `${dayLeft}d`;
  if (hourLeft > 0) return `${hourLeft}h`;
  if (minuteLeft > 0) return `${minuteLeft}m`;
  return "0";
};

export const convertInDays = (seconds: number) => seconds / DAY_IN_SECONDS;
