-- DATA MANIPULATION LANGUAGE
SET SERVEROUTPUT ON;
--SEPUTAR CUSTOMER
SELECT *
FROM CUSTOMER;

INSERT INTO CUSTOMER(ID, EMAIL, USERNAME, PASSWORD, PHONE)
VALUES (null, 'WOTT@gmail.com', 'WOTT', 'passwd', '42343');

DELETE FROM CUSTOMER WHERE CUSTOMER.ID = 22;

DECLARE
    X INTEGER := -1;
BEGIN
--    X := CREATE_NEW_CUSTOMER('ranjau@gmail.com', 'ranj', 'qwerty', '0821231
    X := AUTHENTICATE_CUSTOMER('abadul1', '123');
    DBMS_OUTPUT.PUT_LINE('X: ' || X);
END;


--
-- PL SQL PROCEDURE/FUNCTION DECLARATION
--
CREATE OR REPLACE FUNCTION CREATE_CUSTOMER(L_EMAIL IN STRING, L_FULLNAME IN STRING, L_PASSWORD IN STRING, L_PHONE IN STRING, L_GENDER IN STRING) RETURN NUMBER
AS
BEGIN

    INSERT INTO CUSTOMER(ID, EMAIL, FULL_NAME, PASSWORD, PHONE, GENDER)
    VALUES (NULL, LOWER(L_EMAIL), L_FULLNAME, L_PASSWORD, L_PHONE, L_GENDER);
    
    RETURN 0;
    EXCEPTION
        WHEN DUP_VAL_ON_INDEX THEN
            RETURN 1;
END;
/

CREATE OR REPLACE FUNCTION AUTHENTICATE_CUSTOMER(L_EMAIL IN STRING, L_PASSWORD IN STRING, L_ID OUT NUMBER) RETURN NUMBER
AS
BEGIN
    SELECT ID INTO L_ID
    FROM CUSTOMER C 
    WHERE C.EMAIL = L_EMAIL AND C.PASSWORD = L_PASSWORD;

    RETURN 0;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            RETURN 1;
END;
/


