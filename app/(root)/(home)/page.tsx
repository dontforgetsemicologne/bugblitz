import { handleSignOut } from "@/app/actions/authActions";

export default function HomePage() {
  return (
    <button onClick={handleSignOut} className="top-0">hey hey</button>

  );
}
