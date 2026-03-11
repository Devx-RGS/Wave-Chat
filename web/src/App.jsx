import "./App.css";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";

/**
 * Root React component that displays a greeting and Clerk-based authentication controls.
 *
 * Renders an H1 greeting and conditionally shows a SignInButton (when the user is signed out)
 * or a UserButton (when the user is signed in).
 * @returns {JSX.Element} The component's JSX element representing the app UI.
 */
function App() {

  return (
    <>
    <h1>Hello world</h1>

      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>

      <SignedIn>
        <UserButton />
      </SignedIn>
    </>
  );
}

export default App;
