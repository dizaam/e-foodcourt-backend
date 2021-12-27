--SEPUTAR category
SELECT *
FROM CATEGORY;

SELECT *
FROM PRODUCT_CATEGORY;

INSERT INTO CATEGORY(ID, NAME)
VALUES(NULL, 'Makanan Pedas');

DELETE FROM category where id=26;

-- PL SQL PROCEDURE/FUNCTION DECLARATION
CREATE OR REPLACE FUNCTION CREATE_CATEGORY(L_NAME IN STRING, L_ID OUT INTEGER) RETURN INTEGER
AS
L_FLAG INTEGER;
BEGIN
    SELECT ID INTO L_FLAG
    FROM CATEGORY
    WHERE LOWER(NAME) = LOWER(L_NAME);
    
    RETURN 1;
    EXCEPTION
        WHEN NO_DATA_FOUND THEN
            INSERT INTO CATEGORY(ID, NAME)
            VALUES(CATEGORY_SEQ.NEXTVAL, L_NAME);
            L_ID := CATEGORY_SEQ.CURRVAL;
            RETURN 0;
END;
/

CREATE OR REPLACE PROCEDURE READ_ALL_CATEGORY IS
    L_CURSOR SYS_REFCURSOR;
BEGIN
    OPEN L_CURSOR FOR
        SELECT *
        FROM CATEGORY
        ORDER BY ID;
        
    DBMS_SQL.RETURN_RESULT(L_CURSOR);
END;
/

CREATE OR REPLACE PROCEDURE READ_CATEGORY_BYPRODUCT(L_PRODUCT_ID IN INTEGER) IS
    L_CURSOR SYS_REFCURSOR;
BEGIN
    OPEN L_CURSOR FOR
        SELECT PC.PRODUCT_ID, PC.CATEGORY_ID, C.NAME
        FROM PRODUCT_CATEGORY PC
        JOIN CATEGORY C ON PC.CATEGORY_ID = C.ID
        WHERE PRODUCT_ID = L_PRODUCT_ID;
        
        DBMS_SQL.RETURN_RESULT(L_CURSOR);      
END;
/

CREATE OR REPLACE PACKAGE CATEGORY_PKG IS
    TYPE ARRAY_OF_INTEGER IS TABLE OF INTEGER INDEX BY BINARY_INTEGER;
    PROCEDURE ADD_PRODUCT_CATEGORY(L_PRODUCT_ID IN INTEGER, L_CATEGORY_ID IN ARRAY_OF_INTEGER);
    PROCEDURE UPDATE_PRODUCT_CATEGORY(L_PRODUCT_ID IN INTEGER, L_CATEGORY_ID IN ARRAY_OF_INTEGER);
END;
/

CREATE OR REPLACE PACKAGE BODY CATEGORY_PKG IS
    PROCEDURE ADD_PRODUCT_CATEGORY(L_PRODUCT_ID IN INTEGER, L_CATEGORY_ID IN ARRAY_OF_INTEGER) 
    IS
    BEGIN
        FORALL X IN INDICES OF L_CATEGORY_ID
            INSERT INTO PRODUCT_CATEGORY(PRODUCT_ID, CATEGORY_ID)
            VALUES(L_PRODUCT_ID, L_CATEGORY_ID(X));
    END;
    
    PROCEDURE UPDATE_PRODUCT_CATEGORY(L_PRODUCT_ID IN INTEGER, L_CATEGORY_ID IN ARRAY_OF_INTEGER)
    IS
    BEGIN
        DELETE FROM PRODUCT_CATEGORY
        WHERE PRODUCT_ID = L_PRODUCT_ID;
        
        ADD_PRODUCT_CATEGORY(L_PRODUCT_ID, L_CATEGORY_ID);
    END;
END;
/
