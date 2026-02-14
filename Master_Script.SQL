INSERT INTO department_master (department_name)
VALUES ('IT'), ('HR'), ('Marketin');

INSERT INTO location_master (location_name)
VALUES ('Chennai'), ('Bangalore'), ('Hyderabad');

INSERT INTO category_master (category_name, sort_order)
VALUES ('IT', 1);

INSERT INTO category_master (category_name, sort_order)
VALUES ('node', 2);

INSERT INTO asset_track_type_master (track_type, sort_order)
VALUES ('Bulk', 1),('Unique', 2);