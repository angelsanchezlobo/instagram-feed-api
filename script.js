let host = "https://graph.instagram.com/me/media?";

let path =
  "fields=id,media_url,permalink,media_type,thumbnail_url,caption&access_token=";

//Instagram token access, this should be the refresh token or the 60 days token
let token = "YOUR_ACCESS_TOKEN";

// This is a way to refresh the token which is recommended to do every 60 days and not manually
// URL to refresh the token
let url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;

// Data to store the last token date, this is to avoid making requests to the API every time
// It is recommended to refresh the token every 60 days
// We should store this data in a database or a file
let lastTokenDate = new Date() - 1;

// Check if the token is expired
if (lastTokenDate >= new Date()) {
  fetch(url)
    .then((response) => response.json())
    // Update the token and the date
    .then((data) => (token = data.access_token), (lastTokenDate = new Date()));
}

/**
 * Fetch Instagram posts
 */
async function fetchInstagramPosts() {
  try {
    // URL to get the data
    let jsonDataUrl = host + path + token;

    // Fetch the data
    let mediaResponse = await fetch(jsonDataUrl);
    let dataArray = await mediaResponse.json();

    // Array to store the images
    const imageGroup = [];

    // Loop through the data
    dataArray.data.forEach((element) => {
      let mediaElement;

      // Limit the caption to 100 characters
      if (element.caption) {
        if (element.caption.length > 100) {
          element.caption = element.caption.substring(0, 100) + "...";
        }
      }

      // Create an anchor element
      mediaElement = document.createElement("a");
      mediaElement.setAttribute(
        "onclick",
        `openContent("${element.id}", "${element.media_type}")`
      );
      mediaElement.innerHTML = `<img src='${
        element.media_type == "VIDEO"
          ? element.thumbnail_url
          : element.media_url
      }' name='${
        element.media_type == "VIDEO"
          ? (mediaElement.name = element.media_url)
          : ""
      }' id='${element.id}'alt="Instagram Post" style="object-fit: cover;">`;

      // Add a video icon if the media type is video
      if (element.media_type === "VIDEO") {
        mediaElement.innerHTML += `<i id="video-icon" class="fa-solid fa-clapperboard"></i>`;
      }

      // Add the caption and the Instagram icon with a link to the post
      mediaElement.innerHTML += `<p>${element.caption}</p>`;
      mediaElement.innerHTML += `<a href="${element.permalink}" target="_blank"><i class="fa-brands fa-instagram"></i></a>`;

      // Create a div container and append the media element
      const divContainer = document.createElement("div");
      divContainer.appendChild(mediaElement);
      imageGroup.push(divContainer); // Add the container to the image group
    });

    // Append the images to the container
    const container = document.querySelector(".instagram-gallery-medium");

    imageGroup.forEach((item) => {
      container.appendChild(item);
    });
  } catch (error) {
    console.error("Error loading Instagram posts:", error);
  }
}

/**
 * Open the content in a popup
 * @param {string} id - The ID of the element
 * @param {string} media_type - The type of media
 */
function openContent(id, media_type) {
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");

  // Clean the popup content
  popupContent.innerHTML = "";

  // Check if the media type is video
  if (media_type === "VIDEO") {
    // Create a video element
    const videoElement = document.createElement("video");

    videoElement.src = document.getElementById(id).name; // Add the video source
    videoElement.controls = true; // Add the controls
    popupContent.appendChild(videoElement); // Add the video to the popup
  } else {
    // Get the selected element
    const selectedElement = document.getElementById(id);

    if (selectedElement) {
      // Clone the content
      const clonedContent = selectedElement.cloneNode(true);
      popupContent.appendChild(clonedContent); // Add the content to the popup
    }
  }

  // Show the popup
  popup.classList.remove("hidden");
}

// Close the popup
document.getElementById("close-popup").addEventListener("click", () => {
  const popup = document.getElementById("popup");
  popup.classList.add("hidden");
});

fetchInstagramPosts();
