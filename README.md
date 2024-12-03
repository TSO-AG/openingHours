# openingHours

## Example
```html
<div id="openingHoursInput"></div>
```

```javascript
const openingHoursWidget = require("@tso/opening-hours-widget");

const el = document.querySelector('#openingHoursInput');
let inputValue = null;

openingHoursWidget.initOpeningHoursWidget(el, {
    value: inputValue,
    onChange: (value) => inputValue = value,
    locale: 'de',
    fallbackLocale: 'en',
    readonly: false,
    editInvalidJson: true,
});
```

### Parameters

| **Option** | **Description**                         | **Type**      | **Required** |
|------------|-----------------------------------------|---------------|--------------|
| `el`       | The element to initialize the widget on | `HTMLElement` | yes          |
| `options`  | Configuration object for the widget     | `Object`      | no           |


### Options

| **Option**        | **Description**                                             | **Type**                     | **Required** | **Default** |
|-------------------|-------------------------------------------------------------|------------------------------|--------------|-------------|
| `value`           | Initial value of the widget                                 | `Array \| null \| undefined` | no           | `undefined` |
| `onChange`        | Callback function that is called when the value changes     | `(value: Array) => void`     | no           | `undefined` |
| `locale`          | Locale to use for the widget                                | `string`                     | no           | `'en'`      |
| `fallbackLocale`  | Fallback locale to use if the given locale is not available | `'de'\|'en'\|'fr'\|'it'`     | no           | `'en'`      |
| `readonly`        | If the widget should be readonly                            | `boolean`                    | no           | `false`     |
| `editInvalidJson` | Enable the user to edit invalid JSON as raw JSON            | `boolean`                    | no           | `false`     |

### Locale

The following locales are available: `en`, `de`, `fr`, `it`.

The available locales are matched in the following order:
- direct match: `en`, `de`, `fr`, `it`
- language match (everything before the first underscore) (e.g. `en_US` -> `en`, `de_DE` -> `de`, `fr_FR` -> `fr`, `it_IT` -> `it`)

If no available locale could be matched, the fallback locale (`fallbackLocale`) is used if available. Else the default locale `en` is used.


