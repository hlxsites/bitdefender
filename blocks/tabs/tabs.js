/**
 * @typedef TabInfo
 * @property {string} name
 * @property {HTMLElement} $tab
 * @property {HTMLElement} $content
 */

/**
 * @param {HTMLElement} block
 * @return {TabInfo[]}
 */
export function createTabs(block) {
    const $ul = block.querySelector('ul');
    if (!$ul) {
        return null;
    }
    /** @type TabInfo[] */
    const tabs = [...$ul.querySelectorAll('li')].map(($li) => {
        const title = $li.textContent;
        const name = title.toLowerCase().trim();
        return {
            title,
            name,
            $tab: $li,
        };
    });
    // move $ul below section div
    block.replaceChildren($ul);

    // search referenced sections and move them inside the tab-container
    const $wrapper = block.parentElement;
    const $container = $wrapper.parentElement;
    const $sections = document.querySelectorAll('[data-tab]');

    // move the tab's sections before the tab riders.
    [...$sections].forEach(($tabContent) => {
        const name = $tabContent.dataset.tab.toLowerCase().trim();
        /** @type TabInfo */
        const tab = tabs.find((t) => t.name === name);
        if (tab) {
            const $el = document.createElement('div');
            $el.classList.add('tab-item');
            $el.append(...$tabContent.children);
            $el.classList.add('hidden');
            block.appendChild($el);
            $tabContent.remove();
            tab.$content = $el;
        }
    });
    return tabs;
}

/**
 * @param {HTMLElement} block
 */
export default function decorate(block) {
    const tabs = createTabs(block);

    tabs.forEach((tab, index) => {
        const button = document.createElement('button');
        const { $tab, title, name } = tab;
        button.textContent = title;
        button.classList.add('tab');

        $tab.replaceChildren(button);

        $tab.addEventListener('click', () => {
            const $activeButton = block.querySelector('button.active');

            if ($activeButton !== $tab) {
                $activeButton.classList.remove('active');
                // remove active class from parent li
                $activeButton.parentElement.classList.remove('active');

                button.classList.add('active');
                // add active class to parent li
                $tab.classList.add('active');

                tabs.forEach((t) => {
                    if (name === t.name) {
                        t.$content.classList.remove('hidden');
                    } else {
                        t.$content.classList.add('hidden');
                    }
                });
            }
        });

        if (index === 0) {
            button.classList.add('active');
            // add active class to parent li
            $tab.classList.add('active');
            tab.$content.classList.remove('hidden');
        }
    });
}