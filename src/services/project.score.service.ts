import { request } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import {
    addItemWithId,
    getCollectionData,
    getItemById,
    updateItem,
} from "../firebase";
import { projectScoreValidation } from "../validations";

const ProjectScoresTable = "projects-scores";
const ProjectInterviewsTable = "projects-interviews";

export const getScoreByProjectId = async (projectId: string) => {
    const data = (
        await getCollectionData(ProjectScoresTable)
            .where("projectId", "==", projectId)
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }))[0];
    if (!data) throw new Error("Project score not found");

    return data;
};

export const getScoreById = async (interviewId: string) => {
    const score = await getItemById(ProjectScoresTable, interviewId);
    if (!score.exists) throw new Error("Project score not found");

    return {
        updatedAt: score.updateTime?.toMillis(),
        ...(score.data() as any),
    };
};

export const getUserScoreById = async (
    session: (typeof request)["session"],
    interviewId: string
) => {
    const score = await getItemById(ProjectScoresTable, interviewId);
    if (!score.exists) throw new Error("Project score not found");
    session;
    return {
        updatedAt: score.updateTime?.toMillis(),
        score: score
            .data()
            ?.[session.role]?.filter((x: any) => x.userId === session.id)?.[0],
    };
};

export const saveProjectScore = async (
    id: string,
    {
        projectId,
        role,
        ...data
    }: z.infer<typeof projectScoreValidation.saveProjectScore>["body"]
) => {
    await updateItem(ProjectInterviewsTable, id, {
        completed: FieldValue.arrayUnion(data.userId),
    });

    return await addItemWithId(ProjectScoresTable, id, {
        projectId,
        [role]: FieldValue.arrayUnion(data),
    });
};
