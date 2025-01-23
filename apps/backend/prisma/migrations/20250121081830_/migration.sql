-- CreateTable
CREATE TABLE `swld_copywriting` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `page` VARCHAR(255) NULL,
    `code` VARCHAR(255) NULL,
    `zh` TEXT NULL,
    `en` TEXT NULL,
    `vi` TEXT NULL,
    `image_url` TEXT NULL,
    `is_image` BOOLEAN NULL,
    `create_at` BIGINT NULL,
    `update_at` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `swld_user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `inviter_id` INTEGER UNSIGNED NULL,
    `tx_digest` VARCHAR(255) NULL,
    `event_seq` VARCHAR(255) NULL,
    `address` VARCHAR(72) NULL,
    `inviter` VARCHAR(72) NULL,
    `is_bind` BOOLEAN NULL DEFAULT false,
    `sharer_ids` TEXT NULL,
    `is_root` BOOLEAN NULL DEFAULT false,
    `create_at` BIGINT NULL,
    `update_at` BIGINT NULL,

    UNIQUE INDEX `swld_user_address_key`(`address`),
    INDEX `swld_user_inviter_id_idx`(`inviter_id`),
    UNIQUE INDEX `swld_user_tx_digest_event_seq_key`(`tx_digest`, `event_seq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `swld_node` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `rank` BIGINT NULL,
    `name` VARCHAR(255) NULL,
    `description` TEXT NULL,
    `is_open` BOOLEAN NULL DEFAULT false,
    `create_at` BIGINT NULL,
    `update_at` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `swld_airdrop` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `round` BIGINT NULL,
    `start_time` BIGINT NULL,
    `end_time` BIGINT NULL,
    `total_shares` BIGINT NULL,
    `claimed_shares` BIGINT NULL,
    `total_balance` BIGINT NULL,
    `is_open` BOOLEAN NULL,
    `description` TEXT NULL,
    `coin_type` VARCHAR(255) NULL,
    `image_url` TEXT NULL,
    `remaining_balance` BIGINT NULL,
    `create_at` BIGINT NULL,
    `update_at` BIGINT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `swld_special_limit` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `address` VARCHAR(72) NULL,
    `times` BIGINT NULL,
    `is_limit` BOOLEAN NULL DEFAULT false,

    UNIQUE INDEX `swld_special_limit_address_key`(`address`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `swld_buy_record` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tx_digest` VARCHAR(255) NULL,
    `event_seq` VARCHAR(255) NULL,
    `sender` VARCHAR(72) NULL,
    `rank` BIGINT NULL,
    `node_num` BIGINT NULL,
    `create_at` BIGINT NULL,
    `update_at` BIGINT NULL,

    UNIQUE INDEX `swld_buy_record_tx_digest_event_seq_key`(`tx_digest`, `event_seq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `swld_claim_record` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `tx_digest` VARCHAR(255) NULL,
    `event_seq` VARCHAR(255) NULL,
    `sender` VARCHAR(72) NULL,
    `round` BIGINT NULL,
    `coin_type` VARCHAR(255) NULL,
    `node_num` BIGINT NULL,
    `create_at` BIGINT NULL,
    `update_at` BIGINT NULL,

    UNIQUE INDEX `swld_claim_record_tx_digest_event_seq_key`(`tx_digest`, `event_seq`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
