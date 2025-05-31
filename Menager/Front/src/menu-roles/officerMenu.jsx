const officerMenu = {
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
            url: '/officer/app/dashboard/default'
          },
                  {
            id: 'transactions',
            title: 'Transactions',
            type: 'item',
            icon: 'feather icon-credit-card',
            url: '/officer/app/transactions/default'
          },
          {
            id: 'kredia',
            title: 'Kredia',
            type: 'item',
            icon: 'feather icon-file-plus',
            url: '/officer/app/kredia/default'
          },
          {
            id: 'account',
            title: 'User Accounts',
            type: 'item',
            icon: 'feather icon-user-plus',
            url: '/officer/app/account/default'
          }
        ]
      },
      
    ]
  };
  
  export default officerMenu;