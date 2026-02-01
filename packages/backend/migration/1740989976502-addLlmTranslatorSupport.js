/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

export class  AddLLMTranslatorSupport1740989976502 {
    name = 'AddLLMTranslatorSupport1740989976502'

    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" ADD "enableLLMTranslator" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "enableLLMTranslatorRedisCache" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "LLMTranslatorRedisCacheTtl" integer NOT NULL DEFAULT '2880'`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "LLMTranslatorBaseUrl" character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "LLMTranslatorApiKey" character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "LLMTranslatorModel" character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "LLMTranslatorTemperature" real`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "LLMTranslatorTopP" real`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "LLMTranslatorMaxTokens" integer`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "LLMTranslatorSysPrompt" character varying(1024)`);
        await queryRunner.query(`ALTER TABLE "meta" ADD "LLMTranslatorUserPrompt" character varying(1024)`);
    }

    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "enableLLMTranslator"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "enableLLMTranslatorRedisCache"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "LLMTranslatorRedisCacheTtl"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "LLMTranslatorBaseUrl"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "LLMTranslatorApiKey"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "LLMTranslatorModel"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "LLMTranslatorTemperature"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "LLMTranslatorTopP"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "LLMTranslatorMaxTokens"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "LLMTranslatorSysPrompt"`);
        await queryRunner.query(`ALTER TABLE "meta" DROP COLUMN "LLMTranslatorUserPrompt"`);
    }
}
