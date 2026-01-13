"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockUserModel = void 0;
class MockUserModel {
    constructor(data) {
        this.data = data;
    }
    save() {
        const id = this.data._id || `mock_user_${Date.now()}`;
        this.data._id = id;
        MockUserModel.store.set(id, this.data);
        return Promise.resolve(this.data);
    }
    static find() {
        return {
            exec: () => Promise.resolve(Array.from(this.store.values()))
        };
    }
    static findOne(query) {
        let found = null;
        if (query.mobile) {
            for (const user of this.store.values()) {
                if (user.mobile === query.mobile) {
                    found = user;
                    break;
                }
            }
        }
        return {
            exec: () => Promise.resolve(found)
        };
    }
}
exports.MockUserModel = MockUserModel;
MockUserModel.store = new Map();
//# sourceMappingURL=user.model.mock.js.map