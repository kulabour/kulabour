import { Model } from '@nozbe/watermelondb';
import { field, date, readonly } from '@nozbe/watermelondb/decorators';

export default class Service extends Model {
    static table = 'services';

    @field('name') name!: string;
    @field('category') category!: string;
    @field('price') price!: number;
    @field('description') description?: string;
    @field('image_url') imageUrl?: string;
    @readonly @date('created_at') createdAt!: Date;
    @readonly @date('updated_at') updatedAt!: Date;
}
