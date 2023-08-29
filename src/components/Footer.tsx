import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <h1 className="text-black">
        built by{" "}
        <a
          target="_blank"
          href="https://twitter.com/aurelien_morel"
          className="text-gray-400 hover:text-green-600"
        >
          aurélien
        </a>{" "}
        and{" "}
        <a
          target="_blank"
          href="https://vmax.one/"
          className="text-gray-400 hover:text-green-600"
        >
          maxime
        </a>
      </h1>
    </footer>
  );
}
