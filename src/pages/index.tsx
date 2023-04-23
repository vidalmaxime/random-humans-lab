import TestExperiment from "@/components/TestExperiment";
import TestThree from "@/components/TestThree";

export default function Home() {
  return (
    <main
      className={`flex min-h-screen flex-col items-center p-4 bg-green-100`}
    >

      <div className="flex items-center justify-center">
        <div className="mr-16">
          <img src="/rhl-logo.svg" alt="Random Humans Lab Logo" className="w-24" />

        </div>

        <h1 className="text text-9xl text-black">random humans lab</h1>
      </div>
      <TestExperiment name="Experiment One" />

      {/* This footer is at the bottom of the screen */}
      <footer className="mt-auto">
        <h1 className="text-black">
          made with curiosity by aurélien and maxime
        </h1>
      </footer>
    </main>
  );
}
