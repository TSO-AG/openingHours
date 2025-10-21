module.exports = ({ json, translate }) => `<div class="TsoOpeningHoursSpecificationEditDialogInvalidData">

    <!-- Actionbar -->
    <div class="TsoOpeningHoursSpecificationEditDialog__Actionbar">
        <button type="button" class="TsoOpeningHours__Button TsoOpeningHours__Button--primary" data-action="save">
            ${ translate('editInvalid.save') }
        </button>
        <button type="button" class="TsoOpeningHours__CloseButton" data-action="close">
            <svg viewBox="0 0 24 24" width="20" height="20"><g fill-rule="nonzero" stroke="currentColor" fill="none" stroke-linecap="round"><path d="M4 4l16 16M20 4L4 20"></path></g></svg>
        </button>
    </div>

    <!-- Editor -->
    <div class="TsoOpeningHoursSpecificationEditDialogInvalidDataJsonField">
        <textarea rows="40" name="json">${ json ? json : null }</textarea>
    </div>
</div>`;
