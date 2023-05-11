import Head from "next/head";
import { ReactNode } from "react";

export default function Meta({
  title = "Random Human Labs",
  description = "A web experiment to find the human random seed.",
  image = "https://randomhumanslab.com/thumb.jpg",
  url = "https://randomhumanslab.comn",
  twitterCardType = "summary",
  extra,
}: {
  description?: string;
  extra?: ReactNode;
  image?: string;
  title?: string;
  twitterCardType?: "summary" | "summary_large_image";
  url?: string;
}) {
  return (
    <Head>
      <title>{title}</title>

      {/* HTML Meta Tags */}
      <meta name="description" content={description} />

      {/* Open Graph Meta Tags */}
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter Meta Tags */}
      <meta name="twitter:card" content={twitterCardType} />
      <meta property="twitter:domain" content="randomhumanslab.com" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:site" content="@vmaxmc2" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* Extra Meta Tags */}
      {extra}
    </Head>
  );
}
