config.backstageTasks.push("manageMembers");
merge(config.tasks,{manageMembers:{text: 'members',tooltip: 'click to manage users who control this space',content: '<<manageMembers>>'}});
config.backstageTasks.push("manageSubscriptions");
merge(config.tasks,{manageSubscriptions:{text: 'subscriptions',tooltip: 'click to manage this space\'s subscriptions',content: '<<manageSubscriptions>>'}});
