export declare class MockUserModel {
    private static store;
    private data;
    constructor(data: any);
    save(): Promise<any>;
    static find(): {
        exec: () => Promise<any[]>;
    };
    static findOne(query: any): {
        exec: () => Promise<any>;
    };
}
