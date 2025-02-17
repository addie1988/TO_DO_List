// 點擊按鈕新增
document.getElementById("add").addEventListener("click", function () {
  addTodos();
});

// 按 Enter 新增
document.getElementById("inp").addEventListener("keydown", function (e) {
  if (e.key === "Enter") {
    e.preventDefault(); // 防止 Enter 的默認行為
    const inputValue = this.value.trim();
    if (inputValue.length > 0) {
      addTodos();
      this.value = ""; // 清空輸入框
    }
  }
});

function addTodos() {
  const inputValue = document.getElementById("inp").value.trim();

  if (inputValue.length === 0) return;

  // 檢查是否有重複的內容
  const existingTodos = document.querySelectorAll(
    "#todo_ul .to_list_text_content p"
  );
  for (const todo of existingTodos) {
    if (todo.textContent === escapeHtml(inputValue)) {
      todo.closest(".todo").remove();
      break;
    }
  }

  // 新增 todo
  const newTodo = document.createElement("li");
  newTodo.classList.add("todo");
  newTodo.draggable = true; // 添加拖曳屬性
  newTodo.innerHTML = `
    <div class="to_list_text">
        <div class="to_list_text_content">
            <span>${new Date().toLocaleString()}</span>
            <input class="todoCheck" type="checkbox">
            <p>${escapeHtml(inputValue)}</p>
        </div>
    </div>
    <div class="closure">
        <div class="closure_content delete-btn">
            <span></span>
            <span></span>
        </div>
    </div>
  `;
  document.getElementById("todo_ul").appendChild(newTodo);
  document.getElementById("inp").value = "";

  // 添加拖曳事件監聽
  addDragListeners(newTodo);
}

// 添加拖曳相關的事件監聽器
function addDragListeners(element) {
  element.addEventListener("dragstart", handleDragStart);
  element.addEventListener("dragend", handleDragEnd);
  element.addEventListener("dragover", handleDragOver);
  element.addEventListener("drop", handleDrop);
}

// 拖曳開始時
function handleDragStart(e) {
  this.style.opacity = "0.4";
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("text/html", this.innerHTML);
  dragSrcEl = this;
}

// 拖曳結束時
function handleDragEnd(e) {
  this.style.opacity = "1";
  const items = document.querySelectorAll(".todo");
  items.forEach((item) => {
    item.classList.remove("over");
  });
}

// 拖曳經過其他元素時
function handleDragOver(e) {
  e.preventDefault();
  return false;
}

// 放下時
function handleDrop(e) {
  e.stopPropagation();
  e.preventDefault();

  if (dragSrcEl !== this) {
    // 獲取拖曳元素和目標元素的位置
    const allItems = [...document.querySelectorAll(".todo")];
    const dragIndex = allItems.indexOf(dragSrcEl);
    const dropIndex = allItems.indexOf(this);

    // 如果是向下拖曳
    if (dragIndex < dropIndex) {
      this.parentNode.insertBefore(dragSrcEl, this.nextSibling);
    } else {
      this.parentNode.insertBefore(dragSrcEl, this);
    }
  }
  return false;
}

// 初始化：為現有的 todo 項目添加拖曳功能
document.querySelectorAll(".todo").forEach((todo) => {
  addDragListeners(todo);
});

// 添加全局變量來存儲被拖曳的元素
let dragSrcEl = null;

// 將 eleHtml 改名為 escapeHtml
function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

// 事件代理：透過父元素來監聽 click 事件
document.getElementById("todo_ul").addEventListener("click", function (event) {
  const target = event.target;

  // 勾選 todo
  if (target.classList.contains("todoCheck")) {
    const todoItem = target.closest(".todo");
    if (target.checked) {
      todoItem.classList.add("todo__done");
      todoItem.querySelector(".closure_content").classList.add("can-delete");
    } else {
      todoItem.classList.remove("todo__done");
      todoItem.querySelector(".closure_content").classList.remove("can-delete");
    }
  }

  // 刪除 todo（只有在可刪除狀態才能刪除）
  if (target.closest(".delete-btn.can-delete")) {
    const todoItem = target.closest(".todo");
    if (todoItem) {
      todoItem.remove();
    }
  }
});
