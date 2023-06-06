import { z } from "zod";
import { addItemWithId, getCollectionData, getItemById } from "../firebase";
import { interviewValidation } from "../validations";

const ProjectInterviewsTable = "projects-interviews";

export const getInterviews = async () => {
    return (await getCollectionData(ProjectInterviewsTable).get()).docs.map(
        (doc) => ({
            id: doc.id,
            updatedAt: doc.updateTime.toMillis(),
            ...doc.data(),
        })
    );
};

export const getInterviewById = async (projectId: string) => {
    const interview = await getItemById(ProjectInterviewsTable, projectId);
    if (!interview.exists) throw new Error("Interview not found");

    return {
        updatedAt: interview.updateTime?.toMillis(),
        ...(interview.data() as any),
    };
};

export const saveInterview = async (
    id: string,
    data: z.infer<typeof interviewValidation.saveInterview>["body"]
) => {
    return await addItemWithId(ProjectInterviewsTable, id, data);
};
