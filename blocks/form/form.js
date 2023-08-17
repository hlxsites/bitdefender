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

      const label = document.createElement('label');
      label.setAttribute('for', field.Field);
      label.textContent = field.Label;
      form.append(input);
      form.append(label);
    });

    block.append(form);
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
}
