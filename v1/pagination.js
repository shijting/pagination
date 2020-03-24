// 总记录数
var recordNum = 0;
// 总页数
var total = 0;
// 当前页
var page = 1;
// 每页记录数
var size = 20;
var isInit = false;
var query = "";
/**
 * 分页器入口
 * @param {int} currentPage 当前页
 * @param {int} count 总记录数
 * @param {int} pageSize 每页显示数
 * @param {object} options {"title":"xxxx", "email": "xx@xx.xxx"}
 */
function pagination(currentPage, pageSize, count, options = {}) {
  if (!isInit) {
    isInit = true;
    recordNum = parseInt(count);
    size = parseInt(pageSize);
    page = parseInt(currentPage);
    total = Math.ceil(recordNum / size);

    if (Object.keys(options).length > 0) {
      console.log("进行搜索");

      buildOptions(options);
    }
    changePage(page);
  }
}
function buildOptions(options) {
  for (var Key in options) {
    query = query + "&" + "" + Key + "=" + options[Key] + "";
  }
  buildHttpUrl(1);
}

function changePage(currentPage) {
  let pageArr = [],
    pageSelected;
  currentPage = parseInt(currentPage);
  if (currentPage > total || currentPage < 1) {
    return false;
  }
  if (total <= 8) {
    // console.log("c", 1);
    pageSelected = currentPage;
    for (let index = 1; index <= total; index++) {
      pageArr.push(index);
    }
  } else if (page > total - 5) {
    // console.log("c", 2);
    pageArr = [
      1,
      "...",
      total - 6,
      total - 5,
      total - 4,
      total - 3,
      total - 2,
      total - 1,
      total
    ];
    pageSelected = 9 - (total - currentPage);
  } else if (page < 6) {
    // console.log("c", 3);
    pageArr = [1, 2, 3, 4, 5, 6, 7, "...", total];
    pageSelected = currentPage;
  } else {
    // console.log("c", 4);
    pageArr = [
      1,
      "...",
      page - 2,
      page - 1,
      page,
      page + 1,
      page + 2,
      "...",
      total
    ];
    pageSelected = 5;
  }
  renderPage(pageArr, pageSelected);
}
function renderPage(pageArr, pageSelected) {
  console.log("currentpage", pageSelected);
  let box = document.getElementById("pagination");
  let fragment = document.createDocumentFragment();
  let ul = document.createElement("ul");
  let li = document.createElement("li");
  li.appendChild(document.createTextNode("上一页"));
  fragment.appendChild(li);
  for (let i = 0; i < pageArr.length; i++) {
    li = document.createElement("li");
    li.appendChild(document.createTextNode(pageArr[i]));
    fragment.appendChild(li);
  }
  li = document.createElement("li");
  li.appendChild(document.createTextNode("下一页"));
  fragment.appendChild(li);
  box.appendChild(ul).appendChild(fragment);
  let pages = document.querySelectorAll("#pagination ul li");
  for (let i = 0; i < pages.length; i++) {
    pages[i].classList.add("page-pager");
    if (pageSelected == i) {
      pages[i].classList.add("page-pager-selected");
    } else {
      pages[i].classList.remove("page-pager-selected");
    }

    if (pages[i].innerHTML == "...") {
      pages[i].style.cursor = "default";
    }
  }
  //
  let lidom = document.querySelector("#pagination ul li");
  let span = document.createElement("span");
  span.appendChild(document.createTextNode(`总 ${recordNum} 条`));
  lidom.parentNode.insertBefore(span, lidom);

  let inputdom = document.createElement("input");
  inputdom.value = page;
  document.querySelector("#pagination ul").appendChild(inputdom);
  document
    .querySelector("#pagination ul")
    .appendChild(document.createElement("div"));

  document.querySelector(
    "#pagination ul div"
  ).innerHTML = `<select class="page-size">
  <option value="10" class="select-item">10条/页</option>
  <option value="20" class="select-item">20条/页</option>
  <option value="50" class="select-item">50条/页</option>
  <option value="100" class="select-item">100条/页</option>
</select>`;
  // 添加点击事件
  box.addEventListener(
    "click",
    e => {
      let targetTag = e.target;
      if (targetTag.tagName.toLowerCase() == "li") {
        if (targetTag.innerHTML == "..." || targetTag.innerHTML == page) {
          return;
        }
        let targetPage;
        if (targetTag.innerHTML == "上一页") {
          if (page <= 1) {
            return false;
          }

          targetPage = page - 1;
        } else if (targetTag.innerHTML == "下一页") {
          if (page >= total) {
            return false;
          }

          targetPage = page + 1;
        } else {
          targetPage = parseInt(targetTag.innerHTML);
        }
        // setCurrentPage(targetPage);
        buildHttpUrl(targetPage);
      }
    },
    false
  );
  document.querySelectorAll(".page-size option").forEach(item => {
    if (parseInt(item.value) == size) {
      item.selected = true;
    }
  });
  // 自定义跳转监听回车事件
  document.querySelector("#pagination ul input").onkeydown = function(e) {
    if (e.keyCode == 13) {
      buildHttpUrl(parseInt(this.value));
    }
  };
  // 自定义每页条数
  document.querySelector(".page-size").onchange = function() {
    pageSize = parseInt(this.value);
    page = 1;
    size = pageSize;
    buildHttpUrl(page);
  };
}
// 异步分页
function setCurrentPage(targetPage) {
  console.log("current", page);
  if (targetPage > total || targetPage < 1) {
    return;
  }
  page = targetPage;
  console.log("target", page);
  // document.getElementById("pagination").innerHTML = "";
  // changePage(targetPage);
}
// 同步分页
function buildHttpUrl(targetPage) {
  page = targetPage;
  console.log("current", page);
  if (targetPage > total || targetPage < 1) {
    return;
  }
  let url = `${window.location.origin}${window.location.pathname}?page=${targetPage}&pageSize=${size}${query}`;
  console.log("url", url);
  window.location = url;
}
