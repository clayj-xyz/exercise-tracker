import { createSignal, onMount } from "solid-js";
import { readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";

const ProgramName = () => {
    const [name, setName] = createSignal("");

    onMount(async () => {
        const program = await readTextFile(".local/share/exercise-tracker/data/program.json", {
            baseDir: BaseDirectory.Home,
        }).then(JSON.parse);
        setName(program.name);
    });

    return (
        <h1 id="program-name" class="text-center text-3xl font-bold text-gray-800 dark:text-gray-200 mb-6">
            {name()}
        </h1>
    );
};

export default ProgramName;
