class CustomSelect {
  #isEvent = true;
  #defaultText = "default text";
  #init = true;
  constructor(el, options) {
    this.$el = typeof el === "string" ? document.querySelector(el) : el;
    this.options = options;
    this.initialisation = this.options.init;
  }

  get isOpened() {
    return this.$el.classList.contains("show");
  }
  get textLabelButton() {
    return this.#defaultText;
  }
  set textLabelButton(value) {
    this.#defaultText = value;
    this.$btnDropDown.textContent = this.textLabelButton;
  }
  get initialisation() {
    typeof this.options.init !== "boolean"
      ? (this.options.init = this.#init)
      : null;
    return this.options.init;
  }
  set initialisation(value) {
    if (typeof this.#init !== "boolean") {
      throw new Error("Неверный тип инициальзации");
    }

    this.options.init = value;
    this.initialisation ? this.initSelect() : this.destroy();
  }
  get dropdownItems() {
    return this.$el.querySelectorAll(".dropdown-item");
  }

  isOpen() {
    this.$el.classList.add("show");
  }
  close() {
    this.$el.classList.remove("show");
  }
  toggle() {
    !this.isOpened ? this.isOpen() : this.close();
  }
  windowEventClick = (e) => {
    if (!e.target.closest(".dropdown")) {
      this.closeAllDropDown();
      document.removeEventListener("click", this.windowEventClick);
      this.#isEvent = true;
    }
  };
  handlerClickDropDown = (e) => {
    this.closeAllDropDown();
    if (e.target.closest(".dropdown-toggle")) this.toggle();
    if (e.target.closest(".dropdown-item")) this.selected(e);
    if (this.#isEvent) {
      this.#isEvent = false;
      document.addEventListener("click", this.windowEventClick);
    }
  };
  async selected(e) {
    e.preventDefault();
    const currentChoise = e.target;
    this.dropdownItems.forEach((btn) => {
      btn.classList.remove("dropdown-item--active");
      btn.setAttribute("disabled", "disabled");
    });
    this.isChoises ? await this.isChoises(currentChoise) : null;
    this.dropdownItems.forEach((btn) => btn.removeAttribute("disabled"));
    this.textLabelButton = currentChoise.textContent;
    currentChoise.classList.add("dropdown-item--active");
    this.$inputDropDown.value = currentChoise.dataset.value;
  }
  closeAllDropDown() {
    const selects = document.querySelectorAll(".dropdown");
    selects.forEach((item) => item.classList.remove("show"));
  }

  initSelect() {
    this.$inputDropDown = this.$el?.querySelector(".dropdown-input");
    this.$btnDropDown = this.$el?.querySelector(".dropdown-toggle");
    this.textLabelButton = this.options.defaultText ?? this.textLabelButton;
    this.isChoises = this.options?.isChoises?.bind(this);
    this.options?.data && this.render(this.options.data);
    this.$el?.addEventListener("click", this.handlerClickDropDown);
  }
  render(data) {
    const listDropDown = this.$el.querySelector(".dropdown-menu");
    listDropDown.innerHTML = "";
    const template = (attribute, values, label, index) => `
      <li>
          <a class="dropdown-item" data-index="${index}" ${attribute
      .map((key, i) => `data-${key}="${values[i]}"`)
      .join(" ")}  href="#"
            >${label}</a
          >
      </li>
    `;
    data?.forEach((itemSelect, index) => {
      const keysAttribute = Object.keys(itemSelect);
      const valuesAttribute = Object.values(itemSelect);

      listDropDown.insertAdjacentHTML(
        "beforeend",
        template(keysAttribute, valuesAttribute, itemSelect.label, index)
      );
    });
  }
  destroy(removeTemplate = false) {
    document.removeEventListener("click", this.windowEventClick);
    this.$el.removeEventListener("click", this.handlerClickDropDown);
    removeTemplate ? (this.$el.innerHTML = "") : null;
  }
}

const arr = () => [
  {
    id: 1,
    label: "Привет мир",
    value: "Привет мир",
    contry: "Россия",
  },
  {
    id: 2,
    label: "Как дела",
    value: "Как дела",
  },
  {
    id: 3,
    label: "Something else here",
    value: "Something else here",
  },
];
const select = new CustomSelect("#select", {
  init: true,
  data: arr(),
});
