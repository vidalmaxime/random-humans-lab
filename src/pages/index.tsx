import { Fragment, useEffect } from "react";
import { signInAnonymously } from "firebase/auth";
import { auth } from "../../firebase";

import ExperimentTile from "@/components/ExperimentTile";
import Header from "@/components/Header";
import Meta from "@/components/Meta";
import { haasgrotdisp } from "@/styles/fonts";

export default function Home() {
  useEffect(() => {
    signInAnonymously(auth);
  }, []);

  return (
    <Fragment>
      <Meta />

      <main className="flex min-h-screen flex-col items-start p-4 w-full">
        <Header title="random humans lab" />
        {/* Add a thin line  */}
        <hr className="w-screen -mx-4 border-1 border-black my-4" />
        <p
          className={`${haasgrotdisp.className} my-4 w-full text-left text-3xl md:text-8xl text-transparent bg-clip-text bg-gradient-to-b from-gray-900 via-gray-800 to-gray-700`}
        >
          Collecting empirical evidence regarding the deterministic nature of
          what seems to be randomness.
        </p>
        <hr className="w-screen -mx-4 border-1 border-black my-4" />
        <div className="mt-4 mb-4 md:mt-4 flex flex-col items-start justify-left">
          <ExperimentTile
            name="pick a number"
            path="/experiment-number"
            icon="/icon-1.svg"
          />
          <ExperimentTile
            name="click somewhere"
            path="/experiment-click"
            icon="/icon-2.svg"
          />
          <ExperimentTile
            name="choose a word"
            path="/experiment-word"
            icon="/icon-3.svg"
          />
        </div>
      </main>
    </Fragment>
  );
}
