import { z } from "zod";
import { addItemWithId, getItemById } from "../firebase";
import { projectScoreValidation } from "../validations";

const ProjectScoresTable = "projects-scores";

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
    return await addItemWithId(ProjectScoresTable, id, data);
};
