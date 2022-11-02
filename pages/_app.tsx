import "../styles/globals.css";
import type { AppProps } from "next/app";
import MetamaskStore from "../store/metamask";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MetamaskStore>
      <Component {...pageProps} />
    </MetamaskStore>
  );
}
