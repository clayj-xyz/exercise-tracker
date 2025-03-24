import { createSignal, onMount } from "solid-js";
import { readTextFile, BaseDirectory } from "@tauri-apps/plugin-fs";
import { LiftParser } from "./LiftParser";
import { CardioParser } from "./CardioParser";

const Schedule = () => {
    const [schedule, setSchedule] = createSignal<any[]>([]);

    onMount(async () => {
        const program = await readTextFile(".local/share/exercise-tracker/data/program.json", {
            baseDir: BaseDirectory.Home,
        }).then(JSON.parse);
        const week = program.schedule[0]; // Assuming only one week for now
        const sessions = program.sessions;
        const days = week.days.map((day: any, index: number) => ({
            dayName: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index],
            session: sessions.find((s: any) => s.name === day.session),
        }));
        setSchedule(days);
    });

    return (
        <section id="schedule" class="calendar flex flex-col gap-6 items-center mt-8">
            {schedule().map(({ dayName, session }) => (
                <div class="day bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 w-full max-w-2xl">
                    <div class="day-header text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
                        {dayName} - {session.name}
                        <hr class="border-gray-300 dark:border-gray-600 mt-2" />
                    </div>
                    <div class="session">
                        {session.parser === "default_lift" && <LiftParser session={session} />}
                        {session.parser === "default_cardio" && <CardioParser session={session} />}
                    </div>
                </div>
            ))}
        </section>
    );
};

export default Schedule;
