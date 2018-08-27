'use strict';

app.service('UsersService', function () {

	var _users = [];
	var _filters = [
		{icon: 'src/images/icons/ico-all-users.png',  label: 'All Users',      field: 'none'},
		{icon: 'src/images/icons/ico-favorite.png',   label: 'Favorites',      field: 'isFavourite'},
		{icon: 'src/images/icons/ico-admin.png',      label: 'Administrators', field: 'isAdmin'},
		{icon: 'src/images/icons/ico-non-admins.png', label: 'Non-Admins',     field: 'isNonAdmin'},
		{icon: 'src/images/icons/ico-archive.png',    label: 'Archived',       field: 'isArchieved'}
	];

	function loadUsers() {
		// Should ideally be loading the info from server, using $http or $resource
		_users = [
			{id: 1, profile: 'src/images/icons/img-user.jpeg', firstname: 'Suzy',  lastname: 'Cunningham', email: 'suzy.conningham@gmail.com', dob: 323674766, lastloggedin: 1428644366, isFavourite: false, isAdmin: true,  isNonAdmin: false, isArchieved: false},
			{id: 2, profile: 'src/images/icons/img-user.jpeg', firstname: 'Bobby', lastname: 'Daniels',    email: 'bobbyD@outlook.com',        dob: 229585166, lastloggedin: 1465623566, isFavourite: false, isAdmin: true,  isNonAdmin: false, isArchieved: false},
			{id: 3, profile: 'src/images/icons/img-user.jpeg', firstname: 'John',  lastname: 'Walker',     email: 'johnnyWalker@blue.com',     dob: 453965966, lastloggedin: 1484113166, isFavourite: true,  isAdmin: false, isNonAdmin: true,  isArchieved: true },
			{id: 4, profile: 'src/images/icons/img-user.jpeg', firstname: 'Eddy',  lastname: 'Stevens',    email: 'eStevens@yahoo.com',        dob: 411975566, lastloggedin: 1515044366, isFavourite: true,  isAdmin: false, isNonAdmin: true,  isArchieved: true },
			{id: 5, profile: 'src/images/icons/img-user.jpeg', firstname: 'Jan',   lastname: 'Williams',   email: 'jDubz@msn.com',             dob: 682493966, lastloggedin: 1522820366, isFavourite: false, isAdmin: false, isNonAdmin: true,  isArchieved: false}
		];
	}

	loadUsers();

	var UsersService = {
		getUserFilters: function() {
			return _filters;
		},

		getAllUsers: function() {
			return _users;
		},

		resetUsers: function() {
			_users = [];
		},

		reloadUsers: function() {
			this.resetUsers();
			this.loadUsers();
		}
	};

	return UsersService;
});
