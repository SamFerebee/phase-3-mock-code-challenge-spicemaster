const spiceDiv = document.querySelector("div#spice-blend-detail");
let currentSpiceId = "x";

fetch("http://localhost:3000/spiceblends/1")
    .then(resp => resp.json())
    .then(data => makeSpiceBlend(data))

const makeSpiceBlend = data => {
    currentSpiceId = data.id;
    const theImg = spiceDiv.querySelector("img.detail-image");
    theImg.src = data.image;
    theImg.alt = data.title;
    spiceDiv.querySelector("h2.title").textContent = data.title;
    fetch("http://localhost:3000/ingredients/")
        .then(resp => resp.json())
        .then(spiceData => populateIngredients(spiceData))

}

const populateIngredients = data => {
    //remove the ul and make a fresh one w/ new ingredients
    if(spiceDiv.querySelector("ul.ingredients-list")){
        spiceDiv.querySelector("ul.ingredients-list").remove();
        document.querySelector("div.ingredients-container").innerHTML += `<ul class = "ingredients-list"> </ul>`;
    }
    data.forEach(spice =>{
        if(spice.spiceblendId == currentSpiceId){
            let li = document.createElement("li");
            li.textContent = spice.name;
            document.querySelector("div.ingredients-container > ul.ingredients-list").append(li);
        }
    })
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
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({title: newTitle})
    })
}

document.querySelector("form#ingredient-form").addEventListener("submit", event =>{
    event.preventDefault();
    const li = document.createElement("li");
    const newIngredient = event.target.name.value;
    li.textContent = newIngredient;
    spiceDiv.querySelector("ul.ingredients-list").append(li);
    event.target.reset();
    fetch("http://localhost:3000/ingredients/",{
        method: "POST",
        headers:{
            "Content-Type": "application/json"
        },
        body: JSON.stringify({name: newIngredient, spiceblendId: currentSpiceId})
    })
})

fetch("http://localhost:3000/spiceblends")
    .then(resp => resp.json())
    .then(data => data.forEach(populateSpiceImagesDiv))

const populateSpiceImagesDiv = data => {
    const allSpiceImagesDiv = document.querySelector("div#spice-images");
    const theImg = document.createElement("img");
    theImg.src = data.image;
    theImg.alt = data.title;
    theImg.setAttribute("data-id", data.id) 
    allSpiceImagesDiv.append(theImg);
}

document.querySelector("div#spice-images").addEventListener("click", event => {
    if (event.target.tagName === "IMG"){
        currentSpiceId = event.target.dataset.id;
        const theImg = spiceDiv.querySelector("img.detail-image");
        theImg.src = event.target.getAttribute("src");
        theImg.alt = event.target.getAttribute("alt");
        spiceDiv.querySelector("h2.title").textContent = event.target.getAttribute("alt");
        fetch("http://localhost:3000/ingredients/")
            .then(resp => resp.json())
            .then(spiceData => populateIngredients(spiceData))
    }
    
})