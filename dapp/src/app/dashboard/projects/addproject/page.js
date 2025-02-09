"use client";
import { FaEuroSign } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";

import { useEffect, useState } from "react";

export default function AdProject() {
  const [milestones, setMilestones] = useState([]);
  const [milestonesMap, setMilestonesMap] = useState({});
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCurrency, setProjectCurrency] = useState("euro");
  const [milestoneToEdit, setMilestoneToEdit] = useState(null);
  const [addMilestoneDialogIsOpen, setAddMilestoneDialogIsOpen] =
    useState(false);
  const [newMilestone, setNewMilestone] = useState(
    getDefaultMilestoneStructure()
  );

  useEffect(() => {}, []);

  function showMilestoneDialog(id) {
    setAddMilestoneDialogIsOpen(true);
  }

  function addMileStone({
    id,
    title,
    description,
    validationsteps,
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
        validationsteps,
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
              <a className="underline">View Draft Projects</a>
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
              type="text"
              className="border border-gray-400 p-2 rounded-md w-[60em]"
            />
          </div>

          <div className="mt-[5em]">Description</div>
          <div>
            <textarea
              rows={5}
              className="border border-gray-400 p-2 rounded-md w-[60em]"
            />
          </div>

          <div className="mt-[3em]">Currency</div>
          <div className="flex">
            <a onClick={
              () => {
                setProjectCurrency("euro");
              }
            } className={"bg-green-400 p-4 rounded-md cursor-pointer "+ (projectCurrency === "euro" ? "" : "opacity-50")}>
              <FaEuroSign size={30} />
            </a>
            <a onClick={
              () => {
                setProjectCurrency("dollar");
              }
            } className={"bg-green-400 p-4 rounded-md cursor-pointer ml-4 "+ (projectCurrency === "dollar" ? "" : "opacity-50")}>
              <BsCurrencyDollar size={30} />
            </a>
          </div>

          <div className="flex justify-between w-[60em] mt-[3em]">
            <span>Milestones</span>
            <span
              className="cursor-pointer"
              onClick={() => {
                // addMileStone({
                //     id: milestones.length + 1,
                //     title: "",
                //     description: "",
                //     validationsteps: [],
                //     validatorIds: [],
                //     totalValidators: 0,
                //     includeAssetTranfer: false,
                //     paymentAmountValidator: 0,
                //     project_id: 0,
                //     completed: false,
                //     totalFunds: 0
                // })

                // setMilestoneToEdit(milestones.length + 1);

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

          <a className="underline mt-10">Save Draft Project</a>
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
                  validationsteps: e.target.value,
                });
              }}
              rows={5}
              className="border border-gray-400 p-2 rounded-md w-[60em]"
              value={newMilestone.validationsteps ?? ""}
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


                setMilestones([ ...milestones.map((milestone) => {
                  if (milestone.id === newMilestone.id) {
                    return newMilestone;
                  }

                  return milestone;
                })]);

              }
              setMilestonesMap({
                ...milestonesMap,
                [newMilestone.id]: newMilestone,
              });
              setAddMilestoneDialogIsOpen(false);
              setNewMilestone(getDefaultMilestoneStructure());
            }}
            className="bg-yellow-400 p-4 rounded-md cursor-pointer mt-4"
          >
            { milestonesMap[newMilestone.id] ? "Save Milestone" : "Add Milestone"}
          </button>
        </div>
      )}
    </div>
  );
}

function getDefaultMilestoneStructure() {
  return {
    id: Date.now(),
    title: "",
    description: "",
    validationsteps: [],
    validatorIds: [],
    totalValidators: 0,
    includeAssetTranfer: false,
    paymentAmountValidator: 0,
    project_id: "",
    completed: false,
    totalFunds: 0,
  };
}
