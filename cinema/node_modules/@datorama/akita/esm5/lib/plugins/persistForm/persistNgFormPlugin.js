import { __assign, __extends } from "tslib";
import { AkitaPlugin } from '../plugin';
import { debounceTime } from 'rxjs/operators';
import { getValue } from '../../getValueByString';
import { toBoolean } from '../../toBoolean';
import { isString } from '../../isString';
import { setValue } from '../../setValueByString';
import { logAction } from '../../actions';
var PersistNgFormPlugin = /** @class */ (function (_super) {
    __extends(PersistNgFormPlugin, _super);
    function PersistNgFormPlugin(query, factoryFnOrPath, params) {
        if (params === void 0) { params = {}; }
        var _this = _super.call(this, query) || this;
        _this.query = query;
        _this.factoryFnOrPath = factoryFnOrPath;
        _this.params = params;
        _this.params = __assign({ debounceTime: 300, formKey: 'akitaForm', emitEvent: false, arrControlFactory: function (v) { return _this.builder.control(v); } }, params);
        _this.isRootKeys = toBoolean(factoryFnOrPath) === false;
        _this.isKeyBased = isString(factoryFnOrPath) || _this.isRootKeys;
        return _this;
    }
    PersistNgFormPlugin.prototype.setForm = function (form, builder) {
        this.form = form;
        this.builder = builder;
        this.activate();
        return this;
    };
    PersistNgFormPlugin.prototype.reset = function (initialState) {
        var _a;
        var _this = this;
        var value;
        if (initialState) {
            value = initialState;
        }
        else {
            value = this.isKeyBased ? this.initialValue : this.factoryFnOrPath();
        }
        if (this.isKeyBased) {
            Object.keys(this.initialValue).forEach(function (stateKey) {
                var value = _this.initialValue[stateKey];
                if (Array.isArray(value) && _this.builder) {
                    var formArray = _this.form.controls[stateKey];
                    _this.cleanArray(formArray);
                    value.forEach(function (v, i) {
                        _this.form.get(stateKey).insert(i, _this.params.arrControlFactory(v));
                    });
                }
            });
        }
        this.form.patchValue(value, { emitEvent: this.params.emitEvent });
        var storeValue = this.isKeyBased ? setValue(this.getQuery().getValue(), this.getStore().storeName + "." + this.factoryFnOrPath, value) : (_a = {}, _a[this.params.formKey] = value, _a);
        this.updateStore(storeValue);
    };
    PersistNgFormPlugin.prototype.cleanArray = function (control) {
        while (control.length !== 0) {
            control.removeAt(0);
        }
    };
    PersistNgFormPlugin.prototype.resolveInitialValue = function (formValue, root) {
        var _this = this;
        if (!formValue)
            return;
        return Object.keys(formValue).reduce(function (acc, stateKey) {
            var value = root[stateKey];
            if (Array.isArray(value) && _this.builder) {
                var factory_1 = _this.params.arrControlFactory;
                _this.cleanArray(_this.form.get(stateKey));
                value.forEach(function (v, i) {
                    _this.form.get(stateKey).insert(i, factory_1(v));
                });
            }
            acc[stateKey] = root[stateKey];
            return acc;
        }, {});
    };
    PersistNgFormPlugin.prototype.activate = function () {
        var _a;
        var _this = this;
        var path;
        if (this.isKeyBased) {
            if (this.isRootKeys) {
                this.initialValue = this.resolveInitialValue(this.form.value, this.getQuery().getValue());
                this.form.patchValue(this.initialValue, { emitEvent: this.params.emitEvent });
            }
            else {
                path = this.getStore().storeName + "." + this.factoryFnOrPath;
                var root = getValue(this.getQuery().getValue(), path);
                this.initialValue = this.resolveInitialValue(root, root);
                this.form.patchValue(this.initialValue, { emitEvent: this.params.emitEvent });
            }
        }
        else {
            if (!this.getQuery().getValue()[this.params.formKey]) {
                logAction('@PersistNgFormPlugin activate');
                this.updateStore((_a = {}, _a[this.params.formKey] = this.factoryFnOrPath(), _a));
            }
            var value = this.getQuery().getValue()[this.params.formKey];
            this.form.patchValue(value);
        }
        this.formChanges = this.form.valueChanges.pipe(debounceTime(this.params.debounceTime)).subscribe(function (value) {
            logAction('@PersistForm - Update');
            var newState;
            if (_this.isKeyBased) {
                if (_this.isRootKeys) {
                    newState = function (state) { return (__assign(__assign({}, state), value)); };
                }
                else {
                    newState = function (state) { return setValue(state, path, value); };
                }
            }
            else {
                newState = function () {
                    var _a;
                    return (_a = {}, _a[_this.params.formKey] = value, _a);
                };
            }
            _this.updateStore(newState(_this.getQuery().getValue()));
        });
    };
    PersistNgFormPlugin.prototype.destroy = function () {
        this.formChanges && this.formChanges.unsubscribe();
        this.form = null;
        this.builder = null;
    };
    return PersistNgFormPlugin;
}(AkitaPlugin));
export { PersistNgFormPlugin };
//# sourceMappingURL=persistNgFormPlugin.js.map