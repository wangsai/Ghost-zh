import PaginationRouteMixin from 'ghost/mixins/pagination-route';
import styleBody from 'ghost/mixins/style-body';

var paginationSettings = {
    page: 1,
    limit: 20,
    status: 'active'
};

var UsersIndexRoute = Ember.Route.extend(SimpleAuth.AuthenticatedRouteMixin, styleBody, PaginationRouteMixin, {
    classNames: ['settings-view-users'],

    setupController: function (controller, model) {
        this._super(controller, model);
        this.setupPagination(paginationSettings);
    },

    model: function () {
        var self = this;

        return self.store.find('user', {limit: 'all', status: 'invited'}).then(function () {
            return self.store.find('user', 'me').then(function (currentUser) {
                if (currentUser.get('isEditor')) {
                    // Editors only see authors in the list
                    paginationSettings.role = 'Author';
                }

                return self.store.filter('user', paginationSettings, function (user) {
                    if (currentUser.get('isEditor')) {
                        return user.get('isAuthor');
                    }
                    return true;
                });
            });
        });
    },

    actions: {
        reload: function () {
            this.refresh();
        }
    }
});

export default UsersIndexRoute;
