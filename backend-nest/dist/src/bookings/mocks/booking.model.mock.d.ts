export declare class MockBookingModel {
    private data;
    constructor(data: any);
    save(): Promise<any>;
    static find(): {
        sort: () => {
            limit: () => {
                exec: () => Promise<never[]>;
            };
        };
        exec: () => Promise<never[]>;
    };
    static findById(): {
        exec: () => Promise<null>;
    };
    static findOne(): {
        exec: () => Promise<null>;
    };
    static create(data: any): MockBookingModel;
    static countDocuments(): {
        exec: () => Promise<number>;
    };
    static aggregate(): {
        exec: () => Promise<never[]>;
    };
}
