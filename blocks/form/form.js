export default async function decorate(block) {
  const url = new URL(block.textContent.trim());
  // fetch url
  const resp = await fetch(url.pathname);
  if (resp.ok) {
    const json = await resp.json();
    // json looks like this:
    // {"total":1,"offset":0,"limit":1,"data":
    // [{"Field":"Email","Type":"email","Label":"Email Address","Default":"you@example.com"}],
    // ":type":"sheet"}
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
}
