SET XACT_ABORT ON;

BEGIN TRY
    BEGIN TRANSACTION;

    IF OBJECT_ID(N'dbo.AUDIT_LOGS', N'U') IS NULL
        THROW 51000, 'Tabel dbo.AUDIT_LOGS harus tersedia sebelum menjalankan skrip ini.', 1;

    IF COL_LENGTH(N'dbo.AUDIT_LOGS', N'metadata') IS NULL
        ALTER TABLE dbo.AUDIT_LOGS ADD metadata NVARCHAR(MAX) NULL;

    IF EXISTS (
        SELECT 1
        FROM sys.columns
        WHERE object_id = OBJECT_ID(N'dbo.AUDIT_LOGS')
          AND name = N'user_id'
          AND is_nullable = 0
    )
        ALTER TABLE dbo.AUDIT_LOGS ALTER COLUMN user_id INT NULL;

    IF NOT EXISTS (
        SELECT 1
        FROM sys.check_constraints
        WHERE parent_object_id = OBJECT_ID(N'dbo.AUDIT_LOGS')
          AND name = N'CK_AUDIT_LOGS_Metadata_IsJson'
    )
        ALTER TABLE dbo.AUDIT_LOGS WITH NOCHECK
        ADD CONSTRAINT CK_AUDIT_LOGS_Metadata_IsJson
        CHECK (metadata IS NULL OR ISJSON(metadata) = 1);

    DECLARE @actionLength SMALLINT;
    DECLARE @actionNullable BIT;
    DECLARE @targetTableLength SMALLINT;
    DECLARE @targetTableNullable BIT;

    SELECT @actionLength = c.max_length, @actionNullable = c.is_nullable
    FROM sys.columns c
    WHERE c.object_id = OBJECT_ID(N'dbo.AUDIT_LOGS') AND c.name = N'action';

    SELECT @targetTableLength = c.max_length, @targetTableNullable = c.is_nullable
    FROM sys.columns c
    WHERE c.object_id = OBJECT_ID(N'dbo.AUDIT_LOGS') AND c.name = N'target_table';

    IF @actionLength IS NULL OR @targetTableLength IS NULL
        THROW 51001, 'Kolom action dan target_table harus tersedia pada dbo.AUDIT_LOGS.', 1;

    IF @actionLength <> -1 AND @actionLength < 100
        EXEC(N'ALTER TABLE dbo.AUDIT_LOGS ALTER COLUMN action NVARCHAR(50) '
            + CASE WHEN @actionNullable = 1 THEN N'NULL' ELSE N'NOT NULL' END + N';');

    IF @targetTableLength <> -1 AND @targetTableLength < 100
        EXEC(N'ALTER TABLE dbo.AUDIT_LOGS ALTER COLUMN target_table NVARCHAR(50) '
            + CASE WHEN @targetTableNullable = 1 THEN N'NULL' ELSE N'NOT NULL' END + N';');

    IF NOT EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE object_id = OBJECT_ID(N'dbo.AUDIT_LOGS')
          AND name = N'IX_AUDIT_LOGS_CreatedAt_Id'
    )
        CREATE INDEX IX_AUDIT_LOGS_CreatedAt_Id
            ON dbo.AUDIT_LOGS (created_at DESC, id DESC);

    IF NOT EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE object_id = OBJECT_ID(N'dbo.AUDIT_LOGS')
          AND name = N'IX_AUDIT_LOGS_TargetTable_TargetId'
    )
        CREATE INDEX IX_AUDIT_LOGS_TargetTable_TargetId
            ON dbo.AUDIT_LOGS (target_table, target_id);

    IF NOT EXISTS (
        SELECT 1 FROM sys.indexes
        WHERE object_id = OBJECT_ID(N'dbo.AUDIT_LOGS')
          AND name = N'IX_AUDIT_LOGS_UserId_CreatedAt'
    )
        CREATE INDEX IX_AUDIT_LOGS_UserId_CreatedAt
            ON dbo.AUDIT_LOGS (user_id, created_at DESC);

    COMMIT TRANSACTION;
END TRY
BEGIN CATCH
    IF XACT_STATE() <> 0 ROLLBACK TRANSACTION;
    THROW;
END CATCH;
