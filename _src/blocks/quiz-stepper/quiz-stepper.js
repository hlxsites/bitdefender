export default async function decorate(block) {
  const state = {
    score: 0,
    currentStep: 0,
  };

  const resultPageUrl = window.location.href;

  block.classList.add('default-content-wrapper');

  const children = [...block.children];
  const possibleResultsEl = children.slice(-4);
  const steps = children.slice(0, children.length - 4).filter((item, idx) => idx < 2);
  console.log('steps', steps);
  console.log('possibleResultsEl', possibleResultsEl);
  console.log('block', block);

  function updateScore(score) {
    state.score += score;
    console.log('new score', state.score);
  }

  function renderStep(step, index) {
    const stepTitle = step.children[0].children[0].textContent;
    const stepOptions = [...step.children[0].children[1].children];
    const stepImage = step.children[1].children[0];
    console.log('stepImage', stepImage);
    const isFirstStep = index === 0;
    const isLastStep = index === steps.length - 1;

    const fieldId = `question-${index}`;

    return `<form class="step">
       <div class="step__header">
         <div class="step__index">Question ${index + 1}/${steps.length}:</div>
         ${!isFirstStep ? '<a class="step__previous">previous question</a>' : ''}
       </div>
    
       
       <fieldset>
         <legend>${stepTitle}</legend>
         
         
            ${stepOptions.map((option, idx) => {
    const value = option.querySelector('u') ? 1 : 0;
    const forLabel = `${fieldId}-${idx}`;

    return `
            <div class="step__radio-wrapper">
              <input type="radio" id="${forLabel}" name="${fieldId}" value="${value}" required aria-required="true"/>
              <label for="${forLabel}">${option.textContent}</label>
            </div>  
            `;
  }).join('')}
       </fieldset>

       <p class="button-container submit">
        <a class="button modal" href="">${!isLastStep ? 'Next Question' : 'See Your Result'}</a>
       </p>
     
        <div class="img-container">
            ${stepImage.outerHTML}
        </div>    
    </form>`;
  }

  block.innerHTML = `
    ${steps.map((step, index) => renderStep(step, index)).join('')}
  `;

  function moveToNextStep() {
    state.currentStep += 1;

    block.style.transform = `translateX(calc(-100% * ${state.currentStep} + (10px *  ${state.currentStep})))`;
  }

  function moveToPreviousStep() {
    state.currentStep -= 1;

    block.style.transform = `translateX(calc(-100% * ${state.currentStep} + (10px *  ${state.currentStep})))`;
  }

  function addMetaPropertiesInHead(resultTitle, resultImageSrc) {
    const container = document.createElement('div');
    container.innerHTML = `
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="${resultTitle}" />
<!--      <meta name="twitter:description" content="A brief description of the quiz" />-->
      <meta name="twitter:image" content="${resultImageSrc}" />
      
      
      <meta property="og:image" content="${resultImageSrc}" />
<!--      <meta property="og:image:width" content="1200" />  &lt;!&ndash; Optional: Specify image width &ndash;&gt;-->
<!--      <meta property="og:image:height" content="630" />  &lt;!&ndash; Optional: Specify image height &ndash;&gt;-->
      <meta property="og:title" content="${resultTitle}" />
<!--      <meta property="og:description" content="A brief description of the quiz" />-->
      <meta property="og:url" content="${resultPageUrl}" />
    `;

    Array.from(container.children).forEach(tag => {
      document.head.prepend(tag);
    });
  }

  function renderResults() {
    block.style.transform = null;

    // get score
    const score = [...block.querySelectorAll('input[type="radio"]:checked')].map((inputEl) => inputEl.value).reduce((sc, value) => sc += Number(value), 0);
    console.log('score', score); // 3

    // todo replace with dynamic section metadata
    const legendScore = [
      {
        template: '[$result-1]',
        interval: [7, 8],
      },
      {
        template: '[$result-2]',
        interval: [5, 6],
      },
      {
        template: '[$result-3]',
        interval: [3, 4],
      },
      {
        template: '[$result-4]',
        interval: [0, 2],
      },
    ];

    const foundLegend = legendScore.find(({ interval: [min, max] }) => min <= score && score <= max);

    const resultTemplate = possibleResultsEl.find((divEl) => divEl.innerHTML.includes(foundLegend.template));

    const resultTitle = 'result-title';

    console.log('resultTemplate', resultTemplate);

    const [rte, pictureEl] = [...resultTemplate.children];
    const social = rte.lastElementChild;

    addMetaPropertiesInHead(resultTitle, pictureEl.querySelector('img').src);

    rte.lastElementChild.remove();

    block.innerHTML = `
      <div class="results-wrapper">
        ${rte.innerHTML}
        <div class="img-container">${pictureEl.innerHTML}</div>
        
        <div class="social-wrapper">
            ${social.innerHTML}
        </div>
      </div>
    `;

    const socialWrapperEl = block.querySelector('.social-wrapper');
    [...socialWrapperEl.querySelectorAll('a')].forEach((anchor) => {
      anchor.target = '_blank';
      anchor.rel = 'noopener noreferrer';

      if (anchor.href.includes('twitter')) {
        const twitterBaseUrl = 'https://twitter.com/intent/tweet?';
        const twitterText = `text=${encodeURIComponent(`Check out my quiz results: ${resultTitle}`)}`;
        const twitterUrl = `&url=${encodeURIComponent(resultPageUrl)}`;
        const fullTwitterUrl = twitterBaseUrl + twitterText + twitterUrl;
        anchor.href = fullTwitterUrl;
      }
      if (anchor.href.includes('linkedin')) {
        const linkedInBaseUrl = 'https://www.linkedin.com/sharing/share-offsite/?';
        const linkedInUrl = `url=${encodeURIComponent(resultPageUrl)}`;
        const fullLinkedInUrl = linkedInBaseUrl + linkedInUrl;
        anchor.href = fullLinkedInUrl;
      }
      if (anchor.href.includes('facebook')) {
        const facebookBaseUrl = 'https://www.facebook.com/sharer/sharer.php?';
        const facebookUrl = `u=${encodeURIComponent(resultPageUrl)}`;
        const fullFacebookUrl = facebookBaseUrl + facebookUrl;
        anchor.href = fullFacebookUrl;
      }
    });
  }

  function validateForm(e) {
    e.preventDefault();

    console.log('e', e);
    const formEl = e.target.closest('form');
    const selectedOption = formEl.querySelector('input[type="radio"]:checked');
    const isLastStep = state.currentStep === steps.length - 1;

    if (!selectedOption) {
      // todo show error message
      return;
    }

    console.log('valid');

    if (!isLastStep) {
      moveToNextStep();
      return;
    }

    renderResults();
  }

  block.querySelectorAll('.button-container.submit').forEach((buttonEl) => buttonEl.addEventListener('click', validateForm));
  block.querySelectorAll('.step__previous').forEach((previousEl) => previousEl.addEventListener('click', moveToPreviousStep));
}
