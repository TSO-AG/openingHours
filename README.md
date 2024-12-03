# openingHours

## Example
```javascript
const openingHoursWidget = require("@tso/opening-hours-widget");

const el = document.querySelector('#openingHoursInput');
let inputValue = null;

openingHoursWidget.initOpeningHoursWidget(el, {
    value: inputValue,
    readonly: false,
    onChange: (value) => inputValue = value,
    locale: 'de_DE',
    editInvalidJson: true,
});
```

### Parameter
#### el
The element to initialize the widget on
Type: `HTMLElement`
Required: true

| **Option**        | **Description**                                         | **Type**      | **Required** | **Default**     | **Notes**                                   |
|--------------------|---------------------------------------------------------|---------------|--------------|-----------------|---------------------------------------------|
| `value`           | Initial value of the widget                            | `string`      | true         | N/A             | N/A                                         |
| `readonly`        | If the widget should be readonly                       | `boolean`     | true         | N/A             | N/A                                         |
| `onChange`        | Callback function that is called when the value changes| `function`    | true         | N/A             | N/A                                         |
| `locale`          | Locale to use for the widget                           | `string`      | false        | `'en_US'`       | Available locales: 'en_US', 'de_DE', 'fr_FR', 'it_IT' |
| `editInvalidJson` | Enable the user to edit invalid JSON as raw JSON       | `boolean`     | false        | `false`         | N/A                                         |

