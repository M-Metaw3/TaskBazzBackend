const Role = require('../../models/rolesModel');
const Permission = require('../../models/permissions');

// Controller for creating a new role
exports.createRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const newRole = new Role({ name, permissions });
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controller for getting all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for getting a role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(role);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for updating a role by ID
exports.updateRoleById = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const updatedRole = await Role.findByIdAndUpdate(req.params.id, { name, permissions }, { new: true });
    if (!updatedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json(updatedRole);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controller for deleting a role by ID
exports.deleteRoleById = async (req, res) => {
  try {
    const deletedRole = await Role.findByIdAndDelete(req.params.id);
    if (!deletedRole) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controller for creating a new permission
exports.createPermission = async (req, res) => {
  try {

    const { name, description,method } = req.body;
    const newPermission = new Permission({ name, description,method });
    await newPermission.save();
    res.status(201).json(newPermission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controller for getting all permissions
exports.getAllPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.json(permissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for getting a permission by ID
exports.getPermissionById = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    res.json(permission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Controller for updating a permission by ID
exports.updatePermissionById = async (req, res) => {
  try {
    const { name, description } = req.body;
    const updatedPermission = await Permission.findByIdAndUpdate(req.params.id, { name, description }, { new: true });
    if (!updatedPermission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    res.json(updatedPermission);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Controller for deleting a permission by ID
exports.deletePermissionById = async (req, res) => {
  try {
    const deletedPermission = await Permission.findByIdAndDelete(req.params.id);
    if (!deletedPermission) {
      return res.status(404).json({ message: 'Permission not found' });
    }
    res.json({ message: 'Permission deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
