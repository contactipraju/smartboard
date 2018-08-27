'use strict';

app.filter('displayFullname', function() {
	return function (user) {
		return user.firstname + ' ' + user.lastname;
	};
});

app.filter('momentDate', function($window) {
	return function (epoch, relative) {

		if(relative) {
			return $window.moment.unix(epoch).fromNow();
		}

		return $window.moment(epoch*1000).format('ll');
	};
});
