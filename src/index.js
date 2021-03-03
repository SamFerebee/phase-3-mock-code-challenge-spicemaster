const spiceDiv = document.querySelector("div#spice-blend-detail");

fetch("http://localhost:3000/spiceblends/1")
    .then(resp => resp.json())
    .then(data => makeSpiceBlend(data))

const makeSpiceBlend = data => {
    const theImg = spiceDiv.querySelector("img.detail-image");
    theImg.src = data.image;
    theImg.alt = data.title;
    spiceDiv.querySelector("h2.title").textContent = data.title;
    fetch(`http://localhost:3000/ingredients/${data.id}`)
        .then(resp => resp.json())
        .then(spiceData => populateIngredients(spiceData))

}

const populateIngredients = data => {
    const li = document.createElement("li");
    li.textContent = data.name;
    spiceDiv.querySelector("ul.ingredients-list").append(li);

}

document.querySelector("form#update-form").addEventListener("submit", event => {
    event.preventDefault();
    const newTitle = event.target.title.value;
    spiceDiv.querySelector("h2.title").textContent = newTitle;
    event.target.reset();
    updateTitle(newTitle);
})

const updateTitle = newTitle => {
    fetch("http://localhost:3000/spiceblends/1",{
        method: "PATCH",
        headers: {
            "Content-type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({title: newTitle})
    })
}

document.querySelector("form#ingredient-form").addEventListener("submit", event =>{
    event.preventDefault();
    const li = document.createElement("li");
    li.textContent = event.target.name.value;
    spiceDiv.querySelector("ul.ingredients-list").append(li);
    event.target.reset();
})