import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1743218061014 implements MigrationInterface {
    name = 'InitialMigration1743218061014'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying, "ownership" character varying, "optioned" character varying, CONSTRAINT "UQ_3dacbb3eb4f095e29372ff8e131" UNIQUE ("name"), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "assets" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "type" character varying, "status" character varying, "projectId" integer NOT NULL, CONSTRAINT "PK_da96729a8b113377cfb6a62439c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "commodities" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "primaryCommodity" boolean, "projectId" integer NOT NULL, CONSTRAINT "PK_d8ec0122a7596e8b1b0a275c9c0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "geolocations" ("id" SERIAL NOT NULL, "lat" double precision, "long" double precision, "nearestLandmark" character varying, "projectId" integer NOT NULL, CONSTRAINT "REL_a9607ba1094653f2a1efe02933" UNIQUE ("projectId"), CONSTRAINT "PK_371073cff743747b0e8269d3932" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "productions" ("id" SERIAL NOT NULL, "cobaltKt" double precision NOT NULL DEFAULT '0', "copperKt" double precision NOT NULL DEFAULT '0', "nickelKt" double precision NOT NULL DEFAULT '0', "goldOz" double precision NOT NULL DEFAULT '0', "palladiumOz" double precision NOT NULL DEFAULT '0', "platinumOz" double precision NOT NULL DEFAULT '0', "silverOz" double precision NOT NULL DEFAULT '0', "projectId" integer NOT NULL, CONSTRAINT "REL_af0a3d3f3a9b517901e79e02d0" UNIQUE ("projectId"), CONSTRAINT "PK_395fda0b6f26cb5fd9a2aa6315c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "projects" ("id" SERIAL NOT NULL, "projectNameTitle" character varying NOT NULL, "assetType" character varying, "workType" character varying, "developmentStatus" character varying, "location" character varying, "mineTechnology" character varying, "processingTechnology" character varying, "country" character varying, "companyId" integer NOT NULL, CONSTRAINT "PK_6271df0a7aed1d6c0691ce6ac50" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "assets" ADD CONSTRAINT "FK_e0703a2e9030e296fb714a71068" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "commodities" ADD CONSTRAINT "FK_8f9b78d3f403418367fbf6eef2e" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "geolocations" ADD CONSTRAINT "FK_a9607ba1094653f2a1efe02933d" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "productions" ADD CONSTRAINT "FK_af0a3d3f3a9b517901e79e02d0c" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "projects" ADD CONSTRAINT "FK_87fa45e3f4517658b98e5c55b9c" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "projects" DROP CONSTRAINT "FK_87fa45e3f4517658b98e5c55b9c"`);
        await queryRunner.query(`ALTER TABLE "productions" DROP CONSTRAINT "FK_af0a3d3f3a9b517901e79e02d0c"`);
        await queryRunner.query(`ALTER TABLE "geolocations" DROP CONSTRAINT "FK_a9607ba1094653f2a1efe02933d"`);
        await queryRunner.query(`ALTER TABLE "commodities" DROP CONSTRAINT "FK_8f9b78d3f403418367fbf6eef2e"`);
        await queryRunner.query(`ALTER TABLE "assets" DROP CONSTRAINT "FK_e0703a2e9030e296fb714a71068"`);
        await queryRunner.query(`DROP TABLE "projects"`);
        await queryRunner.query(`DROP TABLE "productions"`);
        await queryRunner.query(`DROP TABLE "geolocations"`);
        await queryRunner.query(`DROP TABLE "commodities"`);
        await queryRunner.query(`DROP TABLE "assets"`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}
