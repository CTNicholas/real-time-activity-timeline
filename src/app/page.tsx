import { nanoid } from "nanoid";

// Check inside src/app/room/[roomId]/ for the app
export default function Home() {
  return <a href={"/room/" + nanoid()}>Join a random room</a>;
}
