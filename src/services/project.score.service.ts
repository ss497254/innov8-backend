import { request } from "express";
import { FieldValue } from "firebase-admin/firestore";
import { z } from "zod";
import {
    ProjectInterviewsTable,
    ProjectScoresTable,
} from "../constants/table-names";
import {
    addItemWithId,
    getCollectionData,
    getItemById,
    updateItem,
} from "../firebase";
import pickProperty from "../utils/pickProperty";
import { projectScoreValidation } from "../validations";

export const getScoreByProjectId = async (projectId: string) => {
    const data = (
        await getCollectionData(ProjectScoresTable)
            .where("projectId", "==", projectId)
            .select(
                "interviewTitle",
                "employee",
                "coach",
                "average",
                "variance"
            )
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

    return {
        updatedAt: score.updateTime?.toMillis(),
        score: score
            .data()
            ?.[session.role]?.find((x: any) => x.userId === session.id),
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

    const empty = {
        score: data.score.map((x) => ({
            ...x,
            questions: Array(x.questions.length).fill(0),
        })),
        overallRating: 0,
    };

    const res = await getItemById(ProjectScoresTable, id);
    if (res.exists) {
        const kabil = res.data()!;

        if (role === "employee") {
            const totalEmployees = kabil.employee.length;
            const average = {
                score: data.score.map((x, idx) => ({
                    ...x,
                    questions: x.questions.map(
                        (y, idy) =>
                            kabil.average.score[idx].questions[idy] +
                            (y - kabil.average.score[idx].questions[idy]) /
                                (totalEmployees + 1)
                    ),
                })),
                overallRating:
                    kabil.average.overallRating +
                    (data.overallRating - kabil.average.overallRating) /
                        (totalEmployees + 1),
            };

            const variance = empty;

            kabil.employee.forEach((e: typeof data) => {
                variance.overallRating +=
                    (e.overallRating - average.overallRating) ** 2;

                e.score.forEach((x, idx) =>
                    x.questions.forEach((y, idy) => {
                        variance.score[idx].questions[idy] +=
                            (y - average.score[idx].questions[idy]) ** 2;
                    })
                );
            });

            if (totalEmployees > 1) {
                variance.overallRating /= totalEmployees;

                variance.score.forEach((x) => ({
                    ...x,
                    questions: x.questions.map((y) => y / totalEmployees),
                }));
            }

            return await updateItem(ProjectScoresTable, id, {
                [role]: FieldValue.arrayUnion(data),
                average,
                variance,
            });
        } else {
            return await updateItem(ProjectScoresTable, id, {
                [role]: FieldValue.arrayUnion(data),
            });
        }
    }

    return await addItemWithId(ProjectScoresTable, id, {
        projectId,
        interviewTitle,
        [role]: FieldValue.arrayUnion(data),
        average:
            role === "employee"
                ? pickProperty(data, ["score", "overallRating"])
                : empty,
        variance: empty,
    });
};
