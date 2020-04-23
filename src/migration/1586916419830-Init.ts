import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1586916419830 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`
            CREATE TABLE "app" (
                app_id char(36) primary key,
                api_key varchar(64),
                name varchar(254),
                date_created timestamp with time zone,
                date_modified timestamp with time zone
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "profile" (
                profile_id serial primary key,
                name varchar(254),
                date_created timestamp with time zone
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "server" (
                server_id serial primary key,
                profile_id integer not null,
                base_url varchar(254),
                date_created timestamp with time zone
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "session" (
                session_id char(36) primary key,
                app_id char(36),
                server_id integer,
                session_data text,
                date_created timestamp with time zone,
                date_expires timestamp with time zone
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`DROP TABLE "app"`);
        await queryRunner.query(`DROP TABLE "session"`);
    }

}
