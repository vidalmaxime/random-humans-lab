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
    <main className={`flex min-h-screen flex-col items-center p-4`}>
      <Header title="random humans lab" />
      <p className="text-black w-3/5 text-justify">
        In the sprawling expanse of the cosmos, a set of physical rules governs
        the behavior of all things, from the smallest quark to the mightiest
        star. Even humanity, with all its complexity and nuance, finds itself
        subject to these unyielding laws. Though on occasion, our actions may
        appear random, we would do well to remember that the truth is often far
        more intricate than it first seems.
      </p>{" "}
      <p className="mt-4 text-black w-3/5 text-justify">
        Thus, we embark upon a quest to collect empirical evidence regarding the
        deterministic nature of our ostensibly stochastic seed generators. These
        experiments, if successful, shall grant us a glimpse into the very
        fabric of the universe itself, shedding light upon the intricate
        workings that underlie our world.
      </p>
      <div className="mt-16">
        <ExperimentTile name="experiment 1" />
      </div>
      <Footer />
    </main>
  );
}
