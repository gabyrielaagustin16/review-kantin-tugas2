/*
  Pembuktian append-only.
  Setiap UPDATE dan DELETE harus menghasilkan error number 50010.
*/
BEGIN TRY
    UPDATE dbo.AUDIT_LOGS SET action = action WHERE id = -1;
END TRY
BEGIN CATCH
    SELECT ERROR_NUMBER() AS errorNumber,
           ERROR_MESSAGE() AS errorMessage;
END CATCH;

BEGIN TRY
    DELETE FROM dbo.AUDIT_LOGS WHERE id = -1;
END TRY
BEGIN CATCH
    SELECT ERROR_NUMBER() AS errorNumber,
           ERROR_MESSAGE() AS errorMessage;
END CATCH;
