BEGIN;

DROP TABLE IF EXISTS orderDetails,images,orders, cart,users, courses, products, category ;

CREATE TABLE users (
   id SERIAL PRIMARY KEY,
   userName VARCHAR(255) NOT NULL,
   userPassword VARCHAR(255) NOT NULL,
   email VARCHAR(255) UNIQUE NOT NULL,
   address varchar(255) NOT NULL,
   postalcode varchar(255) NOT NULL
);

CREATE TABLE courses (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   description TEXT,
   price INTEGER NOT NULL,
   participantsnumber INTEGER NOT NULL,
   age TEXT NOT NULL,
   date DATE,
   photo Text NOT NULL
);

CREATE TABLE category (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL UNIQUE
);

 
CREATE TABLE products (
   id SERIAL PRIMARY KEY,
   name VARCHAR(255) NOT NULL,
   description TEXT,
   price INTEGER NOT NULL,
   category_id INTEGER REFERENCES category(id)
);
CREATE TABLE images(
   image_id SERIAL PRIMARY KEY,
   product_id INTEGER REFERENCES products(id)
);

-- Assuming cart is a many-to-many relationship between users and products
CREATE TABLE cart (
   user_id INTEGER REFERENCES users(id),
   product_id INTEGER REFERENCES products(id),
   quantity INTEGER NOT NULL ,
   PRIMARY KEY (user_id , product_id )
);
-- Assuming orders is a collection of products purchased by a user
CREATE TABLE orders (
   id SERIAL PRIMARY KEY,
   user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
   status VARCHAR(50) DEFAULT 'pending' -- e.g., pending, completed, cancelled
);
CREATE TABLE orderDetails(
product_id INTEGER REFERENCES products(id),
order_id INTEGER REFERENCES orders(id),
quantity INTEGER,
PRIMARY KEY (product_id , order_id)
);
INSERT INTO category(name) VALUES('Candles') ;
INSERT INTO category(name)  VALUES('Paint Art') ;

INSERT INTO courses(name , description , price , participantsnumber , age , date, photo) values('Kids Art','its a 7-lesson course that introduces children to
 the basics of drawing in a fun and simple way,
 nurturing their creativity and confidence.',250,10,'"6-16','2024-03-15','/Imgs/corsesImg/kidsArt.JPG');
INSERT INTO courses(name , description , price , participantsnumber , age , date , photo) values('Art Mastery for Adults','its a 12-lesson course that offers a deep dive into art for
 beginners and enthusiasts alike. Perfect your skills, explore various mediums,
  and unlock your creativity in a series of engaging sessions.',550,15,'17+','2024-03-10','/Imgs/corsesImg/adult-art.jpg');
INSERT INTO courses(name , description , price , participantsnumber , age ,date , photo) values('Candle Crafting Workshop','Ignite your creativity with our hands-on candle making session. 
Learn to craft your own scented candles in this cozy,
 illuminating experience.',250,5,'15+',null ,'/Imgs/corsesImg/candles_workshop.jpeg');
 
INSERT INTO products(name , description , price , category_id) Values('set of candels','size: 30*40 color: white or pink 3 candels',80,1);
INSERT INTO products(name , description , price , category_id) Values('square candels','size: 40*40 color: white',30,1);
INSERT INTO products(name , description , price , category_id) Values('set square and cloud candels','size: 40*40 color: white 3 pieces',120,1);
INSERT INTO products(name , description , price , category_id) Values('square','size: 40*40 color: red ',30,1);
INSERT INTO products(name , description , price , category_id) Values('Coffe candel','size: 40*45 color: white and brown ',40,1);
INSERT INTO products(name , description , price , category_id) Values('green and white ','size: 40*45 color: green and white square',40,1);
INSERT INTO products(name , description , price , category_id) Values('Basic candel ','size: 40*45 color: black and white ',40,1);
INSERT INTO products(name , description , price , category_id) Values('white coffe candel ','size: 40*45 color: white candels ',40,1);
INSERT INTO products(name , description , price , category_id) Values('set of tree candels ','size: 40*45 color: white , pink , green  ',120,1);
INSERT INTO products(name , description , price , category_id) Values('set of Clouds','size: 30*30 40*40 30*40  color: white',80 ,1);
INSERT INTO products(name , description , price , category_id) Values('cat and square set ','size: 30*30 40*40 30*40 50*50  color: white and green ',120 ,1);
INSERT INTO products(name , description , price , category_id) Values('head skull ','size: 40*40  color: white',40 ,1);
INSERT INTO products(name , description , price , category_id) Values('green tree ','size: 40*40  color: Green ',40 ,1); 
INSERT INTO products(name , description , price , category_id) Values('green tree ','size: 40*40  color: Green ',40 ,1); 
INSERT INTO products(name , description , price , category_id) Values('set of mini squares ','size: 20*20  color: white ',60 ,1); 
INSERT INTO products(name , description , price , category_id) Values('set of mini squares ','size: 20*20  color: white ',60 ,1); 
INSERT INTO products(name , description , price , category_id) Values('set of bear and square ','size: 20*20 30*40 30*30  color: pink ',80 ,1); 
INSERT INTO products(name , description , price , category_id) Values('set of squares ','size: 20*20 30*40 30*30  color: green ',80 ,1); 
INSERT INTO products(name , description , price , category_id) Values('cat and square set ','size: 30*30 40*40 30*40 50*50  color: white and pink ',120 ,1);
INSERT INTO products(name , description , price , category_id) Values('big set of mini squares ','size: 20*20  color: white 100  pieces - there is a option to choose name ',400 ,1); 
INSERT INTO images(product_id) Values (1);
INSERT INTO images(product_id) Values (1);
INSERT INTO images(product_id) Values (2);
INSERT INTO images(product_id) Values (2);
INSERT INTO images(product_id) Values (2);
INSERT INTO images(product_id) Values (2);
INSERT INTO images(product_id) Values (2);
INSERT INTO images(product_id) Values (3);
INSERT INTO images(product_id) Values (4);
INSERT INTO images(product_id) Values (5);
INSERT INTO images(product_id) Values (5);
INSERT INTO images(product_id) Values (5);
INSERT INTO images(product_id) Values (6);
INSERT INTO images(product_id) Values (7);
INSERT INTO images(product_id) Values (8);
INSERT INTO images(product_id) Values (9);
INSERT INTO images(product_id) Values (9);
INSERT INTO images(product_id) Values (10);
INSERT INTO images(product_id) Values (11);
INSERT INTO images(product_id) Values (12);
INSERT INTO images(product_id) Values (12);
INSERT INTO images(product_id) Values (13);
INSERT INTO images(product_id) Values (13);
INSERT INTO images(product_id) Values (14);
INSERT INTO images(product_id) Values (14);
INSERT INTO images(product_id) Values (15);
INSERT INTO images(product_id) Values (16);
INSERT INTO images(product_id) Values (17);
INSERT INTO images(product_id) Values (18);
INSERT INTO images(product_id) Values (19);
INSERT INTO images(product_id) Values (19);
INSERT INTO images(product_id) Values (19);
insert into users (userName , userPassword , email , address ,postalcode)Values ('yosra' ,'$2a$12$4FbkNct.W4aNHwMcsRY.4uCe3Iu4jYilq6GwTFVgM7/aVzS0ZpMZa' , 'yosra@gmail.com','Nazareth','1234567');
insert into users (userName , userPassword , email, address ,postalcode)Values('sana' ,'$2a$12$jxsFRniwEsux.i00xsUiDOSEeETT2HNVeExzi9cYveswISAnwFIu.','sana@gmail.com','peqiin','2491400');
insert into orders (user_id,status)Values(2,'completed');
insert into orders (user_id,status)Values(2,'cancelled');
insert into orders (user_id,status)Values(2,'pending');
INSERT INTO orderDetails(product_id,order_id,quantity)VALUES(10,3,1);
INSERT INTO orderDetails(product_id,order_id,quantity)VALUES(5,3,10);
INSERT INTO orderDetails(product_id,order_id,quantity)VALUES(1,2,4);
INSERT INTO orderDetails(product_id,order_id,quantity)VALUES(2,1,6);
INSERT INTO orderDetails(product_id,order_id,quantity)VALUES(7,1,7);


INSERT INTO products(name , description , price , category_id) Values('Surah Al-Tawba verse 40 ','size:40*40 , color:Black and White ',50 ,2);
INSERT INTO products(name , description , price , category_id) Values('Name of allah','size:70*50 , color:white and red  ',50 ,2);

INSERT INTO products(name , description , price , category_id) Values('verse 12 from Surah al Haka','size:70*50 , color:white and Black  ',60  ,2);

INSERT INTO products(name , description , price , category_id) Values('verse from Surah al Anfal','size:70*50 , color:white and red  ',60  ,2);

INSERT INTO products(name , description , price , category_id) Values('Allah names handwriting ','size:120*100 , color:white and red and beje  ',200  ,2);

INSERT INTO products(name , description , price , category_id) Values('verse from Surah al Haka','size:70*50 , color:white and red  ',60  ,2);
INSERT INTO products(name , description , price , category_id) Values('verse from Surah Taha','size:70*50 , color:white and black , yellow ',60  ,2);
INSERT INTO products(name , description , price , category_id) Values('Surah elAser','size:70*70 , color:white and black  ',60  ,2);
INSERT INTO products(name , description , price , category_id) Values('verse from Surah Taha','size:70*50 , color:white and black ',70  ,2);
INSERT INTO products(name , description , price , category_id) Values('verse from aladeyat','size:60*50 , color:white and black ',60  ,2);
INSERT INTO products(name , description , price , category_id) Values('verse from alkdr','size:60*60 , color:white and black ',65  ,2);
INSERT INTO products(name , description , price , category_id) Values('verse from alzmar','size:60*60 , color:black and yellow ',65  ,2);
INSERT INTO products(name , description , price , category_id) Values('special verse','size:50*60 , color:black and white ',65  ,2);
INSERT INTO products(name , description , price , category_id) Values('Happy heart','size:70*60 , color:black , white and red ',65  ,2);
INSERT INTO products(name , description , price , category_id) Values('verse from elduha','size:70*60 , color:black , white and red ',65  ,2);
INSERT INTO products(name , description , price , category_id) Values('verse from Alfateha','size:70*70 , color:white and black ',65  ,2);
INSERT INTO products(name , description , price , category_id) Values('arabic art','size:50*60 , color:white , red and black ',65  ,2);
INSERT INTO products(name , description , price , category_id) Values('verse from surah Yousef','size:50*50 , color:white and black ',50  ,2);

INSERT INTO images(product_id) Values (20);
INSERT INTO images(product_id) Values (21);
INSERT INTO images(product_id) Values (22);
INSERT INTO images(product_id) Values (22);
INSERT INTO images(product_id) Values (22);
INSERT INTO images(product_id) Values (22);
INSERT INTO images(product_id) Values (23);
INSERT INTO images(product_id) Values (24);
INSERT INTO images(product_id) Values (24);
INSERT INTO images(product_id) Values (24);
INSERT INTO images(product_id) Values (24);
INSERT INTO images(product_id) Values (25);
INSERT INTO images(product_id) Values (26);
INSERT INTO images(product_id) Values (27);
INSERT INTO images(product_id) Values (28);
INSERT INTO images(product_id) Values (29);
INSERT INTO images(product_id) Values (30);
INSERT INTO images(product_id) Values (31);
INSERT INTO images(product_id) Values (32);
INSERT INTO images(product_id) Values (33);
INSERT INTO images(product_id) Values (34);
INSERT INTO images(product_id) Values (35);
INSERT INTO images(product_id) Values (36);
INSERT INTO images(product_id) Values (37);
INSERT INTO images(product_id) Values (38);


COMMIT;
