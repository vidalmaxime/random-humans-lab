import { useEffect } from "react";
import { signInAnonymously } from "firebase/auth";

import ExperimentTile from "@/components/ExperimentTile";
import Footer from "@/components/Footer";
import { auth } from "../../firebase";

export default function Home() {
  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-4 bg-green-100`}
    >
      <div className="flex items-center justify-center">
        <div className="mr-16">
          <img
            src="/rhl-logo.svg"
            alt="Random Humans Lab Logo"
            className="w-24"
          />
        </div>

        <h1 className="text text-9xl text-black">random humans lab</h1>
      </div>
      <div className="mt-16">
        <ExperimentTile name="Experiment One" />
      </div>

      <Footer />
    </main>
  );
}
