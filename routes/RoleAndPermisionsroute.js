const express = require('express');
const router = express.Router();

const permissionandrolesController = require('../controllers/roles&&permisionsController/rolesandpermissionscontroller');

// Role routes
router.post('/roles', permissionandrolesController.createRole);
router.get('/roles', permissionandrolesController.getAllRoles);
router.get('/roles/:id', permissionandrolesController.getRoleById);
router.put('/roles/:id', permissionandrolesController.updateRoleById);
router.delete('/roles/:id', permissionandrolesController.deleteRoleById);

// Permission routes
router.post('/permissions', permissionandrolesController.createPermission);
router.get('/permissions', permissionandrolesController.getAllPermissions);
router.get('/permissions/:id', permissionandrolesController.getPermissionById);
router.put('/permissions/:id', permissionandrolesController.updatePermissionById);
router.delete('/permissions/:id', permissionandrolesController.deletePermissionById);

module.exports = router;
