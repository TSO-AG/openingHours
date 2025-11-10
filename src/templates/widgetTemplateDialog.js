module.exports = ({ weekdays, today, entries, errorClass, errorMessage, translate }) => `<div class="TsoOpeningHoursSpecificationEditDialogValidData">

    <!-- Actionbar -->
    <div class="TsoOpeningHoursSpecificationEditDialog__Actionbar">
        <button class="TsoOpeningHours__Button TsoOpeningHours__Button--primary" data-action="save">
            ${ translate('editValid.save') }
        </button>
        <button class="TsoOpeningHours__CloseButton" data-action="close">
            <svg viewBox="0 0 24 24" width="20" height="20"><g fill-rule="nonzero" stroke="currentColor" fill="none" stroke-linecap="round"><path d="M4 4l16 16M20 4L4 20"></path></g></svg>
        </button>
    </div>

    <div class="TsoOpeningHours__DialogValidData__Content">
        <!-- Weekdays -->
        <table class="TsoOpeningHours__Weekdays">
            <tbody>
            ${ weekdays.map(weekday => {
                const is24h = entries[weekday.key].length > 0 && entries[weekday.key][0].is24h;
                return `
                <tr class="TsoOpeningHours__Weekday" data-day-of-week="${ weekday.key }">
                    <td class="min-width">
                        <div class="TsoOpeningHours__Weekday__Headline">${ translate(weekday.labelKey) }</div>
                        <div style="display: flex; flex-direction: column; gap: 8px;">
                            <div>
                                <label class="TsoOpeningHours__Switch">
                                    <input type="checkbox" name="closed" data-action="toggleWeekday"
                                    ${ entries[weekday.key].length ? 'checked' : '' }
                                    >
                                    <span></span>
                                </label>
                                <span class="TsoOpeningHours__Switch__Label">
                                    ${ entries[weekday.key].length === 0 ? translate('editValid.closed') : translate('editValid.open') }
                                </span>
                            </div>
                            ${ entries[weekday.key].length > 0 ? `
                            <div>
                                <label class="TsoOpeningHours__Switch">
                                    <input type="checkbox" name="is24h" data-action="toggle24h"
                                    ${ is24h ? 'checked' : '' }
                                    >
                                    <span></span>
                                </label>
                                <span class="TsoOpeningHours__Switch__Label">
                                    ${ translate('editValid.open24h') }
                                </span>
                            </div>
                            ` : '' }
                        </div>
                    </td>
                    <td>
                        ${ entries[weekday.key].length > 0 ? `
                            <table class="TsoOpeningHours__Weekday__Entries">
                                <tr>
                                    <th>${ translate('editValid.opens') }</th>
                                    <th>${ translate('editValid.closes') }</th>
                                    <th></th>
                                </tr>
                                ${ entries[weekday.key].map(({ data: entry, is24h }, index) => `
                                    <tr data-index="${ index }">
                                        <td>
                                            <input name="opens"
                                                   class="TsoOpeningHours__Field ${ errorClass(weekday.key, index, 'opens') }"
                                                   type="time"
                                                   ${ entry.opens !== undefined ? `value="${entry.opens}"` : '' }
                                                   ${ is24h ? 'readonly style="width: 100%; opacity: 0.6;"' : 'style="width: 100%;"' }/>
                                           ${ errorMessage(weekday.key, index, 'opens') }
                                        </td>
                                        <td>
                                            <input name="closes"
                                                   class="TsoOpeningHours__Field ${ errorClass(weekday.key, index, 'closes') }"
                                                   type="time"
                                                   ${ entry.closes !== undefined ? `value="${entry.closes}"` : '' }
                                                   ${ is24h ? 'readonly style="width: 100%; opacity: 0.6;"' : 'style="width: 100%;"' }/>
                                           ${ errorMessage(weekday.key, index, 'closes') }
                                        </td>

                                        <td class="align-center min-width">
                                            <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Remove"
                                                    data-action="removeWeekdayEntry"
                                                    ${ is24h ? 'disabled' : '' }>
                                            </button>

                                            <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Add"
                                                    data-action="addWeekdayEntry"
                                                    ${ is24h ? 'disabled' : '' }>
                                            </button>
                                        </td>
                                    </tr>
                                `).join('') }
                            </table>
                        ` : '' }
                    </td>
                </tr>
            `}).join('') }
        </table>

        <!-- Specific -->
        <div class="TsoOpeningHours__SpecificEntries">
        ${ Object.entries(entries.specific).map(([_, group], groupIndex) => `
            <div class="TsoOpeningHours__SpecificEntry" data-group-index="${ groupIndex }">

                <!-- Headline -->
                <div class="TsoOpeningHours__SpecificEntry__Headline">
                    <div>
                        ${ translate('editValid.specificOpeningHour') }
                    </div>
                    <div>
                    <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Duplicate"
                            data-action="duplicateSpecificGroup"></button>
                    <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Remove"
                            data-action="removeSpecificGroup"></button>
                    </div>
                </div>
                <table class="TsoOpeningHours__SpecificEntry__Settings" style="width: 100%">

                        <!-- Wochentage / Gültig von / Gültig bis -->
                        <tr>
                            <td>
                                <div class="TsoOpeningHours__Field__Label">
                                    ${ translate('editValid.weekday') }
                                </div>
                                <select name="dayOfWeek"
                                        class="TsoOpeningHours__Field"
                                        style="width: 100%;">
                                    <option value="" ${ group.dayOfWeek === undefined ? 'selected' : '' }> -
                                    </option>
                                    ${ weekdays.map(weekday => `
                                        <option
                                                value="${ weekday.value }"
                                                ${ group.dayOfWeek === weekday.value ? 'selected' : '' }
                                        >
                                            ${ translate(weekday.labelKey) }
                                        </option>
                                    `).join('') }
                                </select>
                            </td>
                            <td>
                                <div class="TsoOpeningHours__Field__Label">
                                    ${ translate('editValid.validFrom') }
                                </div>
                                <input
                                        name="validFrom"
                                        class="TsoOpeningHours__Field ${ errorClass('specific', groupIndex, 'validFrom') }"
                                        type="date"
                                        min="${ today }"
                                        style="width: 100%;"
                                        ${ group.validFrom ? `value="${ group.validFrom }"` : '' }
                                />

                                ${ errorMessage('specific', groupIndex, 'validFrom') }
                            </td>
                            <td>
                                <div class="TsoOpeningHours__Field__Label">
                                    ${ translate('editValid.validThrough') }
                                </div>
                                <input
                                        name="validThrough"
                                        class="TsoOpeningHours__Field ${ errorClass('specific', groupIndex, 'validThrough') }"
                                        type="date"
                                        min="${ today }"
                                        style="width: 100%;"
                                        ${ group.validThrough ? `value="${ group.validThrough }"` : '' }
                                />

                                ${ errorMessage('specific', groupIndex, 'validThrough') }
                            </td>
                        </tr>

                        <!-- Öffnungszeiten -->
                        <tr>
                            <td class="TsoOpeningHours__SpecificEntry__OpenSwitch">
                                <div style="display: flex; flex-direction: column; gap: 8px;">
                                    <div>
                                        <label class="TsoOpeningHours__Switch">
                                            <input type="checkbox" name="closed" data-action="toggleSpecificGroup"
                                            ${ group.closed ? '' : 'checked' }
                                            >
                                            <span></span>
                                        </label>
                                        <span class="TsoOpeningHours__Switch__Label">
                                            ${ group.closed ? translate('editValid.closed') : translate('editValid.open') }
                                        </span>
                                    </div>
                                    ${ !group.closed ? `
                                    <div>
                                        <label class="TsoOpeningHours__Switch">
                                            <input type="checkbox" name="is24h" data-action="toggle24hSpecific"
                                            ${ group.entries.length > 0 && group.entries[0].is24h ? 'checked' : '' }
                                            >
                                            <span></span>
                                        </label>
                                        <span class="TsoOpeningHours__Switch__Label">
                                            ${ translate('editValid.open24h') }
                                        </span>
                                    </div>
                                    ` : '' }
                                </div>
                            </td>
                            <td colspan="2">
                            </td>
                        </tr>

                        <!-- Zeiteinträge -->
                        ${ !group.closed ? `
                        <tr>
                            <td colspan="3">
                                <table style="width: 100%">
                                    <thead>
                                    <tr>
                                        <th class="TsoOpeningHours__Field__Label">${ translate('editValid.opens') }</th>
                                        <th class="TsoOpeningHours__Field__Label">${ translate('editValid.closes') }</th>
                                        <th></th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                        ${ group.entries.map(({ data, is24h }, entryIndex) => `
                                            <tr data-entry-index="${ entryIndex }">
                                                <td>
                                                    <input
                                                            name="opens"
                                                            class="TsoOpeningHours__Field ${ errorClass('specific', [groupIndex, entryIndex], 'opens') }"
                                                            type="time"
                                                            ${ data.opens ? `value="${ data.opens }"` : '' }
                                                            ${ is24h ? 'readonly style="width: 100%; opacity: 0.6;"' : 'style="width: 100%;"' }
                                                    />

                                                    ${ errorMessage('specific', [groupIndex, entryIndex], 'opens') }
                                                </td>
                                                <td>
                                                    <input
                                                            name="closes"
                                                            class="TsoOpeningHours__Field ${ errorClass('specific', [groupIndex, entryIndex], 'closes') }"
                                                            type="time"
                                                            ${ data.closes ? `value="${ data.closes }"` : '' }
                                                            ${ is24h ? 'readonly style="width: 100%; opacity: 0.6;"' : 'style="width: 100%;"' }
                                                    />

                                                    ${ errorMessage('specific', [groupIndex, entryIndex], 'closes') }
                                                </td>
                                                <td class="align-center min-width">
                                                    <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Remove"
                                                            data-action="removeSpecificEntry"
                                                            ${ is24h || group.entries.length <= 1 ? 'disabled' : '' }>
                                                    </button>

                                                    <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Add"
                                                            data-action="addSpecificEntry"
                                                            ${ is24h ? 'disabled' : '' }>
                                                    </button>
                                                </td>
                                            </tr>
                                        `).join('') }
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        ` : '' }
                        <!-- Name -->
                        <tr>
                            <td colspan="3">
                                <div class="TsoOpeningHours__Field__Label">
                                    ${ translate('editValid.name') }
                                </div>
                                <input
                                        name="name"
                                        class="TsoOpeningHours__Field"
                                        type="text"
                                        style="width: 100%;"
                                        ${ group.name ? `value="${ group.name }"` : '' }
                                />
                            </td>
                        </tr>

                        <!-- Description -->
                        <tr>
                            <td colspan="3">
                                <div class="TsoOpeningHours__Field__Label">
                                    ${ translate('editValid.description') }
                                </div>
                                <textarea
                                        name="description"
                                        class="TsoOpeningHours__TextareaField"
                                        rows="3"
                                        style="width: 100%;"
                                >${ group.description ? group.description : '' }</textarea>
                            </td>
                        </tr>
                    </table>
            </div>
        `).join('') }

        <button class="TsoOpeningHours__Button TsoOpeningHours__Button--block" data-action="addSpecificGroup">
            ${ translate('editValid.addSpecificEntry') }
        </button>
    </div>
    </div>
</div>`;
