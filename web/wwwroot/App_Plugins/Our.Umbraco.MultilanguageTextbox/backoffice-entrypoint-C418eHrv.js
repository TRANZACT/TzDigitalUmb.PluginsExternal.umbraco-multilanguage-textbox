import { css as $, LitElement as E, nothing as y, repeat as I, when as P, html as u, property as b, state as m, customElement as T } from "@umbraco-cms/backoffice/external/lit";
import { UmbPropertyValueChangeEvent as w } from "@umbraco-cms/backoffice/property-editor";
import { LanguageService as q } from "@umbraco-cms/backoffice/external/backend-api";
import { UmbElementMixin as A } from "@umbraco-cms/backoffice/element-api";
import { umbBindToValidation as x } from "@umbraco-cms/backoffice/validation";
const C = $`
.multilang-row {
    display: flex;
    gap: 10px;
    margin-bottom: 5px;

    & > uui-input, & > uui-textarea {
        flex: 1;
        max-width: 800px;
    }

    .label {
        width: 160px;
    }
}
.required {
    color: var(--uui-color-danger-standalone,rgb(191, 33, 78));
}
`;
var O = Object.defineProperty, L = Object.getOwnPropertyDescriptor, M = (e) => {
  throw TypeError(e);
}, n = (e, t, a, s) => {
  for (var i = s > 1 ? void 0 : s ? L(t, a) : t, o = e.length - 1, l; o >= 0; o--)
    (l = e[o]) && (i = (s ? l(t, a, i) : l(i)) || i);
  return s && i && O(t, a, i), i;
}, f = (e, t, a) => t.has(e) || M("Cannot " + a), R = (e, t, a) => (f(e, t, "read from private field"), a ? a.call(e) : t.get(e)), v = (e, t, a) => t.has(e) ? M("Cannot add the same private member more than once") : t instanceof WeakSet ? t.add(e) : t.set(e, a), S = (e, t, a, s) => (f(e, t, "write to private field"), t.set(e, a), a), _ = (e, t, a) => (f(e, t, "access private method"), a), p, d, c;
const h = "our-multilanguage-textbox";
let r = class extends A(E) {
  constructor() {
    super(...arguments), v(this, d), v(this, p, []), this.isReady = !1;
  }
  set value(e) {
    e = e || [], S(this, p, e);
  }
  get value() {
    return R(this, p);
  }
  set config(e) {
    this.assignValuesFromConfig(e);
  }
  firstUpdated(e) {
    this.runPrepItems().then(() => this.isReady = !0);
  }
  async runPrepItems() {
    const e = await q.getLanguage();
    this.langItems = e.items;
  }
  assignValuesFromConfig(e) {
    this.configIsMandatoryLanguageRequired = e.getValueByAlias(g.isMandatoryLanguageRequired.alias) ?? !1, this.configUseTextArea = e.getValueByAlias(g.useTextArea.alias) ?? !1;
  }
  render() {
    return !this.isReady || !this.langItems ? y : u`
         <div class="multilang-wrap">
            ${I(this.langItems, (e) => e.isoCode, (e) => {
      const t = this.value.find((s) => s.culture === e.isoCode) ?? { culture: e.isoCode, text: "" }, a = this.configIsMandatoryLanguageRequired && e.isMandatory;
      return u`
                <uui-form-validation-message>
                    <div class="multilang-row">
                        <span class="label">${e.name}${P(a, () => u`<strong class="required">*</strong>`, () => y)}</span>
                        ${this.configUseTextArea ? u`
                            <uui-textarea label="${e.name}" name="${e.isoCode}" @input=${_(this, d, c)} .value=${t.text} ?required=${a} ${x(this)}></uui-textarea>
                            ` : u`
                            <uui-input label="${e.name}" name="${e.isoCode}" @input=${_(this, d, c)} .value=${t.text} ?required=${a} ${x(this)}></uui-input>
                        `}
                    </div>
                </uui-form-validation-message>
            `;
    })}
        </div>
        `;
  }
};
p = /* @__PURE__ */ new WeakMap();
d = /* @__PURE__ */ new WeakSet();
c = function(e) {
  e.stopPropagation();
  const t = e.target, a = t.value, s = t.name, i = JSON.parse(JSON.stringify(this.value)), o = i.findIndex((U) => U.culture === s), l = {
    culture: s,
    text: a
  };
  o !== -1 ? i[o] = l : i.push(l), this.value = i, this.dispatchEvent(new w());
};
r.styles = [C];
n([
  b({ type: JSON, attribute: !1 })
], r.prototype, "value", 1);
n([
  b({ attribute: !1 })
], r.prototype, "config", 1);
n([
  m()
], r.prototype, "configIsMandatoryLanguageRequired", 2);
n([
  m()
], r.prototype, "configUseTextArea", 2);
n([
  m()
], r.prototype, "isReady", 2);
n([
  m()
], r.prototype, "langItems", 2);
r = n([
  T(h)
], r);
const V = r, N = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  get MultilanguageTextboxElement() {
    return r;
  },
  default: V,
  elementName: h
}, Symbol.toStringTag, { value: "Module" })), g = {
  isMandatoryLanguageRequired: {
    label: "Make mandatory language(s) required",
    description: "Make mandatory language(s) required. Is only applicable if the property is not marked as mandatory",
    alias: "isMandatoryLanguageRequired",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.Toggle"
  },
  useTextArea: {
    label: "Use text area",
    description: "Use a text area instead of text input field.",
    alias: "useTextArea",
    propertyEditorUiAlias: "Umb.PropertyEditorUi.Toggle"
  }
}, J = Object.keys(g).map((e) => g[e]), k = [
  // Conditional Radio
  {
    type: "propertyEditorUi",
    alias: "Our.Umbraco.MultilanguageTextbox",
    name: "Multi language text box",
    element: () => Promise.resolve().then(() => N),
    elementName: h,
    meta: {
      label: "Multi language text box",
      icon: "icon-indent",
      group: "common",
      propertyEditorSchemaAlias: "Umbraco.Plain.Json",
      settings: {
        properties: J
        // defaultData: [
        //     {
        //         alias: multiLangProperties.labelsPos.alias,
        //         value: 'Right'
        //     }
        // ]
      }
    }
  }
], z = (e, t) => {
  const a = [...k];
  t.registerMany(a);
}, G = (e, t) => {
};
export {
  z as onInit,
  G as onUnload
};
//# sourceMappingURL=backoffice-entrypoint-C418eHrv.js.map
