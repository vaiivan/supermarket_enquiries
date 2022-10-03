create table markets(
    id serial PRIMARY KEY,
    market_name text,
    created_at TIMESTAMP,  
    updated_at TIMESTAMP
);

create table market_locations(
    id serial PRIMARY KEY,
    market_id int,
    location text,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    foreign key (market_id) references markets(id)
);

create table users(
    id serial PRIMARY KEY,
    username varchar(255) NOT NULL,
    password text not null,
    email varchar(255) UNIQUE NOT NULL,
    location text,
    created_at TIMESTAMP,
    updated_at timestamp
);

create table products(
    id serial PRIMARY KEY,
    product_name text NOT NULL,
    description text NOT NULL,
    brand TEXT not null,
    image text not null,
    created_at TIMESTAMP,
    updated_at TIMESTAMP
);


create table categories(
    id serial PRIMARY KEY,
    category_name text,
    product_id int,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

create table price(
    id serial PRIMARY KEY,
    product_id int,
    market_id int,
    category_id int,
    price decimal,
    FOREIGN KEY (product_id) REFERENCES products(id),
    FOREIGN KEY (market_id) REFERENCES markets(id),
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

create table favourite (
    id serial PRIMARY KEY,
    user_id int,
    product_id int,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    foreign key (user_id) references users(id),
    foreign key (product_id) references products(id)
);


--drop
drop table favourite; 
drop table price; 
drop table categories;
drop table products;
drop table users;
drop table market_locations;
drop table markets;



select raw_data_PK.brand, raw_data_PK.product_name, raw_data_PK.description,raw_data_PK.price, 
raw_data_zstore.price from raw_data_pk inner join raw_data_zstore ON raw_data_PK.brand = raw_data_zstore.brand 
Where raw_data_PK.description = raw_data_zstore.description and raw_data_PK.product_name = raw_data_zstore.product_name;

select raw_data_PK.brand, raw_data_PK.product_name,raw_data_PK.price, 
raw_data_Aeon.price, raw_data_zstore.price from raw_data_pk inner join 
raw_data_zstore ON raw_data_PK.brand = raw_data_zstore.brand inner join raw_data_Aeon ON raw_data_zstore.brand = raw_data_Aeon.brand 
where raw_data_PK.description = raw_data_zstore.description and raw_data_zstore.description = raw_data_aeon.description
and raw_data_PK.product_name = raw_data_zstore.product_name and raw_data_zstore.product_name = raw_data_aeon.product_name;

select raw_data_PK.brand, raw_data_PK.product_name,raw_data_pk.description, raw_data_PK.price, 
raw_data_aeon.price from raw_data_pk inner join raw_data_aeon ON raw_data_PK.brand = raw_data_aeon.brand 
Where raw_data_PK.description = raw_data_aeon.description and raw_data_PK.product_name = raw_data_aeon.product_name;

Insert INTO markets (market_name, created_at, updated_at) values ('PK', now(), now());
Insert INTO markets (market_name, created_at, updated_at) values ('Zstore', now(), now());
Insert INTO markets (market_name, created_at, updated_at) values ('Aeon', now(), now());

drop table favourite;

SELECT * from (select product_name, description, price, market_name, brand_name from products inner join forjoining on products.id = forjoining.product_id 
inner join brands on forjoining.brand_id = brands.id 
inner join categories on forjoining.category_id = categories.id 
inner join markets on markets.id = forjoining.market_id where market_name = 'PK')as pk_joined

SELECT * from (select product_name, description, price, market_name, brand_name from products inner join forjoining on products.id = forjoining.product_id 
inner join brands on forjoining.brand_id = brands.id 
inner join categories on forjoining.category_id = categories.id 
inner join markets on markets.id = forjoining.market_id where market_name = 'Zstore')as zstore_joined

SELECT * from (select product_name, description, price, market_name, brand_name from products inner join forjoining on products.id = forjoining.product_id 
inner join brands on forjoining.brand_id = brands.id 
inner join categories on forjoining.category_id = categories.id 
inner join markets on markets.id = forjoining.market_id where market_name = 'Aeon')as aeon_joined

SELECT * from (SELECT * from (select product_name, description, price, market_name, brand_name from products inner join forjoining on products.id = forjoining.product_id 
inner join brands on forjoining.brand_id = brands.id 
inner join categories on forjoining.category_id = categories.id 
inner join markets on markets.id = forjoining.market_id where market_name = 'PK')as pk_joined) inner join zstore_joined on pk_joined.product_name = zstore_joined.product_name 
and pk_joined.description = zstore_joined.description and pk_joined.brand_name = zstore_joined.brand_name


 group by product_name, description, market_name, brand_name;




where brand_name = '可口可樂'



select * from products inner join forjoining on products.id = forjoining.product_id WHere brand_id = 9;

select * from categories where category_name = 'drinks';

select product_name from products inner join forjoining on products.id = forjoining.product_id inner join categories on forjoining.category_id = categories.id where category_name = 'drinks' order by product_name;
select product_name,brand_name,price,market_name from products inner join forjoining on products.id = forjoining.product_id inner join brands on forjoining.brand_id = brands.id inner join categories on forjoining.category_id = categories.id inner join markets on forjoining.market_id = markets.id where category_name = 'drinks' order by product_name;
select * from brands where brand_name = '可口可樂';