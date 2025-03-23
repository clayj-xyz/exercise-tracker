const invoke = window.__TAURI__.core.invoke;

function buildSessionDisplay(session) {
  const sessionElement = document.createElement("div");
  sessionElement.classList.add("session");

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

  return sessionElement;
}

window.addEventListener("DOMContentLoaded", async () => {
  const scheduleContainer = document.getElementById("schedule");

  // Fetch the program data using Tauri command
  const program = await invoke("read_program").then(JSON.parse);

  const name = program.name;
  const nameElement = document.getElementById("program-name");
  nameElement.textContent = name;
  // Render the schedule
  const week = program.schedule[0]; // Assuming only one week for now
  week.days.forEach((day, index) => {
    const sessionName = day.session;
    const session = program.sessions.find(s => s.name === sessionName);
    if (!session) {
      return;
    }

    const dayElement = document.createElement("div");
    dayElement.classList.add("day");

    const dayHeader = document.createElement("div");
    dayHeader.classList.add("day-header");
    const dayName = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"][index];
    dayHeader.textContent = `${dayName} - ${session.name}`;
    dayHeader.appendChild(document.createElement("hr"));
    dayElement.appendChild(dayHeader);

    const sessionElement = buildSessionDisplay(session);
    dayElement.appendChild(sessionElement);

    scheduleContainer.appendChild(dayElement);
  });
});
