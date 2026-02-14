const express = require('express');
const cors = require('cors');
const sequelize = require('./db');

const Department = require('./models/Department');
const Location_Master = require('./models/Location_Master');
const Category_Master = require('./models/Category_Master');
const Asset_Track_Type_Master = require('./models/Asset_Track_Type_Master');
const Employee = require('./models/Employee');
const Asset = require('./models/Asset');
const AssetAllocation = require('./models/AssetAllocation');



const app = express();

app.use(cors());
app.use(express.json());

/* ==============================
   Associations (Like JPA)
============================== */
// Employee.hasMany(AssetAllocation, { foreignKey: 'employee_id' });
// Asset.hasMany(AssetAllocation, { foreignKey: 'asset_id' });
// Employee.hasMany(AssetAllocation, { foreignKey: 'employee_id' });
// AssetAllocation.belongsTo(Employee, { foreignKey: 'employee_id' });

// Asset.hasMany(AssetAllocation, { foreignKey: 'asset_id' });
// AssetAllocation.belongsTo(Asset, { foreignKey: 'asset_id' });
Employee.hasMany(AssetAllocation, { foreignKey: "employee_id" });
AssetAllocation.belongsTo(Employee, { foreignKey: "employee_id" });

Asset.hasMany(AssetAllocation, { foreignKey: "asset_id" });
AssetAllocation.belongsTo(Asset, { foreignKey: "asset_id" })
/* ==============================
   Sync Database
============================== */

sequelize.sync()
  .then(() => console.log('Tables synced'))
  .catch(err => console.log(err));

/* ==============================
   EMPLOYEE APIs
============================== */

// Create Employee
app.post('/employee', async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get All Employees
app.get('/employee', async (req, res) => {
  const employees = await Employee.findAll();
  res.json(employees);
});

// Update Employee
app.put('/employee/:id', async (req, res) => {
  await Employee.update(req.body, {
    where: { employee_id: req.params.id }
  });
  const updated = await Employee.findByPk(req.params.id);
  res.json(updated);
});

// Delete Employee
app.delete('/employee/:id', async (req, res) => {
  await Employee.destroy({
    where: { employee_id: req.params.id }
  });
  res.json({ message: 'Deleted Successfully' });
});


/* ==============================
   ASSET APIs
============================== */

// Create Asset
app.post('/asset', async (req, res) => {
  const { track_type, total_quantity } = req.body;

  if (track_type === 'Unique' && total_quantity !== 1)
    return res.status(400).json({ message: 'Unique asset quantity must be 1' });

  if (track_type === 'Bulk' && total_quantity <= 1)
    return res.status(400).json({ message: 'Bulk asset quantity must be greater than 1' });

  try {
    const asset = await Asset.create(req.body);
    res.status(201).json(asset);
  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get All Assets
app.get('/asset', async (req, res) => {
  const assets = await Asset.findAll();
  res.json(assets);
});

// Update Asset
app.put('/asset/:id', async (req, res) => {
  await Asset.update(req.body, {
    where: { asset_id: req.params.id }
  });
  const updated = await Asset.findByPk(req.params.id);
  res.json(updated);
});


/* ==============================
   ASSET ALLOCATION
============================== */

app.post('/asset-allocation', async (req, res) => {
  const { employee_id, asset_id, allocated_quantity } = req.body;

  try {
    const employee = await Employee.findByPk(employee_id);
    if (!employee)
      return res.status(400).json({ message: 'Employee not found' });

    const asset = await Asset.findByPk(asset_id);
    if (!asset)
      return res.status(400).json({ message: 'Asset not found' });

    const allocated = await AssetAllocation.sum('allocated_quantity', {
      where: { asset_id }
    }) || 0;

    const remaining = asset.total_quantity - allocated;

    if (asset.track_type === 'Unique') {
      if (allocated > 0)
        return res.status(400).json({ message: 'Unique asset already allocated' });

      if (allocated_quantity !== 1)
        return res.status(400).json({ message: 'Quantity must be 1' });
    }

    if (asset.track_type === 'Bulk') {
      if (allocated_quantity > remaining)
        return res.status(400).json({ message: `Only ${remaining} available` });
    }

    const allocation = await AssetAllocation.create({
      employee_id,
      asset_id,
      allocated_quantity
    });

    res.status(201).json({
      message: 'Asset allocated successfully',
      data: allocation
    });

  } catch (err) {
    res.status(500).json(err.message);
  }
});

// Get Allocation List (JOIN)
app.get("/asset-allocation", async (req, res) => {
  const data = await AssetAllocation.findAll({
    include: [
      {
        model: Employee,
        attributes: ["employee_name"]
      },
      {
        model: Asset,
        attributes: ["asset_name"]
      }
    ]
  });

  const formatted = data.map(a => ({
    allocation_id: a.allocation_id,
    employee_id: a.employee_id,
    asset_id: a.asset_id,
    allocated_quantity: a.allocated_quantity,
    employee_name: a.Employee?.employee_name,
    asset_name: a.Asset?.asset_name
  }));

  res.json(formatted);
});






/* ==============================
   START SERVER
============================== */

app.listen(3001, () => {
  console.log('Server running on port 3001');
});
