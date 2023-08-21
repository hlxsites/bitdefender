function makeButtonClickable(form, emailInput) {
  // Targeting the anchor inside .button-container
  const submitButton = form.querySelector('.button-container .button');

  const allCheckboxesChecked = [...form.querySelectorAll('input[type="checkbox"]')].every((checkbox) => checkbox.checked);
  const emailPopulated = emailInput.value.trim() !== '';

  if (allCheckboxesChecked && emailPopulated) {
    submitButton.classList.add('clickable');
    submitButton.classList.remove('disabled');
  } else {
    submitButton.classList.remove('clickable');
    submitButton.classList.add('disabled');
  }
}

function wrapSubmitInButton(form) {
  const submitInput = form.querySelector('input[type="submit"]');
  if (!submitInput) return;

  // Create the button container
  const buttonContainer = document.createElement('p');
  buttonContainer.classList.add('button-container');

  // Create the anchor button
  const anchorButton = document.createElement('a');
  anchorButton.href = '#';
  anchorButton.title = submitInput.value;
  anchorButton.classList.add('button');

  submitInput.classList.add('disabled');

  // Create the span containing the button text
  const buttonText = document.createElement('span');
  buttonText.classList.add('button-text');
  buttonText.textContent = submitInput.value; // Taking value from submit input for button text

  // Append elements in hierarchy
  anchorButton.appendChild(buttonText);
  buttonContainer.appendChild(anchorButton);

  // Replace the submit input with the new button container
  form.replaceChild(buttonContainer, submitInput);
}

function displaySlide(index, slides) {
  const animationSection = document.querySelector('.section.animation');

  const fadeOutAndProceed = (slide, callback) => {
    // After 2.5 seconds, start the fade-out effect
    setTimeout(() => {
      const h2Element = slide.querySelector('h2');
      if (h2Element) {
        h2Element.classList.add('fade-out');

        // After the fade-out effect is done (0.5 seconds later), proceed
        setTimeout(() => {
          h2Element.classList.remove('fade-out');
          slide.classList.add('hidden');
          callback(); // Proceed to the next slide
        }, 500);
      } else {
        callback();
      }
    }, 2500);
  };

  if (index < slides.length) {
    slides[index].classList.remove('hidden'); // Display the current slide
    animationSection.style.display = 'block';

    // Start the fade-out effect and proceed to the next slide when it's done
    if (index === slides.length - 1) { // If it's the last loading slide
      animationSection.style.display = 'none';
    }
    fadeOutAndProceed(slides[index], () => {
      displaySlide(index + 1, slides);
    });
  } else {
    // When all loading slides have finished, display the slide-4
    const resultSlide = document.querySelector('.section.result.slide-4');
    resultSlide.classList.remove('hidden');
  }
}

function hideAllSlides(slides) {
  slides.forEach((slide) => {
    slide.classList.add('hidden');
  });

  // Initially hide the slide-4 too
  const resultSlide = document.querySelector('.section.result.slide-4');
  resultSlide.classList.add('hidden');
}

export default async function decorate(block) {
  const url = new URL(block.textContent.trim());
  // fetch url
  const resp = await fetch(url.pathname);
  if (resp.ok) {
    const json = await resp.json();
    const { data } = json;
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', url.pathname);

    data.forEach((field) => {
      const input = document.createElement('input');
      input.setAttribute('type', field.Type);
      input.setAttribute('name', field.Field);
      input.setAttribute('placeholder', field.Default);
      input.setAttribute('required', field.Required);
      input.setAttribute('value', field.Value);

      form.append(input);

      // Only create a label if the field.Label is not null
      if (field.Label) {
        const label = document.createElement('label');
        label.setAttribute('for', field.Field);
        label.textContent = field.Label;
        form.append(label);
      }
    });

    block.append(form);
    const emailInput = form.querySelector('input[type="email"]');

    wrapSubmitInButton(form);
    makeButtonClickable(form, emailInput);

    // Add event listeners to checkboxes
    form.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
      checkbox.addEventListener('change', () => makeButtonClickable(form, emailInput));
    });

    // Add event listener to email input
    emailInput.addEventListener('input', () => makeButtonClickable(form, emailInput));
  }

  // wrap the input of type checkbox and the following label into a div
  block.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    const div = document.createElement('div');
    div.classList.add('checkbox');

    const label = input.nextElementSibling;
    if (label && label.tagName === 'LABEL') {
      input.before(div);
      div.append(input, label);
    } else {
      input.after(div);
      div.append(input);
    }
  });

  // Slide display functionality starts here
  const formContainer = document.querySelector('.form-container');
  const slides = Array.from(document.querySelectorAll('.section.loading, .section.result.slide-4'));
  const submitButton = document.querySelector('.button-container .button');

  // Initially hide all slides
  hideAllSlides(slides);

  submitButton.addEventListener('click', (e) => {
    e.preventDefault(); // Prevent default action
    formContainer.classList.add('hidden'); // Hide form container using class

    displaySlide(0, slides);
  });
}
