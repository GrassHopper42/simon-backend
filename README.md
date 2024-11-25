# Simon

**S**ales and **I**nventory **M**anagement m**ON**ster

## Description

Simon은 사용자가 판매 및 재고를 관리할 수 있는 판매 및 재고 관리 시스템입니다.

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

Simon은 다음과 같은 도메인을 가지고 있습니다.

### Product(제품)

제품은 사용자가 판매할 수 있는 상품이다.

제품은 카테고리로 분류할 수 있다. 카테고리는 제품을 분류하는 기준이다. 하나의 제품은 여러 카테고리에 속할 수 있다. 카테고리는 상위 카테고리를 가질 수 있다.

제품은 생산자 혹은 판매자로부터 구매할 수 있다.

### Staff(직원)

직원은 판매 및 재고 관리를 담당하는 사용자이다.

### Sale(판매)

판매는 사용자가 제품을 판매하는 행위이다. 판매에는 견적서와 영수증이 있다.

견적서는 판매를 예약하는 문서이다. 영수증은 판매를 완료하는 문서이다.

여러 견적서를 하나의 영수증으로 묶어 판매를 완료할 수 있다.

### Inventory(재고)

재고는 사용자가 보유하고 있는 제품의 수량이다. 재고는 제품의 수량과 위치를 가지고 있다. 위치는 제품이 보관되는 장소이다. 장소는 상위 장소를 가질 수 있다.

재고는 발주에 의해 증가하거나 판매에 의해 감소할 수 있다.

### Order(발주)

발주는 사용자가 제품을 구매하는 행위이다.

### Receive(입고)

입고는 사용자가 제품을 재고에 추가하는 행위이다.

발주서를 바탕으로 도착 수량을 입력하여 제품을 재고에 추가할 수 있다.

### Delivery(배송)

배송은 사용자가 제품을 판매하는 고객에게 전달하는 행위이다.

### Party(거래처)

거래처는 사용자가 제품을 구매하는 생산자 혹은 판매자이다.

### Recovery(회수)

회수는 고객으로부터 사용된 제품을 회수하는 행위이다.

제품을 회수대상 제품으로 지정할 수 있으며, 회수대상 제품은 판매가 되면 자동으로 리스트에 추가된다.

### Report(보고서)

보고서는 사용자가 판매 및 재고 관리에 대한 정보를 확인할 수 있는 문서이다.
