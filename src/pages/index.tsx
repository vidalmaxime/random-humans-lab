import { useEffect } from "react";
import { signInAnonymously } from "firebase/auth";

import ExperimentTile from "@/components/ExperimentTile";
import Footer from "@/components/Footer";
import { auth } from "../../firebase";
import Header from "@/components/Header";

export default function Home() {
  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  return (
    <main
      className={`flex min-h-screen flex-col items-center p-4 bg-green-100`}
    >
      <Header title="random humans lab" />

      <div className="mt-16">
        <ExperimentTile name="Experiment One" />
      </div>

      <Footer />
    </main>
  );
}
