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
            .select("interviewTitle", "employee", "coach")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));

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
        interviewTitle,
        ...data
    }: z.infer<typeof projectScoreValidation.saveProjectScore>["body"]
) => {
    updateItem(ProjectInterviewsTable, id, {
        completed: FieldValue.arrayUnion(data.userId),
    });

    const score = await getItemById(ProjectScoresTable, id);
    if (score.exists) {
        return await updateItem(ProjectScoresTable, id, {
            [role]: FieldValue.arrayUnion(data),
        });
    }

    return await addItemWithId(ProjectScoresTable, id, {
        projectId,
        interviewTitle,
        [role]: FieldValue.arrayUnion(data),
    });
};
