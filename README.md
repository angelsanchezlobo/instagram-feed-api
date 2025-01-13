### 📸 Instagram Gallery

This project implements an interactive gallery that displays Instagram posts using the Instagram Graph API. It includes:

- **Post Gallery**: Displays images and videos organized in a modern and responsive grid layout.  
- **Interactive Popup**: Clicking on a post opens a popup showcasing expanded content with viewable images or playable videos.  
- **Modern Styling**: Clean and appealing design with hover effects, rounded corners, and Font Awesome icons.  
- **Dynamic Connection**: Automatically fetches posts through calls to the Instagram API.  

Perfect for integrating Instagram content elegantly and functionally into any webpage. 🎉  

### 📘 Instagram API Integration Instructions

This project connects to Instagram's Graph API to fetch and display posts dynamically. Follow these steps to understand and manage the API integration:

---

#### **1. API Endpoint Configuration**

- **Host URL**:  
  The base URL for fetching media posts from Instagram:  
  ```javascript
  let host = "https://graph.instagram.com/me/media?";
  ```

- **API Fields**:  
  The query includes the following fields:  
  - `id`  
  - `media_url`  
  - `permalink`  
  - `media_type`  
  - `thumbnail_url`  
  - `caption`  
  Example of the full query string:  
  ```javascript
  let path = "fields=id,media_url,permalink,media_type,thumbnail_url,caption&access_token=";
  ```

---

#### **2. Access Token Management**

- **Access Token**:  
  Use a long-lived (60-day) access token. Replace `YOUR_ACCESS_TOKEN` with your valid token:  
  ```javascript
  let token = "YOUR_ACCESS_TOKEN";
  ```

- **Refreshing the Token**:  
  Instagram recommends refreshing the token every 60 days. Use the following URL to refresh it:  
  ```javascript
  let url = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${token}`;
  ```

- **Token Expiry Handling**:  
  Store the token's last refresh date and update it only if expired:  
  ```javascript
  let lastTokenDate = new Date() - 1;
  if (lastTokenDate >= new Date()) {
    fetch(url)
      .then((response) => response.json())
      .then((data) => (token = data.access_token), (lastTokenDate = new Date()));
  }
  ```

---

#### **3. Fetch Instagram Posts**

The `fetchInstagramPosts()` function retrieves and displays posts:  
1. Constructs the API request URL using the token.  
2. Fetches media data and processes each post, limiting captions to 100 characters.  
3. Displays content (images, videos) dynamically in a responsive gallery.  

Example of the process:  
```javascript
let jsonDataUrl = host + path + token;

let mediaResponse = await fetch(jsonDataUrl);
let dataArray = await mediaResponse.json();

dataArray.data.forEach((element) => {
  // Process and display each post
});
```

---

#### **4. Popup Interaction**

- Posts can be opened in an interactive popup for detailed viewing:  
  - Videos are displayed with controls.  
  - Images are cloned and displayed in the popup.  
- Example logic for videos:  
  ```javascript
  const videoElement = document.createElement("video");
  videoElement.src = document.getElementById(id).name;
  videoElement.controls = true;
  popupContent.appendChild(videoElement);
  ```

- Popup is closed via a dedicated button:  
  ```javascript
  document.getElementById("close-popup").addEventListener("click", () => {
    popup.classList.add("hidden");
  });
  ```

---

#### **5. Best Practices**

- **Token Storage**: Store the token securely in a database or a backend service, not directly in the frontend.  
- **Caching**: Cache fetched media data to reduce API calls and improve performance.  
- **Error Handling**: Implement robust error handling for API requests to manage rate limits or token expiry issues.  

---

By following these steps, you can seamlessly integrate and maintain an Instagram gallery in your project. For additional details, consult [Instagram Graph API Documentation](https://developers.facebook.com/docs/instagram-api).
