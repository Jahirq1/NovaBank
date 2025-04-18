const menuItems = {
  items: [
    {
      id: 'navigation',
      type: 'group',
      children: [
        {
          id: 'dashboard',
          title: 'Dashboard',
          type: 'item',
          icon: 'feather icon-home',
          url: '/app/dashboard/default'
        },
                {
          id: 'transactions',
          title: 'Transactions',
          type: 'item',
          icon: 'feather icon-credit-card',
          url: '/app/transactions/default'
        },
        {
          id: 'kredia',
          title: 'Kredia',
          type: 'item',
          icon: 'feather icon-file-plus',
          url: '/app/kredia/default'
        },
        {
          id: 'account',
          title: 'User Accounts',
          type: 'item',
          icon: 'feather icon-user-plus',
          url: '/app/account/default'
        }
      ]
    },
    
  ]
};

export default menuItems;
