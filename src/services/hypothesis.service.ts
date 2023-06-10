import { z } from "zod";
import { employeeService } from ".";
import {
    updateItem,
    getItemById,
    getCollectionData,
    addItemWithId,
} from "../firebase";
import { hypothesisValidation } from "../validations";

const ProjectHypothesesTable = "projects-hypotheses";
const IdeaValidationTableName = "projects-validation";

export const getProjectsWithHypotheses = async (id: string) => {
    const user = await employeeService.getEmployee(id);

    return (
        await getCollectionData(IdeaValidationTableName)
            .where("hasHypotheses", "==", true)
            .where("teamMembers", "array-contains", user)
            .select("coach", "teamMembers", "name", "elevatorPitch")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const getProjectsWithHypothesesForCoach = async (id: string) => {
    return (
        await getCollectionData(IdeaValidationTableName)
            .where("hasHypotheses", "==", true)
            .where("coach.id", "==", id)
            .select("coach", "teamMembers", "name", "elevatorPitch")
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

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
    const hypotheses = await getItemById(ProjectHypothesesTable, projectId);
    if (!hypotheses.exists) throw new Error("Hypothesis not found");

    return {
        updatedAt: hypotheses.updateTime?.toMillis(),
        ...(hypotheses.data() as any),
    };
};

export const saveHypothesis = async (
    id: string,
    data: z.infer<typeof hypothesisValidation.saveHypothesis>["body"]
) => {
    await updateItem(IdeaValidationTableName, id, { hasHypotheses: true });
    return await addItemWithId(ProjectHypothesesTable, id, data);
};
