import axios from "axios";

const accessToken = "7OzRvAXarfxVVC0UuEo3wky02x8Pz084yFKEJa9K32s";
console.log(accessToken);
export const unsplashApi = axios.create({
  baseURL: "https://api.unsplash.com",

  headers: {
    Authorization: `Client-ID ${accessToken}`,
  },
});