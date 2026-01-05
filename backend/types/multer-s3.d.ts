declare module 'multer-s3' {
    import { S3 } from 'aws-sdk';
    import { StorageEngine } from 'multer';
    import { Request } from 'express';

    interface Options {
        s3: S3;
        bucket: string | ((req: Request, file: Express.Multer.File, callback: (error: any, bucket?: string) => void) => void);
        key?: (req: Request, file: Express.Multer.File, callback: (error: any, key?: string) => void) => void;
        acl?: string;
        contentType?: (req: Request, file: Express.Multer.File, callback: (error: any, mime?: string, stream?: NodeJS.ReadableStream) => void) => void;
        metadata?: (req: Request, file: Express.Multer.File, callback: (error: any, metadata?: any) => void) => void;
        cacheControl?: string;
        contentDisposition?: string;
        serverSideEncryption?: string;
        storageClass?: string;
    }

    function multerS3(options: Options): StorageEngine;
    export = multerS3;
}
