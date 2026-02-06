
const { Client } = require('pg');
const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());


app.use(express.json());

// PostgreSQL connection
const con = new Client({
  host: 'localhost',
  user: 'postgres',
  port: 5432,
  password: 'P23',
  database: 'task'
});

con.connect().then(() => console.log('connected'));

//  POST – Insert employee
app.post('/employee', (req, res) => {
  const {
    employee_name,
    mobile,
    email,
    department_id,
    location_id,
    sort_order
  } = req.body;

  const insert_query = `
    INSERT INTO employee
    (employee_name, mobile, email, department_id, location_id, sort_order)
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *;
  `;

  con.query(
    insert_query,
    [employee_name, mobile, email, department_id, location_id, sort_order],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err.message);
      }
      console.log('POSTED');
      res.status(201).json(result.rows[0]);
    }
  );
});

// GET – Fetch all employees
app.get('/employee', (req, res) => {
  con.query('SELECT * FROM employee', (err, result) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    res.json(result.rows);
  });
});

app.put('/employee/:id', (req, res) => {

  const id = req.params.id;

  const {
    employee_name,
    mobile,
    email,
    department_id,
    location_id,
    sort_order,
    status
  } = req.body;

  const update_query = `
    UPDATE employee SET
      employee_name = $1,
      mobile = $2,
      email = $3,
      department_id = $4,
      location_id = $5,
      sort_order = $6,
      status = $7
    WHERE employee_id = $8
    RETURNING *;
  `;

  con.query(
    update_query,
    [
      employee_name,
      mobile,
      email,
      department_id,
      location_id,
      sort_order,
      status,
      id
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json(err.message);
      }

      res.json(result.rows[0]);
    }
  );

});

app.delete('/employee/:id',(req,res)=>{
    const id=req.params.id
    const delete_query='delete from employee where employee_id=$1'
    con.query(delete_query,[id],(err,result)=>{
            if(err)
        {
            res.send(err)
        }else{
            
            res.send(result.rows)
        }
    })

})

//TASK 3

app.post('/asset', (req, res) => {
  const {
    category_id,
    asset_name,
    brand,
    model,
    track_type,
    connection_type,
    total_quantity
  } = req.body;

  if (
    category_id == null ||
    !asset_name ||
    !track_type ||
    total_quantity == null
  ) {
    return res.status(400).json({ message: "Required fields missing" });
  }

  if (track_type === 'Unique' && total_quantity !== 1) {
    return res.status(400).json({
      message: "Unique asset quantity must be 1"
    });
  }

  if (track_type === 'Bulk' && total_quantity <= 1) {
    return res.status(400).json({
      message: "Bulk asset quantity must be greater than 1"
    });
  }

  const insert_query = `
    INSERT INTO asset_master
    (category_id, asset_name, brand, model, track_type, connection_type, total_quantity)
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *;
  `;

  con.query(
    insert_query,
    [category_id, asset_name, brand, model, track_type, connection_type, total_quantity],
    (err, result) => {
      if (err) {
        console.error("DB ERROR ", err.message);
        return res.status(500).json({ message: err.message });
      }

      res.status(201).json({
        message: "Asset added successfully",
        data: result.rows[0]
      });
    }
  );
});


app.get('/asset',(req,res)=>{
    con.query('SELECT * FROM asset_master', (err, result) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    res.json(result.rows);
  });

})

app.put('/asset/:id', (req, res) => {
  const id = req.params.id;
  const {
    category_id,
    asset_name,
    brand,
    model,
    track_type,
    connection_type,
    total_quantity,
    status
  } = req.body;

  const query = `
    UPDATE asset_master SET
      category_id=$1,
      asset_name=$2,
      brand=$3,
      model=$4,
      track_type=$5,
      connection_type=$6,
      total_quantity=$7,
      status=$8
    WHERE asset_id=$9
    RETURNING *;
  `;

  con.query(
    query,
    [category_id, asset_name, brand, model, track_type, connection_type, total_quantity, status, id],
    (err, result) => {
      if (err) return res.status(400).json(err.message);
      res.json(result.rows[0]);
    }
  );
});


app.listen(3001, () => {
  console.log('server is running');
});

