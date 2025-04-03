import { customElement, html, LitElement, nothing, property, PropertyValues, repeat, state, when } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyEditorConfigCollection, UmbPropertyValueChangeEvent } from "@umbraco-cms/backoffice/property-editor";
import { LanguageService, LanguageResponseModel } from '@umbraco-cms/backoffice/external/backend-api';
import { multiLangPropertyInfo } from "../manifest";
import { UUIBooleanInputEvent } from "@umbraco-cms/backoffice/external/uui";
import { UmbElementMixin } from "@umbraco-cms/backoffice/element-api";
import { style } from './style.css'
import { umbBindToValidation } from "@umbraco-cms/backoffice/validation";

type MultiLanguageDto = {
    culture: string,
    text: string
};

export const elementName = `our-multilanguage-textbox`;

@customElement(elementName)
export class MultilanguageTextboxElement extends UmbElementMixin(LitElement) {

    #_value: Array<MultiLanguageDto> = [];
    @property({ type: JSON, attribute: false })
    public set value(val: Array<MultiLanguageDto>) {
        val = val || [];
        this.#_value = val;
    }
    public get value() {
        return this.#_value;
    }

    @property({ attribute: false })
    public set config(config: UmbPropertyEditorConfigCollection) {
        this.assignValuesFromConfig(config);
    }

    @state()
    private configIsMandatoryLanguageRequired!: boolean;

    @state()
    private configUseTextArea!: boolean;

    @state()
    private isReady: boolean = false;

    @state()
    public langItems: LanguageResponseModel[] | undefined;

    static override styles = [style];

    protected override firstUpdated(_changedProperties: PropertyValues): void {
        this.runPrepItems().then(() => this.isReady = true);
    }

    private async runPrepItems() {
        const langInfo = await LanguageService.getLanguage();
        this.langItems = langInfo.items;
    }

    private assignValuesFromConfig(config: UmbPropertyEditorConfigCollection) {
        this.configIsMandatoryLanguageRequired = config.getValueByAlias(multiLangPropertyInfo.isMandatoryLanguageRequired.alias) ?? false;
        this.configUseTextArea = config.getValueByAlias(multiLangPropertyInfo.useTextArea.alias) ?? false;
    }

    #onInput(event: UUIBooleanInputEvent) {
        event.stopPropagation();
        const target = event.target;
        const text = target.value;
        const culture = target.name;

        // find and update model value
        const valueObj = JSON.parse(JSON.stringify(this.value)) as MultiLanguageDto[];
        const itemIndex = valueObj.findIndex(x => x.culture === culture);
        const newValue = {
            culture,
            text
        };
        itemIndex !== -1
            ? valueObj[itemIndex] = newValue
            : valueObj.push(newValue);

        // update element value
        this.value = valueObj;
        this.dispatchEvent(new UmbPropertyValueChangeEvent());
    }

    render() {
        if (!this.isReady || !this.langItems) {
            return nothing;
        }

        return html`
         <div class="multilang-wrap">
            ${repeat(this.langItems, x => x.isoCode, lang => {
            const item: MultiLanguageDto = this.value.find(x => x.culture === lang.isoCode) ?? { culture: lang.isoCode, text: "" };
            const isMandatory = this.configIsMandatoryLanguageRequired && lang.isMandatory;
            return html`
                <uui-form-validation-message>
                    <div class="multilang-row">
                        <span class="label">${lang.name}${when(isMandatory, () => html`<strong class="required">*</strong>`, () => nothing)}</span>
                        ${this.configUseTextArea
                    ? html`
                            <uui-textarea label="${lang.name}" name="${lang.isoCode}" @input=${this.#onInput} .value=${item.text} ?required=${isMandatory} ${umbBindToValidation(this)}></uui-textarea>
                            `
                    : html`
                            <uui-input label="${lang.name}" name="${lang.isoCode}" @input=${this.#onInput} .value=${item.text} ?required=${isMandatory} ${umbBindToValidation(this)}></uui-input>
                        `}
                    </div>
                </uui-form-validation-message>
            `;
        })}
        </div>
        `;
    }
}

export default MultilanguageTextboxElement;

declare global {
    interface HTMLElementTagNameMap {
        [elementName]: MultilanguageTextboxElement;
    }
}