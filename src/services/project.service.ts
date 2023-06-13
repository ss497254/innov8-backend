import { z } from "zod";
import { employeeService } from ".";
import {
    JUDGE_ASSIGN,
    COACH_REVIEW,
    JUDGE_REVIEW,
    RATING_COMPLETED,
    DRAFT,
    COACH_ASSIGN,
} from "../constants/project-status";
import {
    IdeaGenerationTable,
    IdeaScreeningTable,
    IdeaValidationTable,
} from "../constants/table-names";
import {
    addItem,
    addItemWithId,
    deleteItem,
    getCollectionData,
    getItemById,
    updateItem,
} from "../firebase";
import { removeKey } from "../utils/lodash";
import { projectValidation } from "../validations";

export const getProjectsById = async (projectId: string) => {
    const project = await getItemById(IdeaScreeningTable, projectId);
    if (!project.exists) throw new Error("Project not found");

    return {
        updatedAt: project.updateTime?.toMillis(),
        ...(project.data() as any),
    };
};

export const getProjectsFromValidation = async () => {
    return (
        await getCollectionData(IdeaValidationTable)
            .select("name", "elevatorPitch", "teamMembers", "status")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const getProjectsByIdFromValidation = async (projectId: string) => {
    const project = await getItemById(IdeaValidationTable, projectId);
    if (!project.exists) throw new Error("Project not found");

    return {
        updatedAt: project.updateTime?.toMillis(),
        ...(project.data() as any),
    };
};

/* 

ADMIN PROJECT SERVICES

 */
export const getProjectsForAdmin = async () => {
    return (
        await getCollectionData(IdeaScreeningTable)
            .select("name", "elevatorPitch", "teamMembers", "status")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const addJudgeToProject = async (
    projectId: string,
    judge: z.infer<typeof projectValidation.addJudgeToProject>["body"]["judge"]
) => {
    return await updateItem(IdeaScreeningTable, projectId, {
        judge,
        status: JUDGE_REVIEW,
    });
};

export const addCoachToProject = async (
    projectId: string,
    coach: z.infer<typeof projectValidation.addCoachToProject>["body"]["coach"]
) => {
    return await updateItem(IdeaValidationTable, projectId, {
        coach,
        status: COACH_REVIEW,
    });
};

/* 

JUDGE PROJECT SERVICES

 */
export const getProjectsForJudge = async (judgeId: string) => {
    return (
        await getCollectionData(IdeaScreeningTable)
            .where("judge.id", "==", judgeId)
            .select("name", "elevatorPitch", "teamMembers", "status")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const addReviewToProject = async (
    projectId: string,
    data: z.infer<typeof projectValidation.addReviewToProject>["body"]
) => {
    return await updateItem(IdeaScreeningTable, projectId, {
        status: RATING_COMPLETED,
        ...data,
    });
};

/* 

COACH PROJECT SERVICES

 */
export const getProjectsForCoach = async (coachId: string) => {
    return (
        await getCollectionData(IdeaValidationTable)
            .where("coach.id", "==", coachId)
            .select("name", "elevatorPitch", "teamMembers", "status")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const addReviewToProjectCoach = async (
    projectId: string,
    data: z.infer<typeof projectValidation.addReviewToProject>["body"]
) => {
    return await updateItem(IdeaValidationTable, projectId, {
        status: RATING_COMPLETED,
        ...data,
    });
};

/* 

EMPLOYEE PROJECT SERVICES

 */
export const getProjectsFromValidationForEmployee = async (id: string) => {
    const user = await employeeService.getEmployee(id);

    return (
        await getCollectionData(IdeaValidationTable)
            .select("name", "elevatorPitch", "teamMembers", "status")
            .where("teamMembers", "array-contains", user)
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const getProjectsForEmployee = async (id: string) => {
    const user = await employeeService.getEmployee(id);

    return (
        await getCollectionData(IdeaScreeningTable)
            .select("name", "elevatorPitch", "teamMembers", "status")
            .where("teamMembers", "array-contains", user)
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const getProjectsFromDraft = async (id: string) => {
    const user = await employeeService.getEmployee(id);

    return (
        await getCollectionData(IdeaGenerationTable)
            .select("name", "elevatorPitch", "teamMembers", "status")
            .where("teamMembers", "array-contains", user)
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const getProjectsByIdFromDraft = async (projectId: string) => {
    const project = await getItemById(IdeaGenerationTable, projectId);
    if (!project.exists) throw new Error("Project not found");

    return project.data();
};

export const addProjectForIdeaValidation = async (projectId: string) => {
    const project = await getProjectsById(projectId);

    if (project.overallRating < 4) throw new Error("Project has low rating");

    await deleteItem(IdeaScreeningTable, projectId);

    project.status = COACH_ASSIGN;
    return await addItemWithId(
        IdeaValidationTable,
        projectId,
        removeKey("updatedAt", project)
    );
};

export const saveProject = async (
    type: z.infer<typeof projectValidation.saveProject>["body"]["type"],
    data: z.infer<typeof projectValidation.saveProject>["body"]["data"]
) => {
    if (type === "draft") {
        //@ts-ignore
        data.status = DRAFT;
        return await addItem(IdeaGenerationTable, data);
    } else if (type === "submit") {
        //@ts-ignore
        data.status = JUDGE_ASSIGN;
        return await addItem(IdeaScreeningTable, data);
    }

    throw new Error("Invalid form type");
};

export const updateProject = async (
    type: z.infer<typeof projectValidation.updateProject>["body"]["type"],
    id: string,
    data: z.infer<typeof projectValidation.updateProject>["body"]["data"]
) => {
    if (type === "draft") {
        //@ts-ignore
        data.status = DRAFT;
        return await updateItem(IdeaGenerationTable, id, data);
    } else if (type === "submit") {
        await deleteItem(IdeaGenerationTable, id);
        //@ts-ignore
        data.status = JUDGE_ASSIGN;
        return await addItemWithId(IdeaScreeningTable, id, data);
    }

    throw new Error("Invalid form type");
};
