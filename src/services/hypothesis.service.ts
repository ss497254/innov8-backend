import { z } from "zod";
import {
    updateItem,
    getItemById,
    getCollectionData,
    addItemWithId,
} from "../firebase";
import { hypothesisValidation } from "../validations";

const ProjectHypothesesTable = "projects-hypotheses";
const IdeaValidationTableName = "projects-validation";

export const getHypotheses = async () => {
    return (await getCollectionData(ProjectHypothesesTable).get()).docs.map(
        (doc) => ({
            id: doc.id,
            updatedAt: doc.updateTime.toMillis(),
            ...doc.data(),
        })
    );
};

export const getHypothesisById = async (projectId: string) => {
    const project = await getItemById(ProjectHypothesesTable, projectId);
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
    await updateItem(IdeaValidationTableName, id, { hasHypotheses: true });
    return await addItemWithId(ProjectHypothesesTable, id, { hypotheses });
};
