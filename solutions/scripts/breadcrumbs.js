import {
  createTag,
  fetchIndex,
  fixExcelFilterZeroes,
} from './utils/utils.js';

// eslint-disable-next-line import/no-cycle
import { decorateBlockWithRegionId } from './scripts.js';

function prependSlash(path) {
  return path.startsWith('/') ? path : `/${path}`;
}

function getName(pageIndex, path, part, current) {
  const pg = pageIndex.find((page) => page.path === path);
  if (pg && pg.breadcrumbtitle && pg.breadcrumbtitle !== '0') {
    return pg.breadcrumbtitle;
  }

  if (pg && pg.title && pg.title !== '0') {
    return pg.title;
  }

  if (current) {
    return document.title;
  }

  return part;
}

function renderBreadcrumb(breadcrumbs) {
  return createTag(
    'a',
    { href: breadcrumbs.url_path ? breadcrumbs.url_path : '#' },
    breadcrumbs.name,
  );
}

async function createBreadcrumbs(container) {
  const { pathname } = window.location;
  const pathSeparator = '/';
  // split pathname into parts add / at the end and remove empty parts
  const pathSplit = pathname.split('/').reduce((acc, curr, index, array) => {
    if (index < array.length - 1) {
      acc.push(`${curr}/`);
    } else if (curr !== '') {
      acc.push(curr);
    }
    return acc;
  }, []);

  const pageIndex = (await fetchIndex('query-index')).data;
  fixExcelFilterZeroes(pageIndex);
  // eslint-disable-next-line max-len
  const urlForIndex = (index) => prependSlash(pathSplit.slice(1, index + 2).join(pathSeparator));

  const breadcrumbs = [
    {
      name: 'Home',
      url_path: '/',
    },
    ...pathSplit.slice(1, -1).map((part, index) => {
      const url = urlForIndex(index);
      return {
        name: getName(pageIndex, url, part, false),
        url_path: url,
      };
    }),
    {
      // get the breadcrumb title from the metadata; if the metadata does not contain it,
      // the last part of the path is used as the breadcrumb title
      name: getName(pageIndex, pathname, pathSplit[pathSplit.length - 1], true),
    },
  ];

  breadcrumbs.forEach((crumb) => {
    if (crumb.name) {
      container.append(renderBreadcrumb(crumb));
    }
  });
}

// eslint-disable-next-line import/prefer-default-export
export async function loadBreadcrumbs() {
  const breadcrumb = document.querySelector('.breadcrumb');
  decorateBlockWithRegionId(breadcrumb, 'Hero|Breadcrumb');

  // check if breadcrumb div exists
  if (breadcrumb) {
    await createBreadcrumbs(breadcrumb);
  }
}
