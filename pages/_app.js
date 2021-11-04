import "../styles/globals.css";
import Head from "next/head";

function MyApp({ Component, pageProps }) {
  const head = {
    title: "Carousearch",
    desc: "Search Carousell Quickly!",
    url: "https://carousearch.vercel.app",
    img: "",
  };
  return (
    <>
      <Head>
        <meta charset="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, shrink-to-fit=no"
        />
        <title>
          {head.title} | {head.desc}{" "}
        </title>
        <meta name="description" content={head.desc} />
        <meta name="keywords" content="" />

        <meta property="og:title" content={head.title} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:description" content={head.desc}></meta>
        <meta property="og:url" content={head.url} />
        <meta property="og:image" content={head.img} />
        <meta property="og:image:width" content="1920" />
        <meta property="og:image:height" content="1920" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content={head.title} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={head.title} />
        <meta name="twitter:description" content={head.desc} />
        <meta name="twitter:image" content={head.img} />

        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
        <link rel="canonical" href={head.url} />
        <link rel="shortlink" href={head.url} />
      </Head>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
