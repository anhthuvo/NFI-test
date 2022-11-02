import {
  useReducer,
  createContext,
  useContext,
  useEffect,
  useRef,
  ReactNode,
} from "react";
import { ethers } from "ethers";
import { produce } from "immer";
import { Web3Provider } from "@ethersproject/providers";
import MetaMaskOnboarding from "@metamask/onboarding";

const initialState = {
  address: "",
  network: {
    chainId: 0,
    ensAddress: null,
    name: "",
  },
  requestConnect: () => {}
};

const reducer = produce((draft, action) => {
  switch (action.type) {
    case "setNetwork": {
      draft.network = action.payload;
      break;
    }
    case "setAddress": {
      draft.address = action.payload;
      break;
    }
    default:
      break;
  }
});

const MetamaskContext = createContext({
  address: "",
  network: {
    chainId: 0,
    ensAddress: null,
    name: "",
  },
  requestConnect: () => {}
});

const MetamaskStore = ({ children }: { children?: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const providerRef = useRef<Web3Provider>();
  const { isMetaMaskInstalled } = MetaMaskOnboarding;

  const requestConnect = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        dispatch({
          type: "setAddress",
          payload: accounts[0],
        });
      } catch (ex) {
        console.log("Request to wallet is rejected");
        dispatch({
          type: "setAddress",
          payload: "",
        });
      }
    }
  };

  const initialize = async () => {
    if (isMetaMaskInstalled() && window.ethereum) {
      providerRef.current = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );


      const accounts = await window.ethereum.request({ method: 'eth_accounts' })
      if (accounts[0]) {
        requestConnect()
      }

      providerRef.current.on("network", (newNetwork, oldNetwork) => {
        const { chainId, ensAddress, name } = newNetwork;
        dispatch({
          type: "setNetwork",
          payload: {
            chainId,
            ensAddress,
            name,
          },
        });
      });

      window.ethereum.on("accountsChanged", async (newAccounts) => {
        requestConnect();
      });
    }
  };

  useEffect(() => {
    initialize();
  }, []);

  return (
    <MetamaskContext.Provider
      value={{
        ...state,
        requestConnect,
      }}
    >
      {children}
    </MetamaskContext.Provider>
  );
};

export const useMetamask = () => useContext(MetamaskContext);

export default MetamaskStore;
