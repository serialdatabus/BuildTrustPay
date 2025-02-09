// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract SmartPayConstruction {
    string public agencyId = "agency";

//This struc is used to store the information about the stage of the project
    struct Stage {
        string stage_id;
        string title; // IPFS link ID that contains the description
        string description; // IPFS link ID that contains the description
        string validation_steps; // IPFS link ID that contains the description
        uint256 value; // value to pay based on currency
        string[] validators_ids; // List of validors that need to approve the milestone
        string[] validations; // List of validators that already validated
        uint256 totalValidators; // Number of validators for this stage
        uint256 amountToValidator; //The total ammount that we should pay to the validator
        bool completed;
    }

    /*
    Exaple params stages:
    [[["stage1","Design Phase","QmHashDescription1","QmHashSteps1",1000,["Validator1","Validator2"],["Validator1"],2,500,false],["stage2","Implementation Phase","QmHashDescription2","QmHashSteps2",2000,["Validator3","Validator4"],[],2,1000,false]]
    */
// This struct is used to store the information about the project
    struct Project {
        string project_id;
        string name;
        string description;
        string client_id;
        string contractor;
        uint256 creationDate;
        uint256 startDate;
        uint256 endDate;
        uint256 actualCompletionDate;
        bool closed;
        Stage[] stages; // Modificado para array em vez de mapping
    }

    mapping(string => Project) public projects;
    string[] public projectIds;
// This event is used to notify when a new project is created and c

    event StageAdded(uint256 projectId, uint256 stageId, string description, uint256 value);
    event StageValidated(uint256 projectId, uint256 stageId, string validatorID);
    event ProjectClosed(uint256 id);
    event PaymentProcessed(uint256 projectId, uint256 stageId, uint256 amount);
/**
 * The createProject function is responsible for creating a new project in the smart 
 * contract. It receives several parameters that define the project's properties, 
 * such as ID, name, description, client ID, contractor, start and end dates, and a 
 * list of stages.
*/
    function createProject(
        string memory _project_id,
        string memory _name,
        string memory _description,
        string memory _client_id,
        string memory _contractor,
        uint256 _startDate,
        uint256 _endDate,
        Stage[] memory _stages
    ) external {
        Project storage p = projects[_project_id];
        p.name = _name;
        p.description = _description;
        p.project_id = _project_id;
        p.client_id = _client_id;
        p.contractor = _contractor;
        p.creationDate = block.timestamp;
        p.startDate = _startDate;
        p.endDate = _endDate;
        p.closed = false;
        p.actualCompletionDate = 0;
        projectIds.push(_project_id);

        for (uint256 i = 0; i < _stages.length; i++) {
            p.stages.push(_stages[i]);

            //by default the contractro is one of the entities allowed to validate
            //so techniclly the milestone / stages are validatd
            //when all the entities that are allowed to valdiate validate the stage
            p.stages[i].validators_ids.push(_contractor);
        }
    }

/**
 * The getStageById function is responsible for retrieving a specific stage of a project, 
 * given the project ID and the stage ID.
 * It is useful for viewing the progress and details of the stages of a project created 
 * by the createProject function.
*/

    function getStageById(string memory projectId, string memory stageId)
        public
        view
        returns (Stage memory s, bool found, uint256)
    {
        Project memory selectedProject = projects[projectId];

        Stage memory tmpStage;

        for (uint256 i = 0; i < selectedProject.stages.length; i++) {
            tmpStage = selectedProject.stages[i];

            if (compareStrings(stageId, tmpStage.stage_id)) {
                return (tmpStage, true, i);
            }
        }
        revert("Stage not found");
    }

/** 
 * Returns the number of phases in a project.
 * Useful for getting an overview of the size and complexity of a project.
*/
    function getStagesCount(string memory projectId) external view returns (uint256) {
        return projects[projectId].stages.length;
    }

/**
 * Checks whether a phase has been validated by a specific validator.
 * Ensures that only authorized validators can validate phases, maintaining the integrity of the validation process.
*/
    function isStageValidatedByValidator(
        string memory _project_id,
        string memory _stage_id,
        string memory _validator_id
    ) public view returns (bool) {
        (Stage memory _stage,,) = getStageById(_project_id, _stage_id);

        for (uint256 i = 0; i < _stage.validations.length; i++) {
            //If already validated returns true
            if (compareStrings(_validator_id, _stage.validations[i])) {
                return true;
            }
        }
        return false;
    }
/**
 * Checks whether a validator is authorized to validate a phase.
 * Maintains the security and compliance of the validation process by ensuring that only authorized 
 * validators can validate.
*/
    function isValidatorAllowedToValidate(
        string memory _project_id,
        string memory _stage_id,
        string memory _validator_id
    ) public view returns (bool) {
        (Stage memory _stage,,) = getStageById(_project_id, _stage_id);

        for (uint256 i = 0; i < _stage.validators_ids.length; i++) {
            //If already validated returns true
            if (compareStrings(_validator_id, _stage.validators_ids[i])) {
                return true;
            }
        }
        return false;
    }
/**
 * Adds a validator to a phase.
 * Allows for expansion of the list of validators, ensuring there are enough validators to validate a phase.
*/
    function addValidator(string memory _project_id, string memory _stage_id, string memory _validator_id) public {
        Project storage _project = projects[_project_id];
        // (,, uint256 stageIndex) = getStageById(_project_id, _project_id);
        (,, uint256 stageIndex) = getStageById(_project_id, _stage_id);

        Stage storage _stage = _project.stages[stageIndex];

        //vetify if the was already added
        require(isValidatorAllowedToValidate(_project_id, _stage_id, _validator_id), "validator was already added");

        //verify if we can still add validators if still there is not enough validators
        require(!isThereEnoughValidators(_project_id, _stage_id), "Already enough validators to validate the stage");

        _stage.validators_ids.push(_validator_id);
    }
/**
 * Checks if there are enough validators to validate a phase.
 * Ensures that a phase has enough validators before allowing validations, ensuring the integrity of the process.
*/
    function isThereEnoughValidators(string memory _project_id, string memory _stage_id) public view returns (bool) {
        return getTotalValidators(_project_id, _stage_id) >= getMaxTotalValidators(_project_id, _stage_id);
    }
/**
 * Adds multiple validators to a phase.
 * Facilitates bulk addition of validators, speeding up the validator setup process.
*/
    function addValidators(string memory _project_id, string memory _stage_id, string[] memory _validators_ids)
        public
    {
        for (uint256 i = 0; i < _validators_ids.length; i++) {
            addValidator(_project_id, _stage_id, _validators_ids[i]);
        }
    }
/**
 * Checks whether a validator has already been added to a phase.
 * Avoids duplication of validators, ensuring the efficiency of the validation process.
*/
    function validatorWasAlreadyAdded(string memory _project_id, string memory _stage_id, string memory _validator_id)
        public
        view
        returns (bool)
    {
        string[] memory valiators_ids = getValidatorsIds(_project_id, _stage_id);

        for (uint256 i = 0; i < valiators_ids.length; i++) {
            //If already validated returns true
            if (compareStrings(_validator_id, valiators_ids[i])) {
                return true;
            }
        }

        return false;
    }
/**
 * Returns the list of validator IDs for a phase.
 * Provides information about the validators in a phase, essential for audits and verifications.
*/
    function getValidatorsIds(string memory _project_id, string memory _stage_id)
        public
        view
        returns (string[] memory)
    {
        (Stage memory _stage,,) = getStageById(_project_id, _stage_id);
        return _stage.validators_ids;
    }

/**
 * Returns the total number of validations for a phase.
 * Used to monitor the validation progress of a phase, ensuring that all required validations are performed.
*/
    function getTotalValidators(string memory _project_id, string memory _stage_id) public view returns (uint256) {
        (Stage memory _stage,,) = getStageById(_project_id, _stage_id);
        return _stage.validations.length;
    }
/**
 * Returns the maximum number of validators required for a phase.
 * Sets the limit of validations required to complete a phase, ensuring that all validations are performed 
 * before proceeding.
*/
    function getMaxTotalValidators(string memory _project_id, string memory _stage_id) public view returns (uint256) {
        (Stage memory _stage,,) = getStageById(_project_id, _stage_id);
        return _stage.totalValidators;
    }

/**
 * Adds a new phase to an existing project.
 * Allows you to expand a project with new phases, essential for evolving projects. 
*/
    function addStage(string memory projectId, Stage memory _stage) external {
        projects[projectId].stages.push(_stage);
    }

/**
 * Used internally to compare project IDs and phases, ensuring accuracy of operations.
*/
    function compareStrings(string memory a, string memory b) public pure returns (bool) {
        return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
    }


/**
 * Validates a phase by a validator.
 * Updates the validation status of a phase, essential for the progress of the project.
*/
    function validateStage(string memory _project_id, string memory _stage_id, string memory _validator_id) external {
        Stage storage _stage;

        (,, uint256 stageIndex) = getStageById(_project_id, _stage_id);

        //get the proper stage from the selected project id
        _stage = projects[_project_id].stages[stageIndex];

        require(
            isValidatorAllowedToValidate(_project_id, _stage_id, _validator_id), "Validator is not allowed to validate"
        );

        // we add +1 because the contractor shoud validate a well
        require(_stage.validations.length < _stage.totalValidators + 1, "Already validated");

        //verify if validator alreadyvalidated the stage, if yes it should reert
        require(!isStageValidatedByValidator(_project_id, _stage_id, _validator_id), "Cant validate more than once");

        //validate the stage
        _stage.validations.push(_validator_id);
    }
/**
 * Processes pending payments for a stage (implementation not provided).
 * Related to paying validators after stage validation, crucial for financial compensation.
*/
    function processPendingPayments(uint256 projectId, uint256 stageId) external {}

/**
 * Closes a project (implementation not provided).
 * Marks a project as complete, essential to the project lifecycle.
*/
    function closeProject(uint256 projectId) external {}

/**
 * Returns all project IDs.
 * Provides an overview of all existing projects, useful for management and auditing.
*/
    function getAllProjectIds() external view returns (string[] memory) {
        return projectIds;
    }
/**
 * Returns all projects.
 * Provides complete details of all projects, essential for visualization and analysis.
*/
    function getProjects() external view returns (Project[] memory) {
        Project[] memory _projects = new Project[](projectIds.length);
        for (uint256 i = 0; i < projectIds.length; i++) {
            _projects[i] = projects[projectIds[i]];
        }
        return _projects;
    }

/**
 * Returns the total count of projects.
 * Provides a metric of how many projects there are, useful for reporting and data analysis.
*/
    function getProjectsCount() external view returns (uint256) {
        return projectIds.length;
    }
}
