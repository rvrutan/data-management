import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Project } from './project';

@Entity('companies')
export class Company {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  name!: string;

  @Column({ nullable: true })
  type?: string;

  @Column({ nullable: true })
  ownership?: string;

  @Column({ nullable: true })
  optioned?: string;

  @OneToMany(() => Project, project => project.company)
  projects!: Project[];
} 