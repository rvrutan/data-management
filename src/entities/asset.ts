import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project';

@Entity('assets')
export class Asset {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  status?: string;

  @ManyToOne(() => Project, project => project.assets)
  @JoinColumn({ name: 'projectId' })
  project!: Project;

  @Column()
  projectId!: number;
} 