/* ===== Menu: abre no celular e destaca a seção visível ===== */
const burger = document.getElementById("burger"), menu = document.getElementById("menu");
burger.addEventListener("click", () => {
  const aberto = menu.classList.toggle("aberto");
  burger.setAttribute("aria-expanded", aberto);
});
menu.addEventListener("click", e => { if (e.target.tagName === "A") { menu.classList.remove("aberto"); burger.setAttribute("aria-expanded", "false"); } });
const links = [...menu.querySelectorAll("a")];
const obs = new IntersectionObserver(lista => {
  lista.forEach(en => { if (en.isIntersecting) links.forEach(a => a.classList.toggle("ativo", a.getAttribute("href") === "#" + en.target.id)); });
}, { rootMargin: "-40% 0px -55% 0px" });
links.forEach(a => obs.observe(document.querySelector(a.getAttribute("href"))));
