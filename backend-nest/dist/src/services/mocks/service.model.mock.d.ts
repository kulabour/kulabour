export declare class MockServiceModel {
    private data;
    constructor(data: any);
    save(): Promise<any>;
    static find(): {
        exec: () => Promise<never[]>;
    };
    static findById(): {
        exec: () => Promise<null>;
    };
    static findOne(): {
        exec: () => Promise<null>;
    };
    static create(data: any): MockServiceModel;
    static countDocuments(): {
        exec: () => Promise<number>;
    };
    static findByIdAndUpdate(): {
        exec: () => Promise<null>;
    };
}
