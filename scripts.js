let canvas, fabricImage;

function handleupload() {
  const input=document.getElementById("imageInput");
  const image=input.files[0];

  const formData = new FormData();
  formData.append("image_file",image);
  formData.append('size','auto');

  const apiKey="gxSmYt3tP2kHv9QbnJjJHjk3"
  fetch('https://api.remove.bg/v1.0/removebg',{
    method:'POST',
    headers:{
      'X-Api-Key': apiKey,
    },
    body:formData
  })
  .then(function(response){
    return response.blob()
  })
  .then(function(blob){
    const url=URL.createObjectURL(blob)
    imageURL = url;
    const img= document.createElement('img');
    img.src=url;

    const inputDiv = document.getElementById("uploadForm");
    inputDiv.innerHTML = "";
    img.className = "uploaded-image";
    inputDiv.appendChild(img);

    const downloadButton = document.createElement("a");
    downloadButton.href = url;
    downloadButton.download = "edited-image.png";
    downloadButton.innerHTML = "Download";
    downloadButton.className = "bg-blue-800 cursor-pointer text-white font-semibold text-xl px-12 py-2 rounded-full mt-8";
    downloadButton.style.textDecoration = "none";
    inputDiv.appendChild(downloadButton);

    const editButton = document.createElement("a"); 
    editButton.innerHTML = "Edit";
    editButton.className = "bg-blue-800 canvas-button cursor-pointer text-white font-semibold text-xl px-12 py-2 rounded-full mt-3";
    inputDiv.appendChild(editButton);
    editButton.addEventListener("click", () => createCanvas(url));
    
  })
  .catch();
}

function createCanvas(imageUrl) {
  const inputDiv = document.getElementById("uploadForm");
  inputDiv.innerHTML = "";
  const canvasElement = document.createElement("canvas");
  canvasElement.width = inputDiv.clientWidth;
  canvasElement.height = inputDiv.clientHeight;
  canvasElement.id = "canvas";

  inputDiv.appendChild(canvasElement);

  canvas = new fabric.Canvas("canvas");

  fabric.Image.fromURL(imageUrl, (img) => {
    fabricImage = img;
    fabricImage.scaleToWidth(canvas.width);
    canvas.add(fabricImage);
    canvas.setActiveObject(fabricImage);
  });

  canvas.isDrawingMode = true;
  canvas.freeDrawingBrush.color = "rgb(219 234 254)";
  canvas.freeDrawingBrush.width = 25;

  const brushControls = document.createElement("div");
  brushControls.style.display = "flex";
  brushControls.style.gap = "10px";
  inputDiv.appendChild(brushControls);

  const container = document.getElementById("container");
  container.innerHTML = "";

  const saveButton = document.createElement("button");
  saveButton.innerHTML = "Save";
  saveButton.className = "bg-blue-800 canvas-button cursor-pointer text-white font-semibold text-xl px-12 py-2 rounded-full mt-3";
  container.appendChild(saveButton);

  saveButton.addEventListener("click", () => {
    container.innerHTML = "";
    const editedImageUrl = canvas.toDataURL({
      format: "png",
      quality: 1,
    });

    fetch(editedImageUrl)
      .then((res) => res.blob())
      .then((blob) => {
        const formData = new FormData();
        formData.append("image_file", blob, "edited-image.png");
        formData.append("size", "auto");

        fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: {
            "X-Api-Key": "gxSmYt3tP2kHv9QbnJjJHjk3",
          },
          body: formData,
        })
          .then((response) => response.blob())
          .then((blob) => {
            const url = URL.createObjectURL(blob);
            const img= document.createElement('img');
            img.src=url;

            const inputDiv = document.getElementById("uploadForm");
            inputDiv.innerHTML = "";
            img.className = "uploaded-image";
            inputDiv.appendChild(img);

            const downloadButton = document.createElement("a");
            downloadButton.href = url;
            downloadButton.download = "edited-image.png";
            downloadButton.innerHTML = "Download";
            downloadButton.className = "bg-blue-800 cursor-pointer text-white font-semibold text-xl px-12 py-2 rounded-full mt-8";
            downloadButton.style.textDecoration = "none";
            inputDiv.appendChild(downloadButton);
            console.log("hello")

            ;
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      });
  });
}

      