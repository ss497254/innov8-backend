import { z } from "zod";
import { updateItem, getItemById } from "../firebase";
import { hypothesisValidation } from "../validations";

const IdeaValidationTableName = "projects-validation";

export const getHypothesisById = async (projectId: string) => {
    const project = await getItemById(IdeaValidationTableName, projectId);
    if (!project.id) throw new Error("Hypothesis not found");

    return {
        updatedAt: project.updateTime?.toMillis(),
        ...(project.data() as any),
    };
};

export const saveHypothesis = async (
    id: string,
    hypotheses: z.infer<
        typeof hypothesisValidation.saveHypothesis
    >["body"]["hypotheses"]
) => {
    return await updateItem(IdeaValidationTableName, id, { hypotheses });
};
