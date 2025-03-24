import { For } from "solid-js";

export const CardioParser = (props: { session: any }) => {
    const { session } = props;

    const columns = ["Exercise"];
    if (session.exercises.some((exercise: any) => exercise.distance)) {
        columns.push("Distance");
    }
    if (session.exercises.some((exercise: any) => exercise.time)) {
        columns.push("Time");
    }

    if (columns.length === 1) {
        throw new Error("Cardio data must have either 'distance' or 'time' keys.");
    }

    return (
        <table class="table-auto w-full text-left text-gray-700 dark:text-gray-300">
            <thead>
                <tr class="bg-gray-100 dark:bg-gray-700">
                    <For each={columns}>
                        {(headerText) => <th class="px-4 py-2">{headerText}</th>}
                    </For>
                </tr>
            </thead>
            <tbody>
                <For each={session.exercises}>
                    {(exercise) => (
                        <tr>
                            <td class="px-4 py-2">{exercise.name}</td>
                            {columns.includes("Distance") && (
                                <td class="px-4 py-2">{exercise.distance ? `${exercise.distance} ${exercise.units || ""}` : "-"}</td>
                            )}
                            {columns.includes("Time") && (
                                <td class="px-4 py-2">{exercise.time ? `${exercise.time} ${exercise.units || ""}` : "-"}</td>
                            )}
                        </tr>
                    )}
                </For>
            </tbody>
        </table>
    );
};
