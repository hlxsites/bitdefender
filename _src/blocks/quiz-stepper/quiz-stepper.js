export default async function decorate(block) {
  const state = {
    score: 0,
    currentStep: 0,
  };

  block.classList.add('default-content-wrapper');

  const children = [...block.children];
  const steps = children;

  function renderStep(step, index) {
    const stepTitle = step.children[0].children[0].textContent;
    const stepOptions = [...step.children[0].children[1].children];
    const stepImage = step.children[1].children[0];
    const isFirstStep = index === 0;
    const isLastStep = index === steps.length - 1;

    const fieldId = `question-${index}`;

    return `
      <div class="form-wrapper">
        <form class="step">
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
        </form>
      </div>
    `;
  }

  function moveToNextStep() {
    state.currentStep += 1;
    const slideWrapper = block.querySelector('.slide-wrapper');
    const offset = 60;

    const transformValue = `translateX(calc(-100% * ${state.currentStep} - (${offset}px *  ${state.currentStep})))`;
    slideWrapper.style.transform = transformValue;
  }

  function moveToPreviousStep() {
    state.currentStep -= 1;
    const slideWrapper = block.querySelector('.slide-wrapper');
    const offset = 60;

    const transformValue = `translateX(calc(-100% * ${state.currentStep} - (${offset}px *  ${state.currentStep})))`;
    slideWrapper.style.transform = transformValue;
  }

//   function addMetaPropertiesInHead(resultTitle, resultImageSrc) {
//     const container = document.createElement('div');
//     container.innerHTML = `
//       <meta name="twitter:card" content="summary_large_image" />
//       <meta name="twitter:title" content="${resultTitle}" />
// <!--      <meta name="twitter:description" content="A brief description of the quiz" />-->
//       <meta name="twitter:image" content="${resultImageSrc}" />
//
//
//       <meta property="og:image" content="${resultImageSrc}" />
// <!--      <meta property="og:image:width" content="1200" />  &lt;!&ndash; Optional: Specify image width &ndash;&gt;-->
// <!--      <meta property="og:image:height" content="630" />  &lt;!&ndash; Optional: Specify image height &ndash;&gt;-->
//       <meta property="og:title" content="${resultTitle}" />
// <!--      <meta property="og:description" content="A brief description of the quiz" />-->
//       <meta property="og:url" content="${resultPageUrl}" />
//     `;
//
//     Array.from(container.children).forEach((tag) => {
//       document.head.prepend(tag);
//     });
//   }

  function renderResults() {
    block.style.transform = null;

    // get score
    const score = [...block.querySelectorAll('input[type="radio"]:checked')].map((inputEl) => inputEl.value).reduce((sc, value) => sc += Number(value), 0);
    console.log('score', score); // 3

    // todo replace with dynamic section metadata
    const legendScore = [
      {
        template: 'master-of-defence',
        interval: [7, 8],
      },
      {
        template: 'strategic-thinker',
        interval: [5, 6],
      },
      {
        template: 'precision-driver',
        interval: [3, 4],
      },
      {
        template: 'racing-challenger',
        interval: [0, 2],
      },
    ];

    const foundLegend = legendScore.find(({ interval: [min, max] }) => min <= score && score <= max);

    // redirect
    window.location.replace(`${window.location.href}${foundLegend.template}`);
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

  block.innerHTML = `
    <div class="slide-wrapper">${steps.map((step, index) => renderStep(step, index)).join('')}</div>
  `;

  block.querySelectorAll('.button-container.submit').forEach((buttonEl) => buttonEl.addEventListener('click', validateForm));
  block.querySelectorAll('.step__previous').forEach((previousEl) => previousEl.addEventListener('click', moveToPreviousStep));
}
