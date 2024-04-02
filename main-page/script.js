///////////////////          navigation menu           /////////////////////////

// burger button

const hamburgerButton = document.querySelector(".burger-menu");
const navlinks = document.querySelector(".navlinks");
const navlink = document.querySelector(".navlink");

hamburgerButton.addEventListener("click", toggleNav);

function toggleNav() {
  hamburgerButton.classList.toggle("active");
  navlinks.classList.toggle("active");
}

// simulate a click on hamburgerButton when link clicked
navlinks.addEventListener("click", () => {
  if (visualViewport.width < 751) {
    document.querySelector(".burger-menu").click();
  }
});

////////////////////        REVIEWS SLIDER            //////////////////
document.addEventListener("DOMContentLoaded", function () {
  const sliderContainer = document.querySelector(".slider-container");
  const reviewsContainer = document.querySelector(".box-all-reviews");
  const prevButton = document.querySelector(".slider-prev-btn");
  const nextButton = document.querySelector(".slider-next-btn");
  const goFirstButton = document.querySelector(".go-first-btn");
  const goLastButton = document.querySelector(".go-last-btn");
  const submitButton = document.querySelector(".submit-comment");
  const commentInput = document.querySelector(".new-comment");
  const nameInput = document.querySelector(".new-name");
  const pictureInput = document.querySelector(".new-picture");

  let currentIndex = 0;

  function updateSlider() {
    const slideWidth = reviewsContainer.firstElementChild.offsetWidth + 50;
    const offset = -currentIndex * slideWidth;
    reviewsContainer.style.transform = `translateX(${offset}px)`;
  }

  function addComment(comment, name, pictureData, date) {
    const newReviewBox = document.createElement("div");
    newReviewBox.classList.add("review-box");
    newReviewBox.setAttribute("data-id", date.getTime());

    newReviewBox.innerHTML = `
      <div class="photo-author">
        ${
          pictureData
            ? `<img src="data:image/jpeg;base64,${pictureData}" alt="" class="pic-author" />`
            : `<img src="/assets/img/avatar.svg" alt="avatar-default" class="pic-author" />`
        }
      </div>
      <div class="box-content-text">
        <span class="quote-left">&ldquo;</span>
        <p class="review-text">${comment}</p>
        <span class="quote-right">&rdquo;</span>
        <span class="name-author">${name}</span>
      </div>
      <div class="date-and-actions">
        <div class="date-review">
          <span class="date">${formatDate(date)}</span>
        </div>
        <div class="actions-review">
          <button class="edit-comment" data-date="${date.getTime()}">edit</button>
          <button class="delete-comment">x</button>
        </div>
      </div>
    `;

    const deleteButton = newReviewBox.querySelector(".delete-comment");
    deleteButton.addEventListener("click", () => {
      deleteComment(date);
    });

    const editButton = newReviewBox.querySelector(".edit-comment");
    editButton.addEventListener("click", () => {
      editComment(date);
    });

    reviewsContainer.insertBefore(newReviewBox, reviewsContainer.firstChild);
    updateSlider();
  }

  function formatDate(date) {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(date).toLocaleDateString("en-GB", options);
  }

  function loadComments() {
    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
    savedComments.sort((a, b) => a.date - b.date);
    savedComments.forEach((comment) => {
      const { text, name, picture, date } = comment;
      addComment(text, name, picture, new Date(date));
    });
  }

  loadComments(); // Load comments on page load

  submitButton.addEventListener("click", function () {
    const comment = commentInput.value;
    const name = nameInput.value;
    const picture = pictureInput.files[0];

    if (!comment.trim() || !name.trim()) {
      alert("You must provide both a comment and your name.");
      return;
    }

    let pictureData = null;

    if (picture) {
      const reader = new FileReader();
      reader.onload = function () {
        pictureData = reader.result.split(",")[1];
        const newCommentDate = new Date();
        addComment(comment, name, pictureData, newCommentDate);
        saveCommentToLocalStorage(comment, name, pictureData, newCommentDate);
        commentInput.value = "";
        nameInput.value = "";
        pictureInput.value = "";
      };
      reader.readAsDataURL(picture);
    } else {
      const newCommentDate = new Date();
      addComment(comment, name, pictureData, newCommentDate);
      saveCommentToLocalStorage(comment, name, pictureData, newCommentDate);
      commentInput.value = "";
      nameInput.value = "";
    }
  });

  function saveCommentToLocalStorage(comment, name, pictureData, date) {
    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
    savedComments.push({
      text: comment,
      name,
      picture: pictureData,
      date: date.getTime(),
    });
    localStorage.setItem("comments", JSON.stringify(savedComments));
  }

  function deleteComment(commentDate) {
    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
    const updatedComments = savedComments.filter(
      (comment) => comment.date !== commentDate.getTime()
    );
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    reviewsContainer.innerHTML = "";
    loadComments();
  }

  function editComment(commentDate) {
    const reviewBox = reviewsContainer.querySelector(
      `[data-id="${commentDate.getTime()}"]`
    );
    const reviewText = reviewBox.querySelector(".review-text");
    const actionsDiv = reviewBox.querySelector(".actions-review");

    reviewBox.classList.add("active");

    const editForm = document.createElement("form");
    editForm.innerHTML = `
      <textarea class="edit-textarea" rows="3">${reviewText.textContent}</textarea>
      <button type="submit" class="update-button">Update</button>
    `;

    reviewText.replaceWith(editForm);
    actionsDiv.style.display = "none";

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const newText = editForm.querySelector(".edit-textarea").value;
      updateComment(commentDate, newText);
    });
  }

  function updateComment(commentDate, newText) {
    const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
    const updatedComments = savedComments.map((comment) => {
      if (comment.date === commentDate.getTime()) {
        return { ...comment, text: newText };
      }
      return comment;
    });
    localStorage.setItem("comments", JSON.stringify(updatedComments));
    reviewsContainer.innerHTML = "";
    loadComments();
  }

  prevButton.addEventListener("click", function () {
    currentIndex--;
    if (currentIndex < 0) {
      currentIndex = 0;
    }
    updateSlider();
  });

  nextButton.addEventListener("click", function () {
    currentIndex++;
    if (currentIndex > reviewsContainer.children.length - 2) {
      currentIndex = reviewsContainer.children.length - 2;
    }
    updateSlider();
  });

  goFirstButton.addEventListener("click", function () {
    currentIndex = 0;
    updateSlider();
  });

  goLastButton.addEventListener("click", function () {
    currentIndex = reviewsContainer.children.length - 2;
    updateSlider();
  });
});

///////////////////////    TILT IMAGE       //////////////////
VanillaTilt.init(document.querySelector(".js-tilt"), {
  max: 25,
  speed: 400,
  glare: true,
  "max-glare": 0.4,
});

//////////////////////  contact shadow effect    /////////////

const inputContacts = document.querySelectorAll(".inputcontact");

inputContacts.forEach((input) => {
  input.addEventListener("click", () => {
    addShadowEffect(input);
  });
});

function addShadowEffect(el) {
  el.classList.add("shadow-effect");
  setTimeout(() => {
    el.classList.remove("shadow-effect");
  }, 300);
}

//////////////////////      adjust the scrolling     //////////////

// Calculate the height of the fixed header/navbar
const headerHeight = document.querySelector("header").offsetHeight;

// Smooth scrolling to sections with offset
document.querySelectorAll(".navlink").forEach((link) => {
  link.addEventListener("click", (event) => {
    event.preventDefault();
    const target = document.querySelector(link.getAttribute("href"));
    window.scrollTo({
      top: target.offsetTop - headerHeight,
      behavior: "smooth",
    });
  });
});

///////////////    function to show the form to add comments    /////////////
document.addEventListener("DOMContentLoaded", function () {
  const showFormLink = document.getElementById("show-form-link");
  const commentForm = document.getElementById("comment-form");
  const cancelFormButton = document.getElementById("cancel-form");

  showFormLink.addEventListener("click", function (e) {
    e.preventDefault();
    showFormLink.style.display = "none";
    commentForm.style.display = "flex";
  });
  cancelFormButton.addEventListener("click", function (e) {
    e.preventDefault();
    showFormLink.style.display = "inline";
    commentForm.style.display = "none";
  });
});
//////////////    redirect user to the booking page   ///////////////
const bookNowButton = document.getElementById("bookNowButton");
bookNowButton.addEventListener("click", function () {
  window.location.href = "index-book-now.html";
});
////////////      functionality to send email    ///////////////
document.addEventListener("DOMContentLoaded", () => {
  const contactForm = document.querySelector(".contact-form");

  contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(contactForm);

    try {
      const response = await emailjs.sendForm(
        "service_yourServiceId",
        "template_yourTemplateId",
        formData
      );
      console.log("Email sent:", response);
      alert("Email sent successfully! Thank you for contacting us.");
    } catch (error) {
      console.error("Error:", error);
      alert("Email not sent. Please try again later.");
    }
  });
});
