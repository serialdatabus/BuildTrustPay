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


export async function getDraftprojects(id = 0) {
    

    //get projects from projects route
    const response = await fetch("/api/projects/?type=draft&project_id="+id);
    const data = await response.json();
    console.log({ data });


    return data ?? [];
}


export function getContractABI() {
  return [
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "stageId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "amount",
          "type": "uint256"
        }
      ],
      "name": "PaymentProcessed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "id",
          "type": "uint256"
        }
      ],
      "name": "ProjectClosed",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "stageId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "StageAdded",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "uint256",
          "name": "stageId",
          "type": "uint256"
        },
        {
          "indexed": false,
          "internalType": "string",
          "name": "validatorID",
          "type": "string"
        }
      ],
      "name": "StageValidated",
      "type": "event"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "projectId",
          "type": "string"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "stage_id",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "validation_steps",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "validators_ids",
              "type": "string[]"
            },
            {
              "internalType": "string[]",
              "name": "validations",
              "type": "string[]"
            },
            {
              "internalType": "uint256",
              "name": "total_validators",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount_per_validator",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            }
          ],
          "internalType": "struct SmartPayConstruction.Stage",
          "name": "_stage",
          "type": "tuple"
        }
      ],
      "name": "addStage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_validator_id",
          "type": "string"
        }
      ],
      "name": "addValidator",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        },
        {
          "internalType": "string[]",
          "name": "_validators_ids",
          "type": "string[]"
        }
      ],
      "name": "addValidators",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "agencyId",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        }
      ],
      "name": "closeProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "a",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "b",
          "type": "string"
        }
      ],
      "name": "compareStrings",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "pure",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_client_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_contractor",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "_startDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "_endDate",
          "type": "uint256"
        },
        {
          "components": [
            {
              "internalType": "string",
              "name": "stage_id",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "validation_steps",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "validators_ids",
              "type": "string[]"
            },
            {
              "internalType": "string[]",
              "name": "validations",
              "type": "string[]"
            },
            {
              "internalType": "uint256",
              "name": "total_validators",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount_per_validator",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            }
          ],
          "internalType": "struct SmartPayConstruction.Stage[]",
          "name": "_stages",
          "type": "tuple[]"
        }
      ],
      "name": "createProject",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getAllProjectIds",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        }
      ],
      "name": "getMaxTotalValidators",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProjects",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "project_id",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "name",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "client_id",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "contractor",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "creationDate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "startDate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "endDate",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "actualCompletionDate",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "closed",
              "type": "bool"
            },
            {
              "components": [
                {
                  "internalType": "string",
                  "name": "stage_id",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "title",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "description",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "validation_steps",
                  "type": "string"
                },
                {
                  "internalType": "uint256",
                  "name": "value",
                  "type": "uint256"
                },
                {
                  "internalType": "string[]",
                  "name": "validators_ids",
                  "type": "string[]"
                },
                {
                  "internalType": "string[]",
                  "name": "validations",
                  "type": "string[]"
                },
                {
                  "internalType": "uint256",
                  "name": "total_validators",
                  "type": "uint256"
                },
                {
                  "internalType": "uint256",
                  "name": "amount_per_validator",
                  "type": "uint256"
                },
                {
                  "internalType": "bool",
                  "name": "completed",
                  "type": "bool"
                }
              ],
              "internalType": "struct SmartPayConstruction.Stage[]",
              "name": "stages",
              "type": "tuple[]"
            }
          ],
          "internalType": "struct SmartPayConstruction.Project[]",
          "name": "",
          "type": "tuple[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "getProjectsCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "projectId",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "stageId",
          "type": "string"
        }
      ],
      "name": "getStageById",
      "outputs": [
        {
          "components": [
            {
              "internalType": "string",
              "name": "stage_id",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "title",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "description",
              "type": "string"
            },
            {
              "internalType": "string",
              "name": "validation_steps",
              "type": "string"
            },
            {
              "internalType": "uint256",
              "name": "value",
              "type": "uint256"
            },
            {
              "internalType": "string[]",
              "name": "validators_ids",
              "type": "string[]"
            },
            {
              "internalType": "string[]",
              "name": "validations",
              "type": "string[]"
            },
            {
              "internalType": "uint256",
              "name": "total_validators",
              "type": "uint256"
            },
            {
              "internalType": "uint256",
              "name": "amount_per_validator",
              "type": "uint256"
            },
            {
              "internalType": "bool",
              "name": "completed",
              "type": "bool"
            }
          ],
          "internalType": "struct SmartPayConstruction.Stage",
          "name": "s",
          "type": "tuple"
        },
        {
          "internalType": "bool",
          "name": "found",
          "type": "bool"
        },
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "projectId",
          "type": "string"
        }
      ],
      "name": "getStagesCount",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        }
      ],
      "name": "getTotalValidators",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        }
      ],
      "name": "getValidatorsIds",
      "outputs": [
        {
          "internalType": "string[]",
          "name": "",
          "type": "string[]"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_validator_id",
          "type": "string"
        }
      ],
      "name": "isStageValidatedByValidator",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        }
      ],
      "name": "isThereEnoughValidators",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_validator_id",
          "type": "string"
        }
      ],
      "name": "isValidatorAllowedToValidate",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "projectId",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "stageId",
          "type": "uint256"
        }
      ],
      "name": "processPendingPayments",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "name": "projectIds",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "name": "projects",
      "outputs": [
        {
          "internalType": "string",
          "name": "project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "name",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "description",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "client_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "contractor",
          "type": "string"
        },
        {
          "internalType": "uint256",
          "name": "creationDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "startDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "endDate",
          "type": "uint256"
        },
        {
          "internalType": "uint256",
          "name": "actualCompletionDate",
          "type": "uint256"
        },
        {
          "internalType": "bool",
          "name": "closed",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_validator_id",
          "type": "string"
        }
      ],
      "name": "validateStage",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_project_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_stage_id",
          "type": "string"
        },
        {
          "internalType": "string",
          "name": "_validator_id",
          "type": "string"
        }
      ],
      "name": "validatorWasAlreadyAdded",
      "outputs": [
        {
          "internalType": "bool",
          "name": "",
          "type": "bool"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ];
}


export async function getPublishedProjectsFromBlockchain(session_user_id){

  

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
