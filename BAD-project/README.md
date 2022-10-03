需要安裝

- yarn init -y

-------yarn add-----------
- ts-node @types/node typescript express @types/express express-session @types/express-session
- --save-dev --save-exact prettier
- winston
- formidable @types/formidable
- pg @types/pg dotenv
- xlsx
- socket.io
- bcryptjs @types/bcryptjs
- cross-fetch
- sweetalert2
- moment --save
- nodemailer @types/nodemailer

----------就咁直接行ok----------------
- yarn add --dev jest
- yarn add --dev typescript ts-jest @types/jest @types/node ts-node ts-node-dev
- yarn ts-jest config:init
- yarn add knex  pg @types/pg
- yarn knex init -x ts

----------Sherry Li語錄----------------
1. 可以將d routes同個function分開，咁樣搵routes會容易d，而且會整齊好多
2. 千奇千奇唔好瘋狂起table，一定唔好d user做d野就起table（寧願join table）
3. backend儘量避免redirect，send json既message比front end然後front end搞會比較好
4. d routes起名最好只用noun，然後用get、post、patch、put、delete去分功能
5. 所有variable同function既名儘量起詳細d，例如一個function要拎user 既資料，就叫getUserInfo（），方便自己睇

6. 事不過三，如果不停重複，就整一個function
7. Psql 下次要同樣既id要落foreign key
8. 可以儘量多d join table依賴psql，唔需要自製table
9. 一個function唔好包太多野，儘量拆分，要果d野先call果條function

----------sql link----------------
- https://drawsql.app/wsp-project/diagrams/price#

----------OpenCV Alex demo----------------
https://colab.research.google.com/drive/1URxEhWmFSuV4JJfTMJb1QCu0Ar0DJdnG?usp=sharing