'use strict';

_.mixin({
    id2ObjectMap: function (list) {
        return _.chain(list)
                .map(function (item) {
                    return [item.id, item];
                })
                .object()
                .value();
    }
});
