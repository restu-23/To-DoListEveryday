// Meminta izin notifikasi
if ("Notification" in window && Notification.permission !== "granted") {
  Notification.requestPermission();
}

const taskInput = document.getElementById("taskInput");
const deadlineInput = document.getElementById("deadlineInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");

let tasks = [];

addBtn.addEventListener("click", () => {
  const taskText = taskInput.value.trim();
  const deadline = deadlineInput.value;

  if (taskText === "" || deadline === "") {
    alert("Harap isi tugas dan waktu deadline!");
    return;
  }

  const task = {
    text: taskText,
    deadline: new Date(deadline),
    completed: false
  };

  tasks.push(task);
  renderTasks();
  scheduleNotification(task);

  taskInput.value = "";
  deadlineInput.value = "";
});

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.toggle("completed", task.completed);

    const text = document.createElement("span");
    text.textContent = task.text;

    const time = document.createElement("span");
    time.classList.add("deadline");
    time.textContent = `⏰ ${task.deadline.toLocaleString()}`;

    const completeBtn = document.createElement("button");
    completeBtn.textContent = "✔";
    completeBtn.onclick = () => {
      task.completed = !task.completed;
      renderTasks();
    };

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = () => {
      tasks.splice(index, 1);
      renderTasks();
    };

    li.appendChild(text);
    li.appendChild(time);
    li.appendChild(completeBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Fungsi untuk menjadwalkan notifikasi 30 menit sebelum deadline
function scheduleNotification(task) {
  const now = new Date();
  const thirtyMinutes = 30 * 60 * 1000; // 30 menit dalam ms
  const notifyTime = new Date(task.deadline - thirtyMinutes);

  const timeout = notifyTime - now;

  if (timeout > 0) {
    setTimeout(() => {
      if (Notification.permission === "granted" && !task.completed) {
        new Notification("⏰ Pengingat To-Do List", {
          body: `Tugas "${task.text}" akan berakhir dalam 30 menit!`,
          icon: "https://cdn-icons-png.flaticon.com/512/1029/1029132.png"
        });
      }
    }, timeout);
  }
}
