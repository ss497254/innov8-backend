import { z } from "zod";
import { updateItem, getItemById } from "../firebase";
import { hypothesisValidation } from "../validations";

const HypothesisTableName = "projects-hypothesis";

export const getHypothesisById = async (projectId: string) => {
    const project = await getItemById(HypothesisTableName, projectId);
    if (!project) throw new Error("Hypothesis not found");

    return project;
};

export const saveHypothesis = async (
    id: string,
    hypotheses: z.infer<
        typeof hypothesisValidation.saveHypothesis
    >["body"]["hypotheses"]
) => {
    return await updateItem(HypothesisTableName, id, { hypotheses });
};
