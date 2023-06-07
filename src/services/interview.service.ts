import { z } from "zod";
import { employeeService } from ".";
import {
    addItemWithId,
    addOrUpdateItem,
    getCollectionData,
    getItemById,
} from "../firebase";
import { interviewValidation } from "../validations";

const ProjectInterviewsTable = "projects-interviews";

export const getInterviewsForCoach = async (coachId: string) => {
    return (
        await getCollectionData(ProjectInterviewsTable)
            .where("coach.id", "==", coachId)
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const getInterviews = async (employeeId: string) => {
    const user = await employeeService.getEmployee(employeeId);

    return (
        await getCollectionData(ProjectInterviewsTable)
            .where("teamMembers", "array-contains", user)
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
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
    return await addOrUpdateItem(ProjectInterviewsTable, id, data);
};
