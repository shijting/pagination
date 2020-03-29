class Pagination {
  // 总记录数
  recordNum = 0;
  // 总页数
  totalPage = 0;
  // 当前页
  page = 1;
  // 每页记录数
  pageSize = 20;
  query = "";

  /**
   *
   * @param {String} container
   * @param {Object} params
   * @param {Object} options
   */
  constructor(
    container,
    params = { page: 1, pageSize: 10, total: 100 },
    options = {}
  ) {
    const { page, pageSize, total } = params;
    // 当前页
    this.page = parseInt(page);
    // 每页记录数
    this.pageSize = parseInt(pageSize);
    // 总记录数
    this.recordNum = parseInt(total);

    // 总页数
    this.totalPage = Math.ceil(this.recordNum / this.pageSize);
    // 用于存放根节点的容器
    this.container = container;

    this.options = options;
    if (Object.keys(options).length > 0) {
      this.buildOptions();
    }
    this.changePage();
    this.renderPage();
    this.bindEvends();
  }

  // 根据当前页和总页数生成对应的页码
  changePage() {
    console.log("changePage", this.page);

    let pageArr = [],
      pageSelected,
      currentPage = parseInt(this.page);
    if (currentPage > this.totalPage || currentPage < 1) {
      return false;
    }
    if (this.totalPage <= 8) {
      pageSelected = currentPage;
      for (let index = 1; index <= this.totalPage; index++) {
        pageArr.push(index);
      }
    } else if (currentPage > this.totalPage - 5) {
      pageArr = [
        1,
        "...",
        this.totalPage - 6,
        this.totalPage - 5,
        this.totalPage - 4,
        this.totalPage - 3,
        this.totalPage - 2,
        this.totalPage - 1,
        this.totalPage
      ];
      pageSelected = 9 - (this.totalPage - currentPage);
    } else if (currentPage < 6) {
      pageArr = [1, 2, 3, 4, 5, 6, 7, "...", this.totalPage];
      pageSelected = currentPage;
    } else {
      pageArr = [
        1,
        "...",
        currentPage - 2,
        currentPage - 1,
        currentPage,
        currentPage + 1,
        currentPage + 2,
        "...",
        this.totalPage
      ];
      pageSelected = 5;
    }
    this.pageArr = pageArr;
    this.pageSelected = pageSelected;
    // renderPage(pageArr, pageSelected);
  }
  // 渲染成document节点
  renderPage() {
    console.log("container", this.container);
    let container = document.querySelector(this.container);

    let fragment = document.createDocumentFragment();
    let content = document.createElement("div");
    content.id = "my-pagination";
    console.log(content);
    let ul = document.createElement("ul");
    let li = document.createElement("li");
    li.appendChild(document.createTextNode("上一页"));
    fragment.appendChild(li);
    for (let i = 0; i < this.pageArr.length; i++) {
      li = document.createElement("li");
      li.appendChild(document.createTextNode(this.pageArr[i]));
      fragment.appendChild(li);
    }
    li = document.createElement("li");
    li.appendChild(document.createTextNode("下一页"));
    fragment.appendChild(li);
    container
      .appendChild(content)
      .appendChild(ul)
      .appendChild(fragment);
    let pages = document.querySelectorAll("#my-pagination ul li");
    for (let i = 0; i < pages.length; i++) {
      pages[i].classList.add("page-pager");
      if (this.pageSelected == i) {
        pages[i].classList.add("page-pager-selected");
      } else {
        pages[i].classList.remove("page-pager-selected");
      }

      if (pages[i].innerHTML == "...") {
        pages[i].style.cursor = "default";
      }
    }
    //
    let lidom = document.querySelector("#my-pagination ul li");
    let span = document.createElement("span");
    span.appendChild(document.createTextNode(`总 ${this.recordNum} 条`));
    lidom.parentNode.insertBefore(span, lidom);

    let inputdom = document.createElement("input");
    inputdom.value = this.page;
    document.querySelector("#my-pagination ul").appendChild(inputdom);
    document
      .querySelector("#my-pagination ul")
      .appendChild(document.createElement("div"));

    document.querySelector(
      "#my-pagination ul div"
    ).innerHTML = `<select class="page-size">
    <option value="10" class="select-item">10条/页</option>
    <option value="20" class="select-item">20条/页</option>
    <option value="50" class="select-item">50条/页</option>
    <option value="100" class="select-item">100条/页</option>
  </select>`;
    this.content = content;
    console.log("box", this.content);
  }
  // 绑定事件
  bindEvends() {
    // 绑定点击事件
    this.content.addEventListener(
      "click",
      e => {
        let targetTag = e.target;
        if (targetTag.tagName.toLowerCase() == "li") {
          if (
            targetTag.innerHTML == "..." ||
            targetTag.innerHTML == this.page
          ) {
            return;
          }
          let targetPage;
          if (targetTag.innerHTML == "上一页") {
            if (this.page <= 1) {
              return false;
            }

            this.page = this.page - 1;
          } else if (targetTag.innerHTML == "下一页") {
            if (this.page >= this.totalPage) {
              return false;
            }

            this.page = this.page + 1;
          } else {
            this.page = parseInt(targetTag.innerHTML);
          }
          // setCurrentPage(targetPage);
          // buildHttpUrl(targetPage);
          this.buildBaseHttpUrl();
          console.log(this.page, this.pageSize, this.totalPage, this.recordNum);
        }
      },
      false
    );
    document.querySelectorAll(".page-size option").forEach(item => {
      if (parseInt(item.value) == this.pageSize) {
        item.selected = true;
      }
    });
    // 自定义跳转监听回车事件
    document.querySelector("#my-pagination ul input").onkeydown = e => {
      if (e.keyCode == 13) {
        this.page = parseInt(
          document.querySelector("#my-pagination ul input").value
        );
        // buildHttpUrl(parseInt(this.value));
        this.buildBaseHttpUrl();
      }
    };
    // 自定义每页条数
    document.querySelector(".page-size").onchange = () => {
      this.pageSize = parseInt(document.querySelector(".page-size").value);
      this.page = 1;
      // buildHttpUrl(this.page);
      this.buildBaseHttpUrl();
    };
  }

  buildBaseHttpUrl() {
    // page = targetPage;
    // console.log("current", page);
    // if (targetPage > total || targetPage < 1) {
    //   return;
    // }
    let url = `${window.location.origin}${window.location.pathname}?page=${this.page}&pageSize=${this.pageSize}${this.query}`;
    console.log("url", url);
    // window.location = url;
  }
  buildOptions() {
    for (var Key in this.options) {
      this.query = this.query + "&" + "" + Key + "=" + this.options[Key] + "";
    }
  }
  withOptions(options = {}) {
    this.query = "";
    this.page = 1;
    if (typeof options !== "object") {
      console.error("parameter must be Object");
      return;
    }

    if (Object.keys(options).length == 0) {
      return;
    }
    for (var Key in options) {
      this.query = this.query + "&" + "" + Key + "=" + options[Key] + "";
    }
    this.buildBaseHttpUrl();
  }
}
