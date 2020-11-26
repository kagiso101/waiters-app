create table waiters
(
    id serial not null primary key,
    name text not null

);
create table days
(
    id serial not null primary key,
    day text not null
);

create table shifts
(
    id serial not null primary key,
    days_selected int,
    waiter_id int,
    foreign key (days_selected) references days(id),
    foreign key (waiter_id) references waiters(id)

);
insert into days
    (day)
values
    ('Monday');
insert into days
    (day)
values
    ('Tuesday');
insert into days
    (day)
values
    ('Wednesday');
insert into days
    (day)
values
    ('Thursday');
insert into days
    (day)
values
    ('Friday');
insert into days
    (day)
values
    ('Saturday');
insert into days
    (day)
values
    ('Sunday');


