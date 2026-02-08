
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

// TASK 4 - Asset Allocation

// POST – Allocate asset to employee
app.post('/asset-allocation', async (req, res) => {
  const { employee_id, asset_id, allocated_quantity } = req.body;

  try {
    // check employee
    const emp = await con.query(
      'SELECT * FROM employee WHERE employee_id=$1',
      [employee_id]
    );
    if (emp.rows.length === 0) {
      return res.status(400).json({ message: 'Employee not found' });
    }

    // check asset
    const assetRes = await con.query(
      'SELECT * FROM asset_master WHERE asset_id=$1',
      [asset_id]
    );
    if (assetRes.rows.length === 0) {
      return res.status(400).json({ message: 'Asset not found' });
    }

    const asset = assetRes.rows[0];

    // already allocated quantity
    const allocatedRes = await con.query(
      `SELECT COALESCE(SUM(allocated_quantity),0) AS allocated
       FROM asset_allocation
       WHERE asset_id=$1`,
      [asset_id]
    );

    const allocated = Number(allocatedRes.rows[0].allocated);
    const remaining = asset.total_quantity - allocated;

    // business rules
    if (asset.track_type === 'Unique') {
      if (allocated > 0) {
        return res.status(400).json({ message: 'Unique asset already allocated' });
      }
      if (allocated_quantity !== 1) {
        return res.status(400).json({ message: 'Quantity must be 1' });
      }
    }

    if (asset.track_type === 'Bulk') {
      if (allocated_quantity > remaining) {
        return res.status(400).json({
          message: `Only ${remaining} quantity available`
        });
      }
    }

    // insert allocation
    const insert_query = `
      INSERT INTO asset_allocation
      (employee_id, asset_id, allocated_quantity)
      VALUES ($1,$2,$3)
      RETURNING *;
    `;

    const result = await con.query(insert_query, [
      employee_id,
      asset_id,
      allocated_quantity
    ]);

    res.status(201).json({
      message: 'Asset allocated successfully',
      data: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err.message);
  }
});


// GET – Allocation List
app.get('/asset-allocation', (req, res) => {
  const query = `
    SELECT 
      e.employee_name,
      a.asset_name,
      a.track_type,
      al.allocated_quantity,
      al.allocated_date
    FROM asset_allocation al
    JOIN employee e ON e.employee_id = al.employee_id
    JOIN asset_master a ON a.asset_id = al.asset_id
  `;

  con.query(query, (err, result) => {
    if (err) {
      return res.status(500).json(err.message);
    }
    res.json(result.rows);
  });
});

app.listen(3001, () => {
  console.log('server is running');
});

