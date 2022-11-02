import { ExternalProvider } from "@ethersproject/providers";

interface EthereumProvider extends ExternalProvider {
  on(
    event: "close" | "accountsChanged" | "chainChanged" | "networkChanged",
    callback: (payload: any) => void
  ): void;
  removeAllListeners(
    events: ("close" | "accountsChanged" | "chainChanged" | "networkChanged")[],
  ): void;
  off(
    event: "close" | "accountsChanged" | "chainChanged" | "networkChanged"
  ): void;
  once(
    event: string,
    callback: (payload: any) => void
  ): void;
  removeAllListeners(): void;
  isConnected(): void;
}

declare global {
  interface Window {
    ethereum?: EthereumProvider | { 
      request, 
      on(
        event: "close" | "accountsChanged" | "chainChanged" | "networkChanged",
        callback: (payload: any) => void
      ): void;
      removeAllListeners(
        events: ("close" | "accountsChanged" | "chainChanged" | "networkChanged")[],
      ): void;
      off(
        event: "close" | "accountsChanged" | "chainChanged" | "networkChanged"
      ): void;
      once(
        event: string,
        callback: (payload: any) => void
      ): void;
      removeAllListeners(): void;
      isConnected(): void;
    };
  }
}
