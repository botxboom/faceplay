import { SignedIn, SignedOut } from "@clerk/nextjs";
import Lobby from "./_components/Lobby";

export default function HomePage() {
  return (
    <main>
      <SignedOut>Please Sign in</SignedOut>
      <SignedIn>
        <Lobby />
      </SignedIn>
    </main>
  );
}
