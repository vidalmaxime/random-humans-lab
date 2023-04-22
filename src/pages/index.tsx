import Link from "next/link";

import TestExperiment from "@/components/TestExperiment";
import TestThree from "@/components/TestThree";

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24`}
    >
      <h1 className="title">
        <Link href="/about">About</Link>
      </h1>
      <div className="flex items-center justify-center">
        <div className="mr-16">
          <TestThree />
        </div>
        <h1 className="text text-5xl">Random Humans Lab</h1>
      </div>
      <TestExperiment name="Hello" />
    </main>
  );
}
