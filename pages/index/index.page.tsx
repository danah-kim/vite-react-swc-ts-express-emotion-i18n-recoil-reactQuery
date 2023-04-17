import { LocaleText } from 'libs/LocaleText';

import { Counter } from './Counter';

export { Page };

function Page() {
  return (
    <>
      <LocaleText id="welcome" type="h1" isHtml />
      This page is:
      <ul>
        <li>Rendered to HTML.</li>
        <li>
          Interactive. <Counter />
        </li>
      </ul>
    </>
  );
}
