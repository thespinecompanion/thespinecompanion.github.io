"use strict";
const search = document.querySelector("#article-search");
if (search) search.addEventListener("input", () => {
  const query = search.value.trim().toLocaleLowerCase();
  let visible = 0;
  document.querySelectorAll("[data-search]").forEach(card => {
    card.hidden = !card.dataset.search.toLocaleLowerCase().includes(query);
    if (!card.hidden) visible++;
  });
  document.querySelector("#search-empty").hidden = visible !== 0;
});
