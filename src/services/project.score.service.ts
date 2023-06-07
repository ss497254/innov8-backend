import { z } from "zod";
import { addItemWithId, getItemById, updateItem } from "../firebase";
import { projectScoreValidation } from "../validations";

const ProjectScoresTable = "projects-scores";
const ProjectInterviewsTable = "projects-interviews";

export const getScoreByProjectId = async (projectId: string) => {
    const hypotheses = await getItemById(ProjectScoresTable, projectId);
    if (!hypotheses.exists) throw new Error("Hypothesis not found");

    return {
        updatedAt: hypotheses.updateTime?.toMillis(),
        ...(hypotheses.data() as any),
    };
};

export const getScoreById = async (projectId: string) => {
    const hypotheses = await getItemById(ProjectScoresTable, projectId);
    if (!hypotheses.exists) throw new Error("Hypothesis not found");

    return {
        updatedAt: hypotheses.updateTime?.toMillis(),
        ...(hypotheses.data() as any),
    };
};

export const saveProjectScore = async (
    id: string,
    data: z.infer<typeof projectScoreValidation.saveProjectScore>["body"]
) => {
    await updateItem(ProjectInterviewsTable, id, { completed: true });
    return await addItemWithId(ProjectScoresTable, id, data);
};
