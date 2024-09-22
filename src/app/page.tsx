import { SignedIn, SignedOut, SignIn } from "@clerk/nextjs";

export default function HomePage() {
  return (
    <main>
      <SignedOut>Please Sign in</SignedOut>
      <SignedIn>Hello World</SignedIn>
    </main>
  );
}
