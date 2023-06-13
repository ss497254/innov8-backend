import { z } from "zod";
import { employeeService } from ".";
import { ProjectInterviewsTable } from "../constants/table-names";
import { addItem, getCollectionData, getItemById } from "../firebase";
import { interviewValidation } from "../validations";

export const getInterviewsForCoach = async (coachId: string) => {
    return (
        await getCollectionData(ProjectInterviewsTable)
            .where("coach.id", "==", coachId)
            .select(
                "interviewTitle",
                "coach",
                "teamMembers",
                "name",
                "projectId",
                "completed"
            )
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
            .select(
                "interviewTitle",
                "coach",
                "teamMembers",
                "name",
                "projectId",
                "completed"
            )
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const getInterviewById = async (interviewId: string) => {
    const interview = await getItemById(ProjectInterviewsTable, interviewId);
    if (!interview.exists) throw new Error("Interview not found");

    return {
        id: interview.id,
        updatedAt: interview.updateTime?.toMillis(),
        ...(interview.data() as any),
    };
};

export const getInterviewByProjectId = async (projectId: string) => {
    return (
        await getCollectionData(ProjectInterviewsTable)
            .where("projectId", "==", projectId)
            .get()
    ).docs.map((doc) => ({
        id: doc.id,
        updatedAt: doc.updateTime.toMillis(),
        ...doc.data(),
    }));
};

export const saveInterview = async (
    data: z.infer<typeof interviewValidation.saveInterview>["body"]
) => {
    return await addItem(ProjectInterviewsTable, data);
};
