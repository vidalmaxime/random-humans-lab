import { Fragment, useEffect } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../../firebase";

import ExperimentTile from "@/components/ExperimentTile";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import Meta from "@/components/Meta";

export default function Home() {
  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  return (
    <Fragment>
      <Meta />

      <main className="flex min-h-screen flex-col items-center p-4">
        <Header title="random humans lab" />
        <p className=" mt-4 w-full text-center text-5xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-purple-700 to-transparent italic">
          Collecting empirical evidence regarding the deterministic nature of
          what seems to be randomness.
        </p>
        <div className="mt-4 mb-4 md:mt-16 flex flex-col items-start">
          <ExperimentTile name="experiment 1" path="/experiment-number" />
          <ExperimentTile name="experiment 2" path="/experiment-click" />
        </div>
        <Footer />
      </main>
    </Fragment>
  );
}
