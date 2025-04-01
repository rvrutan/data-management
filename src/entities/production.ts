import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Project } from './project';

@Entity('productions')
export class Production {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'float', default: 0 })
  cobaltKt!: number;

  @Column({ type: 'float', default: 0 })
  copperKt!: number;

  @Column({ type: 'float', default: 0 })
  nickelKt!: number;

  @Column({ type: 'float', default: 0 })
  goldOz!: number;

  @Column({ type: 'float', default: 0 })
  palladiumOz!: number;

  @Column({ type: 'float', default: 0 })
  platinumOz!: number;

  @Column({ type: 'float', default: 0 })
  silverOz!: number;

  @OneToOne(() => Project, project => project.production)
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column()
  projectId!: number;
} 