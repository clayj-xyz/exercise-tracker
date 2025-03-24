import { createSignal, onMount } from "solid-js";
import { readTextFile, BaseDirectory } from '@tauri-apps/plugin-fs';

const computeVariableValue = (value: any, variables: Record<string, any>) => {
    if (typeof value !== "string") {
        return value;
    }
    if (value.startsWith("${") && value.endsWith("}")) {
        const expression = value.slice(2, -1);
        return Function(...Object.keys(variables), `return ${expression}`)(...Object.values(variables).map(v => v.value));
    }
    return value;
};

const Variables = () => {
    const [variables, setVariables] = createSignal<Record<string, any>>({});

    onMount(async () => {
        const vars = await readTextFile(".local/share/exercise-tracker/data/variables.json", {
            baseDir: BaseDirectory.Home,
        }).then(JSON.parse);
        setVariables(vars);
    });

    return (
        <div id="variables" class="flex flex-col gap-6 items-center">
            <div class="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-full max-w-2xl">
                <div class="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                    Variables
                    <hr class="border-gray-300 dark:border-gray-600 mt-2" />
                </div>
                {Object.entries(variables()).map(([key, data]) => (
                    <div class="text-gray-700 dark:text-gray-300">
                        {`${key}: ${computeVariableValue(data.value, variables())}`}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Variables;
