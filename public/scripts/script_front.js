const cards = document.querySelectorAll(".card");

cards.forEach(function (card) {
  card.addEventListener("click", function () {
    let index = card.getAttribute("id");
    window.location.href = `/recipes/${index}`;
  });
});

const topics = document.querySelectorAll(".topic");

for (let topic of topics) {
  const button = topic.querySelector(".button");
  const content = topic.querySelector(".topic_content");
  button.addEventListener("click", function () {
    if (content.classList.contains("hidden")) {
      content.classList.remove("hidden");
      button.innerHTML = "ESCONDER";
    } else {
      content.classList.add("hidden");
      button.innerHTML = "MOSTRAR";
    }
  });
}

//PAGINAÇÃO//
function paginate(selectedPage, totalPages) {
  const pages = [];
  let oldPage;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const firstandlastpage =
      currentPage == 1 ||
      currentPage == 2 ||
      currentPage == totalPages ||
      currentPage == totalPages - 1;
    const pagesafterselect = currentPage <= selectedPage + 1;
    const pagebeforeselect = currentPage >= selectedPage - 1;

    if (firstandlastpage || (pagesafterselect && pagebeforeselect)) {
      if (oldPage && currentPage - oldPage > 2) {
        pages.push("...");
      }
      if (oldPage && currentPage - oldPage == 2) {
        pages.push(oldPage + 1);
      }
      pages.push(currentPage);
      oldPage = currentPage;
    }
  }
  return pages;
}

function createpagination(pagination) {
  const { filter } = pagination.dataset;
  const page = +pagination.dataset.page;
  const total = +pagination.dataset.total;

  const pages = paginate(page, total);
  let elements = "";
  for (const page of pages) {
    if (String(page).includes("...")) {
      elements += `<span>${page}</span>`;
    } else if (filter) {
      elements += `<a href="?page=${page}&&filter=${filter}">${page}</a>`;
    } else {
      elements += `<a href="?page=${page}">${page}</a>`;
    }
  }

  pagination.innerHTML = elements;
}

const pagination = document.querySelector(".pagination");

if (pagination) {
  createpagination(pagination);
}
