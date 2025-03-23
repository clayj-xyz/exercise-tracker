const invoke = window.__TAURI__.core.invoke;

window.addEventListener("DOMContentLoaded", async () => {
  const scheduleContainer = document.getElementById("schedule");

  // Fetch the program data using Tauri command
  const program = await invoke("read_program").then(JSON.parse);
  console.log(program);

  // Render the schedule
  const week = program.schedule[0]; // Assuming only one week for now
  week.days.forEach((day, index) => {
    const dayElement = document.createElement("div");
    dayElement.classList.add("day");

    const dayHeader = document.createElement("div");
    dayHeader.classList.add("day-header");
    dayHeader.textContent = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index];
    dayElement.appendChild(dayHeader);

    const sessionName = day.session;
    const session = program.sessions.find(s => s.name === sessionName);

    if (session) {
      const sessionElement = document.createElement("div");
      sessionElement.classList.add("session");
      sessionElement.textContent = session.name;

      session.exercises.forEach(exercise => {
        const exerciseElement = document.createElement("div");
        exerciseElement.classList.add("exercise");

        if (exercise.exercises) {
          // Handle circuits
          exerciseElement.textContent = `${exercise.name}:`;
          exercise.exercises.forEach(subExercise => {
            const subExerciseElement = document.createElement("div");
            subExerciseElement.classList.add("exercise");
            subExerciseElement.textContent = `- ${subExercise.name} (${subExercise.reps} reps)`;
            exerciseElement.appendChild(subExerciseElement);
          });
        } else {
          // Handle regular exercises
          exerciseElement.textContent = `${exercise.name} (${exercise.sets || exercise.distance || exercise.time} ${exercise.reps ? `x ${exercise.reps}` : exercise.units || "sets"
            })`;
        }

        sessionElement.appendChild(exerciseElement);
      });

      dayElement.appendChild(sessionElement);
    }

    scheduleContainer.appendChild(dayElement);
  });
});
