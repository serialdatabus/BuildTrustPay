"use client";
import { FaEuroSign } from "react-icons/fa";
import { BsCurrencyDollar } from "react-icons/bs";
import { FaMinus, FaPlus } from "react-icons/fa";

import { useEffect, useState } from "react";

export default function AdProject() {
  const [milestones, setMilestones] = useState([]);
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projectCurrency, setProjectCurrency] = useState("euro");
  const [milestoneToEdit, setMilestoneToEdit] = useState(null);
  const [addMilestoneDialogIsOpen, setAddMilestoneDialogIsOpen] =
    useState(false);

  useEffect(() => {}, []);

  function showMilestoneDialog(index) {
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
              className="border border-gray-400 p-2 rounded-md w-[40em]"
            />
          </div>

          <div>Description</div>
          <div>
            <textarea
              rows={5}
              className="border border-gray-400 p-2 rounded-md w-[40em]"
            />
          </div>

          <div>Currency</div>
          <div className="flex">
            <a className="bg-yellow-400 p-4 rounded-full cursor-pointer">
              <FaEuroSign size={40} />
            </a>
            <a className="bg-yellow-400 p-4 rounded-full ml-4 cursor-pointer">
              <BsCurrencyDollar size={40} />
            </a>
          </div>

          <div className="flex justify-between">
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
              }}
            >
              Add new milestone
            </span>
          </div>
          {milestones.length}
        </div>
      )}

      {addMilestoneDialogIsOpen && (
        <div className="">
          <h2 className="mb-6">Add Milestone #{milestones.length + 1}</h2>
          <div>Title</div>
          <div>
            <input type="text" />
          </div>
          <div>Milestone Description</div>
          <div>
            <input type="text" />
          </div>

          <div>How to validate</div>
          <div>
            <input type="text" />
          </div>

          <div className="flex justify-between w-[30em]">
            <span>Amount of validators</span>
            <span className="flex justify-between">
              <span>
                <FaMinus />
              </span>
              <input type="text" className="text-center w-[5em]" />
              <span>
                <FaPlus />
              </span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
