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
    addItem,
    addItemWithId,
    deleteItem,
    getCollectionData,
    getItemById,
    updateItem,
} from "../firebase";
import { projectValidation } from "../validations";

const IdeaGenerationTableName = "projects-generation";
const IdeaScreeningTableName = "projects-screening";
const IdeaValidationTableName = "projects-validation";

export const getProjectsById = async (projectId: string) => {
    const project = await getItemById(IdeaScreeningTableName, projectId);
    if (!project) throw new Error("Project not found");

    return project;
};

/* 

ADMIN PROJECT SERVICES

 */
export const getProjectsForAdmin = async () => {
    return (
        await (await getCollectionData(IdeaScreeningTableName))
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
    return await updateItem(IdeaScreeningTableName, projectId, {
        judge,
        status: JUDGE_REVIEW,
    });
};

export const addCoachToProject = async (
    projectId: string,
    coach: z.infer<typeof projectValidation.addCoachToProject>["body"]["coach"]
) => {
    return await updateItem(IdeaScreeningTableName, projectId, {
        coach,
        status: COACH_REVIEW,
    });
};

/* 

JUDGE PROJECT SERVICES

 */
export const getProjectsForJudge = async (judgeId: string) => {
    return (
        await (await getCollectionData(IdeaScreeningTableName))
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
    return await updateItem(IdeaScreeningTableName, projectId, {
        status: RATING_COMPLETED,
        ...data,
    });
};

/* 

EMPLOYEE PROJECT SERVICES

 */
export const getProjectsFromValidation = async (id: string) => {
    const user = await employeeService.getEmployee(id);

    return (
        await (await getCollectionData(IdeaValidationTableName))
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
        await (await getCollectionData(IdeaScreeningTableName))
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
        await (await getCollectionData(IdeaGenerationTableName))
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
    const project = await getItemById(IdeaGenerationTableName, projectId);
    if (!project) throw new Error("Project not found");

    return project;
};

export const getProjectsByIdFromValidation = async (projectId: string) => {
    const project = await getItemById(IdeaValidationTableName, projectId);
    if (!project) throw new Error("Project not found");

    return project;
};

export const addProjectForIdeaValidation = async (projectId: string) => {
    const project = await getProjectsById(projectId);

    if (project.overallRating < 4) throw new Error("Project has low rating");

    await deleteItem(IdeaScreeningTableName, projectId);

    project.status = COACH_ASSIGN;
    return await addItemWithId(IdeaValidationTableName, projectId, project);
};

export const saveProject = async (
    type: z.infer<typeof projectValidation.saveProject>["body"]["type"],
    data: z.infer<typeof projectValidation.saveProject>["body"]["data"]
) => {
    if (type === "draft") {
        //@ts-ignore
        data.status = DRAFT;
        return await addItem(IdeaGenerationTableName, data);
    } else if (type === "submit") {
        //@ts-ignore
        data.status = JUDGE_ASSIGN;
        return await addItem(IdeaScreeningTableName, data);
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
        return await updateItem(IdeaGenerationTableName, id, data);
    } else if (type === "submit") {
        await deleteItem(IdeaGenerationTableName, id);
        //@ts-ignore
        data.status = JUDGE_ASSIGN;
        return await addItemWithId(IdeaScreeningTableName, id, data);
    }

    throw new Error("Invalid form type");
};
