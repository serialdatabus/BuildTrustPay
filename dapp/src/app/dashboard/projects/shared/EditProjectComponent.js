"use client";
import { ethers } from "ethers";
import { FaEuroSign } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { getContractABI } from "@/app/helpers";

export default function EditProject({ contract_address, edit_project_id }) {
  const [milestones, setMilestones] = useState([]);
  const [milestonesMap, setMilestonesMap] = useState({});
  const [builder, setBuilder] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCurrency, setProjectCurrency] = useState("euro");
  const [milestoneToEdit, setMilestoneToEdit] = useState(null);
  const [nextMilestoneId, setNextMilestoneId] = useState(1);
  const [addMilestoneDialogIsOpen, setAddMilestoneDialogIsOpen] =
    useState(false);
  const [newMilestone, setNewMilestone] = useState(
    getDefaultMilestoneStructure()
  );

  // ABI do Smart Contract (interface)
  const contractABI = getContractABI();

  const [projectIdToUpdate, setProjectIdToUpdate] = useState(0);

  const { data: session } = useSession();

  useEffect(() => {
   if(edit_project_id){
    populateProjectForm();
   }
  }, []);

  function populateProjectForm() {
    //get the project from the api
    fetch("/api/projects/?type=draft&project_id=" + edit_project_id).then(
      async (response) => {
        const data = await response.json();
        console.log({ data });
        if (data.length > 0) {
          const project = data[0];
          setProjectTitle(project.name);
          setProjectDescription(project.description);
          setBuilder(project.contractor);
          setProjectCurrency(project.currency);
          let milestones = [];
          for (let i = 0; i < project.milestones.length; i++) {
            const milestone = project.milestones[i];

            milestones.push({
              id: milestone.edit_id,
              title: milestone.name,
              description: milestone.description,
              validation_steps: milestone.validation_steps,
              validatorIds: [],
              totalValidators: milestone.total_validators,
              includeAssetTranfer: false,
              paymentAmountValidator: milestone.amount_per_validator,
              project_id: milestone.project_id,
              completed: false,
              totalFunds: 0,
            });
          }

          //set the milestones map
          let map = {};
          for (let i = 0; i < milestones.length; i++) {
            map[milestones[i].id] = milestones[i];
          }
          setMilestonesMap(map);

          setNextMilestoneId(milestones.length + 1);
          setMilestones(milestones);
          setProjectIdToUpdate(project.id);
        }
      }
    );
  }

  function saveDraftProject() {
    if (!session?.user) {
      return;
    }

    console.log("Project saved");
    const payload = {
      name: projectTitle,
      description: projectDescription,
      client_id: session?.user.id,
      contractor: builder,
      currency: projectCurrency,
      milestones: milestones,
      type: "draft",
      project_id_to_update: projectIdToUpdate,
    };

    fetch("/api/projects", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then(async (response) => {
      const { data } = await response.json();
      if (data?.project_id && data.project_id > 0) {
        setProjectIdToUpdate(data.project_id);
        console.log({ project_id: data.project_id });
      }
    });
  }

  async function getContract() {
    if (!window.ethereum) throw new Error("MetaMask not detected!");

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    return new ethers.Contract(contract_address, contractABI, signer);
  }

  async function publishProject() {
    try {
      const stages = milestones.map((milestone) => ({
        stage_id: String(milestone.id), // Garante que seja uma string
        title: String(milestone.title),
        description: String(milestone.description),
        validation_steps: String(milestone.validation_steps),
        value: ethers.parseUnits(milestone.totalFunds.toString(), 18), // Se o contrato usa uint256, normalizar para wei
        validators_ids: milestone.validatorIds.map(String), // Converter cada ID para string
        validations: [], // Inicialmente vazio
        total_validators: Number(milestone.totalValidators), // Garante que seja um número
        amount_per_validator: ethers.parseUnits(
          milestone.paymentAmountValidator.toString(),
          18
        ), // Normaliza para wei
        completed: Boolean(milestone.completed), // Garante que seja boolean
      }));

      //publish project calling blockchain createMethod
      const contract = await getContract();
      const tx = await contract.createProject(
        "2222",
        projectTitle,
        projectDescription,
        builder,
        "oooioioi",
        0,
        0,
        stages
      );
      await tx.wait();
      alert("Project published successfully");
    } catch (error) {
      console.error("Error publishing project:", error);
    }
  }

  function getDefaultMilestoneStructure() {
    return {
      id: nextMilestoneId,
      title: "",
      description: "",
      validation_steps: "",
      validatorIds: [],
      totalValidators: 0,
      includeAssetTranfer: false,
      paymentAmountValidator: 0,
      project_id: "",
      completed: false,
      totalFunds: 0,
    };
  }

  function showMilestoneDialog(id) {
    setAddMilestoneDialogIsOpen(true);
  }

  function addMileStone({
    id,
    title,
    description,
    validation_steps,
    validatorIds,
    totalValidators,
    includeAssetTranfer,
    paymentAmountValidator,
    project_id,
    completed,
    totalFunds,
  }) {
    setMilestones([
      ...milestones,
      {
        id,
        title,
        description,
        validation_steps,
        validatorIds,
        totalValidators,
        includeAssetTranfer,
        paymentAmountValidator,
        project_id,
        completed,
        totalFunds,
      },
    ]);
  }

  function getHeadTitleMilesTone(id) {
    //get the index of the milestone
    //if the id exists get the index for te associated id
    //if not return the last index

    let index = milestones.findIndex((milestone) => milestone.id === id);
    if (index === -1) {
      return "Add Milestone #" + milestones.length;
    }

    return "Edit Milestone #" + (index + 1);
  }

  return (
    <div className="p-4 w-full">
      <div>
        {!addMilestoneDialogIsOpen && (
          <>
            <span className="cursor-pointer">
              <a href="/dashboard/projects/addproject" className="underline">
                View Projects
              </a>
            </span>
            <span className="cursor-pointer ml-2">
              <a href="/dashboard/draftprojects" className="underline">
                View Draft Projects
              </a>
            </span>

            <span className="cursor-pointer ml-2">
              <a className="underline">Save Draft Project</a>
            </span>
          </>
        )}
        {addMilestoneDialogIsOpen && (
          <>
            <span className="cursor-pointer">
              <a
                onClick={() => {
                  setAddMilestoneDialogIsOpen(false);
                }}
                className="underline"
              >
                Back
              </a>
            </span>
          </>
        )}
      </div>
      {!addMilestoneDialogIsOpen && (
        <div className="flex flex-col mt-10">
          <div>Project Title</div>
          <div>
            <input
              onChange={(e) => {
                setProjectTitle(e.target.value);
              }}
              value={projectTitle}
              type="text"
              className="border border-gray-400 p-2 rounded-md w-[60em]"
            />
          </div>

          <div className="mt-[2em]">Description</div>
          <div>
            <textarea
              onChange={(e) => {
                setProjectDescription(e.target.value);
              }}
              value={projectDescription}
              rows={5}
              className="border border-gray-400 p-2 rounded-md w-[60em]"
            />
          </div>

          <div className="mt-[2em]">builder (e-mail)</div>
          <div>
            <input
              onChange={(e) => {
                setBuilder(e.target.value);
              }}
              value={builder}
              type="text"
              className="border border-gray-400 p-2 rounded-md w-[60em]"
            />
          </div>

          <div className="mt-[3em]">Currency</div>
          <div className="flex">
            <a
              onClick={() => {
                setProjectCurrency("euro");
              }}
              className={
                "bg-green-400 p-4 rounded-md cursor-pointer " +
                (projectCurrency === "euro" ? "" : "opacity-50")
              }
            >
              <FaEuroSign size={30} />
            </a>
            <a
              onClick={() => {
                setProjectCurrency("dollar");
              }}
              className={
                "bg-green-400 p-4 rounded-md cursor-pointer ml-4 " +
                (projectCurrency === "dollar" ? "" : "opacity-50")
              }
            >
              <BsCurrencyDollar size={30} />
            </a>
          </div>

          <div className="flex justify-between w-[60em] mt-[3em]">
            <span>Milestones</span>
            <span
              className="cursor-pointer"
              onClick={() => {
                showMilestoneDialog(milestones.length + 1);

                setNewMilestone(getDefaultMilestoneStructure());
              }}
            >
              Add new milestone
            </span>
          </div>
          {[...milestones].reverse().map((milestone, index) => {
            return (
              <div
                key={index}
                className="border border-gray-400 p-4 rounded-md mt-4 w-[60em]"
              >
                <div className="flex justify-between">
                  <span>{milestone.title}</span>
                  <span
                    className="cursor-pointer"
                    onClick={() => {
                      showMilestoneDialog(milestone.id);

                      if (milestonesMap[milestone.id]) {
                        console.log(milestonesMap[milestone.id]);
                        setNewMilestone(milestonesMap[milestone.id]);
                      } else {
                        setNewMilestone(getDefaultMilestoneStructure());
                      }
                    }}
                  >
                    Edit
                  </span>
                </div>
              </div>
            );
          })}

          <div className="flex">
            <a
              onClick={() => saveDraftProject()}
              className="underline mt-10 cursor-pointer"
            >
              Save Draft Project
            </a>

            <a
              onClick={publishProject}
              className="underline mt-10 cursor-pointer ml-8"
            >
              Publish Project
            </a>
          </div>
        </div>
      )}

      {addMilestoneDialogIsOpen && (
        <div className="">
          <h2 className="mb-6">{getHeadTitleMilesTone(newMilestone.id)}</h2>
          <div>Title</div>
          <div>
            <input
              onChange={(e) => {
                setNewMilestone({
                  ...newMilestone,
                  title: e.target.value,
                });
              }}
              value={newMilestone.title}
              type="text"
              className="border border-gray-400 p-2 rounded-md w-[60em]"
            />
          </div>
          <div className="mt-8">Milestone Description</div>
          <div>
            <textarea
              onChange={(e) => {
                setNewMilestone({
                  ...newMilestone,
                  description: e.target.value,
                });
              }}
              value={newMilestone.description}
              rows={5}
              className="border border-gray-400 p-2 rounded-md w-[60em]"
            />
          </div>

          <div className="mt-8">How to validate</div>
          <div>
            <textarea
              onChange={(e) => {
                setNewMilestone({
                  ...newMilestone,
                  validation_steps: e.target.value,
                });
              }}
              rows={5}
              className="border border-gray-400 p-2 rounded-md w-[60em]"
              value={newMilestone.validation_steps ?? ""}
            ></textarea>
          </div>

          <div className="flex items-center mt-8">
            <span>Amount of validators</span>
            <span className="flex justify-center items-center ml-5">
              <span
                onClick={() => {
                  setNewMilestone({
                    ...newMilestone,
                    totalValidators:
                      newMilestone.totalValidators > 0
                        ? newMilestone.totalValidators - 1
                        : 0,
                  });
                }}
                className="flex justify-center items-center rounded-md bg-gray-200 p-2 cursor-pointer"
              >
                <FaMinus />
              </span>
              <input
                type="text"
                className="text-center w-[5em] border border-gray-400 p-2 rounded-md mx-1 "
                onChange={(e) => {
                  setNewMilestone({
                    ...newMilestone,
                    totalValidators: e.target.value,
                  });
                }}
                value={newMilestone.totalValidators}
              />
              <span
                onClick={() => {
                  setNewMilestone({
                    ...newMilestone,
                    totalValidators: newMilestone.totalValidators + 1,
                  });
                }}
                className="rounded-md bg-gray-200 p-2 cursor-pointer"
              >
                <FaPlus />
              </span>
            </span>
          </div>

          <div className="flex items-center mt-8">
            <span>
              validators compensation amount (
              {projectCurrency === "euro" ? "€" : "$"})
            </span>
            <span className="flex ml-4">
              <input
                type="text"
                className="text-center w-[5em] border border-gray-400 p-2 rounded-md"
                onChange={(e) => {
                  setNewMilestone({
                    ...newMilestone,
                    paymentAmountValidator: e.target.value,
                  });
                }}
                value={newMilestone.paymentAmountValidator}
              />
            </span>
          </div>

          <button
            onClick={() => {
              if (!milestonesMap[newMilestone.id]) {
                console.log(
                  "elizeu:_add",
                  milestonesMap[newMilestone.id],
                  newMilestone.id
                );
                addMileStone(newMilestone);
              } else {
                console.log(
                  "elizeu:_not_add",
                  milestonesMap[newMilestone.id],
                  newMilestone.id
                );

                setMilestones([
                  ...milestones.map((milestone) => {
                    if (milestone.id === newMilestone.id) {
                      return newMilestone;
                    }

                    return milestone;
                  }),
                ]);
              }
              setMilestonesMap({
                ...milestonesMap,
                [newMilestone.id]: newMilestone,
              });
              setAddMilestoneDialogIsOpen(false);
              setNewMilestone(getDefaultMilestoneStructure());

              // We udate the next milestone id only if we just adding a new milestone
              if (!milestonesMap[newMilestone.id]) {
                setNextMilestoneId(nextMilestoneId + 1);
              }
            }}
            className="bg-yellow-400 p-4 rounded-md cursor-pointer mt-4"
          >
            {milestonesMap[newMilestone.id]
              ? "Save Milestone"
              : "Add Milestone"}
          </button>
        </div>
      )}
    </div>
  );
}
