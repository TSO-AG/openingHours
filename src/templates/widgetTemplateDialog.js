module.exports = ({ labels, weekdays, today, entries, errorClass, errorMessage }) => `<div class="TsoOpeningHoursSpecificationEditDialogValidData">

    <!-- Actionbar -->
    <div class="TsoOpeningHoursSpecificationEditDialog__Actionbar">
        <button class="TsoOpeningHours__Button TsoOpeningHours__Button--primary" data-action="save">
            ${ labels.save }
        </button>
        <button class="TsoOpeningHours__CloseButton" data-action="close">
            <svg viewBox="0 0 24 24" width="20" height="20"><g fill-rule="nonzero" stroke="currentColor" fill="none" stroke-linecap="round"><path d="M4 4l16 16M20 4L4 20"></path></g></svg>
        </button>
    </div>

    <div class="TsoOpeningHours__DialogValidData__Content">
        <!-- Weekdays -->
        <table class="TsoOpeningHours__Weekdays">
            <tbody>
            ${ weekdays.map(weekday => `
                <tr class="TsoOpeningHours__Weekday" data-day-of-week="${ weekday.key }">
                    <td class="min-width">
                        <div class="TsoOpeningHours__Weekday__Headline">${ weekday.label }</div>
                        <label class="TsoOpeningHours__Switch">
                            <input type="checkbox" name="closed" data-action="toggleWeekday"
                            ${ entries[weekday.key].length ? 'checked' : '' }
                            >
                            <span></span>
                        </label>
                        <span class="TsoOpeningHours__Switch__Label">
                            ${ entries[weekday.key].length === 0 ? labels.closed : labels.open }
                        </span>
                    </td>
                    <td>
                        ${ entries[weekday.key].length > 0 ? `
                            <table class="TsoOpeningHours__Weekday__Entries">
                                <tr>
                                    <th>${ labels.opens }</th>
                                    <th>${ labels.closes }</th>
                                    <th></th>
                                </tr>
                                ${ entries[weekday.key].map(({ data: entry }, index) => `
                                    <tr data-index="${ index }">
                                        <td>
                                            <input name="opens"
                                                   class="TsoOpeningHours__Field ${ errorClass(weekday.key, index, 'opens') }"
                                                   type="time"
                                                   ${ entry.opens !== undefined ? `value="${entry.opens}"` : '' }
                                                   style="width: 100%;"/>
                                           ${ errorMessage(weekday.key, index, 'opens') }
                                        </td>
                                        <td>
                                            <input name="closes"
                                                   class="TsoOpeningHours__Field ${ errorClass(weekday.key, index, 'closes') }"
                                                   type="time"
                                                   ${ entry.closes !== undefined ? `value="${entry.closes}"` : '' }
                                                   style="width: 100%;"/>
                                           ${ errorMessage(weekday.key, index, 'closes') }
                                        </td>

                                        <td class="align-center min-width">
                                            <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Remove"
                                                    data-action="removeWeekdayEntry">
                                            </button>

                                            <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Add"
                                                    data-action="addWeekdayEntry">
                                            </button>
                                        </td>
                                    </tr>
                                `).join('') }
                            </table>
                        ` : '' }
                    </td>
                </tr>
            `).join('') }
        </table>

        <!-- Specific -->
        <div class="TsoOpeningHours__SpecificEntries">
        ${ Object.entries(entries.specific).map(([_, group], groupIndex) => `
            <div class="TsoOpeningHours__SpecificEntry" data-group-index="${ groupIndex }">

                <!-- Headline -->
                <div class="TsoOpeningHours__SpecificEntry__Headline">
                    <div>
                        ${ labels.specificOpeningHour }
                    </div>
                    <div>
                    <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Remove"
                            data-action="removeSpecificGroup"></button>
                    </div>
                </div>
                <table class="TsoOpeningHours__SpecificEntry__Settings" style="width: 100%">

                        <!-- Wochentage / Gültig von / Gültig bis -->
                        <tr>
                            <td>
                                <div class="TsoOpeningHours__Field__Label">
                                    ${ labels.weekday }
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
                                            ${ weekday.label }
                                        </option>
                                    `).join('') }
                                </select>
                            </td>
                            <td>
                                <div class="TsoOpeningHours__Field__Label">
                                    ${ labels.validFrom }
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
                                    ${ labels.validThrough }
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
                                <label class="TsoOpeningHours__Switch">
                                    <input type="checkbox" name="closed" data-action="toggleSpecificGroup"
                                    ${ group.closed ? '' : 'checked' }
                                    <span></span>
                                </label>
                                <span class="TsoOpeningHours__Switch__Label">
                                    ${ group.closed ? labels.closed : labels.open }
                                </span>
                            </td>
                            <td colspan="2">
                                ${ !group.closed ? `
                                    <table style="width: 100%">
                                        <thead>
                                        <tr>
                                            <th class="TsoOpeningHours__Field__Label">${ labels.opens }</th>
                                            <th class="TsoOpeningHours__Field__Label">${ labels.closes }</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                            ${ group.entries.map(({ data }, entryIndex) => `
                                                <tr data-entry-index="${ entryIndex }">
                                                    <td>
                                                        <input
                                                                name="opens"
                                                                class="TsoOpeningHours__Field ${ errorClass('specific', [groupIndex, entryIndex], 'opens') }"
                                                                type="time"
                                                                style="width: 100%;"
                                                                ${ data.opens ? `value="${ data.opens }"` : '' }
                                                        />
                                                        
                                                        ${ errorMessage('specific', [groupIndex, entryIndex], 'opens') }
                                                    </td>
                                                    <td>
                                                        <input
                                                                name="closes"
                                                                class="TsoOpeningHours__Field ${ errorClass('specific', [groupIndex, entryIndex], 'closes') }"
                                                                type="time"
                                                                style="width: 100%;"
                                                                ${ data.closes ? `value="${ data.closes }"` : '' }
                                                        />
                                                        
                                                        ${ errorMessage('specific', [groupIndex, entryIndex], 'closes') }
                                                    </td>

                                                    <td class="align-center min-width">
                                                        <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Remove"
                                                                data-action="removeSpecificEntry"
                                                                ${ group.entries.length <= 1 ? 'disabled' : '' }>
                                                        </button>

                                                        <button class="TsoOpeningHours__IconButton TsoOpeningHours__IconButton__Add"
                                                                data-action="addSpecificEntry">
                                                        </button>
                                                    </td>
                                                </tr>
                                            `).join('') }
                                        </tbody>
                                    </table>
                                ` : '' }
                            </td>
                        </tr>
                        <!-- Name -->
                        <tr>
                            <td colspan="3">
                                <div class="TsoOpeningHours__Field__Label">
                                    ${ labels.name }
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
                                    ${ labels.description }
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
            ${ labels.addSpecificEntry }
        </button>
    </div>
    </div>
</div>`;
