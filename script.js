 <!-- 🌸 Bagian JavaScript -->
  <script>
    // -------------------------------
    // 💾 Inisialisasi Data
    // -------------------------------
    // Ambil data tugas dari localStorage (kalau ada)
    let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

    // Ambil elemen <ul> tempat daftar tugas akan ditampilkan
    const listElement = document.getElementById("taskList");

    // Saat halaman dimuat, tampilkan daftar tugas & minta izin notifikasi
    window.onload = () => {
      renderTasks();
      requestNotificationPermission();
    };

 // -------------------------------
    // ✏ Fungsi Menambah Tugas
    // -------------------------------
    function addTask() {
      const taskInput = document.getElementById("taskInput");
      const taskTime = document.getElementById("taskTime");
      const taskCategory = document.getElementById("taskCategory");

      // Cek apakah input kosong
      if (!taskInput.value.trim()) {
        alert("Tulis dulu tugasnya ya 💕");
        return;
      }

      // Buat objek tugas baru
      const task = {
        text: taskInput.value,  // isi tugas
        time: taskTime.value,   // waktu
        category: taskCategory.value, // kategori
        done: false,            // status selesai
      };
  // Tambahkan ke daftar tugas
      taskList.push(task);

      // Simpan ke localStorage
      saveTasks();

      // Tampilkan ulang daftar
      renderTasks();

      // Jika ada waktu, jadwalkan notifikasi
      if (task.time) scheduleNotification(task);

      // Kosongkan input
      taskInput.value = "";
      taskTime.value = "";
    }

 // -------------------------------
    // ✅ Fungsi Menandai Selesai / Belum
    // -------------------------------
    function toggleDone(index) {
      taskList[index].done = !taskList[index].done;
      saveTasks();
      renderTasks();
    }

    // -------------------------------
    // ❌ Fungsi Menghapus Tugas
    // -------------------------------
    function deleteTask(index) {
      taskList.splice(index, 1); // hapus 1 item dari array
      saveTasks();
      renderTasks();
    }
  // -------------------------------
    // 💾 Fungsi Menyimpan ke localStorage
    // -------------------------------
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(taskList));
    }

    // -------------------------------
    // 📋 Fungsi Menampilkan Daftar Tugas
    // -------------------------------
    function renderTasks() {
      listElement.innerHTML = ""; // bersihkan dulu list-nya

      // Loop setiap tugas dan tampilkan
      taskList.forEach((task, index) => {
        const li = document.createElement("li");
        li.className = task.done ? "done" : "";
  // Gunakan innerHTML agar teks + tombol tampil
        li.innerHTML = `
          <span onclick="toggleDone(${index})">
            ${task.text} <br>
            <small>🕒 ${task.time ? formatTime(task.time) : "Tanpa waktu"} | 📂 ${task.category}</small>
          </span>
          <button class="delete-btn" onclick="deleteTask(${index})">Hapus</button>
        `;
        listElement.appendChild(li);
      });
    }
 // -------------------------------
    // 🕒 Format Waktu agar lebih enak dibaca
    // -------------------------------
    function formatTime(timeStr) {
      const d = new Date(timeStr);
      return ${d.getDate()}/${d.getMonth()+1} ${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")};
    }

    // -------------------------------
    // 🔔 Fungsi Notifikasi
    // -------------------------------
    // Minta izin untuk menampilkan notifikasi
    function requestNotificationPermission() {
      if ("Notification" in window) {
        Notification.requestPermission();
      }
    }

 // Jadwalkan notifikasi 5 menit sebelum waktu tugas
    function scheduleNotification(task) {
      const now = new Date();
      const taskTime = new Date(task.time);

      // Hitung selisih waktu (dalam milidetik)
      const diff = taskTime - now - 5 * 60 * 1000;

      // Jika tugas masih di masa depan
      if (diff > 0) {
        setTimeout(() => {
          if (Notification.permission === "granted") {
            new Notification("Pengingat Tugas 💖", {
              body: Sudah hampir waktunya: ${task.text},
            });
          }
        }, diff);
      }
    }
  </script>
</body>
</html>
