"use client";
import { SessionProvider, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { createContext, useEffect, useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaEthereum, FaChevronDown, FaChevronUp } from "react-icons/fa";
import { shortenAddress } from "../helpers";
import { IoMdLogOut } from "react-icons/io";

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
  const router = useRouter();
  const [openProjects, setOpenProjects] = useState(true);
  const [openMilestones, setOpenMilestones] = useState(true);
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
            <div className="flex items-center">
              <ConnectedWidget
                account={account}
                disconnectWallet={disconnectWallet}
              />
              <a
                className="flex cursor-pointer bg-red-500 text-white rounded-md ml-2 text-sm h-[2em] items-center px-2"
                onClick={() => {
                  signOut({ redirect: false }); // Faz logout automático
                  router.push("/"); // Redireciona para login
                }}
              >
                <IoMdLogOut size={18} />
              </a>
            </div>
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
      <div className="w-64 bg-gray-800 text-white h-screen p-4">
      {/* Projects Section */}
      <div>
        <button
          onClick={() => setOpenProjects(!openProjects)}
          className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded-md"
        >
          <span>📂 Projects</span>
          {openProjects ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openProjects && (
          <ul className="ml-4 mt-2">
            <li className="p-2 hover:bg-gray-700 rounded-md">
              <a href="/dashboard/projects">📌 My Projects</a>
            </li>
            <li className="p-2 hover:bg-gray-700 rounded-md">
              <a href="/dashboard/projects/published">📢 Published</a>
            </li>
            <li className="p-2 hover:bg-gray-700 rounded-md">
              <a href="/dashboard/projects/draft">📝 On Draft</a>
            </li>
            <li className="p-2 hover:bg-gray-700 rounded-md">
              <a href="/dashboard/projects/assigned">👷‍♂️ Assigned</a>
            </li>
          </ul>
        )}
      </div>

      {/* Milestones Section */}
      <div className="mt-4">
        <button
          onClick={() => setOpenMilestones(!openMilestones)}
          className="w-full flex justify-between items-center p-2 hover:bg-gray-700 rounded-md"
        >
          <span>✅ Milestones</span>
          {openMilestones ? <FaChevronUp /> : <FaChevronDown />}
        </button>
        {openMilestones && (
          <ul className="ml-4 mt-2">
            <li className="p-2 hover:bg-gray-700 rounded-md">
              <a href="/dashboard/milestones/pending">⏳ Pending of my approval</a>
            </li>
            <li className="p-2 hover:bg-gray-700 rounded-md">
              <a href="/dashboard/milestones/completed">✅ Concluded</a>
            </li>
          </ul>
        )}
      </div>
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

    //if we in the root pag just early return
    if (router.pathname === "/") return;

    if (status === "unauthenticated") {
      signOut({ redirect: false }); // Faz logout automático
      router.push("/"); // Redireciona para login
    }
  }, [status]);

  return null; // Esse componente não precisa renderizar nada
}

function ConnectedWidget({ account, disconnectWallet }) {
  return (
    <span className="flex items-center my-1">
      <FaEthereum />
      <span className="flex">
        <span className="mr-2">{"[" + shortenAddress(account) + "]"}</span>
        <a
          onClick={disconnectWallet}
          className="flex bg-red-500 text-white rounded-md text-sm h-[2em] px-2 items-center cursor-pointer"
        >
          Desconectar wallet
        </a>
      </span>
    </span>
  );
}
