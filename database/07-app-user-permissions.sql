DECLARE @LoginPassword NVARCHAR(128) = N'<REPLACE_WITH_STRONG_PASSWORD>';

IF SUSER_ID(N'kantin_app') IS NULL
BEGIN
    IF @LoginPassword = N'<REPLACE_WITH_STRONG_PASSWORD>'
        THROW 51002, 'Ganti placeholder password sebelum membuat login kantin_app.', 1;

    DECLARE @CreateLoginSql NVARCHAR(MAX) =
        N'CREATE LOGIN [kantin_app] WITH PASSWORD = N'''
        + REPLACE(@LoginPassword, N'''', N'''''')
        + N''', CHECK_POLICY = ON;';
    EXEC sys.sp_executesql @CreateLoginSql;
END;

IF DATABASE_PRINCIPAL_ID(N'kantin_app') IS NULL
    CREATE USER [kantin_app] FOR LOGIN [kantin_app];

IF ISNULL(IS_ROLEMEMBER(N'db_datareader', N'kantin_app'), 0) <> 1
    ALTER ROLE [db_datareader] ADD MEMBER [kantin_app];

IF ISNULL(IS_ROLEMEMBER(N'db_datawriter', N'kantin_app'), 0) <> 1
    ALTER ROLE [db_datawriter] ADD MEMBER [kantin_app];

GRANT INSERT, SELECT ON OBJECT::dbo.AUDIT_LOGS TO [kantin_app];
DENY UPDATE, DELETE, ALTER ON OBJECT::dbo.AUDIT_LOGS TO [kantin_app];
