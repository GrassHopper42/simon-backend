# Simon

**S**ales and **I**nventory **M**anagement m**ON**ster

## Description

Simon은 사용자가 판매 및 재고를 관리할 수 있는 서비스입니다.

## Usage

### Project setup

```bash
$ pnpm install
```

### Compile and run the project

```bash
# development
$ pnpm run start

# watch mode
$ pnpm run start:dev

# production mode
$ pnpm run start:prod
```

### Run tests

```bash
# unit tests
$ pnpm run test

# e2e tests
$ pnpm run test:e2e

# test coverage
$ pnpm run test:cov
```

## Architecture

Simon은 다음과 같은 기술을 사용하여 구현되어 있습니다.

- **NestJS**: Node.js 프레임워크로 Simon의 서버를 구현합니다.
- **TypeORM**: TypeScript ORM으로 Simon의 데이터베이스를 구현합니다.
- **PostgreSQL**: Simon의 데이터베이스로 사용합니다.

## Domain

[도메인 위키](https://github.com/GrassHopper42/simon-backend/wiki/Domain)

```mermaid
classDiagram
    class Product {
        +code
        +name
        +price
        +unit
        +capacity
        +specification
        +description
        +isRecoverable
        +optimalStock
        +safetyStock
        +status [판매중, 판매중지]
        +List~Category~ categories
    }

    class Party {
        +code
        +name
        +alias
        +phone
        +address
        +email
        +businessNumber
        +industry
        +List~PartyGroup~ groups
        +type [개인, 업체]
        +role [구매자, 판매자, 양쪽]
    }

    class Staff {
        +name
        +phone
        +role [관리자, 판매자, 재고관리자, 배송담당자]
        +birthDate
        +address
    }

    class Sale {
        +List~SaleItem~ items
        +Party customer
        +Staff seller
        +totalAmount
        +List~Payment~ payments
        +Delivery delivery
        +status
        +generateEstimate()
        +generateReceipt()
        +cancel()
        +return()
    }

    class Estimate {
        +estimateNumber
        +List~EstimateItem~ items
        +estimateDate
        +validUntil
        +totalAmount
        +Party customer
        +Staff seller
        +customerRequest
        +Map additionalInfo
        +convertToSale()
    }

    class Receipt {
        +receiptNumber
        +List~ReceiptItem~ items
        +saleDate
        +totalAmount
        +Party customer
        +DeliveryInfo deliveryInfo
        +Staff seller
        +status [판매접수, 판매완료]
    }

    class SaleItem {
        +Product product
        +quantity
        +price
    }

    class Order {
        +List~OrderItem~ items
        +Party supplier
        +Staff orderer
        +orderDate
        +expectedDate
        +totalAmount
        +status [발주대기, 발주완료, 입고대기, 입고완료]
    }

    class OrderItem {
        +Product product
        +orderQuantity
        +arrivalQuantity
        +price
    }

    class Inventory {
        +Product product
        +quantity
        +location
        +stockTakingDate
        +Staff stockTaker
        +adjustStock()
        +checkSafetyStock()
    }

    class AccountBalance {
        +Party party
        +amount
        +lastModifiedDate
        +type [선수금, 미수금, 선급금, 미지급금]
        +status
    }

    class Transaction {
        +Party party
        +date
        +amount
        +type [판매, 발주, 수금, 지급, 판매취소, 반품]
        +Staff handler
        +note
    }

    class Recovery {
        +Product product
        +Party customer
        +status [회수대기, 회수완료, 분실, 대금지급]
        +recoveryDate
    }

    class Payment {
        +date
        +amount
        +method [현금, 카드, 계좌이체, 기타]
        +Staff handler
    }

    class Delivery {
        +Receipt receipt
        +address
        +status [배송준비, 배송중, 배송완료]
        +Staff deliveryStaff
    }

    class Notification {
        +content
        +date
        +priority [일반, 중요, 긴급]
        +Staff receiver
        +isConfirmed
    }

    class Audit {
        +eventType
        +date
        +Staff user
        +eventDetails
    }

    %% Relationships
    Product "1" --> "*" SaleItem
    Product "1" --> "*" OrderItem
    Product "1" --> "*" Inventory
    Product "*" --> "*" Category

    Party "1" --> "*" Sale
    Party "1" --> "*" Order
    Party "1" --> "*" AccountBalance
    Party "*" --> "*" PartyGroup

    Staff "1" --> "*" Sale
    Staff "1" --> "*" Order
    Staff "1" --> "*" Inventory
    Staff "1" --> "*" Payment
    Staff "1" --> "*" Delivery
    Staff "1" --> "*" Transaction

    Sale "1" --> "*" Payment
    Sale "1" --> "1" Delivery
    Sale "1..*" --> "1" Receipt
    Sale "0..*" --> "1" Estimate

    Order "1" --> "*" OrderItem
    Order "1" --> "1..*" Receive

    AccountBalance "1" --> "*" Transaction

    Delivery "1" --> "1" Receipt

    Recovery --> Product
    Recovery --> Party

    Inventory --> Notification
    AccountBalance --> Notification
```

## ERD

```mermaid
erDiagram
    PRODUCT {
        int id PK
        string code UK
        string name
        int price
        string unit
        string capacity
        string specification
        text description
        boolean is_recoverable
        int optimal_stock
        int safety_stock
        enum status
        timestamp created_at
        timestamp updated_at
    }

    CATEGORY {
        int id PK
        string name
        int parent_id FK
        timestamp created_at
        timestamp updated_at
    }

    PRODUCT_CATEGORY {
        int product_id PK, FK
        int category_id PK, FK
    }

    PARTY {
        int id PK
        string code UK
        string name
        string alias
        string phone
        string address
        string email
        string business_number
        string industry
        enum type
        timestamp created_at
        timestamp updated_at
    }

    PARTY_GROUP {
        int id PK
        string name
        timestamp created_at
        timestamp updated_at
    }

    PARTY_GROUP_MAPPING {
        int party_id PK, FK
        int group_id PK, FK
    }

    STAFF {
        int id PK
        string name
        string phone UK
        enum role
        date birth_date
        string address
        timestamp created_at
        timestamp updated_at
    }

    SALE {
        int id PK
        int customer_id FK
        int seller_id FK
        int total_amount
        enum status
        timestamp created_at
        timestamp updated_at
    }

    SALE_ITEM {
        int id PK
        int sale_id FK
        int product_id FK
        int quantity
        int price
        timestamp created_at
        timestamp updated_at
    }

    ESTIMATE {
        int id PK
        string estimate_number UK
        int customer_id FK
        int seller_id FK
        date estimate_date
        date valid_until
        int total_amount
        text customer_request
        json additional_info
        timestamp created_at
        timestamp updated_at
    }

    ESTIMATE_ITEM {
        int id PK
        int estimate_id FK
        int product_id FK
        int quantity
        int price
        timestamp created_at
        timestamp updated_at
    }

    RECEIPT {
        int id PK
        string receipt_number UK
        int sale_id FK
        int customer_id FK
        int seller_id FK
        date sale_date
        int total_amount
        enum status
        timestamp created_at
        timestamp updated_at
    }

    RECEIPT_ITEM {
        int id PK
        int receipt_id FK
        int product_id FK
        int quantity
        int price
        timestamp created_at
        timestamp updated_at
    }

    INVENTORY {
        int id PK
        int product_id FK
        int quantity
        string location
        date stock_taking_date
        int stock_taker_id FK
        timestamp created_at
        timestamp updated_at
    }

    ORDER {
        int id PK
        int supplier_id FK
        int orderer_id FK
        date order_date
        date expected_date
        int total_amount
        enum status
        timestamp created_at
        timestamp updated_at
    }

    ORDER_ITEM {
        int id PK
        int order_id FK
        int product_id FK
        int order_quantity
        int arrival_quantity
        int price
        timestamp created_at
        timestamp updated_at
    }

    DELIVERY {
        int id PK
        int receipt_id FK
        string address
        enum status
        int delivery_staff_id FK
        timestamp created_at
        timestamp updated_at
    }

    RECOVERY {
        int id PK
        int product_id FK
        int customer_id FK
        enum status
        date recovery_date
        timestamp created_at
        timestamp updated_at
    }

    PAYMENT {
        int id PK
        int receipt_id FK
        int amount
        enum method
        int staff_id FK
        timestamp payment_date
        timestamp created_at
        timestamp updated_at
    }

    ACCOUNT_BALANCE {
        int id PK
        int party_id FK
        int balance
        enum type
        string status
        timestamp last_modified
        timestamp created_at
        timestamp updated_at
    }

    TRANSACTION {
        int id PK
        int party_id FK
        int amount
        enum type
        int staff_id FK
        text note
        timestamp transaction_date
        timestamp created_at
        timestamp updated_at
    }

    NOTIFICATION {
        int id PK
        text content
        enum priority
        int receiver_id FK
        boolean is_confirmed
        timestamp notification_date
        timestamp created_at
        timestamp updated_at
    }

    AUDIT {
        int id PK
        string event
        int user_id FK
        json payload
        timestamp event_date
        timestamp created_at
    }

    PRODUCT ||--o{ PRODUCT_CATEGORY : "belongs to"
    CATEGORY ||--o{ PRODUCT_CATEGORY : "categorizes"
    CATEGORY ||--o{ CATEGORY : "has parent"

    PARTY ||--o{ PARTY_GROUP_MAPPING : "belongs to"
    PARTY_GROUP ||--o{ PARTY_GROUP_MAPPING : "contains"

    SALE ||--o{ SALE_ITEM : "contains"
    SALE ||--|| RECEIPT : "generates"
    SALE }|--|| PARTY : "customer"
    SALE }|--|| STAFF : "seller"

    ESTIMATE ||--o{ ESTIMATE_ITEM : "contains"
    ESTIMATE }|--|| PARTY : "customer"
    ESTIMATE }|--|| STAFF : "seller"

    RECEIPT ||--o{ RECEIPT_ITEM : "contains"
    RECEIPT ||--o{ PAYMENT : "receives"
    RECEIPT ||--|| DELIVERY : "has"

    ORDER ||--o{ ORDER_ITEM : "contains"
    ORDER }|--|| PARTY : "supplier"
    ORDER }|--|| STAFF : "orderer"

    ACCOUNT_BALANCE }|--|| PARTY : "belongs to"
    TRANSACTION }|--|| PARTY : "involves"

    INVENTORY }|--|| PRODUCT : "stocks"
    RECOVERY }|--|| PRODUCT : "recovers"
```
