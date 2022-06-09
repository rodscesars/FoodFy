//PATHNAME//
const currentUrl = location.pathname;
const menuItems = document.querySelectorAll("header .links a");

for (item of menuItems) {
  if (currentUrl.includes(item.getAttribute("href"))) {
    item.classList.add("active");
  }
}

//ADICIONAR INGREDIENTE E PREPARAÇÃO
function addIngredient() {
  const ingredients = document.querySelector("#ingredients");
  const fieldContainer = document.querySelectorAll(".ingredient");

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  if (newField.children[0].value == "") return false;

  newField.children[0].value = "";
  ingredients.appendChild(newField);
}

document
  .querySelector(".add-ingredient")
  .addEventListener("click", addIngredient);

function addPreparation() {
  const preparation = document.querySelector("#preparation");
  const fieldContainer = document.querySelectorAll(".preparation");

  const newField = fieldContainer[fieldContainer.length - 1].cloneNode(true);

  if (newField.children[0].value == "") return false;

  newField.children[0].value = "";
  preparation.appendChild(newField);
}

document
  .querySelector(".add-preparation")
  .addEventListener("click", addPreparation);

//GALERIA DE FOTOS//

const PhotosUpload = {
  input: "",
  preview: document.querySelector("#photos-preview"),
  uploadLimit: 5,
  files: [],
  handleFileInput(event) {
    const { files: fileList } = event.target; //está pegando os files do input e denominando fileList
    PhotosUpload.input = event.target; // a let input agora é o input do target

    if (PhotosUpload.hasLimit(event)) return; //se houver limitação, trava aqui.

    Array.from(fileList).forEach((file) => {
      //transforma fileList em um array e roda um forEach para cada file
      PhotosUpload.files.push(file); //adiciona cada file para o array files

      const reader = new FileReader(); //constructor que permite ler arquivos

      reader.onload = () => {
        //onload significa quando tiver 'pronto', então vai rodar a função
        const image = new Image(); //é a mesma coisa de criar uma tag <img/>
        image.src = String(reader.result); //usa o constructor para se certificar que o resultado repassado para a url será uma String
        const div = PhotosUpload.getContainer(image); //a função retorna uma div com um a imagem repassada que é declarada na const
        PhotosUpload.preview.appendChild(div); // adiciona no elemento cujo id é "photos-preview" um child com a div criada
      };

      reader.readAsDataURL(file); //o reader ficará 'pronto' quando ele ler a data de cada file
    });

    PhotosUpload.input.files = PhotosUpload.getAllFiles(); //modificando os files do target do evento(input) para o DataTransfer
  },
  hasLimit(event) {
    const { uploadLimit, input, preview } = PhotosUpload;
    const { files: fileList } = input;

    if (fileList.length > uploadLimit) {
      alert(`Envia no máximo ${uploadLimit} fotos`);
      event.preventdefault();
      return true; //retorna true se houver limitação
    }

    const photoDiv = [];
    preview.childNodes.forEach((item) => {
      //childNodes são todos os filhos da div preview, então para cada item
      if (item.classList && item.classList.value == "photo")
        photoDiv.push(item); //COLOCA DENTRO DO ARRAY PHOTODIV O ITEM
    });

    const totalPhotos = fileList.length + photoDiv.length; //Soma os files adicionados pela primeira vez na fileList e todos que forem adicionados posteriormente

    if (totalPhotos > uploadLimit) {
      alert("Você atingiu o limite máximo de fotos");
      event.preventdefault();
      return true;
    }

    return false; //retorna false caso não haja limitação
  },
  getAllFiles() {
    const dataTransfer =
      new ClipboardEvent("").clipboardData || new DataTransfer(); //o primeiro é para FireFox que não possui o DataTransfer
    PhotosUpload.files.forEach((file) => dataTransfer.items.add(file)); //adiciona nos items do dataTransfer cada file
    return dataTransfer.files;
  },
  getContainer(image) {
    const div = document.createElement("div"); //criando no document um elemento <div>
    div.classList.add("photo"); //adiciona uma class "photo" para essa a div criada
    div.onclick = PhotosUpload.removePhoto;
    div.appendChild(image); //cria um child com a image dentro da div
    div.appendChild(PhotosUpload.getRemoveButton()); //tá acrescentando o botão
    return div;
  },
  getRemoveButton() {
    const button = document.createElement("i"); //cria um elemento do tipo icon
    button.classList.add("material-icons"); //adiciona essa class
    button.innerHTML = "close";
    return button;
  },
  removePhoto(event) {
    const photoDiv = event.target.parentNode; //o elemento pai do target do event (no caso a div com a class 'photo')
    const photosArray = Array.from(PhotosUpload.preview.children); //todas as fotos dentro de #photos-preview
    const index = photosArray.indexOf(photoDiv); //pega o index da foto clicada

    PhotosUpload.files.splice(index, 1); //o splice remove um elemento do array, passando seu index e a quantidade 1 (ele mesmo)
    PhotosUpload.input.files = PhotosUpload.getAllFiles(); //atualiza os files do input com os do datatransfer

    photoDiv.remove(); //remove a div com foto do photopreview
  },
  removeOldPhoto(event) {
    const photoDiv = event.target.parentNode; //div que contem a foto

    if (photoDiv.id) {
      const removedFiles = document.querySelector(
        'input[name="removed_files"]'
      );
      if (removedFiles) {
        removedFiles.value += `${photoDiv.id},`;
      }
    }

    photoDiv.remove();
  },
};

const Validade = {
  apply(input, func) {
    Validade.clearError(input);

    let results = Validade[func](input.value);
    input.value = results.value;

    if (results.error) Validade.displayError(input, results.error);
  },
  isEmail(value) {
    let error = null;

    const mailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

    if (!value.match(mailFormat)) error = "Email inválido!";
    return {
      error,
      value,
    };
  },
  displayError(input, error) {
    const div = document.createElement("div");
    div.classList.add("error");
    div.innerHTML = error;
    input.parentNode.appendChild(div);
    input.focus();
  },
  clearError(input) {
    const errorDiv = input.parentNode.querySelector(".error");
    if (errorDiv) errorDiv.remove();
  },
};
