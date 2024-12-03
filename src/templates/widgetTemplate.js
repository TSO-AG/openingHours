module.exports = ({ isValid, isAnyWeekdayConfigured, readonly, translate, weekdays, groupedEntries, editInvalidJson }) => `<div class="TsoOpeningHoursDisplay">
    <!-- Actionbar -->
    ${ !readonly ? `
        <div class="TsoOpeningHoursDisplay__ActionBar">
            ${ isValid ? `
                <button class="TsoOpeningHours__Button TsoOpeningHours__Button--small" data-action="editData">
                    ${ translate('view.edit') }
                </button>
            ` : `
                ${ editInvalidJson ? `
                <button class="TsoOpeningHours__Button TsoOpeningHours__Button--small" data-action="editRawData">
                    ${ translate('view.edit') }
                </button>
                ` : '' }
                <button class="TsoOpeningHours__Button TsoOpeningHours__Button--small" data-action="resetData">
                    ${ translate('view.reset') }
                </button>
            ` }
        </div>
    ` : '' }
    
    <!-- Content -->
    <div class="TsoOpeningHoursDisplay__Content">

        ${ !isValid ? `
            <!-- Error in data -->
            <div class="TsoOpeningHoursDisplay__InvalidData">
                ${ translate('view.invalidOpeningHours') }
            </div>
        ` : `
            <!-- Valid data -->
            <div class="TsoOpeningHoursDisplay__ValidData">
                ${ isAnyWeekdayConfigured ? `
                    <table class="TsoOpeningHours__Weekdays">
                        <tbody>
                            <!-- Weekdays -->
                            ${ weekdays.map(weekday => `
                                <tr class="TsoOpeningHours__Weekday">
                                    <td class="TsoOpeningHours__Weekday__Label">
                                        ${ translate(weekday.labelKey) }
                                    </td>
                                    <td class="TsoOpeningHours__Weekday__OpeningHours">
                                        ${ groupedEntries[weekday.key].length > 0 ? `
                                            ${ groupedEntries[weekday.key].map(entry => `
                                                <div>
                                                    <span class="TsoOpeningHours__Weekday__OpeningHours__Opens">
                                                        ${ entry.opens ? entry.opens : '' }
                                                    </span>
                                                    <span class="TsoOpeningHours__Weekday__OpeningHours__To">
                                                        ${ translate('view.to') }
                                                    </span>
                                                    <span class="TsoOpeningHours__Weekday__OpeningHours__Closes">
                                                        ${ entry.closes ? entry.closes : '' }
                                                    </span>
                                                </div>
                                            `).join('') }
                                        ` : `
                                            <div class="TsoOpeningHours__Weekday__OpeningHoursClosed">
                                                ${ translate('view.closed') }
                                            </div>
                                        ` }
                                    </td>
                                </tr>
                            `).join('') }
                        </tbody>
                    </table>
                ` : '' }

                ${ Object.keys(groupedEntries.specific).length ? `
                <div class="TsoOpeningHours__SpecificEntriesLabel">
                    ${ translate('view.specificOpeningHours') }
                </div>

                <!-- Specific entries -->
                <div class="TsoOpeningHours__SpecificEntries">
                    ${ Object.entries(groupedEntries.specific).map(([_, group]) => `
                        <div class="TsoOpeningHours__SpecificEntry">

                            <div class="TsoOpeningHours__SpecificEntry__SplitView">

                                <!-- Day of week / Valid from / Valid through -->
                                <div class="TsoOpeningHours__SpecificEntry__ValidFromThrough">
                                    <!-- Valid from / Valid through -->
                                    <div>
                                        <span class="TsoOpeningHours__SpecificEntry__ValidFromThrough__ValidFrom">
                                            ${ group.validFrom ? group.validFrom : '' }
                                        </span>
                                        <span class="TsoOpeningHours__SpecificEntry__ValidFromThrough__To">
                                            ${ translate('view.to') }
                                        </span>
                                        <span class="TsoOpeningHours__SpecificEntry__ValidFromThrough__ValidThrough">
                                            ${ group.validThrough ? group.validThrough : '' }
                                        </span>
                                    </div>

                                    <!-- Day of week -->
                                    ${ group.dayOfWeek ? `
                                        <div class="TsoOpeningHours__SpecificEntry__DayOfWeek">
                                            (${ translate(weekdays.find(weekday => group.dayOfWeek === weekday.value)?.labelKey) })
                                        </div>
                                    ` : '' }
                                </div>

                                <!-- Opening Hours -->
                                <div class="TsoOpeningHours__SpecificEntry__OpeningHours">
                                    ${ !group.closed ? `
                                        <div class="TsoOpeningHours__SpecificEntry__OpeningHours__Entries">
                                            ${ group.entries.map(entry => `
                                                <div class="TsoOpeningHours__SpecificEntry__OpeningHours__Entry">
                                                    <span class="TsoOpeningHours__SpecificEntry__OpeningHours__Opens">
                                                        ${ entry.opens ? entry.opens : '' }
                                                    </span>
                                                    <span class="TsoOpeningHours__SpecificEntry__OpeningHours__To">
                                                        ${ translate('view.to') }
                                                    </span>
                                                    <span class="TsoOpeningHours__SpecificEntry__OpeningHours__Closes">
                                                        ${ entry.closes ? entry.closes : '' }
                                                    </span>
                                                </div>
                                            `).join('') }
                                        </div>
                                    ` : `
                                        <div class="TsoOpeningHours__SpecificEntry__OpeningHoursClosed">
                                            ${ translate('view.closed') }
                                        </div>
                                    ` }
                                </div>
                            </div>

                            ${ group.name || group.description ? `
                                <div class="TsoOpeningHours__SpecificEntry__NameDescription">
                                    <!-- Name -->
                                    ${ group.name ? `
                                        <div class="TsoOpeningHours__SpecificEntry__Name">
                                            ${ group.name }
                                        </div>
                                    ` : '' }

                                    <!-- Description -->
                                    ${ group.description ? `
                                        <div class="TsoOpeningHours__SpecificEntry__Description">
                                            ${ group.description }
                                        </div>
                                    ` : '' }
                                </div>
                            ` : '' }
                        </div>
                    `).join('') }
                ` : '' }
            </div>
        ` }
    </div>
</div>

${ !readonly ? `
    <dialog class="TsoOpeningHoursSpecificationEditDialog"></dialog>
` : '' }
`;
