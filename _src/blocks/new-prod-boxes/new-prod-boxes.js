/* eslint-disable prefer-const */
/* eslint-disable no-undef */
/* eslint-disable max-len */
async function createPricesElement(storeOBJ, conditionText, saveText, prodName, prodUsers, prodYears, buylink) {
  const storeProduct = await storeOBJ.getProducts([new ProductInfo(prodName, 'consumer')]);
  const storeOption = storeProduct[prodName].getOption(prodUsers, prodYears);
  const price = storeOption.getPrice();
  const discountedPrice = storeOption.getDiscountedPrice();
  const discount = storeOption.getDiscount('valueWithCurrency');
  const buyLink = await storeOption.getStoreUrl();
  window.adobeDataLayer.push({
    event: 'product loaded',
    product: [{
      info: {
        ID: storeOption.getAvangateId(),
        name: storeOption.getName(),
        devices: storeOption.getDevices(),
        subscription: storeOption.getSubscription('months'),
        version: storeOption.getSubscription('months') === 1 ? 'monthly' : 'yearly',
        basePrice: storeOption.getPrice('value'),
        discountValue: storeOption.getDiscount('value'),
        discountRate: storeOption.getDiscount('percentage'),
        currency: storeOption.getCurrency(),
        priceWithTax: storeOption.getDiscountedPrice('value') || storeOption.getPrice('value'),
      },
    }],
  });
  const priceElement = document.createElement('div');
  priceElement.classList.add('hero-aem__prices');
  priceElement.innerHTML = `
    <div class="hero-aem__price mt-3">
      <div>
          <span class="prod-oldprice">${price}</span>
          <span class="prod-save">${saveText} ${discount}<span class="save"></span></span>
      </div>
      <div class="newprice-container mt-2">
        <span class="prod-newprice">${discountedPrice}</span>
        <sup>${conditionText || ''}</sup>
      </div>
    </div>`;
  buylink.href = buyLink;
  return priceElement;
}

export default function decorate(block, options) {
  const {
    products, priceType,
  } = options ? options.metadata : block.closest('.section').dataset;
  console.log('my block', block);
  const aemContainer = block.children[1];
  aemContainer.classList.add('new-prod-boxes-container');
  aemContainer.classList.add('we-container');
  const underShadow = aemContainer.children[1];
  underShadow.classList.add('block');

  let switchBox = document.createElement('div');
  switchBox.classList.add('switchBox');
  switchBox.innerHTML = `
  <label class="switch">
    <input type="checkbox">
    <span class="slider round">
      <span class="label on">Individual</span>
      <span class="label off">Family</span>
    </span>
  </label>
`;

  const productsAsList = products && products.split(',');
  if (productsAsList.length) {
    // productsAsList.forEach((prod) => updateProductsList(prod));

    [...underShadow.children].forEach(async (prod, key) => {
      const [greenTag, title, blueTag, subtitle, saveOldPrice, price, billed, buyLink, undeBuyLink, benefitsLists] = [...prod.querySelectorAll('tr')];
      // const [prodName, prodUsers, prodYears] = productsAsList[key].split('/');
      const onSelectorClass = 'tsmd-10-1';
      const [prodName, prodUsers, prodYears] = productsAsList[key].split('/');
      const featuresSet = benefitsLists.querySelectorAll('table');
      const featureList = Array.from(featuresSet).map((table) => {
        const trList = Array.from(table.querySelectorAll('tr'));
        const liString = trList.map((tr) => {
          const tdList = Array.from(tr.querySelectorAll('td'));
          // Extract the content of the first <td> to be placed outside the <li>
          let firstTdContent = tdList.length > 0 && tdList[0].textContent.trim() !== '' ? `${tdList[0].innerHTML}` : '';
          // Extract the content of the second <td> (if present) inside a <span>
          const secondTdContent = tdList.length > 1 && tdList[1].textContent.trim() !== '' ? `<span>${tdList[1].innerHTML}</span>` : '';

          // Create the <li> combining the first and second td content
          let liClass = '';
          if (firstTdContent === '') {
            liClass += 'd-none';
          }

          if (firstTdContent.indexOf('?pill') !== -1) {
            let pillText = firstTdContent.match(/\?pill (\w+)/);
            if (pillText) {
              const pillElement = document.createElement('span');
              pillElement.classList.add('blue-pill');
              pillElement.innerHTML = `${pillText[1]}`;
              firstTdContent = firstTdContent.replace(pillText[0], pillElement.outerHTML);
            }
          }
          // &lt reffers to '<' character
          if (firstTdContent.indexOf('&lt;pill') !== -1 || firstTdContent.indexOf('&lt;') !== -1) {
            liClass += ' has_arrow';
            firstTdContent = firstTdContent.replace('&lt;-', '');
          }

          // &lt reffers to '<' character
          if (firstTdContent.indexOf('&lt;-') !== -1 || firstTdContent.indexOf('&lt;') !== -1) {
            liClass += ' has_arrow';
            firstTdContent = firstTdContent.replace('&lt;-', '');
          }

          // &gt reffers to '>' character
          if (firstTdContent.indexOf('-&gt;') !== -1 || firstTdContent.indexOf('&gt;') !== -1) {
            liClass += ' has_arrow_right';
            firstTdContent = firstTdContent.replace('-&gt;', '<span class="arrow-right"></span>');
          }

          const liContent = `<li class="${liClass}">${firstTdContent}${secondTdContent}</li>`;

          return liContent;
        }).join('');

        return `<ul>${liString}</ul>`;
      });

      if (title.innerHTML.indexOf('href') !== -1) {
        title.innerHTML = `<a href="#" title="${title.innerText}" class="buylink-${onSelectorClass} await-loader prodload prodload-${onSelectorClass}">${title.querySelector('tr a').innerHTML}</a>`;
      }

      const buyLinkSelector = prod.querySelector('a[href*="#buylink"]');
      buyLinkSelector.classList.add('button', 'primary');
      await createPricesElement(options.store, '', 'Save', prodName, prodUsers, prodYears, buyLinkSelector)
        .then((pricesBox) => {
          console.log(pricesBox);
          // buyLink.parentNode.parentNode.insertBefore(pricesBox, buyLink.parentNode);
          prod.outerHTML = `
        <div class="prod_box${greenTag.innerText.trim() && ' hasGreenTag'}">
          <div class="inner_prod_box">
            ${greenTag.innerText.trim() ? `<div class="greenTag2">${greenTag.innerText.trim()}</div>` : ''}
            ${title.innerText.trim() ? `<h2>${title.innerHTML}</h2>` : ''}
            ${blueTag.innerText.trim() ? `<div class="blueTag"><div>${blueTag.innerHTML.trim()}</div></div>` : ''}
            ${subtitle.innerText.trim() ? `<p class="subtitle${subtitle.innerText.trim().split(/\s+/).length > 5 ? ' fixed_height' : ''}">${subtitle.innerText.trim()}</p>` : ''}
            <hr />

            ${pricesBox.outerHTML}

            ${billed ? `<div class="billed">${billed.innerHTML.replace('0', `<span class="newprice-${onSelectorClass}"></span>`)}</div>` : ''}

            ${buyLink.outerHTML}

            ${undeBuyLink.innerText.trim() ? `<div class="undeBuyLink">${undeBuyLink.innerText.trim()}</div>` : ''}
            <hr />
            ${benefitsLists.innerText.trim() ? `<div class="benefitsLists">${featureList}</div>` : ''}
          </div>
        </div>`;
        });
    });
  } else {
    underShadow.innerHTML = `
    <div class="container-fluid">
      add some products
    </div>`;
  }

  underShadow.parentNode.insertBefore(switchBox, underShadow);


  window.dispatchEvent(new CustomEvent('shadowDomLoaded'), {
    bubbles: true,
    composed: true, // This allows the event to cross the shadow DOM boundary
  });
}
