import { PrismaClient } from "@prisma/client";
let prisma;

export async function getProjects() {
  let projects = [];

  for (let i = 0; i < 20; i++) {
    projects.push({
      title: "Project " + i,
      id: "projectid" + i,
      imgurl: "",
    });
  }

  return projects;
}

export function removeSpaces(str) {
  return str.replace(/\s+/g, ""); // Remove todos os espaços
}

export function shortenAddress(address, startChars = 6, endChars = 4) {
  if (!address) return "";
  if (address.length <= startChars + endChars) return address;
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
}

/* an helper to signup a user in the api/signuo using fetch */
export async function signupUser(user) {
  console.log({ user });
  const response = await fetch("/api/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  return await response.json();
}

if (process.env.NODE_ENV === "production") {
  // Em produção, usamos uma única instância do Prisma Client
  prisma = new PrismaClient();
} else {
  // Em desenvolvimento, usamos uma instância global para evitar múltiplas conexões
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export default prisma;
