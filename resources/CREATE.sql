SET client_encoding = 'UTF8';

DROP TABLE IF EXISTS invoice_line;
DROP TABLE IF EXISTS invoice;
DROP TABLE IF EXISTS revenue_by_country;
DROP TABLE IF EXISTS revenue_by_city;
DROP TABLE IF EXISTS revenue_by_month;
DROP TABLE IF EXISTS product_fiscal_year;
DROP TABLE IF EXISTS customer_fiscal_year;
DROP TABLE IF EXISTS fiscal_year;
DROP TABLE IF EXISTS company;

CREATE TABLE company
(
    company_id    BIGSERIAL PRIMARY KEY,
    company_name  VARCHAR(255),
    currency_code VARCHAR(3)
);

CREATE TABLE fiscal_year
(
    fiscal_year       BIGSERIAL,
    company_id        BIGSERIAL,
    start_date        DATE,
    end_date          DATE,
    date_created      DATE,
    number_of_entries INT            NOT NULL DEFAULT 0,
    net_sales         DECIMAL(10, 2) NOT NULL DEFAULT 0,
    gross_sales       DECIMAL(10, 2) NOT NULL DEFAULT 0,
    aov               DECIMAL(10, 2) NOT NULL DEFAULT 0,
    rpr               DECIMAL(10, 2) NOT NULL DEFAULT 0,
    clv               DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (company_id) REFERENCES company (company_id),
    PRIMARY KEY (fiscal_year, company_id)
);

CREATE TABLE customer_fiscal_year
(
    customer_tax_id        VARCHAR(50),
    company_name           VARCHAR(255),
    billing_address_detail VARCHAR(255),
    billing_city           VARCHAR(255),
    billing_postal_code    VARCHAR(20),
    billing_country        VARCHAR(2),
    company_id             BIGSERIAL,
    fiscal_year            BIGSERIAL,
    invoices_count         INT            NOT NULL DEFAULT 0,
    customer_net_total     DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (fiscal_year, company_id) REFERENCES fiscal_year (fiscal_year, company_id),
    PRIMARY KEY (company_id, fiscal_year, customer_tax_id)
);

CREATE TABLE product_fiscal_year
(
    product_code        VARCHAR(50),
    product_description VARCHAR(255),
    fiscal_year         BIGSERIAL,
    company_id          BIGSERIAL,
    revenue             DECIMAL(10, 2) NOT NULL DEFAULT 0,
    total_sales         INT            NOT NULL DEFAULT 0,
    FOREIGN KEY (fiscal_year, company_id) REFERENCES fiscal_year (fiscal_year, company_id),
    PRIMARY KEY (product_code, fiscal_year, company_id)
);

CREATE TABLE revenue_by_month
(
    company_id     BIGSERIAL,
    fiscal_year    BIGSERIAL,
    month          INT,
    invoices_count INT            NOT NULL DEFAULT 0,
    net_total      DECIMAL(10, 2) NOT NULL DEFAULT 0,
    gross_total    DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (fiscal_year, company_id) REFERENCES fiscal_year (fiscal_year, company_id),
    PRIMARY KEY (month, fiscal_year, company_id)
);

CREATE TABLE revenue_by_city
(
    company_id   BIGSERIAL,
    fiscal_year  BIGSERIAL,
    billing_city VARCHAR(50),
    net_total    DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (fiscal_year, company_id) REFERENCES fiscal_year (fiscal_year, company_id),
    PRIMARY KEY (billing_city, company_id, fiscal_year)
);

CREATE TABLE revenue_by_country
(
    company_id      BIGSERIAL,
    fiscal_year     BIGSERIAL,
    billing_country VARCHAR(2),
    net_total       DECIMAL(10, 2) NOT NULL DEFAULT 0,
    FOREIGN KEY (fiscal_year, company_id) REFERENCES fiscal_year (fiscal_year, company_id),
    PRIMARY KEY (company_id, fiscal_year, billing_country)
);

CREATE TABLE invoice
(
    hash            BYTEA,
    invoice_date    DATE,
    tax_payable     DECIMAL(10, 2) NOT NULL DEFAULT 0,
    net_total       DECIMAL(10, 2) NOT NULL DEFAULT 0,
    gross_total     DECIMAL(10, 2) NOT NULL DEFAULT 0,
    customer_tax_id VARCHAR(50),
    fiscal_year     BIGSERIAL,
    company_id      BIGSERIAL,
    FOREIGN KEY (customer_tax_id, fiscal_year, company_id) REFERENCES customer_fiscal_year (customer_tax_id, fiscal_year, company_id),
    PRIMARY KEY (hash, company_id, fiscal_year)
);

CREATE TABLE invoice_line
(
    line_id       BIGSERIAL PRIMARY KEY,
    fiscal_year   BIGSERIAL,
    company_id    BIGSERIAL,
    invoice_hash  BYTEA,
    quantity      DECIMAL(10, 2) NOT NULL DEFAULT 0,
    unit_price    DECIMAL(18, 5) NOT NULL DEFAULT 0,
    credit_amount DECIMAL(10, 2) NOT NULL DEFAULT 0,
    debit_amount  DECIMAL(10, 2) NOT NULL DEFAULT 0,
    product_code  VARCHAR(50),
    FOREIGN KEY (product_code, fiscal_year, company_id) REFERENCES product_fiscal_year (product_code, fiscal_year, company_id)
);
