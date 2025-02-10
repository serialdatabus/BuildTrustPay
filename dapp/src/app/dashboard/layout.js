"use client";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaEthereum } from "react-icons/fa";
import { shortenAddress } from "../helpers";
const WalletContext = createContext();

export default function DashboardLayout({ children }) {
  const menuitems = [
    {
      name: "Projects",
      href: "/dashboard/projects",
      key: "1",
      icon: <FaUser />,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      key: "2",
      icon: <FaUser />,
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: <FaUser />,
      key: "3",
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: <FaUser />,
      key: "4",
    },
    {
      name: "Projects",
      href: "/dashboard/projects",
      icon: <FaUser />,
      key: "5",
    },
  ];
  const [account, setAccount] = useState(null);

  // ⚡ Verifica se há uma conta salva no localStorage e restaura ao carregar a página
  useEffect(() => {
    const savedAccount = localStorage.getItem("wallet_address");
    if (savedAccount) {
      setAccount(savedAccount);
    } else {
      connectWallet();
    }
  }, []);

  // ⚡ Função para conectar a carteira
  async function connectWallet() {
    if (window.ethereum) {
      // ⚡ Escuta alterações na conta ativa
      if (window.ethereum) {
        window.ethereum.on("accountsChanged", handleAccountsChanged);
      }

      try {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log({ accounts });
        setAccount(accounts[0]); // Salva no estado
        localStorage.setItem("wallet_address", accounts[0]); // Salva no localStorage
      } catch (error) {}
    } else {
      alert("MetaMask not detcted! Please, install MetaMask.");
    }
  }

  function handleAccountsChanged(accounts) {
    if (accounts.length > 0) {
      setAccount(accounts[0]);
      localStorage.setItem("wallet_address", accounts[0]); // Atualiza o localStorage
    } else {
      // Se não houver contas conectadas
      disconnectWallet();
    }
  }


  // ⚡ Função para desconectar a carteira e limpar o estado
  function disconnectWallet() {
    setAccount(null);
    localStorage.removeItem("wallet_address"); // Remove do localStorage
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full bg-black text-white justify-between p-2">
        <div></div>

        <div className="text-white">
          {account ? (
            <ConnectedWidget
              account={account}
              disconnectWallet={disconnectWallet}
            />
          ) : (
            <a
              onClick={connectWallet}
              className="bg-green-500 flex text-white rounded-md p-2 text-sm cursor-pointer"
            >
              Conectar wallet
            </a>
          )}
        </div>
      </div>
      <div className="flex h-screen w-full">
        <div className="w-[20em] bg-gray-400 h-full">
          {/* list menu items */}
          {menuitems.map((item) => (
            <a href="" key={item.key} className="flex p-2 items-center">
              <span>{item.icon}</span>
              <span className="ml-2">{item.name}</span>
            </a>
          ))}
        </div>
        <SessionProvider>
          {" "}
          <AuthHandler />{" "}
          <WalletContext.Provider value={{ account, connectWallet }}>
            <div className="overflow-y-auto w-full">{children}</div>
          </WalletContext.Provider>
        </SessionProvider>
      </div>
    </div>
  );
}

function AuthHandler() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    console.log({ status, session });
    if (status === "unauthenticated") {
      signOut(); // Faz logout automático
      router.push("/"); // Redireciona para login
    }
  }, [status]);

  return null; // Esse componente não precisa renderizar nada
}

function ConnectedWidget({ account, disconnectWallet }) {
  return (
    <span className="flex items-center my-1">
      <FaEthereum />
      <span>
        <span className="mr-2">{"[" + shortenAddress(account) + "]"}</span>
        <a
          onClick={disconnectWallet}
          className="bg-red-500 text-white rounded-md p-2 text-sm"
        >
          Desconectar wallet
        </a>
      </span>
    </span>
  );
}
