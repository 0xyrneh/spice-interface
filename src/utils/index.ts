import blockedLocations from "@/constants/blocked";
import axios from "axios";

export const shortAddress = (address: string, start = 6, end = -4): string => {
  return `${address.slice(0, start)}...${address.slice(end)}`;
};

export const checkIfBlocked = async (): Promise<string | undefined> => {
  try {
    const res = await axios.get("https://geolocation-db.com/json/");

    return res.data.country_name;
  } catch (err) {
    console.error(err);
  }
};
