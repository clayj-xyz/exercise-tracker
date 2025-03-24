import { For } from "solid-js";

export const LiftParser = (props: { session: any }) => {
    const { session } = props;

    return (
        <table class="table-auto w-full text-left text-gray-700 dark:text-gray-300">
            <thead>
                <tr class="bg-gray-100 dark:bg-gray-700">
                    <th class="px-4 py-2">Exercise</th>
                    <th class="px-4 py-2">Sets</th>
                    <th class="px-4 py-2">Reps</th>
                </tr>
            </thead>
            <tbody>
                <For each={session.exercises}>
                    {(exercise) =>
                        exercise.exercises ? (
                            <>
                                <tr class="bg-gray-50 dark:bg-gray-800">
                                    <td colSpan={3} class="px-4 py-2 font-semibold">
                                        {exercise.name}
                                    </td>
                                </tr>
                                <For each={exercise.exercises}>
                                    {(subExercise) => (
                                        <tr>
                                            <td class="px-4 py-2">{subExercise.name}</td>
                                            <td class="px-4 py-2">-</td>
                                            <td class="px-4 py-2">{subExercise.reps}</td>
                                        </tr>
                                    )}
                                </For>
                            </>
                        ) : (
                            <tr>
                                <td class="px-4 py-2">{exercise.name}</td>
                                <td class="px-4 py-2">{exercise.sets || "-"}</td>
                                <td class="px-4 py-2">{exercise.reps || "-"}</td>
                            </tr>
                        )
                    }
                </For>
            </tbody>
        </table>
    );
};
