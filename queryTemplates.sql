## for MySQL Workbench
select re.id, be.name, br.name, rating, description, us.name, re.date from reviews re 
join beers be on be.id = re.beer_id
join users us on us.id = re.user_id
join breweries br on br.id = be.brewery_id;

select * from reviews;
select * from breweries;
select * from beers;