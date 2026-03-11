import {
    Entity,
    Column,
    OneToMany,
} from 'typeorm';
import { BaseEntity } from '../../../database/base.entity';
import { ClassEntity } from '../../classes/entities/class.entity';

@Entity('branches')
export class Branch extends BaseEntity {
    @Column({ name: 'name', type: 'varchar', length: 255 })
    name: string;

    @Column({ name: 'address', type: 'text', nullable: true })
    address: string;

    @OneToMany(() => ClassEntity, (cls) => cls.branch)
    classes: ClassEntity[];
}
