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

| **Option**        | **Description**                                             | **Type**                     | **Required** | **Default** | **Notes**                                             |
|-------------------|-------------------------------------------------------------|------------------------------|--------------|-------------|-------------------------------------------------------|
| `value`           | Initial value of the widget                                 | `Array \| null \| undefined` | no           | `undefined` | N/A                                                   |
| `onChange`        | Callback function that is called when the value changes     | `(value: Array) => void`     | no           | `undefined` | N/A                                                   |
| `locale`          | Locale to use for the widget                                | `string`                     | no           | `'en'`      | Available locales: 'en_US', 'de_DE', 'fr_FR', 'it_IT' |
| `fallbackLocale`  | Fallback locale to use if the given locale is not available | `'de'\|'en'\|'fr'\|'it'`     | no           | `'en'`      | Available locales: 'en', 'de_DE', 'fr_FR', 'it_IT'    |
| `readonly`        | If the widget should be readonly                            | `boolean`                    | no           | `false`     | N/A                                                   |
| `editInvalidJson` | Enable the user to edit invalid JSON as raw JSON            | `boolean`                    | no           | `false`     | N/A                                                   |

### Locale

The locale is used to determine the language of the widget. The locale is matched in the following order:
- direct match: `en`, `de`, `fr`, `it`
- language match (everything before the first underscore) (e.g. `en_US` -> `en`, `de_DE` -> `de`, `fr_FR` -> `fr`, `it_IT` -> `it`)

If no locale could be matched, the fallback locale (`fallbackLocale`) is used if available (only direct match). Else the default locale `en` is used.


