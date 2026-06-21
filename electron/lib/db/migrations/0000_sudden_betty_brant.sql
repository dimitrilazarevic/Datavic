CREATE TABLE `bottle` (
	`bottle_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`folder_name` text(255),
	`image_extension` text(10),
	`raw_image_content` blob,
	`claim_ml` real,
	`mass_g` text(20),
	`version` text,
	`status` text,
	`pdm_number` integer,
	`overflow_capacity_ml` real,
	`surface_cm2` real,
	`thickness_mm` real,
	`mass_loss_exp` real,
	`mass_loss_num` real,
	`created_at` text,
	`last_modified` text,
	`bottle_type_id` integer NOT NULL,
	`brand_id` integer NOT NULL,
	`material_id` integer NOT NULL,
	`overbrand_id` integer NOT NULL,
	`zone_id` integer NOT NULL,
	FOREIGN KEY (`bottle_type_id`) REFERENCES `bottle_type`(`bottle_type_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`brand_id`) REFERENCES `brand`(`brand_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`material_id`) REFERENCES `material`(`material_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`overbrand_id`) REFERENCES `overbrand`(`overbrand_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`zone_id`) REFERENCES `zone`(`zone_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bottle_folder_name_unique` ON `bottle` (`folder_name`);--> statement-breakpoint
CREATE TABLE `bottle_analysis` (
	`bottle_analysis_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`test_type` text NOT NULL,
	`thickness_type` text NOT NULL,
	`bottle_analysis_key` text(40),
	`file_name` text(255),
	`x_coordinates` text NOT NULL,
	`y_coordinates` text NOT NULL,
	`bottle_id` integer NOT NULL,
	`file_content_text` text NOT NULL,
	FOREIGN KEY (`bottle_id`) REFERENCES `bottle`(`bottle_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `bottle_type` (
	`bottle_type_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`bottle_type_name` text(100) NOT NULL,
	`bottle_type_constant` real NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `bottle_type_bottle_type_name_unique` ON `bottle_type` (`bottle_type_name`);--> statement-breakpoint
CREATE TABLE `brand` (
	`brand_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`brand_name` text(100) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `brand_brand_name_unique` ON `brand` (`brand_name`);--> statement-breakpoint
CREATE TABLE `material` (
	`material_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`folder_name` text(255),
	`image_extension` text(10),
	`raw_image_content` blob,
	`temperature_c` integer NOT NULL,
	`production_year` integer,
	`avg_elastic_modulus` real,
	`avg_elastic_limit` real,
	`longi_avg_elastic_modulus` real,
	`longi_avg_elastic_limit` real,
	`rad_avg_elastic_modulus` real,
	`rad_avg_elastic_limit` real,
	`syne_abaqus_elastic_modulus` real,
	`syne_abaqus_elastic_limit` real,
	`created_at` text,
	`last_modified` text,
	`ref1` text(100),
	`pct1` integer DEFAULT 100,
	`ref2` text(100),
	`pct2` integer,
	`material_family_id` integer NOT NULL,
	`supplier_id_1` integer NOT NULL,
	`supplier_id_2` integer,
	FOREIGN KEY (`material_family_id`) REFERENCES `material_family`(`material_family_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id_1`) REFERENCES `supplier`(`supplier_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`supplier_id_2`) REFERENCES `supplier`(`supplier_id`) ON UPDATE no action ON DELETE no action,
	CONSTRAINT "pct_sum_100" CHECK((COALESCE("material"."pct1", 0) + COALESCE("material"."pct2", 0)) = 100)
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_folder_name_unique` ON `material` (`folder_name`);--> statement-breakpoint
CREATE TABLE `material_analysis` (
	`material_analysis_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`test_type` text NOT NULL,
	`test_direction` text NOT NULL,
	`material_analysis_key` text(40),
	`file_name` text(255),
	`x_coordinates` text NOT NULL,
	`y_coordinates` text NOT NULL,
	`material_id` integer NOT NULL,
	`file_content_text` text NOT NULL,
	FOREIGN KEY (`material_id`) REFERENCES `material`(`material_id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `material_family` (
	`material_family_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`material_family_name` text(100) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `material_family_material_family_name_unique` ON `material_family` (`material_family_name`);--> statement-breakpoint
CREATE TABLE `overbrand` (
	`overbrand_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`overbrand_name` text(100) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `overbrand_overbrand_name_unique` ON `overbrand` (`overbrand_name`);--> statement-breakpoint
CREATE TABLE `supplier` (
	`supplier_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`supplier_name` text(100) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `supplier_supplier_name_unique` ON `supplier` (`supplier_name`);--> statement-breakpoint
CREATE TABLE `zone` (
	`zone_id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`zone_name` text(100) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `zone_zone_name_unique` ON `zone` (`zone_name`);