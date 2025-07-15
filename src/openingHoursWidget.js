const widgetTemplate = require('./templates/widgetTemplate.js');
const widgetTemplateDialogInvalid = require('./templates/widgetTemplateDialogInvalid.js');
const widgetTemplateDialog = require('./templates/widgetTemplateDialog.js');
const translations = require('./translations');

const openingHoursWidget = {

    availableLocales: Object.keys(translations),

    /**
     * @param {HTMLElement} el The element to initialize the widget on
     * @param {Array|null|undefined} [value] Initial value of the widget
     * @param {(value: Array) => void} [onChange] If the widget should be readonly
     * @param {"de"|"en"|"fr"|"it"|string} [locale] Locale to use for the widget
     * @param {"de"|"en"|"fr"|"it"} [fallbackLocale] Fallback locale to use if the given locale is not available
     * @param {boolean} [readonly] If the widget should be readonly
     * @param {boolean} [editInvalidJson] Enable the user to edit invalid JSON as raw JSON
     */
    initOpeningHoursWidget(el, {
        value = undefined,
        onChange = undefined,
        locale = 'en',
        fallbackLocale = 'en',
        readonly = false,
        editInvalidJson = false
    } = {}) {

        const weekdays =  [
            {
                key: 'monday',
                value: 'https://schema.org/Monday',
                labelKey: 'weekdays.monday'
            },
            {
                key: 'tuesday',
                value: 'https://schema.org/Tuesday',
                labelKey: 'weekdays.tuesday'
            },
            {
                key: 'wednesday',
                value: 'https://schema.org/Wednesday',
                labelKey: 'weekdays.wednesday'
            },
            {
                key: 'thursday',
                value: 'https://schema.org/Thursday',
                labelKey: 'weekdays.thursday'
            },
            {
                key: 'friday',
                value: 'https://schema.org/Friday',
                labelKey: 'weekdays.friday'
            },
            {
                key: 'saturday',
                value: 'https://schema.org/Saturday',
                labelKey: 'weekdays.saturday'
            },
            {
                key: 'sunday',
                value: 'https://schema.org/Sunday',
                labelKey: 'weekdays.sunday'
            },
        ];

        let currentValue = value;

        /** @var {"de"|"en"|"fr"|"it"} */
        const localeToUse = (() => {
            // Direct match
            if (openingHoursWidget.availableLocales.includes(locale)) {
                return locale;
            }

            // Partial match (only the language part)
            const languageFromLocale = locale.split('_')[0];
            const partialMatch = openingHoursWidget.availableLocales
                .find(l => l.split('_')[0] === languageFromLocale);
            if (partialMatch) {
                return partialMatch;
            }

            // Fallback locale (if available)
            if (openingHoursWidget.availableLocales.includes(fallbackLocale)) {
                return fallbackLocale;
            }

            // Fallback
            return 'en';
        })();

        const render = () => {
            const isValid = isValidData(currentValue);
            const groupedEntries = isValid ? getGroupedEntriesForDisplay() : undefined;
            const isAnyWeekdayConfigured = isValid ? Object.values(groupedEntries).some((entries) => entries.length > 0) : false;

            el.innerHTML = widgetTemplate({
                isValid,
                isAnyWeekdayConfigured,
                readonly,
                translate,
                weekdays,
                groupedEntries,
                editInvalidJson,
            })

            addEvent(el, 'button[data-action="editData"]', 'click', openEditModal);
            addEvent(el, 'button[data-action="editRawData"]', 'click', openRawEditModal);

            // Reset data
            addEvent(el, 'button[data-action="resetData"]', 'click', () => {
                setCurrentValue([]);
                render();
            });
        }

        const openEditModal = () => {

            // Check if data is valid
            const isValid = isValidData(currentValue);
            if (!isValid) {
                throw new Error('Cant open edit modal because data is invalid');
            }

            let workingData = currentDataToWorkingData(currentValue);

            const modal = el.querySelector('dialog');

            const renderModal = (errors = undefined) => {
                const errorClass = (day, index, property) => {
                    if (Array.isArray(index)) {
                        const groupIndex = index[0];
                        const entryIndex = index[1];
                        if (errors?.[day]?.[groupIndex]?.entries?.[entryIndex]?.[property]) {
                            return 'TsoOpeningHours__Field--error';
                        }
                    } else {
                        if (errors?.[day]?.[index]?.[property]) {
                            return 'TsoOpeningHours__Field--error';
                        }
                    }
                    return '';
                }

                const errorMessage = (day, index, property) => {
                    if (Array.isArray(index)) {
                        const groupIndex = index[0];
                        const entryIndex = index[1];
                        const error = errors?.[day]?.[groupIndex]?.entries?.[entryIndex]?.[property];
                        if (error) {
                            return `<div class="TsoOpeningHours__Field__error">${error}</div>`;
                        }
                    } else {
                        const error = errors?.[day]?.[index]?.[property];
                        if (error) {
                            return `<div class="TsoOpeningHours__Field__error">${error}</div>`;
                        }
                    }
                    return '';
                }

                modal.innerHTML = widgetTemplateDialog({
                    weekdays,
                    today: new Date().toISOString().split('T')[0],
                    entries: workingData,
                    errorClass,
                    errorMessage,
                    translate,
                });

                // Weekday interactions
                addEvent(modal, '[data-action="addWeekdayEntry"]', 'click', (event) => {
                    const dayOfWeek = event.target.closest('[data-day-of-week]')?.getAttribute('data-day-of-week');
                    const index = parseInt(event.target.closest('[data-index]')?.getAttribute('data-index'));
                    workingData[dayOfWeek] = [
                        ...workingData[dayOfWeek].slice(0, index + 1),
                        {
                            data: {
                                '@type': 'OpeningHoursSpecification',
                                'dayOfWeek': weekdays.find((weekday) => weekday.key === dayOfWeek)?.value,
                            }
                        },
                        ...workingData[dayOfWeek].slice(index + 1),
                    ]
                    renderModal();
                });
                addEvent(modal, '[data-action="removeWeekdayEntry"]', 'click', (event) => {
                    const dayOfWeek = event.target.closest('[data-day-of-week]')?.getAttribute('data-day-of-week');
                    const index = parseInt(event.target.closest('[data-index]')?.getAttribute('data-index'));
                    workingData[dayOfWeek] = workingData[dayOfWeek].filter((_, i) => i !== index);
                    renderModal();
                });
                addEvent(modal, '[data-action="toggleWeekday"]', 'click', (event) => {
                    const dayOfWeek = event.target.closest('[data-day-of-week]')?.getAttribute('data-day-of-week');
                    const shouldOpen = event.target.checked;
                    workingData[dayOfWeek] = shouldOpen ? [{
                        data: {
                            '@type': 'OpeningHoursSpecification',
                            'dayOfWeek': weekdays.find((weekday) => weekday.key === dayOfWeek)?.value,
                        }
                    }] : [];
                    renderModal();
                });
                const weekdayFieldNames = ['opens', 'closes'];
                const weekdayFieldEventNames = weekdayFieldNames.map((name) => `.TsoOpeningHours__Weekdays [name="${name}"]`).join(', ');
                addEvent(modal, weekdayFieldEventNames, 'change', (event) => {
                    const dayOfWeek = event.target.closest('[data-day-of-week]')?.getAttribute('data-day-of-week');
                    const index = parseInt(event.target.closest('[data-index]')?.getAttribute('data-index'));
                    const value = event.target.value;
                    const name = event.target.getAttribute('name');
                    workingData[dayOfWeek][index].data[name] = value;
                });

                // Specific opening hours interactions
                addEvent(modal, '[data-action="addSpecificGroup"]', 'click', (event) => {
                    workingData.specific.push({
                        closed: true,
                        entries: [{ data: {} }],
                    });
                    renderModal();
                });
                addEvent(modal, '[data-action="toggleSpecificGroup"]', 'click', (event) => {
                    const groupIndex = parseInt(event.target.closest('[data-group-index]')?.getAttribute('data-group-index'));
                    const shouldOpen = event.target.checked;
                    workingData.specific[groupIndex].closed = !shouldOpen;
                    renderModal();
                });
                addEvent(modal, '[data-action="removeSpecificGroup"]', 'click', (event) => {
                    const groupIndex = parseInt(event.target.closest('[data-group-index]')?.getAttribute('data-group-index'));
                    workingData.specific = workingData.specific.filter((_, i) => i !== groupIndex);
                    renderModal();
                });

                addEvent(modal, '[data-action="addSpecificEntry"]', 'click', (event) => {
                    const groupIndex = parseInt(event.target.closest('[data-group-index]')?.getAttribute('data-group-index'));
                    const entryIndex = parseInt(event.target.closest('[data-entry-index]')?.getAttribute('data-entry-index'));

                    workingData.specific[groupIndex].entries = [
                        ...workingData.specific[groupIndex].entries.slice(0, entryIndex + 1),
                        {
                            data: {}
                        },
                        ...workingData.specific[groupIndex].entries.slice(entryIndex + 1),
                    ];

                    renderModal();
                });

                addEvent(modal, '[data-action="removeSpecificEntry"]', 'click', (event) => {
                    const groupIndex = parseInt(event.target.closest('[data-group-index]')?.getAttribute('data-group-index'));
                    const entryIndex = parseInt(event.target.closest('[data-entry-index]')?.getAttribute('data-entry-index'));
                    workingData.specific[groupIndex].entries = workingData.specific[groupIndex].entries.filter((_, i) => i !== groupIndex);
                    if (workingData.specific[groupIndex].entries.length === 0) {
                        workingData.specific = workingData.specific.filter((_, i) => i !== groupIndex);
                    }
                    renderModal();
                });

                const specificOpeningHoursGroupFieldNames = ['dayOfWeek', 'validFrom', 'validThrough', 'name', 'description'];
                const specificOpeningHoursEntryFieldNames = ['opens', 'closes'];
                const specificOpeningHoursFieldNames = [...specificOpeningHoursGroupFieldNames, ...specificOpeningHoursEntryFieldNames];
                const specificOpeningHoursFieldEventNames = specificOpeningHoursFieldNames.map((name) => `.TsoOpeningHours__SpecificEntries [name="${name}"]`).join(', ');
                addEvent(modal, specificOpeningHoursFieldEventNames, 'change', (event) => {
                    const groupIndex = parseInt(event.target.closest('[data-group-index]')?.getAttribute('data-group-index'));
                    const entryIndex = parseInt(event.target.closest('[data-entry-index]')?.getAttribute('data-entry-index'));

                    const value = event.target.value;
                    const name = event.target.getAttribute('name');
                    const isEmptyValue = value === undefined || value === null || (typeof value === 'string' && value.trim() === '');

                    if (specificOpeningHoursGroupFieldNames.includes(name)) {
                        if (isEmptyValue) {
                            delete workingData.specific[groupIndex][name];
                            return;
                        }

                        workingData.specific[groupIndex][name] = value;
                        return;
                    }

                    if (isEmptyValue) {
                        delete workingData.specific[groupIndex].entries[entryIndex].data[name];
                        return;
                    }

                    workingData.specific[groupIndex].entries[entryIndex].data[name] = value;
                });


                // Save
                addEvent(modal, '[data-action="save"]', 'click', (event) => {
                    const errors = validateWorkingData(workingData);

                    if (Object.values(errors).length) {
                        renderModal(errors);
                        return;
                    }

                    const newData = workingDataToCurrentData(workingData);
                    setCurrentValue(newData);
                    render();
                });

                // Close
                addEvent(modal, '[data-action="close"]', 'click', () => {
                    modal.close();
                });
            }

            renderModal();
            modal.showModal();
        }

        const validateWorkingData = (data) => {
            const errors = {};

            Object.entries(data).forEach(([day, data]) => {
                if (day === 'specific') {
                    data.forEach((group, groupIndex) => {
                        const groupErrors = {};
                        const entriesErrors = {};

                        // Group validation
                        if (group.validFrom && group.validThrough) {
                            if (group.validFrom > group.validThrough) {
                                groupErrors.validThrough = 'Enddatum muss nach dem Startdatum liegen';
                            }
                        } else {
                            if (!group.validFrom) {
                                groupErrors.validFrom = 'Pflichtfeld';
                            }
                            if (!group.validThrough) {
                                groupErrors.validThrough = 'Pflichtfeld';
                            }
                        }

                        if (!group.closed) {
                            // Entry validation
                            group.entries.forEach((entry, entryIndex) => {
                                const entryErrors = {};
                                if (!entry.data.opens) {
                                    entryErrors.opens = 'Pflichtfeld';
                                }
                                if (!entry.data.closes) {
                                    entryErrors.closes = 'Pflichtfeld';
                                }

                                if (Object.values(entryErrors).length) {
                                    entriesErrors[entryIndex] = entryErrors;
                                }
                            });
                        }

                        // Build error object
                        if (Object.values(groupErrors).length || Object.values(entriesErrors).length) {
                            if (errors.hasOwnProperty('specific') === false) {
                                errors.specific = {};
                            }
                            errors.specific[groupIndex] = {};
                            if (Object.values(groupErrors).length) {
                                errors.specific[groupIndex] = groupErrors;
                            }
                            if (Object.values(entriesErrors).length) {
                                errors.specific[groupIndex].entries = entriesErrors;
                            }
                        }
                    });
                } else {
                    data.forEach((entry, index) => {
                        const entryErrors = {};
                        if (!entry.data.opens) {
                            entryErrors.opens = 'Pflichtfeld';
                        }
                        if (!entry.data.closes) {
                            entryErrors.closes = 'Pflichtfeld';
                        }

                        // Build error object
                        if (Object.values(entryErrors).length) {
                            if (errors.hasOwnProperty(day) === false) {
                                errors[day] = {};
                            }
                            errors[day][index] = entryErrors;
                        }
                    });
                }
            });

            return errors;
        };

        const openRawEditModal = () => {
            const modal = el.querySelector('dialog');

            modal.innerHTML = widgetTemplateDialogInvalid({
                json: JSON.stringify(currentValue, null, 4),
                translate,
            });

            /** @var {HTMLTextAreaElement} */
            const rawJsonTextarea = modal.querySelector('textarea[name="json"]');
            /** @var {HTMLButtonElement} */
            const saveButton = modal.querySelector('button[data-action="save"]');

            const updateRawJsonValidation = () => {
                const {json: jsonValid, data: dataValid} = isRawJsonValid(rawJsonTextarea.value);
                if (jsonValid && dataValid) {
                    rawJsonTextarea.parentElement.attributes.removeNamedItem('data-error-text');
                    rawJsonTextarea.parentElement.classList.remove('TsoOpeningHoursSpecificationEditDialogInvalidDataJsonField--error');
                    saveButton.disabled = false;
                    return;
                }

                rawJsonTextarea.parentElement.setAttribute(
                    'data-error-text',
                    !jsonValid ? __('tso_specific_opening_hours_attribute.errors.invalidJson') : __('tso_specific_opening_hours_attribute.errors.invalidData')
                );
                rawJsonTextarea.parentElement.classList.add('TsoOpeningHoursSpecificationEditDialogInvalidDataJsonField--error');
                saveButton.disabled = true;
            }

            // Live validation of raw json
            rawJsonTextarea.addEventListener('input', (e) => updateRawJsonValidation);

            // Save
            saveButton.addEventListener('click', (e) => {
                e.preventDefault();
                let json;
                try {
                    json = JSON.parse(value);
                } catch (e) {
                    json = value;
                }
                setCurrentValue(json);
                render();
            });

            // Close
            addEvent(modal, '[data-action="close"]', 'click', () => {
                modal.close();
            });

            modal.showModal();
        }

        const setCurrentValue = (value) => {
            currentValue = value;

            if (onChange) {
                onChange(currentValue);
            }
        }

        const getGroupedEntriesForDisplay = () => {
            let entries = currentValue;

            if (!Array.isArray(entries)) {
                entries = [];
            }
            entries = entries.reduce((acc, entry, index) => {
                const day = weekdays.find((weekday) => weekday.value === entry.dayOfWeek)?.key
                const isSpecific = !day || !!(entry.validFrom || entry.validThrough);
                if (isSpecific) {
                    const groupCode = `${entry.dayOfWeek}-${entry.validFrom}-${entry.validThrough}-${entry.name}-${entry.opens ? '1' : '0'}-${entry.closes ? '1' : '0'}`;
                    if (!acc['specific'][groupCode]) {
                        acc['specific'][groupCode] = {
                            dayOfWeek: entry.dayOfWeek,
                            validFrom: formatDate(entry.validFrom),
                            validThrough: formatDate(entry.validThrough),
                            name: entry.name,
                            description: entry.description,
                            closed: !(entry.opens && entry.closes),
                            entries: [],
                        };
                    }
                    acc['specific'][groupCode].entries.push(entry);
                } else {
                    acc[day].push(entry);
                }

                return acc;
            }, {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
                specific: {},
            });

            entries.specific = Object.values(entries.specific);

            entries.specific.forEach((group) => {
                group.entries = group.entries.sort(sortByTime);
            });

            return entries;
        };

        const sortByTime = (a, b) => {
            if (a.data && b.data) {
                if (a.data.opens < b.data.opens) {
                    return -1;
                }

                if (a.data.opens > b.data.opens) {
                    return 1;
                }
                return 0;
            }

            if (a.opens < b.opens) {
                return -1;
            }

            if (a.opens > b.opens) {
                return 1;
            }

            return 0;
        }

        /**
         * Check if the given raw json is valid
         * @param rawJson
         * @returns {{data: boolean, json: boolean}}
         */
        const isRawJsonValid = (rawJson) => {
            if (typeof rawJson === 'string' && rawJson.trim() === "") {
                return {json: false, data: false};
            }

            try {
                const data = JSON.parse(rawJson);
                if (isValidData(data)) {
                    return {json: true, data: true};
                } else {
                    return {json: true, data: false};
                }
            } catch (e) {
                return {json: false, data: false};
            }
        };

        /**
         * Check if the given data is valid
         * @param data
         * @returns {boolean}
         */
        const isValidData = (data) => {
            if (data === null || data === undefined) {
                return true;
            }

            if (!Array.isArray(data)) {
                return false;
            }

            const invalidEntries = data.filter((entry) => {
                if (entry.opens && !/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?(?:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/.test(entry.opens)) {
                    console.error('Invalid opens time', entry.opens);
                    return true;
                }
                if (entry.closes && !/^([01]?[0-9]|2[0-3]):[0-5][0-9](:[0-5][0-9])?(?:Z|[+-](?:2[0-3]|[01][0-9]):[0-5][0-9])?$/.test(entry.closes)) {
                    console.error('Invalid closes time', entry.closes);
                    return true;
                }
                if (entry.validFrom && !/^\d{4}-\d{2}-\d{2}$/.test(entry.validFrom)) {
                    console.error('Invalid validFrom date', entry.validFrom);
                    return true;
                }
                if (entry.validThrough && !/^\d{4}-\d{2}-\d{2}$/.test(entry.validThrough)) {
                    console.error('Invalid validThrough date', entry.validThrough);
                    return true;
                }
                const allowedWeekdays = weekdays.map((weekday) => weekday.value);
                if (entry.dayOfWeek && !allowedWeekdays.includes(entry.dayOfWeek)) {
                    console.error('Invalid dayOfWeek', entry.dayOfWeek);
                    return true;
                }

                return false;
            });

            return invalidEntries.length === 0;
        };

        const currentDataToWorkingData = (data) => {
            const workingData = {
                monday: [],
                tuesday: [],
                wednesday: [],
                thursday: [],
                friday: [],
                saturday: [],
                sunday: [],
                specific: {},
            };

            if (Array.isArray(data)) {
                data.forEach((entry, index) => {
                    const day = weekdays.find((weekday) => weekday.value === entry.dayOfWeek)?.key
                    const isSpecific = !day || !!(entry.validFrom || entry.validThrough);
                    if (isSpecific) {
                        const groupCode = `${entry.dayOfWeek}-${entry.validFrom}-${entry.validThrough}-${entry.name}-${entry.opens ? '1' : '0'}-${entry.closes ? '1' : '0'}`;
                        if (!workingData.specific[groupCode]) {
                            workingData.specific[groupCode] = {
                                dayOfWeek: entry.dayOfWeek,
                                validFrom: entry.validFrom,
                                validThrough: entry.validThrough,
                                name: entry.name,
                                description: entry.description,
                                closed: !(entry.opens && entry.closes),
                                entries: [],
                            };
                        }
                        workingData.specific[groupCode].entries.push({
                            data: {
                                opens: entry.opens,
                                closes: entry.closes,
                            },
                            originalIndex: index
                        });
                    } else {
                        workingData[day].push({
                            data: {
                                ...entry,
                                opens: entry.opens,
                                closes: entry.closes,
                            },
                            originalIndex: index
                        });
                    }
                });
            }

            workingData.specific = Object.values(workingData.specific);
            workingData.specific.forEach((group) => {
                group.entries = group.entries.sort(sortByTime);
            });

            return workingData;
        };

        const workingDataToCurrentData = (workingData) => {
            const newData = [];
            Object.entries(workingData).forEach(([day, data]) => {
                if (day === 'specific') {
                    // Specific
                    data.forEach((group) => {
                        group.entries.forEach((entry) => {
                            const mergedData = removeUndefinedValues({
                                ...(entry.originalIndex !== undefined ? currentValue[entry.originalIndex] : {}),
                                '@type': 'OpeningHoursSpecification',
                                dayOfWeek: group.dayOfWeek,
                                validFrom: group.validFrom,
                                validThrough: group.validThrough,
                                opens: entry.data.opens,
                                closes: entry.data.closes,
                                name: group.name,
                                description: group.description,
                            })

                            newData.push(mergedData);
                        })
                    });
                    return;
                }

                // Weekdays
                data.forEach((entry) => {
                    const mergedData = removeUndefinedValues({
                        ...(entry.originalIndex !== undefined ? currentValue[entry.originalIndex] : {}),
                        '@type': 'OpeningHoursSpecification',
                        ...entry.data,
                    });

                    newData.push(mergedData);
                });
            });

            return newData;
        };

        const addEvent = (rootElement, selector, event, callback) => {
            rootElement.querySelectorAll(selector).forEach(element => {
                element.addEventListener(event, callback);
            });
        };

        const removeUndefinedValues = (obj) => {
            return Object.entries(obj).reduce((acc, [key, value]) => {
                if (value === undefined) {
                    return acc;
                }

                return {
                    ...acc,
                    [key]: value,
                };
            }, {});
        };

        const translate = (key) => {
            const keyParts = key.split('.');
            function findKeyInLocale () {
                return keyParts.reduce((acc, keyPart) => {
                    if (acc === undefined) {
                        return undefined;
                    }

                    return acc[keyPart];
                }, translations[localeToUse]);
            }

            return findKeyInLocale() || key;
        }

        const formatDate = (date) => {
            const dateObj = new Date(date);
            if (isNaN(dateObj.getTime())) {
                return date;
            }
            return dateObj.toLocaleDateString('de', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
            });
        }

        render();

        return {
        }
    }
}

module.exports = openingHoursWidget;
