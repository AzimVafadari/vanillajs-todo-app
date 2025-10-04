// صبر می‌کنیم تا کل محتوای HTML بارگذاری شود
document.addEventListener('DOMContentLoaded', () => {

    // گرفتن عناصر اصلی از DOM
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // ==========================================================
    // رویدادها (Event Listeners)
    // ==========================================================

    // 1. رویداد کلیک روی دکمه "افزودن"
    addTaskBtn.addEventListener('click', () => {
        const taskText = taskInput.value.trim(); // .trim() فاصله‌های خالی ابتدا و انتها را حذف می‌کند
        if (taskText !== '') {
            createTaskElement(taskText); // تابع ساخت کار جدید را صدا می‌زنیم
            updateLocalStorage(); // لیست را در حافظه محلی ذخیره می‌کنیم
            taskInput.value = ''; // اینپوت را خالی می‌کنیم
            taskInput.focus(); // فوکوس را به اینپوت برمی‌گردانیم
        }
    });

    // 2. امکان افزودن کار با زدن دکمه Enter در فیلد ورودی
    taskInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            addTaskBtn.click(); // رویداد کلیک دکمه افزودن را شبیه‌سازی می‌کنیم
        }
    });

    // ==========================================================
    // توابع اصلی (Core Functions)
    // ==========================================================

    /**
     * یک عنصر جدید (li) برای کار ایجاد و به لیست اضافه می‌کند
     * @param {string} text - متن کار
     * @param {boolean} isCompleted - وضعیت انجام شدن کار (برای بارگذاری از حافظه)
     */
    function createTaskElement(text, isCompleted = false) {
        // 1. ساخت عناصر
        const li = document.createElement('li');
        if (isCompleted) {
            li.classList.add('completed');
        }

        const taskTextSpan = document.createElement('span');
        taskTextSpan.textContent = text;
        taskTextSpan.classList.add('task-text');

        const actionsDiv = document.createElement('div');
        actionsDiv.classList.add('actions');

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️'; // آیکون سطل زباله
        deleteBtn.classList.add('delete-btn');

        // 2. اتصال عناصر به یکدیگر
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(taskTextSpan);
        li.appendChild(actionsDiv);
        taskList.appendChild(li);

        // 3. افزودن رویدادها به عناصر جدید

        // رویداد کلیک روی متن کار برای تغییر وضعیت (انجام شده/نشده)
        taskTextSpan.addEventListener('click', () => {
            li.classList.toggle('completed');
            updateLocalStorage();
        });

        // رویداد دابل کلیک برای ویرایش کار (بخش امتیازی)
        taskTextSpan.addEventListener('dblclick', () => {
            editTask(taskTextSpan);
        });

        // رویداد کلیک روی دکمه حذف
        deleteBtn.addEventListener('click', () => {
            li.remove(); // حذف عنصر از DOM
            updateLocalStorage();
        });
    }

    /**
     * تابع برای ویرایش متن یک کار
     * @param {HTMLElement} taskSpan - عنصری که متن کار را نمایش می‌دهد
     */
    function editTask(taskSpan) {
        // ایجاد یک فیلد ورودی جدید
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = taskSpan.textContent;
        
        // جایگزین کردن متن با فیلد ورودی
        taskSpan.parentElement.replaceChild(editInput, taskSpan);
        editInput.focus();

        // رویداد برای زمانی که کاربر از حالت ویرایش خارج می‌شود (blur)
        editInput.addEventListener('blur', () => {
            taskSpan.textContent = editInput.value.trim();
            editInput.parentElement.replaceChild(taskSpan, editInput);
            updateLocalStorage();
        });

        // رویداد برای ذخیره با زدن کلید Enter
        editInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                editInput.blur(); // رویداد blur را فعال می‌کنیم تا ذخیره شود
            }
        });
    }


    // ==========================================================
    // کار با LocalStorage
    // ==========================================================

    /**
     * تمام کارهای موجود در لیست را در LocalStorage ذخیره می‌کند
     */
    function updateLocalStorage() {
        const tasks = [];
        // تمام عناصر li در لیست را پیدا کن
        document.querySelectorAll('#taskList li').forEach(li => {
            tasks.push({
                text: li.querySelector('.task-text').textContent,
                completed: li.classList.contains('completed')
            });
        });
        // آرایه کارها را به صورت رشته JSON در LocalStorage ذخیره کن
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    /**
     * کارهای ذخیره شده در LocalStorage را بارگذاری و نمایش می‌دهد
     */
    function loadTasksFromLocalStorage() {
        const savedTasks = localStorage.getItem('tasks');
        if (savedTasks) {
            // رشته JSON را به آرایه‌ای از اشیاء تبدیل کن
            const tasks = JSON.parse(savedTasks);
            tasks.forEach(task => {
                createTaskElement(task.text, task.completed);
            });
        }
    }

    // در ابتدای باز شدن صفحه، کارها را از حافظه بارگذاری کن
    loadTasksFromLocalStorage();
});