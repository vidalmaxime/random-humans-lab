import React from "react";

export default function Footer() {
  return (
    <footer className="mt-auto">
      <h1 className="text-black">
        made with curiosity by{" "}
        <a
          target="_blank"
          href="https://twitter.com/aurelien_morel"
          className="text-green-500"
        >
          aurélien
        </a>{" "}
        and{" "}
        <a target="_blank" href="https://vmax.one/" className="text-green-500">
          maxime
        </a>
      </h1>
    </footer>
  );
}
