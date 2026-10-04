const taskInput = document.getElementById("taskInput");
const priorityInput = document.getElementById("priorityInput");
const categoryInput = document.getElementById("categoryInput");
const dateInput = document.getElementById("dateInput");

const addTaskBtn = document.getElementById("addTaskBtn");

const taskList = document.getElementById("taskList");
const emptyState = document.getElementById("emptyState");

const searchInput = document.getElementById("searchInput");

const totalCount = document.getElementById("totalCount");
const completedCount = document.getElementById("completedCount");
const remainingCount = document.getElementById("remainingCount");
const taskCount = document.getElementById("taskCount");

const sectionTitle = document.getElementById("sectionTitle");

const currentDate = document.getElementById("currentDate");

const themeBtn = document.getElementById("themeBtn");
const mobileThemeBtn = document.getElementById("mobileThemeBtn");


const themeSelectorBtn =
    document.getElementById("themeSelectorBtn");

const themePanel =
    document.getElementById("themePanel");

const closeThemeBtn =
    document.getElementById("closeThemeBtn");

const themeCards =
    document.querySelectorAll(".theme-card");




/* -------------------------
   EDIT MODAL
------------------------- */

const editModal =
    document.getElementById("editModal");

const closeEditModal =
    document.getElementById("closeEditModal");

const cancelEditBtn =
    document.getElementById("cancelEditBtn");

const saveEditBtn =
    document.getElementById("saveEditBtn");

const editTaskText =
    document.getElementById("editTaskText");

const editTaskPriority =
    document.getElementById("editTaskPriority");

const editTaskCategory =
    document.getElementById("editTaskCategory");

const editTaskDueDate =
    document.getElementById("editTaskDueDate");


let editingTaskId = null;

/* -------------------------
   SMART TASK STATUS
------------------------- */

function getTaskStatus(task) {

    /* No due date */

    if (!task.dueDate) {

        return "no-deadline";

    }


    /* Get today's date */

    const today =
        new Date();

    today.setHours(
        0, 0, 0, 0
    );


    /* Get task due date */

    const dueDate =
        new Date(
            task.dueDate +
            "T00:00:00"
        );

    dueDate.setHours(
        0, 0, 0, 0
    );


    /* Completed tasks */

    if (task.completed) {

        return "completed";

    }


    /* Overdue */

    if (dueDate < today) {

        return "overdue";

    }


    /* Due today */

    if (
        dueDate.getTime() ===
        today.getTime()
    ) {

        return "today";

    }


    /* Future task */

    return "upcoming";

}


/* -------------------------
   LOAD TASKS
------------------------- */

let tasks = JSON.parse(localStorage.getItem("myTasksV2")) || [];

let currentFilter = "all";


/* -------------------------
   SAVE TASKS
------------------------- */

function saveTasks() {

    localStorage.setItem(
        "myTasksV2",
        JSON.stringify(tasks)
    );

}


/* -------------------------
   DATE
------------------------- */

function showCurrentDate() {

    const today = new Date();

    currentDate.textContent = today.toLocaleDateString(
        "en-IN",
        {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}

showCurrentDate();


/* -------------------------
   ADD TASK
------------------------- */

function addTask() {

    const text = taskInput.value.trim();

    if (text === "") {

        alert("Please enter a task.");

        return;
    }


    const newTask = {

        id: Date.now(),

        text: text,

        priority: priorityInput.value,

        category: categoryInput.value,

        dueDate: dateInput.value,

        completed: false

    };


    tasks.push(newTask);

    saveTasks();

    taskInput.value = "";

    dateInput.value = "";

    priorityInput.value = "medium";

    categoryInput.value = "Personal";

    displayTasks();

}


addTaskBtn.addEventListener(
    "click",
    addTask
);


/* -------------------------
   ENTER TO ADD
------------------------- */

taskInput.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            addTask();

        }

    }
);


/* -------------------------
   DISPLAY TASKS
------------------------- */

function displayTasks() {

    taskList.innerHTML = "";


    let filteredTasks = [...tasks];


    /* FILTER */

    if (currentFilter === "today") {

        const today = new Date()
            .toISOString()
            .split("T")[0];

        filteredTasks = filteredTasks.filter(
            function(task) {

                return task.dueDate === today;

            }
        );

    }


    if (currentFilter === "completed") {

        filteredTasks = filteredTasks.filter(
            function(task) {

                return task.completed;

            }
        );

    }


    /* SEARCH */

    const searchText =
        searchInput.value
            .toLowerCase()
            .trim();


    if (searchText !== "") {

        filteredTasks = filteredTasks.filter(
            function(task) {

                return (
                    task.text
                        .toLowerCase()
                        .includes(searchText)
                    ||
                    task.category
                        .toLowerCase()
                        .includes(searchText)
                );

            }
        );

    }


    /* SORT */

    filteredTasks.sort(
        function(a, b) {

            if (a.completed !== b.completed) {

                return a.completed ? 1 : -1;

            }

            return b.id - a.id;

        }
    );


    /* EMPTY STATE */

    if (filteredTasks.length === 0) {

        emptyState.style.display = "block";

    } else {

        emptyState.style.display = "none";

    }


    /* CREATE TASKS */

    filteredTasks.forEach(
        function(task) {

            const taskStatus =
    getTaskStatus(task);

            const taskElement =
                document.createElement("div");


            taskElement.className = 
                 "task task-" + taskStatus;            


            if (task.completed) {


                taskElement.classList.add(
                    "completed"
                );

            }


            /* CHECKBOX */

            const checkbox =
                document.createElement("input");

            checkbox.type = "checkbox";

            checkbox.className =
                "task-checkbox";

            checkbox.checked =
                task.completed;


            checkbox.addEventListener(
                "change",
                function() {

                    task.completed =
                        checkbox.checked;

                    saveTasks();

                    displayTasks();

                }
            );


            /* CONTENT */

            const content =
                document.createElement("div");

            content.className =
                "task-content";


            const name =
                document.createElement("div");

            name.className =
                "task-name";

            name.textContent =
                task.text;


            /* META */

            const meta =
                document.createElement("div");

            meta.className =
                "task-meta";


            const category =
                document.createElement("span");

            category.className =
                "badge";

            category.textContent =
                task.category;


            const priority =
                document.createElement("span");

            priority.className =
                "badge priority-" +
                task.priority;

            priority.textContent =
                task.priority
                    .charAt(0)
                    .toUpperCase()
                +
                task.priority
                    .slice(1)
                +
                " priority";


            meta.appendChild(category);

            meta.appendChild(priority);


            /* DUE DATE */

            if (task.dueDate) {

                const due =
                    document.createElement("span");

                due.className =
                    "badge";

            const date =
    new Date(
        task.dueDate +
        "T00:00:00"
    );

const today =
    new Date();

today.setHours(
    0, 0, 0, 0
);

const tomorrow =
    new Date(today);

tomorrow.setDate(
    tomorrow.getDate() + 1
);

const yesterday =
    new Date(today);

yesterday.setDate(
    yesterday.getDate() - 1
);


if (date.getTime() === today.getTime()) {

    due.textContent =
        "Due Today";

    due.classList.add(
        "due-today"
    );

}
else if (
    date.getTime() ===
    tomorrow.getTime()
) {

    due.textContent =
        "Due Tomorrow";

    due.classList.add(
        "due-tomorrow"
    );

}
else if (
    date.getTime() <
    today.getTime()
) {

    due.textContent =
        "Overdue";

    due.classList.add(
        "overdue"
    );

}
else {

    due.textContent =
        "Due " +
        date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short"
            }
        );

}

                meta.appendChild(due);

            }


            content.appendChild(name);

            content.appendChild(meta);


            /* ACTIONS */

            const actions =
                document.createElement("div");

            actions.className =
                "task-actions";


            const editButton =
                document.createElement("button");

            editButton.textContent =
                "Edit";


            editButton.addEventListener(
                "click",
                function() {

                    editTask(task.id);

                }
            );


            const deleteButton =
                document.createElement("button");

            deleteButton.textContent =
                "Delete";


            deleteButton.addEventListener(
                "click",
                function() {

                    deleteTask(task.id);

                }
            );


            actions.appendChild(editButton);

            actions.appendChild(deleteButton);


            taskElement.appendChild(
                checkbox
            );

            taskElement.appendChild(
                content
            );

            taskElement.appendChild(
                actions
            );


            taskList.appendChild(
                taskElement
            );

        }
    );


    updateStats();

}


/* -------------------------
   UPDATE STATISTICS
------------------------- */

function updateStats() {

    const total = tasks.length;

    const completed =
        tasks.filter(
            function(task) {

                return task.completed;

            }
        ).length;


    const remaining =
        total - completed;


    totalCount.textContent =
        total;

    completedCount.textContent =
        completed;

    remainingCount.textContent =
        remaining;


    if (remaining === 1) {

        taskCount.textContent =
            "1 task remaining";

    } else {

        taskCount.textContent =
            remaining +
            " tasks remaining";

    }

}


/* -------------------------
   DELETE TASK
------------------------- */

function deleteTask(id) {

    const confirmed =
        confirm(
            "Delete this task?"
        );


    if (!confirmed) {

        return;

    }


    tasks =
        tasks.filter(
            function(task) {

                return task.id !== id;

            }
        );


    saveTasks();

    displayTasks();

}


/* -------------------------
   EDIT TASK
------------------------- */

function editTask(id) {

    const task =
        tasks.find(
            function(task) {

                return task.id === id;

            }
        );


    if (!task) {

        return;

    }


    editingTaskId = id;


    editTaskText.value =
        task.text;

    editTaskPriority.value =
        task.priority;

    editTaskCategory.value =
        task.category;

    editTaskDueDate.value =
        task.dueDate || "";


    editModal.classList.add(
        "open"
    );

    editTaskText.focus();

}



/* -------------------------
   SAVE EDITED TASK
------------------------- */

saveEditBtn.addEventListener(
    "click",
    function() {

        if (editingTaskId === null) {
            return;
        }


        const task =
            tasks.find(
                function(task) {

                    return task.id ===
                        editingTaskId;

                }
            );


        if (!task) {
            return;
        }


        const newText =
            editTaskText.value.trim();


        if (newText === "") {

            alert(
                "Task name cannot be empty."
            );

            editTaskText.focus();

            return;

        }


        /* UPDATE TASK */

        task.text =
            newText;

        task.priority =
            editTaskPriority.value;

        task.category =
            editTaskCategory.value;

        task.dueDate =
            editTaskDueDate.value;


        /* SAVE */

        saveTasks();


        /* CLOSE MODAL */

        editModal.classList.remove(
            "open"
        );

        editingTaskId = null;


        /* REFRESH */

        displayTasks();

    }
);


/* -------------------------
   CLOSE EDIT MODAL
------------------------- */

function closeEditModalWindow() {

    editModal.classList.remove(
        "open"
    );

    editingTaskId = null;

}


cancelEditBtn.addEventListener(
    "click",
    closeEditModalWindow
);


closeEditModal.addEventListener(
    "click",
    closeEditModalWindow
);



/* -------------------------
   FILTER BUTTONS
------------------------- */

const navItems =
    document.querySelectorAll(
        ".nav-item[data-filter]"
    );


navItems.forEach(
    function(button) {

        button.addEventListener(
            "click",
            function() {

                navItems.forEach(
                    function(item) {

                        item.classList.remove(
                            "active"
                        );

                    }
                );


                button.classList.add(
                    "active"
                );


                currentFilter =
                    button.dataset.filter;


                if (
                    currentFilter ===
                    "all"
                ) {

                    sectionTitle.textContent =
                        "All Tasks";

                }

                if (
                    currentFilter ===
                    "today"
                ) {

                    sectionTitle.textContent =
                        "Today's Tasks";

                }

                if (
                    currentFilter ===
                    "completed"
                ) {

                    sectionTitle.textContent =
                        "Completed Tasks";

                }


                displayTasks();

            }
        );

    }
);


/* -------------------------
   SEARCH
------------------------- */

searchInput.addEventListener(
    "input",
    displayTasks
);


/* -------------------------
   DARK MODE
------------------------- */

function toggleDarkMode() {

    document.body.classList.toggle(
        "dark"
    );


    const darkMode =
        document.body.classList.contains(
            "dark"
        );


    localStorage.setItem(
        "darkMode",
        darkMode
    );

}


themeBtn.addEventListener(
    "click",
    toggleDarkMode
);


mobileThemeBtn.addEventListener(
    "click",
    toggleDarkMode
);


/* LOAD DARK MODE */

if (
    localStorage.getItem(
        "darkMode"
    ) === "true"
) {

    document.body.classList.add(
        "dark"
    );

}


/* -------------------------
   THEME SYSTEM
------------------------- */

function setTheme(theme) {

    if (theme === "classic") {

        document.body.removeAttribute(
            "data-theme"
        );

    } else {

        document.body.setAttribute(
            "data-theme",
            theme
        );

    }


    localStorage.setItem(
        "myTaskTheme",
        theme
    );


    themeCards.forEach(
        function(card) {

            card.classList.remove(
                "selected"
            );

            if (
                card.dataset.theme ===
                theme
            ) {

                card.classList.add(
                    "selected"
                );

            }

        }
    );

}


/* OPEN THEME PANEL */

themeSelectorBtn.addEventListener(
    "click",
    function() {

        themePanel.classList.add(
            "open"
        );

    }
);


/* CLOSE THEME PANEL */

closeThemeBtn.addEventListener(
    "click",
    function() {

        themePanel.classList.remove(
            "open"
        );

    }
);


/* SELECT THEME */

themeCards.forEach(
    function(card) {

        card.addEventListener(
            "click",
            function() {

                const selectedTheme =
                    card.dataset.theme;

                setTheme(
                    selectedTheme
                );

            }
        );

    }
);


/* LOAD SAVED THEME */

const savedTheme =
    localStorage.getItem(
        "myTaskTheme"
    ) || "classic";

setTheme(savedTheme);





/* -------------------------
   START APP
------------------------- */

displayTasks();