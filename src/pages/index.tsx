import { useEffect } from "react";
import { signInAnonymously } from "firebase/auth";
import Head from 'next/head'
import Image from "next/image";
import Link from "next/link";

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
      <Head>
        <title>random humans lab</title>
      </Head>

      <div className="flex items-center justify-center">
        <div className="w-1/2 lg:w-auto mb-8 md:mb-0">
          <Link href="/">
            <Image
              src="/rhl-logo.svg"
              alt="Random Humans Lab Logo"
              width={100}
              height={100}
            />
          </Link>
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-9xl text-black  ml-8">
          random humans lab
        </h1>
      </div>


      <div className="mt-16">
        <ExperimentTile name="Experiment One" />
      </div>

      <Footer />
    </main>
  );
}
